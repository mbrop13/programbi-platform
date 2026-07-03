import type { SupabaseClient } from "@supabase/supabase-js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_INLINE_TEXT = 20_000; // caracteres máximos que se inlinean al prompt

// MIME types cuyo contenido textual se puede inlinear al prompt
const TEXTUAL_TYPES = new Set([
  "text/plain",
  "text/csv",
  "text/markdown",
  "text/html",
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
  const mediaType = file.type || "application/octet-stream";

  if (file.size > MAX_FILE_SIZE) {
    return {
      url: "",
      name: file.name,
      mediaType,
      size: file.size,
      isImage: false,
      error: "El archivo excede el tamaño máximo de 10 MB.",
    };
  }

  if (!isAllowedType(mediaType)) {
    return {
      url: "",
      name: file.name,
      mediaType,
      size: file.size,
      isImage: false,
      error: `Tipo de archivo no soportado: ${mediaType}`,
    };
  }

  // Extraer texto de archivos textuales (antes de subir, leyendo del Blob)
  let text: string | undefined;
  const isImage = IMAGE_TYPES.has(mediaType);
  if (TEXTUAL_TYPES.has(mediaType)) {
    try {
      const raw = await file.text();
      text = raw.slice(0, MAX_INLINE_TEXT);
    } catch {
      // si no se puede leer como texto, se ignora
    }
  }

  // Path: profile_id/uuid.ext  →  RLS exige que la primera carpeta = auth.uid()
  const ext = file.name.split(".").pop() || "bin";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("ai-attachments")
    .upload(path, file, {
      contentType: mediaType,
      upsert: false,
    });

  if (uploadError) {
    return {
      url: "",
      name: file.name,
      mediaType,
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
    mediaType,
    size: file.size,
    isImage,
    text,
    error: mediaType === "application/pdf" ? "PDF almacenado (lectura de contenido próximamente)." : undefined,
  };
}
