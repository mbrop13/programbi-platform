"use client";

/**
 * Hoja 3 — Fechas, horarios y equivalencias entre mercados.
 *
 * Tema claro común (tokens de `brochure-theme`): papel blanco, hairlines en
 * lugar de cajas oscuras y un solo acento del curso en detalles (filete del
 * encabezado y filo superior de la tabla). La tabla de cohortes es el centro
 * de la hoja —fecha de inicio, días, horario local y nivel— con filas alternas
 * en `T.wash`; debajo, la caja de equivalencias horarias en `T.brandSoft`
 * reparte las horas de cada mercado en fichas legibles.
 *
 * Todo inline style para que vista previa, captura y PDF midan exactamente lo
 * mismo. Los datos llegan calculados desde el servidor (`data.schedules` y
 * `data.equivalencias`): aquí no se inventan fechas, husos ni niveles.
 */

import type { CSSProperties, JSX } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
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

export type BrochureScheduleSheetProps = {
  data: CourseBrochureData;
  pageNumber: number;
  totalPages: number;
};

type FilaEquivalencia = { mercado: string; hora: string };

/** Máximo de cohortes que caben con aire en la hoja sin recortar. */
const MAX_COHORTES = 4;

/** Tope defensivo de mercados en la caja de equivalencias. */
const MAX_MERCADOS = 8;

/**
 * Mercados de `equivalencias.cadenaMercados`
 * (`"19:30 en Argentina = 16:30 en México = …"`), sin repetir el país del
 * brochure ni duplicar mercados. Si el texto no se puede interpretar, la caja
 * muestra la cadena tal cual.
 */
function mercadosEquivalentes(data: CourseBrochureData): FilaEquivalencia[] {
  const filas: FilaEquivalencia[] = [];

  for (const tramo of data.equivalencias.cadenaMercados.split(" = ")) {
    const coincidencia = tramo.trim().match(/^(\d{1,2}:\d{2})\s+en\s+(.+)$/);
    if (!coincidencia) continue;

    const hora = coincidencia[1];
    const mercado = coincidencia[2]?.trim();
    if (!hora || !mercado) continue;
    if (mercado === data.paisNombre) continue;
    if (filas.some((fila) => fila.mercado === mercado)) continue;

    filas.push({ mercado, hora });
    if (filas.length === MAX_MERCADOS) break;
  }

  return filas;
}

/**
 * `"19:30 a 21:30 · Hora de Perú"` → hora y etiqueta.
 * La etiqueta del país se anuncia en el encabezado, así la celda queda limpia.
 */
function horaLocal(horario: string): string {
  const [hora] = horario.split(" · ");
  return (hora ?? horario).trim();
}

