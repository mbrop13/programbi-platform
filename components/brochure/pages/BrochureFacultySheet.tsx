"use client";

/**
 * Hoja 5 del brochure: equipo docente, cita del fundador y empresas clientes.
 *
 * Los retratos viven en `public/images/mentors/` para que la captura del PDF
 * los pueda rasterizar sin CORS: la ruta local se resuelve por nombre y solo
 * se cae al `imageUrl` del dato si el profesor no pertenece al equipo fijo.
 *
 * Toda la hoja usa tipografía grande (nunca por debajo de 10.5px) y un ritmo
 * vertical de bloques separados por `gap`, sin posicionamiento absoluto: la
 * cabecera y el pie de la hoja A4 los pone `BrochureA4Sheet` por flujo flex.
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
const BLANCO = "#FFFFFF";

const BODY =
  '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const DISPLAY = 'Georgia, "Times New Roman", serif';

/**
 * Retratos locales HD del equipo fijo. La ruta se resuelve por nombre para que
 * la hoja muestre siempre las tres fotos same-origin, incluso si el dato aún
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

/** Slug ASCII del nombre, para la ruta local de respaldo. */
function slugDe(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Foto del profesor: local HD primero, dato original después. */
function retratoDe(profesor: BrochureProfesor): string | null {
  const local = RETRATOS_LOCALES[profesor.name];
  if (local) return local;
  if (profesor.imageUrl) return profesor.imageUrl;
  const slug = slugDe(profesor.name);
  return slug ? `/images/mentors/${slug}.jpg` : null;
}

function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

const PILDORA: CSSProperties = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: 999,
  backgroundColor: LAVADO,
  fontSize: 10.5,
  lineHeight: 1.3,
  fontWeight: 600,
  color: GRIS,
  whiteSpace: "nowrap",
};

