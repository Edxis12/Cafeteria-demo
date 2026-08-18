import {
    sanitizeText,
    sanitizeEmail,
    sanitizePhone,
    sanitizeUrl,
} from '@/src/lib/sanitizier';

export interface ValidationError {
    field: string;
    message: string;
}

// ==========================================
// 1. VALIDACIÓN & SANITIZACIÓN: RESERVAS
// ==========================================
export function validateAndSanitizeReservation(data: any): {
    isValid: boolean;
    errors: ValidationError[];
    cleanData?: {
        name: string;
        email: string;
        phone: string;
        guests: number;
        reservation_date: string;
        reservation_time: string;
        zone: string;
    };
} {
    const errors: ValidationError[] = [];

    const name = sanitizeText(data?.name);
    const email = sanitizeEmail(data?.email);
    const phone = sanitizePhone(data?.phone);
    const reservation_date = sanitizeText(data?.reservation_date);
    const reservation_time = sanitizeText(data?.reservation_time);
    const rawZone = sanitizeText(data?.zone);

    // 1. Validación explícita de comensales (sin defaults silenciosos)
    const rawGuests = Number(data?.guests);
    if (!data?.guests || isNaN(rawGuests) || !Number.isInteger(rawGuests)) {
        errors.push({ field: 'guests', message: 'El número de comensales debe ser un número entero.' });
    } else if (rawGuests < 1 || rawGuests > 10) {
        errors.push({ field: 'guests', message: 'El número de comensales permitido es de 1 a 10 personas.' });
    }
    const guests = rawGuests;

    // 2. Normalizar Zona Permitida
    const allowedZones: Record<string, string> = {
        salon: 'Salón Principal',
        'salón principal': 'Salón Principal',
        barra: 'Barra de Especialidad',
        'barra de especialidad': 'Barra de Especialidad',
        terraza: 'Terraza Pet-Friendly',
        'terraza pet-friendly': 'Terraza Pet-Friendly',
    };

    const zone = allowedZones[rawZone.toLowerCase()] || 'Salón Principal';

    // 3. Validación de Nombre
    if (!name || name.length < 2 || name.length > 60) {
        errors.push({ field: 'name', message: 'El nombre debe tener entre 2 y 60 caracteres.' });
    }

    // 4. Validación de Email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
        errors.push({ field: 'email', message: 'Correo electrónico con formato inválido.' });
    }

    // 5. Validación de Teléfono (al menos 10 dígitos)
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone || phoneDigits.length < 10 || phoneDigits.length > 15) {
        errors.push({ field: 'phone', message: 'El teléfono debe contener entre 10 y 15 dígitos numéricos.' });
    }

    // 6. Validación de Fecha (robusta contra zonas horarias)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!reservation_date || !dateRegex.test(reservation_date)) {
        errors.push({ field: 'reservation_date', message: 'Formato de fecha inválido (YYYY-MM-DD).' });
    } else {
        const [year, month, day] = reservation_date.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 90);

        if (selectedDate < today) {
            errors.push({ field: 'reservation_date', message: 'No puedes reservar en una fecha pasada.' });
        } else if (selectedDate > maxDate) {
            errors.push({ field: 'reservation_date', message: 'Las reservas solo están disponibles con un máximo de 90 días de anticipación.' });
        }
    }

    // 7. Validación de Hora
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(\s?(AM|PM))?$/i;
    if (!reservation_time || !timeRegex.test(reservation_time)) {
        errors.push({ field: 'reservation_time', message: 'Formato de hora no válido.' });
    }

    return {
        isValid: errors.length === 0,
        errors,
        cleanData:
            errors.length === 0
                ? {
                    name,
                    email,
                    phone,
                    guests,
                    reservation_date,
                    reservation_time,
                    zone,
                }
                : undefined,
    };
}

