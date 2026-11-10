"use client";

/**
 * Hoja 2 — Inversión en la moneda del visitante.
 *
 * Precio único desde `CourseBrochureData` (nunca cifras a mano), cuotas sin
 * interés, medios de pago locales y el checklist de la inscripción sobre una
 * tarjeta clara con filete del acento. El calendario y las equivalencias
 * horarias viven en `BrochureScheduleSheet` (hoja 3): esta hoja no renderiza
 * cohortes.
 *
 * Todo va inline para que la vista previa, la captura con `html-to-image` y el
 * PDF midan exactamente igual. Sin paneles oscuros: papel, hairlines y un solo
 * acento en los detalles.
 */

import type { CSSProperties, JSX } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import {
  FONT_DISPLAY,
  FONT_SANS,
  RADIUS,
  T,
  TYPE,
  accentOf,
  tint,
} from "@/lib/brochure/brochure-theme";

export type BrochurePricingScheduleSheetProps = {
  data: CourseBrochureData;
  pageNumber: number;
  totalPages: number;
};

/** Beneficios fijos de la inscripción, idénticos en vista y PDF. */
const INCLUYE = [
  "Clases 100% en vivo por Zoom",
  "Grabaciones ilimitadas de por vida",
  "Datasets y plantillas descargables",
  "Acompañamiento directo de los profesores",
  "Certificado digital verificable",
];

/** Tokens tipográficos del tema, traducidos a CSS inline. */
type TipoToken = {
  readonly size: number;
  readonly line: number;
  readonly weight: number;
  readonly family: string;
  readonly tracking?: string;
  readonly upper?: boolean;
};

function tipografia(token: TipoToken): CSSProperties {
  const estilo: CSSProperties = {
    fontFamily: token.family === "display" ? FONT_DISPLAY : FONT_SANS,
    fontSize: token.size,
    lineHeight: token.line,
    fontWeight: token.weight,
  };
  if (token.tracking) estilo.letterSpacing = token.tracking;
  if (token.upper) estilo.textTransform = "uppercase";
  return estilo;
}

