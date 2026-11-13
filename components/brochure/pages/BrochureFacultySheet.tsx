import type {
  BrochureProfesor,
  CourseBrochureData,
} from "@/lib/brochure/brochure-data";
import { BROCHURE_COMPANY_LOGOS } from "@/lib/brochure/brochure-assets";
import {
  FONT_MONO,
  FONT_SANS,
  T,
  accentInk,
  accentOf,
} from "@/lib/brochure/brochure-theme";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import {
  SectionDividerLabel,
  SheetTitleBlock,
} from "@/components/brochure/BrochurePrimitives";

export type BrochureFacultySheetProps = {
  data: CourseBrochureData;
  pageNumber?: number;
  totalPages: number;
};

/**
 * Construye una biografía limpia en oraciones completas sin cortes `....`.
 */
function cleanFacultyBio(prof: BrochureProfesor): string {
  if (prof.founderBio) {
    const raw = prof.founderBio.replace(/\s+/g, " ").trim();
    if (raw.length <= 255) return raw;
    const sentences = raw.match(/[^.!?]+[.!?]+/g) ?? [raw];
    let out = "";
    for (const s of sentences) {
      const candidate = out ? `${out} ${s.trim()}` : s.trim();
      if (candidate.length > 265 && out.length > 90) break;
      out = candidate;
    }
    if (out && out.length <= 275) return out;
    const sliced = raw.slice(0, 240);
    const lastSpace = sliced.lastIndexOf(" ");
    return `${(lastSpace > 120 ? sliced.slice(0, lastSpace) : sliced).replace(/[,:;.\s]+$/, "")}.`;
  }

  const extras = [
    ...(prof.founderAcademics ?? []),
    ...(prof.founderCareer ?? []),
    ...(prof.credentials ?? []),
  ]
    .map((s) => s.trim())
    .filter(
      (s) =>
        s.length > 0 &&
        s.toLowerCase() !== prof.title.trim().toLowerCase() &&
        !s.toLowerCase().includes(prof.title.trim().toLowerCase())
    );
  const unique: string[] = [];
  for (const item of extras) {
    if (!unique.some((u) => u.toLowerCase() === item.toLowerCase())) {
      unique.push(item);
    }
  }
  return unique.join(" · ");
}

function cleanCredentialLine(prof: BrochureProfesor): string {
  const parts = [
    prof.title,
    ...(prof.founderBio ? (prof.founderAcademics ?? []).slice(0, 1) : []),
    ...(prof.founderBio ? (prof.founderCareer ?? []).slice(0, 1) : []),
  ]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean);

  const unique: string[] = [];
  for (const part of parts) {
    if (
      !unique.some(
        (u) =>
          u.toLowerCase().includes(part.toLowerCase()) ||
          part.toLowerCase().includes(u.toLowerCase())
      )
    ) {
      unique.push(part);
    }
    if (unique.length >= 2) break;
  }
  return unique.join(" · ");
}

/**
 * Hoja 5 — Claustro Docente y Red Empresarial.
 * Presenta a Manuel Oliva, Emanuel Berrocal y Rodrigo Vega con retrato
 * arquitectónico, credenciales completas sin recortes rotos y los 12 logos.
 */
export function BrochureFacultySheet({
  data,
  pageNumber = 5,
  totalPages,
}: BrochureFacultySheetProps) {
  const accent = accentOf(data.accentColor);
  const accentText = accentInk(data.accentColor);

  const profesores = (data.profesores ?? []).slice(0, 3);
  const companyLogos = (
    data.companyLogos?.length ? data.companyLogos : BROCHURE_COMPANY_LOGOS
  ).slice(0, 12);

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
          kicker="Claustro docente"
          title="Aprende con quienes lideran proyectos de datos"
          subtitle="Profesores en ejercicio activo, con trayectoria comprobada en banca, minería, retail, finanzas y consultoría analítica."
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
                0{profesores.length} DOCENTES
              </div>
              <div>{data.modality || "Zoom en vivo"}</div>
            </div>
          }
        />

        {/* Fichas editoriales del claustro docente */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {profesores.map((prof, idx) => {
            const bio = cleanFacultyBio(prof);
            const cred = cleanCredentialLine(prof);
            const photoSrc = prof.imageUrl || "/images/logo.png";
            return (
              <article
                key={prof.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "86px 1fr",
                  gap: 18,
                  padding: "14px 16px",
                  border: `1px solid ${T.line}`,
                  borderRadius: 6,
                  background: idx === 0 ? T.paperWarm : T.paper,
                }}
              >
                <div
                  style={{
                    width: 86,
                    height: 104,
                    borderRadius: 5,
                    overflow: "hidden",
                    border: `1px solid ${T.lineStrong}`,
                    background: T.wash,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={photoSrc}
                    alt={prof.name}
                    crossOrigin="anonymous"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "top center",
                      display: "block",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minWidth: 0,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <h2
                          style={{
                            margin: 0,
                            fontSize: 17.5,
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            color: T.ink,
                          }}
                        >
                          {prof.name}
                        </h2>
                        <span
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: accentText,
                            background: T.wash,
                            border: `1px solid ${T.line}`,
                            borderRadius: 3,
                            padding: "1px 7px",
                          }}
                        >
                          {prof.role}
                        </span>
                      </div>

                      <div
                        style={{
                          fontFamily: FONT_MONO,
                          fontSize: 11,
                          fontWeight: 600,
                          color: T.inkSoft,
                          whiteSpace: "nowrap",
                        }}
                      >
                        +{prof.yearsExperience} años · +{prof.studentCount.toLocaleString("es-CL")} alumnos
                      </div>
                    </div>

                    {cred ? (
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          color: T.inkSoft,
                        }}
                      >
                        {cred}
                      </div>
                    ) : null}

                    {bio ? (
                      <p
                        style={{
                          margin: "7px 0 0",
                          fontSize: 12.2,
                          lineHeight: 1.46,
                          color: T.inkSoft,
                        }}
                      >
                        {bio}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Red corporativa completa de las 12 empresas */}
        <div style={{ marginTop: "auto", paddingTop: 18 }}>
          <SectionDividerLabel
            label="Empresas cuyos equipos y profesionales han confiado en ProgramBI"
            rightLabel={`${companyLogos.length} organizaciones`}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
              borderTop: `1px solid ${T.obsidian}`,
              borderLeft: `1px solid ${T.line}`,
              background: T.paper,
            }}
          >
            {companyLogos.map((logo) => (
              <div
                key={logo.name}
                style={{
                  height: 54,
                  padding: "8px 12px",
                  borderRight: `1px solid ${T.line}`,
                  borderBottom: `1px solid ${T.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: T.paperWarm,
                }}
              >
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  crossOrigin="anonymous"
                  style={{
                    maxHeight: 24,
                    maxWidth: "100%",
                    width: "auto",
                    objectFit: "contain",
                    filter: "grayscale(100%) contrast(1.12)",
                    opacity: 0.84,
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              fontSize: 11.5,
              color: T.mute,
            }}
          >
            <span>
              Programas abiertos para profesionales y capacitaciones cerradas in-company en toda Latinoamérica.
            </span>
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 600,
                color: accentText,
                borderBottom: `2px solid ${accent}`,
                paddingBottom: 1,
                whiteSpace: "nowrap",
              }}
            >
              +15 años de experiencia aplicada
            </span>
          </div>
        </div>
      </div>
    </BrochureA4Sheet>
  );
}
