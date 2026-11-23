"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { trackEvent } from "@/lib/analytics/marketing";
import { colores, numero, type FilaMapa } from "./mapa-ranking-utils";
import styles from "./MapaRanking.module.css";

type Props = { filas: readonly FilaMapa[]; tasaChile: number; mapa: ReactNode };
const variacion = (n: number | null) =>
  n === null ? "—" : `${n > 0 ? "+" : ""}${numero(n)} pp.`;

type Activa = { slug: string; x: number; y: number; ancho: number; fijada: boolean };
const RUTA = "/datos/desempleo/";

export function MapaRankingCliente({ filas, tasaChile, mapa }: Props) {
  const [vista, setVista] = useState<"mapa" | "tiles">("mapa");
  const [orden, setOrden] = useState<"mayor" | "menor" | "norte">("mayor");
  const [activa, setActiva] = useState<Activa | null>(null);
  const geoRef = useRef<HTMLDivElement>(null);
  const ocultar = useRef<number | null>(null);
  // En celular la tarjeta es un panel inferior sobre toda la página (el recuadro del mapa es angosto).
  const [compacto, setCompacto] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const actualizar = () => setCompacto(mq.matches);
    actualizar();
    mq.addEventListener("change", actualizar);
    return () => mq.removeEventListener("change", actualizar);
  }, []);

  const porTasa = [...filas].sort((a, b) => b.tasa - a.tasa);
  const filaActiva = activa ? filas.find((f) => f.slug === activa.slug) ?? null : null;
  const puesto = filaActiva ? porTasa.findIndex((f) => f.slug === filaActiva.slug) + 1 : 0;

  const cancelarOcultar = () => {
    if (ocultar.current !== null) window.clearTimeout(ocultar.current);
    ocultar.current = null;
  };
  const programarOcultar = () => {
    cancelarOcultar();
    ocultar.current = window.setTimeout(() => setActiva((a) => (a?.fijada ? a : null)), 220);
  };

  // Región bajo el puntero o el foco: el mapa es SVG estático del servidor, así que se lee del href.
  const regionDe = (objetivo: EventTarget | null) => {
    const enlace = (objetivo as Element | null)?.closest?.("svg a");
    const href = enlace?.getAttribute("href") ?? "";
    return href.startsWith(RUTA) ? { enlace, slug: href.slice(RUTA.length) } : null;
  };
  const posicion = (clientX: number, clientY: number) => {
    const caja = geoRef.current?.getBoundingClientRect();
    return caja ? { x: clientX - caja.left, y: clientY - caja.top } : { x: 0, y: 0 };
  };

  // Espacio a la derecha del mapa hasta el borde del recuadro: en escritorio la tarjeta puede
  // quedar sobre el ranking para no tapar Chile (el mapa es angosto).
  const anchoDisponible = () => {
    const geo = geoRef.current;
    const caja = geo?.closest(`.${styles.contenedor}`)?.getBoundingClientRect();
    return geo && caja ? caja.right - geo.getBoundingClientRect().left : 0;
  };

  useEffect(() => {
    if (!activa) return;
    const alTeclear = (e: KeyboardEvent) => e.key === "Escape" && setActiva(null);
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [activa]);

  useEffect(() => () => cancelarOcultar(), []);
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
  // Tarjeta de región: flotante junto al cursor en escritorio; en celular, panel inferior en un
  // portal sobre toda la página (la sección usa content-visibility, que encerraría un panel fixed).
  const tarjetaNodo =
    vista === "mapa" && filaActiva && activa
      ? (() => {
          const tarjeta = (
            <TarjetaRegion
              panel={compacto}
              fila={filaActiva}
              puesto={puesto}
              total={filas.length}
              tasaChile={tasaChile}
              x={activa.x}
              y={activa.y}
              anchoContenedor={activa.ancho}
              fijada={activa.fijada}
              onEntrar={cancelarOcultar}
              onSalir={() => !activa.fijada && programarOcultar()}
              onCerrar={() => setActiva(null)}
            />
          );
          if (!compacto) return tarjeta;
          return createPortal(
            <>
              <div className={styles.tarjetaFondo} aria-hidden="true" onClick={() => setActiva(null)} />
              {tarjeta}
            </>,
            document.body
          );
        })()
      : null;

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
        <div
          ref={geoRef}
          className={styles.geografia}
          onPointerMove={(e) => {
            if (vista !== "mapa" || e.pointerType !== "mouse") return;
            if ((e.target as Element).closest(`.${styles.tarjeta}`)) return cancelarOcultar();
            const r = regionDe(e.target);
            if (r) {
              cancelarOcultar();
              if (activa?.slug !== r.slug && !activa?.fijada) {
                setActiva({ slug: r.slug, ...posicion(e.clientX, e.clientY), ancho: anchoDisponible(), fijada: false });
              }
            } else if (!activa?.fijada) {
              programarOcultar();
            }
          }}
          onPointerLeave={() => !activa?.fijada && programarOcultar()}
          onClickCapture={(e) => {
            if (vista !== "mapa") return;
            if ((e.target as Element).closest(`.${styles.tarjeta}`)) return;
            const r = regionDe(e.target);
            // Teclado (detail 0): Enter sigue llevando a la región. Clic o toque: abre la tarjeta.
            if (r && e.detail > 0) {
              e.preventDefault();
              cancelarOcultar();
              setActiva({ slug: r.slug, ...posicion(e.clientX, e.clientY), ancho: anchoDisponible(), fijada: true });
              trackEvent("datos_filter", { tipo: "mapa_region", valor: r.slug });
            } else if (!r) {
              setActiva(null);
            }
          }}
          onFocusCapture={(e) => {
            const r = regionDe(e.target);
            if (!r?.enlace) return;
            cancelarOcultar();
            const caja = r.enlace.getBoundingClientRect();
            setActiva({
              slug: r.slug,
              ...posicion(caja.left + caja.width / 2, caja.top + caja.height / 2),
              ancho: anchoDisponible(),
              fijada: false,
            });
          }}
          onBlurCapture={(e) => {
            const destino = e.relatedTarget as Element | null;
            if (destino && geoRef.current?.contains(destino)) return;
            if (!activa?.fijada) programarOcultar();
          }}
        >
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
          {tarjetaNodo}
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

/** Tarjeta flotante con los datos de la región (al pasar el cursor, enfocar o tocar el mapa). */
function TarjetaRegion({
  panel,
  fila,
  puesto,
  total,
  tasaChile,
  x,
  y,
  anchoContenedor,
  fijada,
  onEntrar,
  onSalir,
  onCerrar,
}: {
  panel: boolean;
  fila: FilaMapa;
  puesto: number;
  total: number;
  tasaChile: number;
  x: number;
  y: number;
  anchoContenedor: number;
  fijada: boolean;
  onEntrar: () => void;
  onSalir: () => void;
  onCerrar: () => void;
}) {
  const ANCHO = 264;
  const brecha = fila.tasa - tasaChile;
  // A la derecha del puntero si cabe; si no, a la izquierda. Siempre dentro del contenedor.
  const izquierda =
    anchoContenedor > 0 && x + 18 + ANCHO > anchoContenedor
      ? Math.max(8, x - 18 - ANCHO)
      : Math.min(x + 18, Math.max(8, anchoContenedor - ANCHO - 8));
  return (
    <div
      className={panel ? `${styles.tarjeta} ${styles.tarjetaPanel}` : styles.tarjeta}
      style={panel ? undefined : { left: izquierda, top: Math.max(8, y - 40) }}
      role="dialog"
      aria-label={`Desempleo en ${fila.nombre}`}
      onPointerEnter={onEntrar}
      onPointerLeave={onSalir}
    >
      <div className={styles.tarjetaCabecera}>
        <strong>{fila.nombre}</strong>
        {fijada || panel ? (
          <button type="button" onClick={onCerrar} aria-label="Cerrar tarjeta" className={styles.tarjetaCerrar}>
            ×
          </button>
        ) : null}
      </div>
      <p className={styles.tarjetaTasa}>
        {numero(fila.tasa)}
        <span> %</span>
        {fila.nota ? <sup>{fila.nota}</sup> : null}
      </p>
      <p className={styles.tarjetaEtiqueta}>Tasa de desocupación</p>
      <dl className={styles.tarjetaDatos}>
        <div>
          <dt>En 12 meses</dt>
          <dd>{variacion(fila.yoy)}</dd>
        </div>
        <div>
          <dt>Frente a Chile</dt>
          <dd>{`${brecha > 0 ? "+" : ""}${numero(brecha)} pp.`}</dd>
        </div>
        <div>
          <dt>Ranking</dt>
          <dd>
            {puesto} de {total}
          </dd>
        </div>
      </dl>
      {fila.nota ? (
        <p className={styles.tarjetaNota}>
          Estimación {fila.nota === "a" ? "poco fiable" : "no fiable"} según el INE.
        </p>
      ) : null}
      <a href={`${RUTA}${fila.slug}`} className={styles.tarjetaBoton}>
        Ver más sobre {fila.nombre} →
      </a>
    </div>
  );
}
