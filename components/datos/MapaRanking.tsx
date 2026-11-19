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
  // SVG geometry is static server content; escape all interpolated values.
  const escape = (valor: string) => valor.replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[caracter]!);
  const regiones = filas.map((f) => {
    const d = mapa.paths[f.slug as keyof typeof mapa.paths];
    if (!d) return "";
    const titulo = `${f.nombre}: ${numero(f.tasa)} %`;
    const etiqueta = `${titulo}${f.nota ? `, estimación ${f.nota}` : ""}. Ver región`;
    return `<a href="${escape(`/datos/desempleo/${f.slug}`)}" aria-label="${escape(etiqueta)}"><title>${escape(titulo)}</title><path d="${escape(d)}" fill="${escape(color(f.tasa))}" fill-rule="evenodd" stroke="#fff" stroke-width="1.5"/>${f.nota ? `<path d="${escape(d)}" fill="url(#${patron})" fill-rule="evenodd" pointer-events="none"/>` : ""}</a>`;
  }).join("");
  const contenido = `<defs><pattern id="${patron}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="#172e45" stroke-width="2"/></pattern></defs>${regiones}`;
  const mapaSvg = <svg className={styles.mapa} viewBox={mapa.viewBox} role="group" aria-label={`Mapa de desocupación por región, ${periodo}`} dangerouslySetInnerHTML={{ __html: contenido }} />;
  return <MapaRankingCliente filas={filas} tasaChile={tasaChile} mapa={mapaSvg} />;
}
