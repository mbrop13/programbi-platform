"use client";

import ErrorPage from "@/components/shared/ErrorPage";

/**
 * Red de seguridad del segmento /newsletter: un fallo inesperado de datos o de
 * render se muestra como página de error con reintento, no como 500 en crudo.
 */
export default function NewsletterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPage error={error} reset={reset} />;
}
