import type { Metadata } from "next";
import Link from "next/link";
import { GuiaBreadcrumbs, GuiaScope } from "@/components/guias/GuiaEditorialPrimitives";
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
    <GuiaScope className="px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <div className="mx-auto max-w-[1120px]">
        <GuiaBreadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Guías" },
          ]}
        />

        <header className="mt-6 border-b border-[var(--g-border)] pb-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h1 className="max-w-[22ch] text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--g-ink)]">
              Guías de datos por curso y país
            </h1>
            <p className="text-sm font-medium tabular-nums text-[var(--g-subtle)]">
              {tarjetas.length} guías publicadas
            </p>
          </div>
          <p className="mt-3 max-w-[66ch] text-base leading-relaxed text-[var(--g-muted)]">
            Material de referencia con rutas de estudio, funciones, precios locales y fuentes citadas para Latinoamérica.
          </p>
        </header>

        <div className="mt-8">
          <GuiasHub guias={tarjetas} paises={paises} cursos={cursos} />
        </div>

        <section
          aria-labelledby="ia-analisis-datos"
          className="mt-16 rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] p-6"
        >
          <h2 id="ia-analisis-datos" className="text-xl font-bold tracking-tight text-[var(--g-ink)]">
            IA para análisis de datos
          </h2>
          <p className="mt-1.5 max-w-[70ch] text-sm leading-relaxed text-[var(--g-muted)]">
            Guías y comparativas para trabajar con Claude, ChatGPT y Gemini sobre planillas, tablas y reportes reales.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--g-border)] pt-5 sm:grid-cols-2 lg:grid-cols-4">
            {bloqueIaDatos.map((item) => (
              <li key={item.href} className="min-w-0">
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-lg border border-[var(--g-border)] bg-[var(--g-bg)] p-4 no-underline transition-colors hover:border-[var(--g-border-strong)]"
                >
                  <span className="text-sm font-bold leading-snug text-[var(--g-ink)] group-hover:underline group-hover:underline-offset-4">
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
          className="mt-10 flex flex-col justify-between gap-4 rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)] p-6 sm:flex-row sm:items-center"
        >
          <div className="min-w-0">
            <h2 id="guia-destacada" className="text-lg font-bold tracking-tight text-[var(--g-ink)]">
              Mejores cursos de Power BI en Chile (2026)
            </h2>
            <p className="mt-1 max-w-[66ch] text-sm leading-relaxed text-[var(--g-muted)]">
              Precio, horas en vivo, formato y certificado de 7 opciones, incluyendo a la competencia y autoría declarada.
            </p>
          </div>
          <Link
            href="/guias/mejores-cursos-power-bi-chile-2026"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-[var(--g-accent)] px-5 text-sm font-semibold text-[var(--g-accent-ink)] no-underline transition-opacity hover:opacity-90"
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
                  className="flex min-h-[44px] items-center justify-between gap-2 rounded-lg border border-[var(--g-border)] bg-[var(--g-surface)] px-4 py-2 text-sm font-medium text-[var(--g-ink)] no-underline transition-colors hover:border-[var(--g-border-strong)]"
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

        <section aria-labelledby="atajos-guias" className="mt-10 rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] px-5 py-5">
          <h2 id="atajos-guias" className="text-sm font-semibold text-[var(--g-muted)]">
            Atajos del sitio
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/cursos" className="font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)]">
                Catálogo de cursos
              </Link>
            </li>
            <li>
              <Link href="/precios" className="font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)]">
                Precios por país
              </Link>
            </li>
            <li>
              <Link href="/preguntas-frecuentes" className="font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)]">
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link href="/versus" className="font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)]">
                Comparativas
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </GuiaScope>
  );
}
