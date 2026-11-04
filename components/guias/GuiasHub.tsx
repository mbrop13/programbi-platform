"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import GuiaCard from "@/components/guias/GuiaCard";
import { ISO_CHILE } from "@/config/paises";
import { agruparPorCurso, filtrarGuias, type Opcion } from "@/lib/guias/hub";
import { rutaLocal } from "@/lib/paises/rutas";
import type { Guia } from "@/lib/guias/tipos";

const TODOS = "todos";

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
      className={`inline-flex h-10 items-center rounded-full border px-4 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:h-9 sm:px-3.5 ${
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
 * La primera renderización ocurre en el servidor: el HTML inicial trae todas
 * las tarjetas (SEO/GEO) y el filtro solo oculta lo que ya está en el DOM. El
 * estado se lee y se escribe en la URL del navegador después de hidratar, así
 * que la página sigue siendo estática y los enlaces con ?pais=&curso=&q= se
 * pueden compartir.
 */
export default function GuiasHub({
  guias,
  paises,
  cursos,
  mostrarPais = true,
  iso = ISO_CHILE,
}: {
  guias: Guia[];
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
    const params = new URLSearchParams(window.location.search);
    const paisUrl = params.get("pais");
    const cursoUrl = params.get("curso");
    const textoUrl = params.get("q") ?? "";

    if (mostrarPais && paisUrl && (paisUrl === TODOS || paises.some((opcion) => opcion.valor === paisUrl))) {
      setPais(paisUrl);
    }
    if (cursoUrl && (cursoUrl === TODOS || cursos.some((opcion) => opcion.valor === cursoUrl))) {
      setCurso(cursoUrl);
    }
    setTexto(textoUrl);
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

    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [listo, mostrarPais, pais, curso, texto]);

  useEffect(() => {
    if (!listo) return;
    function alVolver() {
      const params = new URLSearchParams(window.location.search);
      const paisUrl = params.get("pais");
      const cursoUrl = params.get("curso");
      setPais(
        mostrarPais && paisUrl && (paisUrl === TODOS || paises.some((opcion) => opcion.valor === paisUrl))
          ? paisUrl
          : TODOS
      );
      setCurso(
        cursoUrl && (cursoUrl === TODOS || cursos.some((opcion) => opcion.valor === cursoUrl))
          ? cursoUrl
          : TODOS
      );
      setTexto(params.get("q") ?? "");
    }
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, [listo, mostrarPais, paises, cursos]);

  const visibles = useMemo(() => filtrarGuias(guias, { pais, curso, q: texto }), [guias, pais, curso, texto]);
  const grupos = useMemo(() => agruparPorCurso(visibles), [visibles]);
  const hayFiltros = texto.trim() !== "" || (mostrarPais && pais !== TODOS) || curso !== TODOS;

  function limpiar() {
    setTexto("");
    setPais(TODOS);
    setCurso(TODOS);
  }

  return (
    <div>
      <div className="rounded-[26px] border border-line bg-paper px-4 py-4 sm:px-5">
        <label htmlFor="buscar-guia" className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
          Buscar en las guías
        </label>
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
            <legend className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">País</legend>
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
          <legend className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Curso</legend>
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
      </div>

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

      <div id="resultados-guias" className="mt-4">
        {visibles.length === 0 ? (
          <div className="rounded-[26px] border border-line bg-paper px-5 py-6">
            <p className="text-base font-semibold text-ink">No encontramos guías con esos filtros.</p>
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
            {grupos.map((grupo) => {
              const rutaCurso = grupo.curso === "general" ? null : rutaLocal(iso, `/cursos/${grupo.curso}`);
              return (
                <section key={grupo.curso} aria-labelledby={`curso-${grupo.curso}`}>
                  <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-line pb-3">
                    <div>
                      <h2
                        id={`curso-${grupo.curso}`}
                        className="text-lg font-bold tracking-tight text-ink"
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
                      <li key={guia.path}>
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
