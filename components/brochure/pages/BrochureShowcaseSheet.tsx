"use client";

/**
 * Hoja 4 del temario — «Proyectos y certificado».
 *
 * Tres bloques editoriales sobre papel blanco:
 *   1. Los cuatro pilares de la metodología en vivo (`methodologyPillars`) en
 *      grilla 2×2, con el número de paso grande en el acento del curso.
 *   2. Galería de proyectos reales (`galleryImages`, hasta 4) en mosaico de
 *      columnas desiguales, radio 12 y pie de foto pequeño.
 *   3. Bloque del certificado, solo texto: qué se entrega al finalizar y sus
 *      condiciones, sin sellos ni códigos inventados.
 *
 * Todo el contenido sale de `CourseBrochureData`; las imágenes son locales
 * (same-origin) para que la captura del PDF pueda rasterizarlas sin CORS.
 * Medidas y colores van inline con los tokens de `brochure-theme` para que la
 * vista previa y la captura A4 midan exactamente lo mismo.
 */

import type { CSSProperties, JSX, ReactNode } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import {
  FONT_DISPLAY,
  FONT_SANS,
  RADIUS,
  T,
  accentOf,
  tint,
} from "@/lib/brochure/brochure-theme";

export type BrochureShowcaseSheetProps = {
  data: CourseBrochureData;
  pageNumber: number;
  totalPages: number;
};

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

/**
 * Acento legible sobre papel blanco: si el color del curso no alcanza 3:1
 * (el amarillo de Power BI), el texto pasa a tinta y el acento se reserva a
 * filetes y fondos suaves.
 */
function acentoLegible(acento: string): string {
  const frente = luminancia(acento);
  const fondo = luminancia(T.paper);
  const contraste =
    (Math.max(frente, fondo) + 0.05) / (Math.min(frente, fondo) + 0.05);
  return contraste >= 3 ? acento : T.ink;
}

/** Check de 15 px en el acento del curso, sin depender de glifos del sistema. */
function CheckAcento({ accent }: { accent: string }): JSX.Element {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ display: "block", flex: "0 0 auto", marginTop: 1 }}
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        fill={tint(accent, 0.08)}
        stroke={tint(accent, 0.4)}
        strokeWidth="1"
      />
      <path
        d="M4.6 8.2 6.9 10.5 11.4 5.6"
        fill="none"
        stroke={accent}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Rótulo de sección con hairline a la derecha. */
function RotuloSeccion({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          fontSize: 10.5,
          lineHeight: 1.2,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: T.mute,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        style={{ flex: 1, height: 1, backgroundColor: T.line }}
      />
    </div>
  );
}

