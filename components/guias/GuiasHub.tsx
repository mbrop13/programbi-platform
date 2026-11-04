"use client";

import { useMemo, useState } from "react";
import GuiaCard from "@/components/guias/GuiaCard";
import type { Guia } from "@/lib/guias/tipos";

type Opcion = { valor: string; etiqueta: string };

/** Sin acentos ni mayúsculas, para que «analisis» encuentre «análisis». */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Hub de guías con buscador y filtros por país y curso.
 *
 * Es un componente de cliente, pero la primera renderización ocurre en el
 * servidor: el HTML inicial trae todas las tarjetas (SEO/GEO) y el filtro solo
 * oculta lo que ya está en el DOM. No hay fetch ni datos que dependan de JS.
 */
export default function GuiasHub({
  guias,
  paises,
  cursos,
  mostrarPais = true,
}: {
  guias: Guia[];
  paises: Opcion[];
  cursos: Opcion[];
  /** En las páginas de país no tiene sentido filtrar por país. */
  mostrarPais?: boolean;
}) {
  const [texto, setTexto] = useState("");
  const [pais, setPais] = useState("todos");
  const [curso, setCurso] = useState("todos");

  const visibles = useMemo(() => {
    const q = normalizar(texto.trim());
    return guias.filter((guia) => {
      if (pais !== "todos" && guia.country !== pais) return false;
      if (curso !== "todos" && guia.course !== curso) return false;
      if (!q) return true;
      return normalizar(`${guia.h1} ${guia.description} ${guia.course}`).includes(q);
    });
  }, [guias, pais, curso, texto]);

  const chip = (activo: boolean) =>
    `inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-medium transition-colors ${
      activo ? "border-ink bg-ink text-canvas" : "border-line-strong bg-paper text-ink hover:border-ink/30"
    }`;

  return (
    <div>
      <div className="rounded-[26px] border border-line bg-paper px-4 py-4 sm:px-5">
        <label htmlFor="buscar-guia" className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Buscar en las guías
        </label>
        <input
          id="buscar-guia"
          type="search"
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder="Power BI, sueldos, SQL, certificado…"
          className="mt-2 h-11 w-full rounded-full border border-line-strong bg-canvas px-4 text-sm text-ink outline-none placeholder:text-faint focus:border-ink"
        />

        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">País</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" aria-pressed={pais === "todos"} onClick={() => setPais("todos")} className={chip(pais === "todos")}>
              Todos
            </button>
            {paises.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                aria-pressed={pais === opcion.valor}
                onClick={() => setPais(opcion.valor)}
                className={chip(pais === opcion.valor)}
              >
                {opcion.etiqueta}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Curso</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" aria-pressed={curso === "todos"} onClick={() => setCurso("todos")} className={chip(curso === "todos")}>
              Todos
            </button>
            {cursos.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                aria-pressed={curso === opcion.valor}
                onClick={() => setCurso(opcion.valor)}
                className={chip(curso === opcion.valor)}
              >
                {opcion.etiqueta}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-mute">
        {visibles.length === guias.length
          ? `${guias.length} guías`
          : `${visibles.length} de ${guias.length} guías`}
      </p>

      <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((guia) => (
          <li key={guia.path}>
            <GuiaCard guia={guia} />
          </li>
        ))}
      </ul>

      {visibles.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 text-sm text-mute">
          No hay guías con esos filtros. Prueba con otro curso o quita la búsqueda.
        </p>
      ) : null}
    </div>
  );
}
