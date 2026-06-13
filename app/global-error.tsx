'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Error crítico del sistema
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Lo sentimos, ha ocurrido un error grave en la plataforma. Por favor, intenta recargar la página.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-sm transition-all"
            >
              Ir al Inicio
            </button>
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-semibold text-sm transition-all"
            >
              Recargar
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
