"use client";

/**
 * Hojas A4 del temario completo del brochure.
 *
 * La repartición de módulos la decide `planBrochureSyllabus` (lógica pura
 * compartida con el visor): aquí solo se pinta cada hoja, con la grilla de dos
 * columnas y, en la última, el panel ejecutivo de inscripción. Ningún tópico se
 * recorta y no se reimplementa la paginación: el plan ya garantiza 4–6 módulos
 * por hoja, que ningún módulo se corte y que la última hoja tenga peso <= 7
 * para que el panel quepa.
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
  /** Número de la primera hoja de temario (normalmente 5). */
  startPage: number;
  /** Total global de páginas del brochure. */
  totalPages: number;
};

const TINTA = "#141519";
const BORDE = "#E7E4DA";
const GRIS = "#5B5E66";
const TENUE = "#8A8D95";

/** Pasos fijos del panel de inscripción, idénticos en vista y PDF. */
const PASOS = [
  "Inscripción online en 2 minutos",
  "Acceso inmediato al Campus Virtual",
  "Inicio de clases en vivo por Zoom",
];

const TEXTO_SIN_TEMARIO =
  "Programa en actualización — consulta el detalle por WhatsApp";

/**
 * Acento con alfa en hex de 8 dígitos (los motores de PDF no entienden
 * `color-mix`). Si el acento no es hex, cae a tinta translúcida.
 */
