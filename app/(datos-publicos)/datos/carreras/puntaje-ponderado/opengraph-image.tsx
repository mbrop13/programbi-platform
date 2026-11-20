import { ImageResponse } from "next/og";
import { loadLogoDataUrl } from "@/lib/og/assets";
import { OG_HEADERS, renderOgCard } from "@/lib/datos/og-card";
import { getMetaCarreras, getProgramasCarrera } from "@/lib/datos/carreras";

export const dynamic = "force-static";
export const alt = "Calculadora de puntaje ponderado PAES | ProgramBI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await loadLogoDataUrl();
  const meta = getMetaCarreras();
  // Ponderaciones REALES del programa por defecto de CalculadoraPonderado:
  // Ingeniería Civil Industrial (U) con ponderación NEM publicada.
  const programa = getProgramasCarrera("ingenieria-civil-industrial").find(
    (p) => p.tipo === "u" && p.ponderaciones.nem > 0
  );
  const w = programa?.ponderaciones;
  const tieneHistoria = (w?.historia ?? 0) > 0;
  const tieneCiencias = (w?.ciencias ?? 0) > 0;

  return new ImageResponse(
    renderOgCard({
      titulo: "Calculadora de puntaje ponderado PAES",
      cifra: programa && w ? `${w.nem} %` : undefined,
      cifraLabel:
        programa && w ? `ponderación NEM · ${programa.institucion}` : undefined,
      subtitulo:
        "Simula tu puntaje ponderado con NEM, Ranking y PAES según las ponderaciones reales de cada programa universitario.",
      badge: `Simulador PAES · Edición ${meta.edicion}`,
      miniVisual:
        w && (w.lenguaje > 0 || w.mate1 > 0 || tieneHistoria || tieneCiencias)
          ? {
              tipo: "barras",
              caption: "Ponderaciones del programa de ejemplo (%)",
              barras: [
                { label: "NEM", valor: w.nem, valorTexto: `${w.nem} %` },
                { label: "Ranking", valor: w.ranking, valorTexto: `${w.ranking} %` },
                { label: "Lenguaje", valor: w.lenguaje, valorTexto: `${w.lenguaje} %` },
                { label: "Matemática 1", valor: w.mate1, valorTexto: `${w.mate1} %` },
                ...(tieneHistoria && tieneCiencias
                  ? [
                      {
                        label: "Historia o Ciencias",
                        valor: Math.max(w.historia, w.ciencias),
                        valorTexto: `${Math.max(w.historia, w.ciencias)} %`,
                      },
                    ]
                  : tieneHistoria
                    ? [{ label: "Historia", valor: w.historia, valorTexto: `${w.historia} %` }]
                    : tieneCiencias
                      ? [{ label: "Ciencias", valor: w.ciencias, valorTexto: `${w.ciencias} %` }]
                      : []),
              ],
            }
          : undefined,
      logoSrc,
      fuente: "Fuente: www.mifuturo.cl (Mineduc) · Buscador de Carreras",
      urlCorta: "programbi.com/datos/carreras/puntaje-ponderado",
    }),
    { width: 1200, height: 630, headers: OG_HEADERS }
  );
}
