import type { Metadata } from "next";
import Link from "next/link";
import { CalculadoraAhorro } from "@/components/empresas/CalculadoraAhorro";
import { absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOg } from "@/lib/seo";

const path = "/empresas/calculadora-capacitacion";
const title = "Calculadora de ahorro por capacitación en datos | ProgramBI";
const description =
  "Calcula cuánto tiempo puede ahorrar tu equipo al automatizar reportes con Power BI: horas al mes, jornadas y retorno de la capacitación.";

const share = pageOg({
  title,
  description,
  path,
  kicker: "Calculadora · Empresas",
  tags: ["Power BI", "Empresas", "Ahorro de tiempo"],
  alt: "Calculadora de ahorro por capacitación en datos — ProgramBI",
});

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: absoluteUrl(path),
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl(path),
    type: "website",
    images: share.images,
  },
  twitter: share.twitter,
};

export default function CalculadoraCapacitacionPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd([
        { name: "Inicio", path: "/" },
        { name: "Empresas", path: "/empresas" },
        { name: "Calculadora de ahorro", path },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <div className="bg-canvas text-ink">
        <div className="mx-auto max-w-[1400px] px-4 pt-8 sm:px-6 lg:px-8">
          <nav aria-label="Ruta de navegación" className="text-[13px] text-mute">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="no-underline hover:text-ink">
                  Inicio
                </Link>
              </li>
              <li aria-hidden className="text-faint">
                ›
              </li>
              <li>
                <Link href="/empresas" className="no-underline hover:text-ink">
                  Empresas
                </Link>
              </li>
              <li aria-hidden className="text-faint">
                ›
              </li>
              <li aria-current="page" className="font-medium text-ink">
                Calculadora de ahorro
              </li>
            </ol>
          </nav>
        </div>

        <header className="mx-auto max-w-[1400px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-faint uppercase">
            Herramienta gratis · Empresas
          </p>
          <h1 className="mt-4 max-w-[24ch] text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            ¿Cuánto tiempo ahorra tu equipo con Power BI?
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
            Mueve los supuestos de tu equipo y mira cuántas horas al mes se dejan de ir en armar
            reportes a mano. Si agregas el costo por hora y el de la capacitación, también ves el
            ahorro en dinero y en cuántos meses se recupera la inversión.
          </p>
          <p className="mt-4 text-[13px] text-faint">
            Estimación con tus supuestos; no es una promesa de resultados.
          </p>
        </header>

        <div className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">
          <CalculadoraAhorro />
        </div>

        <section className="border-y border-line bg-paper">
          <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Qué mide esta calculadora
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {[
                {
                  title: "Tiempo",
                  text: "Cuántas horas al mes se van hoy en armar y actualizar reportes a mano.",
                },
                {
                  title: "Automatización",
                  text: "Qué parte de ese trabajo queda en un tablero que se actualiza solo.",
                },
                {
                  title: "Retorno",
                  text: "En cuántos meses se paga la capacitación, con el costo que tú pongas.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-canvas p-6">
                  <h3 className="text-base font-semibold tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-mute">
              Todo sale de tus números: personas, horas a la semana, porcentaje que se automatiza,
              costo por hora del equipo y costo de la capacitación. No usamos promedios de mercado
              ni precios de cursos precargados.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Siguiente paso
          </h2>
          <p className="mt-4 max-w-xl text-mute">
            Si el número te sirve, el paso siguiente es cotizar la capacitación con el tamaño y los
            datos de tu equipo.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link
              href="/empresas#contacto"
              className="font-semibold text-ink no-underline underline-offset-4 hover:underline"
            >
              Capacitación para empresas
            </Link>
            <Link
              href="/empresas"
              className="font-semibold text-ink no-underline underline-offset-4 hover:underline"
            >
              Cómo funciona la capacitación in-company
            </Link>
            <Link
              href="/cursos/power-bi"
              className="font-semibold text-ink no-underline underline-offset-4 hover:underline"
            >
              Curso Power BI en vivo
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
