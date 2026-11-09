"use client";

/**
 * Hoja 2 — Inversión oficial en la moneda del visitante.
 *
 * Dedicada 100 % al precio y a los beneficios: arancel, cuotas sin interés,
 * medios de pago locales, qué incluye la inscripción y la banda de garantía.
 * El calendario y la tabla de equivalencias viven en `BrochureScheduleSheet`
 * (Hoja 3): esta hoja no renderiza cohortes.
 *
 * Tipografía grande: ningún texto baja de 11px y los textos de lectura van
 * entre 12.5px y 15px, con el precio a 52px. Todo inline style para que la
 * vista previa, la captura con `html-to-image` y el PDF midan igual.
 */

import type { CSSProperties, JSX } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";

export type BrochurePricingScheduleSheetProps = {
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
const OSCURO = "#141519";

/** Beneficios fijos de la inscripción, idénticos en vista y PDF. */
const INCLUYE = [
  "Clases 100% en vivo por Zoom",
  "Grabaciones ilimitadas de por vida",
  "Datasets y plantillas descargables",
  "Acompañamiento directo de los profesores",
  "Certificado digital verificable",
];

/**
 * El acento del curso sobre la tarjeta oscura: si es un color oscuro no se
 * leería, así que se cae a blanco puro.
 */
function acentoLegibleSobreOscuro(hex: string): string {
  const limpio = (hex || "").replace("#", "").trim();
  const completo =
    limpio.length === 3
      ? limpio
          .split("")
          .map((caracter) => caracter + caracter)
          .join("")
      : limpio;

  if (!/^[0-9a-f]{6}$/i.test(completo)) return BLANCO;

  const canal = (inicio: number): number => {
    const valor = parseInt(completo.slice(inicio, inicio + 2), 16) / 255;
    return valor <= 0.03928
      ? valor / 12.92
      : Math.pow((valor + 0.055) / 1.055, 2.4);
  };

  const luminancia =
    0.2126 * canal(0) + 0.7152 * canal(2) + 0.0722 * canal(4);

  return luminancia >= 0.4 ? hex : BLANCO;
}

export function BrochurePricingScheduleSheet({
  data,
  pageNumber,
  totalPages,
}: BrochurePricingScheduleSheetProps): JSX.Element {
  const accent = data.accentColor;
  const acentoOscuro = acentoLegibleSobreOscuro(accent);
  const whatsappUrl = data.whatsappUrl;
  const precioLista = data.precioListaFormateado;
  const mostrarLista = Boolean(precioLista) && data.descuentoPct > 0;
  const urlInscripcion = `https://programbi.com${data.inscripcionUrl}`;

  const contenido: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    height: "100%",
    minHeight: 0,
    fontFamily: SANS,
    color: TINTA,
  };

  /* ── Cabecera editorial ─────────────────────────────────────────────── */

  const kicker: CSSProperties = {
    margin: 0,
    fontSize: 11,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: accent,
  };

  const titulo: CSSProperties = {
    margin: "5px 0 0",
    fontFamily: DISPLAY,
    fontSize: 32,
    lineHeight: 1.1,
    fontWeight: 700,
    letterSpacing: "-0.01em",
    color: TINTA,
  };

  const subtitulo: CSSProperties = {
    margin: "7px 0 0",
    fontSize: 14.5,
    lineHeight: 1.5,
    color: GRIS,
  };

  /* ── Bloque de precio ───────────────────────────────────────────────── */

  const bloquePrecio: CSSProperties = {
    flexShrink: 0,
    paddingTop: 16,
    paddingBottom: 16,
    borderTop: `1px solid ${LINEA}`,
    borderBottom: `1px solid ${LINEA}`,
  };

  const etiquetaPrecio: CSSProperties = {
    fontSize: 11,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: TENUE,
  };

  const filaPrecio: CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 6,
  };

  const precioGrande: CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: data.precio != null ? 52 : 30,
    lineHeight: 1.02,
    letterSpacing: "-0.02em",
    fontWeight: 700,
    color: TINTA,
  };

  const precioListaTachado: CSSProperties = {
    paddingBottom: 8,
    fontSize: 18,
    lineHeight: 1.2,
    color: TENUE,
    textDecoration: "line-through",
  };

  const badgeDescuento: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    marginBottom: 8,
    padding: "3px 10px",
    borderRadius: 999,
    backgroundColor: `${accent}1A`,
    color: accent,
    fontSize: 13,
    lineHeight: 1.2,
    fontWeight: 700,
    whiteSpace: "nowrap",
  };

  const notaPago: CSSProperties = {
    margin: "8px 0 0",
    fontSize: 12.5,
    lineHeight: 1.45,
    color: GRIS,
  };

  /* ── Caja de 3 cuotas sin interés ───────────────────────────────────── */

  const cajaCuotas: CSSProperties = {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: 5,
    border: `1px solid ${LINEA}`,
    borderRadius: 12,
    padding: "14px 18px",
    backgroundColor: BLANCO,
  };

  const etiquetaCuotas: CSSProperties = {
    fontSize: 11.5,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: accent,
  };

  const montoCuota: CSSProperties = {
    fontSize: 20,
    lineHeight: 1.25,
    fontWeight: 700,
    color: TINTA,
  };

  const notaCuotas: CSSProperties = {
    margin: 0,
    fontSize: 12.5,
    lineHeight: 1.45,
    color: GRIS,
  };

  /* ── Medios de pago locales ─────────────────────────────────────────── */

  const bloqueMedios: CSSProperties = {
    flexShrink: 0,
  };

  const tituloMedios: CSSProperties = {
    fontSize: 11.5,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: TENUE,
  };

  const filaMedios: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 9,
  };

  const chipMedio: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: 999,
    border: `1px solid ${LINEA}`,
    backgroundColor: LAVADO,
    color: GRIS,
    fontSize: 12.5,
    lineHeight: 1.2,
    fontWeight: 500,
    whiteSpace: "nowrap",
  };

  /* ── Tarjeta oscura: qué incluye tu inscripción ─────────────────────── */

  const tarjetaOscura: CSSProperties = {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    backgroundColor: OSCURO,
    borderRadius: 14,
    padding: "18px 20px",
    boxSizing: "border-box",
    color: BLANCO,
  };

  const tituloIncluye: CSSProperties = {
    fontSize: 12,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: acentoOscuro,
  };

  const listaIncluye: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 10,
  };

  const itemIncluye: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    fontSize: 13.5,
    lineHeight: 1.45,
    color: "rgba(255,255,255,0.92)",
  };

  const check: CSSProperties = {
    flexShrink: 0,
    width: 18,
    fontSize: 18,
    lineHeight: 1.1,
    fontWeight: 700,
    color: acentoOscuro,
  };

  const acciones: CSSProperties = {
    marginTop: "auto",
    paddingTop: 14,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const cta: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    borderRadius: 999,
    backgroundColor: BLANCO,
    color: OSCURO,
    fontSize: 13.5,
    lineHeight: 1.2,
    fontWeight: 700,
    textDecoration: "none",
    textAlign: "center",
  };

  const ctaWhatsapp: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.34)",
    backgroundColor: "rgba(255,255,255,0.06)",
    color: BLANCO,
    fontSize: 13.5,
    lineHeight: 1.2,
    fontWeight: 700,
    textDecoration: "none",
    textAlign: "center",
  };

  /* ── Banda de garantía y certificación ──────────────────────────────── */

  const bandaGarantia: CSSProperties = {
    flexShrink: 0,
    backgroundColor: LAVADO,
    borderRadius: 12,
    padding: "14px 18px",
  };

  const tituloGarantia: CSSProperties = {
    fontSize: 11.5,
    lineHeight: 1.3,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: TINTA,
  };

  const filaKpis: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 10,
    marginTop: 10,
  };

  const kpi: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 0,
  };

  const kpiValor: CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: 24,
    lineHeight: 1.1,
    fontWeight: 700,
    color: TINTA,
  };

  const kpiEtiqueta: CSSProperties = {
    fontSize: 11,
    lineHeight: 1.25,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: TENUE,
  };

  return (
    <BrochureA4Sheet
      data={data}
      pageNumber={pageNumber}
      totalPages={totalPages}
      className="brochure-pricing-sheet"
    >
      <div style={contenido}>
        <header style={{ flexShrink: 0 }}>
          <p style={kicker}>Inversión y beneficios</p>
          <h2 style={titulo}>Inversión oficial en tu moneda</h2>
          <p style={subtitulo}>
            {`Arancel oficial en ${data.paisNombre}, con becas ya aplicadas y 3 cuotas sin interés. El valor que ves es el final: sin matrícula ni cargos ocultos.`}
          </p>
        </header>

        {/* Precio oficial y descuento vigente */}
        <section style={bloquePrecio}>
          <div style={etiquetaPrecio}>
            {`Arancel oficial · ${data.paisNombre}`}
          </div>

          <div style={filaPrecio}>
            <span style={precioGrande}>{data.precioFormateado}</span>

            {mostrarLista && precioLista ? (
              <span style={precioListaTachado}>{precioLista}</span>
            ) : null}

            {data.descuentoPct > 0 ? (
              <span style={badgeDescuento}>
                {`−${data.descuentoPct}% OFF`}
              </span>
            ) : null}
          </div>

          {data.notaPago ? <p style={notaPago}>{data.notaPago}</p> : null}
        </section>

        {/* Tres cuotas sin interés */}
        <section style={cajaCuotas}>
          <div style={etiquetaCuotas}>3 CUOTAS SIN INTERÉS</div>
          <div style={montoCuota}>{data.cuotaTexto}</div>
          <p style={notaCuotas}>{data.notaCuotas}</p>
        </section>

        {/* Medios de pago locales (máximo 6 chips) */}
        <section style={bloqueMedios}>
          <div style={tituloMedios}>
            {`Medios de pago en ${data.paisNombre}`}
          </div>
          <div style={filaMedios}>
            {data.mediosPago.slice(0, 6).map((medio) => (
              <span key={medio} style={chipMedio}>
                {medio}
              </span>
            ))}
          </div>
        </section>

        {/* Qué incluye tu inscripción + CTAs */}
        <section style={tarjetaOscura}>
          <div style={tituloIncluye}>Qué incluye tu inscripción</div>

          <div style={listaIncluye}>
            {INCLUYE.map((beneficio) => (
              <div key={beneficio} style={itemIncluye}>
                <span aria-hidden="true" style={check}>
                  ✓
                </span>
                <span>{beneficio}</span>
              </div>
            ))}
          </div>

          <div style={acciones}>
            <a
              href={urlInscripcion}
              data-pdf-link={urlInscripcion}
              style={cta}
            >
              Inscribirme en programbi.com
            </a>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                data-pdf-link={whatsappUrl}
                style={ctaWhatsapp}
              >
                Hablar por WhatsApp
              </a>
            ) : null}
          </div>
        </section>

        {/* Garantía académica y certificación */}
        <section style={bandaGarantia}>
          <div style={tituloGarantia}>
            Garantía académica y certificación verificable ProgramBI
          </div>

          <div style={filaKpis}>
            <div style={kpi}>
              <span style={kpiValor}>{`${data.hours} h`}</span>
              <span style={kpiEtiqueta}>en vivo</span>
            </div>
            <div style={kpi}>
              <span style={kpiValor}>{data.modulesCount}</span>
              <span style={kpiEtiqueta}>módulos</span>
            </div>
            <div style={kpi}>
              <span style={kpiValor}>{data.levelsCount}</span>
              <span style={kpiEtiqueta}>
                {data.levelsCount === 1 ? "nivel" : "niveles"}
              </span>
            </div>
            <div style={kpi}>
              <span style={kpiValor}>Verificable</span>
              <span style={kpiEtiqueta}>certificado</span>
            </div>
          </div>
        </section>
      </div>
    </BrochureA4Sheet>
  );
}
