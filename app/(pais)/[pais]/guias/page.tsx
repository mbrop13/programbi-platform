import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GuiaBreadcrumbs,
  GuiaScope,
  GuiaVisualBadge,
} from "@/components/guias/GuiaEditorialPrimitives";
import GuiasHub from "@/components/guias/GuiasHub";
import {
  esIndexable,
  esIsoPais,
  getPais,
  ISO_CHILE,
  PAISES_CARPETA,
} from "@/config/paises";
import { GUIAS_PASO_A_PASO } from "@/content/guias/paso-a-paso";
import { getCourseBySlug } from "@/lib/data/courses";
import { guiasDePais, guiasTransversales, indiceGuias } from "@/lib/guias";
import type { TarjetaGuia } from "@/lib/guias/hub";
import { nombreCurso, opcionesCurso, ordenPais } from "@/lib/guias/opciones";
import { GUIAS_PASO_A_PASO_PE } from "@/lib/guias/paso-a-paso-pe";
import { GUIAS_PASO_A_PASO_CO } from "@/lib/guias/paso-a-paso-co";
import { GUIAS_PASO_A_PASO_MX } from "@/lib/guias/paso-a-paso-mx";
import { GUIAS_PASO_A_PASO_AR } from "@/lib/guias/paso-a-paso-ar";
import { tiempoLecturaPasoAPaso } from "@/lib/guias/paso-a-paso-seo";
import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";
import { fechaActualizado, metaDescripcionGuia } from "@/lib/guias/precio";
import { tarjetasDeGuias, tarjetasDePasoAPaso } from "@/lib/guias/tarjetas";
import { robotsLocal } from "@/lib/paises/metadata";
import { hreflangDe, localeOg } from "@/lib/paises/rutas";
import { absoluteUrl, jsonLdString, pageOg } from "@/lib/seo";

export const revalidate = false;
export const dynamicParams = false;

type Params = { pais: string };

function tarjetasLocalesPasoAPaso(
  guias: readonly GuiaPasoAPaso[],
  pais: string,
  nombrePais: string
): TarjetaGuia[] {
  return guias.map((guia) => {
    const curso = getCourseBySlug(guia.curso);
    return {
      path: `/${pais}/guias/${guia.slug}`,
      title: guia.title,
      h1: guia.h1,
      description: metaDescripcionGuia(guia.meta, 155),
      course: guia.curso,
      courseName: nombreCurso(guia.curso),
      country: pais,
      countryName: nombrePais,
      countryOrder: ordenPais(pais),
      updated: guia.updated,
      updatedLabel: fechaActualizado(guia.updated),
      imageUrl: curso?.imageUrl,
      accentColor: curso?.accentColor ?? "#171716",
      readingMinutes: tiempoLecturaPasoAPaso(guia),
      herramienta: guia.herramienta,
      nivel: guia.nivel,
    };
  });
}

