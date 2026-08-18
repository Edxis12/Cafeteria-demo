import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { validateAndSanitizeMenuItem } from '@/src/lib/validations';
import { checkRateLimit } from '@/src/lib/rate-limit';

// =========================================================================
// 1. OBTENER CATÁLOGO (PÚBLICO CON RATE LIMIT)
// =========================================================================
export async function GET(request: NextRequest) {
    const rateLimit = checkRateLimit(request, 'menu_public_get', {
        limit: 100,
        windowSeconds: 60,
    });

    if (!rateLimit.success) {
        return NextResponse.json(
            { error: 'Demasiadas solicitudes. Por favor, intenta de nuevo en un minuto.' },
            { status: 429 }
        );
    }

    const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json(
            { error: 'Error al obtener los platillos del catálogo.' },
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
// 2. REGISTRAR PRODUCTO (ADMINISTRATIVO)
// =========================================================================
export async function POST(request: NextRequest) {
    // 1. Rate Limit Administrativo
    const rateLimit = checkRateLimit(request, 'menu_admin_post', {
        limit: 20,
        windowSeconds: 60,
    });

    if (!rateLimit.success) {
        return NextResponse.json(
            { error: 'Límite de peticiones excedido en el panel de catálogo. Espera un momento.' },
            { status: 429 }
        );
    }

    try {
        // 2. Validación estricta del encabezado de Autorización
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Formato de autorización no válido o ausente.' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7).trim();
        if (!token) {
            return NextResponse.json({ error: 'Token de acceso ausente.' }, { status: 401 });
        }

        // 3. Verificación de identidad con Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Sesión expirada o credenciales no válidas.' },
                { status: 401 }
            );
        }

        // 4. Parseo y Validación de Datos de Entrada
        const body = await request.json();
        const { isValid, errors, cleanData } = validateAndSanitizeMenuItem(body);

        if (!isValid || !cleanData) {
            return NextResponse.json(
                { error: 'Datos de producto no válidos.', details: errors },
                { status: 400 }
            );
        }

        // 5. Inserción Segura
        const { data, error: dbError } = await supabase
            .from('menu_items')
            .insert([cleanData])
            .select()
            .single();

        if (dbError) {
            return NextResponse.json(
                { error: 'Error al registrar el producto en la base de datos.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, item: data },
            {
                status: 201,
                headers: { 'Cache-Control': 'no-store' },
            }
        );
    } catch {
        return NextResponse.json(
            { error: 'El cuerpo de la solicitud no contiene un JSON válido.' },
            { status: 400 }
        );
    }
}