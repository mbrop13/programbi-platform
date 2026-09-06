"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Es lo mismo que un curso abierto?",
    a: "No. El curso abierto es un cupo individual, con fechas públicas. Acá armamos un programa para tu equipo: horarios, casos y facturación a la empresa.",
  },
  {
    q: "¿Trabajan con los datos de la empresa?",
    a: "Sí. Adaptamos los ejercicios a sus tablas, KPIs y procesos. El objetivo es que el equipo salga haciendo el trabajo real, no un laboratorio genérico.",
  },
  {
    q: "¿Cuánta gente puede participar?",
    a: "Desde un área chica hasta un grupo más grande. Lo vemos en la conversación: nivel, objetivo y calendario.",
  },
  {
    q: "¿Es online o presencial?",
    a: "Las dos, según el caso. La mayoría es en vivo por Zoom, en horario Chile. Si el equipo está en un mismo lugar, se puede hacer presencial.",
  },
  {
    q: "¿Y si también necesitamos el tablero, no solo la capacitación?",
    a: "Esta página es para formar al equipo. Si además hay que construir el reporte, lo conversamos y se cotiza aparte. No es un pack cerrado.",
  },
  {
    q: "¿Facturan a la empresa?",
    a: "Sí. Factura electrónica, orden de compra si la necesitan y reporte de asistencia por persona.",
  },
];

export function EmpresasFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-10 divide-y divide-line border-y border-line">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium tracking-tight"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {item.q}
              <span className="text-faint" aria-hidden>
                {isOpen ? "–" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p className="pb-4 text-sm leading-relaxed text-mute">{item.a}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
