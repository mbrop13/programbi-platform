"use client";

/**
 * Cabecera de marca de las hojas del «Temario y precios».
 *
 * Pinta el wordmark real (PNG local, same-origin) y el bloque editorial de la
 * derecha: kicker «TEMARIO Y PRECIOS · {PAÍS}» con el punto del acento del
 * curso y la fecha de actualización. La variante «cover» (logo más grande y
 * categoría) queda disponible para portadas que no traigan su propia marca.
 *
 * Sin posicionamiento absoluto: la altura la define el contenido, así la hoja
 * A4 nunca colapsa ni se solapa con el cuerpo.
 */

import type { CSSProperties, JSX } from "react";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import { T, TYPE, accentOf } from "@/lib/brochure/brochure-theme";

export type BrochureBrandHeaderProps = {
  data: CourseBrochureData;
  variant?: "default" | "cover";
};

/** Wordmark «DATA & AI ACADEMY» en versalitas bajo el logo. */
const LEMA = "DATA & AI ACADEMY";

export function BrochureBrandHeader({
  data,
  variant = "default",
}: BrochureBrandHeaderProps): JSX.Element {
  const esPortada = variant === "cover";
  const altoLogo = esPortada ? 44 : 30;
  const acento = accentOf(data.accentColor);

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
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: T.mute,
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

  const kicker: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: TYPE.kicker.size,
    lineHeight: TYPE.kicker.line,
    fontWeight: TYPE.kicker.weight,
    letterSpacing: TYPE.kicker.tracking,
    textTransform: "uppercase",
    color: T.ink,
    whiteSpace: "nowrap",
  };

  const punto: CSSProperties = {
    display: "block",
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: acento,
    flexShrink: 0,
  };

  const categoria: CSSProperties = {
    fontSize: 10.5,
    lineHeight: 1.2,
    letterSpacing: "0.14em",
    fontWeight: 600,
    textTransform: "uppercase",
    color: T.inkSoft,
    whiteSpace: "nowrap",
  };

  const actualizado: CSSProperties = {
    fontSize: TYPE.small.size,
    lineHeight: 1.2,
    letterSpacing: "0.02em",
    color: T.mute,
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
        <span style={kicker}>
          <span aria-hidden="true" style={punto} />
          {`Temario y precios · ${data.paisNombre.toUpperCase()}`}
        </span>

        {esPortada ? (
          <span style={categoria}>{data.categoryLabel.toUpperCase()}</span>
        ) : null}

        <span style={actualizado}>{`Actualizado ${data.actualizado}`}</span>
      </div>
    </div>
  );
}
