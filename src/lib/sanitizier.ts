/**
 * Sanitizador centralizado y optimizado para datos de entrada en backend
 */

// 1. Diccionario precompilado de entidades HTML (O(1) lookup)
const HTML_ENTITIES: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
};

// 2. Expresiones regulares precompiladas a nivel de módulo
const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const HTML_ESCAPE_REGEX = /[<>"'`]/g;
const MULTI_SPACE_REGEX = /\s+/g;
const EMAIL_CLEAN_REGEX = /[^a-z0-9._%+-@]/g;
const PHONE_CLEAN_REGEX = /[^\d+]/g;

// 1. Sanitizar texto general en pasadas mínimas (Nombres, Comentarios, Descripciones, Títulos)
export function sanitizeText(val: unknown): string {
    if (typeof val !== 'string') return '';

    const trimmed = val.trim();
    if (!trimmed) return '';

    return trimmed
        // Elimina bytes nulos y caracteres de control
        .replace(CONTROL_CHARS_REGEX, '')
        // Reemplaza <, >, ", ', ` en un único escaneo de O(n)
        .replace(HTML_ESCAPE_REGEX, (char) => HTML_ENTITIES[char] || char)
        // Compacta espacios múltiples
        .replace(MULTI_SPACE_REGEX, ' ');
}

// 2. Sanitizar Correo Electrónico
export function sanitizeEmail(val: unknown): string {
    if (typeof val !== 'string') return '';
    const trimmed = val.trim();
    if (!trimmed) return '';

    return trimmed.toLowerCase().replace(EMAIL_CLEAN_REGEX, '');
}

// 3. Sanitizar Teléfono (Conserva únicamente dígitos y el prefijo +)
export function sanitizePhone(val: unknown): string {
    if (typeof val !== 'string') return '';
    const trimmed = val.trim();
    if (!trimmed) return '';

    return trimmed.replace(PHONE_CLEAN_REGEX, '');
}

// 4. Sanitizar URLs (Imágenes y enlaces externos)
export function sanitizeUrl(val: unknown): string {
    if (typeof val !== 'string') return '';
    const url = val.trim();
    if (!url) return '';

    try {
        const parsed = new URL(url);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return parsed.toString();
        }
        return '';
    } catch {
        return '';
    }
}

// 5. Sanitizar Enteros dentro de un rango
export function sanitizeInteger(val: unknown, min: number, max: number, defaultValue: number): number {
    const num = Number(val);
    if (isNaN(num) || !Number.isInteger(num)) return defaultValue;
    return Math.min(Math.max(num, min), max);
}

// 6. Sanitizar Flotantes (Precios)
export function sanitizeFloat(val: unknown, min: number, max: number, defaultValue: number): number {
    const num = Number(val);
    if (isNaN(num)) return defaultValue;
    const clamped = Math.min(Math.max(num, min), max);
    return parseFloat(clamped.toFixed(2));
}