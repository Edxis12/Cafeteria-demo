/**
 * Comprime y redimensiona una imagen en memoria usando un Canvas HTML5 antes de subirla.
 */
async function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<Blob> {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/') || typeof window === 'undefined') {
            return resolve(file);
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return resolve(file);
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            return resolve(file);
                        }
                        resolve(blob);
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = () => resolve(file);
        };

        reader.onerror = (error) => reject(error);
    });
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error('Faltan las variables de entorno de Cloudinary.');
    }

    // 1. Validación de tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
        throw new Error('Formato de imagen inválido. Solo se admiten JPG, PNG, WebP o AVIF.');
    }

    // 2. Validación de tamaño límite (máximo 8 MB original)
    const MAX_SIZE_MB = 8;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        throw new Error(`La imagen supera el límite de ${MAX_SIZE_MB}MB.`);
    }

    // 3. Compresión en el cliente
    const optimizedBlob = await compressImage(file);

    const formData = new FormData();
    formData.append('file', optimizedBlob, file.name.replace(/\.[^/.]+$/, '') + '.webp');
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'velvet_menu');

    // 4. Timeout con AbortController (20s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Error al subir la imagen a Cloudinary');
        }

        const data = await response.json();

        // 5. Inyección de transformaciones de entrega
        const secureUrl = data.secure_url as string;
        const optimizedUrl = secureUrl.replace(
            /\/upload\/(?:v\d+\/)?/,
            '/upload/q_auto,f_auto,w_800/'
        );

        return optimizedUrl;
    } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('La subida de imagen tardó demasiado. Revisa tu conexión a internet.');
        }
        throw error;
    }
}