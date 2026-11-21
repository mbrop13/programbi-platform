import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuiaPage from "@/components/guias/GuiaPage";
import GuiaPasoAPasoLayout, {
  type RelacionadaResumen,
} from "@/components/guias/GuiaPasoAPasoLayout";
import TestimoniosDeCurso from "@/components/marketing/TestimoniosDeCurso";
import { GUIAS_PASO_A_PASO, guiaPasoAPasoPorSlug } from "@/content/guias/paso-a-paso";
import { guiaPorPath, guiasRaiz } from "@/lib/guias";
import { metadataDeGuia } from "@/lib/guias/metadata";
import { metadataDeGuiaPasoAPaso } from "@/lib/guias/paso-a-paso-seo";

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
  const relacionadas = guiasRaiz().filter(
    (otra) => otra.path !== guia.path && otra.country === guia.country
  );
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
