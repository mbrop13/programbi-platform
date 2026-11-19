"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  PLANTILLA_CATEGORIES,
  type PlantillaCategory,
  type PlantillaItem,
} from "@/lib/data/plantillas";

interface Props {
  plantillas: PlantillaItem[];
}

export default function PlantillasHubClient({ plantillas }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<"Todas" | PlantillaCategory>("Todas");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plantillas.filter((item) => {
      const matchesCat = selectedCategory === "Todas" || item.category === selectedCategory;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tool.toLowerCase().includes(q) ||
        item.kpisIncluded.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [plantillas, selectedCategory, query]);

  return (
    <div>
      {/* Filtros y buscador */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar plantillas por categoría">
          <button
            type="button"
            onClick={() => setSelectedCategory("Todas")}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === "Todas"
                ? "border-ink bg-ink text-canvas"
                : "border-line bg-paper text-mute hover:border-line-strong hover:text-ink"
            }`}
          >
            Todas ({plantillas.length})
          </button>
          {PLANTILLA_CATEGORIES.map((cat) => {
            const count = plantillas.filter((p) => p.category === cat).length;
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "border-ink bg-ink text-canvas"
                    : "border-line bg-paper text-mute hover:border-line-strong hover:text-ink"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="w-full sm:w-64">
          <label htmlFor="plantillas-search" className="sr-only">
            Buscar plantilla o KPI
          </label>
          <input
            id="plantillas-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar KPI, DAX, SQL, Minería..."
            className="w-full rounded-lg border border-line bg-paper px-3.5 py-2 text-sm text-ink placeholder:text-faint focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      {/* Grid de plantillas */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-line bg-paper p-8 text-center">
          <p className="text-sm font-semibold text-ink">
            No encontramos plantillas para esa búsqueda.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Todas");
              setQuery("");
            }}
            className="mt-3 text-xs font-semibold text-ink underline underline-offset-4"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.slug}
              className="flex flex-col justify-between rounded-xl border border-line bg-paper p-6 transition-colors hover:border-line-strong"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                  <span>{item.category}</span>
                  <span>{item.level}</span>
                </div>

                <h2 className="mt-3 text-xl font-bold leading-snug tracking-tight text-ink">
                  <Link
                    href={`/plantillas/${item.slug}`}
                    className="no-underline hover:underline underline-offset-4"
                  >
                    {item.title}
                  </Link>
                </h2>

                <p className="mt-2.5 text-sm leading-relaxed text-mute">
                  {item.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.files.map((f) => (
                    <span
                      key={f.path}
                      className="rounded-md border border-line bg-wash px-2 py-0.5 font-mono text-[11px] font-semibold text-ink"
                    >
                      .{f.format.toLowerCase()}
                    </span>
                  ))}
                  <span className="rounded-md border border-line bg-canvas px-2 py-0.5 text-[11px] font-medium text-mute">
                    {item.rowCountLabel}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                <span className="text-xs font-medium text-faint">{item.tool}</span>
                <Link
                  href={`/plantillas/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-ink no-underline hover:underline underline-offset-4"
                >
                  Ver código y descargar →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
