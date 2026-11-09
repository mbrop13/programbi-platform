"use client";

/**
 * Generador del brochure PDF en el navegador.
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
 *    brochure con `rect`, `text` y `line`, siempre con las imágenes reales
 *    (logo, hero, retratos, logos de empresas y capturas de proyectos). La
 *    estética replica el papel crema del sitio.
 *
 * No se usa `autoTable` (no está instalado) y todos los activos son locales
 * (`/images/...`, `/logo.png`), así que nunca dependemos de CORS remoto.
 */

import { brochurePdfFileName } from "@/lib/brochure/brochure-assets";
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
const FONDO_HEX = "#FAF9F5";

// ── Paleta editorial ─────────────────────────────────────────────────────────

const PAPEL: RGB = [250, 249, 245];
const TINTA: RGB = [24, 24, 22];
const GRIS: RGB = [92, 91, 86];
const TENUE: RGB = [124, 123, 116];
const BLANCO: RGB = [255, 255, 255];
const LINEA: RGB = [228, 226, 219];
const LAVADO: RGB = [240, 238, 232];

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
    const imagen = canvas.toDataURL("image/jpeg", 0.94);
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

async function construirPdfVectorial(
  doc: JsPdfDocument,
  data: CourseBrochureData,
  options?: { onProgress?: PdfProgressCallback }
): Promise<JsPdfDocument> {
  const acento = aRgb(data.accentColor);
  const acentoSuave = tinte(acento, 0.1);
  const acentoBorde = tinte(acento, 0.32);

  const totalPasos = 7;
  let paso = 0;
  const avisar = (label: string): void => {
    paso += 1;
    options?.onProgress?.({
      current: Math.min(paso, totalPasos),
      total: totalPasos,
      label,
    });
  };

  avisar("Cargando imágenes del brochure…");

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
    doc.setFontSize(15);
    tinta(TINTA);
    doc.text("ProgramBI", x, top + h * 0.72);
  };

  /** Cabecera mínima (logo + filete) que llevan todas las páginas. */
  const marcaDePagina = (): void => {
    marcaProgramBI(MARGEN, 10, 26, 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.2);
    tinta(TENUE);
    doc.setCharSpace(0.7);
    doc.text(
      `BROCHURE · ${data.paisNombre.toUpperCase()}`,
      PAGE_W - MARGEN,
      16,
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

  const cabecera = (
    kicker: string,
    titulo: string,
    subtitulo?: string
  ): void => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.2);
    tinta(acento);
    doc.setCharSpace(0.9);
    doc.text(kicker.toUpperCase(), MARGEN, y + 4);
    doc.setCharSpace(0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    tinta(TINTA);
    const tituloLineas = recortar(lineasDe(doc, titulo, ANCHO), 2);
    doc.text(tituloLineas, MARGEN, y + 11);

    let cursor = y + 11 + tituloLineas.length * (18 * 0.3528 * 1.15);

    if (subtitulo) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.2);
      tinta(GRIS);
      const subLineas = recortar(lineasDe(doc, subtitulo, ANCHO), 2);
      doc.text(subLineas, MARGEN, cursor + 4);
      cursor += 4 + subLineas.length * (8.2 * 0.3528 * 1.3);
    }

    cursor += 4;
    trazo(LINEA);
    doc.setLineWidth(0.3);
    doc.line(MARGEN, cursor, PAGE_W - MARGEN, cursor);
    y = cursor + 8;
  };

  const tituloSeccion = (texto: string, nota?: string): void => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    tinta(TINTA);
    doc.text(texto, MARGEN, y);
    y += 6;
    if (nota) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.2);
      tinta(TENUE);
      doc.text(recortar(lineasDe(doc, nota, ANCHO), 2), MARGEN, y);
      y += 4.2;
    }
  };

  const pintarPies = (): void => {
    const paginas = doc.getNumberOfPages();
    for (let pagina = 1; pagina <= paginas; pagina += 1) {
      doc.setPage(pagina);
      trazo(LINEA);
      doc.setLineWidth(0.3);
      doc.line(MARGEN, PIE_Y, PAGE_W - MARGEN, PIE_Y);
      relleno(acento);
      doc.rect(MARGEN, PIE_Y - 1.3, 10, 0.8, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      tinta(TENUE);
      doc.text(
        `ProgramBI · programbi.com · Página ${pagina} de ${paginas}`,
        MARGEN,
        PIE_Y + 4.4
      );
      doc.setFontSize(6.6);
      doc.text(`Actualizado ${data.actualizado}`, PAGE_W - MARGEN, PIE_Y + 4.4, {
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
  doc.setFontSize(7);
  tinta(GRIS);
  doc.setCharSpace(0.9);
  doc.text("BROCHURE OFICIAL", PAGE_W - MARGEN, 16, { align: "right" });
  doc.setCharSpace(0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  tinta(TENUE);
  doc.text(`Actualizado ${data.actualizado}`, PAGE_W - MARGEN, 21, {
    align: "right",
  });

  trazo(LINEA);
  doc.setLineWidth(0.4);
  doc.line(MARGEN, 27, PAGE_W - MARGEN, 27);

  y = 36;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.4);
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
  y += 9;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  tinta(TINTA);
  const tituloPortada = recortar(lineasDe(doc, data.title, ANCHO), 3);
  doc.text(tituloPortada, MARGEN, y);
  y += tituloPortada.length * (22 * 0.3528 * 1.12) + 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.4);
  tinta(GRIS);
  const resumenPortada = recortar(
    lineasDe(doc, data.shortDescription, ANCHO - 4),
    3
  );
  doc.text(resumenPortada, MARGEN, y);
  y += resumenPortada.length * (9.4 * 0.3528 * 1.35) + 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  const insigniaLineas = recortar(lineasDe(doc, data.insignia, ANCHO - 12), 2);
  const altoInsignia = 6 + insigniaLineas.length * 3.4;
  relleno(acentoSuave);
  doc.roundedRect(MARGEN, y, ANCHO, altoInsignia, 2.2, 2.2, "F");
  relleno(acento);
  doc.rect(MARGEN, y, 1.5, altoInsignia, "F");
  tinta(TINTA);
  doc.text(insigniaLineas, MARGEN + 5, y + 4.6);
  y += altoInsignia + 8;

  const metricas: Array<{ valor: string; etiqueta: string }> = [
    {
      valor: `${data.hours}`,
      etiqueta: data.levelsCount > 1 ? "horas por nivel" : "horas en vivo",
    },
    { valor: `${data.modulesCount}`, etiqueta: "módulos" },
    {
      valor: `${data.levelsCount}`,
      etiqueta: data.levelsCount === 1 ? "nivel" : "niveles",
    },
    { valor: "100%", etiqueta: "en vivo por Zoom" },
  ];

  const altoHero = 68;
  const anchoHero = 106;
  const anchoStats = ANCHO - anchoHero - 4;
  const xStats = MARGEN + anchoHero + 4;

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
    doc.setFontSize(9.5);
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
    doc.setFontSize(13.5);
    tinta(TINTA);
    doc.text(metrica.valor, xStats + 5, top + 7.6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    tinta(GRIS);
    doc.text(ajustarTexto(doc, metrica.etiqueta, anchoStats - 9), xStats + 5, top + 12.2);
  });

  y += altoHero + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  tinta(TENUE);
  doc.setCharSpace(0.8);
  doc.text("CÓMO SE APRENDE EN PROGRAMBI", MARGEN, y);
  doc.setCharSpace(0);
  y += 5;

  const pilares = data.methodologyPillars.slice(0, 4);
  const anchoPilar = (ANCHO - 5) / 2;
  pilares.forEach((pilar, indice) => {
    const columna = indice % 2;
    const fila = Math.floor(indice / 2);
    const x = MARGEN + columna * (anchoPilar + 5);
    const py = y + fila * 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.4);
    tinta(acento);
    doc.text(pilar.step, x, py + 4);

    doc.setFontSize(9);
    tinta(TINTA);
    doc.text(ajustarTexto(doc, pilar.title, anchoPilar - 9), x + 8, py + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.9);
    tinta(GRIS);
    const descripcion = recortar(
      lineasDe(doc, pilar.description, anchoPilar - 8),
      3
    );
    doc.text(descripcion, x + 8, py + 8.6);
  });
  y += Math.ceil(pilares.length / 2) * 25;

  // ── 2. Inversión ───────────────────────────────────────────────────────────

  avisar("Componiendo la inversión…");
  nuevaPagina();
  cabecera(
    "Inversión",
    "Un precio claro, en la moneda de tu país",
    `Valores vigentes para ${data.paisNombre}. El monto incluye el programa completo y el acceso al campus.`
  );

  const conLista = Boolean(data.precioListaFormateado);
  const altoPrecio = conLista ? 54 : 44;
  relleno(BLANCO);
  doc.roundedRect(MARGEN, y, ANCHO, altoPrecio, 3, 3, "F");
  trazo(LINEA);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGEN, y, ANCHO, altoPrecio, 3, 3, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  tinta(GRIS);
  doc.text(`Precio oficial en ${data.paisNombre}`, MARGEN + 7, y + 9);

  const largoPrecio = data.precioFormateado.length;
  const tamPrecio = largoPrecio > 18 ? 16 : largoPrecio > 12 ? 21 : 26;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(tamPrecio);
  tinta(TINTA);
  doc.text(
    ajustarTexto(doc, data.precioFormateado, ANCHO - 60),
    MARGEN + 7,
    y + (conLista ? 25 : 24)
  );

  if (data.precioListaFormateado) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.4);
    tinta(TENUE);
    doc.text(limpiarTexto(data.precioListaFormateado), MARGEN + 7, y + 35);
    const anchoLista = doc.getTextWidth(limpiarTexto(data.precioListaFormateado));
    trazo(TENUE);
    doc.setLineWidth(0.3);
    doc.line(MARGEN + 7, y + 33.8, MARGEN + 7 + anchoLista, y + 33.8);

    if (data.descuentoPct > 0) {
      relleno(acentoSuave);
      doc.roundedRect(PAGE_W - MARGEN - 44, y + 25, 36, 10, 2, 2, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.2);
      tinta(acento);
      doc.text(
        `${data.descuentoPct}% de descuento`,
        PAGE_W - MARGEN - 26,
        y + 31.4,
        { align: "center" }
      );
    }
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  tinta(TENUE);
  doc.text(
    limpiarTexto(`Moneda: ${data.moneda} (${data.simbolo})`),
    MARGEN + 7,
    y + altoPrecio - 5
  );
  y += altoPrecio + 8;

  const altoCuotas = 30;
  relleno(acentoSuave);
  doc.roundedRect(MARGEN, y, ANCHO, altoCuotas, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.4);
  tinta(acento);
  doc.text(`${data.cuotas} cuotas sin interés`, MARGEN + 7, y + 8);
  doc.setFontSize(11.6);
  tinta(TINTA);
  doc.text(
    ajustarTexto(doc, data.cuotaTexto, ANCHO - 14),
    MARGEN + 7,
    y + 16
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  tinta(GRIS);
  doc.text(
    recortar(lineasDe(doc, data.notaCuotas, ANCHO - 14), 2),
    MARGEN + 7,
    y + 22
  );
  y += altoCuotas + 9;

  tituloSeccion("Medios de pago disponibles");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  let chipX = MARGEN;
  let chipY = y;
  const altoChip = 7.5;

  for (const medio of data.mediosPago) {
    const anchoChip = doc.getTextWidth(medio) + 8;
    if (chipX + anchoChip > PAGE_W - MARGEN) {
      chipX = MARGEN;
      chipY += altoChip + 2;
    }
    relleno(BLANCO);
    trazo(LINEA);
    doc.setLineWidth(0.25);
    doc.roundedRect(chipX, chipY - 4.8, anchoChip, altoChip, 3.6, 3.6, "FD");
    tinta(TINTA);
    doc.text(medio, chipX + 4, chipY);
    chipX += anchoChip + 2.5;
  }
  y = chipY + 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  tinta(TENUE);
  const notaPagoLineas = recortar(lineasDe(doc, data.notaPago, ANCHO), 3);
  doc.text(notaPagoLineas, MARGEN, y);
  y += notaPagoLineas.length * 3.6 + 7;

  const altoInscripcion = 26;
  relleno(TINTA);
  doc.roundedRect(MARGEN, y, ANCHO, altoInscripcion, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(255, 255, 255);
  doc.text("Inscripción en línea", MARGEN + 7, y + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.4);
  doc.setTextColor(205, 204, 198);
  doc.text(`programbi.com${data.inscripcionUrl}`, MARGEN + 7, y + 15.5);
  if (data.whatsappUrl) {
    doc.text(
      `WhatsApp: ${data.whatsappUrl.replace(
        /^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i,
        ""
      )}`,
      MARGEN + 7,
      y + 21
    );
  }
  try {
    doc.link(MARGEN + 7, y + 12, ANCHO - 14, 10, { url: enlaceInscripcion });
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
    const altoVacio = 30;
    relleno(acentoSuave);
    doc.roundedRect(MARGEN, y, ANCHO, altoVacio, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    tinta(TINTA);
    doc.text("Cupos abiertos · consulta fecha", MARGEN + 7, y + 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.8);
    tinta(GRIS);
    doc.text(
      recortar(
        lineasDe(
          doc,
          "La próxima cohorte se confirma por WhatsApp o al inscribirte en línea. Escríbenos y te avisamos con la fecha exacta y el horario de tu país.",
          ANCHO - 14
        ),
        2
      ),
      MARGEN + 7,
      y + 18
    );
    y += altoVacio + 8;
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    tinta(TINTA);
    doc.text("Cohortes confirmadas", MARGEN, y);
    y += 7;

    for (const cohorte of data.schedules.slice(0, 6)) {
      asegurar(19);
      relleno(BLANCO);
      doc.roundedRect(MARGEN, y, ANCHO, 17, 2.4, 2.4, "F");
      trazo(LINEA);
      doc.setLineWidth(0.25);
      doc.roundedRect(MARGEN, y, ANCHO, 17, 2.4, 2.4, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.6);
      tinta(TENUE);
      doc.text(
        ajustarTexto(doc, cohorte.nivel.toUpperCase(), ANCHO - 84),
        MARGEN + 6,
        y + 5.6
      );

      doc.setFontSize(9);
      tinta(TINTA);
      doc.text(
        ajustarTexto(doc, cohorte.fecha, ANCHO - 84),
        MARGEN + 6,
        y + 10.6
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      tinta(GRIS);
      doc.text(
        ajustarTexto(
          doc,
          `${cohorte.dias}${cohorte.hours ? ` · ${cohorte.hours} horas` : ""}`,
          ANCHO - 84
        ),
        MARGEN + 6,
        y + 14.6
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.6);
      tinta(acento);
      doc.text(ajustarTexto(doc, cohorte.horario, 68), PAGE_W - MARGEN - 6, y + 7.4, {
        align: "right",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.6);
      tinta(TENUE);
      doc.text(
        ajustarTexto(doc, cohorte.horaChile, 68),
        PAGE_W - MARGEN - 6,
        y + 12.2,
        { align: "right" }
      );

      y += 19;
    }
    y += 3;
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

  asegurar(46);
  tituloSeccion(
    "La misma clase en cada mercado",
    `Hora de inicio en ${data.paisNombre}: ${data.equivalencias.inicio} (${data.equivalencias.offset}) · término ${data.equivalencias.fin}`
  );

  const altoFila = 7.4;
  relleno(LAVADO);
  doc.rect(MARGEN, y, ANCHO, altoFila, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  tinta(GRIS);
  doc.text("MERCADO", MARGEN + 4, y + 4.9);
  doc.text("HORA DE INICIO", PAGE_W - MARGEN - 4, y + 4.9, { align: "right" });
  y += altoFila;

  filasHorario.forEach((fila, indice) => {
    asegurar(altoFila + 2);
    if (indice % 2 === 0) {
      relleno(BLANCO);
      doc.rect(MARGEN, y, ANCHO, altoFila, "F");
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    tinta(TINTA);
    doc.text(fila.mercado, MARGEN + 4, y + 4.9);
    doc.setFont("helvetica", "bold");
    doc.text(fila.hora, PAGE_W - MARGEN - 4, y + 4.9, { align: "right" });
    trazo(LINEA);
    doc.setLineWidth(0.2);
    doc.line(MARGEN, y + altoFila, PAGE_W - MARGEN, y + altoFila);
    y += altoFila;
  });
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  tinta(TENUE);
  const notaHorario = recortar(
    lineasDe(
      doc,
      "Los horarios respetan el horario de verano de cada país y se confirman al inscribirte. Si no puedes asistir en vivo, la clase queda grabada en el campus.",
      ANCHO
    ),
    3
  );
  doc.text(notaHorario, MARGEN, y);
  y += notaHorario.length * 3.5 + 4;

  // ── 4. Proyectos y certificado ─────────────────────────────────────────────

  avisar("Componiendo proyectos y certificado…");
  nuevaPagina();
  cabecera(
    "Proyectos reales",
    "Así se ve lo que vas a construir",
    "Capturas reales de clases y proyectos guiados. Cada módulo termina en un entregable que puedes mostrar."
  );

  const anchoCaptura = 82;
  const altoCaptura = 42;

  galeria.forEach((captura, indice) => {
    const top = y + indice * (altoCaptura + 4);

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
      doc.setFontSize(8);
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
    doc.setFontSize(6.4);
    tinta(acento);
    doc.setCharSpace(0.7);
    doc.text(`PROYECTO ${String(indice + 1).padStart(2, "0")}`, textoX, top + 7);
    doc.setCharSpace(0);

    doc.setFontSize(9.4);
    tinta(TINTA);
    doc.text(ajustarTexto(doc, captura.title, anchoTexto), textoX, top + 14.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    tinta(GRIS);
    doc.text(
      recortar(lineasDe(doc, captura.subtitle, anchoTexto), 3),
      textoX,
      top + 20.5
    );
  });

  y += galeria.length * (altoCaptura + 4) + 2;

  const altoCertificado = 56;
  relleno(TINTA);
  doc.roundedRect(MARGEN, y, ANCHO, altoCertificado, 3.5, 3.5, "F");
  relleno(acento);
  doc.rect(MARGEN, y, 3.5, altoCertificado, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.6);
  doc.setTextColor(176, 175, 168);
  doc.setCharSpace(0.9);
  doc.text("CERTIFICADO DIGITAL VERIFICABLE", MARGEN + 10, y + 10);
  doc.setCharSpace(0);

  doc.setFontSize(13.5);
  doc.setTextColor(255, 255, 255);
  doc.text("Termina con un certificado que puedes mostrar", MARGEN + 10, y + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(198, 197, 191);
  const textoCertificado = recortar(
    lineasDe(
      doc,
      "Al completar los módulos recibes tu certificado digital con código de verificación, acceso permanente a las grabaciones y el material del curso.",
      ANCHO - 78
    ),
    3
  );
  doc.text(textoCertificado, MARGEN + 10, y + 27);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.6);
  doc.setTextColor(255, 255, 255);
  doc.text("programbi.com", MARGEN + 10, y + altoCertificado - 10);

  trazo([255, 255, 255]);
  doc.setLineWidth(0.5);
  doc.circle(PAGE_W - MARGEN - 27, y + 27, 14, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("PB", PAGE_W - MARGEN - 27, y + 29, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5);
  doc.setTextColor(190, 189, 183);
  doc.text("PROGRAMBI", PAGE_W - MARGEN - 27, y + 34, { align: "center" });

  y += altoCertificado + 8;

  // ── 5. Equipo docente y empresas ───────────────────────────────────────────

  avisar("Componiendo el equipo docente…");
  nuevaPagina();
  cabecera(
    "Equipo docente",
    "Quién te enseña",
    "Profesionales en ejercicio que dictan lo mismo que aplican en banca, minería y retail."
  );

  const anchoTarjeta = (ANCHO - 2 * 5) / 3;
  const altoFoto = anchoTarjeta * 1.2;
  const altoTarjeta = altoFoto + 34;

  profesores.forEach((profesor, indice) => {
    const x = MARGEN + indice * (anchoTarjeta + 5);

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
      doc.circle(x + anchoTarjeta / 2, y + altoFoto / 2, 10.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      tinta(acento);
      doc.text(iniciales(profesor.name), x + anchoTarjeta / 2, y + altoFoto / 2 + 1.6, {
        align: "center",
      });
    }

    let textoY = y + altoFoto + 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.4);
    tinta(TINTA);
    doc.text(ajustarTexto(doc, profesor.name, anchoTarjeta - 8), x + 4, textoY);
    textoY += 4.6;

    doc.setFontSize(6.8);
    tinta(acento);
    doc.text(ajustarTexto(doc, profesor.role, anchoTarjeta - 8), x + 4, textoY);
    textoY += 3.6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.6);
    tinta(GRIS);
    doc.text(
      recortar(lineasDe(doc, profesor.title, anchoTarjeta - 8), 2),
      x + 4,
      textoY
    );
    textoY += 2 * 3 + 2.4;

    doc.setFontSize(6.3);
    tinta(TENUE);
    for (const credencial of profesor.credentials.slice(0, 2)) {
      doc.text(
        `· ${ajustarTexto(doc, credencial, anchoTarjeta - 10)}`,
        x + 4,
        textoY
      );
      textoY += 3.1;
    }
  });

  y += altoTarjeta + 10;
  tituloSeccion("Empresas que capacitaron a sus equipos");

  const columnasLogo = 6;
  const separacion = 2.4;
  const celdaW = (ANCHO - separacion * (columnasLogo - 1)) / columnasLogo;
  const celdaH = 15;

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
      doc.setFontSize(5.4);
      tinta(TENUE);
      doc.text(
        ajustarTexto(doc, empresa.name, celdaW - 4),
        x + celdaW / 2,
        top + celdaH / 2 + 1,
        { align: "center" }
      );
    }
  });

  y += 2 * celdaH + separacion + 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  tinta(TENUE);
  const nombresEmpresas = recortar(
    lineasDe(doc, data.empresas.join(" · "), ANCHO),
    2
  );
  doc.text(nombresEmpresas, MARGEN, y);
  y += nombresEmpresas.length * 3.2 + 2;

  // ── 6. Temario completo ────────────────────────────────────────────────────

  avisar("Componiendo el temario…");
  nuevaPagina();
  cabecera(
    "Programa académico",
    "Todo lo que vas a dominar",
    `${data.modulesCount} módulos en ${data.levelsCount} ${
      data.levelsCount === 1 ? "nivel" : "niveles"
    }. Cada módulo combina clase en vivo, práctica guiada y proyecto.`
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
    doc.setFontSize(7.6);

    let altoMaximo = 0;
    columnas.forEach((columna, indice) => {
      const x = MARGEN + indice * (anchoColumna + 8);
      let cursor = y;
      for (const item of columna) {
        const lineas = recortar(lineasDe(doc, item, anchoColumna - 5), 2);
        relleno(acento);
        doc.circle(x + 1, cursor - 1, 0.7, "F");
        tinta(GRIS);
        doc.text(lineas, x + 4, cursor);
        cursor += lineas.length * 3.4 + 1.2;
      }
      altoMaximo = Math.max(altoMaximo, cursor - y);
    });

    y += altoMaximo + 6;
  }

  const dibujarModulo = (modulo: BrochureModulo): void => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.8);
    const tituloLineas = recortar(lineasDe(doc, modulo.title, ANCHO - 30), 2);
    const altoCabecera = tituloLineas.length * 4 + 3;

    if (y + altoCabecera + 9 > LIMITE) nuevaPagina();

    tinta(TINTA);
    doc.text(tituloLineas, MARGEN + 4, y);

    if (modulo.hours) {
      const etiqueta = `${modulo.hours} h`;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.4);
      const anchoEtiqueta = doc.getTextWidth(etiqueta) + 7;
      relleno(acentoSuave);
      doc.roundedRect(
        PAGE_W - MARGEN - anchoEtiqueta,
        y - 3.2,
        anchoEtiqueta,
        5.4,
        1.6,
        1.6,
        "F"
      );
      tinta(acento);
      doc.text(
        etiqueta,
        PAGE_W - MARGEN - anchoEtiqueta / 2,
        y + 0.6,
        { align: "center" }
      );
    }

    y += altoCabecera;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.6);

    for (const tema of modulo.topics) {
      const lineas = recortar(lineasDe(doc, tema, ANCHO - 14), 4);
      const altoTema = lineas.length * 3.3 + 1.1;

      if (y + altoTema > LIMITE) {
        nuevaPagina();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.8);
        tinta(GRIS);
        doc.text(
          ajustarTexto(doc, `${modulo.title} (continuación)`, ANCHO),
          MARGEN + 4,
          y
        );
        y += 5.4;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.6);
      }

      tinta(acentoBorde);
      doc.text("·", MARGEN + 6, y);
      tinta(GRIS);
      doc.text(lineas, MARGEN + 9, y);
      y += altoTema;
    }

    y += 4;
  };

  for (const nivel of data.temario) {
    if (y + 26 > LIMITE) nuevaPagina();

    relleno(LAVADO);
    doc.roundedRect(MARGEN, y, ANCHO, 12, 2.2, 2.2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    tinta(TINTA);
    doc.text(ajustarTexto(doc, nivel.label, ANCHO - 46), MARGEN + 5, y + 8);
    if (nivel.shortLabel) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.2);
      tinta(GRIS);
      doc.text(
        limpiarTexto(nivel.shortLabel),
        PAGE_W - MARGEN - 5,
        y + 8,
        { align: "right" }
      );
    }
    y += 12 + 6;

    for (const modulo of nivel.modules) {
      dibujarModulo(modulo);
    }

    y += 2;
  }

  // ── 7. Cierre e inscripción ────────────────────────────────────────────────

  nuevaPagina();
  cabecera("Siguiente paso", "Tu cupo en la próxima cohorte");

  const altoPanel = 78;
  relleno(TINTA);
  doc.roundedRect(MARGEN, y, ANCHO, altoPanel, 3.5, 3.5, "F");
  relleno(acento);
  doc.rect(MARGEN, y, 3.5, altoPanel, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.6);
  doc.setTextColor(176, 175, 168);
  doc.setCharSpace(0.9);
  doc.text("CERTIFICADO DIGITAL VERIFICABLE", MARGEN + 10, y + 10);
  doc.setCharSpace(0);

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("Inscríbete y certifícate", MARGEN + 10, y + 21);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.6);
  doc.setTextColor(198, 197, 191);
  const textoCierre = recortar(
    lineasDe(
      doc,
      "Al completar los módulos recibes tu certificado digital con código de verificación, el acceso permanente a las grabaciones y el material del curso. Las clases son 100% en vivo por Zoom.",
      ANCHO - 22
    ),
    3
  );
  doc.text(textoCierre, MARGEN + 10, y + 29);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.4);
  doc.setTextColor(255, 255, 255);
  doc.text(`programbi.com${data.inscripcionUrl}`, MARGEN + 10, y + altoPanel - 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(176, 175, 168);
  const contacto = data.whatsappUrl
    ? `WhatsApp: ${data.whatsappUrl.replace(
        /^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i,
        ""
      )}`
    : `Brochure ${data.paisNombre}`;
  doc.text(contacto, PAGE_W - MARGEN - 10, y + altoPanel - 12, {
    align: "right",
  });

  try {
    doc.link(MARGEN + 10, y + altoPanel - 17, ANCHO - 20, 9, {
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

  const anchoResumen = (ANCHO - 5) / 2;
  resumen.forEach((dato, indice) => {
    const columna = indice % 2;
    const fila = Math.floor(indice / 2);
    const x = MARGEN + columna * (anchoResumen + 5);
    const top = y + fila * 26;

    relleno(BLANCO);
    trazo(LINEA);
    doc.setLineWidth(0.25);
    doc.roundedRect(x, top, anchoResumen, 22, 2.4, 2.4, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.6);
    tinta(TENUE);
    doc.text(
      ajustarTexto(doc, dato.etiqueta.toUpperCase(), anchoResumen - 10),
      x + 5,
      top + 7
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.6);
    tinta(TINTA);
    doc.text(
      ajustarTexto(doc, dato.valor, anchoResumen - 10),
      x + 5,
      top + 14.5
    );
  });

  y += 2 * 26 + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  tinta(TENUE);
  const notaFinal = recortar(
    lineasDe(
      doc,
      `Precios en ${data.moneda} para ${data.paisNombre}. ${data.notaPago}`,
      ANCHO
    ),
    3
  );
  doc.text(notaFinal, MARGEN, y + 4);

  pintarPies();
  options?.onProgress?.({ current: 7, total: 7, label: "PDF listo" });

  return doc;
}

// ── Cierre común ─────────────────────────────────────────────────────────────

function finalizarPdf(
  doc: JsPdfDocument,
  data: CourseBrochureData,
  options?: { returnBlobUrl?: boolean }
): string | void {
  if (options?.returnBlobUrl) {
    return URL.createObjectURL(doc.output("blob"));
  }
  doc.save(brochurePdfFileName(data));
}

/**
 * Genera el brochure del curso en A4 multipágina.
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
