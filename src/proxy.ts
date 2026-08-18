import { NextResponse, type NextRequest } from 'next/server';

// Lista de dominios permitidos (desarrollo, red local y producción)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.1.71:3000',
  'https://velvet-roasters.vercel.app',
];

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  // Si no es ruta de API, dejamos pasar de inmediato
  if (!isApiRoute) {
    return NextResponse.next();
  }

  const isAllowedOrigin = origin ? allowedOrigins.includes(origin) : true;

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