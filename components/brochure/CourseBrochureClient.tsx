"use client";

/**
 * Visor de documento del brochure v2 — «estudio oscuro».
 *
 * No es una landing: es un visor de PDF con hojas A4 reales renderizadas en
 * React, barra de documento fija, zoom (75 / 100 / 125 %), ajuste automático al
 * ancho disponible, índice lateral con miniaturas, modo «Visor PDF Nativo»
 * (iframe con blob generado en el navegador), descarga 1:1 e impresión A4.
 *
 * Reglas que no se pueden romper:
 * - Las hojas vienen de `components/brochure/pages/*` (otro workstream) y son
 *   794 × 1123 px. Aquí solo se envuelven, escalan y enumeran.
 * - El escalado se hace con `transform: scale()`, que no afecta el layout, así
 *   que el contenedor `.brochure-sheet-slot` reserva la altura ya escalada y
 *   la impresión la neutraliza (`height: auto`, `transform: none`).
 * - Las hojas se mantienen montadas incluso en modo nativo (fuera de pantalla)
 *   porque `generateCoursePdf` las captura desde `sheetsRef`.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  FileText,
  MessageCircle,
  Minus,
  Plus,
  Printer,
} from "lucide-react";

import { BrochureCoverSheet } from "@/components/brochure/pages/BrochureCoverSheet";
import { BrochurePricingScheduleSheet } from "@/components/brochure/pages/BrochurePricingScheduleSheet";
import { BrochureShowcaseSheet } from "@/components/brochure/pages/BrochureShowcaseSheet";
import { BrochureFacultySheet } from "@/components/brochure/pages/BrochureFacultySheet";
import { BrochureSyllabusSheets } from "@/components/brochure/pages/BrochureSyllabusSheets";
import { brochureTotalPages } from "@/lib/brochure/brochure-pages";
import { generateCoursePdf } from "@/lib/brochure/generate-course-pdf";
import { brochurePdfFileName } from "@/lib/brochure/brochure-assets";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import { COUNTRIES } from "@/lib/context/CountryContext";
import { esIsoPais } from "@/config/paises";
import { courseBrochureUrl } from "@/lib/pricing-gate";

/* ── Constantes del visor ─────────────────────────────────────────────────── */

const ZOOMS = [0.75, 1, 1.25] as const;
type Zoom = (typeof ZOOMS)[number];
type Modo = "hojas" | "nativo";

/** Tamaño A4 a 96 dpi, el mismo que usan las hojas y el generador de PDF. */
const HOJA_ANCHO = 794;
const HOJA_ALTO = 1123;
const GAP_HOJAS = 26;
/** Alto de la barra fija; el índice se pega justo debajo. */
const TOP_BARRA = 60;

const PAISES_DISPONIBLES = COUNTRIES.filter((pais) => esIsoPais(pais.iso));

/** Forma del progreso que entrega `generateCoursePdf`. */
type PdfProgress = { label: string; current: number; total: number };

const ESTILO_ZOOM_BOTON: CSSProperties = {
  width: 26,
  height: 26,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: 6,
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
  padding: 0,
};

const ESTILO_BOTON_BARRA: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 32,
  borderRadius: 8,
  fontSize: 11.5,
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

/**
 * Visor del brochure: barra de documento, zoom, índice, hojas A4 y visor PDF.
 * Recibe los datos ya resueltos por país desde el servidor.
 */
