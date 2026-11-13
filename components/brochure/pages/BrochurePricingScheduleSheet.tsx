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
  BrochureCtaLink,
  CrispCheckIcon,
  SectionDividerLabel,
  SheetTitleBlock,
} from "@/components/brochure/BrochurePrimitives";

export type BrochurePricingScheduleSheetProps = {
  data: CourseBrochureData;
  pageNumber?: number;
  totalPages: number;
};

const DEFAULT_INCLUDED_ITEMS = [
  {
    code: "01",
    title: "Clases 100% en vivo por Zoom",
    desc: "Sesiones interactivas en tiempo real para resolver dudas directamente con el docente.",
  },
  {
    code: "02",
    title: "Grabaciones ilimitadas de por vida",
    desc: "Acceso permanente al campus virtual para repasar cada clase cuando lo necesites.",
  },
  {
    code: "03",
    title: "Datasets y plantillas descargables",
    desc: "Bases de datos reales, notebooks, consultas y modelos listos para tu portafolio.",
  },
  {
    code: "04",
    title: "Acompañamiento directo de profesores",
    desc: "Revisión práctica de entregables y guía metodológica durante todo el curso.",
  },
  {
    code: "05",
    title: "Certificado digital verificable",
    desc: "Diploma oficial de ProgramBI con código único de validación y enlace para LinkedIn.",
  },
  {
    code: "06",
    title: "Casos de negocio por industria",
    desc: "Ejercicios basados en banca, minería, retail, finanzas y control de gestión.",
  },
];

/**
 * Hoja 2 — Inversión y Formas de Pago.
 * Formato Dossier Financiero: placa principal de inversión en obsidiana +
 * tabla de cuotas y medios de pago + matriz de valor en 2 columnas.
 */
