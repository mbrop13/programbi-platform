import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
import { normalizeReferralCode, referralCookieOptions } from '@/lib/referrals/cookie'

const BAD_BOT_UA_REGEX = /bytespider|petalbot|mj12bot|zgrab|sqlmap|python-requests|go-http-client|scrapy|nikto|curl\/7\.\d+|wget/i;

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

/** Emite `X-Robots-Tag: noindex, nofollow` en rutas privadas o transaccionales no indexables. */
function attachRobotsHeader(pathname: string, response: NextResponse) {
  if (
    pathname === '/pago' ||
    /^\/[a-z]{2}\/pago$/i.test(pathname) ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/referidos/app') ||
    pathname.startsWith('/referidos/admin')
  ) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }
  return response
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''
  const finalize = (response: NextResponse) =>
    attachRobotsHeader(pathname, attachReferralCookie(request, response))

  // Apex → www is the single 301 in vercel.json. Do not redirect here too.

  // /cl no es una carpeta: Chile vive en la raíz. Evita una copia indexable.
  if (pathname === "/cl" || pathname.startsWith("/cl/")) {
    const url = request.nextUrl.clone()
    const rest = pathname.slice(3)
    url.pathname = rest === "" ? "/" : rest
    return finalize(NextResponse.redirect(url, 301))
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
    return finalize(NextResponse.redirect(url, 301))
  }

  // Bloqueo inmediato en Edge de bots agresivos en rutas sensibles (auth/registro/api)
  if (BAD_BOT_UA_REGEX.test(userAgent) && (pathname.startsWith('/registro') || pathname.startsWith('/login') || pathname.startsWith('/api'))) {
    return finalize(new NextResponse('Access Denied', { status: 403 }))
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
    return finalize(NextResponse.redirect(new URL('/login', request.url)))
  }
  if (!hasSession && isReferidosApp) {
    const login = new URL('/login', request.url)
    login.searchParams.set('next', pathname)
    return finalize(NextResponse.redirect(login))
  }

  if (!hasSession) {
    return finalize(NextResponse.next())
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
    return finalize(NextResponse.next())
  }

  const sessionRes = await updateSession(request)
  return finalize(sessionRes)
}

export const config = {
  matcher: [
    /*
     * El middleware solo corre donde hace falta (auth, sesión, 301 de /cl y /es|/en):
     * - api (incluye /api/og) y _next/* (static, image, data y prefetch RSC)
     * - /og (imagen social) y las rutas de metadata: robots.txt, sitemap.xml, llms*.txt
     * - assets públicos por extensión: ico (favicon incluido), png, jpg, jpeg, webp,
     *   avif, svg, gif, woff, woff2, ttf, pdf, mp4, xml, txt, js, css, map, json
     * Lo descartado aquí no lleva sesión de Supabase ni cookie geo, así que no gasta
     * Fluid Active CPU ni invocaciones de función.
     */
    '/((?!api|_next|og|robots\\.txt$|sitemap\\.xml$|llms.*\\.txt$|.*\\.(?:ico|png|jpg|jpeg|webp|avif|svg|gif|woff|woff2|ttf|pdf|mp4|xml|txt|js|css|map|json)$).*)',
  ],
}
