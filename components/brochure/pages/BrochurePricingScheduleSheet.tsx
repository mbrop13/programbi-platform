"use client";

/**
 * Hoja 2 — Inversión, cuotas, medios de pago y calendario localizado.
 *
 * El precio y las cohortes llegan ya calculados desde el servidor: aquí solo
 * se compone la pieza editorial. La tabla de equivalencias se parsea de
 * `data.equivalencias.cadenaMercados` y nunca inventa horarios.
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

type FilaEquivalencia = { mercado: string; hora: string };

/**
 * Primera fila: el país del brochure. Luego los mercados de la cadena
 * (`"10:00 en Argentina = 09:00 en Perú"`), sin duplicar el país actual.
 */
function filasEquivalencia(data: CourseBrochureData): FilaEquivalencia[] {
  const filas: FilaEquivalencia[] = [
    { mercado: data.paisNombre, hora: data.equivalencias.inicio },
  ];

  for (const tramo of data.equivalencias.cadenaMercados.split(" = ")) {
    const coincidencia = tramo.trim().match(/^(\d{1,2}:\d{2})\s+en\s+(.+)$/);
    if (!coincidencia) continue;

    const hora = coincidencia[1];
    const mercado = coincidencia[2]?.trim();
    if (!hora || !mercado) continue;
    if (mercado === data.paisNombre) continue;
    if (filas.some((fila) => fila.mercado === mercado)) continue;

    filas.push({ mercado, hora });
    if (filas.length === 8) break;
  }

  return filas;
}

