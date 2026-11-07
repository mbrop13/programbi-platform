import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
import { normalizeReferralCode, referralCookieOptions } from '@/lib/referrals/cookie'

const BAD_BOT_UA_REGEX = /bytespider|petalbot|mj12bot|zgrab|sqlmap|python-requests|go-http-client|scrapy|nikto|curl\/7\.\d+|wget/i;

/** País de la IP que inyecta Vercel; la lee el cliente para horarios y moneda. */
const GEO_COOKIE = 'pb_geo_country'
const GEO_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

function attachReferralCookie(request: NextRequest, response: NextResponse) {
  const code = normalizeReferralCode(request.nextUrl.searchParams.get('ref'))
  if (!code) return response
  const opts = referralCookieOptions()
  response.cookies.set(opts.name, code, {
    maxAge: opts.maxAge,
    path: opts.path,
    sameSite: opts.sameSite,
    secure: opts.secure,
    httpOnly: false,
  })
  return response
}

/** Deja `pb_geo_country` (ISO en minúsculas) si Vercel informó un país válido. */
function attachGeoCookie(request: NextRequest, response: NextResponse) {
  const country = (request.headers.get('x-vercel-ip-country') || '').trim()
  if (!/^[A-Za-z]{2}$/.test(country)) return response
  response.cookies.set(GEO_COOKIE, country.toLowerCase(), {
    httpOnly: false,
    path: '/',
    maxAge: GEO_COOKIE_MAX_AGE,
    sameSite: 'lax',
  })
  return response
}

/** Aplica a cualquier respuesta (next, redirect o sesión) la cookie geo y la de referidos. */
function attachCookies(request: NextRequest, response: NextResponse) {
  return attachReferralCookie(request, attachGeoCookie(request, response))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''

  // Apex → www is the single 301 in vercel.json. Do not redirect here too.

  // /cl no es una carpeta: Chile vive en la raíz. Evita una copia indexable.
  if (pathname === "/cl" || pathname.startsWith("/cl/")) {
    const url = request.nextUrl.clone()
    const rest = pathname.slice(3)
    url.pathname = rest === "" ? "/" : rest
    return attachCookies(request, NextResponse.redirect(url, 301))
  }

  // Legacy locale prefixes (/es, /en) from the old Maverlang merge — strip and redirect.
  // Language is controlled only from user settings, not the URL.
  // 301 (permanente): el prefijo /es ya no vuelve, no es una redirección temporal.
  const localeMatch = pathname.match(/^\/(es|en)(\/.*)?$/)
  if (localeMatch) {
    const rest = localeMatch[2] || '/'
    const cleanPath = rest === '' ? '/' : rest
    const url = request.nextUrl.clone()
    url.pathname = cleanPath
    return attachCookies(request, NextResponse.redirect(url, 301))
  }

  // Bloqueo inmediato en Edge de bots agresivos en rutas sensibles (auth/registro/api)
  if (BAD_BOT_UA_REGEX.test(userAgent) && (pathname.startsWith('/registro') || pathname.startsWith('/login') || pathname.startsWith('/api'))) {
    return attachCookies(request, new NextResponse('Access Denied', { status: 403 }))
  }

  // Optimización de Active CPU: Si no hay cookies de sesión de Supabase (empiezan con sb-),
  // evitamos inicializar el cliente de Supabase y validar la sesión.
  const hasSession = request.cookies.getAll().some(cookie => cookie.name.startsWith('sb-'))

  // Landing pública de comunidad; el resto del portal y admin requieren sesión
  const isComunidadLanding =
    pathname === '/comunidad' || pathname === '/comunidad/'
  const isReferidosApp =
    pathname.startsWith('/referidos/app') || pathname.startsWith('/referidos/admin')
  if (
    !hasSession &&
    ((pathname.startsWith('/comunidad') && !isComunidadLanding) ||
      pathname.startsWith('/admin'))
  ) {
    return attachCookies(request, NextResponse.redirect(new URL('/login', request.url)))
  }
  if (!hasSession && isReferidosApp) {
    const login = new URL('/login', request.url)
    login.searchParams.set('next', pathname)
    return attachCookies(request, NextResponse.redirect(login))
  }

  if (!hasSession) {
    return attachCookies(request, NextResponse.next())
  }

  // Rutas que requieren refresco y validación activa de sesión de Supabase en el servidor:
  // /comunidad/*, /admin/*, /login, /registro, /pago, /auth/*, /referidos/app|admin
  const requiresSessionUpdate =
    (pathname.startsWith('/comunidad') && !isComunidadLanding) ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/registro') ||
    pathname.startsWith('/pago') ||
    pathname.startsWith('/auth') ||
    isReferidosApp;

  if (!requiresSessionUpdate) {
    // Para rutas públicas de marketing (home, cursos, blog, empresas, etc.), dejamos pasar
    // la petición de inmediato con TTFB mínimo. El Navbar y componentes de cliente leen
    // la sesión asíncronamente desde el cliente sin bloquear la entrega de la página.
    return attachCookies(request, NextResponse.next())
  }

  const sessionRes = await updateSession(request)
  return attachCookies(request, sessionRes)
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
