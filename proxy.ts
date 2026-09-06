import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

const BAD_BOT_UA_REGEX = /bytespider|petalbot|mj12bot|zgrab|sqlmap|python-requests|go-http-client|scrapy|nikto|curl\/7\.\d+|wget/i;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''
  const host = request.headers.get('host') || ''

  // Canonical host: apex → www (previews and localhost untouched).
  if (host === 'programbi.com') {
    const url = request.nextUrl.clone()
    url.protocol = 'https'
    url.host = 'www.programbi.com'
    return NextResponse.redirect(url, 308)
  }

  // Legacy locale prefixes (/es, /en) from the old Maverlang merge — strip and redirect.
  // Language is controlled only from user settings, not the URL.
  const localeMatch = pathname.match(/^\/(es|en)(\/.*)?$/)
  if (localeMatch) {
    const rest = localeMatch[2] || '/'
    const cleanPath = rest === '' ? '/' : rest
    const url = request.nextUrl.clone()
    url.pathname = cleanPath
    return NextResponse.redirect(url)
  }

  // Bloqueo inmediato en Edge de bots agresivos en rutas sensibles (auth/registro/api)
  if (BAD_BOT_UA_REGEX.test(userAgent) && (pathname.startsWith('/registro') || pathname.startsWith('/login') || pathname.startsWith('/api'))) {
    return new NextResponse('Access Denied', { status: 403 })
  }

  // Optimización de Active CPU: Si no hay cookies de sesión de Supabase (empiezan con sb-),
  // evitamos inicializar el cliente de Supabase y validar la sesión.
  const hasSession = request.cookies.getAll().some(cookie => cookie.name.startsWith('sb-'))
  
  // Landing pública de comunidad; el resto del portal y admin requieren sesión
  const isComunidadLanding =
    pathname === '/comunidad' || pathname === '/comunidad/'
  if (
    !hasSession &&
    ((pathname.startsWith('/comunidad') && !isComunidadLanding) ||
      pathname.startsWith('/admin'))
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!hasSession) {
    return NextResponse.next()
  }

  // Rutas que requieren refresco y validación activa de sesión de Supabase en el servidor:
  // /comunidad/*, /admin/*, /login, /registro, /pago, /auth/*
  const requiresSessionUpdate =
    (pathname.startsWith('/comunidad') && !isComunidadLanding) ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/registro') ||
    pathname.startsWith('/pago') ||
    pathname.startsWith('/auth');

  if (!requiresSessionUpdate) {
    // Para rutas públicas de marketing (home, cursos, blog, empresas, etc.), dejamos pasar
    // la petición de inmediato con TTFB mínimo. El Navbar y componentes de cliente leen
    // la sesión asíncronamente desde el cliente sin bloquear la entrega de la página.
    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (api routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (svg, png, jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
