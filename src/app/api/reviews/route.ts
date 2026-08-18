import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { validateAndSanitizeReview } from '@/src/lib/validations';
import { checkRateLimit } from '@/src/lib/rate-limit';

// =========================================================================
// 1. OBTENER RESEÑAS PÚBLICAS (SOLO APROBADAS)
// =========================================================================
export async function GET(request: NextRequest) {
    const rateLimit = checkRateLimit(request, 'reviews_public_get', {
        limit: 60,
        windowSeconds: 60,
    });

    if (!rateLimit.success) {
        return NextResponse.json(
            { error: 'Demasiadas peticiones. Intenta de nuevo en un minuto.' },
            { status: 429 }
        );
    }

    const { data, error } = await supabase
        .from('reviews')
        .select('id, name, role, comment, stars, avatar, created_at')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json(
            { error: 'Error al obtener las reseñas públicas.' },
            { status: 500 }
        );
    }

    return NextResponse.json(data, {
        status: 200,
        headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
    });
}

// =========================================================================
// 2. ENVIAR NUEVA RESEÑA (PÚBLICO CON MODERACIÓN OBLIGATORIA)
// =========================================================================
export async function POST(request: NextRequest) {
    // 1. Rate Limiting por IP: 3 reseñas cada 30 minutos (1800s)
    const rateLimit = checkRateLimit(request, 'reviews_post', {
        limit: 3,
        windowSeconds: 1800,
    });

    if (!rateLimit.success) {
        return NextResponse.json(
            {
                error: `Demasiadas reseñas enviadas. Por favor espera ${Math.ceil(
                    rateLimit.reset / 60
                )} minutos antes de enviar otra.`,
            },
            {
                status: 429,
                headers: {
                    'Retry-After': String(rateLimit.reset),
                    'X-RateLimit-Limit': String(rateLimit.limit),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(rateLimit.reset),
                },
            }
        );
    }

    try {
        const body = await request.json();

        // 2. Filtro Anti-Bot Honeypot (campo oculto trampa)
        if (body.website_hp_check && body.website_hp_check.trim() !== '') {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        // 3. Validación y Sanitización
        const { isValid, errors, cleanData } = validateAndSanitizeReview(body);

        if (!isValid || !cleanData) {
            return NextResponse.json(
                { error: 'Los datos de la reseña no son válidos.', details: errors },
                { status: 400 }
            );
        }

        // 4. Inserción Segura: is_approved forzado a FALSE en el servidor
        const { data, error: dbError } = await supabase
            .from('reviews')
            .insert([
                {
                    name: cleanData.name,
                    role: cleanData.role || 'Cliente Frecuente',
                    comment: cleanData.comment,
                    stars: Math.min(Math.max(Number(cleanData.stars) || 5, 1), 5), // Garantiza rango 1-5
                    avatar: cleanData.avatar || cleanData.name.slice(0, 2).toUpperCase(),
                    is_approved: false, // OBLIGATORIO: requiere aprobación manual del admin
                },
            ])
            .select('id, name, comment, stars, is_approved, created_at')
            .single();

        if (dbError) {
            return NextResponse.json(
                { error: 'No se pudo guardar la reseña. Intenta más tarde.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Tu reseña fue enviada con éxito y está pendiente de moderación.',
                review: data,
            },
            {
                status: 201,
                headers: {
                    'Cache-Control': 'no-store',
                    'X-RateLimit-Limit': String(rateLimit.limit),
                    'X-RateLimit-Remaining': String(rateLimit.remaining),
                },
            }
        );
    } catch {
        return NextResponse.json(
            { error: 'El cuerpo de la solicitud no contiene un JSON válido.' },
            { status: 400 }
        );
    }
}