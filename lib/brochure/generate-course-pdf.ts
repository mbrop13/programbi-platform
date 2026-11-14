"use client";

/**
 * Generador del PDF «Temario y precios» en el navegador.
 *
 * Dos motores, en este orden:
 *
 * 1. **1:1 WYSIWYG** (`html-to-image` + `jsPDF`). Rasteriza cada hoja A4 del
 *    visor (`[data-brochure-sheet]`) a 1985 × 2808 px y la inserta como JPEG en
 *    una página A4. Antes de capturar incrusta cada `<img>` como data URL
 *    (`inlineAllImagesInElement`) y después traduce los `[data-pdf-link]` a
 *    anotaciones de enlace de jsPDF para que el PDF conserve los clics.
 *
 * 2. **Respaldo vectorial**. Si no hay hojas o la captura falla, se compone el
 *    temario con `rect`, `text` y `line`, siempre con las imágenes reales
 *    (logo, hero, retratos, logos de empresas y capturas de proyectos). La
 *    estética replica el papel blanco del sitio, con tinta oscura y hairlines.
 *
 * No se usa `autoTable` (no está instalado) y todos los activos son locales
 * (`/images/...`, `/logo.png`), así que nunca dependemos de CORS remoto.
 */

import { brochurePdfFileName } from "@/lib/brochure/brochure-assets";
import {
  describeCourseLevels,
  formatSyllabusGroupHeader,
} from "@/lib/brochure/brochure-pages";
import type {
  BrochureModulo,
  CourseBrochureData,
} from "@/lib/brochure/brochure-data";
import {
  inlineAllImagesInElement,
  loadImageAsPngDataUrl,
} from "@/lib/brochure/image-loader";
import type { jsPDF as JsPdfDocument } from "jspdf";

export type PdfProgressCallback = (step: {
  current: number;
  total: number;
  label: string;
}) => void;

type RGB = [number, number, number];

type ImagenPdf = {
  dataUrl: string;
  width: number;
  height: number;
};

type EnlacePdf = {
  url: string;
  /** Coordenadas en milímetros, relativas a la esquina de la hoja A4. */
  x: number;
  y: number;
  w: number;
  h: number;
};

// ── Geometría de página (mm) ─────────────────────────────────────────────────

const PAGE_W = 210;
const PAGE_H = 297;
const MARGEN = 16;
const ANCHO = PAGE_W - MARGEN * 2;
/** Última línea base útil antes del pie. */
const LIMITE = 272;
const PIE_Y = 283;

// ── Hoja A4 en píxeles ───────────────────────────────────────────────────────

/** A4 a 96 dpi: 794 × 1123 px (210 × 297 mm). */
const HOJA_PX_W = 794;
const HOJA_PX_H = 1123;
/** Destino de la captura: 2.5× sobre la hoja física. */
const LIENZO_PX_W = 1985;
const LIENZO_PX_H = 2808;
const FONDO_HEX = "#FFFFFF";

// ── Paleta editorial (tema claro «Temario y precios») ────────────────────────
//
// Los valores replican los tokens de `lib/brochure/brochure-theme.ts`: papel
// blanco, tinta #14161B, hairlines #E5E2DA y nada de paneles oscuros grandes.

const PAPEL: RGB = [255, 255, 255];
const TINTA: RGB = [20, 22, 27];
const GRIS: RGB = [59, 63, 73];
const TENUE: RGB = [107, 111, 120];
const BLANCO: RGB = [255, 255, 255];
const LINEA: RGB = [229, 226, 218];
const LAVADO: RGB = [247, 246, 242];

const HEX = /^#?([0-9a-f]{6})$/i;

/**
 * Helvetica estándar de jsPDF usa WinAnsi: las comillas curvas, los guiones
 * largos, el bullet y los puntos suspensivos tipográficos se pierden al
 * escribir. Se normalizan a equivalentes seguros antes de dibujar.
 */
const MAPA_TIPOGRAFIA: Record<string, string> = {
  "\u2013": "-",
  "\u2014": "-",
  "\u2212": "-",
  "\u2026": "...",
  "\u2022": "-",
  "\u201c": '"',
  "\u201d": '"',
  "\u2018": "'",
  "\u2019": "'",
  "\u2192": "->",
  "\u2190": "<-",
  "\u00d7": "x",
  "\u2265": ">=",
  "\u2264": "<=",
  "\u20ac": "EUR",
  "\u2122": "(TM)",
  "\u00ae": "(R)",
  "\u00a9": "(c)",
  "\u00a0": " ",
  "\u202f": " ",
};

const TIPOGRAFIA_FUERA_DE_WINANSI =
  /[\u2013\u2014\u2212\u2026\u2022\u201c\u201d\u2018\u2019\u2192\u2190\u00d7\u2265\u2264\u20ac\u2122\u00ae\u00a9\u00a0\u202f]/g;

function limpiarTexto(texto: string): string {
  if (!texto) return "";
  return texto.replace(
    TIPOGRAFIA_FUERA_DE_WINANSI,
    (caracter) => MAPA_TIPOGRAFIA[caracter] ?? caracter
  );
}

function aRgb(hex: string, respaldo: RGB = [24, 144, 255]): RGB {
  const match = HEX.exec((hex || "").trim());
  if (!match) return respaldo;
  const valor = parseInt(match[1], 16);
  return [(valor >> 16) & 255, (valor >> 8) & 255, valor & 255];
}

/** Mezcla un color con blanco (0 = blanco, 1 = color puro). */
function tinte(color: RGB, fuerza: number): RGB {
  return color.map((canal) => Math.round(255 - (255 - canal) * fuerza)) as RGB;
}

function recortar(lineas: string[], maximo: number): string[] {
  if (lineas.length <= maximo) return lineas;
  const copia = lineas.slice(0, maximo);
  copia[maximo - 1] = `${copia[maximo - 1].replace(/[.,;:]?$/, "")}...`;
  return copia;
}

function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join("");
}

/** Envuelve `splitTextToSize` con el tipo que esperamos. */
function lineasDe(
  doc: JsPdfDocument,
  texto: string,
  ancho: number
): string[] {
  return doc.splitTextToSize(limpiarTexto(texto), ancho) as string[];
}

/** Recorta un texto a una sola línea con elipsis. */
function ajustarTexto(
  doc: JsPdfDocument,
  texto: string,
  ancho: number
): string {
  const limpio = limpiarTexto(texto || "").trim();
  if (!limpio) return "";
  if (doc.getTextWidth(limpio) <= ancho) return limpio;
  let corte = limpio;
  while (corte.length > 1 && doc.getTextWidth(`${corte}...`) > ancho) {
    corte = corte.slice(0, -1);
  }
  return `${corte.trimEnd()}...`;
}

// ── Carga de imágenes ────────────────────────────────────────────────────────

function cargarElementoImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imagen = new Image();
    imagen.decoding = "async";
    imagen.crossOrigin = "anonymous";
    imagen.onload = () => resolve(imagen);
    imagen.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    imagen.src = src;
  });
}

/**
 * Rasteriza un activo local con canvas. Se usa como red de seguridad si el
 * cargador compartido devuelve `null` (ruta inesperada, formato exótico, etc.).
 */
async function rasterizarLocal(
  src: string,
  maxSize: number,
  fondo?: string
): Promise<ImagenPdf | null> {
  try {
    const imagen = await cargarElementoImagen(src);
    const anchoOriginal = imagen.naturalWidth || imagen.width;
    const altoOriginal = imagen.naturalHeight || imagen.height;
    if (anchoOriginal <= 0 || altoOriginal <= 0) return null;

    const escala = Math.min(1, maxSize / Math.max(anchoOriginal, altoOriginal));
    const ancho = Math.max(1, Math.round(anchoOriginal * escala));
    const alto = Math.max(1, Math.round(altoOriginal * escala));

    const lienzo = document.createElement("canvas");
    lienzo.width = ancho;
    lienzo.height = alto;
    const ctx = lienzo.getContext("2d");
    if (!ctx) return null;

    if (fondo) {
      ctx.fillStyle = fondo;
      ctx.fillRect(0, 0, ancho, alto);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imagen, 0, 0, ancho, alto);

    const dataUrl = lienzo.toDataURL("image/png");
    if (!dataUrl.startsWith("data:image/")) return null;
    return { dataUrl, width: ancho, height: alto };
  } catch {
    return null;
  }
}

