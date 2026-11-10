"use client";

/**
 * Visor del documento «Temario y precios» — estudio claro común a todos los
 * cursos.
 *
 * No es una landing: es un visor con hojas A4 reales renderizadas en React,
 * barra de documento fija, zoom (75 / 100 / 125 %), ajuste automático al ancho,
 * índice lateral con miniaturas, descarga 1:1 e impresión A4.
 *
 * Reglas que no se pueden romper:
 * - Las hojas vienen de `components/brochure/pages/*` (otro workstream) y son
 *   794 × 1123 px. Aquí solo se envuelven, escalan y enumeran.
 * - El orden editorial es fijo: 1 Portada, 2 Inversión, 3 Calendario,
 *   4 Proyectos/Certificado, 5 Equipo Docente y 6..N Temario. El total de
 *   páginas sale siempre de `brochureTotalPages(data)`, nunca hardcodeado.
 * - El escalado se hace con `transform: scale()`, que no afecta el layout, así
 *   que el contenedor `.brochure-sheet-slot` reserva la altura ya escalada y
 *   la impresión la neutraliza (`height: auto`, `transform: none`).
 * - Las hojas se mantienen montadas porque `generateCoursePdf` las captura
 *   desde `sheetsRef`.
 * - El tema es claro y único para todos los cursos: papel blanco sobre canvas
 *   `T.canvas`. Del curso solo se usa el acento en detalles puntuales.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
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
import { BrochureScheduleSheet } from "@/components/brochure/pages/BrochureScheduleSheet";
import { BrochureShowcaseSheet } from "@/components/brochure/pages/BrochureShowcaseSheet";
import { BrochureFacultySheet } from "@/components/brochure/pages/BrochureFacultySheet";
import { BrochureSyllabusSheets } from "@/components/brochure/pages/BrochureSyllabusSheets";
import { brochureTotalPages } from "@/lib/brochure/brochure-pages";
import { generateCoursePdf } from "@/lib/brochure/generate-course-pdf";
import { brochurePdfFileName } from "@/lib/brochure/brochure-assets";
import type { CourseBrochureData } from "@/lib/brochure/brochure-data";
import { FONT_SANS, SHADOW_SHEET, T } from "@/lib/brochure/brochure-theme";
import { trackTemario } from "@/lib/analytics/marketing";

/* ── Constantes del visor ─────────────────────────────────────────────────── */

const ZOOMS = [0.75, 1, 1.25] as const;
type Zoom = (typeof ZOOMS)[number];

/** Tamaño A4 a 96 dpi, el mismo que usan las hojas y el generador de PDF. */
const HOJA_ANCHO = 794;
const HOJA_ALTO = 1123;
const GAP_HOJAS = 26;
/** Alto de la barra fija; el índice se pega justo debajo. */
const TOP_BARRA = 60;

/** Forma del progreso que entrega `generateCoursePdf`. */
type PdfProgress = { label: string; current: number; total: number };

/**
 * Temarios ya contados como vista en esta pestaña (curso + país).
 * Mismo criterio que `trackEventOnce`: el módulo vive lo que vive la pestaña,
 * así un remontaje del visor (o el doble efecto de StrictMode) no duplica
 * `view_temario`.
 */
const temariosVistos = new Set<string>();

const ESTILO_ZOOM_BOTON: CSSProperties = {
  width: 26,
  height: 26,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  borderRadius: 6,
  background: "transparent",
  color: T.ink,
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

/* ── Contraste del acento ─────────────────────────────────────────────────── */

/** Luminancia relativa WCAG de un color hex de seis dígitos. */
function luminancia(hex: string): number {
  const limpio = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(limpio)) return 1;
  const canales = [0, 2, 4].map((inicio) => {
    const valor = parseInt(limpio.slice(inicio, inicio + 2), 16) / 255;
    return valor <= 0.03928
      ? valor / 12.92
      : Math.pow((valor + 0.055) / 1.055, 2.4);
  });
  return (
    0.2126 * (canales[0] ?? 0) +
    0.7152 * (canales[1] ?? 0) +
    0.0722 * (canales[2] ?? 0)
  );
}

/** Acento del curso validado para filetes y numeración (nunca texto sobre él). */
function acentoDe(hex: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(hex.trim()) ? hex : T.brand;
}

/**
 * Fondo del CTA principal: el acento del curso solo si el texto blanco llega a
 * 4.5:1 (WCAG AA); si no (amarillos y verdes claros), el azul de marca.
 */
