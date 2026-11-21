import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuiaPage from "@/components/guias/GuiaPage";
import GuiaPasoAPasoLayout, {
  type RelacionadaResumen,
} from "@/components/guias/GuiaPasoAPasoLayout";
import TestimoniosDeCurso from "@/components/marketing/TestimoniosDeCurso";
import { GUIAS_PASO_A_PASO, guiaPasoAPasoPorSlug } from "@/content/guias/paso-a-paso";
import { guiaPorPath, guiasRaiz, type Guia } from "@/lib/guias";
import { metadataDeGuia } from "@/lib/guias/metadata";
import { metadataDeGuiaPasoAPaso } from "@/lib/guias/paso-a-paso-seo";

const ENLACES_VUELTA_LEGACY: Record<string, readonly string[]> = {
  "como-usar-claude-para-analisis-de-datos": [
    "chatgpt-para-analisis-de-datos",
    "gemini-para-analisis-de-datos",
    "ia-para-excel-chatgpt-claude-gemini",
  ],
  "claude-vs-chatgpt-analisis-de-datos": [
    "chatgpt-para-analisis-de-datos",
    "gemini-para-analisis-de-datos",
    "chatgpt-vs-gemini-vs-copilot",
  ],
  "como-usar-copilot-en-excel": [
    "copilot-en-power-bi",
    "prompts-para-excel",
    "copilot-studio-crear-agente",
  ],
  "funciones-dax-mas-importantes": [
    "ia-para-power-bi-dax",
    "copilot-en-power-bi",
  ],
  "power-bi-vs-excel": [
    "licencias-power-bi-precio-chile",
    "google-sheets-vs-excel",
  ],
};

function pasoAPasoComoGuiaMinima(
  paso: NonNullable<ReturnType<typeof guiaPasoAPasoPorSlug>>
): Guia {
  return {
    source: `content/guias/paso-a-paso/${paso.slug}`,
    slug: paso.slug,
    path: `/guias/${paso.slug}`,
    country: "cl",
    lang: "es-CL",
    title: paso.title,
    description: paso.meta,
    h1: paso.h1,
    updated: paso.updated,
    course: paso.curso,
    body: "",
    faqs: paso.faqs,
  };
}

export const revalidate = false;
export const dynamicParams = false;

type Params = { slug: string };

/** Solo las guías que viven en la raíz: chilenas, transversales y paso a paso. */
export function generateStaticParams(): Params[] {
  const seen = new Set<string>();
  const out: Params[] = [];
  for (const g of GUIAS_PASO_A_PASO) {
    if (!seen.has(g.slug)) {
      seen.add(g.slug);
      out.push({ slug: g.slug });
    }
  }
  for (const g of guiasRaiz()) {
    if (!seen.has(g.slug)) {
      seen.add(g.slug);
      out.push({ slug: g.slug });
    }
  }
  return out;
}

function guiaDe(slug: string) {
  return guiaPorPath(`/guias/${slug}`);
}

function mapaRelacionadas(slugs: readonly string[]): Record<string, RelacionadaResumen> {
  const mapa: Record<string, RelacionadaResumen> = {};
  for (const slug of slugs) {
    const paso = guiaPasoAPasoPorSlug(slug);
    if (paso) {
      mapa[slug] = {
        slug: paso.slug,
        h1: paso.h1,
        subtitle: paso.subtitle,
        herramienta: paso.herramienta,
        nivel: paso.nivel,
      };
      continue;
    }
    const legacy = guiaDe(slug);
    if (legacy) {
      mapa[slug] = {
        slug: legacy.slug,
        h1: legacy.h1,
      };
    }
  }
  return mapa;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const paso = guiaPasoAPasoPorSlug(slug);
  if (paso) return metadataDeGuiaPasoAPaso(paso);

  const guia = guiaDe(slug);
  if (!guia) return {};
  return metadataDeGuia(guia, true);
}

export default async function GuiaRootPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const paso = guiaPasoAPasoPorSlug(slug);
  if (paso) {
    return (
      <GuiaPasoAPasoLayout
        guia={paso}
        relacionadasMap={mapaRelacionadas(paso.relacionadas)}
      />
    );
  }

  const guia = guiaDe(slug);
  if (!guia) notFound();
  const extraSlugs = ENLACES_VUELTA_LEGACY[guia.slug] ?? [];
  const extraGuias: Guia[] = [];
  const extraPaths = new Set<string>();
  for (const extraSlug of extraSlugs) {
    const pasoExtra = guiaPasoAPasoPorSlug(extraSlug);
    if (pasoExtra) {
      const minima = pasoAPasoComoGuiaMinima(pasoExtra);
      extraGuias.push(minima);
      extraPaths.add(minima.path);
    }
  }
  const relacionadasBase = guiasRaiz().filter(
    (otra) => otra.path !== guia.path && otra.country === guia.country && !extraPaths.has(otra.path)
  );
  const relacionadas = [...extraGuias, ...relacionadasBase];
  const ocultarTestimonios = guia.slug === "power-bi-vs-excel";

  return (
    <>
      <GuiaPage
        guia={guia}
        rutaIndice="/guias"
        nombreMercado={guia.country === "cl" ? "Chile" : "Latinoamérica"}
        relacionadas={relacionadas}
      />
      {!ocultarTestimonios ? (
        <TestimoniosDeCurso cursoSlug={guia.course} variante="compacta" />
      ) : null}
    </>
  );
}
