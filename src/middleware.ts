import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de Ciberseguridad Surtidor Dally SRL (Estándar OWASP ZAP)
 * - Security Headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
 * - Explicit CORS handling
 * - Cache-Control & Pragma para endpoints sensibles y API
 * - Remoción de firmas de servidor (X-Powered-By, Server)
 */
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // Determinar origen permitido de manera explícita (evita wildcard '*' indiscriminado)
  const isAllowedOrigin = origin && (
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    (host && origin.includes(host))
  );
  const allowedOriginHeader = isAllowedOrigin ? origin : (host ? `http://${host}` : '*');

  // Preflight CORS response (OPTIONS)
  if (request.method === 'OPTIONS') {
    const preflightResponse = new NextResponse(null, { status: 204 });
    preflightResponse.headers.set('Access-Control-Allow-Origin', allowedOriginHeader);
    preflightResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    preflightResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    preflightResponse.headers.set('Access-Control-Allow-Credentials', 'true');
    preflightResponse.headers.set('Access-Control-Max-Age', '86400');
    return preflightResponse;
  }

  const response = NextResponse.next();

  // 1. Security Headers (OWASP ZAP Compliance)
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // CSP Estricto pero Funcional
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  response.headers.set('Content-Security-Policy', cspHeader);

  // 2. CORS explícito para peticiones API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', allowedOriginHeader);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    // 3. Directivas de Cache-Control y Pragma estrictas para datos sensibles en API
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // 4. Eliminación de firmas del servidor (Information Leakage Mitigation)
  response.headers.delete('X-Powered-By');
  response.headers.delete('Server');

  return response;
}

export const config = {
  matcher: [
    /*
     * Intercepta todas las rutas excepto archivos estáticos (imágenes, css, js)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
