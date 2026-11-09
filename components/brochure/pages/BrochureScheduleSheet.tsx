"use client";

/**
 * Hoja 3 — Próximas fechas de inicio y horarios en hora del país.
 *
 * Contrato compartido: WS3 (diseño editorial de esta hoja) y WS7 (visor y PDF)
 * acuerdan esta firma. El componente recibe `data` ya calculado en servidor:
 * aquí no se inventan fechas, horarios ni equivalencias.
 */

import type { CSSProperties, JSX } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";

export type BrochureScheduleSheetProps = {
  data: CourseBrochureData;
  pageNumber: number;
  totalPages: number;
};

const SANS = '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const DISPLAY = 'Georgia, "Times New Roman", serif';

const TINTA = "#141519";
const GRIS = "#5C5D63";
const TENUE = "#77786F";
const LINEA = "#E7E4DA";
const LAVADO = "#F1EFE8";

type FilaEquivalencia = { mercado: string; hora: string };

/** Primera fila: el país del brochure. Luego la cadena de mercados, sin duplicar. */
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
  };

  const kicker: CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: accent,
    margin: 0,
  };

  const titulo: CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: 32,
    lineHeight: 1.1,
    fontWeight: 700,
    color: TINTA,
    margin: "4px 0 0",
  };

  const subtitulo: CSSProperties = {
    fontSize: 14.5,
    lineHeight: 1.5,
    color: GRIS,
    margin: "6px 0 0",
  };

  const grilla: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 14,
  };

  const tarjeta: CSSProperties = {
    border: `1px solid ${LINEA}`,
    borderRadius: 12,
    padding: "18px 20px",
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  const tabla: CSSProperties = {
    border: `1px solid ${LINEA}`,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  };

  const th: CSSProperties = {
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: TENUE,
    textAlign: "left",
    padding: "9px 14px",
    backgroundColor: LAVADO,
  };

  const td: CSSProperties = {
    fontSize: 13.5,
    color: TINTA,
    padding: "9px 14px",
    borderTop: `1px solid ${LINEA}`,
  };

  return (
    <BrochureA4Sheet data={data} pageNumber={pageNumber} totalPages={totalPages}>
      <div style={contenido}>
        <header>
          <p style={kicker}>Calendario oficial</p>
          <h2 style={titulo}>Próximas fechas de inicio</h2>
          <p style={subtitulo}>
            Horarios convertidos a la hora de {data.paisNombre}. La misma clase en vivo,
            en tu horario.
          </p>
        </header>

        {cohortes.length > 0 ? (
          <div style={grilla}>
            {cohortes.map((cohorte) => (
              <article key={cohorte.id} style={tarjeta}>
                <p
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: accent,
                    margin: 0,
                  }}
                >
                  {cohorte.nivel}
                </p>
                <p style={{ fontSize: 17, fontWeight: 700, color: TINTA, margin: 0 }}>
                  {cohorte.fecha}
                </p>
                <p style={{ fontSize: 13.5, color: GRIS, margin: 0 }}>
                  {cohorte.dias}
                  {cohorte.hours ? ` · ${cohorte.hours} horas` : ""}
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, color: accent, margin: 0 }}>
                  {cohorte.horario}
                </p>
                <p style={{ fontSize: 12, color: TENUE, margin: 0 }}>{cohorte.horaChile}</p>
              </article>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 13.5, color: GRIS, margin: 0 }}>
            Sin fecha publicada: coordinamos la cohorte contigo al inscribirte.
          </p>
        )}

        <section>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: TINTA, margin: "0 0 4px" }}>
            La misma clase en vivo en cada país
          </h3>
          <p style={{ fontSize: 13, color: GRIS, margin: "0 0 8px" }}>
            Inicio {data.equivalencias.inicio} · término {data.equivalencias.fin} ·{" "}
            {data.equivalencias.offset}
          </p>
          <table style={{ ...tabla, width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>País</th>
                <th style={{ ...th, textAlign: "right" }}>Hora local</th>
              </tr>
            </thead>
            <tbody>
              {equivalencias.map((fila, indice) => (
                <tr key={fila.mercado} style={indice === 0 ? { backgroundColor: "#FBFAF6" } : undefined}>
                  <td style={td}>
                    {fila.mercado}
                    {indice === 0 ? (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: accent,
                          border: `1px solid ${accent}`,
                          borderRadius: 999,
                          padding: "1px 7px",
                        }}
                      >
                        Tu país
                      </span>
                    ) : null}
                  </td>
                  <td style={{ ...td, textAlign: "right", fontWeight: indice === 0 ? 700 : 500 }}>
                    {fila.hora}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <p style={{ fontSize: 12.5, lineHeight: 1.5, color: TENUE, margin: 0 }}>
          Todas las clases quedan grabadas en el campus y puedes verlas de por vida.
        </p>
      </div>
    </BrochureA4Sheet>
  );
}
