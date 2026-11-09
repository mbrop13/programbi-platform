"use client";

/**
 * Hoja 3 — Próximas fechas de inicio y horarios en la hora del país.
 *
 * Dedicada 100 % al calendario: cohortes confirmadas en tarjetas grandes y la
 * tabla de equivalencia horaria entre mercados. Los datos llegan calculados
 * desde el servidor (`data.schedules` y `data.equivalencias`): aquí no se
 * inventan fechas ni husos.
 *
 * Tipografía grande: ningún texto baja de 11px y los textos de lectura van
 * entre 12.5px y 15px. Todo inline style para que vista previa, captura y PDF
 * midan exactamente lo mismo.
 */

import type { CSSProperties, JSX } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";

export type BrochureScheduleSheetProps = {
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
const FILA_ACTUAL = "#FBFAF6";

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

export function BrochureScheduleSheet({
  data,
  pageNumber,
  totalPages,
}: BrochureScheduleSheetProps): JSX.Element {
  const accent = data.accentColor;
  const cohortes = data.schedules.slice(0, 4);
  const equivalencias = filasEquivalencia(data);

  const contenido: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 18,
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

  /* ── Cohortes confirmadas ───────────────────────────────────────────── */

  const grillaCohortes: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 14,
    flexShrink: 0,
  };

  const tarjetaCohorte: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
    border: `1px solid ${LINEA}`,
    borderRadius: 12,
    padding: "18px 20px",
    backgroundColor: BLANCO,
    boxSizing: "border-box",
  };

  const nivelCohorte: CSSProperties = {
    fontSize: 11.5,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: accent,
  };

  const fechaCohorte: CSSProperties = {
    fontSize: 17,
    lineHeight: 1.3,
    fontWeight: 700,
    color: TINTA,
  };

  const diasCohorte: CSSProperties = {
    fontSize: 13.5,
    lineHeight: 1.35,
    color: GRIS,
  };

  const horarioCohorte: CSSProperties = {
    marginTop: 2,
    fontSize: 16,
    lineHeight: 1.25,
    fontWeight: 700,
    color: accent,
  };

  const horaChileCohorte: CSSProperties = {
    fontSize: 12,
    lineHeight: 1.2,
    color: TENUE,
  };

  const tarjetaSinFecha: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    gridColumn: "1 / -1",
    border: `1px solid ${LINEA}`,
    borderRadius: 12,
    padding: "20px 22px",
    backgroundColor: BLANCO,
    boxSizing: "border-box",
  };

  /* ── Tabla de equivalencia horaria ──────────────────────────────────── */

  const bloqueTabla: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    maxHeight: 480,
  };

  const tituloTabla: CSSProperties = {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.25,
    fontWeight: 700,
    color: TINTA,
  };

  const subtituloTabla: CSSProperties = {
    margin: "4px 0 0",
    fontSize: 13,
    lineHeight: 1.4,
    color: GRIS,
  };

  const marcoTabla: CSSProperties = {
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    border: `1px solid ${LINEA}`,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: BLANCO,
  };

  const tabla: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    flex: "1 0 auto",
  };

  const th: CSSProperties = {
    backgroundColor: LAVADO,
    color: TENUE,
    fontSize: 11.5,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "9px 14px",
    textAlign: "left",
  };

  const thHora: CSSProperties = {
    ...th,
    textAlign: "right",
  };

  const td: CSSProperties = {
    padding: "9px 14px",
    fontSize: 13.5,
    lineHeight: 1.3,
    color: TINTA,
    borderTop: `1px solid ${LINEA}`,
    verticalAlign: "middle",
  };

  const tdHora: CSSProperties = {
    ...td,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
    fontWeight: 600,
  };

  const celdaPais: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 9,
  };

  const insigniaPais: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "1px 7px",
    borderRadius: 999,
    border: `1px solid ${accent}`,
    color: accent,
    fontSize: 10.5,
    lineHeight: 1.3,
    fontWeight: 700,
    whiteSpace: "nowrap",
  };

  const notaGrabaciones: CSSProperties = {
    margin: 0,
    marginTop: "auto",
    paddingTop: 2,
    fontSize: 12.5,
    lineHeight: 1.5,
    color: TENUE,
  };

  return (
    <BrochureA4Sheet data={data} pageNumber={pageNumber} totalPages={totalPages}>
      <div style={contenido}>
        <header style={{ flexShrink: 0 }}>
          <p style={kicker}>Calendario oficial</p>
          <h2 style={titulo}>Próximas fechas de inicio</h2>
          <p style={subtitulo}>
            {`Horarios convertidos a la hora de ${data.paisNombre}. La misma clase en vivo, en tu horario.`}
          </p>
        </header>

        {/* Cohortes confirmadas: máximo 4 tarjetas en grilla de 2 columnas */}
        {cohortes.length > 0 ? (
          <section style={grillaCohortes}>
            {cohortes.map((cohorte) => (
              <article key={cohorte.id} style={tarjetaCohorte}>
                <div style={nivelCohorte}>{cohorte.nivel}</div>
                <div style={fechaCohorte}>{cohorte.fecha}</div>
                <div style={diasCohorte}>
                  {`${cohorte.dias}${
                    cohorte.hours ? ` · ${cohorte.hours} horas` : ""
                  }`}
                </div>
                <div style={horarioCohorte}>{cohorte.horario}</div>
                {cohorte.horaChile && cohorte.horaChile !== cohorte.horario ? (
                  <div style={horaChileCohorte}>{cohorte.horaChile}</div>
                ) : null}
              </article>
            ))}
          </section>
        ) : (
          <section style={tarjetaSinFecha}>
            <div style={{ ...diasCohorte, fontSize: 13.5 }}>
              Sin fecha publicada: coordinamos la cohorte contigo al
              inscribirte.
            </div>
          </section>
        )}

        {/* Equivalencia horaria entre mercados */}
        <section style={bloqueTabla}>
          <h3 style={tituloTabla}>La misma clase en vivo en cada país</h3>
          <p style={subtituloTabla}>
            {`Inicio ${data.equivalencias.inicio} · término ${data.equivalencias.fin} · Hora de ${data.paisNombre} (${data.equivalencias.offset})`}
          </p>

          <div style={marcoTabla}>
            <table style={tabla}>
              <thead>
                <tr>
                  <th style={th}>País</th>
                  <th style={thHora}>Hora local</th>
                </tr>
              </thead>
              <tbody>
                {equivalencias.map((fila, indice) => {
                  const esPaisActual = indice === 0;
                  return (
                    <tr
                      key={fila.mercado}
                      style={
                        esPaisActual
                          ? { backgroundColor: FILA_ACTUAL }
                          : undefined
                      }
                    >
                      <td style={td}>
                        <span style={celdaPais}>
                          <span
                            style={
                              esPaisActual ? { fontWeight: 700 } : undefined
                            }
                          >
                            {fila.mercado}
                          </span>
                          {esPaisActual ? (
                            <span style={insigniaPais}>Tu país</span>
                          ) : null}
                        </span>
                      </td>
                      <td
                        style={
                          esPaisActual
                            ? { ...tdHora, fontWeight: 700 }
                            : tdHora
                        }
                      >
                        {fila.hora}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <p style={notaGrabaciones}>
          Todas las clases quedan grabadas en el campus y puedes verlas de por
          vida.
        </p>
      </div>
    </BrochureA4Sheet>
  );
}
