"use client";

/**
 * Hoja A4 editorial del brochure (794 × 1123 px, equivalente a 210 × 297 mm
 * a 96 dpi). Todas las medidas van inline para que la vista previa, la captura
 * con `html-to-image` y el PDF midan exactamente lo mismo, sin depender de
 * Tailwind ni de variables del tema.
 *
 * Estructura vertical: barra de acento, cabecera institucional, cuerpo
 * flexible y pie fijo al fondo (por flujo flex, no absoluto).
 */

import type { CSSProperties, JSX, ReactNode } from "react";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import { BrochureBrandHeader } from "./BrochureBrandHeader";

export type BrochureA4SheetProps = {
  data: CourseBrochureData;
  pageNumber: number;
  totalPages: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const ANCHO_A4 = 794;
const ALTO_A4 = 1123;
const PAPEL = "#FAF9F5";
const TINTA = "#141519";
const APAGADO = "#77786F";
const LINEA = "#E7E4DA";
const FUENTE = '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export function BrochureA4Sheet({
  data,
  pageNumber,
  totalPages,
  children,
  className,
  style,
}: BrochureA4SheetProps): JSX.Element {
  const raiz: CSSProperties = {
    width: ANCHO_A4,
    height: ALTO_A4,
    backgroundColor: PAPEL,
    color: TINTA,
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${LINEA}`,
    borderRadius: 2,
    boxShadow:
      "0 30px 70px rgba(10,12,16,0.35), 0 1px 0 rgba(255,255,255,0.5) inset",
    fontFamily: FUENTE,
    flexShrink: 0,
  };

  const barra: CSSProperties = {
    height: 6,
    flexShrink: 0,
    backgroundColor: data.accentColor,
  };

  const cabecera: CSSProperties = {
    padding: "26px 46px 0",
    flexShrink: 0,
  };

  const cuerpo: CSSProperties = {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    padding: "18px 46px 14px",
    overflow: "hidden",
  };

  const pie: CSSProperties = {
    margin: "0 46px",
    padding: "14px 0 16px",
    borderTop: `1px solid ${LINEA}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 11,
    lineHeight: 1.25,
    color: APAGADO,
    letterSpacing: "0.02em",
    flexShrink: 0,
  };

  const pieIzquierda: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    minWidth: 0,
  };

  const barrita: CSSProperties = {
    display: "block",
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: data.accentColor,
    flexShrink: 0,
  };

  const pieDerecha: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 2,
    textAlign: "right",
    whiteSpace: "nowrap",
  };

  return (
    <div
      data-brochure-sheet={pageNumber}
      id={`brochure-page-${pageNumber}`}
      data-page-number={pageNumber}
      className={className ? `brochure-a4-sheet ${className}` : "brochure-a4-sheet"}
      style={{ ...raiz, ...style }}
    >
      <div aria-hidden="true" style={barra} />

      <header style={cabecera}>
        <BrochureBrandHeader data={data} />
      </header>

      <main style={cuerpo}>{children}</main>

      <footer style={pie}>
        <div style={pieIzquierda}>
          <span aria-hidden="true" style={barrita} />
          <span style={{ whiteSpace: "nowrap" }}>
            ProgramBI · Escuela de Datos & IA en Vivo
          </span>
        </div>

        <span style={{ letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
          programbi.com
        </span>

        <div style={pieDerecha}>
          <span>
            Edición {data.paisNombre} · {data.moneda}
          </span>
          <span>
            Página {pageNumber} de {totalPages}
          </span>
        </div>
      </footer>
    </div>
  );
}
