"use client";

/**
 * Hoja 1 — Portada de «Temario y precios».
 *
 * Orden editorial: filete del acento (lo pinta la hoja A4), logo y fecha de
 * actualización, kicker de edición, título display, bajada, fila de cuatro
 * datos con hairlines verticales (sin cajas), imagen hero con chips del stack,
 * «Lo que vas a lograr» y franja de empresas en gris.
 *
 * Todo el estilo va inline para que la captura `html-to-image` mida exactamente
 * lo mismo que la vista. El alto útil real es ≈ 1019 px (A4 1123 − filete −
 * pie − padding del cuerpo): el bloque se reparte con la imagen flexible y un
 * separador que absorbe el aire sobrante, de modo que ningún texto cae bajo el
 * pie ni se recorta cuando el título ocupa tres líneas.
 *
 * La portada dibuja su propia marca (logo grande + fecha) para que el filete
 * del acento y el kicker manden en la jerarquía; por eso oculta la cabecera
 * estándar que la hoja A4 coloca arriba.
 */

import type { CSSProperties, JSX } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import {
  A4,
  FONT_DISPLAY,
  FONT_SANS,
  RADIUS,
  SPACE,
  T,
  TYPE,
  accentOf,
  tint,
} from "@/lib/brochure/brochure-theme";

export type BrochureCoverSheetProps = {
  data: CourseBrochureData;
  pageNumber: number;
  totalPages: number;
};

/** Ancho útil del cuerpo (794 − 2 × 56), usado como medida de la bajada. */
const MEDIDA = A4.w - A4.margin * 2;

/** Escala de aire del sistema, con nombres legibles. */
const AIRE_XS = SPACE[1]; // 8
const AIRE_SM = SPACE[2]; // 12
const AIRE_MD = SPACE[3]; // 16
const AIRE_LG = SPACE[4]; // 24
const AIRE_XL = SPACE[5]; // 32

/** Recorte multílínea con prefijo webkit (Chromium y Safari). */
function clamp(lineas: number): CSSProperties {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lineas,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}

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

