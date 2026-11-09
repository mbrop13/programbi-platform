"use client";

/**
 * Hoja 4 del brochure: equipo docente y empresas que confían en ProgramBI.
 *
 * Los retratos viven en `public/images/mentors/` para que la captura del PDF
 * los pueda rasterizar sin CORS. Si un profesor llegara sin foto local, se
 * muestra un placeholder con sus iniciales.
 */

import type { CSSProperties } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type {
  BrochureProfesor,
  CourseBrochureData,
} from "@/lib/brochure/brochure-data";

const TINTA = "#141519";
const GRIS = "#5C5D63";
const TENUE = "#77786F";
const LINEA = "#E7E4DA";
const LAVADO = "#F1EFE8";

const BODY =
  '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const DISPLAY = 'Georgia, "Times New Roman", serif';

/**
 * Retratos locales del equipo fijo. La ruta se resuelve por nombre para que la
 * hoja muestre siempre las tres fotos same-origin, incluso si el dato aún
 * apunta al CDN heredado.
 */
const RETRATOS_LOCALES: Record<string, string> = {
  "Manuel Oliva": "/images/mentors/manuel-oliva.jpg",
  "Emanuel Berrocal": "/images/mentors/emanuel-berrocal.jpg",
  "Rodrigo Vega": "/images/mentors/rodrigo-vega.jpg",
};

type BrochureFacultySheetProps = {
  data: CourseBrochureData;
  pageNumber: number;
  totalPages: number;
};

function retratoDe(profesor: BrochureProfesor): string | null {
  const local = RETRATOS_LOCALES[profesor.name];
  if (local) return local;
  const url = profesor.imageUrl;
  return url && url.startsWith("/") ? url : null;
}

function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

