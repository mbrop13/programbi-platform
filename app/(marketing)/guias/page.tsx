import type { Metadata } from "next";
import Link from "next/link";
import { GuiaScope, GuiaToolVisual } from "@/components/guias/GuiaEditorialPrimitives";
import GuiasHub from "@/components/guias/GuiasHub";
import { GUIAS_PASO_A_PASO } from "@/content/guias/paso-a-paso";
import { GUIAS } from "@/lib/guias/generado";
import { indiceGuias } from "@/lib/guias";
import { nombreCurso, opcionesCurso, opcionesPais, paisesConConteo } from "@/lib/guias/opciones";
import { esGuiaPublicada } from "@/lib/guias/relacionadas";
import { tarjetasDeGuias, tarjetasDePasoAPaso } from "@/lib/guias/tarjetas";
import { hreflangDe } from "@/lib/paises/rutas";
import { absoluteUrl, jsonLdString, pageOg } from "@/lib/seo";

const title = "Guías prácticas de datos, IA, Claude y Power BI | ProgramBI";
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
    <GuiaScope className="pb-20 pt-8 sm:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <GuiasHub
          guias={tarjetas}
          paises={paises}
          cursos={cursos}
          titulo="Guías prácticas de datos, IA y Power BI"
          subtitulo="Material de estudio y referencia con rutas claras, prompts listos, precios locales y fuentes citadas para Latinoamérica."
          breadcrumbs={[
            { label: "Inicio", href: "/" },
            { label: "Guías" },
          ]}
        />

        <section
          aria-labelledby="ia-analisis-datos"
          className="mt-16 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-6 shadow-[var(--g-card-shadow)] sm:p-7"
        >
          <div className="flex items-center gap-3">
            <GuiaToolVisual tool="IA" size="sm" />
            <h2 id="ia-analisis-datos" className="text-xl font-bold tracking-tight text-[var(--g-ink)]">
              IA para análisis de datos
            </h2>
          </div>
          <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-[var(--g-muted)]">
            Guías y comparativas para trabajar con Claude, ChatGPT y Gemini sobre planillas, tablas y reportes reales.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--g-border)] pt-5 sm:grid-cols-2 lg:grid-cols-4">
            {bloqueIaDatos.map((item) => (
              <li key={item.href} className="min-w-0">
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-xl border border-[var(--g-border)] bg-[var(--g-bg)] p-4 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--g-border-strong)] hover:shadow-[var(--g-card-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)]"
                >
                  <span className="text-sm font-bold leading-snug text-[var(--g-ink)] transition-colors group-hover:text-[var(--g-accent)]">
                    {item.titulo}
                  </span>
                  <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--g-muted)]">
                    {item.descripcion}
                  </span>
                  <span className="mt-auto pt-3 text-xs font-semibold text-[var(--g-accent)]">
                    Leer guía
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="guia-destacada"
          className="mt-10 flex flex-col justify-between gap-4 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-6 shadow-[var(--g-card-shadow)] sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 items-start gap-3.5">
            <GuiaToolVisual tool="Power BI" size="md" className="mt-0.5" />
            <div className="min-w-0">
              <h2 id="guia-destacada" className="text-lg font-bold tracking-tight text-[var(--g-ink)]">
                Mejores cursos de Power BI en Chile (2026)
              </h2>
              <p className="mt-1 max-w-[66ch] text-sm leading-relaxed text-[var(--g-muted)]">
                Precio, horas en vivo, formato y certificado de 7 opciones, incluyendo a la competencia y autoría declarada.
              </p>
            </div>
          </div>
          <Link
            href="/guias/mejores-cursos-power-bi-chile-2026"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-[var(--g-accent)] px-5 text-sm font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)] focus-visible:ring-offset-2"
          >
            Abrir comparativa
          </Link>
        </section>

        <section aria-labelledby="guias-por-pais" className="mt-14 border-t border-[var(--g-border)] pt-8">
          <h2 id="guias-por-pais" className="text-lg font-bold tracking-tight text-[var(--g-ink)]">
            Guías por país
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {paisesConCarpeta.map((pais) => (
              <li key={pais.iso} className="min-w-0">
                <Link
                  href={indiceGuias(pais.iso)}
                  className="flex min-h-[44px] items-center justify-between gap-2 rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] px-4 py-2 text-sm font-medium text-[var(--g-ink)] no-underline shadow-[var(--g-card-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--g-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)]"
                >
                  <span className="truncate">{pais.nombre}</span>
                  <span className="shrink-0 text-xs tabular-nums text-[var(--g-subtle)]">
                    {pais.cantidad}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="atajos-guias" className="mt-10 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] px-5 py-5 shadow-[var(--g-card-shadow)]">
          <h2 id="atajos-guias" className="text-sm font-semibold text-[var(--g-muted)]">
            Atajos del sitio
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/cursos" className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)] sm:min-h-0">
                Catálogo de cursos
              </Link>
            </li>
            <li>
              <Link href="/precios" className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)] sm:min-h-0">
                Precios por país
              </Link>
            </li>
            <li>
              <Link href="/preguntas-frecuentes" className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)] sm:min-h-0">
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link href="/versus" className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)] sm:min-h-0">
                Comparativas
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </GuiaScope>
  );
}
