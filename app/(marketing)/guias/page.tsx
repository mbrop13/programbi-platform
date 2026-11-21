import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GuiasHub from "@/components/guias/GuiasHub";
import { GUIAS_PASO_A_PASO } from "@/content/guias/paso-a-paso";
import { GUIAS } from "@/lib/guias/generado";
import { indiceGuias } from "@/lib/guias";
import { nombreCurso, opcionesCurso, opcionesPais, paisesConConteo } from "@/lib/guias/opciones";
import { esGuiaPublicada } from "@/lib/guias/relacionadas";
import { tarjetasDeGuias, tarjetasDePasoAPaso } from "@/lib/guias/tarjetas";
import { hreflangDe } from "@/lib/paises/rutas";
import { absoluteUrl, jsonLdString, pageOg } from "@/lib/seo";

const title = "Guías prácticas de datos, IA, Claude y Power BI — ProgramBI";
const description =
  "Guías prácticas de Claude para datos, Power BI, SQL Server, Python y Excel en vivo. Prompts listos, rutas de estudio y precios locales.";

const share = pageOg({
  title: "Guías prácticas de datos e IA aplicada",
  description,
  path: "/guias",
  kicker: "Biblioteca ProgramBI · Latinoamérica",
  tags: ["Claude AI", "Power BI", "SQL y Python", "Excel"],
  alt: title,
});

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: absoluteUrl("/guias"),
    languages: hreflangDe("/guias"),
  },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/guias"),
    type: "website",
    locale: "es_CL",
    siteName: "ProgramBI",
    images: share.images,
  },
  twitter: share.twitter,
};

export const revalidate = false;

export default function GuiasIndexPage() {
  // El hub general lista solo las guías de mercados indexables; los filtros separan país y curso.
  const guias = GUIAS.filter(esGuiaPublicada);
  const paises = opcionesPais(guias);
  const cursosBase = opcionesCurso(guias);
  const paisesConCarpeta = paisesConConteo(guias).filter((pais) => pais.iso !== "cl");
  const pasoAPasoTarjetas = tarjetasDePasoAPaso(GUIAS_PASO_A_PASO);
  const pasoAPasoPaths = new Set(pasoAPasoTarjetas.map((t) => t.path));
  const tarjetas = [
    ...pasoAPasoTarjetas,
    ...tarjetasDeGuias(guias).filter((t) => !pasoAPasoPaths.has(t.path)),
  ];

  // Asegura que los cursos de guías paso a paso también aparezcan en el filtro de curso.
  const cursosVistos = new Set(cursosBase.map((c) => c.valor));
  const cursos = [...cursosBase];
  for (const t of pasoAPasoTarjetas) {
    if (!cursosVistos.has(t.course)) {
      cursosVistos.add(t.course);
      cursos.push({ valor: t.course, etiqueta: nombreCurso(t.course) });
    }
  }

  const canonical = absoluteUrl("/guias");

  const bloqueIaDatos = [
    {
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      tituloFallback: "Claude para análisis de datos",
      descripcionFallback: "Análisis de archivos, limpieza, fórmulas y validación paso a paso.",
    },
    {
      href: "/guias/chatgpt-para-analisis-de-datos",
      tituloFallback: "ChatGPT para análisis de datos",
      descripcionFallback: "Sube planillas, genera gráficos y revisa cálculos con prompts.",
    },
    {
      href: "/guias/gemini-para-analisis-de-datos",
      tituloFallback: "Gemini para análisis de datos",
      descripcionFallback: "Trabajo con Google Sheets, Excel y análisis asistido.",
    },
    {
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      tituloFallback: "Claude vs ChatGPT para datos",
      descripcionFallback: "Comparativa práctica para elegir herramienta según tu flujo.",
    },
  ].map((item) => {
    const tarjeta = tarjetas.find((t) => t.path === item.href);
    return {
      href: item.href,
      titulo: tarjeta?.h1 ?? item.tituloFallback,
      descripcion: tarjeta?.description ?? item.descripcionFallback,
    };
  });

  // CollectionPage + ItemList: el hub es un índice, no un artículo. Ayuda a
  // que buscadores y asistentes entiendan que estas son las guías publicadas.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#collection`,
        name: title,
        description,
        inLanguage: "es-CL",
        url: canonical,
      },
      {
        "@type": "ItemList",
        "@id": `${canonical}#list`,
        numberOfItems: tarjetas.length,
        itemListElement: tarjetas.map((guia, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: guia.h1,
          url: absoluteUrl(guia.path),
        })),
      },
    ],
  };

  return (
    <div className="bg-canvas px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
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
          <GuiasHub guias={tarjetas} paises={paises} cursos={cursos} />
        </div>

        <section
          aria-labelledby="ia-analisis-datos"
          className="mt-12 rounded-[26px] border border-line-strong bg-paper px-5 py-6"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
            Rutas recomendadas
          </p>
          <h2 id="ia-analisis-datos" className="mt-1 text-xl font-bold tracking-tight text-ink">
            IA para análisis de datos
          </h2>
          <p className="mt-1 max-w-[70ch] text-sm leading-relaxed text-mute">
            Guías y comparativas para trabajar con Claude, ChatGPT y Gemini sobre planillas, tablas y reportes reales.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bloqueIaDatos.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex h-full flex-col rounded-2xl border border-line bg-canvas p-4 no-underline transition-colors hover:border-ink/35"
                >
                  <span className="text-sm font-bold leading-snug text-ink">{item.titulo}</span>
                  <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-mute">
                    {item.descripcion}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-ink">
                    Leer guía <ArrowRight size={12} aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="guia-destacada"
          className="mt-12 rounded-[26px] border border-line-strong bg-wash/60 px-5 py-5"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
            Comparativa destacada
          </p>
          <h2 id="guia-destacada" className="mt-1 text-xl font-bold tracking-tight text-ink">
            Mejores cursos de Power BI en Chile (2026)
          </h2>
          <p className="mt-1 max-w-[70ch] text-sm leading-relaxed text-mute">
            Precio, horas en vivo, formato y certificado de 7 opciones. Incluye a la competencia y
            declara quién hace la guía.
          </p>
          <Link
            href="/guias/mejores-cursos-power-bi-chile-2026"
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-canvas no-underline"
          >
            Ver la comparativa
            <ArrowRight size={15} aria-hidden />
          </Link>
        </section>

        <section aria-labelledby="guias-por-pais" className="mt-14 border-t border-line pt-8">
          <h2 id="guias-por-pais" className="text-lg font-bold tracking-tight text-ink">
            Guías por país
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {paisesConCarpeta.map((pais) => (
              <li key={pais.iso}>
                <Link
                  href={indiceGuias(pais.iso)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-paper px-4 text-sm font-medium text-ink no-underline hover:border-ink/30"
                >
                  {pais.nombre}
                  <span className="rounded-full bg-wash px-2 py-0.5 text-[11px] font-semibold text-mute">
                    {pais.cantidad}
                  </span>
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
    </div>
  );
}
