import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { validateAndSanitizeReservation } from '@/src/lib/validations';
import { checkRateLimit } from '@/src/lib/rate-limit';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Función auxiliar de sanitización para prevenir inyecciones HTML en el email
function escapeHtml(text: string): string {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export async function POST(request: NextRequest) {
    // 1. Rate Limiting por IP: 5 reservas cada 15 minutos (900s)
    const rateLimit = checkRateLimit(request, 'reservations_post', {
        limit: 5,
        windowSeconds: 900,
    });

    if (!rateLimit.success) {
        return NextResponse.json(
            {
                error: `Has alcanzado el límite de reservas permitidas. Intenta de nuevo en ${rateLimit.reset} segundos.`,
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

        // 2. Filtro Anti-Bot Honeypot
        if (body.website_hp_check && body.website_hp_check.trim() !== '') {
            return NextResponse.json({ success: true }, { status: 200 });
        }

        // 3. Validación y Sanitización de Campos
        const { isValid, errors, cleanData } = validateAndSanitizeReservation(body);

        if (!isValid || !cleanData) {
            return NextResponse.json(
                { error: 'Los datos de la reserva no son válidos.', details: errors },
                { status: 400 }
            );
        }

        // 4. Inserción Blindada en Base de Datos
        const { data: reservation, error: dbError } = await supabase
            .from('reservations')
            .insert([
                {
                    name: cleanData.name,
                    email: cleanData.email,
                    phone: cleanData.phone,
                    guests: cleanData.guests,
                    reservation_date: cleanData.reservation_date,
                    reservation_time: cleanData.reservation_time,
                    zone: cleanData.zone || 'Salón Principal',
                    status: 'pending',
                },
            ])
            .select('id, name, email, reservation_date, reservation_time, guests, zone, status')
            .single();

        if (dbError || !reservation) {
            return NextResponse.json(
                { error: 'No se pudo registrar la reserva en el sistema. Intenta de nuevo.' },
                { status: 500 }
            );
        }

        // 5. Envío Asíncrono de Confirmación por Correo (Directo en el Servidor)
        try {
            if (process.env.RESEND_API_KEY) {
                const safeName = escapeHtml(reservation.name);
                const safeZone = escapeHtml(reservation.zone || 'Salón Principal');
                const safeDate = escapeHtml(reservation.reservation_date);
                const safeTime = escapeHtml(reservation.reservation_time);
                const safeGuests = reservation.guests;

                await resend.emails.send({
                    from: 'VELVET Roasters <onboarding@resend.dev>', // Cambia por tu dominio verificado en producción
                    to: [reservation.email],
                    subject: `☕ Confirmación de Solicitud de Reserva — VELVET Roasters`,
                    html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #100D0A; color: #F8F5F2; margin: 0; padding: 24px; }
                  .card { max-width: 520px; margin: 0 auto; background-color: #181512; border: 1px solid #2D2620; border-radius: 24px; padding: 36px; }
                  .logo { font-size: 20px; font-weight: 800; letter-spacing: 2px; color: #F8F5F2; margin-bottom: 24px; text-align: center; }
                  .tag { color: #D57E7E; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
                  h1 { font-size: 24px; margin: 8px 0 16px; color: #FFFFFF; }
                  p { font-size: 13px; line-height: 1.6; color: #A39B92; margin: 0 0 16px; }
                  .details { background-color: #100D0A; border: 1px solid #2D2620; border-radius: 16px; padding: 20px; margin: 24px 0; }
                  .row { display: flex; justify-content: space-between; font-size: 12px; padding: 6px 0; border-bottom: 1px solid #1c1815; }
                  .row:last-child { border-bottom: none; }
                  .label { color: #A39B92; }
                  .value { color: #F8F5F2; font-weight: 600; }
                  .footer { text-align: center; font-size: 11px; color: #6e675f; margin-top: 24px; }
                </style>
              </head>
              <body>
                <div class="card">
                  <div class="logo">VELVET <span class="tag">Roasters</span></div>
                  <span class="tag">Solicitud Recibida</span>
                  <h1>¡Hola, ${safeName}!</h1>
                  <p>Hemos recibido tu solicitud de reserva. Nuestro equipo preparará tu mesa para que disfrutes de la mejor experiencia.</p>
                  
                  <div class="details">
                    <div class="row"><span class="label">Ambiente / Zona:</span> <span class="value">${safeZone}</span></div>
                    <div class="row"><span class="label">Fecha:</span> <span class="value">${safeDate}</span></div>
                    <div class="row"><span class="label">Hora:</span> <span class="value">${safeTime}</span></div>
                    <div class="row"><span class="label">Comensales:</span> <span class="value">${safeGuests} personas</span></div>
                  </div>

                  <p style="font-size: 12px; color: #D57E7E;">Si requieres hacer cambios o cancelar tu visita, puedes responder directamente a este correo o contactarnos vía WhatsApp.</p>
                  
                  <div class="footer">
                    VELVET Roasters & Co. • Av. Principal #102, Centro<br/>
                    Apasionados por el café de especialidad.
                  </div>
                </div>
              </body>
            </html>
          `,
                });
            }
        } catch (emailError) {
            // El fallo de correo no detiene la confirmación de la reserva al usuario
            console.error('Error al enviar el email de confirmación:', emailError);
        }

        return NextResponse.json(
            { success: true, reservation },
            {
                status: 201,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'X-RateLimit-Limit': String(rateLimit.limit),
                    'X-RateLimit-Remaining': String(rateLimit.remaining),
                },
            }
        );
    } catch {
        return NextResponse.json(
            { error: 'El formato de los datos enviados no es un JSON válido.' },
            { status: 400 }
        );
    }
}