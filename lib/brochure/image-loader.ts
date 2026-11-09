"use client";

/**
 * Cargador universal de imágenes a PNG base64 para el brochure.
 *
 * La captura con `html-to-image` y el PDF necesitan que cada `<img>` del DOM
 * tenga un `src` `data:` same-origin: sin CORS, sin URLs firmadas que caducan y
 * sin que el navegador vuelva a elegir una variante de `srcset`. Este módulo
 * descarga cualquier imagen, la decodifica, la reescala si supera `maxSize` y
 * la devuelve como PNG con fondo transparente.
 *
 * Solo corre en cliente (`Image`, `<canvas>` y `toDataURL`) y cachea por
 * `src` + `maxSize` para no decodificar dos veces el mismo logo.
 */

export type LoadedImage = {
  dataUrl: string;
  width: number;
  height: number;
};

/** Lado mayor máximo por defecto: suficiente para A4 a 300 dpi sin explotar memoria. */
const DEFAULT_MAX_SIZE = 1600;
/** Tope de espera por imagen (descarga + decodificación). */
const LOAD_TIMEOUT_MS = 15_000;
/** Imágenes que se inlinean en paralelo para no saturar el navegador. */
const INLINE_CONCURRENCY = 6;
const DATA_IMAGE_PATTERN = /^data:image\//i;

/**
 * Una entrada por `src` + `maxSize`. Se guarda la promesa, no el resultado,
 * para que dos llamadas simultáneas compartan una única decodificación.
 */
const imageCache = new Map<string, Promise<LoadedImage | null>>();

function normalizeMaxSize(value: number | undefined): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.max(1, Math.floor(value));
  }
  return DEFAULT_MAX_SIZE;
}

function imageCacheKey(src: string, maxSize: number): string {
  return `${maxSize}|${src}`;
}

function createImageElement(src: string): HTMLImageElement {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";
  img.src = src;
  return img;
}

/**
 * Espera a que la imagen esté descargada y decodificada.
 *
 * Prefiere `decode()` (decodifica fuera del hilo de pintado) y cae a los eventos
 * `load`/`error` cuando el navegador no lo ofrece. Todo el proceso, descarga
 * incluida, queda acotado por `timeoutMs`.
 */
function waitForImage(img: HTMLImageElement, timeoutMs: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const hasDimensions = (): boolean =>
      img.naturalWidth > 0 && img.naturalHeight > 0;

    const finish = (error?: Error): void => {
      if (settled) return;
      settled = true;
      if (timer !== undefined) clearTimeout(timer);
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
      if (error) reject(error);
      else resolve();
    };

    function handleLoad(): void {
      if (hasDimensions()) finish();
    }

    function handleError(): void {
      finish(new Error("No se pudo descargar la imagen"));
    }

    timer = setTimeout(() => {
      finish(new Error("Tiempo de espera agotado al cargar la imagen"));
    }, timeoutMs);

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    // Puede estar completa antes de registrar los listeners (cache del
    // navegador o data URL); en ese caso no habrá ningún evento posterior.
    if (img.complete) {
      if (hasDimensions()) finish();
      else finish(new Error("La imagen no expone dimensiones"));
      return;
    }

    if (typeof img.decode === "function") {
      img.decode().then(
        () => {
          if (hasDimensions()) finish();
          else finish(new Error("La imagen decodificada no expone dimensiones"));
        },
        () => {
          // Algunos navegadores rechazan `decode()` de forma espuria; dejan que
          // `load`/`error` o el timeout decidan.
        }
      );
    }
  });
}

/**
 * Pinta la imagen en un canvas transparente y la exporta como PNG.
 * Escala solo hacia abajo: si el lado mayor ya cabe en `maxSize`, no se agranda.
 */
function drawImageAsPng(
  img: HTMLImageElement,
  width: number,
  height: number,
  maxSize: number
): LoadedImage | null {
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  // Lienzo transparente: no se pinta fondo para no tapar el diseño del brochure.
  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  let dataUrl: string;
  try {
    dataUrl = canvas.toDataURL("image/png");
  } catch {
    // Canvas contaminado (imagen cross-origin sin cabeceras CORS).
    return null;
  }

  // `toDataURL` devuelve "data:," cuando el canvas no tiene contenido útil.
  if (!dataUrl.startsWith("data:image/")) return null;

  return { dataUrl, width: targetWidth, height: targetHeight };
}