export function BrochureShowcaseSheet({
  data,
  pageNumber,
  totalPages,
}: BrochureShowcaseSheetProps): JSX.Element {
  const accent = accentOf(data.accentColor);
  const accentTexto = acentoLegible(accent);

  // Cuatro pilares, como máximo, para que la grilla 2×2 no crezca.
  const pilares = data.methodologyPillars.slice(0, 4);
  // Hasta cuatro capturas; el mosaico adapta columnas y alto a la cantidad.
  const galeria = data.galleryImages.slice(0, 4);

  const columnasGaleria =
    galeria.length >= 4
      ? "1.28fr 1fr 1fr 1fr"
      : galeria.length === 3
        ? "1.45fr 1fr 1fr"
        : `repeat(${Math.max(1, galeria.length)}, minmax(0, 1fr))`;

  const altoGaleria =
    galeria.length >= 4
      ? 116
      : galeria.length === 3
        ? 132
        : galeria.length === 2
          ? 168
          : 206;

  const contenido: CSSProperties = {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 22,
    fontFamily: FONT_SANS,
    color: T.ink,
  };

  const kicker: CSSProperties = {
    margin: 0,
    fontSize: 10.5,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: accentTexto,
  };

  const titulo: CSSProperties = {
    margin: "7px 0 0",
    fontFamily: FONT_DISPLAY,
    fontSize: 32,
    lineHeight: 1.08,
    letterSpacing: "-0.5px",
    fontWeight: 700,
    color: T.ink,
  };

  const subtitulo: CSSProperties = {
    margin: "8px 0 0",
    fontSize: 13.5,
    lineHeight: 1.5,
    color: T.mute,
  };

  const grillaPilares: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px 16px",
    marginTop: 12,
  };

  const tarjetaPilar: CSSProperties = {
    boxSizing: "border-box",
    minWidth: 0,
    padding: "16px 18px 17px",
    border: `1px solid ${T.line}`,
    borderRadius: RADIUS.card,
    backgroundColor: T.wash,
  };

  const filaPilar: CSSProperties = {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    minWidth: 0,
  };

  const numeroPilar: CSSProperties = {
    flexShrink: 0,
    fontFamily: FONT_DISPLAY,
    fontSize: 36,
    lineHeight: 1,
    letterSpacing: "-0.02em",
    fontWeight: 700,
    color: accentTexto,
  };

  const tituloPilar: CSSProperties = {
    margin: 0,
    minWidth: 0,
    fontSize: 15,
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
    fontWeight: 700,
    color: T.ink,
  };

  const textoPilar: CSSProperties = {
    margin: "7px 0 0",
    fontSize: 12.8,
    lineHeight: 1.48,
    color: T.mute,
  };

  const mosaico: CSSProperties = {
    display: "grid",
    gridTemplateColumns: columnasGaleria,
    gap: 10,
    marginTop: 12,
  };

  const figura: CSSProperties = {
    margin: 0,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${T.line}`,
    borderRadius: RADIUS.image,
    overflow: "hidden",
    backgroundColor: T.paper,
  };

  const imagen: CSSProperties = {
    width: "100%",
    height: altoGaleria,
    objectFit: "cover",
    display: "block",
  };

  const pieFoto: CSSProperties = {
    ...clamp(2),
    padding: "7px 10px 9px",
    fontSize: 10.5,
    lineHeight: 1.3,
    color: T.mute,
    backgroundColor: T.paper,
  };

  const tarjetaCertificado: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    alignItems: "stretch",
    gap: 22,
    marginTop: 12,
    padding: "18px 20px 17px",
    border: `1px solid ${T.line}`,
    borderLeft: `3px solid ${accent}`,
    borderRadius: RADIUS.card,
    backgroundColor: T.wash,
  };

  const chipCertificado: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: RADIUS.chip,
    backgroundColor: tint(accent, 0.1),
    color: accentTexto,
    fontSize: 10.5,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  };

  const tituloCertificado: CSSProperties = {
    ...clamp(2),
    margin: "9px 0 0",
    fontFamily: FONT_DISPLAY,
    fontSize: 23,
    lineHeight: 1.15,
    letterSpacing: "-0.3px",
    fontWeight: 700,
    color: T.ink,
  };

  const textoCertificado: CSSProperties = {
    margin: "7px 0 0",
    fontSize: 12.5,
    lineHeight: 1.5,
    color: T.mute,
  };

  const edicionCertificado: CSSProperties = {
    margin: "10px 0 0",
    fontSize: 10.5,
    lineHeight: 1.2,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: T.mute,
  };

  const columnaDerecha: CSSProperties = {
    flexShrink: 0,
    width: 236,
    boxSizing: "border-box",
    paddingLeft: 20,
    borderLeft: `1px solid ${T.line}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 9,
  };

  const hecho: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    minWidth: 0,
  };

  const hechoTexto: CSSProperties = {
    fontSize: 11.5,
    lineHeight: 1.35,
    color: T.inkSoft,
  };

  const hechos = [
    "Certificado digital verificable",
    "Emitido por ProgramBI",
    "Grabaciones de por vida",
  ];

  return (
    <BrochureA4Sheet
      data={data}
      pageNumber={pageNumber}
      totalPages={totalPages}
      className="brochure-showcase-sheet"
    >
      <div style={contenido}>
        {/* 1. Cabecera editorial */}
        <header style={{ flexShrink: 0 }}>
          <p style={kicker}>METODOLOGÍA Y RESULTADOS</p>
          <h2 style={titulo}>Proyectos reales y certificado</h2>
          <p style={subtitulo}>
            Cada clase en vivo termina en un entregable aplicado a un caso real
            de negocio.
          </p>
        </header>

        {/* 2. Los cuatro pilares de la metodología */}
        {pilares.length > 0 ? (
          <section style={{ flexShrink: 0 }}>
            <RotuloSeccion>Los cuatro pilares</RotuloSeccion>

            <div style={grillaPilares}>
              {pilares.map((pilar, indice) => (
                <article
                  key={pilar.step}
                  style={{
                    ...tarjetaPilar,
                    gridColumn:
                      pilares.length % 2 === 1 &&
                      indice === pilares.length - 1
                        ? "1 / -1"
                        : undefined,
                  }}
                >
                  <div style={filaPilar}>
                    <span style={numeroPilar}>{pilar.step}</span>
                    <h3 style={tituloPilar}>{pilar.title}</h3>
                  </div>
                  <p style={textoPilar}>{pilar.description}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {/* 3. Galería de proyectos y entregables reales */}
        {galeria.length > 0 ? (
          <section style={{ flexShrink: 0 }}>
            <RotuloSeccion>Proyectos y entregables</RotuloSeccion>

            <div style={mosaico}>
              {galeria.map((captura, indice) => (
                <figure key={`${captura.src}-${indice}`} style={figura}>
                  <img
                    src={captura.src}
                    alt={captura.title}
                    crossOrigin="anonymous"
                    style={imagen}
                  />
                  <figcaption style={pieFoto}>{captura.title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* 4. Certificado: solo texto, sin imágenes ni códigos inventados */}
        <section style={{ flexShrink: 0 }}>
          <RotuloSeccion>Certificado</RotuloSeccion>

          <div style={tarjetaCertificado}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={chipCertificado}>Certificado de finalización</span>

              <div style={tituloCertificado}>{data.title}</div>

              <p style={textoCertificado}>
                Al completar el programa recibes tu certificado digital con
                código de verificación, además de las grabaciones de todas las
                clases.
              </p>

              <div style={edicionCertificado}>
                {`ProgramBI · Edición ${data.paisNombre}`}
              </div>
            </div>

            <div style={columnaDerecha}>
              {hechos.map((texto) => (
                <div key={texto} style={hecho}>
                  <CheckAcento accent={accentTexto} />
                  <span style={hechoTexto}>{texto}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </BrochureA4Sheet>
  );
}
