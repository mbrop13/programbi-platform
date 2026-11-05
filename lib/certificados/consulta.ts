import "server-only";

import { createAdminClient } from "@/lib/supabase/server";
import { esCodigoCertificadoValido, normalizarCodigoCertificado } from "./codigo";

/**
 * Datos públicos de un certificado. El email del alumno NUNCA forma parte de
 * esta selección: la ficha pública no lo necesita y no debe filtrarse.
 */
export type CertificadoVerificado = {
  student_name: string;
  course_title: string;
  certificate_code: string;
  issued_at: string | null;
};

/** Columnas permitidas en la lectura pública. No agregar `email` ni `user_id`. */
const COLUMNAS_PUBLICAS = "student_name, course_title, certificate_code, issued_at";

/**
 * Busca un certificado por su código de validación con service_role, porque la
 * RLS de `certificates` solo permite leer los certificados propios.
 *
 * Devuelve `null` si el código no existe. Los errores de base de datos se
 * propagan como excepción para no disfrazar una caída con un 404.
 */
export async function obtenerCertificadoPorCodigo(
  codigo: string
): Promise<CertificadoVerificado | null> {
  const normalizado = normalizarCodigoCertificado(codigo);
  if (!esCodigoCertificadoValido(normalizado)) return null;

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("certificates")
    .select(COLUMNAS_PUBLICAS)
    .eq("certificate_code", normalizado)
    .limit(1);

  if (error) {
    console.error("certificados: error al consultar por código", error.code);
    throw new Error("No se pudo verificar el certificado");
  }

  const exacto = data?.[0] as CertificadoVerificado | undefined;
  if (exacto) return exacto;

  // Los códigos escritos a mano en el panel o en el CSV pueden estar en
  // minúsculas. `ilike` sin comodines equivale a igualdad case-insensitive; el
  // formato ya descartó `%` y `_`, así que no hay riesgo de patrón.
  const { data: alternativo, error: errorAlternativo } = await supabase
    .from("certificates")
    .select(COLUMNAS_PUBLICAS)
    .ilike("certificate_code", normalizado)
    .limit(1);

  if (errorAlternativo) {
    console.error("certificados: error al consultar por código (case-insensitive)", errorAlternativo.code);
    throw new Error("No se pudo verificar el certificado");
  }

  return (alternativo?.[0] as CertificadoVerificado | undefined) ?? null;
}