/** Contraste WCAG entre dos colores hex. */
function contraste(a: string, b: string): number {
  const la = luminancia(a);
  const lb = luminancia(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Acento para un glifo pequeño sobre papel blanco: si el color del curso no
 * alcanza 2.5:1 (el amarillo de Power BI), el trazo pasa a tinta y el acento
 * se reserva al fondo tintado del check.
 */
function acentoDeTrazo(acento: string): string {
  return contraste(acento, T.paper) >= 2.5 ? acento : T.ink;
}

export function BrochureCoverSheet({
  data,
  pageNumber,
  totalPages,
}: BrochureCoverSheetProps): JSX.Element {
  const acento = accentOf(data.accentColor);
  const colorTrazo = acentoDeTrazo(acento);
  const techStack = data.techStack.slice(0, 6);
  const companyLogos = data.companyLogos.slice(0, 6);
  const aprendizajes = data.whatYouLearn.slice(0, 4);

  const datos: { valor: string; etiqueta: string }[] = [
    { valor: `${data.hours}`, etiqueta: "Horas" },
    { valor: `${data.modulesCount}`, etiqueta: "Módulos" },
    {
      valor: `${data.levelsCount}`,
      etiqueta: data.levelsCount === 1 ? "Nivel" : "Niveles",
    },
    { valor: "Digital", etiqueta: "Certificado" },
  ];

  const contenido: CSSProperties = {
    height: "100%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    fontFamily: FONT_SANS,
    color: T.ink,
  };

  const marcaFila: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: AIRE_MD,
    flexShrink: 0,
  };

  const logo: CSSProperties = {
    height: 44,
    width: "auto",
    maxWidth: 240,
    objectFit: "contain",
    display: "block",
  };

  const actualizado: CSSProperties = {
    fontSize: TYPE.small.size,
    lineHeight: 1.3,
    letterSpacing: "0.02em",
    color: T.mute,
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  const kickerFila: CSSProperties = {
    marginTop: AIRE_XL,
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  };

  const kickerBarra: CSSProperties = {
    display: "block",
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: acento,
    flexShrink: 0,
  };

  const kickerTexto: CSSProperties = {
    fontSize: TYPE.kicker.size,
    lineHeight: TYPE.kicker.line,
    fontWeight: TYPE.kicker.weight,
    letterSpacing: TYPE.kicker.tracking,
    textTransform: "uppercase",
    color: T.ink,
  };

  const titulo: CSSProperties = {
    ...clamp(3),
    margin: `${AIRE_MD}px 0 0`,
    fontFamily: FONT_DISPLAY,
    fontSize: TYPE.hero.size,
    lineHeight: TYPE.hero.line,
    fontWeight: TYPE.hero.weight,
    letterSpacing: "-0.8px",
    color: T.ink,
    flexShrink: 0,
  };

  const descripcion: CSSProperties = {
    ...clamp(3),
    margin: "14px 0 0",
    maxWidth: MEDIDA,
    fontSize: TYPE.body.size,
    lineHeight: 1.6,
    fontWeight: TYPE.body.weight,
    color: T.inkSoft,
    flexShrink: 0,
  };

  const filaDatos: CSSProperties = {
    marginTop: AIRE_LG,
    paddingTop: AIRE_MD,
    borderTop: `1px solid ${T.line}`,
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    flexShrink: 0,
  };

  const datoCelda: CSSProperties = {
    minWidth: 0,
    paddingRight: AIRE_SM,
  };

  const datoValor: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: 34,
    lineHeight: 1.05,
    fontWeight: 700,
    letterSpacing: "-0.5px",
    color: T.ink,
  };

  const datoEtiqueta: CSSProperties = {
    marginTop: 5,
    fontSize: 10.5,
    lineHeight: 1.2,
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: T.mute,
    whiteSpace: "nowrap",
  };

  const hero: CSSProperties = {
    position: "relative",
    marginTop: AIRE_LG,
    flex: "3 1 260px",
    minHeight: 230,
    maxHeight: 400,
    borderRadius: RADIUS.image,
    border: `1px solid ${T.line}`,
    backgroundColor: T.wash,
    overflow: "hidden",
  };

  const heroImagen: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const heroVelo: CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(20,22,27,0) 50%, rgba(20,22,27,0.42) 100%)",
    pointerEvents: "none",
  };

  const modoPill: CSSProperties = {
    position: "absolute",
    top: AIRE_SM,
    left: AIRE_SM,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    borderRadius: RADIUS.chip,
    backgroundColor: "rgba(255,255,255,0.92)",
    color: T.ink,
    fontSize: 10,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    backdropFilter: "blur(6px)",
  };

  const puntoPill: CSSProperties = {
    display: "block",
    width: 5,
    height: 5,
    borderRadius: RADIUS.chip,
    backgroundColor: acento,
    flexShrink: 0,
  };

  const chips: CSSProperties = {
    position: "absolute",
    left: AIRE_SM,
    right: AIRE_SM,
    bottom: AIRE_SM,
    display: "flex",
    flexWrap: "wrap",
    gap: AIRE_XS,
  };

  const chip: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: RADIUS.chip,
    backgroundColor: "rgba(255,255,255,0.94)",
    border: "1px solid rgba(255,255,255,0.55)",
    color: T.ink,
    fontSize: 10.5,
    lineHeight: 1.2,
    fontWeight: 600,
    letterSpacing: "0.01em",
    backdropFilter: "blur(6px)",
  };

  const aire: CSSProperties = {
    flex: "1 0 24px",
    minHeight: AIRE_LG,
  };

  const logros: CSSProperties = {
    marginTop: AIRE_XL,
    flexShrink: 0,
  };

  const logrosTitulo: CSSProperties = {
    margin: 0,
    fontFamily: FONT_SANS,
    fontSize: TYPE.h2.size,
    lineHeight: TYPE.h2.line,
    fontWeight: TYPE.h2.weight,
    color: T.ink,
  };

  const logrosGrilla: CSSProperties = {
    marginTop: AIRE_SM,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    columnGap: AIRE_LG,
    rowGap: AIRE_SM,
  };

  const logro: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    minWidth: 0,
  };

  const checkCaja: CSSProperties = {
    flexShrink: 0,
    width: 16,
    height: 16,
    marginTop: 2,
    borderRadius: 4,
    backgroundColor: tint(acento, 0.14),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const logroTexto: CSSProperties = {
    ...clamp(2),
    minWidth: 0,
    fontSize: 12.5,
    lineHeight: 1.45,
    color: T.inkSoft,
  };

  const empresas: CSSProperties = {
    paddingTop: AIRE_MD,
    borderTop: `1px solid ${T.line}`,
    flexShrink: 0,
  };

  const empresasTitulo: CSSProperties = {
    fontSize: 10.5,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: T.mute,
    marginBottom: 10,
  };

  const empresasFila: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: AIRE_MD,
  };

  const empresaLogo: CSSProperties = {
    height: 22,
    width: "auto",
    maxWidth: 92,
    objectFit: "contain",
    display: "block",
    filter: "grayscale(1)",
    opacity: 0.8,
  };

  return (
    <BrochureA4Sheet
      data={data}
      pageNumber={pageNumber}
      totalPages={totalPages}
      className="brochure-cover-sheet"
    >
      {/* La portada trae su propia marca; se oculta la cabecera estándar de la
          hoja para no duplicar logo ni fecha. */}
      <style>{`.brochure-cover-sheet header { display: none !important; }`}</style>

      <div style={contenido}>
        <div style={marcaFila}>
          <img
            src={data.brandLogoUrl || data.brandLogoNavUrl}
            alt="ProgramBI"
            crossOrigin="anonymous"
            style={logo}
          />
          <span style={actualizado}>{`Actualizado ${data.actualizado}`}</span>
        </div>

        <div style={kickerFila}>
          <span aria-hidden="true" style={kickerBarra} />
          <span style={kickerTexto}>
            {`Temario y precios · Edición ${data.paisNombre}`}
          </span>
        </div>

        <h1 style={titulo}>{data.title}</h1>
        <p style={descripcion}>{data.shortDescription}</p>

        <div style={filaDatos}>
          {datos.map((dato, indice) => (
            <div
              key={dato.etiqueta}
              style={{
                ...datoCelda,
                ...(indice === 0
                  ? {}
                  : {
                      borderLeft: `1px solid ${T.line}`,
                      paddingLeft: AIRE_MD,
                    }),
              }}
            >
              <div style={datoValor}>{dato.valor}</div>
              <div style={datoEtiqueta}>{dato.etiqueta}</div>
            </div>
          ))}
        </div>

        <div style={hero}>
          <img
            src={data.imageUrl}
            alt={`${data.title} · ${data.categoryLabel} — ProgramBI`}
            crossOrigin="anonymous"
            style={heroImagen}
          />
          <div aria-hidden="true" style={heroVelo} />

          <span style={modoPill}>
            <span aria-hidden="true" style={puntoPill} />
            {data.modality}
          </span>

          <div style={chips}>
            {techStack.map((herramienta) => (
              <span key={herramienta} style={chip}>
                {herramienta}
              </span>
            ))}
          </div>
        </div>

        <section aria-label="Lo que vas a lograr" style={logros}>
          <h2 style={logrosTitulo}>Lo que vas a lograr</h2>

          <div style={logrosGrilla}>
            {aprendizajes.map((aprendizaje, indice) => (
              <div key={`${aprendizaje}-${indice}`} style={logro}>
                <span aria-hidden="true" style={checkCaja}>
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.2 6.3 4.7 8.8 9.8 3.4"
                      stroke={colorTrazo}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span style={logroTexto}>{aprendizaje}</span>
              </div>
            ))}
          </div>
        </section>

        <div aria-hidden="true" style={aire} />

        <div style={empresas}>
          <div style={empresasTitulo}>
            Equipos que se han capacitado con ProgramBI
          </div>
          <div style={empresasFila}>
            {companyLogos.map((empresa) => (
              <img
                key={empresa.name}
                src={empresa.logoUrl}
                alt={empresa.name}
                crossOrigin="anonymous"
                style={empresaLogo}
              />
            ))}
          </div>
        </div>
      </div>
    </BrochureA4Sheet>
  );
}
