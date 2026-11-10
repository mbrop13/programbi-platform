import type { Metadata } from "next";
import Link from "next/link";
import { DiagnosticoMadurez } from "@/components/empresas/DiagnosticoMadurez";
import { absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOg } from "@/lib/seo";

const PATH = "/empresas/diagnostico";
const TITULO = "Diagnóstico de madurez de datos para empresas | ProgramBI";
const DESCRIPCION =
  "Diez preguntas sobre fuentes, reportes, Power BI, SQL y automatización. Al final ves el nivel de madurez de tu empresa, las brechas y qué reforzar.";

const compartir = pageOg({
  title: TITULO,
  description: DESCRIPCION,
  path: PATH,
  kicker: "Herramienta gratis",
  tags: ["Diagnóstico", "Power BI", "Empresas"],
  alt: "Diagnóstico de madurez de datos para empresas — ProgramBI",
});

export const metadata: Metadata = {
  title: { absolute: TITULO },
  description: DESCRIPCION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: absoluteUrl(PATH),
    type: "website",
    siteName: "ProgramBI",
    locale: "es_CL",
    images: compartir.images,
  },
  twitter: compartir.twitter,
};

export default function DiagnosticoPage() {
  // Mismo helper de breadcrumb que el resto de las páginas de marketing.
  const jsonLd = breadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Empresas", path: "/empresas" },
    { name: "Diagnóstico", path: PATH },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="bg-canvas text-ink">
        <section className="border-b border-line">
          <div className="mx-auto max-w-[1400px] px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:pt-8">
            <nav
              aria-label="Ruta de navegación"
              className="flex flex-wrap items-center gap-2 text-xs font-semibold text-faint"
            >
              <Link
                href="/"
                className="text-mute no-underline transition-colors hover:text-ink"
              >
                Inicio
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/empresas"
                className="text-mute no-underline transition-colors hover:text-ink"
              >
                Empresas
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink">Diagnóstico</span>
            </nav>

            <div className="mt-8 max-w-3xl">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
                Herramienta gratis · 2 minutos
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                ¿Qué tan maduro es el uso de datos en tu empresa?
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
                Diez preguntas sobre fuentes, reportes y herramientas. Al final
                ves el nivel de madurez, las brechas por área y qué conviene
                reforzar.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:py-14">
          <DiagnosticoMadurez />

          <p className="mt-8 text-xs leading-relaxed text-faint">
            Mide prácticas del equipo con los datos, no el nivel técnico de una
            persona. Los programas completos están en{" "}
            <Link
              href="/empresas"
              className="font-semibold text-ink underline underline-offset-2"
            >
              capacitación para empresas
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
