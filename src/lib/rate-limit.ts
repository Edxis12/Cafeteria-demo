import type { NextRequest } from 'next/server';

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

// Almacén en memoria por clave (endpoint + IP)
const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_MAP_ENTRIES = 10000;

export interface RateLimitConfig {
    /** Número máximo de peticiones permitidas en la ventana */
    limit: number;
    /** Duración de la ventana en segundos */
    windowSeconds: number;
}

export interface RateLimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

/**
 * Obtiene la dirección IP real del cliente priorizando cabeceras de Vercel y Cloudflare
 */
export function getClientIp(request: NextRequest): string {
    // 1. Cabecera nativa de Vercel
    const vercelIp = request.headers.get('x-vercel-forwarded-for');
    if (vercelIp) {
        return vercelIp.split(',')[0].trim();
    }

    // 2. Cabecera de Cloudflare
    const cfIp = request.headers.get('cf-connecting-ip');
    if (cfIp) {
        return cfIp.trim();
    }

    // 3. Cabecera X-Forwarded-For estándar
    const xForwardedFor = request.headers.get('x-forwarded-for');
    if (xForwardedFor) {
        return xForwardedFor.split(',')[0].trim();
    }

    // 4. Cabecera X-Real-IP
    const xRealIp = request.headers.get('x-real-ip');
    if (xRealIp) {
        return xRealIp.trim();
    }

    return '127.0.0.1';
}

/**
 * Limpieza pasiva de registros antiguos para no depender de setInterval en Serverless
 */
function cleanupExpiredEntries(now: number) {
    if (rateLimitMap.size > MAX_MAP_ENTRIES) {
        for (const [k, v] of rateLimitMap.entries()) {
            if (now > v.resetTime) {
                rateLimitMap.delete(k);
            }
        }
        // Si aún supera el límite tras purgar expirados, limpiamos la mitad más antigua
        if (rateLimitMap.size > MAX_MAP_ENTRIES) {
            let count = 0;
            for (const k of rateLimitMap.keys()) {
                rateLimitMap.delete(k);
                count++;
                if (count > MAX_MAP_ENTRIES / 2) break;
            }
        }
    }
}

/**
 * Evalúa y aplica el límite de peticiones para una IP y endpoint específicos
 */
export function checkRateLimit(
    request: NextRequest,
    endpointKey: string,
    config: RateLimitConfig
): RateLimitResult {
    const ip = getClientIp(request);
    const key = `${endpointKey}:${ip}`;
    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;

    cleanupExpiredEntries(now);

    const currentRecord = rateLimitMap.get(key);

    if (!currentRecord || now > currentRecord.resetTime) {
        // Primera petición en la nueva ventana
        const newRecord: RateLimitRecord = {
            count: 1,
            resetTime: now + windowMs,
        };
        rateLimitMap.set(key, newRecord);

        return {
            success: true,
            limit: config.limit,
            remaining: Math.max(config.limit - 1, 0),
            reset: Math.ceil(windowMs / 1000),
        };
    }

    // Si ya superó el límite
    if (currentRecord.count >= config.limit) {
        const secondsUntilReset = Math.ceil((currentRecord.resetTime - now) / 1000);
        return {
            success: false,
            limit: config.limit,
            remaining: 0,
            reset: Math.max(secondsUntilReset, 1),
        };
    }

    // Incrementar contador
    currentRecord.count += 1;
    const remaining = config.limit - currentRecord.count;
    const secondsUntilReset = Math.ceil((currentRecord.resetTime - now) / 1000);

    return {
        success: true,
        limit: config.limit,
        remaining: Math.max(remaining, 0),
        reset: Math.max(secondsUntilReset, 1),
    };
}