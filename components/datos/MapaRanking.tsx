"use client";

import { useId, useState } from "react";
import { trackEvent } from "@/lib/analytics/marketing";
import mapa from "./mapa-paths.json";
import styles from "./MapaRanking.module.css";

export type FilaMapa = {
  slug: string;
  nombre: string;
  tasa: number;
  yoy: number | null;
  nota?: "a" | "b";
};
type Props = { filas: readonly FilaMapa[]; tasaChile: number; periodo: string };
const colores = [
  "#dcecf5",
  "#b5d7e9",
  "#79b4d4",
  "#357ca5",
  "#1469ad",
  "#174e83",
];
const numero = (n: number) =>
  n.toLocaleString("es-CL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
const variacion = (n: number | null) =>
  n === null ? "—" : `${n > 0 ? "+" : ""}${numero(n)} pp.`;

export function MapaRanking({ filas, tasaChile, periodo }: Props) {
  const [vista, setVista] = useState<"mapa" | "tiles">("mapa");
  const [orden, setOrden] = useState<"mayor" | "menor" | "norte">("mayor");
  const patron = `mapa-nota-${useId().replace(/:/g, "")}`;
  const minimo = Math.min(...filas.map((f) => f.tasa));
  const maximo = Math.max(...filas.map((f) => f.tasa));
  const color = (tasa: number) =>
    colores[
      Math.min(
        colores.length - 1,
        Math.floor(((tasa - minimo) / (maximo - minimo || 1)) * colores.length),
      )
    ];
  const ordenadas = [...filas];
  if (orden !== "norte")
    ordenadas.sort((a, b) =>
      orden === "mayor" ? b.tasa - a.tasa : a.tasa - b.tasa,
    );
  function cambiarVista(nuevaVista: typeof vista) {
    if (nuevaVista === vista) return;
    setVista(nuevaVista);
    trackEvent("datos_filter", { tipo: "vista_mapa", valor: nuevaVista });
  }
  return (
    <div className={styles.contenedor}>
      <div className={styles.encabezado}>
        <span className={styles.etiqueta}>VISTA GEOGRÁFICA</span>
        <div
          className={styles.selector}
          role="group"
          aria-label="Vista geográfica"
        >
          <button
            type="button"
            aria-pressed={vista === "mapa"}
            onClick={() => cambiarVista("mapa")}
          >
            Mapa
          </button>
          <button
            type="button"
            aria-pressed={vista === "tiles"}
            onClick={() => cambiarVista("tiles")}
          >
            Tiles
          </button>
        </div>
      </div>
      <div className={styles.columnas}>
        <div className={styles.geografia}>
          {vista === "mapa" ? (
            <svg
              className={styles.mapa}
              viewBox={mapa.viewBox}
              role="group"
              aria-label={`Mapa de desocupación por región, ${periodo}`}
            >
              <defs>
                <pattern
                  id={patron}
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="8"
                    stroke="#172e45"
                    strokeWidth="2"
                  />
                </pattern>
              </defs>
              {filas.map((f) => {
                const d = mapa.paths[f.slug as keyof typeof mapa.paths];
                return d ? (
                  <a
                    key={f.slug}
                    href={`/datos/desempleo/${f.slug}`}
                    aria-label={`${f.nombre}: ${numero(f.tasa)} %${f.nota ? `, estimación ${f.nota}` : ""}. Ver región`}
                  >
                    <title>
                      {f.nombre}: {numero(f.tasa)} %
                    </title>
                    <path
                      d={d}
                      fill={color(f.tasa)}
                      fillRule="evenodd"
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                    {f.nota && (
                      <path
                        d={d}
                        fill={`url(#${patron})`}
                        fillRule="evenodd"
                        pointerEvents="none"
                      />
                    )}
                  </a>
                ) : null;
              })}
            </svg>
          ) : (
            <ol className={styles.tiles} aria-label="Regiones de norte a sur">
              {filas.map((f) => (
                <li key={f.slug}>
                  <a
                    href={`/datos/desempleo/${f.slug}`}
                    style={{
                      backgroundColor: color(f.tasa),
                      color:
                        (f.tasa - minimo) / (maximo - minimo || 1) >= 0.5
                          ? "#fff"
                          : "#102e43",
                      backgroundImage: f.nota
                        ? "repeating-linear-gradient(135deg, transparent 0 5px, #172e4533 5px 7px)"
                        : undefined,
                    }}
                  >
                    <span>
                      {f.nombre}
                      {f.nota && <sup>{f.nota}</sup>}
                    </span>
                    <strong>{numero(f.tasa)} %</strong>
                  </a>
                </li>
              ))}
            </ol>
          )}
          <div className={styles.leyenda}>
            <span>Menor</span>
            <span className={styles.gradiente} />
            <span>Mayor</span>
          </div>
          <p className={styles.nota}>
            Cartografía: BCN. Rapa Nui y Juan Fernández no se muestran en el
            mapa. La zona sin demarcar no se asigna a una región.
          </p>
        </div>
        <div className={styles.ranking}>
          <div className={styles.rankingHeader}>
            <div>
              <h3>Ranking regional</h3>
              <p>Chile: {numero(tasaChile)} %</p>
            </div>
            <label>
              Ordenar{" "}
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as typeof orden)}
              >
                <option value="mayor">Mayor tasa</option>
                <option value="menor">Menor tasa</option>
                <option value="norte">Norte a sur</option>
              </select>
            </label>
          </div>
          <div className={styles.cabecera}>
            <span>Región</span>
            <span>Tasa</span>
            <span>12 meses</span>
          </div>
          <ol className={styles.lista}>
            {ordenadas.map((f, i) => (
              <li key={f.slug}>
                <a href={`/datos/desempleo/${f.slug}`}>
                  <span className={styles.nombre}>
                    <span className={styles.indice}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      {f.nombre}
                      {f.nota && <sup>{f.nota}</sup>}
                      <span className={styles.barra}>
                        <span
                          style={{
                            width: `${maximo ? (f.tasa / maximo) * 100 : 0}%`,
                            backgroundColor: color(f.tasa),
                          }}
                        />
                      </span>
                    </span>
                  </span>
                  <strong>{numero(f.tasa)} %</strong>
                  <span className={styles.variacion}>{variacion(f.yoy)}</span>
                </a>
              </li>
            ))}
          </ol>
          {filas.some((f) => f.nota) && (
            <p className={styles.nota}>
              a: estimación poco fiable; b: estimación no fiable, según
              criterios del INE. Las estimaciones con nota se identifican
              también con rayas en el mapa.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
