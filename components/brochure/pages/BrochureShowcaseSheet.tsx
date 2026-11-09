"use client";

/**
 * Hoja 4 del brochure — Proyectos reales, competencias y certificado.
 *
 * Tres bloques editoriales con tipografía grande (nada bajo 10.5px):
 *   1. Competencias que dominarás (máx. 6, grilla de 2 columnas).
 *   2. Galería de capturas reales de clase (máx. 3, grilla adaptativa).
 *   3. Vista previa del certificado oficial con sello y código verificable.
 *
 * Todo el contenido sale de `CourseBrochureData`; las imágenes son locales
 * (same-origin) para que la captura del PDF pueda rasterizarlas sin CORS.
 */

import type { CSSProperties, JSX } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";

export type BrochureShowcaseSheetProps = {
  data: CourseBrochureData;
  pageNumber: number;
  totalPages: number;
};

const SANS = '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const DISPLAY = 'Georgia, "Times New Roman", serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

const TINTA = "#141519";
const GRIS = "#5C5D63";
const TENUE = "#77786F";
const LINEA = "#E7E4DA";
const LAVADO = "#F1EFE8";
const BLANCO = "#FFFFFF";

/** Kicker de la hoja: 11px bold uppercase en el acento del curso. */
const KICKER: CSSProperties = {
  margin: 0,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: TINTA,
};

/** Título H2 de la hoja: 31px DISPLAY bold. */
const TITULO: CSSProperties = {
  margin: "6px 0 0",
  fontFamily: DISPLAY,
  fontSize: 31,
  lineHeight: 1.1,
  letterSpacing: -0.4,
  fontWeight: 700,
  color: TINTA,
};

/** Subtítulo de la hoja: 14px, lectura cómoda. */
const SUBTITULO: CSSProperties = {
  margin: "7px 0 0",
  fontSize: 14,
  lineHeight: 1.5,
  color: GRIS,
};

/** Rótulo de sección: 11px bold uppercase TENUE. */
const ROTULO: CSSProperties = {
  margin: 0,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: TENUE,
};

/** Check de 16px en el acento del curso, sin depender de glifos del sistema. */
function CheckAcento({ accent }: { accent: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ display: "block", flex: "0 0 auto" }}
    >
      <circle cx="8" cy="8" r="7" fill={`${accent}1F`} stroke={`${accent}66`} strokeWidth="1" />
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

/** Sello circular del certificado: PB grande y PROGRAMBI al mínimo permitido. */
function Sello({ accent }: { accent: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        flex: "0 0 auto",
        width: 88,
        height: 88,
        borderRadius: "50%",
        border: `2px solid ${accent}`,
        backgroundColor: LAVADO,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <span
        style={{
          fontSize: 14,
          lineHeight: 1.1,
          fontWeight: 700,
          letterSpacing: "0.02em",
          color: TINTA,
        }}
      >
        PB
      </span>
      <span
        style={{
          fontSize: 10.5,
          lineHeight: 1.2,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: TENUE,
        }}
      >
        PROGRAMBI
      </span>
    </div>
  );
}

