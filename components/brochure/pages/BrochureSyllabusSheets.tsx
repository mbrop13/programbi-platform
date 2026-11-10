"use client";

/**
 * Hojas A4 del temario completo («Temario y precios», hojas 6+).
 *
 * La repartición de módulos la decide `planBrochureSyllabus` (lógica pura
 * compartida con el visor): aquí solo se pinta cada hoja con el tema claro
 * común —kicker, banda de nivel teñida con el acento, tarjetas de módulo 2×2 y,
 * en la última hoja, el panel de cierre de inscripción—. El plan ya garantiza
 * máximo 4 módulos por hoja (3 en la última, que reserva el panel) y que ningún
 * módulo se corte, así que aquí se listan TODOS los temas de cada módulo.
 *
 * Sistema de diseño compartido: A4 794 × 1123 px, tokens de
 * `@/lib/brochure/brochure-theme`, todo inline (lo captura html-to-image) y
 * ningún texto visible por debajo de 10.5 px.
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
import {
  FONT_DISPLAY,
  FONT_SANS,
  RADIUS,
  T,
  TYPE,
  accentOf,
  tint,
} from "@/lib/brochure/brochure-theme";

export type BrochureSyllabusSheetsProps = {
  data: CourseBrochureData;
  /** Número de la primera hoja de temario; lo entrega el visor. */
  startPage: number;
  /** Total global de páginas del temario y precios. */
  totalPages: number;
};

/**
 * Escala tipográfica de la hoja según la carga de temas que trae el plan.
 * Nunca baja de 10.5 px: si una hoja viene muy cargada se aprieta el aire, no
 * el tamaño de lectura, y ningún tema queda fuera del papel.
 */
type Densidad = {
  tema: number;
  interlineado: number;
  hueco: number;
  titulo: number;
  numero: number;
  relleno: number;
};

function densidadDe(temas: number, conPanel: boolean): Densidad {
  // La última hoja reserva ~150 px para el panel de cierre: se aprieta un
  // escalón antes para que ningún tema quede bajo el borde del papel.
  const carga = conPanel ? temas + 6 : temas;

  if (carga <= 18) {
    return { tema: 12, interlineado: 1.5, hueco: 4, titulo: 15.5, numero: 32, relleno: 16 };
  }
  if (carga <= 26) {
    return { tema: 11.5, interlineado: 1.45, hueco: 3, titulo: 15, numero: 30, relleno: 15 };
  }
  if (carga <= 34) {
    return { tema: 11, interlineado: 1.42, hueco: 2.5, titulo: 14.5, numero: 27, relleno: 14 };
  }
  return { tema: 10.5, interlineado: 1.4, hueco: 2, titulo: 14, numero: 25, relleno: 13 };
}

/** Kicker editorial: mayúsculas espaciadas, 10.5 px. */
const KICKER: CSSProperties = {
  fontSize: TYPE.kicker.size,
  lineHeight: TYPE.kicker.line,
  fontWeight: TYPE.kicker.weight,
  letterSpacing: TYPE.kicker.tracking,
  textTransform: "uppercase",
};

function canal(limpio: string, inicio: number): number {
  const valor = parseInt(limpio.slice(inicio, inicio + 2), 16) / 255;
  return valor <= 0.03928
    ? valor / 12.92
    : Math.pow((valor + 0.055) / 1.055, 2.4);
}

/** Luminancia relativa WCAG de un #RRGGBB; `null` si el color no es válido. */
function luminancia(hex: string): number | null {
  const limpio = (hex || "").replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(limpio)) return null;
  return (
    0.2126 * canal(limpio, 0) +
    0.7152 * canal(limpio, 2) +
    0.0722 * canal(limpio, 4)
  );
}

/**
 * El acento manda en los detalles, pero si no alcanza 3:1 contra el papel
 * (el amarillo de Power BI, por ejemplo) el texto de acento cae a tinta: el
 * color se conserva en las bandas y filetes, nunca en texto ilegible.
 */
function acentoTexto(acento: string): string {
  const frente = luminancia(acento);
  const fondo = luminancia(T.paper);
  if (frente == null || fondo == null) return T.ink;
  const contraste = (Math.max(frente, fondo) + 0.05) / (Math.min(frente, fondo) + 0.05);
  return contraste >= 3 ? acento : T.ink;
}

/** Título del módulo sin el «(6 horas)» que ya muestra el chip de horas. */
function tituloLimpio(titulo: string): string {
  const limpio = titulo.replace(
    /\s*\(\s*\d+(?:[.,]\d+)?\s*(?:horas?|hrs?|h)\.?\s*\)\s*$/i,
    ""
  );
  return limpio.trim() || titulo;
}

