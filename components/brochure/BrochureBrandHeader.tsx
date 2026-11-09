"use client";

/**
 * Cabecera institucional del brochure.
 *
 * Pinta el wordmark real de la marca (PNG local, same-origin) y el bloque de
 * metadatos editoriales: insignia de país, categoría (solo portada) y fecha de
 * actualización. No usa posicionamiento absoluto: la altura la define el
 * contenido, así la hoja A4 nunca colapsa ni se solapa con el cuerpo.
 *
 * Tipografía mínima de 10.5px en toda la cabecera para que la captura A4 y el
 * PDF se lean igual de bien que la vista en pantalla.
 */

import type { CSSProperties, JSX } from "react";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";

export type BrochureBrandHeaderProps = {
  data: CourseBrochureData;
  variant?: "default" | "cover";
};

const TINTA = "#141519";
const TENUE = "#77786F";
const BORDE = "#D9D4C6";
const PAPEL = "#FAF9F5";

/** Wordmark «DATA & AI ACADEMY» en versalitas bajo el logo. */
const LEMA = "DATA & AI ACADEMY";

/** Luminancia relativa WCAG de un color hex de seis dígitos. */
function luminancia(hex: string): number {
  const limpio = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(limpio)) return 0;
  const canales = [0, 2, 4].map((inicio) => {
    const valor = parseInt(limpio.slice(inicio, inicio + 2), 16) / 255;
    return valor <= 0.03928
      ? valor / 12.92
      : Math.pow((valor + 0.055) / 1.055, 2.4);
  });
  return (
    0.2126 * (canales[0] ?? 0) +
    0.7152 * (canales[1] ?? 0) +
    0.0722 * (canales[2] ?? 0)
  );
}

/**
 * El acento manda en la cabecera salvo que quede por debajo de 3:1 contra el
 * papel (el amarillo de Power BI, por ejemplo): ahí el texto pasa a tinta y el
 * color se conserva en el punto de la insignia.
 */
function acentoLegible(acento: string): string {
  const frente = luminancia(acento);
  const fondo = luminancia(PAPEL);
  const contraste = (Math.max(frente, fondo) + 0.05) / (Math.min(frente, fondo) + 0.05);
  return contraste >= 3 ? acento : TINTA;
}

export function BrochureBrandHeader({
  data,
  variant = "default",
}: BrochureBrandHeaderProps): JSX.Element {
  const esPortada = variant === "cover";
  const altoLogo = esPortada ? 44 : 30;
  const colorInsignia = acentoLegible(data.accentColor);

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
    marginTop: 3,
    fontSize: 10.5,
    lineHeight: 1.2,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: TENUE,
    whiteSpace: "nowrap",
  };

  const bloqueDerecho: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: esPortada ? 5 : 4,
    textAlign: "right",
    flexShrink: 0,
  };

  const insignia: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: `1px solid ${BORDE}`,
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 10.5,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: colorInsignia,
    whiteSpace: "nowrap",
  };

  const punto: CSSProperties = {
    display: "block",
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: data.accentColor,
    flexShrink: 0,
  };

  const categoria: CSSProperties = {
    fontSize: 11,
    lineHeight: 1.2,
    letterSpacing: "0.14em",
    fontWeight: 600,
    textTransform: "uppercase",
    color: TINTA,
    whiteSpace: "nowrap",
  };

  const actualizado: CSSProperties = {
    fontSize: 11,
    lineHeight: 1.2,
    letterSpacing: "0.02em",
    color: TENUE,
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
