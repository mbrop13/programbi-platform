import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GuiaPage from "@/components/guias/GuiaPage";
import GuiaPasoAPasoLayout, {
  type RelacionadaResumen,
} from "@/components/guias/GuiaPasoAPasoLayout";
import TestimoniosDeCurso from "@/components/marketing/TestimoniosDeCurso";
import { esIsoPais, esIndexable, getPais, ISO_CHILE, PAISES_CARPETA } from "@/config/paises";
import { guiaPasoAPasoPorSlug } from "@/content/guias/paso-a-paso";
import { guiaDePais, guiaPorPath, guiasDePais, indiceGuias } from "@/lib/guias";
import { metadataDeGuia } from "@/lib/guias/metadata";
import { GUIAS_PASO_A_PASO_PE, guiaPasoAPasoPePorSlug } from "@/lib/guias/paso-a-paso-pe";
import { GUIAS_PASO_A_PASO_CO, guiaPasoAPasoCoPorSlug } from "@/lib/guias/paso-a-paso-co";
import { GUIAS_PASO_A_PASO_MX, guiaPasoAPasoMxPorSlug } from "@/lib/guias/paso-a-paso-mx";
import { GUIAS_PASO_A_PASO_AR, guiaPasoAPasoArPorSlug } from "@/lib/guias/paso-a-paso-ar";
import { metadataDeGuiaPasoAPaso } from "@/lib/guias/paso-a-paso-seo";
import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const revalidate = false;
export const dynamicParams = false;

type Params = { pais: string; slug: string };

function buscarGuiaPasoAPasoPais(pais: string, slug: string): GuiaPasoAPaso | undefined {
  if (pais === "pe") return guiaPasoAPasoPePorSlug(slug);
  if (pais === "co") return guiaPasoAPasoCoPorSlug(slug);
  if (pais === "mx") return guiaPasoAPasoMxPorSlug(slug);
  if (pais === "ar") return guiaPasoAPasoArPorSlug(slug);
  return undefined;
}

function resumenDeGuiaPasoAPaso(guia: GuiaPasoAPaso, path: string): RelacionadaResumen {
  return {
    slug: guia.slug,
    path,
    h1: guia.h1,
    subtitle: guia.subtitle,
    herramienta: guia.herramienta,
    nivel: guia.nivel,
  };
}

function mapaRelacionadasPais(pais: string, slugs: readonly string[]): Record<string, RelacionadaResumen> {
  const mapa: Record<string, RelacionadaResumen> = {};
  for (const slug of slugs) {
    const local = buscarGuiaPasoAPasoPais(pais, slug);
    if (local) {
      mapa[slug] = resumenDeGuiaPasoAPaso(local, `/${pais}/guias/${local.slug}`);
      continue;
    }
    const pasoCl = guiaPasoAPasoPorSlug(slug);
    if (pasoCl) {
      mapa[slug] = resumenDeGuiaPasoAPaso(pasoCl, `/guias/${pasoCl.slug}`);
      continue;
    }
    const legacy = guiaPorPath(`/guias/${slug}`);
    if (legacy) {
      mapa[slug] = {
        slug: legacy.slug,
        path: legacy.path,
        h1: legacy.h1,
      };
    }
  }
  return mapa;
}

/**
 * Guías por país. Devuelve también `pais` porque este page genera los dos
 * segmentos: solo existen los pares país × guía que tienen contenido.
 */
export function generateStaticParams(): Params[] {
  const mdParams = PAISES_CARPETA.flatMap((pais) =>
    guiasDePais(pais.iso).map((guia) => ({ pais: pais.iso, slug: guia.slug }))
  );
  const pasoPeParams = GUIAS_PASO_A_PASO_PE.map((g) => ({ pais: "pe", slug: g.slug }));
  const pasoCoParams = GUIAS_PASO_A_PASO_CO.map((g) => ({ pais: "co", slug: g.slug }));
  const pasoMxParams = GUIAS_PASO_A_PASO_MX.map((g) => ({ pais: "mx", slug: g.slug }));
  const pasoArParams = GUIAS_PASO_A_PASO_AR.map((g) => ({ pais: "ar", slug: g.slug }));
  return [
    ...mdParams,
    ...pasoPeParams,
    ...pasoCoParams,
    ...pasoMxParams,
    ...pasoArParams,
  ];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { pais, slug } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) return {};
  const guiaPaso = buscarGuiaPasoAPasoPais(pais, slug);
  if (guiaPaso) return metadataDeGuiaPasoAPaso(guiaPaso);
  const guia = guiaDePais(pais, slug);
  if (!guia) return {};
  return metadataDeGuia(guia, esIndexable(pais));
}

export default async function GuiaPaisPage({ params }: { params: Promise<Params> }) {
  const { pais, slug } = await params;
  if (!esIsoPais(pais) || pais === ISO_CHILE) notFound();

  const guiaPaso = buscarGuiaPasoAPasoPais(pais, slug);
  if (guiaPaso) {
    return (
      <>
        <GuiaPasoAPasoLayout
          guia={guiaPaso}
          relacionadasMap={mapaRelacionadasPais(pais, guiaPaso.relacionadas)}
        />
        <TestimoniosDeCurso cursoSlug={guiaPaso.curso} variante="compacta" />
      </>
    );
  }

  const guia = guiaDePais(pais, slug);
  if (!guia) notFound();
  const relacionadas = guiasDePais(pais).filter((otra) => otra.path !== guia.path);
  return (
    <>
      <GuiaPage
        guia={guia}
        rutaIndice={indiceGuias(pais)}
        nombreMercado={getPais(pais).nombre}
        relacionadas={relacionadas}
      />
      {/* Mismo bloque que la guía raíz; se oculta si el curso no tiene citas. */}
      <TestimoniosDeCurso cursoSlug={guia.course} variante="compacta" />
    </>
  );
}
