"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import GuiaCard from "@/components/guias/GuiaCard";
import { ISO_CHILE } from "@/config/paises";
import {
  agruparPorCurso,
  filtrarGuias,
  type Opcion,
  type TarjetaGuia,
} from "@/lib/guias/hub";
import { rutaLocal } from "@/lib/paises/rutas";

const TODOS = "todos";

/** Lee los filtros de la URL. Solo se llama en efectos, nunca en SSR. */
function leerFiltros(mostrarPais: boolean, paises: Opcion[], cursos: Opcion[]) {
  const params = new URLSearchParams(window.location.search);
  const paisUrl = params.get("pais");
  const cursoUrl = params.get("curso");
  return {
    pais:
      mostrarPais &&
      paisUrl &&
      (paisUrl === TODOS || paises.some((opcion) => opcion.valor === paisUrl))
        ? paisUrl
        : TODOS,
    curso:
      cursoUrl && (cursoUrl === TODOS || cursos.some((opcion) => opcion.valor === cursoUrl))
        ? cursoUrl
        : TODOS,
    texto: params.get("q") ?? "",
  };
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={`inline-flex min-h-10 max-w-full items-center whitespace-normal rounded-full border px-4 py-2 text-left text-[13px] font-medium leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:min-h-9 sm:px-3.5 ${
        activo
          ? "border-ink bg-ink text-canvas"
          : "border-line-strong bg-paper text-ink hover:border-ink/30"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Hub de guías con buscador y filtros por país y curso.
 *
 * Decisión de render: la página sigue siendo estática y la primera
 * renderización ocurre en el servidor con todas las tarjetas (SEO/GEO). Leer
 * `searchParams` en el servidor obligaría a render dinámico por request y a
 * repetir la lista completa en cada visita; un formulario nativo tampoco
 * filtraría sin volver a renderizar. Por eso el filtro solo oculta tarjetas
 * que ya están en el DOM y el estado se sincroniza con la URL después de
 * hidratar: los enlaces con ?pais=&curso=&q= se comparten y sobreviven al
 * botón atrás.
 */
export default function GuiasHub({
  guias,
  paises,
  cursos,
  mostrarPais = true,
  iso = ISO_CHILE,
}: {
  guias: TarjetaGuia[];
  paises: Opcion[];
  cursos: Opcion[];
  /** En las páginas de país no tiene sentido filtrar por país. */
  mostrarPais?: boolean;
  /** Mercado de la página, para enlazar ficha de curso y precios. */
  iso?: string;
}) {
  const [texto, setTexto] = useState("");
  const [pais, setPais] = useState(TODOS);
  const [curso, setCurso] = useState(TODOS);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const iniciales = leerFiltros(mostrarPais, paises, cursos);
    setPais(iniciales.pais);
    setCurso(iniciales.curso);
    setTexto(iniciales.texto);
    setListo(true);
  }, [mostrarPais, paises, cursos]);

  useEffect(() => {
    if (!listo) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("pais");
    url.searchParams.delete("curso");
    url.searchParams.delete("q");

    if (mostrarPais && pais !== TODOS) url.searchParams.set("pais", pais);
    if (curso !== TODOS) url.searchParams.set("curso", curso);
    if (texto.trim()) url.searchParams.set("q", texto.trim());

    // Se conserva el state de Next: reemplazarlo por null rompe su historial.
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
  }, [listo, mostrarPais, pais, curso, texto]);

  useEffect(() => {
    if (!listo) return;
    function alVolver() {
      const filtros = leerFiltros(mostrarPais, paises, cursos);
      setPais(filtros.pais);
      setCurso(filtros.curso);
      setTexto(filtros.texto);
    }
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, [listo, mostrarPais, paises, cursos]);

  const visibles = useMemo(() => filtrarGuias(guias, { pais, curso, q: texto }), [guias, pais, curso, texto]);
  const grupos = useMemo(() => agruparPorCurso(visibles, cursos), [visibles, cursos]);
  const hayFiltros = texto.trim() !== "" || (mostrarPais && pais !== TODOS) || curso !== TODOS;

  function limpiar() {
    setTexto("");
    setPais(TODOS);
    setCurso(TODOS);
  }

  return (
    <div>
      <form
        role="search"
        aria-label="Buscar y filtrar guías"
        onSubmit={(event) => event.preventDefault()}
        className="rounded-[26px] border border-line bg-paper px-4 py-4 sm:px-5"
      >
        <label htmlFor="buscar-guia" className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Buscar en las guías
        </label>
        <p id="ayuda-busqueda" className="sr-only">
          Busca por título, descripción, curso o país.
        </p>
        <div className="relative mt-2">
          <Search
            size={16}
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint"
          />
          <input
            id="buscar-guia"
            type="search"
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
            placeholder="Power BI, sueldos, SQL, certificado…"
            aria-controls="resultados-guias"
            aria-describedby="ayuda-busqueda"
            autoComplete="off"
            enterKeyHint="search"
            className="h-11 w-full rounded-full border border-line-strong bg-canvas pl-10 pr-10 text-sm text-ink outline-none placeholder:text-faint focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          />
          {texto ? (
            <button
              type="button"
              onClick={() => setTexto("")}
              aria-label="Borrar la búsqueda"
              className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-mute transition-colors hover:bg-wash hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <X size={15} aria-hidden />
            </button>
          ) : null}
        </div>

        {mostrarPais ? (
          <fieldset className="mt-4 min-w-0 border-0 p-0">
            <legend className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
              Filtrar por país
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip activo={pais === TODOS} onClick={() => setPais(TODOS)}>
                Todos
              </Chip>
              {paises.map((opcion) => (
                <Chip
                  key={opcion.valor}
                  activo={pais === opcion.valor}
                  onClick={() => setPais(opcion.valor)}
                >
                  {opcion.etiqueta}
                </Chip>
              ))}
            </div>
          </fieldset>
        ) : null}

        <fieldset className="mt-4 min-w-0 border-0 p-0">
          <legend className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
            Filtrar por curso
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip activo={curso === TODOS} onClick={() => setCurso(TODOS)}>
              Todos
            </Chip>
            {cursos.map((opcion) => (
              <Chip
                key={opcion.valor}
                activo={curso === opcion.valor}
                onClick={() => setCurso(opcion.valor)}
              >
                {opcion.etiqueta}
              </Chip>
            ))}
          </div>
        </fieldset>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-mute">
          {hayFiltros ? `${visibles.length} de ${guias.length} guías` : `${guias.length} guías`}
        </p>
        {hayFiltros ? (
          <button
            type="button"
            onClick={limpiar}
            className="text-sm font-medium text-ink underline underline-offset-4 hover:text-ink/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      <div
        id="resultados-guias"
        role="region"
        aria-label="Resultados de guías"
        className="mt-4"
      >
        {visibles.length === 0 ? (
          <div className="rounded-[26px] border border-line bg-paper px-5 py-6">
            <p className="text-base font-semibold text-ink">
              {texto.trim()
                ? `No encontramos guías para «${texto.trim()}».`
                : "No encontramos guías con esos filtros."}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-mute">
              Prueba con otro curso, cambia el país o quita la búsqueda. También puedes revisar el catálogo
              completo o los precios vigentes.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <button
                type="button"
                onClick={limpiar}
                className="font-medium text-ink underline underline-offset-4 hover:text-ink/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              >
                Limpiar filtros
              </button>
              <Link href={rutaLocal(iso, "/cursos")} className="font-medium text-ink underline underline-offset-4">
                Ver cursos
              </Link>
              <Link href={rutaLocal(iso, "/precios")} className="font-medium text-ink underline underline-offset-4">
                Ver precios
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {grupos.map((grupo, indice) => {
              const rutaCurso = grupo.curso === "general" ? null : rutaLocal(iso, `/cursos/${grupo.curso}`);
              return (
                <section key={grupo.curso} aria-labelledby={`curso-${grupo.curso}`}>
                  <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-line pb-3">
                    <div className="min-w-0">
                      {indice === 0 && !hayFiltros ? (
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-faint">
                          Empieza por aquí
                        </p>
                      ) : null}
                      <h2
                        id={`curso-${grupo.curso}`}
                        className="text-pretty break-words text-lg font-bold tracking-tight text-ink"
                      >
                        {grupo.nombre}
                      </h2>
                      <p className="mt-0.5 text-xs text-faint">
                        {grupo.guias.length} {grupo.guias.length === 1 ? "guía" : "guías"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                      {rutaCurso ? (
                        <Link
                          href={rutaCurso}
                          className="inline-flex items-center gap-1 font-medium text-ink no-underline hover:underline"
                        >
                          Ver curso <ArrowRight size={13} aria-hidden />
                        </Link>
                      ) : null}
                      <Link
                        href={rutaLocal(iso, "/precios")}
                        className="font-medium text-ink no-underline hover:underline"
                      >
                        Precios
                      </Link>
                    </div>
                  </div>
                  <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {grupo.guias.map((guia) => (
                      <li key={guia.path} className="min-w-0">
                        <GuiaCard guia={guia} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
