import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Nota } from "./desempleo";

export type FuenteDesglose = {
  nombre: string;
  url: string;
  licencia: string;
  sha256: string;
  fecha_actualizacion: string;
};

export type PuntoDesglose = {
  p: string;
  valores: Partial<Record<string, number>>;
  notas: Partial<Record<string, Nota>>;
};

type ArchivoDesglose = {
  fuente: FuenteDesglose;
  series: Partial<Record<string, PuntoDesglose[]>>;
};

type FilaSector = {
  sector: string;
  nombre: string;
  actual: number;
  anterior: number;
  variacion: number;
  nota_actual?: Nota;
  nota_anterior?: Nota;
};

export type Sectores = {
  fuente: FuenteDesglose;
  periodo: string;
  periodo_anterior: string;
  territorios: Partial<Record<string, FilaSector[]>>;
};

const carpeta = join(process.cwd(), "data", "desempleo");

function leerDesglose(nombre: string): ArchivoDesglose {
  return JSON.parse(readFileSync(join(carpeta, `${nombre}.json`), "utf8")) as ArchivoDesglose;
}

export const EDAD = leerDesglose("edad");
export const SEXO = leerDesglose("sexo");
export const INFORMALIDAD = leerDesglose("informalidad");
export const JOVENES_NINI = leerDesglose("nini");
export const DURACION = leerDesglose("duracion");
export const DESESTACIONALIZADA = leerDesglose("estacional");

const archivoSectores = join(carpeta, "ramas-yoy.json");
const sectores: Sectores | undefined = existsSync(archivoSectores)
  ? JSON.parse(readFileSync(archivoSectores, "utf8"))
  : undefined;

export function seriesSectores(territorio: string) {
  const filas = sectores?.territorios[territorio];
  return sectores && filas?.length ? { ...sectores, filas } : null;
}

export function fechaIsoDesglose(fecha: string) {
  const [dia, mes, ano] = fecha.split("-");
  return `${ano}-${mes}-${dia}`;
}

export function datosJovenes() {
  const tasas = EDAD.series["15-24"] ?? [];
  const actual = tasas.at(-1);
  const tasa = actual?.valores.tasa;
  return actual && tasa !== undefined ? {
    actual, tasa, tasas,
    nini: JOVENES_NINI.series["15-24"] ?? [],
    duracion: DURACION.series["15-24"] ?? [],
  } : null;
}
