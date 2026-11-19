"use client";

import { useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/marketing";
import { colores, numero, type FilaMapa } from "./mapa-ranking-utils";
import styles from "./MapaRanking.module.css";

type Props = { filas: readonly FilaMapa[]; tasaChile: number; mapa: ReactNode };
const variacion = (n: number | null) =>
  n === null ? "—" : `${n > 0 ? "+" : ""}${numero(n)} pp.`;

export function MapaRankingCliente({ filas, tasaChile, mapa }: Props) {
  const [vista, setVista] = useState<"mapa" | "tiles">("mapa");
  const [orden, setOrden] = useState<"mayor" | "menor" | "norte">("mayor");
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
            mapa
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
