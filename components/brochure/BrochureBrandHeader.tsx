"use client";

/**
 * Cabecera institucional del brochure.
 *
 * Pinta el wordmark real de la marca (PNG local, same-origin) y el bloque de
 * metadatos editoriales: insignia de país, categoría (solo portada) y fecha de
 * actualización. No usa posicionamiento absoluto: la altura la define el
 * contenido, así la hoja A4 nunca colapsa ni se solapa con el cuerpo.
 */

import type { CSSProperties, JSX } from "react";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";

export type BrochureBrandHeaderProps = {
  data: CourseBrochureData;
  variant?: "default" | "cover";
};

const TINTA = "#141519";
const APAGADO = "#77786F";
const BORDE = "#D9D4C6";

/** Wordmark «DATA & AI ACADEMY» en versalitas bajo el logo. */
const LEMA = "DATA & AI ACADEMY";

export function BrochureBrandHeader({
  data,
  variant = "default",
}: BrochureBrandHeaderProps): JSX.Element {
  const esPortada = variant === "cover";
  const altoLogo = esPortada ? 44 : 30;

  // El contrato garantiza `brandLogoUrl`; el nav se usa solo como respaldo.
  const logoSrc = data.brandLogoUrl || data.brandLogoNavUrl;

  const fila: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 16,
  };

  const marca: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: 0,
    flexShrink: 1,
  };

  const logo: CSSProperties = {
    height: altoLogo,
    width: "auto",
    maxWidth: esPortada ? 232 : 168,
    objectFit: "contain",
    display: "block",
  };

  const lema: CSSProperties = {
    marginTop: 4,
    fontSize: 6.8,
    lineHeight: 1.2,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    color: APAGADO,
    whiteSpace: "nowrap",
  };

  const bloqueDerecho: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: esPortada ? 6 : 5,
    textAlign: "right",
    flexShrink: 0,
  };

  const insignia: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    border: `1px solid ${BORDE}`,
    padding: "4px 9px",
    borderRadius: 999,
    fontSize: esPortada ? 7.2 : 6.8,
    lineHeight: 1.2,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: TINTA,
    whiteSpace: "nowrap",
  };

  const punto: CSSProperties = {
    display: "block",
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: data.accentColor,
    flexShrink: 0,
  };

  const categoria: CSSProperties = {
    fontSize: 6.8,
    lineHeight: 1.2,
    letterSpacing: 1.8,
    fontWeight: 600,
    textTransform: "uppercase",
    color: TINTA,
    whiteSpace: "nowrap",
  };

  const actualizado: CSSProperties = {
    fontSize: 7,
    lineHeight: 1.2,
    letterSpacing: 0.3,
    color: APAGADO,
    whiteSpace: "nowrap",
  };

  return (
    <div style={fila}>
      <div style={marca}>
        <img
          src={logoSrc}
          alt="ProgramBI"
          crossOrigin="anonymous"
          style={logo}
        />
        <span style={lema}>{LEMA}</span>
      </div>

      <div style={bloqueDerecho}>
        <span style={insignia}>
          <span aria-hidden="true" style={punto} />
          {`BROCHURE OFICIAL DE PROGRAMA · ${data.paisNombre.toUpperCase()}`}
        </span>

        {esPortada ? (
          <span style={categoria}>{data.categoryLabel.toUpperCase()}</span>
        ) : null}

        <span style={actualizado}>{`Actualizado ${data.actualizado}`}</span>
      </div>
    </div>
  );
}
