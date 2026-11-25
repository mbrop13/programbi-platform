import desempleoRaw from "@/data/co/desempleo.json";
import inflacionRaw from "@/data/co/inflacion.json";
import parametrosRaw from "@/data/co/parametros-laborales-2026.json";
import salarioMinimoRaw from "@/data/co/salario-minimo.json";
import type {
  DesempleoCiudadCo,
  DesempleoDatasetCo,
  InflacionDatasetCo,
  ParametrosLaborales2026Co,
  SalarioMinimoCo,
} from "./types";

const desempleoData = desempleoRaw as DesempleoDatasetCo;
const inflacionData = inflacionRaw as InflacionDatasetCo;
const salarioMinimoData = salarioMinimoRaw as SalarioMinimoCo;
const parametrosData = parametrosRaw as ParametrosLaborales2026Co;

export function getDesempleoCo(): DesempleoDatasetCo {
  return desempleoData;
}

export function getDesempleoCiudadesCo(): DesempleoCiudadCo[] {
  return desempleoData.ciudades.filter((c) => c.tipo === "ciudad");
}

export function getDesempleoAgregadosCo(): DesempleoCiudadCo[] {
  return desempleoData.ciudades.filter((c) => c.tipo === "agregado");
}

export function getInflacionCo(): InflacionDatasetCo {
  return inflacionData;
}

export function getSalarioMinimoCo(): SalarioMinimoCo {
  return salarioMinimoData;
}

export function getParametrosLaborales2026Co(): ParametrosLaborales2026Co {
  return parametrosData;
}
