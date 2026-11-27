"use client";

import { useSyncExternalStore } from "react";

function texto(restanteMs: number): string {
  if (restanteMs <= 0) return "Terminó";
  const min = Math.floor(restanteMs / 60_000);
  const dias = Math.floor(min / 1440);
  const horas = Math.floor((min % 1440) / 60);
  const minutos = min % 60;
  if (dias >= 1) return `Quedan ${dias} ${dias === 1 ? "día" : "días"} y ${horas} h`;
  if (horas >= 1) return `Quedan ${horas} h ${minutos} min`;
  return `Quedan ${Math.max(1, minutos)} min`;
}

// Reloj compartido por todas las cuentas regresivas de la página: un solo intervalo.
const oyentes = new Set<() => void>();
let intervalo: number | null = null;

function suscribir(avisar: () => void) {
  oyentes.add(avisar);
  if (intervalo === null) {
    intervalo = window.setInterval(() => oyentes.forEach((o) => o()), 30_000);
  }
  return () => {
    oyentes.delete(avisar);
    if (oyentes.size === 0 && intervalo !== null) {
      window.clearInterval(intervalo);
      intervalo = null;
    }
  };
}

// El minuto actual: cambia como mucho una vez por minuto, así no re-renderiza de más.
const minutoActual = () => Math.floor(Date.now() / 60_000);
const sinReloj = () => null;

/**
 * Tiempo restante de la campaña. En el HTML del servidor muestra la fecha de término
 * (no hay forma de saber la hora del visitante); al cargar pasa a «Quedan 3 días y 4 h»
 * y se actualiza cada minuto. Sin animaciones: el texto cambia, nada parpadea.
 */
export function CuentaRegresiva({
  finMs,
  fallback,
  className,
}: {
  finMs: number;
  /** Texto mientras carga, p. ej. «Termina el lunes 30 de noviembre». */
  fallback: string;
  className?: string;
}) {
  const minuto = useSyncExternalStore<number | null>(suscribir, minutoActual, sinReloj);

  return (
    <span className={className} suppressHydrationWarning>
      {minuto === null ? fallback : texto(finMs - minuto * 60_000)}
    </span>
  );
}