/** Luminancia relativa WCAG de un color hex de seis dígitos. */
function luminanciaRelativa(hex: string): number {
  const limpio = (hex || "").replace("#", "").trim();
  const completo =
    limpio.length === 3
      ? limpio
          .split("")
          .map((caracter) => caracter + caracter)
          .join("")
      : limpio;

  if (!/^[0-9a-f]{6}$/i.test(completo)) return 0;

  const canales = [0, 2, 4].map((inicio) => {
    const valor = parseInt(completo.slice(inicio, inicio + 2), 16) / 255;
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
 * El acento manda en los textos salvo que no llegue a 3:1 contra el papel
 * (el amarillo de Power BI, por ejemplo): ahí el detalle pasa a tinta y el
 * color se conserva en el filete y en los tintes de fondo.
 */
function acentoLegible(acento: string): string {
  const frente = luminanciaRelativa(acento);
  const fondo = luminanciaRelativa(T.paper);
  const contraste =
    (Math.max(frente, fondo) + 0.05) / (Math.min(frente, fondo) + 0.05);
  return contraste >= 3 ? acento : T.ink;
}

export function BrochurePricingScheduleSheet({
  data,
  pageNumber,
  totalPages,
}: BrochurePricingScheduleSheetProps): JSX.Element {
  const accent = accentOf(data.accentColor);
  const acentoTexto = acentoLegible(accent);
  const whatsappUrl = data.whatsappUrl;
  const precioLista = data.precioListaFormateado;
  const mostrarLista = Boolean(precioLista) && data.descuentoPct > 0;
  const urlInscripcion = `https://programbi.com${data.inscripcionUrl}`;

  const contenido: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    height: "100%",
    minHeight: 0,
    fontFamily: FONT_SANS,
    color: T.ink,
  };

  /* ── Cabecera editorial ─────────────────────────────────────────────── */

  const kicker: CSSProperties = {
    ...tipografia(TYPE.kicker),
    margin: 0,
    color: acentoTexto,
  };

  const titulo: CSSProperties = {
    ...tipografia(TYPE.h1),
    margin: "8px 0 0",
    letterSpacing: "-0.012em",
    color: T.ink,
  };

  const subtitulo: CSSProperties = {
    ...tipografia(TYPE.body),
    margin: "9px 0 0",
    maxWidth: 610,
    color: T.mute,
  };

  /* ── Bloque de precio ───────────────────────────────────────────────── */

  const bloquePrecio: CSSProperties = {
    flexShrink: 0,
    padding: "20px 0 18px",
    borderTop: `1px solid ${T.line}`,
    borderBottom: `1px solid ${T.line}`,
  };

  const etiquetaPrecio: CSSProperties = {
    ...tipografia(TYPE.kicker),
    color: T.mute,
  };

  const filaPrecio: CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    flexWrap: "wrap",
    columnGap: 14,
    rowGap: 6,
    marginTop: 4,
  };

  const precioGrande: CSSProperties =
    data.precio != null
      ? {
          ...tipografia(TYPE.price),
          letterSpacing: "-0.02em",
          color: T.ink,
        }
      : {
          ...tipografia(TYPE.h1),
          letterSpacing: "-0.01em",
          color: T.ink,
        };

  const precioListaTachado: CSSProperties = {
    ...tipografia(TYPE.h2),
    paddingBottom: 10,
    fontWeight: 400,
    color: T.mute,
    textDecoration: "line-through",
  };

  const badgeDescuento: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    marginBottom: 10,
    padding: "5px 12px",
    borderRadius: RADIUS.chip,
    border: `1px solid ${tint(accent, 0.2)}`,
    backgroundColor: tint(accent, 0.09),
    color: acentoTexto,
    fontSize: 13,
    lineHeight: 1.15,
    fontWeight: 700,
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
  };

  const notaPago: CSSProperties = {
    ...tipografia(TYPE.small),
    margin: "12px 0 0",
    maxWidth: 640,
    color: T.mute,
  };

  /* ── Tarjeta de cuotas sin interés ──────────────────────────────────── */

  const cajaCuotas: CSSProperties = {
    flexShrink: 0,
    padding: "20px 24px",
    borderRadius: RADIUS.card,
    border: `1px solid ${tint(accent, 0.2)}`,
    backgroundColor: tint(accent, 0.05),
  };

  const etiquetaCuotas: CSSProperties = {
    ...tipografia(TYPE.kicker),
    color: acentoTexto,
  };

  const textoCuota: CSSProperties = {
    margin: "8px 0 0",
    fontFamily: FONT_SANS,
    fontSize: 22,
    lineHeight: 1.35,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: T.ink,
  };

  /* ── Medios de pago locales ─────────────────────────────────────────── */

  const bloqueMedios: CSSProperties = {
    flexShrink: 0,
  };

  const tituloMedios: CSSProperties = {
    ...tipografia(TYPE.kicker),
    color: T.mute,
  };

  const filaMedios: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  };

  const chipMedio: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "7px 13px",
    borderRadius: RADIUS.chip,
    border: `1px solid ${T.line}`,
    backgroundColor: T.wash,
    color: T.inkSoft,
    fontFamily: FONT_SANS,
    fontSize: 12,
    lineHeight: 1.2,
    fontWeight: 500,
    whiteSpace: "nowrap",
  };

  /* ── Tarjeta clara: qué incluye tu inscripción ──────────────────────── */

  const tarjetaIncluye: CSSProperties = {
    flex: 1,
    minHeight: 0,
    display: "flex",
    gap: 16,
    boxSizing: "border-box",
    padding: "22px 24px",
    borderRadius: RADIUS.card,
    border: `1px solid ${T.line}`,
    backgroundColor: T.wash,
  };

  const fileteAcento: CSSProperties = {
    width: 4,
    flexShrink: 0,
    borderRadius: RADIUS.chip,
    backgroundColor: accent,
  };

  const columnaIncluye: CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  };

  const tituloIncluye: CSSProperties = {
    ...tipografia(TYPE.h2),
    margin: 0,
    color: T.ink,
  };

  const listaIncluye: CSSProperties = {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    gap: 0,
    margin: "12px 0 16px",
    padding: 0,
    listStyle: "none",
  };

  const itemIncluye: CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 12,
    minHeight: 0,
    borderBottom: `1px solid ${T.line}`,
  };

  const itemIncluyeUltimo: CSSProperties = {
    ...itemIncluye,
    borderBottom: "none",
  };

  const check: CSSProperties = {
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
    borderRadius: RADIUS.chip,
    backgroundColor: tint(T.ok, 0.1),
    color: T.ok,
    fontSize: 13,
    lineHeight: 1,
    fontWeight: 700,
  };

  const textoIncluye: CSSProperties = {
    fontFamily: FONT_SANS,
    fontSize: 15,
    lineHeight: 1.5,
    color: T.inkSoft,
  };

  const acciones: CSSProperties = {
    marginTop: "auto",
    paddingTop: 16,
    borderTop: `1px solid ${T.line}`,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const botonBase: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 18px",
    borderRadius: RADIUS.chip,
    fontFamily: FONT_SANS,
    fontSize: 14,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.01em",
    textDecoration: "none",
    textAlign: "center",
  };

  const ctaPrimario: CSSProperties = {
    ...botonBase,
    padding: "13px 18px",
    backgroundColor: T.ink,
    color: T.paper,
  };

  const ctaWhatsapp: CSSProperties = {
    ...botonBase,
    border: `1.5px solid ${T.whatsapp}`,
    backgroundColor: T.paper,
    color: T.whatsapp,
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
          <p style={kicker}>{`Inversión · ${data.paisNombre}`}</p>
          <h2 style={titulo}>Precio y formas de pago</h2>
          <p style={subtitulo}>
            {`Arancel vigente y condiciones de pago en ${data.paisNombre}.`}
          </p>
        </header>

        {/* Precio oficial y descuento vigente, siempre desde data */}
        <section style={bloquePrecio} aria-label="Precio del programa">
          <div style={etiquetaPrecio}>
            {`Arancel oficial · ${data.paisNombre}`}
          </div>

          <div style={filaPrecio}>
            <span style={precioGrande}>{data.precioFormateado}</span>

            {mostrarLista && precioLista ? (
              <span style={precioListaTachado}>{precioLista}</span>
            ) : null}

            {data.descuentoPct > 0 ? (
              <span style={badgeDescuento}>{`−${data.descuentoPct}%`}</span>
            ) : null}
          </div>

          {data.notaPago ? <p style={notaPago}>{data.notaPago}</p> : null}
        </section>

        {/* Cuotas sin interés */}
        <section style={cajaCuotas} aria-label="Cuotas sin interés">
          <div style={etiquetaCuotas}>Paga en cuotas</div>
          <p style={textoCuota}>{data.cuotaTexto}</p>
        </section>

        {/* Medios de pago locales */}
        {data.mediosPago.length > 0 ? (
          <section style={bloqueMedios} aria-label="Medios de pago">
            <div style={tituloMedios}>Medios de pago</div>
            <div style={filaMedios}>
              {data.mediosPago.slice(0, 6).map((medio) => (
                <span key={medio} style={chipMedio}>
                  {medio}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {/* Qué incluye tu inscripción + acciones */}
        <section style={tarjetaIncluye} aria-label="Qué incluye tu inscripción">
          <div aria-hidden="true" style={fileteAcento} />

          <div style={columnaIncluye}>
            <h3 style={tituloIncluye}>Qué incluye tu inscripción</h3>

            <ul style={listaIncluye}>
              {INCLUYE.map((beneficio, indice) => (
                <li
                  key={beneficio}
                  style={
                    indice === INCLUYE.length - 1
                      ? itemIncluyeUltimo
                      : itemIncluye
                  }
                >
                  <span aria-hidden="true" style={check}>
                    ✓
                  </span>
                  <span style={textoIncluye}>{beneficio}</span>
                </li>
              ))}
            </ul>

            <div style={acciones}>
              <a
                href={urlInscripcion}
                data-pdf-link={urlInscripcion}
                style={ctaPrimario}
              >
                Inscribirme
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
          </div>
        </section>
      </div>
    </BrochureA4Sheet>
  );
}
