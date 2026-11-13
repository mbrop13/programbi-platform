import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import {
  type PlannedBrochureModule,
  describeCourseLevels,
  formatSyllabusGroupHeader,
  planBrochureSyllabus,
} from "@/lib/brochure/brochure-pages";
import {
  FONT_MONO,
  FONT_SANS,
  T,
  accentInk,
  accentOf,
  accentOnDark,
} from "@/lib/brochure/brochure-theme";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import {
  BrochureCtaLink,
  SheetTitleBlock,
} from "@/components/brochure/BrochurePrimitives";

export type BrochureSyllabusSheetsProps = {
  data: CourseBrochureData;
  startPage?: number;
  totalPages: number;
};

type ModuleRow =
  | { type: "full"; mod: PlannedBrochureModule }
  | { type: "pair"; left: PlannedBrochureModule; right?: PlannedBrochureModule };

function groupModulesIntoRows(modules: PlannedBrochureModule[]): ModuleRow[] {
  const rows: ModuleRow[] = [];
  let i = 0;
  while (i < modules.length) {
    const current = modules[i];
    if (current.span === 2) {
      rows.push({ type: "full", mod: current });
      i += 1;
    } else {
      const next = modules[i + 1];
      if (next && next.span === 1) {
        rows.push({ type: "pair", left: current, right: next });
        i += 2;
      } else {
        rows.push({ type: "pair", left: current });
        i += 1;
      }
    }
  }
  return rows;
}

function TopicList({
  topics,
  twoColumns,
  accentText,
}: {
  topics: string[];
  twoColumns: boolean;
  accentText: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: twoColumns ? "1fr 1fr" : "1fr",
        gap: "5px 22px",
      }}
    >
      {topics.map((topic, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            fontSize: 11.8,
            lineHeight: 1.42,
            color: T.inkSoft,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 5,
              height: 5,
              marginTop: 6,
              borderRadius: 1,
              background: accentText,
              opacity: 0.72,
              flexShrink: 0,
            }}
          />
          <span>{topic}</span>
        </div>
      ))}
    </div>
  );
}

function stripLeadingModulePrefix(title: string): string {
  return title.replace(/^M[óo]dulo\s+\d+\s*[.:—-]\s*/i, "").trim() || title;
}

function ModuleBlock({
  mod,
  accentText,
  isFullWidth,
}: {
  mod: PlannedBrochureModule;
  accentText: string;
  isFullWidth: boolean;
}) {
  const code = String(mod.moduleNumber).padStart(2, "0");
  const cleanTitle = stripLeadingModulePrefix(mod.title);

  return (
    <article
      style={{
        border: `1px solid ${T.line}`,
        borderRadius: 6,
        padding: "13px 16px",
        background: T.paper,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: accentText,
          }}
        >
          MÓDULO {code}
        </span>
        {mod.hours ? (
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              fontWeight: 600,
              color: T.ink,
              background: T.wash,
              border: `1px solid ${T.line}`,
              borderRadius: 4,
              padding: "1px 8px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {mod.hours} h
          </span>
        ) : null}
      </div>

      <h3
        style={{
          margin: "0 0 9px",
          paddingBottom: 8,
          borderBottom: `1px solid ${T.line}`,
          fontSize: 14.5,
          lineHeight: 1.25,
          fontWeight: 700,
          letterSpacing: "-0.015em",
          color: T.ink,
        }}
      >
        {cleanTitle}
      </h3>

      <TopicList
        topics={mod.topics ?? []}
        twoColumns={isFullWidth}
        accentText={accentText}
      />
    </article>
  );
}

/**
 * Hojas 6..N — Programa Académico Detallado.
 * Paginación responsiva por altura real con módulos adaptables (`span: 1 | 2`),
 * cero desbordamientos en cursos densos y cierre ejecutivo en placa obsidiana.
 */
