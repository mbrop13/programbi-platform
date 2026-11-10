"use client";

/**
 * Hoja 5 del temario y precios: equipo docente.
 *
 * Tarjetas horizontales con retrato circular de 96 px, nombre en el estilo
 * `h2` del tema, rol en el acento del curso y una bio de dos o tres líneas
 * armada SOLO con datos ya publicados del profesor (`founderBio` o sus
 * credenciales). Si la edición trae más de cuatro docentes, la lista pasa a
 * una grilla compacta de dos columnas para que no se corte nada en el A4.
 *
 * Los retratos viven en `public/images/mentors/` para que la captura del PDF
 * los pueda rasterizar sin CORS. Todo va en estilos inline y fuentes de
 * sistema: la vista previa, la captura con `html-to-image` y el PDF miden
 * exactamente lo mismo, sin Tailwind dentro de la hoja.
 */

import type { CSSProperties } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type {
  BrochureProfesor,
  CourseBrochureData,
} from "@/lib/brochure/brochure-data";
import {
  FONT_DISPLAY,
  FONT_SANS,
  RADIUS,
  SPACE,
  T,
  TYPE,
  accentOf,
  tint,
} from "@/lib/brochure/brochure-theme";

/**
 * Retratos locales HD del equipo fijo. La ruta se resuelve por nombre para que
 * la hoja muestre siempre las fotos same-origin, incluso si el dato aún apunta
 * al CDN heredado (la captura del PDF no admite imágenes externas).
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

/**
 * Bio breve con hechos ya publicados: la del fundador cuando existe y, si no,
 * sus credenciales reales. No se agrega texto nuevo ni se inventan cargos.
 */
