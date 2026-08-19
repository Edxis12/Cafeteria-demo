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
        console.error('Error en GET /api/reviews:', error);
        return NextResponse.json(
            { error: 'Error al obtener las reseñas públicas.', details: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(data || [], {
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
    const rateLimit = checkRateLimit(request, 'reviews_post', {
        limit: 5,
        windowSeconds: 1800,
    });

    if (!rateLimit.success) {
        return NextResponse.json(
            {
                error: `Demasiadas reseñas enviadas. Por favor espera ${Math.ceil(
                    rateLimit.reset / 60
                )} minutos antes de enviar otra.`,
            },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();

        // Anti-Bot Honeypot
        if (body.website_hp_check && body.website_hp_check.trim() !== '') {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        // Validación y Sanitización
        const { isValid, errors, cleanData } = validateAndSanitizeReview(body);

        if (!isValid || !cleanData) {
            return NextResponse.json(
                { error: 'Los datos de la reseña no son válidos.', details: errors },
                { status: 400 }
            );
        }

        // Inserción sin forzar .single() para evitar conflicto de RLS
        const { error: dbError } = await supabase
            .from('reviews')
            .insert([
                {
                    name: cleanData.name,
                    role: cleanData.role || 'Cliente Frecuente',
                    comment: cleanData.comment,
                    stars: Math.min(Math.max(Number(cleanData.stars) || 5, 1), 5),
                    avatar: cleanData.avatar || cleanData.name.slice(0, 2).toUpperCase(),
                    is_approved: false,
                },
            ]);

        if (dbError) {
            console.error('Error en POST /api/reviews:', dbError);
            return NextResponse.json(
                { error: 'No se pudo guardar la reseña.', details: dbError.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Tu reseña fue enviada con éxito y está pendiente de moderación.',
            },
            { status: 201 }
        );
    } catch (err: unknown) {
        console.error('Error general en POST /api/reviews:', err);
        return NextResponse.json(
            { error: 'Error procesando la solicitud en el servidor.' },
            { status: 500 }
        );
    }
}