/**
 * Carga un activo del brochure. Primero usa el cargador compartido (PNG con
 * dimensiones reales) y, si falla, cae al rasterizado local. Nunca lanza.
 */
async function cargarActivo(
  src: string | null | undefined,
  maxSize: number
): Promise<ImagenPdf | null> {
  const ruta = (src || "").trim();
  if (!ruta) return null;

  try {
    const viaLoader = await loadImageAsPngDataUrl(ruta, { maxSize });
    if (
      viaLoader &&
      typeof viaLoader.dataUrl === "string" &&
      viaLoader.dataUrl.startsWith("data:image/") &&
      viaLoader.width > 0 &&
      viaLoader.height > 0
    ) {
      return {
        dataUrl: viaLoader.dataUrl,
        width: viaLoader.width,
        height: viaLoader.height,
      };
    }
  } catch {
    // Sigue con el rasterizado propio.
  }

  return rasterizarLocal(ruta, maxSize);
}

/** `Manuel Oliva` → `/images/mentors/manuel-oliva.jpg`. */
function rutaLocalProfesor(nombre: string): string | null {
  const slug = (nombre || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug ? `/images/mentors/${slug}.jpg` : null;
}

/**
 * Retrato del profesor desde el disco del sitio. El modelo de datos puede
 * apuntar a un CDN externo; el brochure solo usa activos locales, así que
 * resuelve el retrato por nombre y, si no existe, devuelve `null`.
 */
async function cargarFotoProfesor(
  nombre: string,
  url: string | null | undefined
): Promise<ImagenPdf | null> {
  const local = rutaLocalProfesor(nombre);
  if (local) {
    const retrato = await rasterizarLocal(local, 1000);
    if (retrato) return retrato;
  }

  const ruta = (url || "").trim();
  if (ruta.startsWith("/")) return cargarActivo(ruta, 1000);
  return null;
}

/**
 * Inserta una imagen ajustada por aspecto y centrada dentro del recuadro.
 * En modo `cover` recorta lo que sobra usando el clip de jsPDF; en `contain`
 * deja aire. Devuelve `false` si el activo no existe o jsPDF lo rechaza.
 */
function addImageSafe(
  doc: JsPdfDocument,
  imagen: ImagenPdf | null,
  x: number,
  y: number,
  w: number,
  h: number,
  modo: "contain" | "cover" = "contain"
): boolean {
  if (!imagen || !imagen.dataUrl) return false;
  const relacion = imagen.width / imagen.height;
  if (!Number.isFinite(relacion) || relacion <= 0) return false;

  const escala =
    modo === "cover"
      ? Math.max(w / imagen.width, h / imagen.height)
      : Math.min(w / imagen.width, h / imagen.height);
  const ancho = imagen.width * escala;
  const alto = imagen.height * escala;
  if (!Number.isFinite(ancho) || !Number.isFinite(alto) || ancho <= 0 || alto <= 0) {
    return false;
  }

  const dx = x + (w - ancho) / 2;
  const dy = y + (h - alto) / 2;

  let recortando = false;
  try {
    if (modo === "cover") {
      doc.saveGraphicsState();
      recortando = true;
      doc.rect(x, y, w, h, null);
      doc.clip();
      doc.discardPath();
    }
    doc.addImage(imagen.dataUrl, "PNG", dx, dy, ancho, alto, undefined, "FAST");
    return true;
  } catch {
    return false;
  } finally {
    if (recortando) {
      try {
        doc.restoreGraphicsState();
      } catch {
        // El estado se restaura en la próxima llamada de jsPDF.
      }
    }
  }
}

// ── Camino 1:1 WYSIWYG ───────────────────────────────────────────────────────

/** Hojas A4 del visor, ordenadas por `data-brochure-sheet`. */
function hojasDelBrochure(contenedor: HTMLElement | null): HTMLElement[] {
  if (typeof document === "undefined") return [];
  const root: ParentNode = contenedor ?? document;
  const nodos = Array.from(
    root.querySelectorAll<HTMLElement>("[data-brochure-sheet]")
  );

  return nodos
    .map((hoja, orden) => ({
      hoja,
      orden,
      indice: Number(hoja.dataset.brochureSheet),
    }))
    .sort((a, b) => {
      const ia = Number.isFinite(a.indice) ? a.indice : Number.POSITIVE_INFINITY;
      const ib = Number.isFinite(b.indice) ? b.indice : Number.POSITIVE_INFINITY;
      if (ia === ib) return a.orden - b.orden;
      return ia - ib;
    })
    .map((item) => item.hoja);
}

function esEnlaceValido(url: string): boolean {
  return /^(https?:\/\/|\/|#)/i.test(url.trim());
}

/**
 * Traduce los `[data-pdf-link]` de una hoja a coordenadas mm relativas a la
 * página. Acepta `data-pdf-link` o, en su defecto, el `href` del `<a>` que lo
 * envuelve; descarta cajas degeneradas y duplicados exactos.
 */
function recolectarEnlaces(hoja: HTMLElement): EnlacePdf[] {
  const marco = hoja.getBoundingClientRect();
  if (marco.width <= 0 || marco.height <= 0) return [];

  const salida: EnlacePdf[] = [];
  const vistos = new Set<string>();

  const nodos = Array.from(
    hoja.querySelectorAll<HTMLElement>("[data-pdf-link]")
  );

  for (const nodo of nodos) {
    const atributo = (nodo.dataset.pdfLink || "").trim();
    const href = (nodo.closest("a")?.getAttribute("href") || "").trim();
    const url = atributo || href;
    if (!url || !esEnlaceValido(url)) continue;

    const caja = nodo.getBoundingClientRect();
    const brutoX = ((caja.left - marco.left) / marco.width) * PAGE_W;
    const brutoY = ((caja.top - marco.top) / marco.height) * PAGE_H;
    const brutoW = (caja.width / marco.width) * PAGE_W;
    const brutoH = (caja.height / marco.height) * PAGE_H;

    if (brutoW <= 1 || brutoH <= 1) continue;

    const x = Math.max(0, Math.min(PAGE_W - 1, brutoX));
    const y = Math.max(0, Math.min(PAGE_H - 1, brutoY));
    const w = Math.min(PAGE_W - x, brutoW);
    const h = Math.min(PAGE_H - y, brutoH);
    if (w <= 1 || h <= 1) continue;

    const clave = `${url}|${x.toFixed(1)}|${y.toFixed(1)}|${w.toFixed(1)}|${h.toFixed(1)}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);

    salida.push({ url, x, y, w, h });
  }

  return salida;
}

/**
 * Fuerza el lienzo a exactamente 1985 × 2808 px (relación A4 exacta). Si
 * `html-to-image` ya devolvió ese tamaño, no se copia nada.
 */
function normalizarCanvas(origen: HTMLCanvasElement): HTMLCanvasElement {
  if (
    !origen.width ||
    !origen.height ||
    (origen.width === LIENZO_PX_W && origen.height === LIENZO_PX_H)
  ) {
    return origen;
  }

  const lienzo = document.createElement("canvas");
  lienzo.width = LIENZO_PX_W;
  lienzo.height = LIENZO_PX_H;
  const ctx = lienzo.getContext("2d");
  if (!ctx) return origen;

  ctx.fillStyle = FONDO_HEX;
  ctx.fillRect(0, 0, LIENZO_PX_W, LIENZO_PX_H);

  const escala = Math.min(
    LIENZO_PX_W / origen.width,
    LIENZO_PX_H / origen.height
  );
  const ancho = origen.width * escala;
  const alto = origen.height * escala;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    origen,
    (LIENZO_PX_W - ancho) / 2,
    (LIENZO_PX_H - alto) / 2,
    ancho,
    alto
  );

  return lienzo;
}

/**
 * Rasteriza una hoja con hasta tres configuraciones de `html-to-image`.
 *
 * Nota de versión: en `html-to-image@1.11.13` el lienzo se dimensiona como
 * `canvasWidth * pixelRatio` (ver `toCanvas`), así que pasar 1985/2808 junto a
 * `pixelRatio: 2.5` produciría un lienzo de 4962 × 7020 px (≈140 MB por hoja).
 * Por eso se usa la variante segura que autoriza el encargo: `pixelRatio` con
 * `width/height` de la hoja, que da exactamente ~1985 × 2808 px.
 *
 * Cualquier fallo se propaga para activar el respaldo vectorial.
 */
async function renderizarHoja(hoja: HTMLElement): Promise<HTMLCanvasElement> {
  const { toCanvas } = await import("html-to-image");

  const rootStyle =
    typeof window !== "undefined"
      ? window.getComputedStyle(document.documentElement)
      : null;
  const resolvedFontSans = rootStyle?.getPropertyValue("--font-sans").trim();
  const resolvedFontMono = rootStyle?.getPropertyValue("--font-mono").trim();
  const resolvedFontDancing = rootStyle?.getPropertyValue("--font-dancing").trim();

  const base: Record<string, unknown> = {
    width: HOJA_PX_W,
    height: HOJA_PX_H,
    backgroundColor: FONDO_HEX,
    cacheBust: false,
    skipFonts: false,
    style: {
      transform: "none",
      margin: "0",
      boxShadow: "none",
      border: "none",
      borderRadius: "0",
      ...(resolvedFontSans ? { "--font-sans": resolvedFontSans } : {}),
      ...(resolvedFontMono ? { "--font-mono": resolvedFontMono } : {}),
      ...(resolvedFontDancing ? { "--font-dancing": resolvedFontDancing } : {}),
    },
  };

  const intentos: Array<Record<string, unknown>> = [
    // 794 × 2.5 = 1985 px de ancho; 1123 × 2.5 ≈ 2808 px de alto.
    { ...base, pixelRatio: 2.5 },
    // Si falla la descarga de tipografías, se omite el embed sin bajar calidad.
    { ...base, pixelRatio: 2.5, skipFonts: true },
    // Último recurso: lienzo más liviano, mismo encuadre 1:1.
    { ...base, pixelRatio: 1.75, skipFonts: true },
  ];

  let ultimoError: unknown = null;

  for (const opciones of intentos) {
    try {
      const canvas = await toCanvas(
        hoja,
        opciones as unknown as Parameters<typeof toCanvas>[1]
      );
      return normalizarCanvas(canvas);
    } catch (error) {
      ultimoError = error;
    }
  }

  throw ultimoError instanceof Error
    ? ultimoError
    : new Error("html-to-image no pudo rasterizar la hoja");
}

async function construirPdfWysiwyg(
  doc: JsPdfDocument,
  hojas: HTMLElement[],
  options?: { onProgress?: PdfProgressCallback }
): Promise<JsPdfDocument> {
  // Tipografías listas antes de capturar: evita saltos de línea y glifos sin
  // pintar en la primera hoja.
  try {
    await document.fonts.ready;
  } catch {
    // Sin `document.fonts` seguimos con las fuentes del sistema.
  }

  for (const hoja of hojas) {
    try {
      await inlineAllImagesInElement(hoja);
    } catch {
      // Una imagen que no se pueda incrustar no invalida la hoja completa.
    }
  }

  const total = hojas.length;

  for (let i = 0; i < total; i += 1) {
    const hoja = hojas[i];

    options?.onProgress?.({
      current: i + 1,
      total,
      label: `Renderizando página ${i + 1} de ${total}…`,
    });

    const canvas = await renderizarHoja(hoja);
    const imagen = canvas.toDataURL("image/jpeg", 0.96);
    if (!imagen.startsWith("data:image/")) {
      throw new Error("La hoja no se pudo convertir a imagen");
    }

    if (i > 0) doc.addPage();
    doc.addImage(imagen, "JPEG", 0, 0, PAGE_W, PAGE_H, undefined, "FAST");

    for (const enlace of recolectarEnlaces(hoja)) {
      try {
        doc.link(enlace.x, enlace.y, enlace.w, enlace.h, { url: enlace.url });
      } catch {
        // Un enlace inválido no debe tumbar la generación.
      }
    }

    // Libera el lienzo antes de la siguiente hoja (1985 × 2808 ≈ 22 MB).
    canvas.width = 1;
    canvas.height = 1;
  }

  options?.onProgress?.({ current: total, total, label: "PDF listo" });
  return doc;
}

// ── Camino de respaldo: jsPDF vectorial con imágenes reales ───────────────────

/**
 * Escala tipográfica del respaldo, alineada con las hojas A4 (1 px = 0.75 pt):
 * cuerpo 12.5px ≈ 9.4pt, títulos de página 17.3px ≈ 13pt, títulos de sección
 * 16px ≈ 12pt y títulos de tarjeta/módulo 14.4px ≈ 10.8pt. Ningún texto baja
 * de 8pt. El documento crece en páginas antes que recortar contenido.
 */
const TIPO = {
  pie: 8,
  meta: 8.6,
  cuerpo: 9.4,
  tarjeta: 10.8,
  seccion: 12,
  tituloPagina: 13,
  kicker: 9.2,
  display: 23,
  precio: 26,
} as const;

/** Alto de una línea de texto en milímetros (1pt = 0.3528mm). */
function altoLinea(tam: number, factor = 1.36): number {
  return tam * 0.3528 * factor;
}

async function construirPdfVectorial(
  doc: JsPdfDocument,
  data: CourseBrochureData,
  options?: { onProgress?: PdfProgressCallback }
): Promise<JsPdfDocument> {
  const acento = aRgb(data.accentColor);
  const acentoSuave = tinte(acento, 0.1);
  const acentoBorde = tinte(acento, 0.32);

  /**
   * Pasos del respaldo: imágenes, portada, inversión, calendario, proyectos,
   * equipo docente, temario y cierre. El progreso es monótono y los pies se
   * numeran solos con `doc.getNumberOfPages()`: nada asume 4 ni 5 páginas.
   */
  const totalPasos = 8;
  let paso = 0;
  const avisar = (label: string): void => {
    paso += 1;
    options?.onProgress?.({
      current: Math.min(paso, totalPasos),
      total: totalPasos,
      label,
    });
  };

  avisar("Cargando imágenes del temario…");

  const profesores = data.profesores.slice(0, 3);
  const galeria = data.galleryImages.slice(0, 3);

  const [logo, hero, fotos, capturas, logosEmpresas] = await Promise.all([
    cargarActivo(data.brandLogoUrl, 720),
    cargarActivo(data.imageUrl, 2200),
    Promise.all(
      profesores.map((profesor) =>
        cargarFotoProfesor(profesor.name, profesor.imageUrl)
      )
    ),
    Promise.all(galeria.map((imagen) => cargarActivo(imagen.src, 1600))),
    Promise.all(data.companyLogos.map((empresa) => cargarActivo(empresa.logoUrl, 320))),
  ]);

  // ── Primitivas de dibujo ───────────────────────────────────────────────────

  const relleno = (color: RGB): void => {
    doc.setFillColor(color[0], color[1], color[2]);
  };
  const trazo = (color: RGB): void => {
    doc.setDrawColor(color[0], color[1], color[2]);
  };
  const tinta = (color: RGB): void => {
    doc.setTextColor(color[0], color[1], color[2]);
  };

  let y = MARGEN;

  const fondo = (): void => {
    relleno(PAPEL);
    doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  };

  const marcaProgramBI = (x: number, top: number, w: number, h: number): void => {
    if (addImageSafe(doc, logo, x, top, w, h)) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    tinta(TINTA);
    doc.text("ProgramBI", x, top + h * 0.72);
  };

  /** Cabecera mínima (logo + filete) que llevan todas las páginas. */
  const marcaDePagina = (): void => {
    marcaProgramBI(MARGEN, 10, 26, 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.meta);
    tinta(TENUE);
    doc.setCharSpace(0.7);
    doc.text(
      `TEMARIO Y PRECIOS · ${data.paisNombre.toUpperCase()}`,
      PAGE_W - MARGEN,
      16.5,
      { align: "right" }
    );
    doc.setCharSpace(0);

    trazo(LINEA);
    doc.setLineWidth(0.3);
    doc.line(MARGEN, 22, PAGE_W - MARGEN, 22);
    y = 30;
  };

  const nuevaPagina = (): void => {
    doc.addPage();
    fondo();
    marcaDePagina();
  };

  const asegurar = (alto: number): void => {
    if (y + alto > LIMITE) nuevaPagina();
  };

  /** Divide un texto al ancho dado y, si se pide, recorta con elipsis. */
  const medirLineas = (
    texto: string,
    ancho: number,
    tam: number,
    estilo: "normal" | "bold" = "normal",
    maximo = 0
  ): string[] => {
    if (!texto) return [];
    doc.setFont("helvetica", estilo);
    doc.setFontSize(tam);
    const lineas = lineasDe(doc, texto, ancho);
    return maximo > 0 ? recortar(lineas, maximo) : lineas;
  };

  /** Dibuja un bloque de líneas desde `top`; devuelve el alto consumido. */
  const dibujarLineas = (
    lineas: string[],
    x: number,
    top: number,
    tam: number,
    factor = 1.36
  ): number => {
    const alto = altoLinea(tam, factor);
    lineas.forEach((linea, indice) => {
      doc.text(linea, x, top + alto * (indice + 1));
    });
    return lineas.length * alto;
  };

  /** Párrafo que fluye y salta de página solo, sin recortar el texto. */
  const parrafo = (
    texto: string,
    opciones: {
      x?: number;
      ancho?: number;
      tam?: number;
      estilo?: "normal" | "bold";
      color?: RGB;
      factor?: number;
      maximo?: number;
    } = {}
  ): number => {
    const x = opciones.x ?? MARGEN;
    const ancho = opciones.ancho ?? ANCHO;
    const tam = opciones.tam ?? TIPO.cuerpo;
    const estilo = opciones.estilo ?? "normal";
    const factor = opciones.factor ?? 1.36;
    const lineas = medirLineas(texto, ancho, tam, estilo, opciones.maximo ?? 0);
    if (lineas.length === 0) return 0;

    doc.setFont("helvetica", estilo);
    doc.setFontSize(tam);
    tinta(opciones.color ?? GRIS);

    const alto = altoLinea(tam, factor);
    for (const linea of lineas) {
      if (y + alto > LIMITE) nuevaPagina();
      doc.text(linea, x, y + alto);
      y += alto;
    }
    return lineas.length * alto;
  };

  /** Bullet con el mismo flujo y sangría francesa. */
  const vineta = (
    texto: string,
    x: number,
    ancho: number,
    tam = TIPO.cuerpo,
    color: RGB = GRIS
  ): void => {
    const lineas = medirLineas(texto, ancho - 5, tam, "normal", 4);
    if (lineas.length === 0) return;

    const alto = altoLinea(tam);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(tam);
    for (let i = 0; i < lineas.length; i += 1) {
      if (y + alto > LIMITE) nuevaPagina();
      if (i === 0) {
        tinta(acentoBorde);
        doc.text("·", x, y + alto);
      }
      tinta(color);
      doc.text(lineas[i], x + 5, y + alto);
      y += alto;
    }
  };

  const tituloSeccion = (texto: string, nota?: string): void => {
    const lineas = medirLineas(texto, ANCHO, TIPO.seccion, "bold", 2);
    const altoTitulo = lineas.length * altoLinea(TIPO.seccion, 1.2);
    const altoNota = nota ? 2 + altoLinea(TIPO.meta, 1.32) * 2 : 0;
    asegurar(altoTitulo + altoNota + 2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.seccion);
    tinta(TINTA);
    y += dibujarLineas(lineas, MARGEN, y, TIPO.seccion, 1.2);
    y += 1.4;

    if (nota) {
      parrafo(nota, { tam: TIPO.meta, color: TENUE, factor: 1.32, maximo: 3 });
      y += 1.4;
    }
  };

  const cabecera = (
    kicker: string,
    titulo: string,
    subtitulo?: string
  ): void => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.kicker);
    tinta(acento);
    doc.setCharSpace(0.9);
    doc.text(kicker.toUpperCase(), MARGEN, y + 4.4);
    doc.setCharSpace(0);

    const lineasTitulo = medirLineas(titulo, ANCHO, TIPO.tituloPagina, "bold", 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.tituloPagina);
    tinta(TINTA);
    const altoTitulo = dibujarLineas(
      lineasTitulo,
      MARGEN,
      y + 8,
      TIPO.tituloPagina,
      1.14
    );
    let cursor = y + 8 + altoTitulo;

    if (subtitulo) {
      const lineasSub = medirLineas(subtitulo, ANCHO, TIPO.cuerpo, "normal", 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(TIPO.cuerpo);
      tinta(GRIS);
      cursor += 2.5 + dibujarLineas(lineasSub, MARGEN, cursor + 2.5, TIPO.cuerpo, 1.35);
    }

    cursor += 4;
    trazo(LINEA);
    doc.setLineWidth(0.3);
    doc.line(MARGEN, cursor, PAGE_W - MARGEN, cursor);
    y = cursor + 8;
  };

  const pintarPies = (): void => {
    const paginas = doc.getNumberOfPages();
    for (let pagina = 1; pagina <= paginas; pagina += 1) {
      doc.setPage(pagina);
      trazo(LINEA);
      doc.setLineWidth(0.3);
      doc.line(MARGEN, PIE_Y, PAGE_W - MARGEN, PIE_Y);
      relleno(acento);
      doc.rect(MARGEN, PIE_Y - 1.6, 10, 1, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(TIPO.pie);
      tinta(TENUE);
      doc.text(
        `ProgramBI · programbi.com · Página ${pagina} de ${paginas}`,
        MARGEN,
        PIE_Y + 4.8
      );
      doc.text(`Actualizado ${data.actualizado}`, PAGE_W - MARGEN, PIE_Y + 4.8, {
        align: "right",
      });
    }
  };

  const enlaceInscripcion = `https://programbi.com${data.inscripcionUrl}`;

  // ── 1. Portada ─────────────────────────────────────────────────────────────

  avisar("Componiendo la portada…");
  fondo();
  relleno(acento);
  doc.rect(0, 0, PAGE_W, 5, "F");

  marcaProgramBI(MARGEN, 12, 34, 10);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.meta);
  tinta(GRIS);
  doc.setCharSpace(0.9);
  doc.text("TEMARIO Y PRECIOS", PAGE_W - MARGEN, 16.5, { align: "right" });
  doc.setCharSpace(0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(TIPO.meta);
  tinta(TENUE);
  doc.text(`Actualizado ${data.actualizado}`, PAGE_W - MARGEN, 21.8, {
    align: "right",
  });

  trazo(LINEA);
  doc.setLineWidth(0.4);
  doc.line(MARGEN, 27, PAGE_W - MARGEN, 27);

  y = 36;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.kicker);
  tinta(acento);
  doc.setCharSpace(0.9);
  doc.text(
    ajustarTexto(
      doc,
      `${data.categoryLabel} · ${data.paisNombre}`.toUpperCase(),
      ANCHO
    ),
    MARGEN,
    y
  );
  doc.setCharSpace(0);
  y += 9.5;

  const tituloPortada = medirLineas(data.title, ANCHO, TIPO.display, "bold", 3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.display);
  tinta(TINTA);
  y += dibujarLineas(tituloPortada, MARGEN, y, TIPO.display, 1.12) + 5;

  parrafo(data.shortDescription, {
    tam: 10.2,
    color: GRIS,
    factor: 1.4,
    maximo: 4,
  });
  y += 7;

  const insigniaLineas = medirLineas(data.insignia, ANCHO - 12, TIPO.kicker, "bold", 3);
  const altoInsignia = 5.6 + insigniaLineas.length * altoLinea(TIPO.kicker, 1.3);
  asegurar(altoInsignia + 8);
  relleno(acentoSuave);
  doc.roundedRect(MARGEN, y, ANCHO, altoInsignia, 2.2, 2.2, "F");
  relleno(acento);
  doc.rect(MARGEN, y, 1.5, altoInsignia, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.kicker);
  tinta(TINTA);
  dibujarLineas(insigniaLineas, MARGEN + 5, y + 1.2, TIPO.kicker, 1.3);
  y += altoInsignia + 8;

  const fallbackLevelInfo = describeCourseLevels(data);

  const metricas: Array<{ valor: string; etiqueta: string }> = [
    {
      valor: `${data.hours}`,
      etiqueta: data.levelsCount > 1 ? "horas por nivel" : "horas en vivo",
    },
    { valor: `${data.modulesCount}`, etiqueta: "módulos" },
    {
      valor: `${data.levelsCount}`,
      etiqueta: data.levelsCount === 1 ? "nivel único" : "niveles independientes",
    },
    { valor: "100%", etiqueta: "en vivo por Zoom" },
  ];

  const altoHero = 66;
  const anchoHero = 104;
  const anchoStats = ANCHO - anchoHero - 4;
  const xStats = MARGEN + anchoHero + 4;

  asegurar(altoHero + 10);

  // Foto oficial del curso, recortada al marco sin deformarse.
  relleno(BLANCO);
  doc.roundedRect(MARGEN, y, anchoHero, altoHero, 3, 3, "F");
  trazo(LINEA);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGEN, y, anchoHero, altoHero, 3, 3, "S");

  if (
    !addImageSafe(
      doc,
      hero,
      MARGEN + 1.5,
      y + 1.5,
      anchoHero - 3,
      altoHero - 3,
      "cover"
    )
  ) {
    tinta(TENUE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.cuerpo);
    doc.text(
      ajustarTexto(
        doc,
        data.techStack.length > 0 ? data.techStack.join(" · ") : data.title,
        anchoHero - 12
      ),
      MARGEN + anchoHero / 2,
      y + altoHero / 2,
      { align: "center" }
    );
  }

  // Columna de indicadores junto a la foto.
  relleno(BLANCO);
  doc.roundedRect(xStats, y, anchoStats, altoHero, 3, 3, "F");
  trazo(LINEA);
  doc.setLineWidth(0.3);
  doc.roundedRect(xStats, y, anchoStats, altoHero, 3, 3, "S");

  const altoMetrica = altoHero / metricas.length;
  metricas.forEach((metrica, indice) => {
    const top = y + indice * altoMetrica;
    if (indice > 0) {
      trazo(LINEA);
      doc.setLineWidth(0.25);
      doc.line(xStats + 4, top, xStats + anchoStats - 4, top);
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    tinta(TINTA);
    doc.text(metrica.valor, xStats + 5, top + 8.4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(TIPO.meta);
    tinta(GRIS);
    doc.text(
      ajustarTexto(doc, metrica.etiqueta, anchoStats - 10),
      xStats + 5,
      top + 13.6
    );
  });

  y += altoHero + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.meta);
  tinta(TENUE);
  doc.setCharSpace(0.8);
  doc.text("CÓMO SE APRENDE EN PROGRAMBI", MARGEN, y);
  doc.setCharSpace(0);
  y += 5.5;

  const pilares = data.methodologyPillars.slice(0, 4);
  const anchoPilar = (ANCHO - 6) / 2;
  const altoPilar = 27;
  asegurar(Math.ceil(pilares.length / 2) * altoPilar);

  pilares.forEach((pilar, indice) => {
    const columna = indice % 2;
    const fila = Math.floor(indice / 2);
    const x = MARGEN + columna * (anchoPilar + 6);
    const py = y + fila * altoPilar;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.cuerpo);
    tinta(acento);
    doc.text(pilar.step, x, py + 4.6);

    doc.setFontSize(TIPO.tarjeta);
    tinta(TINTA);
    doc.text(ajustarTexto(doc, pilar.title, anchoPilar - 10), x + 9, py + 4.6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.2);
    tinta(GRIS);
    const descripcion = medirLineas(pilar.description, anchoPilar - 9, 9.2, "normal", 3);
    dibujarLineas(descripcion, x + 9, py + 6.4, 9.2, 1.35);
  });
  y += Math.ceil(pilares.length / 2) * altoPilar;

  // ── 2. Inversión ───────────────────────────────────────────────────────────

  avisar("Componiendo la inversión…");
  nuevaPagina();
  cabecera(
    "Inversión",
    "Un precio claro, en la moneda de tu país",
    `Valores vigentes para ${data.paisNombre}. El monto incluye el programa completo y el acceso al campus.`
  );

  const conLista = Boolean(data.precioListaFormateado);
  const altoPrecio = conLista ? 50 : 42;
  asegurar(altoPrecio + 8);

  relleno(BLANCO);
  doc.roundedRect(MARGEN, y, ANCHO, altoPrecio, 3, 3, "F");
  trazo(LINEA);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGEN, y, ANCHO, altoPrecio, 3, 3, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(TIPO.cuerpo);
  tinta(GRIS);
  doc.text(`Precio oficial en ${data.paisNombre}`, MARGEN + 7, y + 10);

  const largoPrecio = data.precioFormateado.length;
  const tamPrecio = largoPrecio > 18 ? 18 : largoPrecio > 12 ? 22 : TIPO.precio;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(tamPrecio);
  tinta(TINTA);
  doc.text(
    ajustarTexto(doc, data.precioFormateado, ANCHO - 66),
    MARGEN + 7,
    y + (conLista ? 27 : 26)
  );

  if (data.precioListaFormateado) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(TIPO.cuerpo);
    tinta(TENUE);
    const lista = limpiarTexto(data.precioListaFormateado);
    doc.text(lista, MARGEN + 7, y + 39);
    const anchoLista = doc.getTextWidth(lista);
    trazo(TENUE);
    doc.setLineWidth(0.3);
    doc.line(MARGEN + 7, y + 37.6, MARGEN + 7 + anchoLista, y + 37.6);

    if (data.descuentoPct > 0) {
      relleno(acentoSuave);
      doc.roundedRect(PAGE_W - MARGEN - 50, y + 27, 42, 11, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(TIPO.kicker);
      tinta(acento);
      doc.text(
        `${data.descuentoPct}% de descuento`,
        PAGE_W - MARGEN - 29,
        y + 34,
        { align: "center" }
      );
    }
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(TIPO.pie);
  tinta(TENUE);
  doc.text(
    limpiarTexto(`Moneda: ${data.moneda} (${data.simbolo})`),
    MARGEN + 7,
    y + altoPrecio - 5.5
  );
  y += altoPrecio + 8;

  const altoCuotas = 38;
  asegurar(altoCuotas + 9);
  relleno(acentoSuave);
  doc.roundedRect(MARGEN, y, ANCHO, altoCuotas, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.tarjeta);
  tinta(acento);
  doc.text(`${data.cuotas} cuotas sin interés`, MARGEN + 7, y + 10);

  doc.setFontSize(16);
  tinta(TINTA);
  doc.text(ajustarTexto(doc, data.cuotaTexto, ANCHO - 14), MARGEN + 7, y + 19);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.2);
  tinta(GRIS);
  const notaCuotas = medirLineas(data.notaCuotas, ANCHO - 14, 9.2, "normal", 2);
  dibujarLineas(notaCuotas, MARGEN + 7, y + 22.5, 9.2, 1.32);
  y += altoCuotas + 9;

  tituloSeccion("Medios de pago disponibles");

  const altoChip = 9.4;
  asegurar(altoChip * 2 + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(TIPO.cuerpo);
  let chipX = MARGEN;
  let chipY = y;

  for (const medio of data.mediosPago) {
    const etiqueta = limpiarTexto(medio);
    const anchoChip = doc.getTextWidth(etiqueta) + 10;
    if (chipX + anchoChip > PAGE_W - MARGEN) {
      chipX = MARGEN;
      chipY += altoChip + 2.6;
    }
    relleno(BLANCO);
    trazo(LINEA);
    doc.setLineWidth(0.25);
    doc.roundedRect(chipX, chipY - altoChip + 1.8, anchoChip, altoChip, 4.6, 4.6, "FD");
    tinta(TINTA);
    doc.text(etiqueta, chipX + 5, chipY);
    chipX += anchoChip + 3;
  }
  y = chipY + 7;

  parrafo(data.notaPago, { tam: TIPO.cuerpo, color: TENUE, maximo: 4 });
  y += 7;

  const altoInscripcion = 32;
  asegurar(altoInscripcion + 6);
  relleno(BLANCO);
  doc.roundedRect(MARGEN, y, ANCHO, altoInscripcion, 3, 3, "F");
  trazo(LINEA);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGEN, y, ANCHO, altoInscripcion, 3, 3, "S");
  relleno(acento);
  doc.rect(MARGEN, y, 1.6, altoInscripcion, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.tarjeta);
  tinta(TINTA);
  doc.text("Inscripción en línea", MARGEN + 7, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(TIPO.cuerpo);
  tinta(acento);
  doc.text(`programbi.com${data.inscripcionUrl}`, MARGEN + 7, y + 17.5);
  if (data.whatsappUrl) {
    tinta(GRIS);
    doc.text(
      `WhatsApp: ${data.whatsappUrl.replace(
        /^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i,
        ""
      )}`,
      MARGEN + 7,
      y + 24.5
    );
  }
  try {
    doc.link(MARGEN + 7, y + 13.5, ANCHO - 14, 11, { url: enlaceInscripcion });
  } catch {
    // Sin enlace, el texto sigue siendo legible.
  }
  y += altoInscripcion + 6;

  // ── 3. Calendario ──────────────────────────────────────────────────────────

  avisar("Componiendo el calendario…");
  nuevaPagina();
  cabecera(
    "Calendario",
    "Próximas fechas y horarios en tu hora",
    `Las clases se dictan desde Chile. Cada horario ya está convertido a la hora local de ${data.paisNombre}.`
  );

  if (data.schedules.length === 0) {
    const altoVacio = 34;
    asegurar(altoVacio + 8);
    relleno(acentoSuave);
    doc.roundedRect(MARGEN, y, ANCHO, altoVacio, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.tarjeta);
    tinta(TINTA);
    doc.text("Cupos abiertos · consulta fecha", MARGEN + 7, y + 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(TIPO.cuerpo);
    tinta(GRIS);
    const aviso = medirLineas(
      "La próxima cohorte se confirma por WhatsApp o al inscribirte en línea. Escríbenos y te avisamos con la fecha exacta y el horario de tu país.",
      ANCHO - 14,
      TIPO.cuerpo,
      "normal",
      3
    );
    dibujarLineas(aviso, MARGEN + 7, y + 16, TIPO.cuerpo, 1.34);
    y += altoVacio + 8;
  } else {
    tituloSeccion("Cohortes confirmadas");

    const altoCohorte = 24;
    for (const cohorte of data.schedules.slice(0, 6)) {
      asegurar(altoCohorte);

      relleno(BLANCO);
      doc.roundedRect(MARGEN, y, ANCHO, altoCohorte - 2, 2.6, 2.6, "F");
      trazo(LINEA);
      doc.setLineWidth(0.25);
      doc.roundedRect(MARGEN, y, ANCHO, altoCohorte - 2, 2.6, 2.6, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(TIPO.meta);
      tinta(TENUE);
      doc.text(
        ajustarTexto(doc, cohorte.nivel.toUpperCase(), ANCHO - 92),
        MARGEN + 6,
        y + 6.4
      );

      doc.setFontSize(TIPO.tarjeta);
      tinta(TINTA);
      doc.text(ajustarTexto(doc, cohorte.fecha, ANCHO - 92), MARGEN + 6, y + 12.4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(TIPO.cuerpo);
      tinta(GRIS);
      doc.text(
        ajustarTexto(
          doc,
          `${cohorte.dias}${cohorte.hours ? ` · ${cohorte.hours} horas` : ""}`,
          ANCHO - 92
        ),
        MARGEN + 6,
        y + 18.4
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(TIPO.tarjeta);
      tinta(acento);
      doc.text(ajustarTexto(doc, cohorte.horario, 74), PAGE_W - MARGEN - 6, y + 8.4, {
        align: "right",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(TIPO.pie);
      tinta(TENUE);
      doc.text(
        ajustarTexto(doc, cohorte.horaChile, 74),
        PAGE_W - MARGEN - 6,
        y + 15,
        { align: "right" }
      );

      y += altoCohorte;
    }
    y += 2;
  }

  const filasHorario: Array<{ mercado: string; hora: string }> = [
    { mercado: data.paisNombre, hora: data.equivalencias.inicio },
  ];
  for (const tramo of data.equivalencias.cadenaMercados.split(" = ")) {
    const partes = tramo.match(/^(\d{1,2}:\d{2})\s+en\s+(.+)$/);
    if (partes && partes[2] !== data.paisNombre) {
      filasHorario.push({ mercado: partes[2], hora: partes[1] });
    }
  }

  const altoFila = 8.2;
  asegurar(altoFila * 4 + 18);
  tituloSeccion(
    "La misma clase en cada mercado",
    `Hora de inicio en ${data.paisNombre}: ${data.equivalencias.inicio} (${data.equivalencias.offset}) · término ${data.equivalencias.fin}`
  );

  relleno(LAVADO);
  doc.rect(MARGEN, y, ANCHO, altoFila, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.meta);
  tinta(GRIS);
  doc.text("MERCADO", MARGEN + 4, y + 5.4);
  doc.text("HORA DE INICIO", PAGE_W - MARGEN - 4, y + 5.4, { align: "right" });
  y += altoFila;

  filasHorario.forEach((fila, indice) => {
    asegurar(altoFila + 2);
    if (indice % 2 === 0) {
      relleno(BLANCO);
      doc.rect(MARGEN, y, ANCHO, altoFila, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(TIPO.cuerpo);
    tinta(TINTA);
    doc.text(fila.mercado, MARGEN + 4, y + 5.4);
    doc.setFont("helvetica", "bold");
    doc.text(fila.hora, PAGE_W - MARGEN - 4, y + 5.4, { align: "right" });
    trazo(LINEA);
    doc.setLineWidth(0.2);
    doc.line(MARGEN, y + altoFila, PAGE_W - MARGEN, y + altoFila);
    y += altoFila;
  });
  y += 6;

  parrafo(
    "Los horarios respetan el horario de verano de cada país y se confirman al inscribirte. Si no puedes asistir en vivo, la clase queda grabada en el campus.",
    { tam: 9.2, color: TENUE, maximo: 4 }
  );

  // ── 4. Proyectos y certificado ─────────────────────────────────────────────

  avisar("Componiendo proyectos y certificado…");
  nuevaPagina();
  cabecera(
    "Proyectos reales",
    "Así se ve lo que vas a construir",
    "Capturas reales de clases y proyectos guiados. Cada módulo termina en un entregable que puedes mostrar."
  );

  const anchoCaptura = 82;
  const altoCaptura = 46;

  galeria.forEach((captura, indice) => {
    asegurar(altoCaptura + 4);
    const top = y;

    relleno(LAVADO);
    doc.roundedRect(MARGEN, top, anchoCaptura, altoCaptura, 2.6, 2.6, "F");

    if (
      !addImageSafe(
        doc,
        capturas[indice],
        MARGEN + 1,
        top + 1,
        anchoCaptura - 2,
        altoCaptura - 2
      )
    ) {
      tinta(TENUE);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(TIPO.meta);
      doc.text(
        ajustarTexto(doc, captura.title, anchoCaptura - 8),
        MARGEN + anchoCaptura / 2,
        top + altoCaptura / 2,
        { align: "center" }
      );
    }

    const textoX = MARGEN + anchoCaptura + 8;
    const anchoTexto = ANCHO - anchoCaptura - 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.meta);
    tinta(acento);
    doc.setCharSpace(0.7);
    doc.text(`PROYECTO ${String(indice + 1).padStart(2, "0")}`, textoX, top + 6.4);
    doc.setCharSpace(0);

    const tituloCaptura = medirLineas(captura.title, anchoTexto, TIPO.tarjeta, "bold", 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.tarjeta);
    tinta(TINTA);
    const altoTituloCaptura = dibujarLineas(
      tituloCaptura,
      textoX,
      top + 7.6,
      TIPO.tarjeta,
      1.2
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.2);
    tinta(GRIS);
    const subCaptura = medirLineas(captura.subtitle, anchoTexto, 9.2, "normal", 4);
    dibujarLineas(
      subCaptura,
      textoX,
      top + 7.6 + altoTituloCaptura + 1.6,
      9.2,
      1.36
    );

    y += altoCaptura + 5;
  });

  const altoCertificado = 64;
  asegurar(altoCertificado + 8);
  relleno(BLANCO);
  doc.roundedRect(MARGEN, y, ANCHO, altoCertificado, 3.5, 3.5, "F");
  trazo(LINEA);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGEN, y, ANCHO, altoCertificado, 3.5, 3.5, "S");
  relleno(acento);
  doc.rect(MARGEN, y, 3.5, altoCertificado, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.meta);
  tinta(acento);
  doc.setCharSpace(0.9);
  doc.text("CERTIFICADO DIGITAL VERIFICABLE", MARGEN + 10, y + 10.5);
  doc.setCharSpace(0);

  doc.setFontSize(13);
  tinta(TINTA);
  doc.text("Termina con un certificado que puedes mostrar", MARGEN + 10, y + 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.2);
  tinta(GRIS);
  const textoCertificado = medirLineas(
    "Al completar los módulos recibes tu certificado digital con código de verificación y campus virtual con las clases y material usado para que puedas practicar durante el curso.",
    ANCHO - 84,
    9.2,
    "normal",
    4
  );
  dibujarLineas(textoCertificado, MARGEN + 10, y + 25.5, 9.2, 1.36);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.cuerpo);
  tinta(TINTA);
  doc.text("programbi.com", MARGEN + 10, y + altoCertificado - 10);

  trazo(acento);
  doc.setLineWidth(0.5);
  doc.circle(PAGE_W - MARGEN - 28, y + 30, 15, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  tinta(acento);
  doc.text("PB", PAGE_W - MARGEN - 28, y + 32.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(TIPO.pie);
  tinta(TENUE);
  doc.text("PROGRAMBI", PAGE_W - MARGEN - 28, y + 37.5, { align: "center" });

  y += altoCertificado + 8;

  // ── 5. Equipo docente y empresas ───────────────────────────────────────────

  avisar("Componiendo el equipo docente…");
  nuevaPagina();
  cabecera(
    "Equipo docente",
    "Quién te enseña",
    "Profesionales en ejercicio que dictan lo mismo que aplican en banca, minería y retail."
  );

  const anchoTarjeta = (ANCHO - 2 * 6) / 3;
  const altoFoto = anchoTarjeta * 1.2;
  const altoTarjeta = altoFoto + 48;

  asegurar(altoTarjeta + 8);

  profesores.forEach((profesor, indice) => {
    const x = MARGEN + indice * (anchoTarjeta + 6);

    relleno(BLANCO);
    doc.roundedRect(x, y, anchoTarjeta, altoTarjeta, 3, 3, "F");
    trazo(LINEA);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, y, anchoTarjeta, altoTarjeta, 3, 3, "S");

    relleno(LAVADO);
    doc.roundedRect(x + 0.4, y + 0.4, anchoTarjeta - 0.8, altoFoto, 2.8, 2.8, "F");

    if (
      !addImageSafe(
        doc,
        fotos[indice],
        x + 1,
        y + 1,
        anchoTarjeta - 2,
        altoFoto - 2,
        "cover"
      )
    ) {
      relleno(acentoSuave);
      doc.circle(x + anchoTarjeta / 2, y + altoFoto / 2, 11, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      tinta(acento);
      doc.text(iniciales(profesor.name), x + anchoTarjeta / 2, y + altoFoto / 2 + 1.8, {
        align: "center",
      });
    }

    let textoY = y + altoFoto + 7;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.tarjeta);
    tinta(TINTA);
    doc.text(ajustarTexto(doc, profesor.name, anchoTarjeta - 8), x + 4, textoY);
    textoY += 5;

    doc.setFontSize(TIPO.meta);
    tinta(acento);
    doc.text(ajustarTexto(doc, profesor.role, anchoTarjeta - 8), x + 4, textoY);
    textoY += 4.4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.2);
    tinta(GRIS);
    const tituloProfesor = medirLineas(profesor.title, anchoTarjeta - 8, 9.2, "normal", 3);
    textoY += dibujarLineas(tituloProfesor, x + 4, textoY, 9.2, 1.32) + 1.2;

    doc.setFontSize(TIPO.pie);
    tinta(TENUE);
    for (const credencial of profesor.credentials.slice(0, 2)) {
      doc.text(
        `· ${ajustarTexto(doc, credencial, anchoTarjeta - 10)}`,
        x + 4,
        textoY
      );
      textoY += 3.9;
    }
  });

  y += altoTarjeta + 10;
  tituloSeccion("Empresas que capacitaron a sus equipos");

  const columnasLogo = 6;
  const separacion = 2.6;
  const celdaW = (ANCHO - separacion * (columnasLogo - 1)) / columnasLogo;
  const celdaH = 16.5;

  asegurar(celdaH * 2 + separacion + 8);

  data.companyLogos.slice(0, 12).forEach((empresa, indice) => {
    const fila = Math.floor(indice / columnasLogo);
    const columna = indice % columnasLogo;
    const x = MARGEN + columna * (celdaW + separacion);
    const top = y + fila * (celdaH + separacion);

    relleno(BLANCO);
    trazo(LINEA);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, top, celdaW, celdaH, 2, 2, "FD");

    if (!addImageSafe(doc, logosEmpresas[indice], x + 2, top + 2, celdaW - 4, celdaH - 4)) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(TIPO.pie);
      tinta(TENUE);
      doc.text(
        ajustarTexto(doc, empresa.name, celdaW - 4),
        x + celdaW / 2,
        top + celdaH / 2 + 1.2,
        { align: "center" }
      );
    }
  });

  y += 2 * celdaH + separacion + 6;

  parrafo(data.empresas.join(" · "), { tam: TIPO.meta, color: TENUE, maximo: 3 });

  // ── 6. Temario completo ────────────────────────────────────────────────────

  avisar("Componiendo el temario…");
  nuevaPagina();
  cabecera(
    "Programa Académico Detallado",
    "Todo lo que vas a dominar",
    `${data.modulesCount} módulos · ${fallbackLevelInfo.levelsLabel}. ${fallbackLevelInfo.syllabusGuideBanner}`
  );

  if (data.whatYouLearn.length > 0) {
    tituloSeccion("Resultados de aprendizaje");

    const resultados = data.whatYouLearn.slice(0, 8);
    const mitad = Math.ceil(resultados.length / 2);
    const columnas: string[][] = [
      resultados.slice(0, mitad),
      resultados.slice(mitad),
    ];
    const anchoColumna = (ANCHO - 8) / 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(TIPO.cuerpo);

    const lineasColumnas = columnas.map((columna) =>
      columna.map((item) => recortar(lineasDe(doc, item, anchoColumna - 6), 3))
    );

    let altoMaximo = 0;
    lineasColumnas.forEach((columna) => {
      const alto = columna.reduce(
        (total, lineas) => total + lineas.length * altoLinea(TIPO.cuerpo, 1.32) + 1.6,
        0
      );
      altoMaximo = Math.max(altoMaximo, alto);
    });

    asegurar(altoMaximo + 6);

    lineasColumnas.forEach((columna, indice) => {
      const x = MARGEN + indice * (anchoColumna + 8);
      let cursor = y;
      for (const lineas of columna) {
        relleno(acento);
        doc.circle(x + 1, cursor + 2.8, 0.8, "F");
        tinta(GRIS);
        dibujarLineas(lineas, x + 4, cursor, TIPO.cuerpo, 1.32);
        cursor += lineas.length * altoLinea(TIPO.cuerpo, 1.32) + 1.6;
      }
    });

    y += altoMaximo + 6;
  }

  const dibujarModulo = (modulo: BrochureModulo): void => {
    const tituloLineas = medirLineas(modulo.title, ANCHO - 36, TIPO.tarjeta, "bold", 3);
    const altoTitulo = tituloLineas.length * altoLinea(TIPO.tarjeta, 1.22);

    if (y + altoTitulo + 12 > LIMITE) nuevaPagina();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.tarjeta);
    tinta(TINTA);
    dibujarLineas(tituloLineas, MARGEN + 4, y, TIPO.tarjeta, 1.22);

    if (modulo.hours) {
      const etiqueta = `${modulo.hours} h`;
      doc.setFontSize(TIPO.meta);
      const anchoEtiqueta = doc.getTextWidth(etiqueta) + 8;
      relleno(acentoSuave);
      doc.roundedRect(
        PAGE_W - MARGEN - anchoEtiqueta,
        y + 0.2,
        anchoEtiqueta,
        6.6,
        2,
        2,
        "F"
      );
      tinta(acento);
      doc.text(etiqueta, PAGE_W - MARGEN - anchoEtiqueta / 2, y + 5, {
        align: "center",
      });
    }

    y += altoTitulo + 1.6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(TIPO.cuerpo);

    for (const tema of modulo.topics) {
      const lineas = medirLineas(tema, ANCHO - 16, TIPO.cuerpo, "normal", 5);
      const altoTema = lineas.length * altoLinea(TIPO.cuerpo, 1.4);

      if (y + altoTema > LIMITE) {
        nuevaPagina();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(TIPO.tarjeta);
        tinta(GRIS);
        doc.text(
          ajustarTexto(doc, `${modulo.title} (continuación)`, ANCHO),
          MARGEN + 4,
          y + 5
        );
        y += 8;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(TIPO.cuerpo);
      }

      tinta(acentoBorde);
      doc.text("·", MARGEN + 6, y + altoLinea(TIPO.cuerpo, 1.4));
      tinta(GRIS);
      dibujarLineas(lineas, MARGEN + 9, y, TIPO.cuerpo, 1.4);
      y += altoTema + 1.1;
    }

    y += 3.4;
  };

  for (const nivel of data.temario) {
    if (y + 30 > LIMITE) nuevaPagina();

    const groupHeader = formatSyllabusGroupHeader(data, nivel.label);
    relleno(LAVADO);
    doc.roundedRect(MARGEN, y, ANCHO, 13.5, 2.2, 2.2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.seccion);
    tinta(TINTA);
    doc.text(ajustarTexto(doc, groupHeader.title, ANCHO - 68), MARGEN + 6, y + 9);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(TIPO.meta);
    tinta(GRIS);
    doc.text(limpiarTexto(groupHeader.badge), PAGE_W - MARGEN - 6, y + 9, {
      align: "right",
    });
    y += 13.5 + 6;

    for (const modulo of nivel.modules) {
      dibujarModulo(modulo);
    }

    y += 2.4;
  }

  // ── 7. Cierre e inscripción ────────────────────────────────────────────────

  avisar("Componiendo el cierre e inscripción…");
  nuevaPagina();
  cabecera("Siguiente paso", "Tu cupo en la próxima cohorte");

  const altoPanel = 86;
  asegurar(altoPanel + 10);
  relleno(BLANCO);
  doc.roundedRect(MARGEN, y, ANCHO, altoPanel, 3.5, 3.5, "F");
  trazo(LINEA);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGEN, y, ANCHO, altoPanel, 3.5, 3.5, "S");
  relleno(acento);
  doc.rect(MARGEN, y, 3.5, altoPanel, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.meta);
  tinta(acento);
  doc.setCharSpace(0.9);
  doc.text("CERTIFICADO DIGITAL VERIFICABLE", MARGEN + 10, y + 11);
  doc.setCharSpace(0);

  doc.setFontSize(16);
  tinta(TINTA);
  doc.text("Inscríbete y certifícate", MARGEN + 10, y + 23);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.2);
  tinta(GRIS);
  const textoCierre = medirLineas(
    "Al completar los módulos recibes tu certificado digital con código de verificación y campus virtual con las clases y material usado para que puedas practicar durante el curso. Las clases son 100% en vivo por Zoom.",
    ANCHO - 24,
    9.2,
    "normal",
    5
  );
  dibujarLineas(textoCierre, MARGEN + 10, y + 28, 9.2, 1.36);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(TIPO.cuerpo);
  tinta(acento);
  doc.text(`programbi.com${data.inscripcionUrl}`, MARGEN + 10, y + altoPanel - 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(TIPO.meta);
  tinta(TENUE);
  const contacto = data.whatsappUrl
    ? `WhatsApp: ${data.whatsappUrl.replace(
        /^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i,
        ""
      )}`
    : `Temario y precios · ${data.paisNombre}`;
  doc.text(contacto, PAGE_W - MARGEN - 10, y + altoPanel - 13, {
    align: "right",
  });

  try {
    doc.link(MARGEN + 10, y + altoPanel - 18, ANCHO - 20, 10, {
      url: enlaceInscripcion,
    });
  } catch {
    // Sin enlace, el texto sigue siendo legible.
  }

  y += altoPanel + 10;

  const resumen: Array<{ etiqueta: string; valor: string }> = [
    { etiqueta: "Inversión", valor: data.precioFormateado },
    { etiqueta: `${data.cuotas} cuotas sin interés`, valor: data.cuotaTexto },
    {
      etiqueta: "Próximo inicio",
      valor: data.schedules[0]?.fecha ?? "Por confirmar",
    },
    { etiqueta: "Modalidad", valor: "100% en vivo por Zoom" },
  ];

  const anchoResumen = (ANCHO - 6) / 2;
  const altoResumen = 26;

  asegurar(2 * altoResumen + 8);

  resumen.forEach((dato, indice) => {
    const columna = indice % 2;
    const fila = Math.floor(indice / 2);
    const x = MARGEN + columna * (anchoResumen + 6);
    const top = y + fila * (altoResumen + 4);

    relleno(BLANCO);
    trazo(LINEA);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, top, anchoResumen, altoResumen, 2.4, 2.4, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(TIPO.meta);
    tinta(TENUE);
    doc.text(
      ajustarTexto(doc, dato.etiqueta.toUpperCase(), anchoResumen - 10),
      x + 5,
      top + 8
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(TIPO.tarjeta);
    tinta(TINTA);
    doc.text(ajustarTexto(doc, dato.valor, anchoResumen - 10), x + 5, top + 17.5);
  });

  y += 2 * altoResumen + 8;

  parrafo(
    `Precios en ${data.moneda} para ${data.paisNombre}. ${data.notaPago}`,
    { tam: 9.2, color: TENUE, maximo: 4 }
  );

  pintarPies();
  options?.onProgress?.({ current: totalPasos, total: totalPasos, label: "PDF listo" });

  return doc;
}


// ── Cierre común ─────────────────────────────────────────────────────────────

function finalizarPdf(
  doc: JsPdfDocument,
  data: CourseBrochureData,
  options?: { returnBlobUrl?: boolean }
): string | void {
  // Metadatos que muestran los visores de PDF al abrir o compartir el archivo.
  const tituloPdf = `Temario y precios — ${data.title}`;
  doc.setProperties({
    title: tituloPdf,
    subject: tituloPdf,
    author: "ProgramBI",
    creator: "ProgramBI",
  });

  if (options?.returnBlobUrl) {
    return URL.createObjectURL(doc.output("blob"));
  }
  doc.save(brochurePdfFileName(data));
}

/**
 * Genera el temario y precios del curso en A4 multipágina.
 *
 * Intenta primero la captura 1:1 de las hojas del visor y, ante cualquier
 * fallo, compone el respaldo vectorial con las imágenes reales. Devuelve la
 * URL del blob si `returnBlobUrl` está activo; si no, descarga el archivo.
 */
export async function generateCoursePdf(
  data: CourseBrochureData,
  options?: {
    sheetContainer?: HTMLElement | null;
    onProgress?: PdfProgressCallback;
    returnBlobUrl?: boolean;
  }
): Promise<string | void> {
  const { jsPDF } = await import("jspdf");

  const crearDocumento = (): JsPdfDocument =>
    new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

  const hojas = hojasDelBrochure(options?.sheetContainer ?? null);
  let doc: JsPdfDocument | null = null;

  if (hojas.length > 0) {
    try {
      doc = await construirPdfWysiwyg(crearDocumento(), hojas, options);
    } catch (error) {
      // Un PDF a medias es peor que un respaldo distinto: se rehace completo.
      if (typeof console !== "undefined") {
        console.warn(
          "[brochure-pdf] La captura 1:1 falló; se genera el respaldo vectorial.",
          error
        );
      }
      doc = null;
    }
  }

  if (!doc) {
    doc = await construirPdfVectorial(crearDocumento(), data, options);
  }

  return finalizarPdf(doc, data, options);
}
