"use client";

/**
 * Hoja 1 — Portada ejecutiva del brochure.
 *
 * Jerarquía editorial: cabecera de marca en variante «cover», kicker de
 * modalidad, título display, descripción breve, insignia de modalidad, foto
 * hero con pills y stack, fila de cuatro KPIs, metodología en vivo y cintillo
 * de empresas. Todo va inline para que la captura a PDF mida exactamente lo
 * mismo que la vista.
 *
 * Presupuesto vertical (A4 = 1123px, cuerpo útil ≈ 1023px): ningún texto baja
 * de 10.5px y el bloque completo queda por debajo del alto disponible incluso
 * con título y descripción a tres líneas.
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
const PAPEL = "#FAF9F5";

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
 * Acento para texto sobre papel: si el color del curso no alcanza 3:1 (el
 * amarillo de Power BI), se usa tinta y el acento se reserva a barras y puntos.
 */
function acentoLegible(acento: string): string {
  const frente = luminancia(acento);
  const fondo = luminancia(PAPEL);
  const contraste = (Math.max(frente, fondo) + 0.05) / (Math.min(frente, fondo) + 0.05);
  return contraste >= 3 ? acento : TINTA;
}

export function BrochureCoverSheet({
  data,
  pageNumber,
  totalPages,
}: BrochureCoverSheetProps): JSX.Element {
  const accent = data.accentColor;
  const accentTexto = acentoLegible(accent);
  const techStack = data.techStack.slice(0, 6);
  const companyLogos = data.companyLogos.slice(0, 6);
  const pilares = data.methodologyPillars.slice(0, 4);

  const kpis: { valor: string; etiqueta: string }[] = [
    { valor: `${data.hours} Horas`, etiqueta: "Clases en vivo" },
    { valor: `${data.modulesCount} Módulos`, etiqueta: "Programa completo" },
    {
      valor: `${data.levelsCount} ${data.levelsCount === 1 ? "Nivel" : "Niveles"}`,
      etiqueta: "Ruta de avance",
    },
    { valor: "Certificado", etiqueta: "Verificable" },
  ];

  const contenido: CSSProperties = {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: SANS,
    color: TINTA,
  };

  const kicker: CSSProperties = {
    marginTop: 12,
    fontSize: 11.5,
    lineHeight: 1.2,
    letterSpacing: "0.14em",
    fontWeight: 700,
    textTransform: "uppercase",
    color: accentTexto,
  };

  const kickerSecundario: CSSProperties = {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 1.3,
    letterSpacing: "0.02em",
    color: TENUE,
  };

  const titulo: CSSProperties = {
    ...clamp(3),
    marginTop: 12,
    fontFamily: DISPLAY,
    fontSize: 44,
    lineHeight: 1.05,
    letterSpacing: "-0.8px",
    fontWeight: 700,
    color: TINTA,
  };

  const descripcion: CSSProperties = {
    ...clamp(3),
    marginTop: 10,
    fontSize: 14.5,
    lineHeight: 1.55,
    color: GRIS,
  };

  const insignia: CSSProperties = {
    marginTop: 8,
    paddingLeft: 10,
    borderLeft: `2px solid ${accent}`,
    fontSize: 11,
    lineHeight: 1.45,
    color: GRIS,
  };

  const hero: CSSProperties = {
    position: "relative",
    marginTop: 14,
    height: 242,
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
    gap: 6,
    padding: "5px 10px",
    borderRadius: 999,
    backgroundColor: "rgba(20,21,25,0.82)",
    color: BLANCO,
    fontSize: 11,
    lineHeight: 1.2,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontWeight: 600,
    whiteSpace: "nowrap",
  };

  const puntoPill: CSSProperties = {
    display: "block",
    width: 5,
    height: 5,
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
    padding: "4px 10px",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.28)",
    color: BLANCO,
    fontSize: 11.5,
    lineHeight: 1.2,
    fontWeight: 600,
    letterSpacing: "0.01em",
    backdropFilter: "blur(6px)",
  };

  const filaKpis: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 10,
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
    fontSize: 24,
    lineHeight: 1.1,
    letterSpacing: "-0.3px",
    fontWeight: 700,
    color: TINTA,
    whiteSpace: "nowrap",
  };

  const etiquetaKpi: CSSProperties = {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 1.3,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: TENUE,
    whiteSpace: "nowrap",
  };

  const metodologia: CSSProperties = {
    marginTop: 18,
  };

  const tituloSeccion: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 11,
    lineHeight: 1.2,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 700,
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
    gap: "10px 14px",
    marginTop: 10,
  };

  const pilar: CSSProperties = {
    display: "flex",
    gap: 10,
    padding: "2px 0",
    minWidth: 0,
  };

  const paso: CSSProperties = {
    flexShrink: 0,
    alignSelf: "flex-start",
    padding: "3px 7px",
    borderRadius: 6,
    border: `1px solid ${LINEA}`,
    backgroundColor: LAVADO,
    fontFamily: SANS,
    fontSize: 11,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: accentTexto,
  };

  const pilarTexto: CSSProperties = {
    minWidth: 0,
  };

  const pilarTitulo: CSSProperties = {
    fontSize: 14,
    lineHeight: 1.2,
    fontWeight: 700,
    color: TINTA,
  };

  const pilarDescripcion: CSSProperties = {
    ...clamp(3),
    marginTop: 3,
    fontSize: 12,
    lineHeight: 1.45,
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
    fontSize: 11,
    lineHeight: 1.2,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 700,
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
    padding: "3px 6px",
    boxSizing: "border-box",
    backgroundColor: BLANCO,
    border: `1px solid ${LINEA}`,
    borderRadius: 6,
  };

  const logo: CSSProperties = {
    display: "block",
    maxHeight: 22,
    maxWidth: 84,
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
        <div style={insignia}>{data.insignia}</div>

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
