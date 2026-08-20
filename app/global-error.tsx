"use client";

import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import StatusPage from "@/components/shared/StatusPage";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
});

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh bg-canvas text-ink font-sans antialiased">
        <StatusPage
          code="500"
          title="Algo falló en la plataforma"
          description="Recarga la página. Si sigue igual, vuelve al inicio e inténtalo de nuevo."
          actions={
            <>
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-base font-semibold text-canvas transition-transform active:scale-[0.98]"
              >
                Recargar
              </button>
              <a
                href="/"
                className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-base font-medium text-ink no-underline transition-colors hover:bg-wash active:scale-[0.98]"
              >
                Ir al inicio
              </a>
            </>
          }
        />
      </body>
    </html>
  );
}
