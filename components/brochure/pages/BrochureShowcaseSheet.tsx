"use client";

/**
 * Hoja 3 del brochure: competencias, capturas reales de clases y vista previa
 * del certificado. Todo el contenido sale de `CourseBrochureData`; las imágenes
 * son same-origin para que la captura del PDF pueda leerlas sin CORS.
 */

import type { CSSProperties } from "react";
import { BrochureA4Sheet } from "@/components/brochure/BrochureA4Sheet";
import type {
  BrochureGalleryImage,
  CourseBrochureData,
} from "@/lib/brochure/brochure-data";

const TINTA = "#141519";
const GRIS = "#5C5D63";
const TENUE = "#77786F";
const LINEA = "#E7E4DA";
const ORO = "#C5A059";
const ORO_OSCURO = "#8A6A22";

const BODY =
  '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const DISPLAY = 'Georgia, "Times New Roman", serif';

/** Limita un texto a dos líneas con puntos suspensivos. */
const DOS_LINEAS: CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const SUBTITULO_SECCION: CSSProperties = {
  margin: 0,
  fontSize: 6.8,
  lineHeight: 1.3,
  letterSpacing: 1.4,
  textTransform: "uppercase",
  fontWeight: 700,
  color: TENUE,
};

type BrochureShowcaseSheetProps = {
  data: CourseBrochureData;
  pageNumber: number;
  totalPages: number;
};

/** Acorta el título de la píldora de la barra de ventana. */
function tituloCorto(titulo: string, maximo = 26): string {
  const limpio = titulo.trim();
  if (limpio.length <= maximo) return limpio;
  return `${limpio.slice(0, maximo - 1).trimEnd()}…`;
}

/**
 * La hoja siempre muestra tres marcos. Si el curso trae menos capturas, se
 * reutilizan las disponibles sin inventar imágenes nuevas.
 */
function tresCapturas(imagenes: BrochureGalleryImage[]): BrochureGalleryImage[] {
  if (imagenes.length === 0) return [];
  const salida = imagenes.slice(0, 3);
  for (let indice = 0; salida.length < 3; indice += 1) {
    const imagen = imagenes[indice % imagenes.length];
    if (!imagen) break;
    salida.push(imagen);
  }
  return salida;
}

function CheckCircular({ accent }: { accent: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <circle
        cx="6.5"
        cy="6.5"
        r="6"
        fill={`${accent}1A`}
        stroke={`${accent}55`}
        strokeWidth="1"
      />
      <path
        d="M3.7 6.6 5.6 8.5 9.3 4.6"
        fill="none"
        stroke={accent}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Esquina({ style }: { style: CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        width: 12,
        height: 12,
        borderStyle: "solid",
        borderWidth: 0,
        borderColor: "rgba(197, 160, 89, 0.6)",
        ...style,
      }}
    />
  );
}

function PuntoVentana({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 5,
        height: 5,
        borderRadius: "50%",
        backgroundColor: color,
        flex: "0 0 auto",
        display: "block",
      }}
    />
  );
}