/**
 * Descarga `src` y la devuelve como PNG base64 con sus dimensiones finales.
 *
 * Nunca lanza: cualquier fallo (URL vacía, error de red, timeout, canvas
 * contaminado) resuelve `null`. Los fallos se eliminan del cache para permitir
 * reintentos; los éxitos se reutilizan hasta `clearImageCache()`.
 */
export async function loadImageAsPngDataUrl(
  src: string,
  options?: { maxSize?: number }
): Promise<LoadedImage | null> {
  if (typeof src !== "string" || src.trim().length === 0) return null;

  const maxSize = normalizeMaxSize(options?.maxSize);
  const key = imageCacheKey(src, maxSize);
  const cached = imageCache.get(key);
  if (cached) return cached;

  const job = (async (): Promise<LoadedImage | null> => {
    try {
      if (typeof window === "undefined" || typeof document === "undefined") {
        return null;
      }

      const img = createImageElement(src);
      await waitForImage(img, LOAD_TIMEOUT_MS);

      const width = img.naturalWidth;
      const height = img.naturalHeight;
      if (width <= 0 || height <= 0) return null;

      // Un data URL ya es el resultado final: se decodifica para conocer sus
      // medidas, pero se devuelve intacto para no perder calidad ni alfa.
      if (DATA_IMAGE_PATTERN.test(src)) {
        return { dataUrl: src, width, height };
      }

      return drawImageAsPng(img, width, height, maxSize);
    } catch {
      return null;
    }
  })();

  imageCache.set(key, job);

  const result = await job;
  if (result === null && imageCache.get(key) === job) {
    imageCache.delete(key);
  }
  return result;
}

/**
 * Inlinea una sola `<img>`. Cualquier fallo se ignora para no abortar el resto.
 */
async function inlineImage(img: HTMLImageElement): Promise<void> {
  try {
    const rawSrc = img.getAttribute("src");
    if (!rawSrc || rawSrc.trim().length === 0) return;
    if (DATA_IMAGE_PATTERN.test(rawSrc.trim())) return;

    // Congela la URL ya elegida y quita `srcset`/`sizes` antes de cargar para
    // que el navegador no resuelva otra variante distinta.
    const source = img.currentSrc || img.src || rawSrc.trim();
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");

    const loaded = await loadImageAsPngDataUrl(source);
    if (!loaded) return;

    img.src = loaded.dataUrl;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");

    // Espera el repintado para que `html-to-image` capture el DOM ya resuelto.
    if (typeof img.decode === "function") {
      await img.decode().catch(() => undefined);
    }
  } catch {
    // Una imagen rota nunca debe abortar la captura del brochure.
  }
}

/**
 * Reemplaza por PNG base64 todas las `<img>` pendientes dentro de `root`.
 *
 * Salta las que ya son `data:image/` y las que no tienen `src`. Procesa como
 * máximo 6 imágenes a la vez y no rechaza si alguna falla.
 */
export async function inlineAllImagesInElement(root: HTMLElement): Promise<void> {
  if (!root || typeof root.querySelectorAll !== "function") return;

  const images = Array.from(root.querySelectorAll("img")).filter((img) => {
    const rawSrc = img.getAttribute("src");
    if (!rawSrc || rawSrc.trim().length === 0) return false;
    return !DATA_IMAGE_PATTERN.test(rawSrc.trim());
  });

  if (images.length === 0) return;

  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(INLINE_CONCURRENCY, images.length) },
    async () => {
      while (cursor < images.length) {
        const img = images[cursor];
        cursor += 1;
        if (!img) continue;
        await inlineImage(img);
      }
    }
  );

  await Promise.all(workers);
}

/** Vacía el cache en memoria para forzar una nueva descarga de todas las imágenes. */
export function clearImageCache(): void {
  imageCache.clear();
}