export function BrochurePricingScheduleSheet({
  data,
  pageNumber,
  totalPages,
}: BrochurePricingScheduleSheetProps): JSX.Element {
  const accent = data.accentColor;
  const whatsappUrl = data.whatsappUrl;
  const precioLista = data.precioListaFormateado;
  const equivalencias = filasEquivalencia(data);

  const contenido: CSSProperties = {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    fontFamily: SANS,
    color: TINTA,
  };

  const kicker: CSSProperties = {
    fontSize: 7.2,
    lineHeight: 1.2,
    letterSpacing: 1.9,
    fontWeight: 700,
    textTransform: "uppercase",
    color: accent,
  };

  const tituloSeccion: CSSProperties = {
    marginTop: 8,
    fontFamily: DISPLAY,
    fontSize: 27,
    lineHeight: 1.12,
    letterSpacing: -0.6,
    fontWeight: 400,
    color: TINTA,
  };

  const subtituloSeccion: CSSProperties = {
    marginTop: 5,
    fontSize: 8.6,
    lineHeight: 1.45,
    color: GRIS,
  };

  const bloquePrecio: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 232px",
    gap: 12,
    alignItems: "stretch",
    marginTop: 14,
  };

  const tarjetaPrecio: CSSProperties = {
    backgroundColor: BLANCO,
    border: `1px solid ${LINEA}`,
    borderRadius: 14,
    padding: 18,
    boxSizing: "border-box",
    minWidth: 0,
  };

  const etiquetaArancel: CSSProperties = {
    fontSize: 7.4,
    lineHeight: 1.2,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: TENUE,
    fontWeight: 600,
  };

  const filaPrecio: CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 4,
  };

  const precioGrande: CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: data.precio != null ? 40 : 22,
    lineHeight: 1,
    letterSpacing: -1,
    fontWeight: 700,
    color: TINTA,
  };

  const columnaPrecioLista: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 4,
    paddingBottom: 4,
  };

  const precioListaTachado: CSSProperties = {
    fontSize: 11,
    lineHeight: 1.2,
    color: TENUE,
    textDecoration: "line-through",
  };

  const badgeDescuento: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: 999,
    backgroundColor: `${accent}18`,
    color: accent,
    fontSize: 7.4,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: 0.4,
    whiteSpace: "nowrap",
  };

  const cajaCuotas: CSSProperties = {
    marginTop: 10,
    backgroundColor: LAVADO,
    borderRadius: 10,
    padding: "10px 12px",
  };

  const etiquetaCuotas: CSSProperties = {
    fontSize: 7,
    lineHeight: 1.2,
    letterSpacing: 1.3,
    textTransform: "uppercase",
    fontWeight: 700,
    color: accent,
  };

  const textoCuotas: CSSProperties = {
    marginTop: 3,
    fontSize: 10.5,
    lineHeight: 1.3,
    fontWeight: 700,
    color: TINTA,
  };

  const notaCuotas: CSSProperties = {
    marginTop: 3,
    fontSize: 7,
    lineHeight: 1.35,
    color: TENUE,
  };

  const tituloMedios: CSSProperties = {
    marginTop: 12,
    fontSize: 6.8,
    lineHeight: 1.2,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: TENUE,
    fontWeight: 600,
  };

  const filaMedios: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 6,
  };

  const chipMedio: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 7px",
    borderRadius: 999,
    border: `1px solid ${LINEA}`,
    backgroundColor: BLANCO,
    color: GRIS,
    fontSize: 7,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  };

  const notaPago: CSSProperties = {
    marginTop: 8,
    fontSize: 6.4,
    lineHeight: 1.35,
    color: TENUE,
  };

  const tarjetaOscura: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    backgroundColor: OSCURO,
    borderRadius: 14,
    padding: 16,
    boxSizing: "border-box",
    color: BLANCO,
    minWidth: 0,
  };

  const tituloIncluye: CSSProperties = {
    fontSize: 6.8,
    lineHeight: 1.2,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
    fontWeight: 600,
  };

  const listaIncluye: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    marginTop: 10,
  };

  const itemIncluye: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: 7,
    fontSize: 7.8,
    lineHeight: 1.35,
    color: "rgba(255,255,255,0.9)",
  };

  const check: CSSProperties = {
    flexShrink: 0,
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: accent,
    color: BLANCO,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 8,
    lineHeight: 1,
    fontWeight: 700,
  };

  const acciones: CSSProperties = {
    marginTop: "auto",
    paddingTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const cta: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px",
    borderRadius: 999,
    backgroundColor: BLANCO,
    color: TINTA,
    fontSize: 8.4,
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
    padding: "7px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.3)",
    color: BLANCO,
    fontSize: 7.4,
    lineHeight: 1.2,
    fontWeight: 600,
    textDecoration: "none",
    textAlign: "center",
  };

  const bloqueFechas: CSSProperties = {
    marginTop: 14,
  };

  const rotulo: CSSProperties = {
    fontSize: 7.2,
    lineHeight: 1.2,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: TENUE,
    fontWeight: 600,
  };

  const rotuloTabla: CSSProperties = {
    fontSize: 6.8,
    lineHeight: 1.2,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: TENUE,
    fontWeight: 600,
  };

  const grillaFechas: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 8,
    marginTop: 8,
  };

  const tarjetaFecha: CSSProperties = {
    backgroundColor: BLANCO,
    border: `1px solid ${LINEA}`,
    borderRadius: 10,
    padding: "10px 12px",
    boxSizing: "border-box",
    minWidth: 0,
  };

  const nivelFecha: CSSProperties = {
    fontSize: 6.8,
    lineHeight: 1.2,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: TENUE,
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const fechaInicio: CSSProperties = {
    marginTop: 2,
    fontSize: 9.6,
    lineHeight: 1.25,
    fontWeight: 700,
    color: TINTA,
  };

  const diasFecha: CSSProperties = {
    marginTop: 2,
    fontSize: 7.2,
    lineHeight: 1.3,
    color: GRIS,
  };

  const horarioFecha: CSSProperties = {
    marginTop: 4,
    fontSize: 9.2,
    lineHeight: 1.2,
    fontWeight: 700,
    color: accent,
  };

  const horaChile: CSSProperties = {
    marginTop: 1,
    fontSize: 6.8,
    lineHeight: 1.2,
    color: TENUE,
  };

  const bloqueEquivalencias: CSSProperties = {
    marginTop: 18,
  };

  const subtituloTabla: CSSProperties = {
    marginTop: 3,
    fontSize: 7,
    lineHeight: 1.4,
    color: TENUE,
  };

  const marcoTabla: CSSProperties = {
    marginTop: 6,
    border: `1px solid ${LINEA}`,
    borderRadius: 8,
    overflow: "hidden",
  };

  const tabla: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 7.6,
  };

  const th: CSSProperties = {
    backgroundColor: OSCURO,
    color: BLANCO,
    fontSize: 6.8,
    lineHeight: 1.2,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    fontWeight: 600,
    padding: "4px 8px",
    textAlign: "left",
  };

  const thHora: CSSProperties = {
    ...th,
    textAlign: "right",
  };

  const td: CSSProperties = {
    padding: "4px 8px",
    lineHeight: 1.3,
    color: TINTA,
    borderTop: `1px solid ${LINEA}`,
  };

  const tdHora: CSSProperties = {
    ...td,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    fontWeight: 600,
  };

  const notaFinal: CSSProperties = {
    marginTop: 6,
    fontSize: 6.6,
    lineHeight: 1.4,
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
        <header>
          <div style={kicker}>INVERSIÓN Y CALENDARIO</div>
          <h2 style={tituloSeccion}>Tu inversión y próximas fechas</h2>
          <p style={subtituloSeccion}>
            {`Precios en ${data.moneda}, cuotas sin interés y fechas en la hora local de ${data.paisNombre}.`}
          </p>
        </header>

        {/* A. Precio, cuotas, medios de pago y qué incluye */}
        <div style={bloquePrecio}>
          <div style={tarjetaPrecio}>
            <div style={etiquetaArancel}>
              {`Arancel oficial en ${data.paisNombre}`}
            </div>

            <div style={filaPrecio}>
              <span style={precioGrande}>{data.precioFormateado}</span>
              {precioLista || data.descuentoPct > 0 ? (
                <div style={columnaPrecioLista}>
                  {precioLista ? (
                    <span style={precioListaTachado}>{precioLista}</span>
                  ) : null}
                  {data.descuentoPct > 0 ? (
                    <span style={badgeDescuento}>
                      {`−${data.descuentoPct}% OFF`}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div style={cajaCuotas}>
              <div style={etiquetaCuotas}>3 CUOTAS SIN INTERÉS</div>
              <div style={textoCuotas}>{data.cuotaTexto}</div>
              <div style={notaCuotas}>{data.notaCuotas}</div>
            </div>

            <div style={tituloMedios}>
              {`MEDIOS DE PAGO EN ${data.paisNombre.toUpperCase()}`}
            </div>
            <div style={filaMedios}>
              {data.mediosPago.slice(0, 6).map((medio) => (
                <span key={medio} style={chipMedio}>
                  {medio}
                </span>
              ))}
            </div>

            {data.notaPago ? <div style={notaPago}>{data.notaPago}</div> : null}
          </div>

          <aside style={tarjetaOscura}>
            <div style={tituloIncluye}>QUÉ INCLUYE TU INSCRIPCIÓN</div>

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
                href={data.inscripcionUrl}
                data-pdf-link={data.inscripcionUrl}
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
          </aside>
        </div>

        {/* B. Próximas fechas de inicio */}
        <section style={bloqueFechas}>
          <div style={rotulo}>
            {`PRÓXIMAS FECHAS DE INICIO · HORA DE ${data.paisNombre.toUpperCase()}`}
          </div>

          <div style={grillaFechas}>
            {data.schedules.length === 0 ? (
              <div style={{ ...tarjetaFecha, gridColumn: "1 / -1" }}>
                <div style={fechaInicio}>
                  Cupos abiertos — consulta la próxima fecha
                </div>
                <div style={diasFecha}>
                  Escríbenos y te confirmamos la cohorte más cercana.
                </div>
              </div>
            ) : (
              data.schedules.slice(0, 4).map((cohorte) => (
                <div key={cohorte.id} style={tarjetaFecha}>
                  <div style={nivelFecha}>{cohorte.nivel}</div>
                  <div style={fechaInicio}>{cohorte.fecha}</div>
                  <div style={diasFecha}>
                    {`${cohorte.dias}${
                      cohorte.hours ? ` · ${cohorte.hours} horas` : ""
                    }`}
                  </div>
                  <div style={horarioFecha}>{cohorte.horario}</div>
                  <div style={horaChile}>{cohorte.horaChile}</div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* C. Equivalencia horaria entre mercados */}
        <section style={bloqueEquivalencias}>
          <div style={rotuloTabla}>LA MISMA CLASE EN CADA PAÍS</div>
          <div style={subtituloTabla}>
            {`Inicio ${data.equivalencias.inicio} · Término ${data.equivalencias.fin} · ${data.equivalencias.offset} en ${data.paisNombre}`}
          </div>

          <div style={marcoTabla}>
            <table style={tabla}>
              <thead>
                <tr>
                  <th style={th}>Mercado</th>
                  <th style={thHora}>Hora local</th>
                </tr>
              </thead>
              <tbody>
                {equivalencias.map((fila, indice) => (
                  <tr
                    key={fila.mercado}
                    style={{
                      backgroundColor: indice % 2 === 0 ? BLANCO : LAVADO,
                    }}
                  >
                    <td style={td}>{fila.mercado}</td>
                    <td style={tdHora}>{fila.hora}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={notaFinal}>
            Los horarios consideran el horario de verano de cada país y pueden
            variar según la fecha de inicio. Todas las clases quedan grabadas y
            disponibles de por vida.
          </div>
        </section>
      </div>
    </BrochureA4Sheet>
  );
}
