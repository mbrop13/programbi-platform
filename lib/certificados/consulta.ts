import "server-only";

import { createAdminClient } from "@/lib/supabase/server";
import { esCodigoCertificadoValido, normalizarCodigoCertificado } from "./codigo";

/**
 * Datos públicos de un certificado. El email del alumno NUNCA forma parte de
 * esta selección: la ficha pública no lo necesita y no debe filtrarse.
 */
export type CertificadoVerificado = {
  student_name: string | null;
  course_title: string | null;
  certificate_code: string;
  issued_at: string | null;
};

/** Esquema completo (migración 20260708000000 aplicada). */
const COLUMNAS_COMPLETAS = "student_name, course_title, certificate_code, issued_at";
/** Esquema original de `certificates`, que es el que está vivo hoy en Supabase. */
const COLUMNAS_LEGACY = "certificate_code, issued_at, user_id, course_id";

/** Postgres undefined_column / PostgREST column-not-found. */
const ERROR_COLUMNA_INEXISTENTE = new Set(["42703", "PGRST204"]);

type FilaCompleta = {
  student_name: string | null;
  course_title: string | null;
  certificate_code: string;
  issued_at: string | null;
};

type FilaLegacy = {
  certificate_code: string;
  issued_at: string | null;
  user_id: string | null;
  course_id: string | null;
};

/**
 * Busca un certificado por su código de validación con service_role, porque la
 * RLS de `certificates` solo permite leer los certificados propios.
 *
 * La base de producción todavía no tiene aplicada la migración que agrega
 * `student_name` y `course_title` a `certificates`. Para no romper la
 * verificación pública, se intenta el esquema completo y, si esas columnas no
 * existen, se resuelven el curso (`courses.title`) y el alumno
 * (`profiles.full_name`) por sus llaves. Nada de eso expone el email.
 *
 * Devuelve `null` si el código no existe. Los errores de base de datos que no
 * sean de esquema se propagan para no disfrazar una caída con un 404.
 */
export async function obtenerCertificadoPorCodigo(
  codigo: string
): Promise<CertificadoVerificado | null> {
  const normalizado = normalizarCodigoCertificado(codigo);
  if (!esCodigoCertificadoValido(normalizado)) return null;

  const supabase = createAdminClient();

  // `ilike` sin comodines equivale a igualdad case-insensitive: el formato del
  // código ya descartó `%` y `_`, así que no puede convertirse en patrón.
  const completo = await supabase
    .from("certificates")
    .select(COLUMNAS_COMPLETAS)
    .ilike("certificate_code", normalizado)
    .limit(1);

  if (!completo.error) {
    return (completo.data?.[0] as FilaCompleta | undefined) ?? null;
  }

  if (!ERROR_COLUMNA_INEXISTENTE.has(completo.error.code ?? "")) {
    console.error("certificados: error al consultar por codigo", completo.error.code);
    throw new Error("No se pudo verificar el certificado");
  }

  const legacy = await supabase
    .from("certificates")
    .select(COLUMNAS_LEGACY)
    .ilike("certificate_code", normalizado)
    .limit(1);

  if (legacy.error) {
    console.error("certificados: error al consultar por codigo (esquema base)", legacy.error.code);
    throw new Error("No se pudo verificar el certificado");
  }

  const fila = (legacy.data?.[0] as FilaLegacy | undefined) ?? null;
  if (!fila) return null;

  let course_title: string | null = null;
  if (fila.course_id) {
    const curso = await supabase
      .from("courses")
      .select("title")
      .eq("id", fila.course_id)
      .limit(1);
    if (!curso.error) {
      course_title = (curso.data?.[0] as { title?: string } | undefined)?.title ?? null;
    }
  }

  let student_name: string | null = null;
  if (fila.user_id) {
    const perfil = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", fila.user_id)
      .limit(1);
    if (!perfil.error) {
      student_name = (perfil.data?.[0] as { full_name?: string } | undefined)?.full_name ?? null;
    }
  }

  return {
    student_name,
    course_title,
    certificate_code: fila.certificate_code,
    issued_at: fila.issued_at ?? null,
  };
}
