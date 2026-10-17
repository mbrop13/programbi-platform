import { getPais } from "@/config/paises";

/**
 * Solo cambia lo necesario para que suene natural.
 * El resto de la interfaz sigue en español neutro, en los componentes.
 * Argentina y Uruguay: voseo leve, únicamente en titulares y botones.
 */

export function etiquetaBoton(iso: string, neutro: string): string {
  const pais = getPais(iso);
  if (!pais.voseo) return neutro;
  if (neutro === "Registrarme" || neutro === "Registrarse") return "Registrate";
  if (neutro === "Inscribirse") return "Inscribite";
  if (neutro === "Inscríbete") return "Inscribite";
  return neutro;
}

/** Titulares y metas. No uses esto en párrafos largos. */
export function voseoTitular(iso: string, texto: string): string {
  const pais = getPais(iso);
  if (!pais.voseo) return texto;
  return texto
    .replaceAll("Inscríbete", "Inscribite")
    .replaceAll("Regístrate", "Registrate");
}

export function dispositivo(iso: string): "computador" | "computadora" {
  return getPais(iso).dispositivo;
}
