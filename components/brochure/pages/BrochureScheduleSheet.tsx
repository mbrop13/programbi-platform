import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import { describeCourseLevels } from "@/lib/brochure/brochure-pages";
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
  SectionDividerLabel,
  SheetTitleBlock,
} from "@/components/brochure/BrochurePrimitives";

export type BrochureScheduleSheetProps = {
  data: CourseBrochureData;
  pageNumber?: number;
  totalPages: number;
};

type MarketHour = {
  pais: string;
  hora: string;
  zone: string;
};

const TZ_BADGES: Record<string, string> = {
  Chile: "UTC-3 / CLT",
  Argentina: "UTC-3 / ART",
  Uruguay: "UTC-3 / UYT",
  Perú: "UTC-5 / PET",
  Colombia: "UTC-5 / COT",
  México: "UTC-6 / CST",
  Ecuador: "UTC-5 / ECT",
  Bolivia: "UTC-4 / BOT",
  Paraguay: "UTC-3 / PYT",
  España: "UTC+1 / CET",
};

function parseEquivalencias(data: CourseBrochureData): MarketHour[] {
  const raw = data.equivalencias?.cadena || data.equivalencias?.cadenaMercados || "";
  const parsed: MarketHour[] = [];
  for (const part of raw.split("=")) {
    const clean = part.trim();
    const match = clean.match(/^(\d{1,2}:\d{2})\s+en\s+(.+)$/i);
    if (match) {
      const pais = match[2].trim();
      parsed.push({
        hora: match[1].trim(),
        pais,
        zone: TZ_BADGES[pais] || "Hora local",
      });
    }
  }
  if (parsed.length > 0) return parsed.slice(0, 6);

  const fallbackInicio = data.equivalencias?.inicio || "19:30";
  return [
    { pais: data.paisNombre, hora: fallbackInicio, zone: data.zonaHoraria || "Hora local" },
  ];
}

function cleanHora(horario: string): string {
  return horario.split("·")[0]?.trim() || horario;
}

/**
 * Hoja 3 — Calendario y Husos Horarios.
 * Tabla editorial de cohortes + tablero internacional de husos horarios en
 * obsidiana (cero azul #EAF0FF) + logística académica en 3 columnas.
 */
export function BrochureScheduleSheet({
  data,
  pageNumber = 3,
  totalPages,
}: BrochureScheduleSheetProps) {
  const accent = accentOf(data.accentColor);
  const accentText = accentInk(data.accentColor);
  const darkAccent = accentOnDark(data.accentColor);
  const levelInfo = describeCourseLevels(data);

  const schedules = (data.schedules ?? []).slice(0, 5);
  const marketHours = parseEquivalencias(data);
  const baseRange = data.equivalencias
    ? `${data.equivalencias.inicio} a ${data.equivalencias.fin}`
    : cleanHora(schedules[0]?.horario || "19:30 a 21:30");

  return (
    <BrochureA4Sheet
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
          kicker="Fechas y horarios"
          title="Próximas fechas de inicio"
          subtitle={`Horarios en hora de ${data.paisNombre} (${data.zonaHoraria || data.equivalencias?.offset || "hora local"}). ${
            levelInfo.isTwoLevel
              ? `Cada cohorte corresponde a un nivel (${levelInfo.levelsLabel}). `
              : ""
          }La misma clase en vivo en cada país.`}
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
                {levelInfo.scheduleHoursTitle}
              </div>
              <div>{levelInfo.scheduleHoursSubtitle}</div>
            </div>
          }
        />

        {/* Tabla editorial de cohortes */}
        <div
          style={{
            border: `1px solid ${T.obsidian}`,
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.55fr 1.1fr 1.05fr 0.7fr",
              gap: 12,
              padding: "11px 18px",
              background: T.obsidian,
              color: "#FFFFFF",
              fontFamily: FONT_MONO,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span>Fecha de inicio</span>
            <span>Días de cursado</span>
            <span>Hora de {data.paisNombre}</span>
            <span style={{ textAlign: "right" }}>Nivel</span>
          </div>

          {schedules.length > 0 ? (
            schedules.map((row, idx) => (
              <div
                key={row.id || `${row.fecha}-${idx}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.55fr 1.1fr 1.05fr 0.7fr",
                  gap: 12,
                  alignItems: "center",
                  padding: "14px 18px",
                  background: idx % 2 === 0 ? T.paper : T.paperWarm,
                  borderTop: idx > 0 ? `1px solid ${T.line}` : "none",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.ink,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {row.fecha}
                </span>
                <span
                  style={{
                    fontSize: 12.5,
                    color: T.inkSoft,
                  }}
                >
                  {row.dias}
                </span>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: T.ink,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {cleanHora(row.horario)}
                </span>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 600,
                      color: accentText,
                      background: T.wash,
                      border: `1px solid ${T.lineStrong}`,
                      borderRadius: 4,
                      padding: "2px 8px",
                    }}
                  >
                    {row.nivel}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: "18px",
                fontSize: 13,
                color: T.inkSoft,
                background: T.paper,
              }}
            >
              Consulta por fechas de inicio corporativas o próximas cohortes abiertas.
            </div>
          )}
        </div>

        {/* Tablero de equivalencias internacionales en contraste obsidiana */}
        <div
          style={{
            background: T.obsidian,
            color: "#FFFFFF",
            borderRadius: 6,
            padding: "22px 24px",
            borderTop: `3px solid ${accent}`,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 16,
              paddingBottom: 14,
              borderBottom: "1px solid rgba(255,255,255,0.14)",
              marginBottom: 16,
            }}
          >
            <div>
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
                Equivalencias horarias internacionales
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                }}
              >
                La misma clase en vivo en cada país
              </h2>
            </div>

            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: "#C8C6BE",
                textAlign: "right",
              }}
            >
              Base {baseRange} · Hora de {data.paisNombre}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {marketHours.map((eq) => (
              <div
                key={eq.pais}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 5,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#FFFFFF",
                    }}
                  >
                    {eq.pais}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      color: "#A5A39B",
                      marginTop: 2,
                    }}
                  >
                    {eq.zone}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 18,
                    fontWeight: 700,
                    color: darkAccent,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {eq.hora}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logística académica en 3 columnas para equilibrar la hoja */}
        <div style={{ marginTop: "auto" }}>
          <SectionDividerLabel label="Dinámica de cursado y soporte al estudiante" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              borderTop: `1px solid ${T.lineStrong}`,
              borderBottom: `1px solid ${T.line}`,
              background: T.paperWarm,
            }}
          >
            {[
              {
                num: "01 · ZOOM",
                title: "Sesiones interactivas",
                body: "Compartes pantalla cuando lo necesites y resuelves casos reales junto al profesor.",
              },
              {
                num: "02 · CAMPUS",
                title: "Grabaciones de por vida",
                body: "Si un día no puedes asistir en vivo, la grabación queda disponible de inmediato para siempre.",
              },
              {
                num: "03 · SOPORTE",
                title: "Material y datasets",
                body: "Recibes los archivos de trabajo antes de cada sesión y consultas directas entre clases.",
              },
            ].map((item, idx) => (
              <div
                key={item.num}
                style={{
                  padding: "16px 16px",
                  borderRight: idx < 2 ? `1px solid ${T.line}` : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 700,
                    color: accentText,
                    marginBottom: 5,
                  }}
                >
                  {item.num}
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: T.ink,
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    lineHeight: 1.45,
                    color: T.inkSoft,
                  }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrochureA4Sheet>
  );
}
