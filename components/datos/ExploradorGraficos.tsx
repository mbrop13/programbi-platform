"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  usePlotArea,
  useYAxisScale,
} from "recharts";
import { trackEvent } from "@/lib/analytics/marketing";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import styles from "./ExploradorDesempleo.module.css";

type Periodo = { codigo: string; label: string };
type AjusteINE = {
  fuente: { fecha_actualizacion: string; url: string };
  series: { nacional: Array<{ p: string; valores: { tasa: number }; notas: { tasa?: "a" | "b" } }> };
};
type Territorio = {
  slug: string;
  nombre: string;
  tasas: (number | null)[];
  notas?: (string | null)[];
  promedios_anuales: { ano: number; tasa: number }[];
};
type Datos = { periodos: Periodo[]; territorios: Territorio[] };
type Serie = { key: string; color: string; corto?: string };
type Fila = Record<string, string | number | null>;

const AZUL = "#1890ff";
const AZUL_TEXTO = "#0b63c5";
const AMARILLO = "#f2c811";
const AMARILLO_TEXTO = "#8a6d00";
const AZUL_OSCURO = "#0b3d7a";
const GRIS_LINEA = "#686868";
const GRIS_LINEA_CLARO = "#a3a3a0";
const GRIS_ETIQUETA = "#555555";
const REGION_COLORES = [AZUL_OSCURO, AMARILLO, GRIS_LINEA];

