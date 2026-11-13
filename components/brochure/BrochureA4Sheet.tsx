import type { CSSProperties, ReactNode } from "react";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import {
  A4,
  FONT_MONO,
  FONT_SANS,
  T,
  accentOf,
} from "@/lib/brochure/brochure-theme";
import { BrochureBrandHeader } from "./BrochureBrandHeader";

export type BrochureA4SheetProps = {
  pageNumber: number;
  totalPages: number;
  data: CourseBrochureData;
  isCover?: boolean;
  children: ReactNode;
  style?: CSSProperties;
};

/**
 * Contenedor A4 fijo a 96 dpi (794 × 1123 px).
 * Garantiza paridad visual 1:1 entre navegador, impresión y PDF descargado.
 */
export function BrochureA4Sheet({
  pageNumber,
  totalPages,
  data,
  isCover = false,
  children,
  style,
}: BrochureA4SheetProps) {
  const accent = accentOf(data.accentColor);

  return (
    <section
      data-brochure-sheet={pageNumber}
      aria-label={`${data.title} — Página ${pageNumber} de ${totalPages}`}
      className={isCover ? "brochure-a4-sheet brochure-cover-sheet" : "brochure-a4-sheet"}
      style={{
        width: A4.w,
        height: A4.h,
        minWidth: A4.w,
        maxWidth: A4.w,
        minHeight: A4.h,
        maxHeight: A4.h,
        background: T.paper,
        color: T.ink,
        fontFamily: FONT_SANS,
        fontSize: 13,
        lineHeight: 1.5,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        WebkitFontSmoothing: "antialiased",
        ...style,
      }}
    >
      {/* Filete superior sutil de marca: 3px de acento + línea estructural */}
      <div
        aria-hidden="true"
        style={{
          height: 3,
          width: "100%",
          background: T.obsidian,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 140,
            background: accent,
          }}
        />
      </div>

      {!isCover && <BrochureBrandHeader data={data} />}

      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          padding: isCover ? "0" : "22px 48px 18px",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>

      <footer
        style={{
          marginTop: "auto",
          padding: "11px 48px 16px",
          borderTop: `1px solid ${T.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          background: isCover ? T.paperWarm : T.paper,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: T.mute,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 380,
          }}
        >
          ProgramBI · Temario oficial · {data.title}
        </span>

        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: T.mute,
            whiteSpace: "nowrap",
          }}
        >
          Edición {data.paisNombre} ({data.moneda})
        </span>

        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            fontWeight: 600,
            color: T.ink,
            whiteSpace: "nowrap",
          }}
        >
          Página {pageNumber} de {totalPages}
        </span>
      </footer>
    </section>
  );
}