/** Recorta el cargo del profesor sin cortar una línea por la mitad. */
const DOS_LINEAS: CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
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
  const empresas = data.empresas.slice(0, 12);
  const fundador = profesores[0];
  const cita = fundador?.founderBio ?? null;

  return (
    <BrochureA4Sheet data={data} pageNumber={pageNumber} totalPages={totalPages}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          height: "100%",
          minHeight: 0,
          justifyContent: "space-between",
          fontFamily: BODY,
          color: TINTA,
        }}
      >
        {/* 1. Cabecera editorial */}
        <header>
          <div
            style={{
              fontSize: 11,
              lineHeight: 1.2,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: accent,
            }}
          >
            Equipo docente
          </div>
          <h2
            style={{
              margin: "8px 0 0",
              fontFamily: DISPLAY,
              fontSize: 31,
              lineHeight: 1.1,
              letterSpacing: -0.3,
              fontWeight: 700,
              color: TINTA,
            }}
          >
            Aprende con quienes lideran proyectos de datos
          </h2>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 14,
              lineHeight: 1.5,
              color: GRIS,
            }}
          >
            Profesores en ejercicio, con experiencia directa en banca, minería,
            retail y consultoría.
          </p>
        </header>

        {/* 2. Tres tarjetas de profesores */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            alignItems: "stretch",
          }}
        >
          {profesores.map((profesor) => {
            const foto = retratoDe(profesor);
            const credenciales = profesor.credentials.slice(0, 3);
            const trayectoria = profesor.founderCareer.slice(0, 2);

            return (
              <article
                key={profesor.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  backgroundColor: BLANCO,
                  border: `1px solid ${LINEA}`,
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {foto ? (
                  <img
                    src={foto}
                    alt={`Retrato de ${profesor.name}`}
                    crossOrigin="anonymous"
                    style={{
                      width: "100%",
                      height: 195,
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    style={{
                      height: 195,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: LAVADO,
                    }}
                  >
                    <span
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: BLANCO,
                        border: `1px solid ${LINEA}`,
                        fontFamily: DISPLAY,
                        fontSize: 22,
                        color: GRIS,
                      }}
                    >
                      {iniciales(profesor.name)}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    padding: "12px 12px 14px",
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16.5,
                      lineHeight: 1.2,
                      fontWeight: 700,
                      color: TINTA,
                    }}
                  >
                    {profesor.name}
                  </h3>

                  <div
                    style={{
                      fontSize: 11.5,
                      lineHeight: 1.25,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: accent,
                    }}
                  >
                    {profesor.role}
                  </div>

                  <div
                    style={{
                      ...DOS_LINEAS,
                      fontSize: 12,
                      lineHeight: 1.35,
                      color: GRIS,
                    }}
                  >
                    {profesor.title}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 6,
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
                        margin: "8px 0 0",
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {credenciales.map((credencial, indice) => (
                        <li
                          key={`credencial-${indice}`}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 6,
                            fontSize: 12,
                            lineHeight: 1.4,
                            color: GRIS,
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            aria-hidden="true"
                            style={{ flex: "0 0 auto", marginTop: 2.5 }}
                          >
                            <path
                              d="M1.9 6.5 4.5 9.1 10.1 2.7"
                              fill="none"
                              stroke={accent}
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>{credencial}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {trayectoria.length > 0 ? (
                    <div style={{ marginTop: "auto", paddingTop: 10 }}>
                      <div
                        style={{
                          marginBottom: 3,
                          fontSize: 10.5,
                          lineHeight: 1.2,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          color: TENUE,
                        }}
                      >
                        Trayectoria
                      </div>
                      {trayectoria.map((hito, indice) => (
                        <div
                          key={`hito-${indice}`}
                          style={{
                            fontSize: 11,
                            lineHeight: 1.35,
                            color: TENUE,
                          }}
                        >
                          {hito}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {/* 3. Cita del fundador */}
        {cita && fundador ? (
          <figure
            style={{
              margin: 0,
              padding: "10px 14px",
              backgroundColor: LAVADO,
              borderLeft: `3px solid ${accent}`,
              borderRadius: 8,
            }}
          >
            <blockquote
              style={{
                ...CUATRO_LINEAS,
                margin: 0,
                fontSize: 12.5,
                fontStyle: "italic",
                lineHeight: 1.5,
                color: TINTA,
              }}
            >
              {cita}
            </blockquote>
            <figcaption
              style={{
                marginTop: 6,
                fontSize: 11,
                lineHeight: 1.3,
                fontWeight: 700,
                color: TINTA,
              }}
            >
              {`${fundador.name} · Fundador y Director Académico de ProgramBI`}
            </figcaption>
          </figure>
        ) : null}

        {/* 4. Mosaico de empresas clientes */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 11,
                lineHeight: 1.2,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: TENUE,
                whiteSpace: "nowrap",
              }}
            >
              Empresas que confían en ProgramBI
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
              gap: 8,
              marginTop: 8,
            }}
          >
            {logos.length > 0
              ? logos.map((logo) => (
                  <div
                    key={logo.name}
                    title={logo.name}
                    style={{
                      height: 54,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "6px 8px",
                      backgroundColor: BLANCO,
                      border: `1px solid ${LINEA}`,
                      borderRadius: 8,
                      boxSizing: "border-box",
                    }}
                  >
                    <img
                      src={logo.logoUrl}
                      alt={logo.name}
                      crossOrigin="anonymous"
                      style={{
                        maxWidth: 92,
                        maxHeight: 34,
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                ))
              : empresas.map((empresa) => (
                  <div
                    key={empresa}
                    style={{
                      height: 54,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "6px 8px",
                      backgroundColor: BLANCO,
                      border: `1px solid ${LINEA}`,
                      borderRadius: 8,
                      boxSizing: "border-box",
                      textAlign: "center",
                      fontSize: 10.5,
                      lineHeight: 1.15,
                      fontWeight: 600,
                      color: GRIS,
                    }}
                  >
                    {empresa}
                  </div>
                ))}
          </div>
        </section>
      </div>
    </BrochureA4Sheet>
  );
}
