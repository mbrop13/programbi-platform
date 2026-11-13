import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import { BROCHURE_COMPANY_LOGOS } from "@/lib/brochure/brochure-assets";
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
import { SectionDividerLabel } from "@/components/brochure/BrochurePrimitives";

export type BrochureCoverSheetProps = {
  data: CourseBrochureData;
  pageNumber?: number;
  totalPages: number;
};

function computeTitleSize(title: string): number {
  const len = title.trim().length;
  if (len <= 16) return 46;
  if (len <= 28) return 38;
  if (len <= 44) return 32;
  return 27;
}

/**
 * Hoja 1 — Portada Ejecutiva.
 * Diseño Paper & Ink sin píldoras flotantes sobre la foto ni elementos rotos:
 * cabecera institucional nítida, título tipográfico calibrado, grilla de KPIs,
 * imagen panorámica encuadrada con cinta técnica inferior y competencias clave.
 */
export function BrochureCoverSheet({
  data,
  pageNumber = 1,
  totalPages,
}: BrochureCoverSheetProps) {
  const accent = accentOf(data.accentColor);
  const accentText = accentInk(data.accentColor);
  const darkAccent = accentOnDark(data.accentColor);

  const logoSrc = data.brandLogoUrl || "/images/logo.png";
  const heroSrc = data.imageUrl || "/images/courses/power-bi.webp";
  const heroTitleSize = computeTitleSize(data.title);
  const levelInfo = describeCourseLevels(data);

  const learnItems = (data.whatYouLearn ?? []).slice(0, 4);
  const stackItems = (data.techStack ?? []).slice(0, 6);
  const companyLogos = (
    data.companyLogos?.length ? data.companyLogos : BROCHURE_COMPANY_LOGOS
  ).slice(0, 6);

  const metrics = [
    {
      value: `${data.hours}`,
      unit: "HORAS",
      note: levelInfo.coverHoursNote,
    },
    {
      value: `${data.modulesCount}`,
      unit: data.modulesCount === 1 ? "MÓDULO" : "MÓDULOS",
      note: levelInfo.coverModulesNote,
    },
    {
      value: `${data.levelsCount}`,
      unit: levelInfo.coverKpiUnit,
      note: levelInfo.coverKpiNote,
    },
    {
      value: "Digital",
      unit: "CERTIFICADO",
      note: "Código verificable",
    },
  ];

  return (
    <BrochureA4Sheet
      pageNumber={pageNumber}
      totalPages={totalPages}
      data={data}
      isCover
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "26px 48px 20px",
          fontFamily: FONT_SANS,
          boxSizing: "border-box",
        }}
      >
        {/* Cabecera superior de portada: marca sobre blanco + edición */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 16,
            borderBottom: `1px solid ${T.line}`,
          }}
        >
          <img
            src={logoSrc}
            alt="ProgramBI"
            crossOrigin="anonymous"
            style={{
              height: 30,
              width: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 600,
                color: T.mute,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Actualizado {data.actualizado}
            </span>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 600,
                color: "#FFFFFF",
                background: T.obsidian,
                padding: "4px 10px",
                borderRadius: 4,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Edición {data.paisNombre}
            </span>
          </div>
        </div>

        {/* Bloque de título editorial */}
        <div style={{ paddingTop: 22, paddingBottom: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 24,
                height: 3,
                background: accent,
                border: accent === "#F2C811" ? `1px solid ${accentText}` : "none",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: accentText,
              }}
            >
              Temario oficial y condiciones · {data.categoryLabel || "Programa en vivo"}
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: heroTitleSize,
              lineHeight: 1.06,
              fontWeight: 700,
              letterSpacing: "-0.032em",
              color: T.ink,
            }}
          >
            {data.title}
          </h1>

          <p
            style={{
              margin: "12px 0 0",
              fontSize: 14.5,
              lineHeight: 1.5,
              color: T.inkSoft,
              maxWidth: 660,
            }}
          >
            {data.shortDescription || data.description}
          </p>
        </div>

        {/* Tira arquitectónica de KPIs (sin cajas redondeadas) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            borderTop: `1px solid ${T.obsidian}`,
            borderBottom: `1px solid ${T.line}`,
            background: T.paperWarm,
          }}
        >
          {metrics.map((m, idx) => (
            <div
              key={m.unit}
              style={{
                padding: "13px 14px",
                borderRight: idx < 3 ? `1px solid ${T.line}` : "none",
              }}
            >
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: accentText,
                  marginBottom: 4,
                }}
              >
                {m.unit}
              </div>
              <div
                style={{
                  fontSize: 25,
                  lineHeight: 1.05,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: T.ink,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.mute,
                  marginTop: 3,
                }}
              >
                {m.note}
              </div>
            </div>
          ))}
        </div>

        {/* Franja aclaratoria de estructura por niveles (2 niveles vs nivel único) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "9px 14px",
            background: T.paper,
            borderBottom: `1px solid ${T.line}`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              background: T.obsidian,
              padding: "3px 9px",
              borderRadius: 4,
              flexShrink: 0,
            }}
          >
            {levelInfo.coverBannerTitle}
          </span>
          <span
            style={{
              fontSize: 11.8,
              lineHeight: 1.38,
              color: T.inkSoft,
              fontWeight: 500,
            }}
          >
            {levelInfo.coverBannerDetail}
          </span>
        </div>

        {/* Marco panorámico limpio + cinta técnica obsidiana debajo (cero solape sobre imagen) */}
        <div
          style={{
            marginTop: 14,
            border: `1px solid ${T.lineStrong}`,
            borderRadius: 6,
            overflow: "hidden",
            background: T.obsidian,
          }}
        >
          <div
            style={{
              width: "100%",
              height: 300,
              background: T.obsidian,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={heroSrc}
              alt={data.title}
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "11px 16px",
              background: T.obsidian,
              color: "#FFFFFF",
              borderTop: `2px solid ${accent}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  background: darkAccent,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                }}
              >
                {data.modality || "Clases 100% en vivo por Zoom"}
              </span>
            </div>

            {stackItems.length > 0 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {stackItems.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#E7E5DE",
                      background: "rgba(255,255,255,0.09)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      borderRadius: 3,
                      padding: "2px 8px",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Lo que vas a lograr: matriz numerada 2x2 sin cajas genéricas */}
        {learnItems.length > 0 ? (
          <div style={{ marginTop: 16 }}>
            <SectionDividerLabel
              label="Lo que vas a dominar"
              rightLabel="Enfoque 100% aplicado"
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px 26px",
              }}
            >
              {learnItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    paddingBottom: 6,
                    borderBottom: `1px solid ${T.line}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 700,
                      color: accentText,
                      paddingTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    0{idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      lineHeight: 1.4,
                      color: T.ink,
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Franja inferior de respaldo corporativo */}
        <div style={{ marginTop: "auto", paddingTop: 14 }}>
          <SectionDividerLabel label="Equipos que se han capacitado con ProgramBI" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
              alignItems: "center",
              gap: 16,
              paddingTop: 2,
            }}
          >
            {companyLogos.map((logo) => (
              <div
                key={logo.name}
                style={{
                  height: 26,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  crossOrigin="anonymous"
                  style={{
                    maxHeight: 20,
                    maxWidth: "100%",
                    width: "auto",
                    objectFit: "contain",
                    filter: "grayscale(100%) contrast(1.15)",
                    opacity: 0.72,
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrochureA4Sheet>
  );
}