function bioDe(profesor: BrochureProfesor): string {
  const fundador = profesor.founderBio?.trim();
  if (fundador) return fundador;
  return profesor.credentials
    .map((credencial) => credencial.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");
}

/** Recorte tipográfico sin cortar una línea por la mitad. */
const RECORTE: CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export function BrochureFacultySheet({
  data,
  pageNumber,
  totalPages,
}: BrochureFacultySheetProps) {
  const accent = accentOf(data.accentColor);
  const profesores = data.profesores;
  const compacto = profesores.length > 4;
  const denso = profesores.length > 3;

  const kicker: CSSProperties = {
    fontFamily: FONT_SANS,
    fontSize: TYPE.kicker.size,
    lineHeight: TYPE.kicker.line,
    fontWeight: TYPE.kicker.weight,
    letterSpacing: TYPE.kicker.tracking,
    textTransform: "uppercase",
    color: accent,
  };

  const titulo: CSSProperties = {
    margin: `${SPACE[1]}px 0 0`,
    fontFamily: FONT_DISPLAY,
    fontSize: TYPE.h1.size,
    lineHeight: TYPE.h1.line,
    fontWeight: TYPE.h1.weight,
    letterSpacing: -0.4,
    color: T.ink,
  };

  const entrada: CSSProperties = {
    margin: `${SPACE[1]}px 0 0`,
    maxWidth: 560,
    fontFamily: FONT_SANS,
    fontSize: TYPE.body.size,
    lineHeight: TYPE.body.line,
    color: T.mute,
  };

  const tarjeta: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: compacto ? SPACE[3] : 20,
    padding: compacto || denso ? "14px 16px" : "18px 20px",
    backgroundColor: T.wash,
    border: `1px solid ${T.line}`,
    borderRadius: RADIUS.card,
    boxSizing: "border-box",
    minWidth: 0,
    minHeight: denso ? 120 : 178,
  };

  const retrato: CSSProperties = {
    flex: "0 0 auto",
    width: 96,
    height: 96,
    borderRadius: "50%",
    boxShadow: `0 0 0 1px ${tint(accent, 0.35)}`,
    backgroundColor: T.paper,
    overflow: "hidden",
  };

  const foto: CSSProperties = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    objectPosition: "center top",
    display: "block",
  };

  const sinFoto: CSSProperties = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tint(accent, 0.1),
    fontFamily: FONT_DISPLAY,
    fontSize: 24,
    fontWeight: 700,
    color: accent,
  };

  const nombre: CSSProperties = {
    margin: 0,
    fontFamily: FONT_SANS,
    fontSize: TYPE.h2.size,
    lineHeight: TYPE.h2.line,
    fontWeight: TYPE.h2.weight,
    color: T.ink,
  };

  const rol: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: SPACE[0],
    fontFamily: FONT_SANS,
    fontSize: TYPE.kicker.size,
    lineHeight: TYPE.kicker.line,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: T.inkSoft,
  };

  const punto: CSSProperties = {
    display: "block",
    width: 5,
    height: 5,
    borderRadius: RADIUS.chip,
    backgroundColor: accent,
    flexShrink: 0,
  };

  const bio: CSSProperties = {
    ...RECORTE,
    WebkitLineClamp: denso ? 2 : 3,
    margin: `${SPACE[1]}px 0 0`,
    fontFamily: FONT_SANS,
    fontSize: TYPE.body.size,
    lineHeight: TYPE.body.line,
    color: T.inkSoft,
  };

  const chip: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 8px",
    borderRadius: RADIUS.chip,
    backgroundColor: tint(accent, 0.08),
    fontFamily: FONT_SANS,
    fontSize: 10.5,
    lineHeight: 1.2,
    fontWeight: 600,
    color: T.inkSoft,
    whiteSpace: "nowrap",
  };

  return (
    <BrochureA4Sheet data={data} pageNumber={pageNumber} totalPages={totalPages}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: SPACE[4],
          height: "100%",
          minHeight: 0,
          fontFamily: FONT_SANS,
          color: T.ink,
        }}
      >
        {/* 1. Cabecera editorial */}
        <header>
          <div style={kicker}>QUIÉN TE ENSEÑA</div>
          <h2 style={titulo}>Aprende con quienes lideran proyectos de datos</h2>
          <p style={entrada}>
            Profesores en ejercicio, con experiencia directa en banca, minería,
            retail y consultoría.
          </p>
        </header>

        {/* 2. Tarjetas de profesores: fila amplia, grilla compacta si hay más de 4 */}
        <section
          aria-label="Equipo docente"
          style={
            compacto
              ? {
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: SPACE[2],
                }
              : {
                  display: "flex",
                  flexDirection: "column",
                  gap: SPACE[3],
                }
          }
        >
          {profesores.map((profesor) => {
            const imagen = retratoDe(profesor);
            const bioProfesor = bioDe(profesor);

            return (
              <article key={profesor.name} style={tarjeta}>
                <div style={retrato}>
                  {imagen ? (
                    <img
                      src={imagen}
                      alt={`Retrato de ${profesor.name}`}
                      crossOrigin="anonymous"
                      style={foto}
                    />
                  ) : (
                    <span aria-hidden="true" style={sinFoto}>
                      {iniciales(profesor.name)}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h3 style={nombre}>{profesor.name}</h3>

                  <div style={rol}>
                    <span aria-hidden="true" style={punto} />
                    <span>{profesor.role}</span>
                  </div>

                  {bioProfesor ? <p style={bio}>{bioProfesor}</p> : null}

                  {!denso ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginTop: SPACE[1],
                      }}
                    >
                      <span style={chip}>
                        {`+${profesor.yearsExperience} años de experiencia`}
                      </span>
                      <span style={chip}>
                        {`+${profesor.studentCount.toLocaleString("es-CL")} alumnos`}
                      </span>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>

        {/* 3. Cierre: modalidad real del curso y tamaño del equipo */}
        <aside
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: SPACE[4],
            padding: "16px 20px",
            backgroundColor: tint(accent, 0.06),
            border: `1px solid ${T.line}`,
            borderLeft: `3px solid ${accent}`,
            borderRadius: RADIUS.card,
            boxSizing: "border-box",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ ...kicker, color: T.mute }}>MODALIDAD</div>
            <div
              style={{
                marginTop: SPACE[0],
                fontFamily: FONT_SANS,
                fontSize: 14,
                lineHeight: 1.4,
                fontWeight: 600,
                color: T.ink,
              }}
            >
              {data.modality}
            </div>
          </div>

          {profesores.length > 0 ? (
            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 30,
                  lineHeight: 1,
                  fontWeight: 700,
                  color: T.ink,
                }}
              >
                {String(profesores.length).padStart(2, "0")}
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontFamily: FONT_SANS,
                  fontSize: TYPE.kicker.size,
                  lineHeight: TYPE.kicker.line,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: T.mute,
                }}
              >
                {profesores.length === 1 ? "DOCENTE" : "DOCENTES"}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </BrochureA4Sheet>
  );
}
