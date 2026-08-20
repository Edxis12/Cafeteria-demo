import { NextResponse, type NextRequest } from 'next/server';

// Lista de dominios permitidos base
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.1.71:3000',
  'https://cafeteria-demo-rz7x.vercel.app',
  'https://velvet-roasters.vercel.app',
  process.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[];

function checkOriginAllowed(origin: string | null, host: string | null): boolean {
  // Peticiones directas, del mismo servidor o internas
  if (!origin) return true;

  // Lista explícita
  if (allowedOrigins.includes(origin)) return true;

  // Cualquier despliegue o preview en Vercel (*.vercel.app)
  if (origin.endsWith('.vercel.app')) return true;

  // Si el host coincide con el origin
  if (host && origin.includes(host)) return true;

  return false;
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // Si no es ruta de API, dejamos pasar de inmediato
  if (!isApiRoute) {
    return NextResponse.next();
  }

  const isAllowedOrigin = checkOriginAllowed(origin, host);

  // 1. Manejo de Preflight Requests (OPTIONS)
  if (request.method === 'OPTIONS') {
    if (origin && !isAllowedOrigin) {
      return new NextResponse(
        JSON.stringify({ error: 'CORS policy: Origen no permitido' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = new NextResponse(null, { status: 204 });

    if (origin && isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With'
      );
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    return response;
  }

  // 2. Bloqueo de peticiones Cross-Origin no autorizadas
  if (origin && !isAllowedOrigin) {
    return new NextResponse(
      JSON.stringify({ error: 'CORS policy: Origen no permitido' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // 3. Petición permitida: Adjuntar cabeceras CORS
  const response = NextResponse.next();

  if (origin && isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With'
    );
  }

  return response;
}

// Aplicar únicamente a las rutas API
export const config = {
  matcher: '/api/:path*',
};