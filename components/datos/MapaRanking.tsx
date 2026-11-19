import mapa from "./mapa-paths.json";
import { colores, numero, type FilaMapa } from "./mapa-ranking-utils";
import { MapaRankingCliente } from "./MapaRankingCliente";
import styles from "./MapaRanking.module.css";

export type { FilaMapa } from "./mapa-ranking-utils";

export function MapaRanking({ filas, tasaChile, periodo }: { filas: readonly FilaMapa[]; tasaChile: number; periodo: string }) {
  const patron = "mapa-nota-desempleo";
  const minimo = Math.min(...filas.map((f) => f.tasa));
  const maximo = Math.max(...filas.map((f) => f.tasa));
  const color = (tasa: number) => colores[Math.min(colores.length - 1, Math.floor(((tasa - minimo) / (maximo - minimo || 1)) * colores.length))];
  const mapaSvg = (
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
          <title>{`${f.nombre}: ${numero(f.tasa)} %`}</title>
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
  );
  return <MapaRankingCliente filas={filas} tasaChile={tasaChile} mapa={mapaSvg} />;
}
