import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
import NotFoundPage from "@/components/shared/NotFoundPage";
import { SITE_URL } from "@/lib/seo";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Página no encontrada | ProgramBI",
  robots: { index: false, follow: false },
};

/**
 * 404 global de la aplicación.
 * Se usa cuando la URL no existe: no hay layout raíz que la envuelva, así que
 * este archivo trae su propio documento HTML.
 */
export default function GlobalNotFound() {
  return (
    <html lang="es-CL" className={geist.variable}>
      <body className="min-h-dvh bg-canvas text-ink font-sans antialiased">
        <main className="mx-auto max-w-3xl px-5 py-20">
          <NotFoundPage />
        </main>
      </body>
    </html>
  );
}
