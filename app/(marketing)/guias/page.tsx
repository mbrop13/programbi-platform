import type { Metadata } from "next";
import Link from "next/link";
import GuiasHub from "@/components/guias/GuiasHub";
import { PAISES_CARPETA, getPais } from "@/config/paises";
import { GUIAS } from "@/lib/guias/generado";
import { guiasDePais } from "@/lib/guias";
import { absoluteUrl } from "@/lib/seo";

const title = "Guías de datos, Power BI y SQL — ProgramBI";
const description =
  "Guías prácticas por curso y país: Power BI, Excel, SQL Server, Python, análisis de datos y mercado financiero. Precio local, ruta de aprendizaje, sueldos y curso en vivo.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: absoluteUrl("/guias") },
  openGraph: { title, description, url: absoluteUrl("/guias"), type: "website" },
};

export const revalidate = 3600;

const CURSOS = [
  { valor: "analisis-de-datos", etiqueta: "Análisis de datos" },
  { valor: "power-bi", etiqueta: "Power BI" },
  { valor: "sql-server", etiqueta: "SQL Server" },
  { valor: "python", etiqueta: "Python" },
  { valor: "excel", etiqueta: "Excel" },
  { valor: "mercado-financiero", etiqueta: "Mercado financiero" },
];

export default function GuiasIndexPage() {
  // El hub general lista todas las guías publicadas; los filtros separan país y curso.
  const guias = GUIAS;
  const paises = [
    { valor: "cl", etiqueta: "Chile" },
    ...PAISES_CARPETA.filter((pais) => guiasDePais(pais.iso).length > 0).map((pais) => ({
      valor: pais.iso,
      etiqueta: getPais(pais.iso).nombre,
    })),
  ];
  const paisesConCarpeta = paises.filter((pais) => pais.valor !== "cl");

  return (
    <main className="bg-canvas px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
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

        <h1 className="mt-6 max-w-[20ch] text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
          Guías de datos por curso y país
        </h1>
        <p className="mt-4 max-w-[62ch] leading-relaxed text-mute">
          Material de estudio y referencia para quien trabaja con datos en Latinoamérica: ruta de aprendizaje, precios
          locales, sueldos del mercado y el curso en vivo que cubre cada tema. Todas las guías se actualizan con fuentes
          citadas.
        </p>

        <div className="mt-8">
          <GuiasHub guias={guias} paises={paises} cursos={CURSOS} />
        </div>

        <section aria-labelledby="guias-por-pais" className="mt-14 border-t border-line pt-8">
          <h2 id="guias-por-pais" className="text-lg font-bold tracking-tight text-ink">
            Guías por país
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {paisesConCarpeta.map((pais) => (
              <li key={pais.valor}>
                <Link
                  href={`/${pais.valor}/guias`}
                  className="inline-flex h-10 items-center rounded-full border border-line-strong bg-paper px-4 text-sm font-medium text-ink no-underline hover:border-ink/30"
                >
                  {pais.etiqueta}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="atajos-guias" className="mt-10 rounded-[26px] border border-line bg-paper px-5 py-5">
          <h2 id="atajos-guias" className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
            Atajos
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/cursos" className="font-medium text-ink underline underline-offset-4">
                Catálogo de cursos
              </Link>
            </li>
            <li>
              <Link href="/precios" className="font-medium text-ink underline underline-offset-4">
                Precios por país
              </Link>
            </li>
            <li>
              <Link href="/preguntas-frecuentes" className="font-medium text-ink underline underline-offset-4">
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link href="/versus" className="font-medium text-ink underline underline-offset-4">
                Comparativas
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