// ==========================================
// 2. VALIDACIÓN & SANITIZACIÓN: RESEÑAS
// ==========================================
export function validateAndSanitizeReview(data: any): {
    isValid: boolean;
    errors: ValidationError[];
    cleanData?: {
        name: string;
        role: string;
        comment: string;
        stars: number;
        avatar: string;
        is_approved: boolean;
    };
} {
    const errors: ValidationError[] = [];

    const name = sanitizeText(data?.name);
    const role = sanitizeText(data?.role) || 'Cliente Frecuente';
    const comment = sanitizeText(data?.comment);

    // Validación estricta de estrellas (1 a 5)
    const rawStars = Number(data?.stars);
    if (!data?.stars || isNaN(rawStars) || !Number.isInteger(rawStars) || rawStars < 1 || rawStars > 5) {
        errors.push({ field: 'stars', message: 'La calificación debe ser un número entero entre 1 y 5 estrellas.' });
    }
    const stars = rawStars;

    if (!name || name.length < 2 || name.length > 50) {
        errors.push({ field: 'name', message: 'El nombre debe contener entre 2 y 50 caracteres.' });
    }

    if (role.length > 40) {
        errors.push({ field: 'role', message: 'El rol no debe superar los 40 caracteres.' });
    }

    if (!comment || comment.length < 4 || comment.length > 400) {
        errors.push({ field: 'comment', message: 'La reseña debe tener entre 4 y 400 caracteres.' });
    }

    const avatar =
        name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('') || 'CL';

    return {
        isValid: errors.length === 0,
        errors,
        cleanData:
            errors.length === 0
                ? {
                    name,
                    role,
                    comment,
                    stars,
                    avatar,
                    is_approved: false, // Siempre forzado a false para requerir aprobación
                }
                : undefined,
    };
}

// ==========================================
// 3. VALIDACIÓN & SANITIZACIÓN: MENÚ
// ==========================================
export function validateAndSanitizeMenuItem(data: any): {
    isValid: boolean;
    errors: ValidationError[];
    cleanData?: {
        title: string;
        description: string;
        price: number;
        category: string;
        image_url: string;
        is_featured: boolean;
        featured_order: number;
        is_seasonal: boolean;
        badge: string;
    };
} {
    const errors: ValidationError[] = [];

    const title = sanitizeText(data?.title);
    const description = sanitizeText(data?.description);
    const rawCategory = sanitizeText(data?.category).toLowerCase();
    const rawImageUrl = sanitizeUrl(data?.image_url);
    const is_featured = Boolean(data?.is_featured);
    const is_seasonal = Boolean(data?.is_seasonal);
    const badge = sanitizeText(data?.badge) || 'Más Vendido';

    // Validación estricta de precio
    const rawPrice = Number(data?.price);
    if (data?.price === undefined || data?.price === null || isNaN(rawPrice) || rawPrice <= 0 || rawPrice > 10000) {
        errors.push({ field: 'price', message: 'El precio debe ser un número válido mayor a $0.00 y menor a $10,000.00.' });
    }
    const price = rawPrice;

    // Validación de orden para destacados (1 a 3)
    const rawOrder = Number(data?.featured_order);
    const featured_order = !isNaN(rawOrder) && rawOrder >= 1 && rawOrder <= 3 ? rawOrder : 1;

    if (!title || title.length < 2 || title.length > 70) {
        errors.push({ field: 'title', message: 'El título del producto debe tener entre 2 y 70 caracteres.' });
    }

    if (description.length > 300) {
        errors.push({ field: 'description', message: 'La descripción no debe exceder los 300 caracteres.' });
    }

    const validCategories = ['cafes', 'postres', 'especiales'];
    if (!validCategories.includes(rawCategory)) {
        errors.push({ field: 'category', message: 'La categoría seleccionada no es válida (cafes, postres, especiales).' });
    }
    const category = rawCategory;

    const defaultImage =
        'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=600';
    const image_url = rawImageUrl || defaultImage;

    return {
        isValid: errors.length === 0,
        errors,
        cleanData:
            errors.length === 0
                ? {
                    title,
                    description,
                    price,
                    category,
                    image_url,
                    is_featured,
                    featured_order,
                    is_seasonal,
                    badge,
                }
                : undefined,
    };
}