const fmt = (n: number | null | undefined) =>
  n == null
    ? "Sin datos"
    : `${n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
const pp = (n: number | null | undefined) =>
  n == null
    ? "Sin datos"
    : `${n > 0 ? "+" : ""}${n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} pp.`;
const evento = (tipo: string, valor: string) =>
  trackEvent("datos_filter", { tipo, valor });
function urlState(key: string, value: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState(null, "", url);
}
/** Color de texto AA para cada color de línea (el amarillo nunca va en texto). */
function colorEtiqueta(color: string) {
  const c = color.toLowerCase();
  if (c === AZUL) return AZUL_TEXTO;
  if (c === AMARILLO) return AMARILLO_TEXTO;
  if (
    c === GRIS_LINEA_CLARO ||
    c === "#aaa" ||
    c === "#aaaaaa" ||
    c === "#888" ||
    c === "#888888"
  )
    return GRIS_ETIQUETA;
  return color;
}
/** Nombres cortos para etiquetas finales y chips (las tablas conservan el nombre completo). */
const NOMBRES_CORTOS: Record<string, string> = {
  metropolitana: "RM",
  "arica-y-parinacota": "Arica y Par.",
  ohiggins: "O’Higgins",
  araucania: "Araucanía",
  "los-rios": "Los Ríos",
  "los-lagos": "Los Lagos",
};
function nombreCorto(t: Territorio) {
  return NOMBRES_CORTOS[t.slug] ?? t.nombre;
}
const MIN_GAP_ETIQUETA = 14;
const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);
/**
 * Colisión de etiquetas finales en Y: ordena por Y, empuja hacia abajo las
 * que quedan a menos de 14px de la anterior, clamp dentro del área de
 * trazado y, si el bloque se sale por abajo, compacta hacia arriba.
 */
function resolverColisiones(
  items: { key: string; y: number }[],
  top: number,
  bottom: number,
) {
  const orden = [...items].sort((a, b) => a.y - b.y);
  const ys = orden.map((d) => clamp(d.y, top, bottom));
  for (let i = 1; i < ys.length; i++) {
    if (ys[i] - ys[i - 1] < MIN_GAP_ETIQUETA) {
      ys[i] = ys[i - 1] + MIN_GAP_ETIQUETA;
    }
  }
  if (ys.length > 0 && ys[ys.length - 1] > bottom) {
    ys[ys.length - 1] = bottom;
    for (let i = ys.length - 2; i >= 0; i--) {
      ys[i] = Math.min(ys[i], ys[i + 1] - MIN_GAP_ETIQUETA);
    }
  }
  return orden.map((d, i) => ({ key: d.key, y: ys[i] }));
}
/**
 * Etiquetas finales sin superposición (nombre de serie + última tasa).
 * Hijo directo de LineChart: recharts 3 renderiza elementos arbitrarios
 * dentro del SVG y los hooks públicos exponen las escalas reales de los ejes.
 */
function EtiquetasFinales({ data, series }: { data: Fila[]; series: Serie[] }) {
  const plot = usePlotArea();
  const yScale = useYAxisScale();
  const etiquetas = useMemo(() => {
    if (!plot || !yScale || data.length === 0) return [];
    const puntos = series
      .map((s) => {
        let i = data.length - 1;
        while (i >= 0 && data[i][s.key] == null) i--;
        if (i < 0) return null;
        const valor = data[i][s.key];
        if (typeof valor !== "number") return null;
        const y = yScale(valor);
        if (typeof y !== "number" || !Number.isFinite(y)) return null;
        return { key: s.key, texto: `${s.corto ?? s.key}: ${fmt(valor)}`, color: s.color, y };
      })
      .filter((p): p is NonNullable<typeof p> => p != null);
    const resueltas = resolverColisiones(
      puntos.map((p) => ({ key: p.key, y: p.y })),
      plot.y + 7,
      plot.y + plot.height - 7,
    );
    const x = plot.x + plot.width + 8;
    return puntos.map((p) => ({
      ...p,
      x,
      y: resueltas.find((r) => r.key === p.key)?.y ?? p.y,
    }));
  }, [data, series, plot, yScale]);
  if (etiquetas.length === 0) return null;
  return (
    <g className={styles.endLabels} aria-hidden="true">
      {etiquetas.map((e) => (
        <text
          key={e.key}
          x={e.x}
          y={e.y}
          dy="0.35em"
          fontSize={11}
          fontWeight={600}
          fill={colorEtiqueta(e.color)}
        >
          {e.texto}
        </text>
      ))}
    </g>
  );
}
function Grafico({
  data,
  series,
  label,
  pandemia = false,
}: {
  data: Fila[];
  series: Serie[];
  label: string;
  pandemia?: boolean;
}) {
  return (
    <div
      className={styles.chart}
      role="img"
      tabIndex={0}
      aria-label={`${label}. Desplaza horizontalmente para ver el gráfico completo.`}
    >
      <div className={styles.chartInner}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 12, right: 120, left: 0, bottom: 12 }}
          >
            <CartesianGrid stroke="#e5e4df" vertical={false} />
            <XAxis
              dataKey="label"
              minTickGap={35}
              tick={{ fontSize: 11, fill: "#5f5e5a" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#5f5e5a" }}
              width={40}
              unit="%"
            />
            <Tooltip
              formatter={(value) =>
                typeof value === "number" ? fmt(value) : "Sin datos"
              }
            />
            {pandemia && (
              <ReferenceArea
                x1={data.find((d) => d.codigo === "2020-03")?.label ?? ""}
                x2={data.find((d) => d.codigo === "2021-12")?.label ?? ""}
                fill="#e5e4df"
                fillOpacity={0.6}
                label={{
                  value: "Pandemia",
                  position: "insideTop",
                  fontSize: 11,
                  fill: "#5f5e5a",
                }}
              />
            )}
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.key}
                stroke={s.color}
                strokeWidth={s.color === AZUL ? 2.5 : 1.5}
                dot={false}
                isAnimationActive={false}
                connectNulls={false}
              />
            ))}
            <EtiquetasFinales data={data} series={series} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default function ExploradorGraficos({
  territorio,
  nombre,
  version,
}: {
  territorio: string;
  nombre: string;
  version: string;
}) {
  const [datos, setDatos] = useState<Datos | null>(null);
  const [error, setError] = useState(false);
  const [diferencias, setDiferencias] = useState<{
    periodo: string;
    diferencias: Record<string, (number | null)[]>;
  } | null>(null);
  const [errorDiferencias, setErrorDiferencias] = useState("");
  const [rango, setRango] = useState("5");
  const [tipoSerie, setTipoSerie] = useState<"original" | "ajustada">("original");
  const [ajuste, setAjuste] = useState<{ estado: "cargando" | "error" } | { estado: "listo"; archivo: AjusteINE } | null>(null);

  async function seleccionarSerie(tipo: typeof tipoSerie) {
    if (tipo === tipoSerie && ajuste?.estado !== "error") return;
    setTipoSerie(tipo);
    evento("serie", tipo);
    if (tipo !== "ajustada" || ajuste?.estado === "cargando" || ajuste?.estado === "listo") return;
    setAjuste({ estado: "cargando" });
    try {
      const respuesta = await fetch(`/datos/desempleo/estacional.json?v=${encodeURIComponent(version)}`, {
        signal: AbortSignal.timeout(10_000),
      });
      if (!respuesta.ok) throw new Error("Serie ajustada no disponible");
      const archivo: AjusteINE = await respuesta.json();
      setAjuste({ estado: "listo", archivo });
    } catch {
      setAjuste({ estado: "error" });
    }
  }
  const [vista, setVista] = useState("historico");
  const [anos, setAnos] = useState<number[]>([]);
  const [regiones, setRegiones] = useState<string[]>([]);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [orden, setOrden] = useState<"nombre" | "diferencia">("diferencia");
  const [ascendente, setAscendente] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/datos/desempleo/explorador.json?v=${encodeURIComponent(version)}`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d: Datos) => {
        setDatos(d);
        const last = d.periodos.at(-1)?.codigo || "";
        const query = new URLSearchParams(window.location.search);
        const valid = (p: string | null) =>
          p && d.periodos.some((x) => x.codigo === p) ? p : "";
        setA(valid(query.get("a")) || last);
        setB(valid(query.get("b")) || d.periodos.at(-13)?.codigo || last);
        const year = Number(last.slice(0, 4));
        setAnos([
          ...new Set([2019, year - 4, year - 3, year - 2, year - 1, year]),
        ]);
        const requested = (query.get("comparar") || "metropolitana,biobio")
          .split(",")
          .map((x) => (x === "rm" ? "metropolitana" : x));
        setRegiones(
          [
            ...new Set(
              requested.filter(
                (x) =>
                  x !== "nacional" && d.territorios.some((t) => t.slug === x),
              ),
            ),
          ].slice(0, 3),
        );
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [version]);
  useEffect(() => {
    if (!a) return;
    const controller = new AbortController();
    fetch(
      `/datos/desempleo/diferencias/${encodeURIComponent(a)}.json?v=${encodeURIComponent(version)}`,
      { signal: controller.signal },
    )
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((value) => {
        setDiferencias(value);
        setErrorDiferencias("");
      })
      .catch((e) => {
        if (e.name !== "AbortError") setErrorDiferencias(a);
      });
    return () => controller.abort();
  }, [a, version]);
  useEffect(() => {
    if (datos && window.location.hash === "#comparar-regiones") {
      requestAnimationFrame(() =>
        document
          .getElementById("comparar-regiones-contenido")
          ?.scrollIntoView(),
      );
    }
  }, [datos]);
  const contexto = useMemo(() => {
    if (!datos) return null;
    const actual =
      datos.territorios.find((t) => t.slug === territorio) ||
      datos.territorios.find((t) => t.slug === "nacional");
    const chile = datos.territorios.find((t) => t.slug === "nacional");
    if (!actual || !chile) return null;
    return { actual, chile };
  }, [datos, territorio]);
  if (error)
    return (
      <div className={styles.panel} role="alert">
        No se pudo cargar el explorador. La tabla histórica está disponible a
        continuación.
      </div>
    );
  if (!datos || !contexto)
    return (
      <div className={styles.skeleton} role="status">
        Cargando datos del INE…
      </div>
    );
  const { periodos, territorios } = datos;
  const { actual, chile } = contexto;
  const disponibles = territorios.filter((t) => t.slug !== "nacional");
  const desde =
    rango === "todo" ? 0 : Math.max(0, periodos.length - Number(rango) * 12);
  const ajustada = tipoSerie === "ajustada";
  const archivoAjuste = ajuste?.estado === "listo" ? ajuste.archivo : null;
  const tasasAjustadas = new Map(archivoAjuste?.series.nacional.map((fila) => [fila.p, fila]));
  const history = periodos.slice(desde).map((p, i) => ({
    label: p.label,
    codigo: p.codigo,
    [nombre]: ajustada ? tasasAjustadas.get(p.codigo)?.valores.tasa ?? null : actual.tasas[desde + i],
    ...(territorio !== "nacional" ? { Chile: chile.tasas[desde + i] } : {}),
  }));
  const years = [...new Set(periodos.map((p) => Number(p.codigo.slice(0, 4))))];
  const anoMasReciente = years.at(-1) ?? 0;
  const estacional = Array.from({ length: 12 }, (_, month) => {
    const row: Record<string, string | number | null> = {
      label:
        periodos
          .find((p) => Number(p.codigo.slice(5)) === month + 1)
          ?.label.replace(/\s+\d{4}$/, "") || String(month + 1),
    };
    anos.forEach((y) => {
      const index = periodos.findIndex(
        (p) => p.codigo === `${y}-${String(month + 1).padStart(2, "0")}`,
      );
      row[String(y)] = index < 0 ? null : actual.tasas[index];
    });
    return row;
  });
  const selected = disponibles.filter((t) => regiones.includes(t.slug));
  const colorPorRegion = new Map(
    selected.map((t, i) => [t.slug, REGION_COLORES[i]]),
  );
  const compare = periodos.map((p, i) =>
    Object.assign(
      { label: p.label, Chile: chile.tasas[i] },
      ...selected.map((t) => ({ [nombreCorto(t)]: t.tasas[i] })),
    ),
  );
  const ia = periodos.findIndex((p) => p.codigo === a);
  const ib = periodos.findIndex((p) => p.codigo === b);
  const rows = territorios
    .map((t) => ({
      t,
      va: t.tasas[ia],
      vb: t.tasas[ib],
      diff:
        diferencias?.periodo === a
          ? (diferencias.diferencias[t.slug]?.[ib] ?? null)
          : null,
    }))
    .sort((x, y) => {
      const cmp =
        orden === "nombre"
          ? x.t.nombre.localeCompare(y.t.nombre, "es")
          : (x.diff ?? -Infinity) - (y.diff ?? -Infinity);
      return ascendente ? cmp : -cmp;
    });
  const regionalRows = rows.filter(
    (r) => r.t.slug !== "nacional" && r.diff != null,
  );
  const maxMagnitud = Math.max(
    0.01,
    ...regionalRows.map((r) => Math.abs(r.diff ?? 0)),
  );
  const max = [...regionalRows].sort(
    (x, y) => (y.diff ?? -Infinity) - (x.diff ?? -Infinity),
  )[0];
  const aumentaron = regionalRows.filter((r) => (r.diff ?? 0) > 0).length;
  function setPeriodo(which: "a" | "b", value: string) {
    (which === "a" ? setA : setB)(value);
    urlState(which, value);
    evento(`periodo_${which}`, value);
  }
  function shortcut(yearsBack: number | "2019") {
    const year =
      yearsBack === "2019" ? 2019 : Number(a.slice(0, 4)) - yearsBack;
    const target = `${year}-${a.slice(5)}`;
    if (periodos.some((p) => p.codigo === target)) setPeriodo("b", target);
  }
  function cambiarAnos(valor: string | string[]) {
    if (!Array.isArray(valor)) return;
    const next = valor
      .map(Number)
      .filter((n) => years.includes(n))
      .sort((x, y) => x - y);
    setAnos(next);
    evento("tendencia", next.join(","));
  }
  function cambiarRegiones(valor: string | string[]) {
    if (!Array.isArray(valor)) return;
    const next = valor
      .filter((slug) => disponibles.some((t) => t.slug === slug))
      .slice(0, 3);
    setRegiones(next);
    urlState("comparar", next.join(","));
    evento("comparar", next.join(","));
  }
  const periodosDesc = [...periodos].reverse();
  const etiquetaA = periodos[ia]?.label ?? "";
  const etiquetaB = periodos[ib]?.label ?? "";
  const targetDe = (v: number | "2019") => {
    const year = v === "2019" ? 2019 : Number(a.slice(0, 4)) - v;
    return `${year}-${a.slice(5)}`;
  };
  const nombreCortoActual =
    territorio === "nacional" ? "Chile" : NOMBRES_CORTOS[territorio] ?? nombre;
  return (
    <>
      <section className={styles.panel} aria-labelledby="historico-titulo">
        <h2 id="historico-titulo">Histórico de {nombre} desde 2010</h2>
        <p className={styles.subtle}>
          Tasa de desocupación en trimestres móviles. Fuente: INE · Gráfico:
          ProgramBI.
        </p>
        <div className={styles.controls}>
          <ToggleGroup
            type="single"
            value={vista}
            onValueChange={(v) => {
              if (typeof v !== "string" || v === "") return;
              setVista(v);
              evento("tendencia", v === "historico" ? "historico" : "multi-anio");
            }}
            aria-label="Vista histórica"
          >
            <ToggleGroupItem value="historico" className={styles.toggleItem}>
              Evolución
            </ToggleGroupItem>
            <ToggleGroupItem value="tendencias" className={styles.toggleItem}>
              Tendencias multi-año
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {vista === "historico" ? (
          <>
            <div className={styles.controls}>
              <ToggleGroup
                type="single"
                value={rango}
                onValueChange={(v) => {
                  if (typeof v !== "string" || v === "") return;
                  setRango(v);
                  evento("rango", v);
                }}
                aria-label="Rango histórico"
              >
                <ToggleGroupItem value="1" className={styles.toggleItem}>1A</ToggleGroupItem>
                <ToggleGroupItem value="5" className={styles.toggleItem}>5A</ToggleGroupItem>
                <ToggleGroupItem value="10" className={styles.toggleItem}>10A</ToggleGroupItem>
                <ToggleGroupItem value="todo" className={styles.toggleItem}>Todo</ToggleGroupItem>
              </ToggleGroup>
            </div>
            {territorio === "nacional" && (
              <div className={styles.controls}>
                <ToggleGroup
                  type="single"
                  value={tipoSerie}
                  onValueChange={(v) => {
                    if (v === "original" || v === "ajustada") {
                      void seleccionarSerie(v);
                    } else if (
                      v === "" &&
                      tipoSerie === "ajustada" &&
                      ajuste?.estado === "error"
                    ) {
                      void seleccionarSerie("ajustada");
                    }
                  }}
                  aria-label="Tipo de serie"
                >
                  <ToggleGroupItem value="original" className={styles.toggleItem}>Original</ToggleGroupItem>
                  <ToggleGroupItem value="ajustada" className={styles.toggleItem}>Desestacionalizada</ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}
            {ajustada && !archivoAjuste ? (
              <div className={styles.chartStatus} role="status">
                {ajuste?.estado === "error"
                  ? "No se pudo cargar la serie ajustada. Presiona Desestacionalizada para reintentar."
                  : "Cargando la serie desestacionalizada…"}
              </div>
            ) : <Grafico
              data={history}
              series={[
                { key: nombre, color: AZUL, corto: nombreCortoActual },
                ...(territorio !== "nacional"
                  ? [{ key: "Chile", color: GRIS_LINEA }]
                  : []),
              ]}
              label={`Evolución de la tasa de desocupación ${ajustada ? "desestacionalizada " : ""}de ${nombre}`}
              pandemia
            />}
            {ajustada && archivoAjuste && (
              <>
                <p className={styles.subtle}>
                  El INE aplica un ajuste estadístico para facilitar la comparación entre trimestres móviles consecutivos.
                  {" "}<a href={archivoAjuste.fuente.url}>Serie oficial del INE</a> · {archivoAjuste.fuente.fecha_actualizacion}
                </p>
                <details className={styles.tableDetails}>
                  <summary>Ver tabla de la tasa desestacionalizada</summary>
                  <div className={styles.tableWrap} tabIndex={0} role="region" aria-label="Tasa nacional desestacionalizada">
                    <table className={styles.table}>
                      <caption>Desocupación desestacionalizada en Chile</caption>
                      <thead><tr><th scope="col">Trimestre móvil</th><th scope="col">Tasa (%)</th></tr></thead>
                      <tbody>{[...history].reverse().map((fila) => {
                        const punto = tasasAjustadas.get(fila.codigo);
                        return (
                          <tr key={fila.codigo}>
                            <th scope="row">{fila.label}</th>
                            <td>{fmt(punto?.valores.tasa)} {punto?.notas.tasa && <sup>{punto.notas.tasa}</sup>}</td>
                          </tr>
                        );
                      })}</tbody>
                    </table>
                  </div>
                </details>
              </>
            )}
          </>
        ) : (
          <>
            <h3>Estacionalidad por año</h3>
            <p className={styles.subtle}>
              Compara el mismo trimestre móvil entre años. El año más reciente
              se destaca en azul; el resto, en gris.
            </p>
            <div className={styles.checks}>
              <ToggleGroup
                type="multiple"
                value={anos.map(String)}
                onValueChange={cambiarAnos}
                aria-label="Selecciona los años"
              >
                {years.map((y) => {
                  const activo = anos.includes(y);
                  const color =
                    y === anoMasReciente
                      ? AZUL
                      : y === anoMasReciente - 1
                        ? GRIS_LINEA
                        : GRIS_LINEA_CLARO;
                  return (
                    <ToggleGroupItem
                      key={y}
                      value={String(y)}
                      className={`${styles.toggleItem} rounded-full`}
                      style={
                        activo
                          ? {
                              borderColor: color,
                              background: `${color}1f`,
                              color: colorEtiqueta(color),
                            }
                          : undefined
                      }
                    >
                      <span
                        className={styles.dot}
                        style={{ background: color }}
                        aria-hidden="true"
                      />
                      {y}
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </div>
            <Grafico
              data={estacional}
              series={anos.map((y) => ({
                key: String(y),
                color:
                  y === anoMasReciente
                    ? AZUL
                    : y === anoMasReciente - 1
                      ? GRIS_LINEA
                      : GRIS_LINEA_CLARO,
              }))}
              label={`Tendencias estacionales de ${nombre} por año`}
            />
            <details className={styles.tableDetails}>
              <summary>Ver tabla de datos estacionales</summary>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Trimestre móvil</th>
                      {anos.map((y) => (
                        <th key={y}>{y}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {estacional.map((row) => (
                      <tr key={String(row.label)}>
                        <th>{row.label}</th>
                        {anos.map((y) => (
                          <td key={y}>
                            {fmt(row[String(y)] as number | null)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
            <h3>Promedio anual de trimestres móviles</h3>
            <p className={styles.subtle}>
              Media de los 12 trimestres móviles de cada año calendario
              completo; cálculo ProgramBI.
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Año</th>
                    <th>Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {actual.promedios_anuales.map((x) => (
                    <tr key={x.ano}>
                      <th>{x.ano}</th>
                      <td>{fmt(x.tasa)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3>El mismo trimestre por región y año</h3>
            <p className={styles.subtle}>
              Se compara el trimestre móvil más reciente en cada año. Los tonos
              más intensos representan tasas mayores.
            </p>
            <div className={styles.tableWrap}>
              <table className={`${styles.table} ${styles.heat}`}>
                <thead>
                  <tr>
                    <th>Región</th>
                    {years.map((y) => (
                      <th key={y}>{y}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {disponibles.map((t) => (
                    <tr key={t.slug}>
                      <th>{t.nombre}</th>
                      {years.map((y) => {
                        const idx = periodos.findIndex(
                          (p) =>
                            p.codigo ===
                            `${y}-${periodos.at(-1)?.codigo.slice(5)}`,
                        );
                        const val = idx < 0 ? null : t.tasas[idx];
                        return (
                          <td
                            key={y}
                            title={`${t.nombre}, ${y}: ${fmt(val)}`}
                            style={{
                              backgroundColor:
                                val == null
                                  ? "transparent"
                                  : `rgba(24,144,255,${Math.min(0.7, Math.max(0.08, val / 25))})`,
                            }}
                          >
                            {fmt(val)}
                            {t.notas?.[idx] ? ` (${t.notas[idx]})` : ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
      <section className={styles.panel} id="comparar-regiones-contenido">
        <h2>Compara regiones con Chile</h2>
        <p>Elige hasta tres regiones. La línea nacional sirve de referencia.</p>
        <div className={styles.checks}>
          <ToggleGroup
            type="multiple"
            value={regiones}
            onValueChange={cambiarRegiones}
            aria-label={`Regiones seleccionadas: ${regiones.length} de 3`}
          >
            {disponibles.map((t) => {
              const activo = regiones.includes(t.slug);
              const lleno = !activo && regiones.length >= 3;
              const color = colorPorRegion.get(t.slug) ?? GRIS_LINEA_CLARO;
              return (
                <ToggleGroupItem
                  key={t.slug}
                  value={t.slug}
                  disabled={lleno}
                  className={`${styles.toggleItem} rounded-full`}
                  style={
                    activo
                      ? {
                          borderColor: color,
                          background: `${color}1f`,
                          color: colorEtiqueta(color),
                        }
                      : undefined
                  }
                >
                  <span
                    className={styles.dot}
                    style={{ background: color }}
                    aria-hidden="true"
                  />
                  {nombreCorto(t)}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>
        <Grafico
          data={compare}
          series={[
            { key: "Chile", color: AZUL },
            ...selected.map((t) => ({
              key: nombreCorto(t),
              color: colorPorRegion.get(t.slug) ?? GRIS_LINEA_CLARO,
            })),
          ]}
          label="Comparación de tasas regionales con Chile"
        />
        <details className={styles.tableDetails}>
          <summary>Ver tabla de datos de la comparación</summary>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Período</th>
                  <th>Chile</th>
                  {selected.map((t) => (
                    <th key={t.slug}>{t.nombre}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periodos.map((p, i) => (
                  <tr key={p.codigo}>
                    <th>{p.label}</th>
                    <td>
                      {fmt(chile.tasas[i])}
                      {chile.notas?.[i] ? ` (${chile.notas[i]})` : ""}
                    </td>
                    {selected.map((t) => (
                      <td key={t.slug}>
                        {fmt(t.tasas[i])}
                        {t.notas?.[i] ? ` (${t.notas[i]})` : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <p className={styles.subtle}>
          Fuente: INE · Gráfico: ProgramBI. Las notas a y b indican estimaciones
          poco fiables y no fiables, respectivamente.
        </p>
      </section>
      <section className={styles.panel}>
        <h2>Compara dos períodos</h2>
        {errorDiferencias === a && (
          <p role="alert">
            No se pudieron cargar las diferencias para este período. Prueba de
            nuevo seleccionando otro período.
          </p>
        )}
        {errorDiferencias !== a && diferencias?.periodo !== a && (
          <p role="status">Cargando diferencias…</p>
        )}
        <p>La diferencia se expresa en puntos porcentuales (pp.).</p>
        <div className={styles.controls}>
          <label>
            Período A
            <Select value={a} onValueChange={(v) => setPeriodo("a", v)}>
              <SelectTrigger className="min-w-[200px] border-[#e5e4df] bg-white">
                <SelectValue placeholder="Selecciona un período" />
              </SelectTrigger>
              <SelectContent>
                {periodosDesc.map((p) => (
                  <SelectItem key={p.codigo} value={p.codigo}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label>
            Período B
            <Select value={b} onValueChange={(v) => setPeriodo("b", v)}>
              <SelectTrigger className="min-w-[200px] border-[#e5e4df] bg-white">
                <SelectValue placeholder="Selecciona un período" />
              </SelectTrigger>
              <SelectContent>
                {periodosDesc.map((p) => (
                  <SelectItem key={p.codigo} value={p.codigo}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>
        <div className={styles.controls}>
          {([
            [1, "vs hace 1 año"],
            [5, "vs hace 5 años"],
            ["2019", "vs 2019 (prepandemia)"],
          ] as [number | "2019", string][]).map(([v, label]) => {
            const disponible = periodos.some((p) => p.codigo === targetDe(v));
            const activo = b === targetDe(v);
            return (
              <Button
                key={String(v)}
                variant="outline"
                size="sm"
                disabled={!disponible}
                aria-pressed={activo}
                className={
                  activo
                    ? "border-[#0b63c5] bg-[#e8f3ff] text-[#0b63c5]"
                    : undefined
                }
                onClick={() => shortcut(v)}
              >
                {label}
              </Button>
            );
          })}
        </div>
        {max && (
          <p>
            {aumentaron} de 16 regiones subieron entre {periodos[ib]?.label} y{" "}
            {periodos[ia]?.label}
            {(max.diff ?? 0) > 0
              ? `; la mayor alza fue ${max.t.nombre} (${pp(max.diff)})`
              : ""}
            .
          </p>
        )}
        <div className={styles.tiles} aria-label="Variación por región">
          {regionalRows.map(({ t, diff }) => (
            <div
              className={styles.tile}
              key={t.slug}
              style={{
                backgroundColor:
                  (diff ?? 0) === 0
                    ? "#f3f3f0"
                    : (diff ?? 0) > 0
                      ? `rgba(194,65,12,${0.08 + (0.3 * Math.abs(diff ?? 0)) / maxMagnitud})`
                      : `rgba(15,123,74,${0.08 + (0.28 * Math.abs(diff ?? 0)) / maxMagnitud})`,
              }}
            >
              <strong>{t.nombre}</strong>
              <br />
              {pp(diff)}
            </div>
          ))}
        </div>
        <p className={styles.subtle}>
          Rojo: aumento de la desocupación · Verde: disminución · Gris: sin cambio
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>Comparación de períodos por territorio</caption>
            <thead>
              <tr>
                <th
                  aria-sort={
                    orden === "nombre"
                      ? ascendente
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    aria-label="Ordenar por territorio"
                    onClick={() => {
                      setAscendente(orden === "nombre" ? !ascendente : true);
                      setOrden("nombre");
                    }}
                  >
                    Territorio ↕
                  </button>
                </th>
                <th>{etiquetaA}</th>
                <th>{etiquetaB}</th>
                <th
                  aria-sort={
                    orden === "diferencia"
                      ? ascendente
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  <button
                    aria-label="Ordenar por diferencia"
                    onClick={() => {
                      setAscendente(
                        orden === "diferencia" ? !ascendente : false,
                      );
                      setOrden("diferencia");
                    }}
                  >
                    Diferencia ↕
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ t, va, vb, diff }) => (
                <tr key={t.slug}>
                  <th>{t.nombre}</th>
                  <td>{fmt(va)}</td>
                  <td>{fmt(vb)}</td>
                  <td>{pp(diff)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.subtle}>
          Fuente: INE · Cálculos: ProgramBI. Variaciones pequeñas pueden no ser
          estadísticamente significativas.
        </p>
      </section>
    </>
  );
}
