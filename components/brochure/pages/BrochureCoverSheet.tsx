"use client";

/**
 * Hoja 1 — Portada ejecutiva del brochure.
 *
 * Jerarquía editorial: cabecera de marca en variante «cover», kicker de
 * modalidad, título display, descripción breve, foto hero con pills y stack,
 * fila de cuatro KPIs, metodología en vivo y cintillo de empresas. Todo va
 * inline para que la captura a PDF mida exactamente lo mismo que la vista.
 */

import type { CSSProperties, JSX } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import { BrochureBrandHeader } from "@/components/brochure/BrochureBrandHeader";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";

export type BrochureCoverSheetProps = {
  data: CourseBrochureData;
  pageNumber: number;
  totalPages: number;
};

const SANS =
  '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const DISPLAY = 'Georgia, "Times New Roman", serif';

const TINTA = "#141519";
const GRIS = "#5C5D63";
const TENUE = "#77786F";
const LINEA = "#E7E4DA";
const LAVADO = "#F1EFE8";
const BLANCO = "#FFFFFF";

/** Recorte multílínea con prefijo webkit (Chromium y Safari). */
function clamp(lineas: number): CSSProperties {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lineas,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}

export function BrochureCoverSheet({
  data,
  pageNumber,
  totalPages,
}: BrochureCoverSheetProps): JSX.Element {
  const accent = data.accentColor;
  const techStack = data.techStack.slice(0, 5);
  const companyLogos = data.companyLogos.slice(0, 8);
  const pilares = data.methodologyPillars.slice(0, 4);

  const kpis: { valor: string; etiqueta: string }[] = [
    { valor: `${data.hours} Horas`, etiqueta: "Clases prácticas en vivo" },
    { valor: `${data.modulesCount} Módulos`, etiqueta: "Programa paso a paso" },
    {
      valor: `${data.levelsCount} ${data.levelsCount === 1 ? "Nivel" : "Niveles"}`,
      etiqueta: "Progresión estructurada",
    },
    { valor: "Certificado", etiqueta: "Digital con código verificable" },
  ];

  const contenido: CSSProperties = {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    fontFamily: SANS,
    color: TINTA,
  };

  const kicker: CSSProperties = {
    marginTop: 14,
    fontSize: 8,
    lineHeight: 1.2,
    letterSpacing: 2,
    fontWeight: 700,
    textTransform: "uppercase",
    color: accent,
  };

  const kickerSecundario: CSSProperties = {
    marginTop: 4,
    fontSize: 7.2,
    lineHeight: 1.3,
    letterSpacing: 0.3,
    color: TENUE,
  };

  const titulo: CSSProperties = {
    ...clamp(3),
    marginTop: 12,
    fontFamily: DISPLAY,
    fontSize: 46,
    lineHeight: 1.03,
    letterSpacing: -1.2,
    fontWeight: 400,
    color: TINTA,
  };

  const descripcion: CSSProperties = {
    ...clamp(3),
    marginTop: 10,
    fontSize: 12.5,
    lineHeight: 1.6,
    color: GRIS,
  };

  const hero: CSSProperties = {
    position: "relative",
    marginTop: 14,
    height: 292,
    borderRadius: 16,
    overflow: "hidden",
    border: `1px solid ${LINEA}`,
    backgroundColor: "#DDD9CC",
    flexShrink: 0,
  };

  const heroImagen: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const heroOverlay: CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(10,12,16,0) 35%, rgba(10,12,16,0.82) 100%)",
    pointerEvents: "none",
  };

  const pill: CSSProperties = {
    position: "absolute",
    top: 12,
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 10px",
    borderRadius: 999,
    backgroundColor: "rgba(20,21,25,0.82)",
    color: BLANCO,
    fontSize: 7,
    lineHeight: 1.2,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: 600,
    whiteSpace: "nowrap",
  };

  const puntoPill: CSSProperties = {
    display: "block",
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: accent,
    flexShrink: 0,
  };

  const chips: CSSProperties = {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  };

  const chip: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 9px",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.28)",
    color: BLANCO,
    fontSize: 7.6,
    lineHeight: 1.2,
    fontWeight: 600,
    letterSpacing: 0.2,
    backdropFilter: "blur(6px)",
  };

  const filaKpis: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 8,
    marginTop: 14,
  };

  const tarjetaKpi: CSSProperties = {
    backgroundColor: BLANCO,
    border: `1px solid ${LINEA}`,
    borderTop: `3px solid ${accent}`,
    borderRadius: 10,
    padding: "10px 12px",
    boxSizing: "border-box",
    minWidth: 0,
  };

  const valorKpi: CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: 21,
    lineHeight: 1.1,
    letterSpacing: -0.3,
    fontWeight: 700,
    color: TINTA,
  };

  const etiquetaKpi: CSSProperties = {
    marginTop: 4,
    fontSize: 7.4,
    lineHeight: 1.25,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: TENUE,
  };

  const metodologia: CSSProperties = {
    marginTop: 16,
  };

  const tituloSeccion: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 7,
    lineHeight: 1.2,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontWeight: 600,
    color: TENUE,
    whiteSpace: "nowrap",
  };

  const lineaSeccion: CSSProperties = {
    flex: 1,
    height: 1,
    backgroundColor: LINEA,
  };

  const grillaMetodologia: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
    marginTop: 8,
  };

  const pilar: CSSProperties = {
    display: "flex",
    gap: 9,
    padding: "2px 0 2px 10px",
    borderLeft: `1px solid ${LINEA}`,
    minWidth: 0,
  };

  const paso: CSSProperties = {
    flexShrink: 0,
    width: 22,
    fontFamily: DISPLAY,
    fontSize: 18,
    lineHeight: 1,
    color: accent,
    opacity: 0.9,
  };

  const pilarTexto: CSSProperties = {
    minWidth: 0,
  };

  const pilarTitulo: CSSProperties = {
    fontSize: 10.5,
    lineHeight: 1.2,
    fontWeight: 700,
    color: TINTA,
  };

  const pilarDescripcion: CSSProperties = {
    ...clamp(3),
    marginTop: 2,
    fontSize: 7.6,
    lineHeight: 1.4,
    color: GRIS,
  };

  const cintilloWrap: CSSProperties = {
    marginTop: 16,
  };

  const cintillo: CSSProperties = {
    backgroundColor: LAVADO,
    borderRadius: 12,
    padding: "10px 12px",
  };

  const cintilloTitulo: CSSProperties = {
    fontSize: 6.8,
    lineHeight: 1.2,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: TENUE,
    marginBottom: 8,
  };

  const filaLogos: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  const cajaLogo: CSSProperties = {
    flex: "1 1 0",
    minWidth: 0,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 6px",
    boxSizing: "border-box",
    backgroundColor: BLANCO,
    border: `1px solid ${LINEA}`,
    borderRadius: 6,
  };

  const logo: CSSProperties = {
    display: "block",
    maxHeight: 22,
    maxWidth: 80,
    width: "auto",
    height: "auto",
    objectFit: "contain",
    margin: "0 auto",
  };

  return (
    <BrochureA4Sheet
      data={data}
      pageNumber={pageNumber}
      totalPages={totalPages}
      className="brochure-cover-sheet"
    >
      {/* La hoja A4 ya pinta la cabecera «default»; la portada usa la
          variante «cover», así que se oculta solo la cabecera directa de
          esta hoja para no duplicar la marca. */}
      <style>{`.brochure-cover-sheet > header { display: none !important; }`}</style>

      <div style={contenido}>
        <BrochureBrandHeader data={data} variant="cover" />

        <div style={kicker}>
          {`${data.categoryLabel} · MODALIDAD 100% EN VIVO POR ZOOM`}
        </div>
        <div style={kickerSecundario}>
          {`Edición ${data.paisNombre} · Precios en ${data.moneda}`}
        </div>

        <h1 style={titulo}>{data.title}</h1>
        <p style={descripcion}>{data.shortDescription}</p>

        <div style={hero}>
          <img
            src={data.imageUrl}
            alt={`${data.title} · ${data.categoryLabel} — ProgramBI`}
            crossOrigin="anonymous"
            style={heroImagen}
          />
          <div aria-hidden="true" style={heroOverlay} />

          <span style={{ ...pill, left: 12 }}>
            <span aria-hidden="true" style={puntoPill} />
            PROGRAMA EN VIVO
          </span>
          <span style={{ ...pill, right: 12 }}>
            {data.paisNombre.toUpperCase()}
          </span>

          <div style={chips}>
            {techStack.map((herramienta) => (
              <span key={herramienta} style={chip}>
                {herramienta}
              </span>
            ))}
          </div>
        </div>

        <div style={filaKpis}>
          {kpis.map((kpi) => (
            <div key={kpi.etiqueta} style={tarjetaKpi}>
              <div style={valorKpi}>{kpi.valor}</div>
              <div style={etiquetaKpi}>{kpi.etiqueta}</div>
            </div>
          ))}
        </div>

        <section style={metodologia}>
          <div style={tituloSeccion}>
            <span>METODOLOGÍA EN VIVO PROGRAMBI</span>
            <span aria-hidden="true" style={lineaSeccion} />
          </div>

          <div style={grillaMetodologia}>
            {pilares.map((pilarItem) => (
              <div key={pilarItem.step} style={pilar}>
                <span style={paso}>{pilarItem.step}</span>
                <div style={pilarTexto}>
                  <div style={pilarTitulo}>{pilarItem.title}</div>
                  <div style={pilarDescripcion}>{pilarItem.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={cintilloWrap}>
          <div style={cintillo}>
            <div style={cintilloTitulo}>
              EMPRESAS CUYOS EQUIPOS SE HAN CAPACITADO CON PROGRAMBI
            </div>
            <div style={filaLogos}>
              {companyLogos.map((empresa) => (
                <div key={empresa.name} style={cajaLogo}>
                  <img
                    src={empresa.logoUrl}
                    alt={empresa.name}
                    crossOrigin="anonymous"
                    style={logo}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrochureA4Sheet>
  );
}
