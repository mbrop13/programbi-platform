import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function middleware(request: NextRequest) {
  // Optimización de Active CPU: Si no hay cookies de sesión de Supabase (empiezan con sb-),
  // evitamos inicializar el cliente de Supabase y validar la sesión.
  const hasSession = request.cookies.getAll().some(cookie => cookie.name.startsWith('sb-'))
  
  if (!hasSession) {
    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
