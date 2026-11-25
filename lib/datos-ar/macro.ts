import inflacionFallback from "@/data/ar/inflacion.json";
import desempleoFallback from "@/data/ar/desempleo.json";
import type {
  BcraVariableDato,
  BcraVariablesMacro,
  DesempleoArData,
  InflacionArData,
  MacroArResumen,
  PuntoDesempleoAr,
  PuntoIpcAr,
} from "./types";

const TIMEOUT_MS = 3000;
const ISR_REVALIDATE_SECONDS = 86400; // ISR diario

const BCRA_MONETARIAS_URL = "https://api.bcra.gob.ar/estadisticas/v4.0/Monetarias";
const DATOS_GOB_AR_API = "https://apis.datos.gob.ar/series/api/series/";

const INFLACION_BASE = inflacionFallback as InflacionArData;
const DESEMPLEO_BASE = desempleoFallback as DesempleoArData;

async function fetchJsonSeguro<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: ISR_REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function parseBcraVariable(payload: unknown, idVariable: number): BcraVariableDato | null {
  if (!payload || typeof payload !== "object") return null;
  const results = (payload as { results?: unknown }).results;
  if (!Array.isArray(results) || results.length === 0) return null;

  // BCRA v4.0 devuelve registros en `results` o agrupados por `detalle`
  const match = results.find(
    (item) =>
      item &&
      typeof item === "object" &&
      Number((item as { idVariable?: unknown }).idVariable) === idVariable
  ) as
    | {
        idVariable?: number;
        descripcion?: string;
        fecha?: string;
        valor?: number;
        ultValorInformado?: number;
        ultFechaInformada?: string;
        detalle?: Array<{ fecha?: string; valor?: number }>;
      }
    | undefined;

  if (!match) return null;

  if (Array.isArray(match.detalle) && match.detalle.length > 0) {
    const ultimo = match.detalle[0];
    if (ultimo?.fecha && typeof ultimo.valor === "number") {
      return {
        idVariable,
        fecha: ultimo.fecha,
        valor: ultimo.valor,
        descripcion: match.descripcion,
      };
    }
  }

  const valor = match.valor ?? match.ultValorInformado;
  const fecha = match.fecha ?? match.ultFechaInformada;
  if (typeof valor === "number" && typeof fecha === "string") {
    return {
      idVariable,
      fecha,
      valor,
      descripcion: match.descripcion,
    };
  }

  return null;
}

/**
 * Consulta variables 27 y 28 de BCRA v4.0 con timeout de 3 s y respaldo silencioso.
 */
export async function fetchBcraMonetarias(): Promise<BcraVariablesMacro> {
  const [res27, res28] = await Promise.all([
    fetchJsonSeguro<unknown>(`${BCRA_MONETARIAS_URL}/27`),
    fetchJsonSeguro<unknown>(`${BCRA_MONETARIAS_URL}/28`),
  ]);

  let v27 = parseBcraVariable(res27, 27);
  let v28 = parseBcraVariable(res28, 28);

  if (!v27 && !v28) {
    const listado = await fetchJsonSeguro<unknown>(BCRA_MONETARIAS_URL);
    v27 = parseBcraVariable(listado, 27);
    v28 = parseBcraVariable(listado, 28);
  }

  return {
    fuente: "Banco Central de la República Argentina (BCRA) — API Estadísticas v4.0",
    url: BCRA_MONETARIAS_URL,
    origen: v27 || v28 ? "api" : "sin-datos",
    variable27: v27,
    variable28: v28,
  };
}

interface DatosGobArResponse {
  data?: Array<[string, number]>;
}

