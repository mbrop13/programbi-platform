"use client";

/**
 * Hoja A4 editorial del «Temario y precios» (794 × 1123 px, equivalente a
 * 210 × 297 mm a 96 dpi). Todas las medidas van inline para que la vista
 * previa, la captura con `html-to-image` y el PDF midan exactamente lo mismo,
 * sin depender de Tailwind ni de variables del tema.
 *
 * Estructura vertical: filete de acento, cabecera de marca, cuerpo flexible y
 * pie común fijo al fondo (por flujo flex, no absoluto). El pie es idéntico en
 * todas las hojas: «ProgramBI · Temario y precios · {title}» a la izquierda,
 * la edición al centro y la paginación a la derecha, separado por un hairline.
 */

import type { CSSProperties, JSX, ReactNode } from "react";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import {
  A4,
  FONT_SANS,
  SHADOW_SHEET,
  SPACE,
  T,
  TYPE,
  accentOf,
} from "@/lib/brochure/brochure-theme";
import { BrochureBrandHeader } from "./BrochureBrandHeader";

export type BrochureA4SheetProps = {
  data: CourseBrochureData;
  pageNumber: number;
  totalPages: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function BrochureA4Sheet({
  data,
  pageNumber,
  totalPages,
  children,
  className,
  style,
}: BrochureA4SheetProps): JSX.Element {
  const acento = accentOf(data.accentColor);

  const raiz: CSSProperties = {
    width: A4.w,
    height: A4.h,
    backgroundColor: T.paper,
    color: T.ink,
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${T.line}`,
    borderRadius: 2,
    boxShadow: SHADOW_SHEET,
    fontFamily: FONT_SANS,
    flexShrink: 0,
  };

  /** Filete superior: único acento a sangre de la hoja. */
  const filete: CSSProperties = {
    height: 6,
    flexShrink: 0,
    backgroundColor: acento,
  };

  const cabecera: CSSProperties = {
    padding: `${SPACE[5]}px ${A4.margin}px 0`,
    flexShrink: 0,
  };

  const cuerpo: CSSProperties = {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    padding: `${SPACE[4]}px ${A4.margin}px ${SPACE[3]}px`,
    overflow: "hidden",
  };

  const pie: CSSProperties = {
    margin: `0 ${A4.margin}px`,
    padding: `${SPACE[3]}px 0 ${SPACE[4]}px`,
    borderTop: `1px solid ${T.line}`,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
    alignItems: "center",
    columnGap: SPACE[3],
    fontSize: TYPE.small.size,
    lineHeight: 1.3,
    color: T.mute,
    flexShrink: 0,
  };

  const pieTitulo: CSSProperties = {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const pieEdicion: CSSProperties = {
    justifySelf: "center",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  const piePagina: CSSProperties = {
    justifySelf: "end",
    textAlign: "right",
    whiteSpace: "nowrap",
    color: T.inkSoft,
    fontWeight: 500,
  };

  return (
    <div
      data-brochure-sheet={pageNumber}
      id={`brochure-page-${pageNumber}`}
      data-page-number={pageNumber}
      className={className ? `brochure-a4-sheet ${className}` : "brochure-a4-sheet"}
      style={{ ...raiz, ...style }}
    >
      <div aria-hidden="true" style={filete} />

      <header style={cabecera}>
        <BrochureBrandHeader data={data} />
      </header>

      <main style={cuerpo}>{children}</main>

      <footer style={pie}>
        <span
          style={pieTitulo}
          title={`ProgramBI · Temario y precios · ${data.title}`}
        >
          {`ProgramBI · Temario y precios · ${data.title}`}
        </span>

        <span style={pieEdicion}>
          {`Edición ${data.paisNombre} · ${data.moneda}`}
        </span>

        <span style={piePagina}>
          {`Página ${pageNumber} de ${totalPages}`}
        </span>
      </footer>
    </div>
  );
}
