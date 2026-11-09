"use client";

/**
 * Hojas A4 del temario completo del brochure.
 *
 * La repartición de módulos la decide `planBrochureSyllabus` (lógica pura
 * compartida con el visor): aquí solo se pinta cada hoja, con la grilla de dos
 * columnas y, en la última, el panel ejecutivo de inscripción. Ningún tópico se
 * recorta y no se reimplementa la paginación: el plan ya garantiza máximo 4
 * módulos por hoja (3 en la última, que reserva el panel) y que ningún módulo
 * se corte.
 *
 * Sistema de diseño compartido con el resto del brochure: A4 794 × 1123 px,
 * todo inline, y ningún texto por debajo de 10.5px.
 */

import type { CSSProperties, JSX } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import {
  planBrochureSyllabus,
  type BrochureSyllabusGroup,
  type BrochureSyllabusPage,
  type PlannedBrochureModule,
} from "@/lib/brochure/brochure-pages";

export type BrochureSyllabusSheetsProps = {
  data: CourseBrochureData;
  /** Número de la primera hoja de temario; lo entrega el visor. */
  startPage: number;
  /** Total global de páginas del brochure. */
  totalPages: number;
};

const TINTA = "#141519";
const GRIS = "#5C5D63";
const TENUE = "#77786F";
const LINEA = "#E7E4DA";
const LAVADO = "#F1EFE8";
const BLANCO = "#FFFFFF";

const SANS =
  '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const DISPLAY = 'Georgia, "Times New Roman", serif';

/** Máximo de tópicos visibles por tarjeta; el resto se resume en «+N temas». */
const MAX_TOPICS_VISIBLES = 10;

/** Pasos fijos del panel de inscripción, idénticos en vista y PDF. */
const PASOS = [
  "Inscripción online en 2 minutos",
  "Acceso inmediato al Campus Virtual",
  "Inicio de clases en vivo por Zoom",
];

const TEXTO_SIN_TEMARIO =
  "Programa en actualización — consulta el detalle por WhatsApp";

/** Cabecera editorial de la sección de temario, repetida en cada hoja. */
function SyllabusHeader({
  data,
  accent,
}: {
  data: CourseBrochureData;
  accent: string;
}): JSX.Element {
  /**
   * Horas reales del temario: `data.hours` trae las horas de la oferta pública
   * (a veces por nivel), mientras que las tarjetas muestran la suma de todos
   * los módulos. Si hay módulos con horas, manda esa suma para que el meta no
   * se contradiga con el detalle.
   */
  const horasModulos = (data.temario ?? []).reduce(
    (total, nivel) =>
      total +
      (nivel.modules ?? []).reduce(
        (suma, modulo) => suma + (modulo.hours ?? 0),
        0
      ),
    0
  );
  const horasTemario = horasModulos > 0 ? horasModulos : data.hours;

  const fila: CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
  };

  const kicker: CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.14em",
    fontWeight: 700,
    textTransform: "uppercase",
    color: accent,
    lineHeight: 1.2,
  };

  const titulo: CSSProperties = {
    fontFamily: DISPLAY,
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.1,
    color: TINTA,
    marginTop: 4,
  };

  const meta: CSSProperties = {
    fontSize: 12.5,
    fontWeight: 600,
    lineHeight: 1.3,
    color: GRIS,
    whiteSpace: "nowrap",
    textAlign: "right",
    paddingBottom: 2,
    flexShrink: 0,
  };

  const regla: CSSProperties = {
    height: 1,
    backgroundColor: LINEA,
    marginTop: 12,
  };

  return (
    <header style={{ flexShrink: 0 }}>
      <div style={fila}>
        <div style={{ minWidth: 0 }}>
          <div style={kicker}>Programa académico</div>
          <div style={titulo}>Programa Académico Detallado</div>
        </div>
        <div style={meta}>
          {data.modulesCount} módulos · {horasTemario} horas
        </div>
      </div>
      <div style={regla} />
    </header>
  );
}