function fondoAcento(hex: string): string {
  const contraste = 1.05 / (luminancia(hex) + 0.05);
  return contraste >= 4.5 ? acentoDe(hex) : T.brand;
}

/**
 * Visor del temario: barra de documento, zoom, índice y hojas A4.
 * Recibe los datos ya resueltos por país desde el servidor.
 */
export function CourseBrochureClient({ data }: { data: CourseBrochureData }) {
  const [zoom, setZoom] = useState<Zoom>(1);
  const [generando, setGenerando] = useState(false);
  const [progreso, setProgreso] = useState("");
  const [avance, setAvance] = useState<{ current: number; total: number } | null>(
    null
  );
  const [errorPdf, setErrorPdf] = useState<string | null>(null);
  const [fit, setFit] = useState(1);
  const [indiceActivo, setIndiceActivo] = useState(1);

  const sheetsRef = useRef<HTMLDivElement>(null);

  const totalPages = useMemo(() => brochureTotalPages(data), [data]);
  const nombreArchivo = useMemo(() => brochurePdfFileName(data), [data]);
  const acentoCurso = useMemo(
    () => acentoDe(data.accentColor),
    [data.accentColor]
  );
  const acentoFondo = useMemo(
    () => fondoAcento(data.accentColor),
    [data.accentColor]
  );
  /**
   * Hojas A4 que el temario monta realmente. `totalPages` manda en los pies y
   * en el índice; esto solo reserva alto de lienzo por si el plan crece.
   */
  const [hojasMedidas, setHojasMedidas] = useState(totalPages);

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

  /* ── Hojas realmente montadas ───────────────────────────────────────────── */

  // `totalPages` sale de `brochureTotalPages(data)`. Se cuenta lo que el
  // temario monta para reservar el alto exacto del lienzo: si el plan crece,
  // la última hoja nunca queda recortada por el `overflow: hidden` del slot.
  useEffect(() => {
    const nodo = sheetsRef.current;
    if (!nodo) return;
    const total = nodo.querySelectorAll("[data-brochure-sheet]").length;
    if (total > 0) setHojasMedidas(total);
  }, [data, totalPages]);

  /* ── Medición ───────────────────────────────────────────────────────────── */

  // Vista del temario en el visor: una por curso y país en la pestaña.
  useEffect(() => {
    const clave = `${data.slug}:${data.pais}`;
    if (temariosVistos.has(clave)) return;
    temariosVistos.add(clave);
    trackTemario({
      action: "view",
      method: "visor",
      location: "visor_pdf",
      course: data.slug,
      country: data.pais,
    });
  }, [data.slug, data.pais]);

  /* ── Generación del PDF ─────────────────────────────────────────────────── */

  const generar = useCallback(async () => {
    if (generando) return;
    setGenerando(true);
    setErrorPdf(null);
    setAvance(null);
    setProgreso("");
    try {
      await generateCoursePdf(data, {
        sheetContainer: sheetsRef.current,
        onProgress: (p: PdfProgress) => {
          setProgreso(`${p.label} (${p.current}/${p.total})`);
          setAvance({ current: p.current, total: p.total });
        },
      });
      // Se cuenta solo cuando el PDF salió: un fallo ya se avisa en `errorPdf`.
      trackTemario({
        action: "download",
        method: "pdf",
        location: "visor_pdf",
        course: data.slug,
        country: data.pais,
      });
    } catch {
      setErrorPdf(
        "No pudimos generar el PDF en este navegador. Usa «Imprimir» y elige «Guardar como PDF»."
      );
    } finally {
      setGenerando(false);
      setProgreso("");
      setAvance(null);
    }
  }, [data, generando]);

  const imprimir = () => {
    // Se mide antes de `print()`: el diálogo del navegador bloquea el hilo.
    trackTemario({
      action: "download",
      method: "print",
      location: "visor_pdf",
      course: data.slug,
      country: data.pais,
    });
    if (typeof window !== "undefined") window.print();
  };

  const irAPagina = (pagina: number) => {
    if (typeof document === "undefined") return;
    const nodo = document.getElementById(`brochure-page-${pagina}`);
    nodo?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIndiceActivo(Math.min(totalPages, Math.max(1, pagina)));
  };

  /* ── Navegación lateral ─────────────────────────────────────────────────── */

  const navegacion = useMemo(
    () => [
      { pagina: 1, etiqueta: "1 · Portada y Resumen" },
      { pagina: 2, etiqueta: `2 · Inversión en ${data.moneda}` },
      { pagina: 3, etiqueta: "3 · Fechas y Horarios" },
      { pagina: 4, etiqueta: "4 · Proyectos y Certificado" },
      { pagina: 5, etiqueta: "5 · Equipo Docente y Empresas" },
      {
        pagina: 6,
        etiqueta:
          totalPages > 6
            ? `6–${totalPages} · Temario Módulo a Módulo`
            : "6 · Temario Módulo a Módulo",
      },
    ],
    [data.moneda, totalPages]
  );

  const miniaturas = useMemo(
    () => [
      { pagina: 1, etiqueta: "Portada y resumen" },
      { pagina: 2, etiqueta: `Inversión en ${data.moneda}` },
      { pagina: 3, etiqueta: "Fechas y horarios" },
      { pagina: 4, etiqueta: "Proyectos y certificado" },
      { pagina: 5, etiqueta: "Equipo docente" },
      { pagina: 6, etiqueta: "Temario del programa" },
    ],
    [data.moneda]
  );

  /* ── Geometría del stack de hojas ───────────────────────────────────────── */

  const escala = zoom * fit;
  /** Hojas que ocupan el lienzo: las del plan o las que montó el temario. */
  const hojasEnLienzo = Math.max(totalPages, hojasMedidas);
  const altoStack = useMemo(
    () =>
      (HOJA_ALTO * hojasEnLienzo + GAP_HOJAS * Math.max(0, hojasEnLienzo - 1)) *
      escala,
    [escala, hojasEnLienzo]
  );

  const envolverHoja = (pagina: number, contenido: ReactNode, ultima: boolean) => (
    <div
      key={pagina}
      data-brochure-wrap={pagina}
      className="brochure-page-wrap"
      style={{
        position: "relative",
        marginBottom: ultima ? 0 : GAP_HOJAS,
      }}
    >
      <span className="brochure-page-label" aria-hidden="true" style={{
        position: "absolute",
        left: -46,
        top: 5,
        fontSize: 9,
        lineHeight: 1,
        color: T.mute,
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
        .brochure-nav-item:hover { background: ${T.wash} !important; }
        .brochure-nav-item[aria-current="true"]:hover { background: ${T.brandSoft} !important; }
        .brochure-thumb:hover {
          border-color: #C9C4B8 !important;
          box-shadow: 0 8px 20px rgba(20,22,27,.12) !important;
        }
        .brochure-zoom-btn:hover:enabled { background: ${T.wash} !important; }
        .brochure-secundario:hover { border-color: ${T.mute} !important; background: ${T.wash} !important; }
        .brochure-cta:hover { filter: brightness(1.06); }

        /* Las hojas descansan sobre el canvas claro con la sombra del sistema.
           Si la hoja A4 ya trae la suya inline, esta regla no la pisa. */
        .brochure-canvas .brochure-a4-sheet { box-shadow: ${SHADOW_SHEET}; }

        /* El temario monta varias hojas dentro de un mismo envoltorio: se les
           da el mismo aire que entre hojas fijas. El ancla de scroll vive en
           cada hoja A4 (los envoltorios ya no duplican el id). */
        .brochure-page-wrap > .brochure-a4-sheet + .brochure-a4-sheet {
          margin-top: ${GAP_HOJAS}px;
        }
        [data-brochure-sheet] { scroll-margin-top: ${TOP_BARRA + 16}px; }

        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body { background: #FFFFFF !important; margin: 0 !important; padding: 0 !important;
            -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .brochure-no-print { display: none !important; }
          [data-brochure-studio] { display: block !important; background: #fff !important; padding: 0 !important; }
          .brochure-canvas { padding: 0 !important; gap: 0 !important; display: block !important; background: #fff !important; }
          .brochure-scaler { transform: none !important; width: auto !important; height: auto !important; margin-left: 0 !important; }
          .brochure-sheet-slot { height: auto !important; overflow: visible !important; }
          .brochure-sheets { position: static !important; left: auto !important; top: auto !important;
            width: auto !important; opacity: 1 !important; pointer-events: auto !important; }
          .brochure-page-wrap { margin: 0 !important; }
          .brochure-page-wrap > .brochure-a4-sheet + .brochure-a4-sheet { margin-top: 0 !important; }
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
          background: T.canvas,
          color: T.ink,
          fontFamily: FONT_SANS,
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
            background: "rgba(255,255,255,.92)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderBottom: `1px solid ${T.line}`,
            color: T.ink,
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
                    fontSize: 8,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    color: T.mute,
                    whiteSpace: "nowrap",
                  }}
                >
                  TEMARIO Y PRECIOS · {totalPages} PÁGINAS A4
                </span>
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    letterSpacing: "-.01em",
                    color: T.ink,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 280,
                  }}
                >
                  {nombreArchivo}
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
                background: T.wash,
                border: `1px solid ${T.line}`,
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
                  color: T.ink,
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

            {/* Edición fija: cada ruta muestra solo su país */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 32,
                padding: "0 11px",
                borderRadius: 8,
                border: `1px solid ${T.line}`,
                background: T.paper,
                color: T.inkSoft,
                fontSize: 11.5,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Edición {data.paisNombre} · {data.moneda}
            </span>

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
                onClick={() => void generar()}
                disabled={generando}
                style={{
                  ...ESTILO_BOTON_BARRA,
                  padding: "0 14px",
                  border: "none",
                  background: T.ink,
                  color: "#fff",
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
                  border: `1px solid ${T.line}`,
                  background: T.paper,
                  color: T.ink,
                }}
              >
                <Printer size={12} strokeWidth={2.2} />
                Imprimir
              </button>

              {data.customPdfUrl ? (
                <a
                  href={data.customPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brochure-secundario"
                  style={{
                    ...ESTILO_BOTON_BARRA,
                    padding: "0 12px",
                    border: `1px solid ${T.line}`,
                    background: T.paper,
                    color: T.ink,
                    textDecoration: "none",
                  }}
                >
                  <FileText size={12} strokeWidth={2.2} />
                  PDF oficial
                </a>
              ) : null}

              <a
                href={data.inscripcionUrl}
                className="brochure-cta"
                style={{
                  ...ESTILO_BOTON_BARRA,
                  padding: "0 14px",
                  textDecoration: "none",
                  background: acentoFondo,
                  color: "#fff",
                }}
              >
                Inscribirme ahora
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
                    border: `1px solid ${T.line}`,
                    background: T.paper,
                    color: T.whatsapp,
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
              <div style={{ height: 2, background: T.line }}>
                <div
                  style={{
                    height: 2,
                    width: `${porcentaje}%`,
                    background: acentoCurso,
                    transition: "width .2s ease",
                  }}
                />
              </div>
              <div
                aria-live="polite"
                style={{
                  padding: "5px 18px 0",
                  fontSize: 9.5,
                  color: T.mute,
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
                border: "1px solid #F0CFCF",
                background: "#FDF3F3",
                color: "#9B2C2C",
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
              background: T.paper,
              borderRight: `1px solid ${T.line}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 8,
                letterSpacing: 1.6,
                fontWeight: 700,
                color: T.mute,
              }}
            >
              ÍNDICE DEL DOCUMENTO
            </p>

            <nav
              aria-label="Secciones del temario"
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
                        activo ? acentoCurso : "transparent"
                      }`,
                      background: activo ? T.brandSoft : "transparent",
                      color: activo ? T.ink : T.inkSoft,
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
                background: T.line,
                margin: "14px 0 12px",
              }}
            />

            <p
              style={{
                margin: "0 0 8px",
                fontSize: 8,
                letterSpacing: 1.4,
                fontWeight: 700,
                color: T.mute,
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
                    position: "relative",
                    overflow: "hidden",
                    width: 120,
                    height: 170,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "10px 8px 8px",
                    borderRadius: 3,
                    border: `1px solid ${T.line}`,
                    background: T.paper,
                    boxShadow: "0 1px 2px rgba(20,22,27,.05)",
                    color: T.inkSoft,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: acentoCurso,
                      opacity: 0.9,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 8,
                      letterSpacing: 1.2,
                      fontWeight: 700,
                      color: T.mute,
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
                color: T.mute,
              }}
            >
              ProgramBI · Edición {data.paisNombre}
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
              background: T.canvas,
            }}
          >
            <div
              ref={sheetsRef}
              className="brochure-sheets"
              style={{ width: "100%" }}
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
                    <BrochureScheduleSheet
                      data={data}
                      pageNumber={3}
                      totalPages={totalPages}
                    />,
                    totalPages === 3
                  )}
                  {envolverHoja(
                    4,
                    <BrochureShowcaseSheet
                      data={data}
                      pageNumber={4}
                      totalPages={totalPages}
                    />,
                    totalPages === 4
                  )}
                  {envolverHoja(
                    5,
                    <BrochureFacultySheet
                      data={data}
                      pageNumber={5}
                      totalPages={totalPages}
                    />,
                    totalPages === 5
                  )}
                  {envolverHoja(
                    6,
                    <BrochureSyllabusSheets
                      data={data}
                      startPage={6}
                      totalPages={totalPages}
                    />,
                    true
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
