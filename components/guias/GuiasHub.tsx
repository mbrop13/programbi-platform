"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
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
const HERRAMIENTAS_ORDEN = [
  "IA",
  "Excel",
  "Power BI",
  "Power Automate",
  "SQL",
  "Python",
  "Google Sheets",
  "Carrera",
];
const NIVELES_ORDEN = ["Básico", "Intermedio", "Avanzado"];

/** Lee los filtros de la URL. Solo se llama en efectos, nunca en SSR. */
function leerFiltros(
  mostrarPais: boolean,
  paises: Opcion[],
  cursos: Opcion[],
  herramientas: string[],
  niveles: string[]
) {
  const params = new URLSearchParams(window.location.search);
  const paisUrl = params.get("pais");
  const cursoUrl = params.get("curso");
  const herramientaUrl = params.get("herramienta");
  const nivelUrl = params.get("nivel");
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
    herramienta:
      herramientaUrl && (herramientaUrl === TODOS || herramientas.includes(herramientaUrl))
        ? herramientaUrl
        : TODOS,
    nivel:
      nivelUrl && (nivelUrl === TODOS || niveles.includes(nivelUrl))
        ? nivelUrl
        : TODOS,
    texto: params.get("q") ?? "",
  };
}

/**
 * Hub de guías con buscador y filtros por país, curso, herramienta y nivel.
 *
 * Decisión de render: la página sigue siendo estática y la primera
 * renderización ocurre en el servidor con todas las tarjetas (SEO/GEO).
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
  const [herramienta, setHerramienta] = useState(TODOS);
  const [nivel, setNivel] = useState(TODOS);
  const [listo, setListo] = useState(false);
  const [filtrosMovilAbiertos, setFiltrosMovilAbiertos] = useState(false);

  const filtrosBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelFiltrosId = useId();
  const ayudaBusquedaId = useId();

  const herramientasDisponibles = useMemo(() => {
    const presentes = new Set(guias.map((g) => g.herramienta).filter((h): h is string => Boolean(h)));
    return HERRAMIENTAS_ORDEN.filter((h) => presentes.has(h));
  }, [guias]);

  const nivelesDisponibles = useMemo(() => {
    const presentes = new Set(guias.map((g) => g.nivel).filter((n): n is string => Boolean(n)));
    return NIVELES_ORDEN.filter((n) => presentes.has(n));
  }, [guias]);

  useEffect(() => {
    const iniciales = leerFiltros(
      mostrarPais,
      paises,
      cursos,
      herramientasDisponibles,
      nivelesDisponibles
    );
    setPais(iniciales.pais);
    setCurso(iniciales.curso);
    setHerramienta(iniciales.herramienta);
    setNivel(iniciales.nivel);
    setTexto(iniciales.texto);
    setListo(true);
  }, [mostrarPais, paises, cursos, herramientasDisponibles, nivelesDisponibles]);

  useEffect(() => {
    if (!listo) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("pais");
    url.searchParams.delete("curso");
    url.searchParams.delete("herramienta");
    url.searchParams.delete("nivel");
    url.searchParams.delete("q");

    if (mostrarPais && pais !== TODOS) url.searchParams.set("pais", pais);
    if (curso !== TODOS) url.searchParams.set("curso", curso);
    if (herramienta !== TODOS) url.searchParams.set("herramienta", herramienta);
    if (nivel !== TODOS) url.searchParams.set("nivel", nivel);
    if (texto.trim()) url.searchParams.set("q", texto.trim());

    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
  }, [listo, mostrarPais, pais, curso, herramienta, nivel, texto]);

  useEffect(() => {
    if (!listo) return;
    function alVolver() {
      const filtros = leerFiltros(
        mostrarPais,
        paises,
        cursos,
        herramientasDisponibles,
        nivelesDisponibles
      );
      setPais(filtros.pais);
      setCurso(filtros.curso);
      setHerramienta(filtros.herramienta);
      setNivel(filtros.nivel);
      setTexto(filtros.texto);
    }
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, [listo, mostrarPais, paises, cursos, herramientasDisponibles, nivelesDisponibles]);

  useEffect(() => {
    if (!filtrosMovilAbiertos) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFiltrosMovilAbiertos(false);
        filtrosBtnRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [filtrosMovilAbiertos]);

  const visibles = useMemo(
    () => filtrarGuias(guias, { pais, curso, herramienta, nivel, q: texto }),
    [guias, pais, curso, herramienta, nivel, texto]
  );
  const grupos = useMemo(() => agruparPorCurso(visibles, cursos), [visibles, cursos]);

  const conteoSelectsActivos =
    (mostrarPais && pais !== TODOS ? 1 : 0) +
    (curso !== TODOS ? 1 : 0) +
    (herramienta !== TODOS ? 1 : 0) +
    (nivel !== TODOS ? 1 : 0);

  const hayFiltros = texto.trim() !== "" || conteoSelectsActivos > 0;

  const destacadas = useMemo(() => {
    const prioridades = [
      "/guias/como-usar-claude-para-analisis-de-datos",
      "/mx/guias/como-usar-claude-para-analisis-de-datos",
      "/guias/como-aprender-power-bi-en-chile",
      "/guias/curso-claude-chile",
      "/guias/power-bi-vs-excel",
      "/guias/funciones-dax-mas-importantes",
      "/guias/curso-mercado-financiero-chile",
    ];
    const elegidas: TarjetaGuia[] = [];
    const vistos = new Set<string>();
    const usadasImg = new Set<string>();

    const agregar = (item: TarjetaGuia, exigirImagenUnica: boolean) => {
      if (vistos.has(item.path)) return;
      if (exigirImagenUnica && item.guideImage && usadasImg.has(item.guideImage)) return;
      vistos.add(item.path);
      if (item.guideImage) usadasImg.add(item.guideImage);
      elegidas.push(item);
    };

    for (const p of prioridades) {
      const hit = guias.find((g) => g.path === p);
      if (hit) agregar(hit, true);
      if (elegidas.length >= 4) break;
    }
    if (elegidas.length < 4) {
      for (const candidato of guias) {
        if (
          candidato.course === "claude" ||
          candidato.course === "power-bi" ||
          candidato.course === "analisis-de-datos" ||
          candidato.course === "python"
        ) {
          agregar(candidato, true);
        }
        if (elegidas.length >= 4) break;
      }
    }
    if (elegidas.length < 4) {
      for (const candidato of guias) {
        agregar(candidato, true);
        if (elegidas.length >= 4) break;
      }
    }
    if (elegidas.length < 4) {
      for (const candidato of guias) {
        agregar(candidato, false);
        if (elegidas.length >= 4) break;
      }
    }
    return elegidas;
  }, [guias]);

  function limpiar() {
    setTexto("");
    setPais(TODOS);
    setCurso(TODOS);
    setHerramienta(TODOS);
    setNivel(TODOS);
  }

  const descripcionFiltrosActivos = useMemo(() => {
    const partes: string[] = [];
    if (texto.trim()) partes.push(`búsqueda "${texto.trim()}"`);
    if (mostrarPais && pais !== TODOS) {
      const etiqueta = paises.find((p) => p.valor === pais)?.etiqueta ?? pais;
      partes.push(`país ${etiqueta}`);
    }
    if (curso !== TODOS) {
      const etiqueta = cursos.find((c) => c.valor === curso)?.etiqueta ?? curso;
      partes.push(`curso ${etiqueta}`);
    }
    if (herramienta !== TODOS) partes.push(`herramienta ${herramienta}`);
    if (nivel !== TODOS) partes.push(`nivel ${nivel}`);
    return partes.join(", ");
  }, [texto, mostrarPais, pais, paises, curso, cursos, herramienta, nivel]);

  const tieneSelects =
    cursos.length > 0 ||
    herramientasDisponibles.length > 0 ||
    nivelesDisponibles.length > 0 ||
    (mostrarPais && paises.length > 0);

  return (
    <div>
      <form
        role="search"
        aria-label="Buscar y filtrar guías"
        onSubmit={(event) => event.preventDefault()}
        className="rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 sm:p-5"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="buscar-guia"
              className="block text-xs font-medium text-[var(--g-muted)]"
            >
              Buscar en las guías
            </label>
            <p id={ayudaBusquedaId} className="sr-only">
              Busca por título, descripción, curso, herramienta o país.
            </p>
            <div className="relative mt-1.5">
              <Search
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--g-subtle)]"
              />
              <input
                id="buscar-guia"
                type="search"
                value={texto}
                onChange={(event) => setTexto(event.target.value)}
                placeholder="Power BI, sueldos, SQL, certificado..."
                aria-controls="resultados-guias"
                aria-describedby={ayudaBusquedaId}
                autoComplete="off"
                enterKeyHint="search"
                className="min-h-[44px] w-full rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] pl-10 pr-11 text-sm text-[var(--g-ink)] placeholder:text-[var(--g-subtle)]"
              />
              {texto ? (
                <button
                  type="button"
                  onClick={() => setTexto("")}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-0.5 top-1/2 inline-flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-md text-[var(--g-muted)] transition-colors hover:text-[var(--g-ink)]"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>

          {tieneSelects ? (
            <div className="flex items-center justify-between md:hidden">
              <button
                ref={filtrosBtnRef}
                type="button"
                aria-expanded={filtrosMovilAbiertos}
                aria-controls={panelFiltrosId}
                onClick={() => setFiltrosMovilAbiertos((prev) => !prev)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-4 text-sm font-medium text-[var(--g-ink)] transition-colors hover:bg-[var(--g-wash)]"
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                <span>Filtros</span>
                {conteoSelectsActivos > 0 ? (
                  <span className="tabular-nums text-xs font-semibold text-[var(--g-accent)]">
                    ({conteoSelectsActivos})
                  </span>
                ) : null}
              </button>
            </div>
          ) : null}
        </div>

        {tieneSelects ? (
          <div
            id={panelFiltrosId}
            className={`${
              filtrosMovilAbiertos ? "mt-3 grid" : "hidden"
            } grid-cols-1 gap-3 border-t border-[var(--g-border)] pt-3 sm:grid-cols-2 md:mt-4 md:grid md:grid-cols-4`}
          >
            {mostrarPais && paises.length > 0 ? (
              <div className="min-w-0">
                <label
                  htmlFor="filtro-pais"
                  className="block text-xs font-medium text-[var(--g-muted)]"
                >
                  País
                </label>
                <select
                  id="filtro-pais"
                  value={pais}
                  onChange={(event) => setPais(event.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-3 text-sm text-[var(--g-ink)]"
                >
                  <option value={TODOS}>Todos los países</option>
                  {paises.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>
                      {opcion.etiqueta}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {cursos.length > 0 ? (
              <div className="min-w-0">
                <label
                  htmlFor="filtro-curso"
                  className="block text-xs font-medium text-[var(--g-muted)]"
                >
                  Curso
                </label>
                <select
                  id="filtro-curso"
                  value={curso}
                  onChange={(event) => setCurso(event.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-3 text-sm text-[var(--g-ink)]"
                >
                  <option value={TODOS}>Todos los cursos</option>
                  {cursos.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>
                      {opcion.etiqueta}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {herramientasDisponibles.length > 0 ? (
              <div className="min-w-0">
                <label
                  htmlFor="filtro-herramienta"
                  className="block text-xs font-medium text-[var(--g-muted)]"
                >
                  Herramienta
                </label>
                <select
                  id="filtro-herramienta"
                  value={herramienta}
                  onChange={(event) => setHerramienta(event.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-3 text-sm text-[var(--g-ink)]"
                >
                  <option value={TODOS}>Todas las herramientas</option>
                  {herramientasDisponibles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {nivelesDisponibles.length > 0 ? (
              <div className="min-w-0">
                <label
                  htmlFor="filtro-nivel"
                  className="block text-xs font-medium text-[var(--g-muted)]"
                >
                  Nivel
                </label>
                <select
                  id="filtro-nivel"
                  value={nivel}
                  onChange={(event) => setNivel(event.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-3 text-sm text-[var(--g-ink)]"
                >
                  <option value={TODOS}>Todos los niveles</option>
                  {nivelesDisponibles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        ) : null}
      </form>

      {hayFiltros ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--g-border)] pb-3">
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-sm tabular-nums text-[var(--g-muted)]"
          >
            {visibles.length} de {guias.length} {guias.length === 1 ? "guía" : "guías"}
          </p>
          <button
            type="button"
            onClick={limpiar}
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--g-accent)] underline underline-offset-4 transition-colors hover:text-[var(--g-ink)] sm:min-h-[36px]"
          >
            Limpiar filtros
          </button>
        </div>
      ) : null}

      <div
        id="resultados-guias"
        role="region"
        aria-label="Resultados de guías"
        className="mt-8"
      >
        {visibles.length === 0 ? (
          <div className="rounded-xl border border-[var(--g-border)] bg-[var(--g-surface)] px-5 py-6">
            <p className="text-base font-semibold text-[var(--g-ink)]">
              No hay guías que coincidan con {descripcionFiltrosActivos || "tu selección"}.
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--g-muted)]">
              Quita uno o más filtros para volver al directorio completo, o revisa el catálogo de cursos y precios vigentes.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <button
                type="button"
                onClick={limpiar}
                className="inline-flex min-h-[44px] items-center rounded-lg bg-[var(--g-accent)] px-4 font-semibold text-[var(--g-accent-ink)] transition-opacity hover:opacity-90"
              >
                Limpiar filtros
              </button>
              <Link
                href={rutaLocal(iso, "/cursos")}
                className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4"
              >
                Catálogo de cursos
              </Link>
              <Link
                href={rutaLocal(iso, "/precios")}
                className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4"
              >
                Precios por país
              </Link>
            </div>
          </div>
        ) : hayFiltros ? (
          <ul className="grid grid-cols-1 border-t border-[var(--g-border)] md:grid-cols-2 md:gap-x-8">
            {visibles.map((guia) => (
              <li key={guia.path} className="min-w-0">
                <GuiaCard guia={guia} variant="row" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-14">
            {destacadas.length >= 2 ? (
              <section aria-labelledby="guias-destacadas">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--g-border)] pb-3">
                  <h2
                    id="guias-destacadas"
                    className="text-xl font-bold tracking-tight text-[var(--g-ink)]"
                  >
                    Destacadas
                  </h2>
                  <p className="text-xs text-[var(--g-subtle)]">
                    Prompts copiables, comparativas y rutas iniciales
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-0">
                  <div className="min-w-0 lg:col-span-7 lg:border-r lg:border-[var(--g-border)] lg:pr-8">
                    <GuiaCard
                      guia={destacadas[0]}
                      variant="featured"
                      preferEditorialImage
                      isHero
                    />
                  </div>
                  <ol className="min-w-0 divide-y divide-[var(--g-border)] lg:col-span-5 lg:pl-8">
                    {destacadas.slice(1, 4).map((guia, idx) => (
                      <li key={`top-${guia.path}`} className="min-w-0">
                        <GuiaCard
                          guia={guia}
                          variant="compact"
                          indexLabel={`0${idx + 1}`}
                        />
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            ) : null}

            {grupos.map((grupo) => {
              const rutaCurso =
                grupo.curso === "general" ? null : rutaLocal(iso, `/cursos/${grupo.curso}`);
              return (
                <section key={grupo.curso} aria-labelledby={`curso-${grupo.curso}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 pb-3">
                    <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2
                        id={`curso-${grupo.curso}`}
                        className="text-pretty break-words text-xl font-bold tracking-tight text-[var(--g-ink)]"
                      >
                        {grupo.nombre}
                      </h2>
                      <span className="text-sm tabular-nums text-[var(--g-subtle)]">
                        {grupo.guias.length} {grupo.guias.length === 1 ? "guía" : "guías"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                      {rutaCurso ? (
                        <Link
                          href={rutaCurso}
                          className="font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)]"
                        >
                          Ficha del curso
                        </Link>
                      ) : null}
                      <Link
                        href={rutaLocal(iso, "/precios")}
                        className="font-medium text-[var(--g-muted)] underline underline-offset-4 hover:text-[var(--g-ink)]"
                      >
                        Precios
                      </Link>
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 border-t border-[var(--g-border)] md:grid-cols-2 md:gap-x-8">
                    {grupo.guias.map((guia) => (
                      <li key={guia.path} className="min-w-0">
                        <GuiaCard guia={guia} variant="row" />
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
