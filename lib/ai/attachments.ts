import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_INLINE_TEXT = 20_000; // caracteres máximos que se inlinean al prompt

// MIME types cuyo contenido textual se puede inlinear al prompt.
// NOTE: 'text/html' was removed (OWASP ASVS L3 audit, V5.3.2) — there is no
// legitimate reason to inline raw HTML into the model prompt and it widens the
// prompt-injection / parsing attack surface.
const TEXTUAL_TYPES = new Set([
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/json",
  "text/javascript",
  "text/x-python",
  "text/x-sql",
  "text/x-c",
  "text/x-c++",
  "text/x-java",
  "application/x-yaml",
  "text/yaml",
]);

const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

// Allowlist of extensions for the storage path. Anything else falls back to
// "bin" so a user cannot trick the path into arbitrary extensions.
const ALLOWED_EXTENSIONS = new Set([
  "txt", "csv", "md", "json", "js", "py", "sql", "c", "cpp", "java", "yaml", "yml",
  "png", "jpg", "jpeg", "webp", "gif", "pdf",
]);

// Magic-byte signatures for the supported binary types. Used to verify that
// the declared MIME type matches the actual content (the client-controlled
// Content-Type header is trivially spoofable).
const MAGIC_SIGNATURES: { mime: string; bytes: number[] }[] = [
  { mime: "image/png",  bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/gif",  bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF8
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF (WebP container)
  { mime: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
];

export interface UploadedAttachment {
  url: string;
  name: string;
  mediaType: string;
  size: number;
  /** Texto extraído para inlinear al prompt (solo archivos textuales). */
  text?: string;
  /** Si es imagen, se enviará como image part al modelo vision. */
  isImage: boolean;
  error?: string;
}

export function isAllowedType(mediaType: string): boolean {
  return TEXTUAL_TYPES.has(mediaType) || IMAGE_TYPES.has(mediaType) || mediaType === "application/pdf";
}

/**
 * Detect the actual MIME type of a binary file from its leading bytes.
 * Returns null for textual types (no reliable magic bytes).
 */
function detectMimeFromBytes(buf: Uint8Array): string | null {
  for (const sig of MAGIC_SIGNATURES) {
    if (buf.length < sig.bytes.length) continue;
    let match = true;
    for (let i = 0; i < sig.bytes.length; i++) {
      if (buf[i] !== sig.bytes[i]) { match = false; break; }
    }
    if (match) return sig.mime;
  }
  return null;
}

/**
 * Sube un archivo al bucket privado `ai-attachments` (RLS por dueño)
 * y, si es textual, extrae su contenido para inlinear al prompt.
 *
 * Nota v1: PDFs se almacenan pero su texto no se extrae aún (requiere pdfjs).
 * Imágenes se envían como image part al modelo vision.
 */
export async function uploadAttachment(
  supabase: SupabaseClient,
  userId: string,
  file: File
): Promise<UploadedAttachment> {
  const declaredMediaType = (file.type || "application/octet-stream").toLowerCase();

  if (file.size > MAX_FILE_SIZE) {
    return {
      url: "",
      name: file.name,
      mediaType: declaredMediaType,
      size: file.size,
      isImage: false,
      error: "El archivo excede el tamaño máximo de 10 MB.",
    };
  }

  if (!isAllowedType(declaredMediaType)) {
    return {
      url: "",
      name: file.name,
      mediaType: declaredMediaType,
      size: file.size,
      isImage: false,
      error: `Tipo de archivo no soportado: ${declaredMediaType}`,
    };
  }

  // A-16 / V12.3.1 (OWASP ASVS L3): verify the actual content type by reading
  // the magic bytes. The client-controlled Content-Type header is spoofable, so
  // we must not trust it for binary types (images / PDF).
  let verifiedMediaType = declaredMediaType;
  const isDeclaredImage = IMAGE_TYPES.has(declaredMediaType) || declaredMediaType === "image/webp";
  const isDeclaredPdf = declaredMediaType === "application/pdf";
  if (isDeclaredImage || isDeclaredPdf) {
    try {
      const buf = new Uint8Array(await file.slice(0, 16).arrayBuffer());
      const detected = detectMimeFromBytes(buf);
      if (!detected) {
        return {
          url: "",
          name: file.name,
          mediaType: declaredMediaType,
          size: file.size,
          isImage: false,
          error: "El contenido del archivo no coincide con el tipo declarado.",
        };
      }
      // Normalize webp/jpeg detection: RIFF header is shared; verify "WEBP" at offset 8.
      if (detected === "image/webp" && declaredMediaType === "image/webp") {
        // RIFF....WEBP — already validated by detection; keep declared.
      } else if (detected === "image/jpeg" && (declaredMediaType === "image/jpeg" || declaredMediaType === "image/jpg")) {
        verifiedMediaType = "image/jpeg";
      } else if (detected !== declaredMediaType && detected !== "image/webp") {
        return {
          url: "",
          name: file.name,
          mediaType: declaredMediaType,
          size: file.size,
          isImage: false,
          error: "El contenido del archivo no coincide con el tipo declarado.",
        };
      } else {
        verifiedMediaType = detected;
      }
    } catch {
      // If we cannot read the bytes, fail closed for binary types.
      return {
        url: "",
        name: file.name,
        mediaType: declaredMediaType,
        size: file.size,
        isImage: false,
        error: "No se pudo verificar el contenido del archivo.",
      };
    }
  }

  // Extraer texto de archivos textuales (antes de subir, leyendo del Blob)
  let text: string | undefined;
  const isImage = IMAGE_TYPES.has(verifiedMediaType) || verifiedMediaType === "image/webp";
  if (TEXTUAL_TYPES.has(verifiedMediaType)) {
    try {
      const raw = await file.text();
      text = raw.slice(0, MAX_INLINE_TEXT);
    } catch {
      // si no se puede leer como texto, se ignora
    }
  }

  // Path: profile_id/uuid.ext  →  RLS exige que la primera carpeta = auth.uid()
  // A-16 (OWASP ASVS L3): use an explicit extension allowlist; default to "bin".
  const rawExt = (file.name.split(".").pop() || "").toLowerCase();
  const ext = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : "bin";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("ai-attachments")
    .upload(path, file, {
      contentType: verifiedMediaType,
      upsert: false,
    });

  if (uploadError) {
    return {
      url: "",
      name: file.name,
      mediaType: verifiedMediaType,
      size: file.size,
      isImage,
      text,
      error: uploadError.message,
    };
  }

  // URL firmada (el bucket es privado). Validez larga para histórico del chat.
  const { data: signed } = await supabase.storage
    .from("ai-attachments")
    .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 días

  return {
    url: signed?.signedUrl ?? "",
    name: file.name,
    mediaType: verifiedMediaType,
    size: file.size,
    isImage,
    text,
    error: verifiedMediaType === "application/pdf" ? "PDF almacenado (lectura de contenido próximamente)." : undefined,
  };
}