function dosDigitos(valor: number): string {
  return String(valor).padStart(2, "0");
}

function horasDeGrupo(group: BrochureSyllabusGroup): number {
  return group.modules.reduce((total, modulo) => total + (modulo.hours ?? 0), 0);
}

/** Horas totales de cada nivel del programa, para las bandas de nivel. */
function horasPorNivel(data: CourseBrochureData): Map<string, number> {
  const totales = new Map<string, number>();
  for (const nivel of data.temario ?? []) {
    const horas = (nivel.modules ?? []).reduce(
      (total, modulo) => total + (modulo.hours ?? 0),
      0
    );
    totales.set(nivel.label, (totales.get(nivel.label) ?? 0) + horas);
  }
  return totales;
}

/** Horas reales del temario: la suma de los módulos manda sobre `data.hours`. */
function horasDelTemario(data: CourseBrochureData): number {
  const suma = (data.temario ?? []).reduce(
    (total, nivel) =>
      total +
      (nivel.modules ?? []).reduce(
        (parcial, modulo) => parcial + (modulo.hours ?? 0),
        0
      ),
    0
  );
  return suma > 0 ? suma : data.hours;
}

/** Cabecera editorial de la sección, idéntica en todas las hojas del temario. */
function SyllabusHeader({
  data,
  page,
  accent,
}: {
  data: CourseBrochureData;
  page: BrochureSyllabusPage;
  accent: string;
}): JSX.Element {
  const accentText = acentoTexto(accent);
  const numeros = page.groups.flatMap((group) =>
    group.modules.map((modulo) => modulo.moduleNumber)
  );
  const primero = numeros[0] ?? 0;
  const ultimo = numeros[numeros.length - 1] ?? 0;
  const totalModulos = Math.max(data.modulesCount, ultimo);
  const rango =
    numeros.length === 0
      ? null
      : primero === ultimo
        ? `Módulo ${dosDigitos(primero)} de ${dosDigitos(totalModulos)}`
        : `Módulos ${dosDigitos(primero)}–${dosDigitos(ultimo)} de ${dosDigitos(totalModulos)}`;

  const kicker: CSSProperties = { ...KICKER, color: accentText };
  const titulo: CSSProperties = {
    margin: "6px 0 0",
    fontFamily: FONT_DISPLAY,
    fontSize: TYPE.h1.size,
    lineHeight: TYPE.h1.line,
    fontWeight: TYPE.h1.weight,
    letterSpacing: "-0.01em",
    color: T.ink,
  };
  const rangoStyle: CSSProperties = {
    fontSize: 12.5,
    lineHeight: 1.25,
    fontWeight: 700,
    color: T.inkSoft,
    whiteSpace: "nowrap",
  };
  const meta: CSSProperties = {
    fontSize: 11.5,
    lineHeight: 1.3,
    color: T.mute,
    whiteSpace: "nowrap",
  };

  return (
    <header style={{ flexShrink: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={kicker}>TEMARIO MÓDULO A MÓDULO</div>
          <h2 style={titulo}>Programa completo</h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 3,
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          {rango ? <span style={rangoStyle}>{rango}</span> : null}
          <span style={meta}>
            {`${data.levelsCount} ${data.levelsCount === 1 ? "nivel" : "niveles"} · ${horasDelTemario(data)} horas`}
          </span>
        </div>
      </div>
      <div style={{ height: 1, backgroundColor: T.line, marginTop: 14 }} />
    </header>
  );
}

/** Tarjeta de un módulo: número grande del acento, título, horas y sus temas. */
function ModuleCard({
  module,
  accent,
  densidad,
}: {
  module: PlannedBrochureModule;
  accent: string;
  densidad: Densidad;
}): JSX.Element {
  const accentText = acentoTexto(accent);
  const topics = Array.isArray(module.topics) ? module.topics : [];
  const mitad = Math.ceil(topics.length / 2);
  const columnas = [topics.slice(0, mitad), topics.slice(mitad)].filter(
    (columna) => columna.length > 0
  );
  const horas = module.hours != null && module.hours > 0;

  const tarjeta: CSSProperties = {
    backgroundColor: T.paper,
    border: `1px solid ${T.line}`,
    borderRadius: RADIUS.card,
    padding: `${densidad.relleno}px ${densidad.relleno + 2}px`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  };

  const numero: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: densidad.numero,
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: accentText,
  };

  const chipHoras: CSSProperties = {
    fontSize: 11,
    lineHeight: 1.2,
    fontWeight: 700,
    color: T.inkSoft,
    backgroundColor: T.wash,
    border: `1px solid ${T.line}`,
    borderRadius: RADIUS.chip,
    padding: "3px 9px",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  const titulo: CSSProperties = {
    margin: "6px 0 0",
    fontSize: densidad.titulo,
    lineHeight: 1.26,
    fontWeight: 700,
    color: T.ink,
    overflowWrap: "break-word",
  };

  const grilla: CSSProperties = {
    display: "grid",
    gridTemplateColumns: columnas.length > 1 ? "1fr 1fr" : "1fr",
    columnGap: 16,
    marginTop: 9,
    alignItems: "start",
  };

  const lista: CSSProperties = {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: densidad.hueco,
    minWidth: 0,
  };

  const item: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: 7,
    fontSize: densidad.tema,
    lineHeight: densidad.interlineado,
    color: T.inkSoft,
    minWidth: 0,
  };

  const vineta: CSSProperties = {
    display: "block",
    flexShrink: 0,
    width: 5,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: accentText,
    marginTop: Math.round(densidad.tema * densidad.interlineado * 0.55),
  };

  return (
    <article style={tarjeta}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <span style={numero}>{dosDigitos(module.moduleNumber)}</span>
        {horas ? <span style={chipHoras}>{`${module.hours} h`}</span> : null}
      </div>

      <h3 style={titulo}>{tituloLimpio(module.title)}</h3>

      {columnas.length > 0 ? (
        <div style={grilla}>
          {columnas.map((columna, indiceColumna) => (
            <ul key={`${module.moduleNumber}-col-${indiceColumna}`} style={lista}>
              {columna.map((tema, indice) => (
                <li key={`${module.moduleNumber}-${indiceColumna}-${indice}`} style={item}>
                  <span aria-hidden="true" style={vineta} />
                  <span style={{ minWidth: 0, overflowWrap: "break-word" }}>
                    {tema}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      ) : null}
    </article>
  );
}

/** Banda de nivel + grilla 2×2 de sus módulos. */
function SyllabusGroup({
  group,
  accent,
  densidad,
  primero,
  compacta,
  horasNivel,
}: {
  group: BrochureSyllabusGroup;
  accent: string;
  densidad: Densidad;
  primero: boolean;
  compacta: boolean;
  /** Horas totales del nivel completo, para no confundir una hoja parcial. */
  horasNivel: number;
}): JSX.Element {
  const horas = horasDeGrupo(group);
  const totalNivel = Math.max(horas, horasNivel);
  const textoHoras =
    horas > 0
      ? totalNivel > horas
        ? `${horas} de ${totalNivel} horas`
        : `${horas} horas`
      : null;

  const banda: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: tint(accent, 0.08),
    borderLeft: `3px solid ${accent}`,
    borderRadius: 10,
    padding: compacta ? "7px 12px" : "8px 14px",
  };

  const nivel: CSSProperties = {
    fontSize: 13.5,
    lineHeight: 1.2,
    fontWeight: 700,
    color: T.ink,
    minWidth: 0,
  };

  const horasStyle: CSSProperties = {
    fontSize: 12,
    lineHeight: 1.2,
    fontWeight: 700,
    color: T.inkSoft,
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  return (
    <section style={{ marginTop: primero ? 0 : compacta ? 11 : 14, flexShrink: 0 }}>
      <div style={banda}>
        <span style={nivel}>{group.levelLabel}</span>
        {textoHoras ? <span style={horasStyle}>{textoHoras}</span> : null}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: compacta ? 12 : 14,
          alignItems: "stretch",
          marginTop: compacta ? 10 : 12,
        }}
      >
        {group.modules.map((modulo) => (
          <ModuleCard
            key={`modulo-${modulo.moduleNumber}`}
            module={modulo}
            accent={accent}
            densidad={densidad}
          />
        ))}
      </div>
    </section>
  );
}

/** Panel de cierre claro: precio, cuotas y las mismas llamadas de la hoja 2. */
function EnrollmentPanel({ data }: { data: CourseBrochureData }): JSX.Element {
  const accent = accentOf(data.accentColor);
  const accentText = acentoTexto(accent);
  const hrefInscripcion = `https://programbi.com${data.inscripcionUrl}`;
  const tienePrecio = data.precio != null;

  const panel: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    backgroundColor: T.wash,
    border: `1px solid ${T.line}`,
    borderTop: `3px solid ${accent}`,
    borderRadius: RADIUS.card,
    padding: "16px 20px",
    boxSizing: "border-box",
  };

  const etiqueta: CSSProperties = { ...KICKER, color: accentText };
  const titulo: CSSProperties = {
    margin: "5px 0 0",
    fontFamily: FONT_DISPLAY,
    fontSize: 22,
    lineHeight: 1.15,
    fontWeight: 700,
    color: T.ink,
  };
  const precio: CSSProperties = {
    fontFamily: FONT_DISPLAY,
    fontSize: tienePrecio ? 30 : 14,
    lineHeight: 1.1,
    fontWeight: 700,
    color: T.ink,
  };
  const moneda: CSSProperties = {
    fontSize: 10.5,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: T.mute,
  };
  const cuotas: CSSProperties = {
    marginTop: 3,
    fontSize: 12.5,
    lineHeight: 1.4,
    color: T.inkSoft,
  };

  const botonBase: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    width: "100%",
    padding: "11px 16px",
    borderRadius: RADIUS.chip,
    fontSize: 13,
    lineHeight: 1.2,
    fontWeight: 700,
    textDecoration: "none",
    textAlign: "center",
  };

  const botonPrimario: CSSProperties = {
    ...botonBase,
    backgroundColor: T.ink,
    border: `1px solid ${T.ink}`,
    color: T.paper,
  };

  const botonSecundario: CSSProperties = {
    ...botonBase,
    backgroundColor: "transparent",
    border: `1px solid ${T.whatsapp}`,
    color: T.whatsapp,
  };

  return (
    <section style={{ marginTop: "auto", paddingTop: 16, flexShrink: 0 }}>
      <div style={panel}>
        <div style={{ minWidth: 0 }}>
          <div style={etiqueta}>INSCRIPCIÓN</div>
          <h2 style={titulo}>¿Listo para empezar?</h2>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            <span style={precio}>{data.precioFormateado}</span>
            {tienePrecio ? <span style={moneda}>{data.moneda}</span> : null}
          </div>

          <div style={cuotas}>{data.cuotaTexto}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: 212,
            flexShrink: 0,
          }}
        >
          <a href={hrefInscripcion} data-pdf-link={hrefInscripcion} style={botonPrimario}>
            Inscribirme ahora
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
function EmptyNotice({ data }: { data: CourseBrochureData }): JSX.Element {
  const accent = accentOf(data.accentColor);

  return (
    <div
      style={{
        marginTop: 16,
        border: `1px solid ${T.line}`,
        backgroundColor: T.wash,
        borderRadius: RADIUS.card,
        padding: "26px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ ...KICKER, color: acentoTexto(accent) }}>TEMARIO EN ACTUALIZACIÓN</div>
      <p
        style={{
          margin: "8px 0 0",
          fontSize: 13.5,
          lineHeight: 1.55,
          color: T.inkSoft,
        }}
      >
        Estamos actualizando el detalle de los módulos de este programa. Escríbenos
        y te enviamos la malla al día con fechas y precios.
      </p>
      {data.whatsappUrl ? (
        <a
          href={data.whatsappUrl}
          data-pdf-link={data.whatsappUrl}
          style={{
            display: "inline-block",
            marginTop: 12,
            padding: "9px 18px",
            borderRadius: RADIUS.chip,
            border: `1px solid ${T.whatsapp}`,
            color: T.whatsapp,
            fontSize: 12.5,
            lineHeight: 1.2,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Consultar por WhatsApp
        </a>
      ) : null}
    </div>
  );
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
  const temasDeLaHoja = page.groups.reduce(
    (total, group) =>
      total +
      group.modules.reduce(
        (parcial, modulo) => parcial + (modulo.topics?.length ?? 0),
        0
      ),
    0
  );
  const densidad = densidadDe(temasDeLaHoja, ultima);
  const totalesNivel = horasPorNivel(data);

  const cuerpo: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    fontFamily: FONT_SANS,
    color: T.ink,
  };

  return (
    <div style={cuerpo}>
      <SyllabusHeader data={data} page={page} accent={accent} />

      <div
        style={{
          marginTop: 12,
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: ultima ? 12 : 14,
        }}
      >
        {page.moduleCount === 0 ? (
          <EmptyNotice data={data} />
        ) : (
          page.groups.map((group, indice) => (
            <SyllabusGroup
              key={`${group.levelLabel}-${indice}`}
              group={group}
              accent={accent}
              densidad={densidad}
              primero={indice === 0}
              compacta={ultima}
              horasNivel={totalesNivel.get(group.levelLabel) ?? 0}
            />
          ))
        )}
      </div>

      {ultima ? <EnrollmentPanel data={data} /> : null}
    </div>
  );
}

/**
 * Pinta una hoja A4 por cada página del plan de temario. La última hoja suma
 * el panel de cierre en el espacio que el plan reservó para él.
 */
export function BrochureSyllabusSheets({
  data,
  startPage,
  totalPages,
}: BrochureSyllabusSheetsProps): JSX.Element {
  const pages = planBrochureSyllabus(data);
  const accent = accentOf(data.accentColor);

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
