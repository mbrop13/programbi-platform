"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { formatMoneda } from "@/lib/paises/precios";

export type OpcionCalculadora = {
  nombre: string;
  precio: number;
  horas: number;
  destacada?: boolean;
};

/**
 * Mini calculadora «precio ÷ horas de clase en vivo».
 * El precio viene fijado por la comparativa (dato citado); el usuario puede
 * mover las horas para ver cómo cambia el costo por hora.
 */
export default function CalculadoraPrecioHora({
  opciones,
  iso,
  nota,
}: {
  opciones: OpcionCalculadora[];
  iso: string;
  nota?: string;
}) {
  const [activa, setActiva] = useState(0);
  const [horas, setHoras] = useState<number[]>(() => opciones.map((opcion) => opcion.horas));
  const opcion = opciones[activa] ?? opciones[0];

  if (!opcion) return null;

  const horasActivas = horas[activa] ?? opcion.horas;
  const precioHora = horasActivas > 0 ? Math.round(opcion.precio / horasActivas) : null;
  const max = Math.max(40, opcion.horas + 20);

  const cambiarHoras = (valor: number) => {
    setHoras((prev) => prev.map((hora, index) => (index === activa ? valor : hora)));
  };

  return (
    <section
      aria-labelledby="calculadora-precio-hora"
      className="mt-12 rounded-[26px] border border-line-strong bg-paper p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-canvas">
          <Calculator size={17} aria-hidden />
        </span>
        <div>
          <h2 id="calculadora-precio-hora" className="text-xl font-bold tracking-tight text-ink">
            ¿Cuánto pagas por hora de clase en vivo?
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-mute">
            Precio del curso dividido por las horas en vivo. Mueve las horas para ver el efecto.
          </p>
        </div>
      </div>

      {opciones.length > 1 ? (
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Opción a calcular">
          {opciones.map((item, index) => (
            <button
              key={item.nombre}
              type="button"
              role="tab"
              aria-selected={index === activa}
              onClick={() => setActiva(index)}
              className={`h-9 rounded-full border px-4 text-sm font-semibold transition-colors ${
                index === activa
                  ? "border-ink bg-ink text-canvas"
                  : "border-line-strong bg-canvas text-ink hover:bg-wash"
              }`}
            >
              {item.nombre}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end">
        <div>
          <label htmlFor="horas-calculadora" className="text-xs font-bold uppercase tracking-wide text-mute">
            Horas en vivo
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              id="horas-calculadora"
              type="range"
              min={1}
              max={max}
              step={1}
              value={horasActivas}
              onChange={(event) => cambiarHoras(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-ink"
            />
            <span className="w-14 shrink-0 text-right text-lg font-bold tabular-nums text-ink">
              {horasActivas} h
            </span>
          </div>
          <p className="mt-2 text-xs text-faint">
            {formatMoneda(iso, opcion.precio)} ÷ {horasActivas} h ={" "}
            <strong className="text-ink">
              {precioHora != null ? `${formatMoneda(iso, precioHora)} por hora` : "—"}
            </strong>
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-canvas px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-mute">Resultado</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-ink">
            {precioHora != null ? formatMoneda(iso, precioHora) : "—"}
          </p>
          <p className="text-xs text-mute">por hora de clase en vivo</p>
        </div>
      </div>

      {nota ? <p className="mt-4 text-xs leading-relaxed text-faint">{nota}</p> : null}
    </section>
  );
}