export function BrochureScheduleSheet({
  data,
  pageNumber,
  totalPages,
}: BrochureScheduleSheetProps): JSX.Element {
  const accent = accentOf(data.accentColor);
  const cohortes = data.schedules.slice(0, MAX_COHORTES);
  const mercados = mercadosEquivalentes(data);

  const contenido: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: SPACE[4],
    height: "100%",
    minHeight: 0,
    fontFamily: FONT_SANS,
    color: T.ink,
  };

  /* ── Encabezado editorial ──────────────────────────────────────────── */

  const filete: CSSProperties = {
    display: "block",
    width: 30,
    height: 3,
    borderRadius: 2,
    backgroundColor: accent,
    marginBottom: SPACE[2],
  };

  const kicker: CSSProperties = {
    margin: 0,
    fontSize: TYPE.kicker.size,
    lineHeight: TYPE.kicker.line,
    fontWeight: TYPE.kicker.weight,
    letterSpacing: TYPE.kicker.tracking,
    textTransform: "uppercase",
    color: T.mute,
  };

  const titulo: CSSProperties = {
    margin: "6px 0 0",
    fontFamily: FONT_DISPLAY,
    fontSize: TYPE.h1.size,
    lineHeight: TYPE.h1.line,
    fontWeight: TYPE.h1.weight,
    letterSpacing: "-0.01em",
    color: T.ink,
  };

  const subtitulo: CSSProperties = {
    margin: "8px 0 0",
    maxWidth: 580,
    fontSize: TYPE.body.size,
    lineHeight: TYPE.body.line,
    color: T.inkSoft,
  };

  const meta: CSSProperties = {
    margin: "10px 0 0",
    fontSize: TYPE.small.size,
    lineHeight: TYPE.small.line,
    letterSpacing: "0.01em",
    color: T.mute,
  };

  /* ── Tabla de cohortes ─────────────────────────────────────────────── */

  const marcoTabla: CSSProperties = {
    flexShrink: 0,
    border: `1px solid ${T.line}`,
    borderRadius: RADIUS.card,
    overflow: "hidden",
    backgroundColor: T.paper,
  };

  const filoAcento: CSSProperties = {
    height: 3,
    backgroundColor: accent,
  };

  const tabla: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  };

  const th: CSSProperties = {
    padding: "11px 16px",
    borderBottom: `1px solid ${T.line}`,
    fontSize: 10.5,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    textAlign: "left",
    color: T.mute,
    whiteSpace: "nowrap",
  };

  const celda: CSSProperties = {
    padding: "17px 16px",
    verticalAlign: "middle",
    textAlign: "left",
  };

  const celdaFecha: CSSProperties = {
    ...celda,
    fontSize: 14,
    lineHeight: 1.35,
    fontWeight: 700,
    color: T.ink,
  };

  const celdaDias: CSSProperties = {
    ...celda,
    fontSize: 12.5,
    lineHeight: 1.4,
    color: T.inkSoft,
  };

  const celdaHora: CSSProperties = {
    ...celda,
    fontFamily: FONT_DISPLAY,
    fontSize: 17,
    lineHeight: 1.2,
    fontWeight: 700,
    color: T.ink,
    whiteSpace: "nowrap",
  };

  const celdaNivel: CSSProperties = {
    ...celda,
    paddingRight: 14,
  };

  const chipNivel: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    maxWidth: "100%",
    padding: "3px 9px",
    borderRadius: RADIUS.chip,
    border: `1px solid ${tint(accent, 0.24)}`,
    backgroundColor: tint(accent, 0.07),
    fontSize: 11.5,
    lineHeight: 1.3,
    fontWeight: 600,
    color: T.inkSoft,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const filaAlterna: CSSProperties = {
    backgroundColor: T.wash,
  };

  /* ── Caja de equivalencias horarias ────────────────────────────────── */

  const cajaEquivalencias: CSSProperties = {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    padding: SPACE[4],
    border: `1px solid ${tint(T.brand, 0.18)}`,
    borderRadius: RADIUS.card,
    backgroundColor: T.brandSoft,
  };

  const kickerCaja: CSSProperties = {
    margin: 0,
    fontSize: TYPE.kicker.size,
    lineHeight: TYPE.kicker.line,
    fontWeight: TYPE.kicker.weight,
    letterSpacing: TYPE.kicker.tracking,
    textTransform: "uppercase",
    color: T.brand,
  };

  const tituloCaja: CSSProperties = {
    margin: "6px 0 0",
    fontSize: TYPE.h2.size,
    lineHeight: TYPE.h2.line,
    fontWeight: TYPE.h2.weight,
    color: T.ink,
  };

  const lineaCaja: CSSProperties = {
    margin: "6px 0 0",
    fontSize: 12.5,
    lineHeight: 1.5,
    color: T.inkSoft,
  };

  const grillaMercados: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginTop: SPACE[3],
  };

  const fichaMercado: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    minWidth: 0,
    boxSizing: "border-box",
    padding: "12px 14px",
    border: `1px solid ${tint(T.brand, 0.14)}`,
    borderRadius: 10,
    backgroundColor: T.paper,
  };

  const horaMercado: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: 22,
    lineHeight: 1.1,
    fontWeight: 700,
    color: T.ink,
  };

  const nombreMercado: CSSProperties = {
    fontSize: 11.5,
    lineHeight: 1.3,
    letterSpacing: "0.02em",
    color: T.mute,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  /* ── Estado sin cohortes publicadas ────────────────────────────────── */

  const cajaSinCohortes: CSSProperties = {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: SPACE[2],
    padding: `${SPACE[5]}px ${SPACE[4]}px`,
    border: `1px solid ${tint(T.brand, 0.18)}`,
    borderRadius: RADIUS.card,
    backgroundColor: T.brandSoft,
  };

  const mensajeSinCohortes: CSSProperties = {
    margin: 0,
    fontSize: 19,
    lineHeight: 1.35,
    fontWeight: 600,
    color: T.ink,
  };

  const notaSinCohortes: CSSProperties = {
    margin: 0,
    fontSize: 13,
    lineHeight: 1.5,
    color: T.inkSoft,
  };

  const notaPie: CSSProperties = {
    margin: 0,
    marginTop: "auto",
    paddingTop: SPACE[3],
    borderTop: `1px solid ${T.line}`,
    fontSize: TYPE.small.size,
    lineHeight: TYPE.small.line,
    color: T.mute,
  };

  return (
    <BrochureA4Sheet data={data} pageNumber={pageNumber} totalPages={totalPages}>
      <div style={contenido}>
        <header style={{ flexShrink: 0 }}>
          <span aria-hidden="true" style={filete} />
          <p style={kicker}>Fechas y horarios</p>
          <h2 style={titulo}>Próximas fechas de inicio</h2>
          <p style={subtitulo}>
            {`Horarios en hora de ${data.paisNombre}. La misma clase en vivo, en tu horario.`}
          </p>
          {data.hours > 0 ? (
            <p style={meta}>
              {`${data.hours} horas de programa · ${data.modality}`}
            </p>
          ) : null}
        </header>

        {cohortes.length > 0 ? (
          <section style={marcoTabla} aria-label="Cohortes y horarios">
            <div aria-hidden="true" style={filoAcento} />

            <table style={tabla}>
              <colgroup>
                <col style={{ width: "34%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "24%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>

              <thead>
                <tr>
                  <th scope="col" style={th}>
                    Fecha de inicio
                  </th>
                  <th scope="col" style={th}>
                    Días
                  </th>
                  <th scope="col" style={th}>
                    Horario local
                  </th>
                  <th scope="col" style={th}>
                    Nivel
                  </th>
                </tr>
              </thead>

              <tbody>
                {cohortes.map((cohorte, indice) => (
                  <tr
                    key={cohorte.id}
                    style={indice % 2 === 1 ? filaAlterna : undefined}
                  >
                    <td style={celdaFecha}>{cohorte.fecha}</td>
                    <td style={celdaDias}>{cohorte.dias}</td>
                    <td style={celdaHora}>{horaLocal(cohorte.horario)}</td>
                    <td style={celdaNivel}>
                      <span style={chipNivel}>{cohorte.nivel}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <section style={cajaSinCohortes}>
            <p style={mensajeSinCohortes}>
              Cupos abiertos — consulta la próxima fecha por WhatsApp
            </p>
            <p style={notaSinCohortes}>
              {`Te confirmamos fecha, horario de ${data.paisNombre} y nivel antes de inscribirte.`}
            </p>
          </section>
        )}

        {cohortes.length > 0 ? (
          <section style={cajaEquivalencias} aria-label="Equivalencias horarias">
            <p style={kickerCaja}>Equivalencias horarias</p>
            <h3 style={tituloCaja}>La misma clase en vivo, en cada país</h3>
            <p style={lineaCaja}>
              {`De ${data.equivalencias.inicio} a ${data.equivalencias.fin} · hora de ${data.paisNombre} (${data.equivalencias.offset})`}
            </p>

            {mercados.length > 0 ? (
              <div style={grillaMercados}>
                {mercados.map((fila) => (
                  <div key={fila.mercado} style={fichaMercado}>
                    <span style={horaMercado}>{fila.hora}</span>
                    <span style={nombreMercado}>{fila.mercado}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={lineaCaja}>{data.equivalencias.cadenaMercados}</p>
            )}
          </section>
        ) : null}

        <p style={notaPie}>
          Todas las clases quedan grabadas en el campus y puedes verlas de por
          vida.
        </p>
      </div>
    </BrochureA4Sheet>
  );
}
