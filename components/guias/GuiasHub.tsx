"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import GuiaCard from "@/components/guias/GuiaCard";
import {
  GuiaBreadcrumbs,
  GuiaToolVisual,
  type GuiaBreadcrumbItem,
} from "@/components/guias/GuiaEditorialPrimitives";
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

export interface GuiasHubProps {
  guias: TarjetaGuia[];
  paises: Opcion[];
  cursos: Opcion[];
  /** En las páginas de país no tiene sentido filtrar por país. */
  mostrarPais?: boolean;
  /** Mercado de la página, para enlazar ficha de curso y precios. */
  iso?: string;
  /** Título principal del Hero de Biblioteca. */
  titulo?: string;
  /** Subtítulo descriptivo del Hero de Biblioteca. */
  subtitulo?: string;
  /** Migas de pan opcionales integradas dentro del Hero. */
  breadcrumbs?: GuiaBreadcrumbItem[];
}

/**
 * Hub visual y táctil de guías con Hero de Biblioteca, tarjetas por herramienta,
 * bloque de recomendadas, buscador protagonista y directorio por curso.
 */
export default function GuiasHub({
  guias,
  paises,
  cursos,
  mostrarPais = true,
  iso = ISO_CHILE,
  titulo = "Guías prácticas de datos, IA y Power BI",
  subtitulo = "Aprende con rutas claras, ejemplos aplicados, prompts listos y referencias locales para Latinoamérica.",
  breadcrumbs,
}: GuiasHubProps) {
  const [texto, setTexto] = useState("");
  const [pais, setPais] = useState(TODOS);
  const [curso, setCurso] = useState(TODOS);
  const [herramienta, setHerramienta] = useState(TODOS);
  const [nivel, setNivel] = useState(TODOS);
  const [listo, setListo] = useState(false);
  const [filtrosMovilAbiertos, setFiltrosMovilAbiertos] = useState(false);

  const filtrosBtnRef = useRef<HTMLButtonElement | null>(null);
  const resultadosRef = useRef<HTMLDivElement | null>(null);
  const panelFiltrosId = useId();
  const ayudaBusquedaId = useId();
  const buscarInputId = useId();

  const herramientasConConteo = useMemo(() => {
    const conteo = new Map<string, number>();
    for (const g of guias) {
      if (!g.herramienta) continue;
      conteo.set(g.herramienta, (conteo.get(g.herramienta) ?? 0) + 1);
    }
    return HERRAMIENTAS_ORDEN.filter((h) => (conteo.get(h) ?? 0) > 0).map((h) => ({
      nombre: h,
      cantidad: conteo.get(h) ?? 0,
    }));
  }, [guias]);

  const herramientasDisponibles = useMemo(
    () => herramientasConConteo.map((h) => h.nombre),
    [herramientasConConteo]
  );

  const nivelesDisponibles = useMemo(() => {
    const presentes = new Set(guias.map((g) => g.nivel).filter((n): n is string => Boolean(n)));
    return NIVELES_ORDEN.filter((n) => presentes.has(n));
  }, [guias]);

  const cursosConConteo = useMemo(() => {
    const conteo = new Map<string, number>();
    for (const g of guias) {
      conteo.set(g.course, (conteo.get(g.course) ?? 0) + 1);
    }
    return cursos
      .map((c) => ({
        valor: c.valor,
        etiqueta: c.etiqueta,
        cantidad: conteo.get(c.valor) ?? c.cantidad ?? 0,
      }))
      .filter((c) => c.cantidad > 0);
  }, [guias, cursos]);

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

  function desplazarAResultados() {
    const nodo = resultadosRef.current;
    if (!nodo) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    nodo.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  function seleccionarHerramientaRapida(nombre: string) {
    const siguiente = herramienta === nombre ? TODOS : nombre;
    setHerramienta(siguiente);
    if (siguiente !== TODOS) {
      requestAnimationFrame(desplazarAResultados);
    }
  }

  function seleccionarCursoRapido(valor: string) {
    const siguiente = curso === valor ? TODOS : valor;
    setCurso(siguiente);
    if (siguiente !== TODOS) {
      requestAnimationFrame(desplazarAResultados);
    }
  }

  function limpiar() {
    setTexto("");
    setPais(TODOS);
    setCurso(TODOS);
    setHerramienta(TODOS);
    setNivel(TODOS);
  }

  const chipsFiltrosActivos = useMemo(() => {
    const chips: Array<{ id: string; etiqueta: string; quitar: () => void }> = [];
    if (texto.trim()) {
      chips.push({
        id: "q",
        etiqueta: `Búsqueda: "${texto.trim()}"`,
        quitar: () => setTexto(""),
      });
    }
    if (mostrarPais && pais !== TODOS) {
      const etiqueta = paises.find((p) => p.valor === pais)?.etiqueta ?? pais;
      chips.push({
        id: "pais",
        etiqueta: `País: ${etiqueta}`,
        quitar: () => setPais(TODOS),
      });
    }
    if (curso !== TODOS) {
      const etiqueta = cursos.find((c) => c.valor === curso)?.etiqueta ?? curso;
      chips.push({
        id: "curso",
        etiqueta: `Curso: ${etiqueta}`,
        quitar: () => setCurso(TODOS),
      });
    }
    if (herramienta !== TODOS) {
      chips.push({
        id: "herramienta",
        etiqueta: `Herramienta: ${herramienta}`,
        quitar: () => setHerramienta(TODOS),
      });
    }
    if (nivel !== TODOS) {
      chips.push({
        id: "nivel",
        etiqueta: `Nivel: ${nivel}`,
        quitar: () => setNivel(TODOS),
      });
    }
    return chips;
  }, [texto, mostrarPais, pais, paises, curso, cursos, herramienta, nivel]);

  const descripcionFiltrosActivos = chipsFiltrosActivos.map((c) => c.etiqueta).join(", ");

  const tieneSelects =
    cursos.length > 0 ||
    herramientasDisponibles.length > 0 ||
    nivelesDisponibles.length > 0 ||
    (mostrarPais && paises.length > 0);

  const tarjetasHerramienta = useMemo(() => {
    if (herramientasConConteo.length > 0) {
      return herramientasConConteo.slice(0, 6).map((item) => ({
        tipo: "herramienta" as const,
        valor: item.nombre,
        etiqueta: item.nombre,
        cantidad: item.cantidad,
        activo: herramienta === item.nombre,
        onClick: () => seleccionarHerramientaRapida(item.nombre),
      }));
    }
    return cursosConConteo.slice(0, 6).map((item) => ({
      tipo: "curso" as const,
      valor: item.valor,
      etiqueta: item.etiqueta,
      cantidad: item.cantidad,
      activo: curso === item.valor,
      onClick: () => seleccionarCursoRapido(item.valor),
    }));
  }, [herramientasConConteo, cursosConConteo, herramienta, curso]);

  return (
    <div>
      {/* Hero de Biblioteca Interactivo */}
      <section
        aria-label="Buscador y acceso rápido a la biblioteca de guías"
        className="rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-6 shadow-[var(--g-card-shadow)] sm:p-8 lg:p-10"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="min-w-0 lg:col-span-7">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <GuiaBreadcrumbs items={breadcrumbs} className="mb-4" />
            ) : null}

            <h1 className="max-w-[22ch] text-pretty text-[clamp(1.85rem,3.4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--g-ink)]">
              {titulo}
            </h1>
            <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-[var(--g-muted)]">
              {subtitulo}
            </p>

            {/* Buscador protagonista */}
            <form
              role="search"
              aria-label="Buscar en las guías"
              onSubmit={(event) => event.preventDefault()}
              className="mt-6"
            >
              <label htmlFor={buscarInputId} className="sr-only">
                Buscar en las guías
              </label>
              <p id={ayudaBusquedaId} className="sr-only">
                Busca por título, descripción, curso, herramienta o país.
              </p>
              <div className="relative flex items-center">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 text-[var(--g-subtle)]"
                />
                <input
                  id={buscarInputId}
                  type="search"
                  value={texto}
                  onChange={(event) => setTexto(event.target.value)}
                  placeholder="Busca Power BI, DAX, SQL, Python, sueldos o prompts..."
                  aria-controls="resultados-guias"
                  aria-describedby={ayudaBusquedaId}
                  autoComplete="off"
                  enterKeyHint="search"
                  className="min-h-[48px] w-full rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] pl-11 pr-32 text-[15px] text-[var(--g-ink)] placeholder:text-[var(--g-subtle)] focus-visible:border-[var(--g-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-surface)]"
                />
                <div className="absolute right-2 flex items-center gap-1.5">
                  {texto ? (
                    <button
                      type="button"
                      onClick={() => setTexto("")}
                      aria-label="Limpiar búsqueda"
                      className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-[var(--g-muted)] transition-colors hover:bg-[var(--g-wash)] hover:text-[var(--g-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)]"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  ) : null}
                  <span className="hidden rounded-lg bg-[var(--g-wash)] px-2.5 py-1 text-xs font-medium tabular-nums text-[var(--g-muted)] sm:inline-flex">
                    {visibles.length} {visibles.length === 1 ? "guía" : "guías"}
                  </span>
                </div>
              </div>
            </form>

            {/* Accesos rápidos clicables por tema / curso */}
            {cursosConConteo.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-[var(--g-subtle)]">
                  Temas rápidos:
                </span>
                {cursosConConteo.slice(0, 6).map((item) => {
                  const activo = curso === item.valor;
                  return (
                    <button
                      key={item.valor}
                      type="button"
                      aria-pressed={activo}
                      onClick={() => seleccionarCursoRapido(item.valor)}
                      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-surface)] sm:min-h-[34px] ${
                        activo
                          ? "border-[var(--g-accent)] bg-[var(--g-accent)] text-[var(--g-accent-ink)]"
                          : "border-[var(--g-border-strong)] bg-[var(--g-bg)] text-[var(--g-ink)] hover:border-[var(--g-accent)] hover:text-[var(--g-accent)]"
                      }`}
                    >
                      <span>{item.etiqueta}</span>
                      <span
                        className={`tabular-nums ${
                          activo ? "text-[var(--g-accent-ink)]/85" : "text-[var(--g-subtle)]"
                        }`}
                      >
                        {item.cantidad}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Panel derecho: Empieza por tu herramienta */}
          {tarjetasHerramienta.length > 0 ? (
            <div className="min-w-0 rounded-xl border border-[var(--g-border)] bg-[var(--g-wash)]/55 p-4 sm:p-5 lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--g-subtle)]">
                Empieza por tu herramienta
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                {tarjetasHerramienta.map((item) => (
                  <button
                    key={`${item.tipo}-${item.valor}`}
                    type="button"
                    aria-pressed={item.activo}
                    onClick={item.onClick}
                    className={`group flex min-h-[56px] min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--g-surface)] ${
                      item.activo
                        ? "border-[var(--g-accent)] bg-[var(--g-accent-soft)] shadow-[var(--g-card-shadow)]"
                        : "border-[var(--g-border)] bg-[var(--g-surface)] shadow-[var(--g-card-shadow)] hover:-translate-y-0.5 hover:border-[var(--g-border-strong)] hover:shadow-[var(--g-card-shadow-hover)]"
                    }`}
                  >
                    <GuiaToolVisual
                      tool={item.tipo === "herramienta" ? item.valor : undefined}
                      course={item.tipo === "curso" ? item.valor : undefined}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--g-ink)]">
                        {item.etiqueta}
                      </p>
                      <p className="text-xs tabular-nums text-[var(--g-subtle)]">
                        {item.cantidad} {item.cantidad === 1 ? "guía" : "guías"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Barra de filtros secundarios compacta */}
      {tieneSelects ? (
        <div className="mt-6 rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] p-4 shadow-[var(--g-card-shadow)]">
          <div className="flex flex-wrap items-center justify-between gap-3 md:hidden">
            <button
              ref={filtrosBtnRef}
              type="button"
              aria-expanded={filtrosMovilAbiertos}
              aria-controls={panelFiltrosId}
              onClick={() => setFiltrosMovilAbiertos((prev) => !prev)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-4 text-sm font-medium text-[var(--g-ink)] transition-colors hover:bg-[var(--g-wash)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)]"
            >
              <SlidersHorizontal size={15} aria-hidden="true" />
              <span>Filtros</span>
              {conteoSelectsActivos > 0 ? (
                <span className="tabular-nums text-xs font-semibold text-[var(--g-accent)]">
                  ({conteoSelectsActivos})
                </span>
              ) : null}
            </button>
            <span className="text-xs font-medium tabular-nums text-[var(--g-subtle)]">
              {visibles.length} de {guias.length}
            </span>
          </div>

          <div
            id={panelFiltrosId}
            className={`${
              filtrosMovilAbiertos ? "mt-4 grid" : "hidden"
            } grid-cols-1 gap-3 sm:grid-cols-2 md:mt-0 md:grid md:grid-cols-4`}
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
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-3 text-sm text-[var(--g-ink)] focus-visible:border-[var(--g-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)]"
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
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-3 text-sm text-[var(--g-ink)] focus-visible:border-[var(--g-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)]"
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
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-3 text-sm text-[var(--g-ink)] focus-visible:border-[var(--g-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)]"
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
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[var(--g-border-strong)] bg-[var(--g-bg)] px-3 text-sm text-[var(--g-ink)] focus-visible:border-[var(--g-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)]"
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
        </div>
      ) : null}

      {/* Chips de filtros activos eliminables + conteo */}
      {hayFiltros ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--g-border)] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="mr-1 text-sm font-medium tabular-nums text-[var(--g-muted)]"
            >
              {visibles.length} de {guias.length} {guias.length === 1 ? "guía" : "guías"}
            </p>
            {chipsFiltrosActivos.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={chip.quitar}
                aria-label={`Quitar filtro ${chip.etiqueta}`}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[var(--g-accent)]/30 bg-[var(--g-accent-soft)] px-3 text-xs font-medium text-[var(--g-accent)] transition-colors hover:bg-[var(--g-accent)] hover:text-[var(--g-accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)] sm:min-h-[32px]"
              >
                <span>{chip.etiqueta}</span>
                <X size={13} aria-hidden="true" />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={limpiar}
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--g-accent)] underline underline-offset-4 transition-colors hover:text-[var(--g-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)] sm:min-h-[36px]"
          >
            Limpiar filtros
          </button>
        </div>
      ) : null}

      {/* Resultados / Biblioteca */}
      <div
        id="resultados-guias"
        ref={resultadosRef}
        role="region"
        aria-label="Resultados de guías"
        className="mt-8 scroll-mt-24"
      >
        {visibles.length === 0 ? (
          <div className="rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] px-6 py-8 shadow-[var(--g-card-shadow)]">
            <p className="text-base font-semibold text-[var(--g-ink)]">
              No hay guías que coincidan con {descripcionFiltrosActivos || "tu selección"}.
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--g-muted)]">
              Quita uno o más filtros para volver al directorio completo, o revisa el catálogo de cursos y precios vigentes.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
              <button
                type="button"
                onClick={limpiar}
                className="inline-flex min-h-[44px] items-center rounded-xl bg-[var(--g-accent)] px-5 font-semibold text-[var(--g-accent-ink)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--g-accent)] focus-visible:ring-offset-2"
              >
                Limpiar filtros
              </button>
              <Link
                href={rutaLocal(iso, "/cursos")}
                className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)]"
              >
                Catálogo de cursos
              </Link>
              <Link
                href={rutaLocal(iso, "/precios")}
                className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)]"
              >
                Precios por país
              </Link>
            </div>
          </div>
        ) : hayFiltros ? (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibles.map((guia) => (
              <li key={guia.path} className="min-w-0">
                <GuiaCard guia={guia} variant="visual" preferEditorialImage />
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-14">
            {/* Bloque Destacado Visual */}
            {destacadas.length >= 2 ? (
              <section aria-labelledby="guias-destacadas">
                <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4">
                  <h2
                    id="guias-destacadas"
                    className="text-xl font-bold tracking-tight text-[var(--g-ink)] sm:text-2xl"
                  >
                    Guías recomendadas para empezar
                  </h2>
                  <p className="text-xs text-[var(--g-subtle)]">
                    Rutas iniciales, prompts copiables y comparativas clave
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
                  <div className="min-w-0 lg:col-span-7">
                    <GuiaCard
                      guia={destacadas[0]}
                      variant="featured"
                      preferEditorialImage
                      isHero
                    />
                  </div>
                  <ol className="flex min-w-0 flex-col justify-between gap-4 lg:col-span-5">
                    {destacadas.slice(1, 4).map((guia, idx) => (
                      <li key={`top-${guia.path}`} className="min-w-0 flex-1">
                        <GuiaCard
                          guia={guia}
                          variant="compact"
                          preferEditorialImage
                          indexLabel={`0${idx + 1}`}
                        />
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            ) : null}

            {/* Directorio por Curso con Tarjetas Visuales Táctiles */}
            {grupos.map((grupo) => {
              const rutaCurso =
                grupo.curso === "general" ? null : rutaLocal(iso, `/cursos/${grupo.curso}`);

              return (
                <section key={grupo.curso} aria-labelledby={`curso-${grupo.curso}`}>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--g-border)] pb-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <GuiaToolVisual course={grupo.curso} size="sm" />
                      <h2
                        id={`curso-${grupo.curso}`}
                        className="text-pretty break-words text-xl font-bold tracking-tight text-[var(--g-ink)]"
                      >
                        {grupo.nombre}
                      </h2>
                      <span className="rounded-full bg-[var(--g-wash)] px-2.5 py-0.5 text-xs font-medium tabular-nums text-[var(--g-muted)]">
                        {grupo.guias.length} {grupo.guias.length === 1 ? "guía" : "guías"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
                      {rutaCurso ? (
                        <Link
                          href={rutaCurso}
                          className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-ink)] underline underline-offset-4 hover:text-[var(--g-accent)] sm:min-h-0"
                        >
                          Ficha del curso
                        </Link>
                      ) : null}
                      <Link
                        href={rutaLocal(iso, "/precios")}
                        className="inline-flex min-h-[44px] items-center font-medium text-[var(--g-muted)] underline underline-offset-4 hover:text-[var(--g-ink)] sm:min-h-0"
                      >
                        Precios
                      </Link>
                    </div>
                  </div>

                  <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {grupo.guias.map((guia) => (
                      <li key={guia.path} className="min-w-0">
                        <GuiaCard guia={guia} variant="visual" preferEditorialImage />
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
