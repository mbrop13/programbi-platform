import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import {
  FONT_CERT,
  FONT_MONO,
  FONT_SANS,
  T,
  accentInk,
  accentOf,
} from "@/lib/brochure/brochure-theme";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import {
  CrispCheckIcon,
  SectionDividerLabel,
  SheetTitleBlock,
} from "@/components/brochure/BrochurePrimitives";

export type BrochureShowcaseSheetProps = {
  data: CourseBrochureData;
  pageNumber?: number;
  totalPages: number;
};

const DEFAULT_PILLARS = [
  {
    title: "Aprende haciendo",
    description:
      "Explicación breve y práctica guiada en vivo sobre escenarios reales.",
  },
  {
    title: "Proyecto real",
    description:
      "Construyes un entregable aplicable desde la primera semana de clases.",
  },
  {
    title: "Feedback directo",
    description:
      "Profesores en ejercicio revisan tu avance y resuelven dudas en directo.",
  },
  {
    title: "Certificación verificable",
    description:
      "Diploma oficial con código único de validación y respaldo para LinkedIn.",
  },
];

/**
 * Hoja 4 — Metodología, Entregables Reales y Certificado Oficial.
 * Incluye capturas reales ampliadas en formato ventana de aplicación y
 * una maqueta visual fiel del Certificado de Finalización ProgramBI.
 */
export function BrochureShowcaseSheet({
  data,
  pageNumber = 4,
  totalPages,
}: BrochureShowcaseSheetProps) {
  const accent = accentOf(data.accentColor);
  const accentText = accentInk(data.accentColor);

  const pillars = (
    data.methodologyPillars?.length ? data.methodologyPillars : DEFAULT_PILLARS
  ).slice(0, 4);

  const gallery = (data.galleryImages ?? []).slice(0, 4);
  const galleryCols = gallery.length <= 3 ? Math.max(1, gallery.length) : 2;
  const galleryHeight = gallery.length === 4 ? 132 : 165;

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
          kicker="Metodología y resultados"
          title="Proyectos reales y certificado"
          subtitle="Cada sesión combina criterio profesional, práctica guiada sobre casos reales y un entregable verificable."
          accentColor={data.accentColor}
        />

        {/* Los 4 pilares: retícula horizontal limpia con filete superior (sin cajas redondeadas) */}
        <div style={{ marginBottom: 18 }}>
          <SectionDividerLabel label="Los cuatro pilares del aprendizaje" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 14,
            }}
          >
            {pillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                style={{
                  borderTop: `2px solid ${T.obsidian}`,
                  paddingTop: 9,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 700,
                    color: accentText,
                    marginBottom: 4,
                  }}
                >
                  0{idx + 1}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.ink,
                    lineHeight: 1.25,
                    marginBottom: 4,
                  }}
                >
                  {pillar.title}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11.5,
                    lineHeight: 1.4,
                    color: T.inkSoft,
                  }}
                >
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Proyectos y entregables en ventanas de aplicación ampliadas */}
        {gallery.length > 0 ? (
          <div style={{ marginBottom: 18 }}>
            <SectionDividerLabel
              label="Proyectos y entregables del programa"
              rightLabel={`${gallery.length} vistas reales`}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${galleryCols}, minmax(0, 1fr))`,
                gap: 12,
              }}
            >
              {gallery.map((item, idx) => (
                <figure
                  key={`${item.src}-${idx}`}
                  style={{
                    margin: 0,
                    border: `1px solid ${T.lineStrong}`,
                    borderRadius: 6,
                    overflow: "hidden",
                    background: T.paperWarm,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "5px 10px",
                      background: T.obsidian,
                      color: "#D6D4CC",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span
                        aria-hidden="true"
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 99,
                          background: accent,
                          display: "inline-block",
                        }}
                      />
                      <span
                        aria-hidden="true"
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 99,
                          background: "rgba(255,255,255,0.28)",
                          display: "inline-block",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        color: "#E5E3DC",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: galleryCols === 2 ? 250 : 140,
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <div
                    style={{
                      height: galleryHeight,
                      background: T.paper,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
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
                </figure>
              ))}
            </div>
          </div>
        ) : null}

        {/* Maqueta visual fiel del Certificado Oficial de Finalización */}
        <div style={{ marginTop: "auto" }}>
          <SectionDividerLabel
            label="Certificación oficial ProgramBI"
            rightLabel="Validación digital incluida"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.18fr 0.82fr",
              gap: 18,
              alignItems: "stretch",
            }}
          >
            {/* Diploma miniatura navy + oro estilo institucional ProgramBI */}
            <div
              style={{
                background: T.certNavy,
                padding: 8,
                borderRadius: 6,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  background: "#FCFBF7",
                  border: `1.5px solid ${T.certGold}`,
                  padding: "14px 18px",
                  height: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: T.certNavy,
                    }}
                  >
                    PROGRAMBI ACADEMY
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#8A6A24",
                    }}
                  >
                    ID: PBI-VER-2026
                  </span>
                </div>

                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      color: T.certNavy,
                      marginBottom: 4,
                    }}
                  >
                    CERTIFICADO DE FINALIZACIÓN
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_CERT,
                      fontSize: 24,
                      lineHeight: 1.1,
                      color: T.obsidian,
                      marginBottom: 4,
                    }}
                  >
                    Nombre del Estudiante
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: T.inkSoft,
                      lineHeight: 1.35,
                    }}
                  >
                    Por aprobar satisfactoriamente el programa{" "}
                    <strong style={{ color: T.certNavy }}>{data.title}</strong> ({data.hours}h)
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    paddingTop: 6,
                    borderTop: `1px solid ${T.line}`,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: FONT_CERT,
                        fontSize: 14,
                        color: T.certNavy,
                      }}
                    >
                      Manuel Oliva
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        color: T.mute,
                      }}
                    >
                      Director · ProgramBI
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 700,
                      color: T.certNavy,
                      border: `1px solid ${T.certGold}`,
                      padding: "2px 7px",
                      borderRadius: 3,
                    }}
                  >
                    VERIFICADO
                  </div>
                </div>
              </div>
            </div>

            {/* Respaldo y atributos de certificación */}
            <div
              style={{
                border: `1px solid ${T.line}`,
                borderRadius: 6,
                background: T.paperWarm,
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: accentText,
                    marginBottom: 6,
                  }}
                >
                  Edición {data.paisNombre}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: T.ink,
                    lineHeight: 1.25,
                    marginBottom: 10,
                  }}
                >
                  Acreditación lista para tu CV y LinkedIn
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Certificado digital verificable",
                    "Emitido por ProgramBI",
                    "Grabaciones de por vida",
                  ].map((bullet) => (
                    <div
                      key={bullet}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: T.ink,
                      }}
                    >
                      <CrispCheckIcon color={T.ok} size={14} />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: 12,
                  paddingTop: 10,
                  borderTop: `1px solid ${T.line}`,
                  fontSize: 11.5,
                  lineHeight: 1.4,
                  color: T.mute,
                }}
              >
                Incluye código único para validación directa por empleadores y áreas de selección.
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrochureA4Sheet>
  );
}