export function BrochurePricingScheduleSheet({
  data,
  pageNumber = 2,
  totalPages,
}: BrochurePricingScheduleSheetProps) {
  const accent = accentOf(data.accentColor);
  const accentText = accentInk(data.accentColor);
  const darkAccent = accentOnDark(data.accentColor);
  const levelInfo = describeCourseLevels(data);

  const hasDiscount =
    typeof data.descuentoPct === "number" &&
    data.descuentoPct > 0 &&
    Boolean(data.precioListaFormateado) &&
    data.precioListaFormateado !== data.precioFormateado;

  const cuotasText =
    data.cuotaTexto || `${data.cuotas} cuotas sin interés disponibles`;

  const paymentMethods = (
    data.mediosPago?.length
      ? data.mediosPago
      : ["Tarjeta de crédito o débito", "Transferencia bancaria", "Factura a empresa"]
  ).slice(0, 6);

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
          kicker={`Inversión · Edición ${data.paisNombre}`}
          title="Precio y formas de pago"
          subtitle={`Arancel oficial vigente y condiciones de pago en ${data.paisNombre} (${data.moneda}).`}
          accentColor={data.accentColor}
        />

        {/* Dossier financiero en 2 columnas asimétricas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.12fr 0.88fr",
            border: `1px solid ${T.obsidian}`,
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {/* Izquierda: placa obsidiana de arancel principal */}
          <div
            style={{
              background: T.obsidian,
              color: "#FFFFFF",
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderTop: `3px solid ${accent}`,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: darkAccent,
                  }}
                >
                  {levelInfo.priceKicker}
                </span>
                {hasDiscount ? (
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 700,
                      color: T.obsidian,
                      background: darkAccent,
                      padding: "2px 8px",
                      borderRadius: 3,
                    }}
                  >
                    -{data.descuentoPct}% OFF
                  </span>
                ) : null}
              </div>

              {hasDiscount ? (
                <div
                  style={{
                    fontSize: 14,
                    color: "#A5A39B",
                    textDecoration: "line-through",
                    marginBottom: 4,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  Antes {data.precioListaFormateado}
                </div>
              ) : null}

              <div
                style={{
                  fontSize: 42,
                  lineHeight: 1.0,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#FFFFFF",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {data.precioFormateado}
              </div>

              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 12,
                  lineHeight: 1.42,
                  fontWeight: 500,
                  color: "#F0EFE9",
                }}
              >
                {levelInfo.priceScopeNote}
              </p>

              <p
                style={{
                  margin: "5px 0 0",
                  fontSize: 11.5,
                  lineHeight: 1.4,
                  color: "#B4B2AA",
                }}
              >
                {data.notaPago ||
                  "Matrícula única, sin costos ocultos ni cobros recurrentes."}
              </p>
            </div>

            <div
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: "1px solid rgba(255,255,255,0.14)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  color: "#C8C6BE",
                }}
              >
                PAGA EN CUOTAS
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: darkAccent,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {data.cuotas} cuotas sin interés
              </span>
            </div>
          </div>

          {/* Derecha: desglose de financiamiento y medios aceptados */}
          <div
            style={{
              background: T.paperWarm,
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderLeft: `1px solid ${T.line}`,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.11em",
                  textTransform: "uppercase",
                  color: accentText,
                  marginBottom: 6,
                }}
              >
                Financiamiento directo
              </div>
              <div
                style={{
                  fontSize: 17,
                  lineHeight: 1.3,
                  fontWeight: 700,
                  color: T.ink,
                  letterSpacing: "-0.015em",
                }}
              >
                {cuotasText}
              </div>
              {data.notaCuotas ? (
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: 11.5,
                    lineHeight: 1.4,
                    color: T.mute,
                  }}
                >
                  {data.notaCuotas}
                </p>
              ) : null}

              <div
                style={{
                  marginTop: 18,
                  paddingTop: 14,
                  borderTop: `1px solid ${T.line}`,
                }}
              >
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: T.mute,
                    marginBottom: 8,
                  }}
                >
                  Medios de pago habilitados
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {paymentMethods.map((method) => (
                    <div
                      key={method}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12.5,
                        color: T.ink,
                        fontWeight: 500,
                      }}
                    >
                      <CrispCheckIcon color={T.ok} size={14} />
                      <span>{method}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estructura de niveles del curso (2 niveles independientes vs nivel único) */}
        <div style={{ marginBottom: 15 }}>
          <SectionDividerLabel
            label={
              levelInfo.isTwoLevel
                ? "Cómo funcionan los 2 niveles"
                : "Estructura de nivel único"
            }
            rightLabel={
              levelInfo.isTwoLevel
                ? "Inscripción independiente por nivel"
                : "Sin separación en Básico/Avanzado"
            }
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: levelInfo.levelCards.length > 1 ? "1fr 1fr" : "1fr",
              gap: 12,
            }}
          >
            {levelInfo.levelCards.map((card) => (
              <div
                key={card.code}
                style={{
                  padding: "10px 13px",
                  border: `1px solid ${T.lineStrong}`,
                  borderTop: `2.5px solid ${accent}`,
                  borderRadius: 6,
                  background: T.paperWarm,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 700,
                      color: accentText,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {card.code} · {card.hoursText}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      color: T.mute,
                    }}
                  >
                    {card.badge}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: T.ink,
                    letterSpacing: "-0.01em",
                    marginBottom: 3,
                  }}
                >
                  {card.name}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11.6,
                    lineHeight: 1.38,
                    color: T.inkSoft,
                  }}
                >
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Qué incluye tu inscripción: retícula estructurada 2x3 */}
        <div>
          <SectionDividerLabel
            label="Qué incluye tu inscripción"
            rightLabel="Acceso completo incluido en el arancel"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 18px",
            }}
          >
            {DEFAULT_INCLUDED_ITEMS.map((item) => (
              <div
                key={item.code}
                style={{
                  padding: "10px 12px",
                  border: `1px solid ${T.line}`,
                  borderRadius: 6,
                  background: T.paper,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 11,
                      fontWeight: 700,
                      color: accentText,
                    }}
                  >
                    {item.code}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: T.ink,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11.6,
                    lineHeight: 1.38,
                    color: T.inkSoft,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Banda comercial inferior compacta */}
        <div
          style={{
            marginTop: "auto",
            padding: "14px 18px",
            border: `1px solid ${T.lineStrong}`,
            borderRadius: 6,
            background: T.paperWarm,
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
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: accentText,
                marginBottom: 3,
              }}
            >
              Inscripción personal o corporativa
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.ink,
              }}
            >
              Reserva tu cupo hoy o solicita factura para tu equipo
            </div>
            <div
              style={{
                fontSize: 12,
                color: T.mute,
                marginTop: 2,
              }}
            >
              Emitimos documento tributario para empresas y entregamos cotización formal el mismo día.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <BrochureCtaLink
              href={data.inscripcionUrl}
              label="Inscribirme"
              variant="primary"
              accentColor={data.accentColor}
            />
            {data.whatsappUrl ? (
              <BrochureCtaLink
                href={data.whatsappUrl}
                label="Hablar por WhatsApp"
                variant="whatsapp"
                accentColor={data.accentColor}
              />
            ) : null}
          </div>
        </div>
      </div>
    </BrochureA4Sheet>
  );
}
