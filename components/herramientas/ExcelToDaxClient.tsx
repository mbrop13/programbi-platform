"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Check, Copy, Search, Sparkles, X } from "lucide-react";
import {
  matchExcelToDax,
  type ExcelToDaxCategory,
  type ExcelToDaxItem,
} from "@/lib/data/excel-a-dax";

interface Props {
  items: ExcelToDaxItem[];
  categories: ExcelToDaxCategory[];
}

const QUICK_EXAMPLES = [
  '=SUMAR.SI.CONJUNTO(D:D; A:A; "Santiago")',
  "=VLOOKUP(A2, Productos!A:C, 3, FALSE)",
  "=SI.ERROR(A2/B2; 0)",
  "año anterior",
  "% del total",
  "margen sin error",
];

export function ExcelToDaxClient({ items, categories }: Props) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ExcelToDaxCategory | "Todas">("Todas");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { matchedItems, detectedFunctions } = useMemo(() => {
    const res = matchExcelToDax(query);
    const filtered =
      selectedCategory === "Todas"
        ? res.items
        : res.items.filter((item) => item.category === selectedCategory);
    return {
      matchedItems: filtered,
      detectedFunctions: res.detectedFunctions,
    };
  }, [query, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<ExcelToDaxCategory, number>();
    for (const cat of categories) counts.set(cat, 0);
    for (const item of items) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    return counts;
  }, [items, categories]);

  async function handleCopy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 1800);
    } catch {
      // Fallback silencioso si el navegador bloquea clipboard
    }
  }

  return (
    <section aria-label="Conversor interactivo de Excel a DAX" className="text-ink">
      <div className="rounded-[26px] border border-line bg-paper p-5 sm:p-7">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="excel-dax-input" className="text-sm font-semibold tracking-tight text-ink">
              Pega tu fórmula de Excel o escribe qué quieres calcular
            </label>
            <span className="text-xs text-faint">
              Soporta funciones en español (BUSCARV) e inglés (VLOOKUP)
            </span>
          </div>

          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
            />
            <input
              id="excel-dax-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Ej: =SUMAR.SI.CONJUNTO(...) o "margen sin error" o "año anterior"'
              className="w-full rounded-2xl border border-line-strong bg-canvas py-3.5 pl-11 pr-11 font-mono text-sm text-ink placeholder:font-sans placeholder:text-faint focus:border-ink focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-mute hover:bg-wash hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-faint">Prueba con:</span>
            {QUICK_EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setQuery(ex);
                  setSelectedCategory("Todas");
                }}
                className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-mute transition-colors hover:border-line-strong hover:text-ink"
              >
                {ex}
              </button>
            ))}
          </div>

          {detectedFunctions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-wash px-4 py-2.5 text-xs">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-ink" aria-hidden />
              <span className="font-semibold text-ink">Función detectada:</span>
              {detectedFunctions.map((fn) => (
                <span
                  key={fn}
                  className="rounded-md border border-line-strong bg-canvas px-2 py-0.5 font-mono font-medium text-ink"
                >
                  {fn}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1" role="tablist" aria-label="Filtrar por categoría">
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategory === "Todas"}
              onClick={() => setSelectedCategory("Todas")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === "Todas"
                  ? "bg-ink text-canvas"
                  : "border border-line bg-canvas text-mute hover:border-line-strong hover:text-ink"
              }`}
            >
              Todas ({items.length})
            </button>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-ink text-canvas"
                      : "border border-line bg-canvas text-mute hover:border-line-strong hover:text-ink"
                  }`}
                >
                  {cat} ({categoryCounts.get(cat) ?? 0})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-mute">
        <h2 className="text-xs font-normal text-mute">
          Mostrando <strong className="font-semibold text-ink">{matchedItems.length}</strong>{" "}
          {matchedItems.length === 1 ? "equivalencia" : "equivalencias"} Excel → DAX
        </h2>
        {selectedCategory !== "Todas" && (
          <button
            type="button"
            onClick={() => setSelectedCategory("Todas")}
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            Ver todas las categorías
          </button>
        )}
      </div>

      {matchedItems.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-line bg-paper p-8 text-center">
          <p className="text-base font-semibold text-ink">
            No encontramos una equivalencia exacta para &ldquo;{query}&rdquo;.
          </p>
          <p className="mt-2 text-sm text-mute">
            Prueba buscando por el nombre de la función en Excel (ej. BUSCARV, SUMAR.SI, SI.ERROR) o
            limpia el filtro de categoría.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCategory("Todas");
            }}
            className="mt-4 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-canvas"
          >
            Restablecer búsqueda
          </button>
        </div>
      ) : (
        <div className="mt-4 grid gap-5">
          {matchedItems.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <article
                key={item.id}
                id={item.id}
                className="rounded-[26px] border border-line bg-paper p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                      {item.category}
                    </span>
                    <h3 className="mt-1 text-lg font-bold tracking-tight text-ink sm:text-xl">
                      {item.excelEs}{" "}
                      <span className="font-normal text-faint">/ {item.excelEn}</span>{" "}
                      <span aria-hidden className="mx-1 text-faint">
                        →
                      </span>{" "}
                      <span className="font-mono text-base sm:text-lg">{item.daxFunction}</span>
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.daxMeasure)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-canvas px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-wash"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                        Copiar DAX
                      </>
                    )}
                  </button>
                </div>

                {/* Vista lado a lado Excel vs DAX */}
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-2xl border border-line bg-canvas p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                      En Excel
                    </p>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-mute">
                      {item.excelExample}
                    </pre>
                  </div>

                  <div className="rounded-2xl border border-line-strong bg-canvas p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
                      En Power BI (Medida DAX)
                    </p>
                    <pre className="mt-2 overflow-x-auto whitespace-pre font-mono text-xs leading-relaxed text-ink">
                      {item.daxMeasure}
                    </pre>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-mute">{item.explanation}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-line bg-wash p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      Error común a evitar
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-mute">{item.commonTrap}</p>
                  </div>

                  <div className="rounded-2xl border border-line bg-canvas p-3.5">
                    <p className="text-xs font-semibold text-ink">Ejemplo de negocio</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-mute">{item.businessCase}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* CTA contextual */}
      <div className="mt-8 rounded-[26px] border border-line-strong bg-paper p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
              Siguiente paso práctico
            </p>
            <h2 className="mt-1.5 text-xl font-bold tracking-tight text-ink">
              Domina DAX, modelo estrella y Power Query en vivo
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-mute">
              Dejar de copiar y pegar planillas requiere entender contexto de fila vs contexto de
              filtro. Practícalo con datos reales en nuestro curso o descarga ejercicios listos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/cursos/power-bi"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-canvas no-underline transition-opacity hover:opacity-90"
            >
              Ver curso Power BI
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/plantillas/guia-practica-dax-ejercicios"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-canvas px-5 py-2.5 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash"
            >
              Guía práctica DAX
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