export function CourseBrochureClient({ data }: { data: CourseBrochureData }) {
  const router = useRouter();

  const [zoom, setZoom] = useState<Zoom>(1);
  const [modo, setModo] = useState<Modo>("hojas");
  const [generando, setGenerando] = useState(false);
  const [progreso, setProgreso] = useState("");
  const [avance, setAvance] = useState<{ current: number; total: number } | null>(
    null
  );
  const [errorPdf, setErrorPdf] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfListo, setPdfListo] = useState(false);
  const [fit, setFit] = useState(1);
  const [indiceActivo, setIndiceActivo] = useState(1);

  const sheetsRef = useRef<HTMLDivElement>(null);
  const pdfUrlRef = useRef<string | null>(null);

  const totalPages = useMemo(() => brochureTotalPages(data), [data]);
  const nombreArchivo = useMemo(() => brochurePdfFileName(data), [data]);

  /* ── Ajuste al ancho disponible ─────────────────────────────────────────── */

  useEffect(() => {
    const medir = () => {
      const ancho = window.innerWidth;
      const reservado = ancho >= 1280 ? 300 : 40;
      setFit(Math.min(1, (ancho - reservado) / HOJA_ANCHO));
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  /* ── Blob del PDF nativo ────────────────────────────────────────────────── */

  useEffect(() => {
    pdfUrlRef.current = pdfUrl;
  }, [pdfUrl]);

  useEffect(
    () => () => {
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    },
    []
  );

  /* ── Generación del PDF ─────────────────────────────────────────────────── */

  const generar = useCallback(
    async (paraIframe = false) => {
      if (generando) return;
      setGenerando(true);
      setErrorPdf(null);
      setAvance(null);
      setProgreso("");
      try {
        if (paraIframe) {
          const url = await generateCoursePdf(data, {
            sheetContainer: sheetsRef.current,
            returnBlobUrl: true,
            onProgress: (p: PdfProgress) => {
              setProgreso(p.label);
              setAvance({ current: p.current, total: p.total });
            },
          });
          if (typeof url === "string") {
            if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
            pdfUrlRef.current = url;
            setPdfUrl(url);
            setPdfListo(true);
            setModo("nativo");
          }
        } else {
          await generateCoursePdf(data, {
            sheetContainer: sheetsRef.current,
            onProgress: (p: PdfProgress) => {
              setProgreso(`${p.label} (${p.current}/${p.total})`);
              setAvance({ current: p.current, total: p.total });
            },
          });
          setPdfListo(true);
        }
      } catch {
        setErrorPdf(
          "No pudimos generar el PDF en este navegador. Usa «Imprimir» y elige «Guardar como PDF»."
        );
      } finally {
        setGenerando(false);
        setProgreso("");
        setAvance(null);
      }
    },
    [data, generando]
  );

  const cambiarModo = (siguiente: Modo) => {
    setModo(siguiente);
    if (siguiente === "nativo" && !pdfUrl && !generando) void generar(true);
  };

  const imprimir = () => {
    if (typeof window !== "undefined") window.print();
  };

  const irAPagina = (pagina: number) => {
    if (typeof document === "undefined") return;
    const nodo = document.getElementById(`brochure-page-${pagina}`);
    nodo?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIndiceActivo(Math.min(5, Math.max(1, pagina)));
  };

  /* ── Navegación lateral ─────────────────────────────────────────────────── */

  const navegacion = useMemo(
    () => [
      { pagina: 1, etiqueta: "1 · Portada y Resumen" },
      { pagina: 2, etiqueta: `2 · Precios (${data.moneda}) y Horarios` },
      { pagina: 3, etiqueta: "3 · Proyectos y Certificado" },
      { pagina: 4, etiqueta: "4 · Equipo Docente y Empresas" },
      {
        pagina: 5,
        etiqueta:
          totalPages > 5
            ? `5–${totalPages} · Temario Módulo a Módulo`
            : "5 · Temario Módulo a Módulo",
      },
    ],
    [data.moneda, totalPages]
  );

  const miniaturas = useMemo(
    () => [
      { pagina: 1, etiqueta: "Portada y resumen" },
      { pagina: 2, etiqueta: `Precios en ${data.moneda}` },
      { pagina: 3, etiqueta: "Proyectos y certificado" },
      { pagina: 4, etiqueta: "Equipo docente" },
      { pagina: 5, etiqueta: "Temario del programa" },
    ],
    [data.moneda]
  );

  /* ── Geometría del stack de hojas ───────────────────────────────────────── */

  const escala = zoom * fit;
  const altoStack = useMemo(
    () =>
      (HOJA_ALTO * totalPages + GAP_HOJAS * Math.max(0, totalPages - 1)) * escala,
    [escala, totalPages]
  );

  const envolverHoja = (pagina: number, contenido: ReactNode, ultima: boolean) => (
    <div
      key={pagina}
      id={`brochure-page-${pagina}`}
      className="brochure-page-wrap"
      style={{
        position: "relative",
        marginBottom: ultima ? 0 : GAP_HOJAS,
        scrollMarginTop: TOP_BARRA + 16,
      }}
    >
      <span className="brochure-page-label" aria-hidden="true" style={{
        position: "absolute",
        left: -46,
        top: 5,
        fontSize: 9,
        lineHeight: 1,
        color: "rgba(255,255,255,.35)",
        fontVariantNumeric: "tabular-nums",
        userSelect: "none",
      }}>
        Página {pagina}
      </span>
      {contenido}
    </div>
  );

  const porcentaje = avance
    ? Math.max(4, Math.min(100, Math.round((avance.current / Math.max(1, avance.total)) * 100)))
    : 6;

  return (
    <>
      <style>{`
        .brochure-sidebar { display: none; }
        @media (min-width: 1280px) {
          .brochure-sidebar { display: flex !important; flex-direction: column; }
        }
        .brochure-nav-item:hover { background: rgba(255,255,255,.06); }
        .brochure-thumb:hover { border-color: rgba(255,255,255,.34) !important; }
        .brochure-zoom-btn:hover:enabled { background: rgba(255,255,255,.08); }
        .brochure-secundario:hover { border-color: rgba(255,255,255,.4) !important; }
        .brochure-cta:hover { filter: brightness(1.08); }

        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body { background: #FAF9F5 !important; margin: 0 !important; padding: 0 !important;
            -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .brochure-no-print { display: none !important; }
          [data-brochure-studio] { display: block !important; background: #fff !important; padding: 0 !important; }
          .brochure-canvas { padding: 0 !important; gap: 0 !important; display: block !important; }
          .brochure-scaler { transform: none !important; width: auto !important; height: auto !important; margin-left: 0 !important; }
          .brochure-sheet-slot { height: auto !important; overflow: visible !important; }
          .brochure-sheets { position: static !important; left: auto !important; top: auto !important;
            width: auto !important; opacity: 1 !important; pointer-events: auto !important; }
          .brochure-page-wrap { margin: 0 !important; }
          .brochure-page-label { display: none !important; }
          [data-brochure-sheet] {
            width: 210mm !important; height: 297mm !important; margin: 0 !important;
            box-shadow: none !important; border: none !important; border-radius: 0 !important;
            page-break-after: always !important; break-after: page !important;
          }
        }
      `}</style>

      <div
        data-brochure-studio="v2"
        style={{
          background: "#181A20",
          color: "#fff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Barra del documento ─────────────────────────────────────────── */}
        <header
          className="brochure-no-print"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(17,19,24,.95)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(255,255,255,.08)",
            color: "#fff",
            padding: "10px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {/* Identidad del archivo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                minWidth: 0,
                marginRight: "auto",
              }}
            >
              <img
                src={data.brandLogoNavUrl}
                alt="ProgramBI"
                crossOrigin="anonymous"
                style={{ height: 22, width: "auto", display: "block" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    letterSpacing: "-.01em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 280,
                  }}
                >
                  {nombreArchivo}
                </span>
                <span
                  style={{
                    fontSize: 8.5,
                    color: "rgba(255,255,255,.55)",
                    letterSpacing: ".02em",
                  }}
                >
                  {totalPages} páginas A4 · Vista previa 1:1
                </span>
              </div>
            </div>

            {/* Zoom */}
            <div
              role="group"
              aria-label="Zoom del documento"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                background: "rgba(255,255,255,.06)",
                borderRadius: 8,
                padding: 2,
              }}
            >
              <button
                type="button"
                className="brochure-zoom-btn"
                aria-label="Reducir zoom"
                title="Reducir zoom"
                onClick={() => setZoom(ZOOMS[Math.max(0, ZOOMS.indexOf(zoom) - 1)])}
                disabled={zoom === ZOOMS[0]}
                style={{
                  ...ESTILO_ZOOM_BOTON,
                  opacity: zoom === ZOOMS[0] ? 0.35 : 1,
                  cursor: zoom === ZOOMS[0] ? "default" : "pointer",
                }}
              >
                <Minus size={12} strokeWidth={2.4} />
              </button>
              <button
                type="button"
                className="brochure-zoom-btn"
                aria-label="Restablecer zoom al 100%"
                title="Restablecer zoom al 100%"
                onClick={() => setZoom(1)}
                style={{
                  minWidth: 42,
                  height: 26,
                  border: "none",
                  borderRadius: 6,
                  background: "transparent",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                className="brochure-zoom-btn"
                aria-label="Aumentar zoom"
                title="Aumentar zoom"
                onClick={() =>
                  setZoom(ZOOMS[Math.min(ZOOMS.length - 1, ZOOMS.indexOf(zoom) + 1)])
                }
                disabled={zoom === ZOOMS[ZOOMS.length - 1]}
                style={{
                  ...ESTILO_ZOOM_BOTON,
                  opacity: zoom === ZOOMS[ZOOMS.length - 1] ? 0.35 : 1,
                  cursor: zoom === ZOOMS[ZOOMS.length - 1] ? "default" : "pointer",
                }}
              >
                <Plus size={12} strokeWidth={2.4} />
              </button>
            </div>

            {/* Modo de vista */}
            <div
              role="group"
              aria-label="Modo de visualización"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                background: "rgba(255,255,255,.06)",
                borderRadius: 8,
                padding: 2,
              }}
            >
              <button
                type="button"
                aria-label="Vista Hojas A4"
                aria-pressed={modo === "hojas"}
                onClick={() => cambiarModo("hojas")}
                style={{
                  height: 26,
                  padding: "0 10px",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 10.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: modo === "hojas" ? "#fff" : "transparent",
                  color: modo === "hojas" ? "#111318" : "rgba(255,255,255,.7)",
                }}
              >
                Vista Hojas A4
              </button>
              <button
                type="button"
                aria-label="Visor PDF Nativo"
                aria-pressed={modo === "nativo"}
                title={
                  pdfListo
                    ? "PDF ya generado en esta sesión"
                    : "Genera el PDF y lo abre en el visor del navegador"
                }
                onClick={() => cambiarModo("nativo")}
                style={{
                  height: 26,
                  padding: "0 10px",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 10.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: modo === "nativo" ? "#fff" : "transparent",
                  color: modo === "nativo" ? "#111318" : "rgba(255,255,255,.7)",
                }}
              >
                Visor PDF Nativo
              </button>
            </div>

            {/* País */}
            <select
              aria-label="País del brochure"
              title="Cambiar país del brochure"
              value={data.pais}
              onChange={(event) =>
                router.push(courseBrochureUrl(data.slug, event.target.value))
              }
              style={{
                height: 32,
                background: "rgba(255,255,255,.06)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.14)",
                borderRadius: 8,
                padding: "0 8px",
                fontSize: 11.5,
                fontWeight: 500,
                cursor: "pointer",
                outline: "none",
              }}
            >
              {PAISES_DISPONIBLES.map((pais) => (
                <option
                  key={pais.iso}
                  value={pais.iso}
                  style={{ background: "#111318", color: "#fff" }}
                >
                  {pais.name} · {pais.currency.code}
                </option>
              ))}
            </select>

            {/* Acciones */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => void generar(false)}
                disabled={generando}
                style={{
                  ...ESTILO_BOTON_BARRA,
                  padding: "0 14px",
                  border: "none",
                  background: "#fff",
                  color: "#111318",
                  cursor: generando ? "wait" : "pointer",
                  opacity: generando ? 0.72 : 1,
                }}
              >
                <Download size={12} strokeWidth={2.4} />
                {generando
                  ? avance && avance.total > 0
                    ? `Generando pág. ${avance.current}/${avance.total}…`
                    : "Generando…"
                  : "Descargar PDF"}
              </button>

              <button
                type="button"
                className="brochure-secundario"
                onClick={imprimir}
                style={{
                  ...ESTILO_BOTON_BARRA,
                  padding: "0 12px",
                  border: "1px solid rgba(255,255,255,.22)",
                  background: "transparent",
                  color: "#fff",
                }}
              >
                <Printer size={12} strokeWidth={2.2} />
                Imprimir
              </button>

              <a
                href={data.inscripcionUrl}
                className="brochure-cta"
                style={{
                  ...ESTILO_BOTON_BARRA,
                  padding: "0 14px",
                  textDecoration: "none",
                  background: data.accentColor,
                  color: "#fff",
                }}
              >
                Inscribirme Ahora
              </a>

              {data.whatsappUrl ? (
                <a
                  href={data.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Escribir por WhatsApp"
                  title="Escribir por WhatsApp"
                  className="brochure-secundario"
                  style={{
                    width: 32,
                    height: 32,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,.22)",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  <MessageCircle size={14} strokeWidth={2.1} />
                </a>
              ) : null}
            </div>
          </div>

          {/* Progreso de generación */}
          {generando ? (
            <div style={{ margin: "8px -18px 0" }}>
              <div style={{ height: 2, background: "rgba(255,255,255,.1)" }}>
                <div
                  style={{
                    height: 2,
                    width: `${porcentaje}%`,
                    background: data.accentColor,
                    transition: "width .2s ease",
                  }}
                />
              </div>
              <div
                aria-live="polite"
                style={{
                  padding: "5px 18px 0",
                  fontSize: 9.5,
                  color: "rgba(255,255,255,.6)",
                  lineHeight: 1.3,
                }}
              >
                {progreso || "Preparando el PDF…"}
              </div>
            </div>
          ) : null}

          {errorPdf ? (
            <div
              role="alert"
              style={{
                marginTop: 8,
                padding: "7px 10px",
                borderRadius: 8,
                border: "1px solid rgba(248,113,113,.35)",
                background: "rgba(248,113,113,.1)",
                color: "#FCA5A5",
                fontSize: 10.5,
                lineHeight: 1.45,
              }}
            >
              {errorPdf}
            </div>
          ) : null}
        </header>

        <div style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
          {/* ── Índice lateral ─────────────────────────────────────────────── */}
          <aside
            className="brochure-no-print brochure-sidebar"
            aria-label="Índice del documento"
            style={{
              position: "sticky",
              top: TOP_BARRA,
              alignSelf: "flex-start",
              flex: "0 0 220px",
              width: 220,
              padding: "18px 14px",
              height: `calc(100vh - ${TOP_BARRA}px)`,
              overflowY: "auto",
              borderRight: "1px solid rgba(255,255,255,.07)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 8,
                letterSpacing: 1.6,
                fontWeight: 600,
                color: "rgba(255,255,255,.45)",
              }}
            >
              ÍNDICE DEL DOCUMENTO
            </p>

            <nav
              aria-label="Secciones del brochure"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                marginTop: 10,
              }}
            >
              {navegacion.map((item) => {
                const activo = indiceActivo === item.pagina;
                return (
                  <button
                    key={item.pagina}
                    type="button"
                    className="brochure-nav-item"
                    onClick={() => irAPagina(item.pagina)}
                    aria-current={activo ? "true" : undefined}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      borderRadius: 7,
                      fontSize: 10.5,
                      lineHeight: 1.35,
                      cursor: "pointer",
                      border: "none",
                      borderLeft: `2px solid ${
                        activo ? data.accentColor : "transparent"
                      }`,
                      background: activo ? "rgba(255,255,255,.1)" : "transparent",
                      color: activo ? "#fff" : "rgba(255,255,255,.72)",
                      fontWeight: activo ? 600 : 500,
                    }}
                  >
                    {item.etiqueta}
                  </button>
                );
              })}
            </nav>

            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,.08)",
                margin: "14px 0 12px",
              }}
            />

            <p
              style={{
                margin: "0 0 8px",
                fontSize: 8,
                letterSpacing: 1.4,
                fontWeight: 600,
                color: "rgba(255,255,255,.35)",
              }}
            >
              MINIATURAS
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {miniaturas.map((miniatura) => (
                <button
                  key={miniatura.pagina}
                  type="button"
                  className="brochure-thumb"
                  onClick={() => irAPagina(miniatura.pagina)}
                  title={`Ir a la página ${miniatura.pagina} · ${miniatura.etiqueta}`}
                  aria-label={`Ir a la página ${miniatura.pagina}: ${miniatura.etiqueta}`}
                  style={{
                    width: 120,
                    height: 170,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: 8,
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,.12)",
                    background: "#20232B",
                    color: "rgba(255,255,255,.7)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      fontSize: 8,
                      letterSpacing: 1.2,
                      fontWeight: 600,
                      color: "rgba(255,255,255,.35)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {String(miniatura.pagina).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 9.5, lineHeight: 1.3 }}>
                    {miniatura.etiqueta}
                  </span>
                </button>
              ))}
            </div>

            <p
              style={{
                marginTop: "auto",
                paddingTop: 18,
                fontSize: 8,
                lineHeight: 1.6,
                color: "rgba(255,255,255,.35)",
              }}
            >
              ProgramBI · {data.paisNombre}
            </p>
          </aside>

          {/* ── Lienzo del documento ──────────────────────────────────────── */}
          <main
            className="brochure-canvas"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "26px 18px 60px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 26,
            }}
          >
            <div
              ref={sheetsRef}
              className="brochure-sheets"
              aria-hidden={modo === "nativo" ? "true" : undefined}
              style={
                modo === "hojas"
                  ? { width: "100%" }
                  : {
                      position: "absolute",
                      left: -100000,
                      top: 0,
                      width: HOJA_ANCHO,
                      opacity: 0,
                      pointerEvents: "none",
                    }
              }
            >
              <div
                className="brochure-sheet-slot"
                style={{ width: "100%", height: altoStack, overflow: "hidden" }}
              >
                <div
                  className="brochure-scaler"
                  style={{
                    width: HOJA_ANCHO,
                    marginLeft: `calc(50% - ${HOJA_ANCHO / 2}px)`,
                    transform: `scale(${escala})`,
                    transformOrigin: "top center",
                    transition: "transform .15s ease",
                  }}
                >
                  {envolverHoja(
                    1,
                    <BrochureCoverSheet
                      data={data}
                      pageNumber={1}
                      totalPages={totalPages}
                    />,
                    totalPages === 1
                  )}
                  {envolverHoja(
                    2,
                    <BrochurePricingScheduleSheet
                      data={data}
                      pageNumber={2}
                      totalPages={totalPages}
                    />,
                    totalPages === 2
                  )}
                  {envolverHoja(
                    3,
                    <BrochureShowcaseSheet
                      data={data}
                      pageNumber={3}
                      totalPages={totalPages}
                    />,
                    totalPages === 3
                  )}
                  {envolverHoja(
                    4,
                    <BrochureFacultySheet
                      data={data}
                      pageNumber={4}
                      totalPages={totalPages}
                    />,
                    totalPages === 4
                  )}
                  {envolverHoja(
                    5,
                    <BrochureSyllabusSheets
                      data={data}
                      startPage={5}
                      totalPages={totalPages}
                    />,
                    true
                  )}
                </div>
              </div>
            </div>

            {/* Visor PDF nativo */}
            {modo === "nativo" ? (
              <div
                className="brochure-no-print"
                style={{ width: "100%", alignSelf: "stretch" }}
              >
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    title="Vista PDF nativa"
                    style={{
                      width: "100%",
                      height: "calc(100vh - 64px)",
                      border: 0,
                      background: "#fff",
                      borderRadius: 6,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                      minHeight: "52vh",
                      padding: "32px 24px",
                      border: "1px dashed rgba(255,255,255,.14)",
                      borderRadius: 10,
                      textAlign: "center",
                    }}
                  >
                    <FileText size={22} color="rgba(255,255,255,.4)" />
                    <p
                      style={{
                        margin: 0,
                        maxWidth: 380,
                        fontSize: 11.5,
                        lineHeight: 1.55,
                        color: "rgba(255,255,255,.65)",
                      }}
                    >
                      El visor nativo abre el mismo PDF que descargas, generado
                      una vez por sesión. Tarda unos segundos según la cantidad
                      de hojas.
                    </p>
                    <button
                      type="button"
                      onClick={() => void generar(true)}
                      disabled={generando}
                      style={{
                        ...ESTILO_BOTON_BARRA,
                        padding: "0 16px",
                        border: "none",
                        background: "#fff",
                        color: "#111318",
                        cursor: generando ? "wait" : "pointer",
                        opacity: generando ? 0.72 : 1,
                      }}
                    >
                      {generando ? "Generando…" : "Generar vista PDF"}
                    </button>
                    {generando && progreso ? (
                      <p
                        aria-live="polite"
                        style={{
                          margin: 0,
                          fontSize: 10,
                          color: "rgba(255,255,255,.5)",
                        }}
                      >
                        {progreso}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </>
  );
}