function conAlfa(color: string, alfa: number): string {
  const hex = (color || "").trim();
  const canal = Math.max(0, Math.min(255, Math.round(alfa * 255)))
    .toString(16)
    .padStart(2, "0");

  if (/^#[0-9a-f]{6}$/i.test(hex)) return `${hex}${canal}`;
  if (/^#[0-9a-f]{3}$/i.test(hex)) {
    const [r, g, b] = [hex[1], hex[2], hex[3]];
    return `#${r}${r}${g}${g}${b}${b}${canal}`;
  }
  return `rgba(20, 21, 25, ${alfa})`;
}

/** Cabecera compacta de la sección de temario, repetida en cada hoja. */
function SyllabusHeader({
  data,
  accent,
}: {
  data: CourseBrochureData;
  accent: string;
}): JSX.Element {
  const fila: CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  };

  const kicker: CSSProperties = {
    fontSize: 6.8,
    letterSpacing: 1.8,
    fontWeight: 700,
    textTransform: "uppercase",
    color: accent,
    lineHeight: 1.2,
  };

  const titulo: CSSProperties = {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 22,
    fontWeight: 400,
    lineHeight: 1.1,
    color: TINTA,
    marginTop: 2,
  };

  const meta: CSSProperties = {
    fontSize: 7.4,
    lineHeight: 1.3,
    color: TENUE,
    whiteSpace: "nowrap",
    textAlign: "right",
    paddingBottom: 2,
    flexShrink: 0,
  };

  const regla: CSSProperties = {
    height: 1,
    backgroundColor: BORDE,
    marginTop: 8,
  };

  return (
    <header>
      <div style={fila}>
        <div style={{ minWidth: 0 }}>
          <div style={kicker}>PROGRAMA ACADÉMICO</div>
          <div style={titulo}>Programa Académico Detallado</div>
        </div>
        <div style={meta}>
          {data.modulesCount} módulos · {data.hours} horas
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
    backgroundColor: "#FFFFFF",
    border: `1px solid ${BORDE}`,
    borderRadius: 8,
    padding: "8px 10px",
    breakInside: "avoid",
    pageBreakInside: "avoid",
  };

  const cabecera: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  };

  const numero: CSSProperties = {
    fontSize: 6.2,
    letterSpacing: 1.4,
    fontWeight: 700,
    color: accent,
    lineHeight: 1.2,
  };

  const pill: CSSProperties = {
    fontSize: 6.2,
    lineHeight: 1.2,
    fontWeight: 700,
    color: accent,
    backgroundColor: conAlfa(accent, 0.1),
    borderRadius: 999,
    padding: "2px 6px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  const titulo: CSSProperties = {
    fontSize: 9.2,
    fontWeight: 700,
    lineHeight: 1.25,
    color: TINTA,
    margin: "3px 0 0",
    overflowWrap: "break-word",
  };

  const lista: CSSProperties = {
    listStyle: "none",
    margin: "4px 0 0",
    padding: 0,
  };

  const topico: CSSProperties = {
    display: "flex",
    gap: 4,
    fontSize: 7.1,
    lineHeight: 1.35,
    color: GRIS,
  };

  const vineta: CSSProperties = {
    color: accent,
    fontWeight: 700,
    flexShrink: 0,
  };

  const topics = Array.isArray(module.topics) ? module.topics : [];
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
      {topics.length > 0 ? (
        <ul style={lista}>
          {topics.map((tema, indice) => (
            <li key={`${module.moduleNumber}-${indice}`} style={topico}>
              <span style={vineta} aria-hidden="true">
                ·
              </span>
              <span style={{ minWidth: 0, overflowWrap: "break-word" }}>
                {tema}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
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
    gap: 8,
    backgroundColor: TINTA,
    color: "#FFFFFF",
    borderRadius: 6,
    padding: "5px 10px",
    minHeight: 24,
  };

  const nivel: CSSProperties = {
    fontSize: 8.4,
    fontWeight: 700,
    letterSpacing: 0.6,
    lineHeight: 1.2,
    minWidth: 0,
  };

  const atajo: CSSProperties = {
    fontSize: 6.8,
    lineHeight: 1.2,
    color: "rgba(255,255,255,.65)",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  const grilla: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: 10,
    rowGap: 8,
    alignItems: "start",
    marginTop: 7,
  };

  return (
    <section style={{ marginTop: primero ? 0 : 9 }}>
      <div style={banda}>
        <span style={nivel}>{group.levelLabel}</span>
        {group.levelShortLabel ? (
          <span style={atajo}>{group.levelShortLabel}</span>
        ) : null}
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
  const panel: CSSProperties = {
    backgroundColor: TINTA,
    borderRadius: 12,
    padding: "13px 16px",
    color: "#FFFFFF",
    marginTop: 10,
  };

  const fila: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 14,
  };

  const izquierda: CSSProperties = {
    flex: "1 1 62%",
    minWidth: 0,
  };

  const titulo: CSSProperties = {
    fontSize: 12.5,
    fontWeight: 700,
    lineHeight: 1.2,
  };

  const resumen: CSSProperties = {
    fontSize: 7.6,
    lineHeight: 1.35,
    color: "rgba(255,255,255,.78)",
    marginTop: 4,
    overflowWrap: "break-word",
  };

  const pasos: CSSProperties = {
    marginTop: 6,
    fontSize: 7.2,
    lineHeight: 1.45,
    color: "rgba(255,255,255,.9)",
  };

  const acciones: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    flex: "0 0 auto",
    width: 118,
  };

  const botonBase: CSSProperties = {
    display: "block",
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 7.8,
    fontWeight: 700,
    lineHeight: 1.2,
    textAlign: "center",
    textDecoration: "none",
  };

  const botonPrimario: CSSProperties = {
    ...botonBase,
    backgroundColor: "#FFFFFF",
    color: TINTA,
    border: "1px solid #FFFFFF",
  };

  const botonSecundario: CSSProperties = {
    ...botonBase,
    backgroundColor: "transparent",
    color: "#FFFFFF",
    border: "1px solid rgba(255,255,255,.45)",
  };

  return (
    <section style={panel}>
      <div style={fila}>
        <div style={izquierda}>
          <div style={titulo}>Inscríbete hoy y asegura tu cupo</div>
          <div style={resumen}>
            {data.title} · {data.precioFormateado} ({data.moneda}) o{" "}
            {data.cuotaTexto}
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
            href={data.inscripcionUrl}
            data-pdf-link={data.inscripcionUrl}
            style={botonPrimario}
          >
            Inscribirme Ahora
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
    marginTop: 14,
    border: `1px dashed ${BORDE}`,
    borderRadius: 8,
    padding: "18px 16px",
    textAlign: "center",
    fontSize: 9.5,
    lineHeight: 1.4,
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
  };

  const grupos: CSSProperties = { marginTop: 10 };

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
        <div style={{ marginTop: "auto" }}>
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