export async function getInflacionArLive(): Promise<InflacionArData & { origen: "api" | "respaldo" }> {
  const url = `${DATOS_GOB_AR_API}?ids=${INFLACION_BASE.serieIdDatosGobAr}&limit=24&sort=desc&format=json`;
  const live = await fetchJsonSeguro<DatosGobArResponse>(url);

  if (!live?.data || live.data.length === 0) {
    return { ...INFLACION_BASE, origen: "respaldo" };
  }

  const porMes = new Map<string, PuntoIpcAr>(INFLACION_BASE.serie.map((p) => [p.mes, { ...p }]));
  for (const [fecha, valor] of live.data) {
    const mes = String(fecha).slice(0, 7);
    const indice = Number(valor);
    if (!Number.isFinite(indice)) continue;
    const prev = porMes.get(mes);
    if (prev) {
      prev.indice = Number(indice.toFixed(4));
    } else {
      porMes.set(mes, {
        mes,
        indice: Number(indice.toFixed(4)),
        variacionMensual: null,
        variacionInteranual: null,
        variacionAcumuladaAnio: null,
      });
    }
  }

  const serie = Array.from(porMes.values()).sort((a, b) => a.mes.localeCompare(b.mes));
  const idxMap = new Map(serie.map((p) => [p.mes, p.indice]));

  const serieRecalculada = serie.map((p, i) => {
    const anio = Number(p.mes.slice(0, 4));
    const prev = i > 0 ? serie[i - 1] : null;
    const prevAnioMes = `${anio - 1}-${p.mes.slice(5, 7)}`;
    const dicPrev = `${anio - 1}-12`;

    return {
      ...p,
      variacionMensual:
        p.variacionMensual ?? (prev ? Number((((p.indice / prev.indice) - 1) * 100).toFixed(1)) : null),
      variacionInteranual:
        p.variacionInteranual ??
        (idxMap.has(prevAnioMes)
          ? Number((((p.indice / idxMap.get(prevAnioMes)!) - 1) * 100).toFixed(1))
          : null),
      variacionAcumuladaAnio:
        p.variacionAcumuladaAnio ??
        (idxMap.has(dicPrev)
          ? Number((((p.indice / idxMap.get(dicPrev)!) - 1) * 100).toFixed(1))
          : null),
    };
  });

  const actual = serieRecalculada[serieRecalculada.length - 1] ?? INFLACION_BASE.actual;

  return {
    ...INFLACION_BASE,
    actualizado: actual.mes,
    actual,
    serie: serieRecalculada,
    origen: "api",
  };
}

export async function getDesempleoArLive(): Promise<DesempleoArData & { origen: "api" | "respaldo" }> {
  const url = `${DATOS_GOB_AR_API}?ids=${DESEMPLEO_BASE.serieIdDatosGobAr}&limit=24&sort=desc&format=json`;
  const live = await fetchJsonSeguro<DatosGobArResponse>(url);

  if (!live?.data || live.data.length === 0) {
    return { ...DESEMPLEO_BASE, origen: "respaldo" };
  }

  const trimestreDeFecha = (fecha: string) => {
    const [y, m] = fecha.split("-");
    const map: Record<string, string> = { "01": "1.º trim.", "04": "2.º trim.", "07": "3.º trim.", "10": "4.º trim." };
    return `${map[m] ?? m} ${y}`;
  };

  const porFecha = new Map<string, PuntoDesempleoAr>(
    DESEMPLEO_BASE.serie.map((p) => [p.fecha, { ...p }])
  );

  for (const [fecha, valor] of live.data) {
    const prop = Number(valor);
    if (!Number.isFinite(prop)) continue;
    porFecha.set(fecha, {
      fecha,
      trimestre: trimestreDeFecha(fecha),
      tasaPct: Number((prop * 100).toFixed(1)),
      tasaProporcion: Number(prop.toFixed(6)),
    });
  }

  const serie = Array.from(porFecha.values()).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const actual = serie[serie.length - 1] ?? DESEMPLEO_BASE.actual;

  return {
    ...DESEMPLEO_BASE,
    actualizado: actual.fecha,
    actual,
    serie,
    origen: "api",
  };
}

export async function getMacroArResumen(): Promise<MacroArResumen> {
  const [inflacion, desempleo, bcra] = await Promise.all([
    getInflacionArLive(),
    getDesempleoArLive(),
    fetchBcraMonetarias(),
  ]);
  return { inflacion, desempleo, bcra };
}