/** Se generan todos los países con carpeta; los sin guías locales usan transversales y paso a paso aplicables. */
export function generateStaticParams(): Params[] {
  return PAISES_CARPETA.map((pais) => ({
    pais: pais.iso,
  }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const nombre = getPais(pais).nombre;
  const path = `/${pais}/guias`;
  const titleLargo = `Guías de datos y Power BI en ${nombre} | ProgramBI`;
  // «República Dominicana» empuja el título sobre 60 caracteres: en ese caso
  // se conserva la palabra clave corta y se suelta «Power BI».
  const title =
    pais === "co"
      ? "Guías y plantillas de Excel laboral en Colombia | ProgramBI"
      : pais === "pe"
        ? "Guías de Excel, datos e IA en Perú | ProgramBI"
        : pais === "ar"
          ? "Guías de Excel, datos e IA para Argentina | ProgramBI"
          : pais === "us"
            ? "Guías de datos e IA en español en EE. UU. | ProgramBI"
            : titleLargo.length <= 60
              ? titleLargo
              : `Guías de datos en ${nombre} | ProgramBI`;
  const description =
    pais === "co"
      ? "Guías prácticas y plantillas Excel 2026 para Colombia: prima de servicios, cesantías, intereses, liquidación de contrato y nómina paso a paso."
      : pais === "pe"
        ? "Guías prácticas de Excel laboral, análisis de datos e IA en Perú: gratificación, CTS, liquidación, quinta categoría, boleta y plantillas .xlsx."
        : pais === "ar"
          ? "Guías prácticas de Excel, análisis de datos e IA para Argentina: fórmulas, plantillas descargables, indicadores locales y ejemplos paso a paso."
          : pais === "us"
            ? "Guías prácticas en español de Claude, Power BI, SQL, Python y Excel para hispanohablantes en Estados Unidos: rutas, ejemplos y cursos en vivo."
            : `Guías prácticas de Claude, Power BI, SQL, Python y Excel en ${nombre}: rutas de estudio, sueldos del mercado y cursos en vivo.`;
  const indexable = esIndexable(pais);
  const share = pageOg({
    title:
      pais === "us"
        ? "Guías de datos e IA en español en EE. UU."
        : `Guías prácticas de datos e IA en ${nombre}`,
    description,
    path,
    kicker:
      pais === "us"
        ? "Biblioteca ProgramBI · EE. UU. en español"
        : `Biblioteca ProgramBI · ${nombre}`,
    tags: ["Claude AI", "Power BI", "SQL y Python"],
    alt: title,
  });
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: absoluteUrl(path),
      ...(indexable ? { languages: hreflangDe("/guias") } : {}),
    },
    ...(indexable ? {} : { robots: robotsLocal(pais) }),
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      locale: localeOg(pais),
      type: "website",
      siteName: "ProgramBI",
      images: share.images,
    },
    twitter: share.twitter,
  };
}