export function BrochureShowcaseSheet({
  data,
  pageNumber,
  totalPages,
}: BrochureShowcaseSheetProps): JSX.Element {
  const accent = data.accentColor;
  // Máximo 6 competencias: se recorta antes que reducir la letra.
  const competencias = data.whatYouLearn.slice(0, 6);
  // Máximo 3 capturas; si el curso trae menos, la grilla se adapta a N.
  const galeria = data.galleryImages.slice(0, 3);
  const codigo = `PB-${data.slug.toUpperCase()}-2026`;

  return (
    <BrochureA4Sheet data={data} pageNumber={pageNumber} totalPages={totalPages}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          justifyContent: "space-between",
          height: "100%",
          minHeight: 0,
          fontFamily: SANS,
          color: TINTA,
        }}
      >
        {/* 1. Cabecera editorial */}
        <header style={{ flexShrink: 0 }}>
          <p style={{ ...KICKER, color: accent }}>Lo que vas a dominar</p>
          <h2 style={TITULO}>Proyectos reales, competencias y certificado</h2>
          <p style={SUBTITULO}>
            Cada módulo termina en un entregable aplicado a un caso real de
            negocio.
          </p>
        </header>

        {/* 2. Competencias que dominarás */}
        {competencias.length > 0 ? (
          <section style={{ flexShrink: 0 }}>
            <h3 style={ROTULO}>Competencias que dominarás</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                columnGap: 18,
                rowGap: 8,
                marginTop: 10,
              }}
            >
              {competencias.map((texto, indice) => (
                <div
                  key={`competencia-${indice}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    minWidth: 0,
                  }}
                >
                  <span style={{ marginTop: 1, display: "block" }}>
                    <CheckAcento accent={accent} />
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      lineHeight: 1.45,
                      color: TINTA,
                    }}
                  >
                    {texto}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* 3. Galería de capturas reales de clase */}
        {galeria.length > 0 ? (
          <section style={{ flexShrink: 0 }}>
            <h3 style={ROTULO}>Capturas reales de clase</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${galeria.length}, 1fr)`,
                gap: 12,
                marginTop: 10,
              }}
            >
              {galeria.map((imagen, indice) => (
                <figure
                  key={`captura-${indice}-${imagen.src}`}
                  style={{
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    border: `1px solid ${LINEA}`,
                    borderRadius: 10,
                    overflow: "hidden",
                    backgroundColor: BLANCO,
                  }}
                >
                  <img
                    src={imagen.src}
                    alt={imagen.title}
                    crossOrigin="anonymous"
                    style={{
                      width: "100%",
                      height: 118,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <figcaption style={{ padding: "8px 10px 10px" }}>
                    <div
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: TINTA,
                      }}
                    >
                      {imagen.title}
                    </div>
                    <div
                      style={{
                        marginTop: 2,
                        fontSize: 11,
                        lineHeight: 1.35,
                        color: GRIS,
                      }}
                    >
                      {imagen.subtitle}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* 4. Vista previa del certificado oficial */}
        <section style={{ flexShrink: 0 }}>
          <h3 style={ROTULO}>Certificado oficial</h3>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "14px 18px",
              border: `1px solid ${LINEA}`,
              borderTop: `4px solid ${accent}`,
              borderRadius: 12,
              backgroundColor: BLANCO,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: accent,
                }}
              >
                CERTIFICADO DE FINALIZACIÓN
              </div>

              <div
                style={{
                  marginTop: 3,
                  fontSize: 12,
                  lineHeight: 1.35,
                  color: GRIS,
                }}
              >
                Se certifica la finalización del programa
              </div>

              <div
                style={{
                  marginTop: 7,
                  fontFamily: DISPLAY,
                  fontSize: 24,
                  lineHeight: 1.15,
                  fontWeight: 700,
                  color: TINTA,
                }}
              >
                {data.title}
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  lineHeight: 1.45,
                  color: GRIS,
                }}
              >
                Programa intensivo en vivo, con proyecto aplicado, evaluación y
                código único de verificación.
              </div>

              <div
                style={{
                  marginTop: 12,
                  paddingTop: 9,
                  borderTop: `1px solid ${LINEA}`,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      width: 148,
                      borderTop: `1px solid ${LINEA}`,
                      marginBottom: 5,
                    }}
                  />
                  <div
                    style={{
                      fontSize: 11,
                      lineHeight: 1.3,
                      fontWeight: 700,
                      color: TINTA,
                    }}
                  >
                    Manuel Oliva · Director Académico
                  </div>
                </div>

                <div style={{ textAlign: "right", minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 10.5,
                      lineHeight: 1.2,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: TENUE,
                    }}
                  >
                    Código de verificación
                  </div>
                  <div
                    style={{
                      marginTop: 3,
                      fontFamily: MONO,
                      fontSize: 11,
                      lineHeight: 1.3,
                      color: TENUE,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {codigo}
                  </div>
                </div>
              </div>
            </div>

            <Sello accent={accent} />
          </div>
        </section>
      </div>
    </BrochureA4Sheet>
  );
}