export function BrochureSyllabusSheets({
  data,
  startPage = 6,
  totalPages,
}: BrochureSyllabusSheetsProps) {
  const accent = accentOf(data.accentColor);
  const accentText = accentInk(data.accentColor);
  const darkAccent = accentOnDark(data.accentColor);

  const pages = planBrochureSyllabus(data);
  const levelInfo = describeCourseLevels(data);
  const totalModules =
    data.modulesCount ||
    pages.reduce((acc, p) => acc + p.moduleCount, 0);

  const cuotasCopy =
    data.cuotaTexto || `${data.cuotas} cuotas sin interés`;

  return (
    <>
      {pages.map((page, pageIdx) => {
        const pageNumber = startPage + pageIdx;
        const isLastPage = pageIdx === pages.length - 1;
        const pageModules = page.groups.flatMap((g) => g.modules);
        const firstNum = pageModules[0]?.moduleNumber;
        const lastNum = pageModules[pageModules.length - 1]?.moduleNumber;
        const rangeLabel =
          firstNum && lastNum
            ? firstNum === lastNum
              ? `Módulo ${String(firstNum).padStart(2, "0")} de ${totalModules}`
              : `Módulos ${String(firstNum).padStart(2, "0")}–${String(lastNum).padStart(2, "0")} de ${totalModules}`
            : `Cierre del programa`;

        return (
          <BrochureA4Sheet
            key={`syllabus-sheet-${pageNumber}`}
            pageNumber={pageNumber}
            totalPages={totalPages}
            data={data}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                fontFamily: FONT_SANS,
              }}
            >
              <SheetTitleBlock
                kicker="Temario módulo a módulo"
                title="Programa Académico Detallado"
                accentColor={data.accentColor}
                rightSlot={
                  <div
                    style={{
                      textAlign: "right",
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      color: T.mute,
                    }}
                  >
                    <div style={{ fontWeight: 700, color: T.ink }}>
                      {rangeLabel}
                    </div>
                    <div>
                      {levelInfo.syllabusRightNote}
                    </div>
                  </div>
                }
              />

              {/* Nota explicativa de niveles en la primera hoja de temario */}
              {pageIdx === 0 ? (
                <div
                  style={{
                    marginBottom: 12,
                    padding: "9px 13px",
                    background: T.paperWarm,
                    border: `1px solid ${T.lineStrong}`,
                    borderLeft: `3px solid ${accent}`,
                    borderRadius: 5,
                    fontSize: 11.8,
                    lineHeight: 1.4,
                    color: T.inkSoft,
                  }}
                >
                  <strong style={{ color: T.ink }}>
                    {levelInfo.isTwoLevel ? "Dos niveles disponibles: " : "Nivel único: "}
                  </strong>
                  {levelInfo.syllabusGuideBanner}
                </div>
              ) : null}

              {/* Grupos por nivel y filas adaptables de módulos */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {page.groups.map((grp, gIdx) => {
                  const rows = groupModulesIntoRows(grp.modules);
                  const groupHeader = formatSyllabusGroupHeader(
                    data,
                    grp.levelLabel
                  );
                  return (
                    <div
                      key={`${grp.levelLabel}-${gIdx}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {/* Banda editorial de nivel */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 14px",
                          background: T.obsidian,
                          color: "#FFFFFF",
                          borderRadius: 5,
                          borderLeft: `4px solid ${accent}`,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            letterSpacing: "-0.01em",
                            color: "#FFFFFF",
                          }}
                        >
                          {groupHeader.title}
                        </span>
                        <span
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: 11,
                            fontWeight: 600,
                            color: darkAccent,
                          }}
                        >
                          {groupHeader.badge}
                        </span>
                      </div>

                      {rows.map((row, rIdx) =>
                        row.type === "full" ? (
                          <ModuleBlock
                            key={`full-${row.mod.moduleNumber}-${rIdx}`}
                            mod={row.mod}
                            accentText={accentText}
                            isFullWidth
                          />
                        ) : (
                          <div
                            key={`pair-${row.left.moduleNumber}-${rIdx}`}
                            style={{
                              display: "grid",
                              gridTemplateColumns: row.right ? "1fr 1fr" : "1fr",
                              gap: 12,
                              alignItems: "stretch",
                            }}
                          >
                            <ModuleBlock
                              mod={row.left}
                              accentText={accentText}
                              isFullWidth={!row.right}
                            />
                            {row.right ? (
                              <ModuleBlock
                                mod={row.right}
                                accentText={accentText}
                                isFullWidth={false}
                              />
                            ) : null}
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Placa ejecutiva final de inscripción en última hoja */}
              {isLastPage ? (
                <div
                  style={{
                    marginTop: "auto",
                    background: T.obsidian,
                    color: "#FFFFFF",
                    borderRadius: 6,
                    padding: "20px 24px",
                    borderTop: `3px solid ${accent}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: darkAccent,
                        marginBottom: 4,
                      }}
                    >
                      Inscripción abierta · Edición {data.paisNombre}
                    </div>
                    <div
                      style={{
                        fontSize: 19,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: "#FFFFFF",
                        marginBottom: 4,
                      }}
                    >
                      {/^curso\b/i.test(data.title)
                        ? "¿Listo para comenzar este programa?"
                        : `¿Listo para dominar ${data.title}?`}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: darkAccent,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {data.precioFormateado}
                      </span>
                      <span
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 11.5,
                          color: "#C8C6BE",
                        }}
                      >
                        {data.moneda} · {levelInfo.closingScopeLabel} · {cuotasCopy}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flexShrink: 0,
                      width: 210,
                    }}
                  >
                    <BrochureCtaLink
                      href={data.inscripcionUrl}
                      label="Inscribirme ahora"
                      variant="accent"
                      accentColor={data.accentColor}
                      style={{ width: "100%" }}
                    />
                    {data.whatsappUrl ? (
                      <BrochureCtaLink
                        href={data.whatsappUrl}
                        label="Hablar por WhatsApp"
                        variant="outline"
                        accentColor={data.accentColor}
                        style={{ width: "100%" }}
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </BrochureA4Sheet>
        );
      })}
    </>
  );
}