export function BrochureShowcaseSheet({
  data,
  pageNumber,
  totalPages,
}: BrochureShowcaseSheetProps) {
  const accent = data.accentColor;
  const competencias = data.whatYouLearn.slice(0, 8);
  const galeria = tresCapturas(data.galleryImages);
  const codigo = `Código de verificación: PB-${data.slug.toUpperCase()}-${data.pais.toUpperCase()}-2026`;

  return (
    <BrochureA4Sheet data={data} pageNumber={pageNumber} totalPages={totalPages}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          fontFamily: BODY,
          color: TINTA,
        }}
      >
        {/* 1. Encabezado de sección */}
        <header>
          <div
            style={{
              fontSize: 8,
              lineHeight: 1.2,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontWeight: 700,
              color: accent,
            }}
          >
            RESULTADOS Y PROYECTOS
          </div>
          <h2
            style={{
              margin: "6px 0 0",
              fontFamily: DISPLAY,
              fontSize: 26,
              lineHeight: 1.1,
              letterSpacing: -0.4,
              fontWeight: 400,
              color: TINTA,
            }}
          >
            Lo que vas a dominar
          </h2>
          <p
            style={{
              margin: "5px 0 0",
              fontSize: 8.6,
              lineHeight: 1.45,
              color: GRIS,
            }}
          >
            Competencias concretas y capturas reales de lo que se construye en
            clase.
          </p>
        </header>

        {/* 2. Competencias */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 14,
            rowGap: 6,
            marginTop: 14,
          }}
        >
          {competencias.map((texto, indice) => (
            <div
              key={`competencia-${indice}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                minHeight: 30,
                padding: "5px 0",
                boxSizing: "border-box",
              }}
            >
              <span style={{ flex: "0 0 auto", marginTop: 1 }}>
                <CheckCircular accent={accent} />
              </span>
              <span
                style={{
                  fontSize: 7.9,
                  lineHeight: 1.35,
                  color: TINTA,
                }}
              >
                {texto}
              </span>
            </div>
          ))}
        </div>

        {/* 3. Galería de capturas reales */}
        {galeria.length > 0 ? (
          <section style={{ marginTop: 18 }}>
            <h3 style={SUBTITULO_SECCION}>
              PROYECTOS Y ENTORNO REAL DE CLASES
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 9,
                marginTop: 8,
              }}
            >
              {galeria.map((imagen, indice) => (
                <figure
                  key={`captura-${indice}-${imagen.src}`}
                  style={{
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    border: `1px solid ${LINEA}`,
                    borderRadius: 8,
                    overflow: "hidden",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 6px 16px rgba(20, 21, 25, 0.06)",
                  }}
                >
                  <div
                    style={{
                      height: 20,
                      flex: "0 0 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "0 7px",
                      backgroundColor: "#1B1D23",
                      boxSizing: "border-box",
                    }}
                  >
                    <PuntoVentana color="#E0655B" />
                    <PuntoVentana color="#E3B341" />
                    <PuntoVentana color="#63B37A" />
                    <span
                      style={{
                        marginLeft: 5,
                        flex: 1,
                        minWidth: 0,
                        padding: "1px 6px",
                        borderRadius: 999,
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        backgroundColor: "rgba(255, 255, 255, 0.09)",
                        fontSize: 5.4,
                        lineHeight: 1.4,
                        letterSpacing: 0.35,
                        color: "rgba(255, 255, 255, 0.62)",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {tituloCorto(imagen.title)}
                    </span>
                  </div>
                  <img
                    src={imagen.src}
                    alt={imagen.title}
                    crossOrigin="anonymous"
                    style={{
                      width: "100%",
                      height: 118,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <figcaption
                    style={{
                      padding: "7px 9px 8px",
                      backgroundColor: "#FFFFFF",
                      borderTop: `1px solid ${LINEA}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 8,
                        lineHeight: 1.25,
                        fontWeight: 700,
                        color: TINTA,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {imagen.title}
                    </div>
                    <div
                      style={{
                        ...DOS_LINEAS,
                        marginTop: 2,
                        minHeight: 17,
                        fontSize: 6.8,
                        lineHeight: 1.3,
                        color: GRIS,
                      }}
                    >
                      {imagen.subtitle}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* 4. Vista previa del certificado */}
        <section style={{ marginTop: 18 }}>
          <h3 style={SUBTITULO_SECCION}>
            VISTA PREVIA DEL CERTIFICADO OFICIAL
          </h3>
          <div
            style={{
              position: "relative",
              marginTop: 8,
              height: 238,
              boxSizing: "border-box",
              padding: "14px 22px",
              borderRadius: 4,
              border: `6px double ${ORO}`,
              backgroundColor: "#FFFDF7",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Esquina style={{ top: 4, left: 4, borderTopWidth: 1, borderLeftWidth: 1 }} />
            <Esquina style={{ top: 4, right: 4, borderTopWidth: 1, borderRightWidth: 1 }} />
            <Esquina style={{ bottom: 4, left: 4, borderBottomWidth: 1, borderLeftWidth: 1 }} />
            <Esquina style={{ bottom: 4, right: 4, borderBottomWidth: 1, borderRightWidth: 1 }} />

            <img
              src={data.brandLogoUrl}
              alt="ProgramBI"
              crossOrigin="anonymous"
              style={{
                height: 26,
                width: "auto",
                maxWidth: 190,
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
            />

            <div
              style={{
                marginTop: 7,
                fontSize: 8,
                lineHeight: 1.2,
                letterSpacing: 3.2,
                fontWeight: 700,
                color: ORO_OSCURO,
                textTransform: "uppercase",
              }}
            >
              CERTIFICADO DE FINALIZACIÓN
            </div>

            <div
              style={{
                marginTop: 5,
                fontSize: 6.6,
                lineHeight: 1.3,
                color: GRIS,
              }}
            >
              Se otorga a
            </div>

            <div
              style={{
                ...DOS_LINEAS,
                marginTop: 3,
                maxWidth: 560,
                fontFamily: DISPLAY,
                fontSize: 17,
                lineHeight: 1.2,
                letterSpacing: -0.2,
                color: TINTA,
              }}
            >
              {data.title}
            </div>

            <div
              style={{
                marginTop: 5,
                fontSize: 7.2,
                lineHeight: 1.3,
                color: GRIS,
              }}
            >
              Otorgado con validación digital en programbi.com
            </div>

            <div style={{ marginTop: "auto", width: "100%", paddingTop: 8 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "end",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    justifySelf: "start",
                    fontSize: 7,
                    lineHeight: 1.4,
                    color: GRIS,
                    textAlign: "left",
                  }}
                >
                  Duración: {data.hours} horas académicas
                </div>

                <div
                  aria-hidden="true"
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    border: `1.5px double ${ORO}`,
                    backgroundColor: "#FFFDF7",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: ORO_OSCURO,
                  }}
                >
                  <span
                    style={{
                      fontSize: 5.6,
                      lineHeight: 1.2,
                      letterSpacing: 0.5,
                      fontWeight: 700,
                    }}
                  >
                    PROGRAMBI
                  </span>
                  <span
                    style={{
                      fontSize: 5.2,
                      lineHeight: 1.2,
                      letterSpacing: 0.4,
                    }}
                  >
                    CERTIFICADO
                  </span>
                </div>

                <div
                  style={{
                    justifySelf: "end",
                    width: 150,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 120,
                      borderTop: `1px solid ${ORO_OSCURO}`,
                      marginBottom: 4,
                    }}
                  />
                  <div
                    style={{
                      fontSize: 7.5,
                      lineHeight: 1.2,
                      fontWeight: 700,
                      color: TINTA,
                    }}
                  >
                    Manuel Oliva
                  </div>
                  <div
                    style={{
                      fontSize: 6.4,
                      lineHeight: 1.2,
                      color: GRIS,
                    }}
                  >
                    CEO &amp; Director Académico
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 6.2,
                  lineHeight: 1.2,
                  letterSpacing: 0.3,
                  color: TENUE,
                }}
              >
                {codigo}
              </div>
            </div>
          </div>
        </section>
      </div>
    </BrochureA4Sheet>
  );
}