export default async function GuiasPaisPage({ params }: { params: Promise<Params> }) {
  const { pais } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) notFound();

  if (pais === "co") {
    const canonicalCo = absoluteUrl("/co/guias");
    const jsonLdCo = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${canonicalCo}#collection`,
          name: "Guías y plantillas de Excel laboral en Colombia (2026)",
          description:
            "Guías paso a paso y plantillas descargables en Excel con parámetros laborales de Colombia 2026.",
          inLanguage: "es-CO",
          url: canonicalCo,
        },
        {
          "@type": "ItemList",
          "@id": `${canonicalCo}#list`,
          numberOfItems: GUIAS_PASO_A_PASO_CO.length,
          itemListElement: GUIAS_PASO_A_PASO_CO.map((guia, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: guia.h1,
            url: absoluteUrl(`/co/guias/${guia.slug}`),
          })),
        },
      ],
    };

    return (
      <GuiaScope className="pb-20 pt-8 sm:pt-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLdCo) }} />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <GuiaBreadcrumbs
            items={[
              { label: "Inicio", href: "/co" },
              { label: "Guías" },
            ]}
          />

          <header className="mt-5 max-w-[72ch]">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[var(--g-accent)]">
              Biblioteca editorial · Colombia 2026
            </p>
            <h1 className="mt-2 text-[clamp(1.85rem,3.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--g-ink)]">
              Guías y plantillas de Excel laboral en Colombia (2026)
            </h1>
            <p className="mt-4 text-base leading-[1.65] text-[var(--g-muted)] sm:text-lg">
              Tutoriales paso a paso con fórmulas en español e inglés, hoja Parametros con SMMLV 2026 ($1.750.905) y auxilio de transporte ($249.095), y plantillas descargables en Excel (.xlsx).
            </p>
          </header>

          <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {GUIAS_PASO_A_PASO_CO.map((guia, idx) => (
              <li key={guia.slug}>
                <Link
                  href={`/co/guias/${guia.slug}`}
                  className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-6 no-underline shadow-[var(--g-card-shadow)] transition-all hover:-translate-y-0.5 hover:border-[var(--g-accent)] hover:shadow-[var(--g-card-shadow-hover)]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold tabular-nums text-[var(--g-subtle)]">
                      {String(idx + 1).padStart(2, "0")} · Excel (.xlsx)
                    </span>
                    <GuiaVisualBadge tone="neutral">Nivel {guia.nivel}</GuiaVisualBadge>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold leading-snug text-[var(--g-ink)] group-hover:text-[var(--g-accent)]">
                      {guia.h1}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--g-muted)]">
                      {guia.subtitle}
                    </p>
                  </div>

                  <span className="text-xs font-semibold text-[var(--g-accent)]">
                    Ver guía y descargar plantilla →
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <section className="mt-12 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-6 shadow-[var(--g-card-shadow)]">
            <h2 className="text-lg font-bold text-[var(--g-ink)]">
              Fuentes oficiales y formación en vivo en Colombia
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--g-muted)]">
              Consulta el detalle de indicadores laborales y macroeconómicos en{" "}
              <Link
                href="/co/datos"
                className="font-semibold text-[var(--g-accent)] underline underline-offset-4 hover:text-[var(--g-ink)]"
              >
                datos oficiales de Colombia
              </Link>
              , revisa nuestro{" "}
              <Link
                href="/co/cursos/excel"
                className="font-semibold text-[var(--g-accent)] underline underline-offset-4 hover:text-[var(--g-ink)]"
              >
                curso de Excel en Colombia
              </Link>{" "}
              o da el salto a tableros gerenciales con nuestro{" "}
              <Link
                href="/co/cursos/power-bi"
                className="font-semibold text-[var(--g-accent)] underline underline-offset-4 hover:text-[var(--g-ink)]"
              >
                curso de Power BI en Colombia
              </Link>
              .
            </p>
          </section>
        </div>
      </GuiaScope>
    );
  }

  const guiasLocales = guiasDePais(pais);
  const usaFallback = guiasLocales.length === 0;
  const nombre = getPais(pais).nombre;

  const cursos = opcionesCurso(guiasLocales);
  let tarjetas = tarjetasDeGuias(guiasLocales);

  const pasoLocalesPorPais =
    pais === "pe"
      ? GUIAS_PASO_A_PASO_PE
      : pais === "mx"
        ? GUIAS_PASO_A_PASO_MX
        : pais === "ar"
          ? GUIAS_PASO_A_PASO_AR
          : null;

  if (pasoLocalesPorPais) {
    const tarjetasLocales = tarjetasLocalesPasoAPaso(pasoLocalesPorPais, pais, nombre);
    const localPaths = new Set(tarjetasLocales.map((t) => t.path));
    tarjetas = [
      ...tarjetasLocales,
      ...tarjetas.filter((t) => !localPaths.has(t.path)),
    ];
    const cursosVistos = new Set(cursos.map((c) => c.valor));
    for (const t of tarjetasLocales) {
      if (!cursosVistos.has(t.course)) {
        cursosVistos.add(t.course);
        cursos.push({ valor: t.course, etiqueta: nombreCurso(t.course) });
      }
    }
  }

  if (usaFallback) {
    const transversales = guiasTransversales();
    const pasoAPaso = GUIAS_PASO_A_PASO.filter((g) => !g.slug.includes("-chile"));
    const pasoAPasoTarjetas = tarjetasDePasoAPaso(pasoAPaso);
    const pasoAPasoPaths = new Set(pasoAPasoTarjetas.map((t) => t.path));
    tarjetas = [
      ...tarjetas,
      ...pasoAPasoTarjetas.filter((t) => !tarjetas.some((ex) => ex.path === t.path)),
      ...tarjetasDeGuias(transversales).filter(
        (t) => !pasoAPasoPaths.has(t.path) && !tarjetas.some((ex) => ex.path === t.path)
      ),
    ];

    const cursosBase = opcionesCurso(transversales);
    const cursosVistos = new Set(cursos.map((c) => c.valor));
    for (const c of cursosBase) {
      if (!cursosVistos.has(c.valor)) {
        cursosVistos.add(c.valor);
        cursos.push(c);
      }
    }
    for (const t of pasoAPasoTarjetas) {
      if (!cursosVistos.has(t.course)) {
        cursosVistos.add(t.course);
        cursos.push({ valor: t.course, etiqueta: nombreCurso(t.course) });
      }
    }
  }

  const tituloHub =
    pais === "ar"
      ? "Guías prácticas de Excel, datos e IA en Argentina"
      : pais === "pe"
        ? "Guías prácticas de Excel, datos e IA en Perú"
        : `Guías de datos y Power BI en ${nombre}`;

  const subtitulo =
    pais === "ar"
      ? `${tarjetas.length} ${tarjetas.length === 1 ? "guía" : "guías"} prácticas de referencia para Argentina: paso a paso en Excel, análisis de datos e IA aplicada.`
      : pais === "pe"
        ? `${tarjetas.length} ${tarjetas.length === 1 ? "guía" : "guías"} prácticas para Perú: plantillas Excel laborales, análisis de datos e IA aplicada.`
        : usaFallback
          ? `${tarjetas.length} ${tarjetas.length === 1 ? "guía" : "guías"} prácticas de estudio y referencia disponibles para ${nombre}: rutas paso a paso, prompts listos, ejemplos aplicados y cursos en vivo.`
          : `${tarjetas.length} ${tarjetas.length === 1 ? "guía" : "guías"} de estudio y referencia para ${nombre}: rutas de aprendizaje, ejemplos aplicados, precios locales y cursos en vivo.`;

  const canonical = absoluteUrl(`/${pais}/guias`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${canonical}#collection`,
        name: tituloHub,
        description: `Guías prácticas para ${nombre}: ruta de estudio, ejemplos aplicados y herramientas de datos en ProgramBI.`,
        inLanguage: getPais(pais).idioma,
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
          paises={[]}
          cursos={cursos}
          mostrarPais={false}
          iso={pais}
          titulo={tituloHub}
          subtitulo={subtitulo}
          breadcrumbs={[
            { label: "Inicio", href: `/${pais}` },
            { label: "Guías", href: "/guias" },
            { label: nombre },
          ]}
        />

        <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-[var(--g-border)] pt-8 text-sm">
          {pais === "pe" ? (
            <>
              <Link
                href="/pe/cursos/power-bi"
                className="inline-flex min-h-[44px] items-center font-semibold text-[var(--g-accent)] underline underline-offset-4 hover:text-[var(--g-ink)] sm:min-h-0"
              >
                Curso de Power BI en Perú
              </Link>
              <Link
                href="/pe/datos"
                className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)] sm:min-h-0"
              >
                Datos salariales y carreras en Perú
              </Link>
            </>
          ) : null}
          {pais === "mx" ? (
            <Link
              href="/mx/datos"
              className="inline-flex min-h-[44px] items-center font-semibold text-[var(--g-accent)] underline underline-offset-4 hover:text-[var(--g-ink)] sm:min-h-0"
            >
              Ver datos salariales y carreras en México
            </Link>
          ) : null}
          {pais === "ar" ? (
            <>
              <Link
                href="/ar/cursos/power-bi"
                className="inline-flex min-h-[44px] items-center font-semibold text-[var(--g-accent)] underline underline-offset-4 hover:text-[var(--g-ink)] sm:min-h-0"
              >
                Curso de Power BI en Argentina
              </Link>
              <Link
                href="/ar/datos"
                className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)] sm:min-h-0"
              >
                Datos de carreras e inflación en Argentina
              </Link>
            </>
          ) : null}
          <Link
            href={indiceGuias("cl")}
            className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)] sm:min-h-0"
          >
            Ver todas las guías de ProgramBI
          </Link>
        </div>
      </div>
    </GuiaScope>
  );
}
