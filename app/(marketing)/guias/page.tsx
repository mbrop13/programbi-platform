import type { Metadata } from "next";
import Link from "next/link";
import { guiasRaiz } from "@/lib/guias";
import { absoluteUrl } from "@/lib/seo";

const title = "Guías de Power BI, DAX y datos — ProgramBI";
const description =
  "Guías prácticas para aprender Power BI y análisis de datos: ruta de estudio, sueldos, DAX y casos reales, con el curso en vivo de ProgramBI.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteUrl("/guias") },
  openGraph: { title, description, url: absoluteUrl("/guias"), type: "website" },
};

export const revalidate = 3600;

export default function GuiasIndexPage() {
  const guias = guiasRaiz();
  const pais = guias.filter((guia) => guia.country === "cl");
  const transversales = guias.filter((guia) => guia.country === "transversal");

  return (
    <main className="bg-canvas px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[900px]">
        <nav aria-label="Migas de pan" className="text-xs text-mute">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="no-underline hover:text-ink">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink">Guías</li>
          </ol>
        </nav>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Guías de Power BI y análisis de datos
        </h1>
        <p className="mt-4 max-w-[46rem] leading-relaxed text-mute">
          Material de estudio y referencia para quienes trabajan con datos en Chile y Latinoamérica.
          Cada guía incluye ruta de aprendizaje, funciones con ejemplos, fuentes citadas y el enlace al
          curso en vivo que la cubre.
        </p>

        <section aria-labelledby="guias-chile" className="mt-12">
          <h2 id="guias-chile" className="text-xl font-bold tracking-tight text-ink">
            Chile
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {pais.map((guia) => (
              <li key={guia.path} className="rounded-2xl border border-line bg-paper p-5">
                <Link href={guia.path} className="font-semibold text-ink no-underline hover:underline">
                  {guia.h1}
                </Link>
                <p className="mt-2 text-sm leading-relaxed text-mute">{guia.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="guias-transversales" className="mt-12">
          <h2 id="guias-transversales" className="text-xl font-bold tracking-tight text-ink">
            Guías transversales
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {transversales.map((guia) => (
              <li key={guia.path} className="rounded-2xl border border-line bg-paper p-5">
                <Link href={guia.path} className="font-semibold text-ink no-underline hover:underline">
                  {guia.h1}
                </Link>
                <p className="mt-2 text-sm leading-relaxed text-mute">{guia.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