function linkedinCorto(url: string): string {
  const coincidencia = url.match(/\/in\/([^/?#]+)/i);
  if (coincidencia?.[1]) return `linkedin.com/in/${coincidencia[1]}`;
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/+$/, "");
}

const PILDORA: CSSProperties = {
  display: "inline-block",
  padding: "2px 6px",
  borderRadius: 999,
  backgroundColor: LAVADO,
  fontSize: 6.6,
  lineHeight: 1.3,
  fontWeight: 600,
  color: GRIS,
  letterSpacing: 0.1,
  whiteSpace: "nowrap",
};

/** Recorta la nota del fundador sin cortar una línea por la mitad. */
const CUATRO_LINEAS: CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 4,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export function BrochureFacultySheet({
  data,
  pageNumber,
  totalPages,
}: BrochureFacultySheetProps) {
  const accent = data.accentColor;
  const profesores = data.profesores.slice(0, 3);
  const logos = data.companyLogos.slice(0, 12);
  const fundador = data.profesores.find((profesor) =>
    Boolean(profesor.founderBio)
  );

  return (
    <BrochureA4Sheet data={data} pageNumber={pageNumber} totalPages={totalPages}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          minHeight: 0,
          fontFamily: BODY,
          color: TINTA,
        }}
      >
        {/* 1. Encabezado */}
        <header>
          <div
            style={{
              fontSize: 8,
              lineHeight: 1.2,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 700,
              color: accent,
            }}
          >
            EQUIPO DOCENTE
          </div>
          <h2
            style={{
              margin: "6px 0 0",
              fontFamily: DISPLAY,
              fontSize: 26,
              lineHeight: 1.1,
              letterSpacing: -0.4,
              fontWeight: 400,
              color: TINTA,
            }}
          >
            Quién dicta tus clases en vivo
          </h2>
          <p
            style={{
              margin: "5px 0 0",
              fontSize: 8.6,
              lineHeight: 1.45,
              color: GRIS,
            }}
          >
            Profesionales en ejercicio que dictan las clases en vivo y
            comparten casos reales de negocio.
          </p>
        </header>

        {/* 2. Tres profesores */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginTop: 16,
            alignItems: "stretch",
          }}
        >
          {profesores.map((profesor) => {
            const foto = retratoDe(profesor);
            const trayectoria = profesor.founderCareer.slice(0, 3).join(" · ");
            const credenciales = profesor.credentials.slice(0, 3);

            return (
              <article
                key={profesor.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${LINEA}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(20, 21, 25, 0.05)",
                }}
              >
                {foto ? (
                  <img
                    src={foto}
                    alt={`Retrato de ${profesor.name}`}
                    crossOrigin="anonymous"
                    style={{
                      width: "100%",
                      height: 208,
                      objectFit: "cover",
                      objectPosition: "center 20%",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    style={{
                      height: 168,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: LAVADO,
                    }}
                  >
                    <span
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#FFFFFF",
                        border: `1px solid ${LINEA}`,
                        fontFamily: DISPLAY,
                        fontSize: 20,
                        color: GRIS,
                      }}
                    >
                      {iniciales(profesor.name)}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    padding: 10,
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      lineHeight: 1.15,
                      letterSpacing: -0.1,
                      fontWeight: 700,
                      color: TINTA,
                    }}
                  >
                    {profesor.name}
                  </h3>
                  <div
                    style={{
                      marginTop: 3,
                      fontSize: 7.6,
                      lineHeight: 1.3,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: accent,
                    }}
                  >
                    {profesor.role}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 7.6,
                      lineHeight: 1.3,
                      color: GRIS,
                    }}
                  >
                    {profesor.title}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginTop: 7,
                    }}
                  >
                    <span style={PILDORA}>
                      +{profesor.yearsExperience} años exp.
                    </span>
                    <span style={PILDORA}>
                      +{profesor.studentCount.toLocaleString("es-CL")} alumnos
                    </span>
                  </div>

                  {credenciales.length > 0 ? (
                    <ul
                      style={{
                        listStyle: "none",
                        margin: "7px 0 0",
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2.5,
                      }}
                    >
                      {credenciales.map((credencial, indice) => (
                        <li
                          key={`credito-${indice}`}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 5,
                            fontSize: 7,
                            lineHeight: 1.3,
                            color: GRIS,
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              flex: "0 0 auto",
                              width: 3,
                              height: 3,
                              marginTop: 3.5,
                              borderRadius: "50%",
                              backgroundColor: accent,
                            }}
                          />
                          <span>{credencial}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {trayectoria ? (
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 6.6,
                        lineHeight: 1.35,
                        color: TENUE,
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          marginBottom: 1.5,
                          fontSize: 5.6,
                          letterSpacing: 0.9,
                          textTransform: "uppercase",
                          color: "#9A9B93",
                        }}
                      >
                        Trayectoria
                      </span>
                      {trayectoria}
                    </div>
                  ) : null}

                  {profesor.linkedinUrl ? (
                    <a
                      href={profesor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={profesor.linkedinUrl}
                      style={{
                        marginTop: "auto",
                        paddingTop: 7,
                        borderTop: `1px solid ${LINEA}`,
                        display: "block",
                        fontSize: 6.2,
                        lineHeight: 1.3,
                        letterSpacing: 0.1,
                        color: TENUE,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {linkedinCorto(profesor.linkedinUrl)}
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {/* Nota del fundador: cierre editorial del equipo docente */}
        {fundador?.founderBio ? (
          <figure
            style={{
              margin: "22px 0 0",
              padding: "13px 18px 14px",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              backgroundColor: LAVADO,
              borderLeft: `3px solid ${accent}`,
              borderRadius: "0 8px 8px 0",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                flex: "0 0 auto",
                marginTop: -3,
                fontFamily: DISPLAY,
                fontSize: 30,
                lineHeight: 1,
                color: accent,
                opacity: 0.55,
              }}
            >
              “
            </span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 5.8,
                  lineHeight: 1.3,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: TENUE,
                }}
              >
                Una palabra del fundador
              </div>
              <blockquote
                style={{
                  ...CUATRO_LINEAS,
                  margin: "4px 0 0",
                  fontFamily: DISPLAY,
                  fontSize: 8.8,
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  color: "#3E3F44",
                }}
              >
                {fundador.founderBio}
              </blockquote>
              <figcaption
                style={{
                  marginTop: 5,
                  fontSize: 6.2,
                  lineHeight: 1.3,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  color: TENUE,
                }}
              >
                {fundador.name} · {fundador.title}
              </figcaption>
            </div>
          </figure>
        ) : null}

        {/* 3. Mosaico de empresas */}
        <section style={{ marginTop: 22, paddingTop: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 7,
                lineHeight: 1.3,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                fontWeight: 700,
                color: TENUE,
                whiteSpace: "nowrap",
              }}
            >
              EMPRESAS QUE CONFÍAN EN PROGRAMBI
            </h3>
            <span
              aria-hidden="true"
              style={{
                flex: 1,
                height: 1,
                backgroundColor: LINEA,
                display: "block",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 6,
              marginTop: 8,
            }}
          >
            {logos.map((logo) => (
              <div
                key={logo.name}
                title={logo.name}
                style={{
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 6px",
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${LINEA}`,
                  borderRadius: 7,
                  boxSizing: "border-box",
                }}
              >
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  crossOrigin="anonymous"
                  style={{
                    maxWidth: 86,
                    maxHeight: 30,
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </BrochureA4Sheet>
  );
}
