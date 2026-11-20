import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OG_HEADERS, renderOgCard } from "@/lib/datos/og-card";
import { getMetaCarreras, TIPO_ETIQUETAS } from "@/lib/datos/carreras";
import { filasPreset, PRESETS_MAP, type PresetSlug } from "@/lib/datos/presets";

/**
 * OG compartida de las 6 vistas preset de /datos/carreras (T14).
 * Tarjeta unificada: fondo #f3f3f0, cifra grande del #1 + barras top 3.
 * Todas las cifras salen de filasPreset (JSON oficial, sin inventar datos).
 */
export async function renderPresetOgImage(slug: PresetSlug) {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();
  const def = PRESETS_MAP[slug];
  const filas = filasPreset(slug, slug === "mejor-pagadas" ? "u" : undefined).slice(0, 3);
  const top = filas[0];

  return new ImageResponse(
    renderOgCard({
      titulo: def.h1,
      cifra: top?.textoMetrica,
      cifraLabel: top
        ? `${def.columnaExtraLabel} · ${top.nombre} (${TIPO_ETIQUETAS[top.tipo].corto})`
        : undefined,
      subtitulo: `Edición ${meta.edicion} · top 3 de la vista`,
      badge: def.tituloCorto,
      miniVisual:
        filas.length > 0
          ? {
              tipo: "barras",
              caption: `${def.columnaExtraLabel} · top 3`,
              barras: filas.map((f) => ({
                label: `${f.nombre} (${TIPO_ETIQUETAS[f.tipo].corto})`,
                valor: f.valorMetrica ?? 0,
                valorTexto: f.textoMetrica,
              })),
            }
          : undefined,
      logoSrc,
      fuente: "Fuente: www.mifuturo.cl (Mineduc)",
      urlCorta: `programbi.com/datos/carreras/${slug}`,
    }),
    { width: 1200, height: 630, headers: OG_HEADERS }
  );
}
