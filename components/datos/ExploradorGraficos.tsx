"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { trackEvent } from "@/lib/analytics/marketing";
import styles from "./ExploradorDesempleo.module.css";

type Periodo = { codigo: string; label: string };
type Territorio = {
  slug: string;
  nombre: string;
  tasas: (number | null)[];
  notas?: (string | null)[];
  promedios_anuales: { ano: number; tasa: number }[];
};
type Datos = { periodos: Periodo[]; territorios: Territorio[] };
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
function Grafico({
  data,
  series,
  label,
  pandemia = false,
}: {
  data: Record<string, string | number | null>[];
  series: { key: string; color: string }[];
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
            margin={{ top: 12, right: 170, left: 0, bottom: 12 }}
          >
            <CartesianGrid stroke="#e8e8e4" vertical={false} />
            <XAxis dataKey="label" minTickGap={35} tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} width={40} unit="%" />
            <Tooltip
              formatter={(value) =>
                typeof value === "number" ? fmt(value) : "Sin datos"
              }
            />
            {pandemia && (
              <ReferenceArea
                x1={data.find((d) => d.codigo === "2020-03")?.label ?? ""}
                x2={data.find((d) => d.codigo === "2021-12")?.label ?? ""}
                fill="#d4d4d0"
                fillOpacity={0.5}
                label={{
                  value: "Pandemia",
                  position: "insideTop",
                  fontSize: 11,
                }}
              />
            )}
            {series.map((s) => {
              let last = data.length - 1;
              while (last >= 0 && data[last][s.key] == null) last--;
              return (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.key}
                  stroke={s.color}
                  strokeWidth={s.color === "#1890ff" ? 2.5 : 1.5}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls={false}
                >
                  <LabelList
                    position="right"
                    fill={
                      s.color === "#aaa" || s.color === "#a3a3a0"
                        ? "#555"
                        : s.color
                    }
                    fontSize={11}
                    valueAccessor={(_, index) => (index === last ? s.key : "")}
                  />
                </Line>
              );
            })}
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
  const history = periodos.slice(desde).map((p, i) => ({
    label: p.label,
    codigo: p.codigo,
    [nombre]: actual.tasas[desde + i],
    ...(territorio !== "nacional" ? { Chile: chile.tasas[desde + i] } : {}),
  }));
  const years = [...new Set(periodos.map((p) => Number(p.codigo.slice(0, 4))))];
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
  const compare = periodos.map((p, i) =>
    Object.assign(
      { label: p.label, Chile: chile.tasas[i] },
      ...selected.map((t) => ({ [t.nombre]: t.tasas[i] })),
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
  function toggleRegion(slug: string) {
    const next = regiones.includes(slug)
      ? regiones.filter((x) => x !== slug)
      : [...regiones, slug].slice(0, 3);
    setRegiones(next);
    urlState("comparar", next.join(","));
    evento("comparar", next.join(","));
  }
  return (
    <>
      <section className={styles.panel} aria-labelledby="historico-titulo">
        <h2 id="historico-titulo">Histórico de {nombre} desde 2010</h2>
        <p className={styles.subtle}>
          Tasa de desocupación en trimestres móviles. Fuente: INE · Gráfico:
          ProgramBI.
        </p>
        <div className={styles.controls} aria-label="Vista histórica">
          <button
            aria-pressed={vista === "historico"}
            onClick={() => {
              setVista("historico");
              evento("tendencia", "historico");
            }}
          >
            Evolución
          </button>
          <button
            aria-pressed={vista === "tendencias"}
            onClick={() => {
              setVista("tendencias");
              evento("tendencia", "multi-anio");
            }}
          >
            Tendencias multi-año
          </button>
        </div>
        {vista === "historico" ? (
          <>
            <div className={styles.controls} aria-label="Rango histórico">
              {[
                ["1", "1 año"],
                ["5", "5 años"],
                ["10", "10 años"],
                ["todo", "Todo"],
              ].map(([v, label]) => (
                <button
                  key={v}
                  aria-pressed={rango === v}
                  onClick={() => {
                    setRango(v);
                    evento("rango", v);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <Grafico
              data={history}
              series={[
                { key: nombre, color: "#1890ff" },
                ...(territorio !== "nacional"
                  ? [{ key: "Chile", color: "#888" }]
                  : []),
              ]}
              label={`Evolución de la tasa de desocupación de ${nombre}`}
              pandemia
            />
          </>
        ) : (
          <>
            <h3>Estacionalidad por año</h3>
            <p className={styles.subtle}>
              Compara el mismo trimestre móvil entre años. El año más reciente
              se destaca en azul y el anterior en naranja.
            </p>
            <fieldset className={styles.checks}>
              <legend>Selecciona los años</legend>
              {years.map((y) => (
                <label key={y}>
                  <input
                    type="checkbox"
                    checked={anos.includes(y)}
                    onChange={() => {
                      const next = anos.includes(y)
                        ? anos.filter((x) => x !== y)
                        : [...anos, y];
                      setAnos(next);
                      evento("tendencia", next.join(","));
                    }}
                  />
                  {y}
                </label>
              ))}
            </fieldset>
            <Grafico
              data={estacional}
              series={anos.map((y) => ({
                key: String(y),
                color:
                  y === years.at(-1)
                    ? "#1890ff"
                    : y === (years.at(-1) ?? 0) - 1
                      ? "#e38700"
                      : "#aaa",
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
        <fieldset className={styles.checks}>
          <legend>Regiones seleccionadas: {regiones.length} de 3</legend>
          {disponibles.map((t) => (
            <label key={t.slug}>
              <input
                type="checkbox"
                checked={regiones.includes(t.slug)}
                disabled={!regiones.includes(t.slug) && regiones.length >= 3}
                onChange={() => toggleRegion(t.slug)}
              />
              {t.nombre}
            </label>
          ))}
        </fieldset>
        <Grafico
          data={compare}
          series={[
            { key: "Chile", color: "#1890ff" },
            ...selected.map((t, i) => ({
              key: t.nombre,
              color: ["#e38700", "#686868", "#a3a3a0"][i],
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
            <select value={a} onChange={(e) => setPeriodo("a", e.target.value)}>
              {periodos.map((p) => (
                <option value={p.codigo} key={p.codigo}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Período B
            <select value={b} onChange={(e) => setPeriodo("b", e.target.value)}>
              {periodos.map((p) => (
                <option value={p.codigo} key={p.codigo}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.controls}>
          {[
            [1, "vs hace 1 año"],
            [5, "vs hace 5 años"],
            ["2019", "vs 2019 (prepandemia)"],
          ].map(([v, label]) => (
            <button
              key={String(v)}
              onClick={() => shortcut(v as number | "2019")}
            >
              {label}
            </button>
          ))}
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
                      ? `rgba(227,135,0,${0.12 + (0.45 * Math.abs(diff ?? 0)) / maxMagnitud})`
                      : `rgba(24,105,173,${0.12 + (0.35 * Math.abs(diff ?? 0)) / maxMagnitud})`,
              }}
            >
              <strong>{t.nombre}</strong>
              <br />
              {pp(diff)}
            </div>
          ))}
        </div>
        <p className={styles.subtle}>
          Naranja: aumento · Azul: disminución · Gris: sin cambio
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
                <th>{periodos[ia]?.label}</th>
                <th>{periodos[ib]?.label}</th>
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
