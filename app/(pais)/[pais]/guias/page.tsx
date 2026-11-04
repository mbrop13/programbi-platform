import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { esIsoPais, getPais, ISO_CHILE } from "@/config/paises";
import { guiasDePais, indiceGuias } from "@/lib/guias";
import { esIndexable } from "@/config/paises";
import { robotsLocal } from "@/lib/paises/metadata";
import { localeOg } from "@/lib/paises/rutas";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = false;

type Params = { pais: string };

export function generateStaticParams(): Params[] {
  return ["ar", "mx", "pe", "co", "uy", "py"].map((pais) => ({ pais }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const nombre = getPais(pais).nombre;
  const path = `/${pais}/guias`;
  const title = `Guías de Power BI en ${nombre} — ProgramBI`;
  const description = `Guías prácticas de Power BI y análisis de datos para ${nombre}: ruta de estudio, sueldos del mercado, funciones DAX y el curso en vivo de ProgramBI.`;
  const indexable = esIndexable(pais);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    ...(indexable ? {} : { robots: robotsLocal(pais) }),
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: localeOg(pais),
      type: "website",
    },
  };
}

export default async function GuiasPaisPage({ params }: { params: Promise<Params> }) {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) notFound();
  const guias = guiasDePais(pais);
  if (guias.length === 0) notFound();
  const nombre = getPais(pais).nombre;

  return (
    <main className="bg-canvas px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[900px]">
        <nav aria-label="Migas de pan" className="text-xs text-mute">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href={`/${pais}`} className="no-underline hover:text-ink">
                Inicio
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink">Guías</li>
          </ol>
        </nav>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Guías de Power BI en {nombre}
        </h1>
        <p className="mt-4 max-w-[46rem] leading-relaxed text-mute">
          Guías de estudio y referencia para trabajar con datos en {nombre}: ruta de aprendizaje,
          funciones con ejemplos, fuentes citadas y el curso en vivo que las cubre.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {guias.map((guia) => (
            <li key={guia.path} className="rounded-2xl border border-line bg-paper p-5">
              <Link href={guia.path} className="font-semibold text-ink no-underline hover:underline">
                {guia.h1}
              </Link>
              <p className="mt-2 text-sm leading-relaxed text-mute">{guia.description}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm">
          <Link href={indiceGuias("cl")} className="font-medium text-ink underline underline-offset-4">
            Ver todas las guías de ProgramBI
          </Link>
        </p>
      </div>
    </main>
  );
}