/** Tarjeta de un módulo: numeración global, horas y todos sus tópicos. */
function ModuleCard({
  module,
  accent,
}: {
  module: PlannedBrochureModule;
  accent: string;
}): JSX.Element {
  const tarjeta: CSSProperties = {
    backgroundColor: BLANCO,
    border: `1px solid ${LINEA}`,
    borderRadius: 10,
    padding: "14px 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  };

  const cabecera: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  };

  const numero: CSSProperties = {
    fontSize: 11,
    letterSpacing: "0.08em",
    fontWeight: 700,
    textTransform: "uppercase",
    color: accent,
    lineHeight: 1.2,
  };

  const pill: CSSProperties = {
    fontSize: 11,
    lineHeight: 1.2,
    fontWeight: 700,
    color: GRIS,
    backgroundColor: LAVADO,
    borderRadius: 999,
    padding: "3px 9px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  const titulo: CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.3,
    color: TINTA,
    margin: "6px 0 0",
    overflowWrap: "break-word",
  };

  const lista: CSSProperties = {
    listStyle: "none",
    margin: "8px 0 0",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  };

  const topico: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
    fontSize: 12.5,
    lineHeight: 1.48,
    color: GRIS,
  };

  const vineta: CSSProperties = {
    color: accent,
    fontSize: 11,
    lineHeight: 1.48,
    fontWeight: 700,
    flexShrink: 0,
    width: 12,
    textAlign: "center",
  };

  const masTemas: CSSProperties = {
    marginTop: 6,
    fontSize: 11.5,
    lineHeight: 1.4,
    fontWeight: 600,
    color: TENUE,
  };

  const topics = Array.isArray(module.topics) ? module.topics : [];
  const visibles = topics.slice(0, MAX_TOPICS_VISIBLES);
  const restantes = topics.length - visibles.length;
  const horas = module.hours != null && module.hours > 0;

  return (
    <article style={tarjeta}>
      <div style={cabecera}>
        <span style={numero}>
          MÓDULO {module.moduleNumber.toString().padStart(2, "0")}
        </span>
        {horas ? <span style={pill}>{module.hours} h</span> : null}
      </div>
      <h3 style={titulo}>{module.title}</h3>
      {visibles.length > 0 ? (
        <ul style={lista}>
          {visibles.map((tema, indice) => (
            <li key={`${module.moduleNumber}-${indice}`} style={topico}>
              <span style={vineta} aria-hidden="true">
                ✓
              </span>
              <span style={{ minWidth: 0, overflowWrap: "break-word" }}>
                {tema}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {restantes > 0 ? <div style={masTemas}>+{restantes} temas</div> : null}
    </article>
  );
}

/** Banda de nivel + grilla 2×N de sus módulos. */
function SyllabusGroup({
  group,
  accent,
  primero,
}: {
  group: BrochureSyllabusGroup;
  accent: string;
  primero: boolean;
}): JSX.Element {
  const banda: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: LAVADO,
    borderLeft: `3px solid ${accent}`,
    borderRadius: 8,
    padding: "8px 14px",
  };

  const nivel: CSSProperties = {
    fontSize: 13.5,
    fontWeight: 700,
    lineHeight: 1.2,
    color: TINTA,
    minWidth: 0,
  };

  const subtitulo: CSSProperties = {
    fontSize: 11.5,
    lineHeight: 1.2,
    color: GRIS,
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  const grilla: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    alignItems: "start",
    marginTop: 12,
  };

  return (
    <section style={{ marginTop: primero ? 0 : 16, flexShrink: 0 }}>
      <div style={banda}>
        <span style={nivel}>{group.levelLabel}</span>
        <span style={subtitulo}>
          {group.levelShortLabel ?? "Módulos del programa"}
        </span>
      </div>
      <div style={grilla}>
        {group.modules.map((modulo) => (
          <ModuleCard
            key={`modulo-${modulo.moduleNumber}`}
            module={modulo}
            accent={accent}
          />
        ))}
      </div>
    </section>
  );
}

/** Panel ejecutivo de inscripción: resumen, pasos y llamadas a la acción. */
function EnrollmentPanel({ data }: { data: CourseBrochureData }): JSX.Element {
  const hrefInscripcion = `https://programbi.com${data.inscripcionUrl}`;

  const panel: CSSProperties = {
    backgroundColor: TINTA,
    borderRadius: 12,
    padding: "16px 18px",
    color: BLANCO,
    boxSizing: "border-box",
  };

  const fila: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
  };

  const izquierda: CSSProperties = {
    flex: "1 1 auto",
    minWidth: 0,
  };

  const titulo: CSSProperties = {
    fontSize: 16.5,
    fontWeight: 700,
    lineHeight: 1.2,
  };

  const resumen: CSSProperties = {
    fontSize: 12.5,
    lineHeight: 1.45,
    color: "rgba(255,255,255,.8)",
    marginTop: 6,
    overflowWrap: "break-word",
  };

  const pasos: CSSProperties = {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 1.4,
    color: "rgba(255,255,255,.9)",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  const acciones: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: "0 0 auto",
    width: 216,
  };

  const botonBase: CSSProperties = {
    display: "block",
    borderRadius: 999,
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.2,
    textAlign: "center",
    textDecoration: "none",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
  };

  const botonPrimario: CSSProperties = {
    ...botonBase,
    backgroundColor: BLANCO,
    color: TINTA,
    border: `1px solid ${BLANCO}`,
  };

  const botonSecundario: CSSProperties = {
    ...botonBase,
    backgroundColor: "transparent",
    color: BLANCO,
    border: "1px solid rgba(255,255,255,.45)",
  };

  return (
    <section style={panel}>
      <div style={fila}>
        <div style={izquierda}>
          <div style={titulo}>Inscríbete y asegura tu cupo</div>
          <div style={resumen}>
            {data.precioFormateado} ({data.moneda}) · {data.cuotaTexto}
          </div>
          <div style={pasos}>
            {PASOS.map((paso, indice) => (
              <div key={paso}>
                {indice + 1}. {paso}
              </div>
            ))}
          </div>
        </div>
        <div style={acciones}>
          <a
            href={hrefInscripcion}
            data-pdf-link={hrefInscripcion}
            style={botonPrimario}
          >
            Inscribirme en programbi.com
          </a>
          {data.whatsappUrl ? (
            <a
              href={data.whatsappUrl}
              data-pdf-link={data.whatsappUrl}
              style={botonSecundario}
            >
              Hablar por WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Aviso para cursos sin temario cargado (el plan devuelve una hoja vacía). */
function EmptyNotice(): JSX.Element {
  const aviso: CSSProperties = {
    marginTop: 16,
    border: `1px dashed ${LINEA}`,
    borderRadius: 10,
    padding: "20px 18px",
    textAlign: "center",
    fontSize: 12.5,
    lineHeight: 1.45,
    color: GRIS,
  };

  return <div style={aviso}>{TEXTO_SIN_TEMARIO}</div>;
}

function SyllabusSheetBody({
  data,
  page,
  accent,
  ultima,
}: {
  data: CourseBrochureData;
  page: BrochureSyllabusPage;
  accent: string;
  ultima: boolean;
}): JSX.Element {
  const cuerpo: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    fontFamily: SANS,
    color: TINTA,
  };

  const grupos: CSSProperties = {
    marginTop: 14,
    flex: "1 1 auto",
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    justifyContent: "flex-start",
  };

  const piePanel: CSSProperties = {
    marginTop: "auto",
    paddingTop: 14,
    flexShrink: 0,
  };

  return (
    <div style={cuerpo}>
      <SyllabusHeader data={data} accent={accent} />
      <div style={grupos}>
        {page.moduleCount === 0 ? (
          <EmptyNotice />
        ) : (
          page.groups.map((group, indice) => (
            <SyllabusGroup
              key={`${group.levelLabel}-${indice}`}
              group={group}
              accent={accent}
              primero={indice === 0}
            />
          ))
        )}
      </div>
      {ultima ? (
        <div style={piePanel}>
          <EnrollmentPanel data={data} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Pinta una hoja A4 por cada página del plan de temario. La última hoja suma
 * el panel de inscripción en el espacio que el plan reservó para él.
 */
export function BrochureSyllabusSheets({
  data,
  startPage,
  totalPages,
}: BrochureSyllabusSheetsProps): JSX.Element {
  const pages = planBrochureSyllabus(data);
  const accent = data.accentColor || TINTA;

  return (
    <>
      {pages.map((page, index) => (
        <BrochureA4Sheet
          key={`temario-${index}`}
          data={data}
          pageNumber={startPage + index}
          totalPages={totalPages}
        >
          <SyllabusSheetBody
            data={data}
            page={page}
            accent={accent}
            ultima={index === pages.length - 1}
          />
        </BrochureA4Sheet>
      ))}
    </>
  );
}
