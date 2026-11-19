import type { TramoIngreso } from "./tramos";

export type TipoIesKey = "u" | "ip" | "cft";

export const TIPO_ETIQUETAS: Record<TipoIesKey, { corto: string; plural: string; singular: string }> = {
  u: { corto: "U", plural: "Universidades", singular: "Universidad" },
  ip: { corto: "IP", plural: "Institutos Profesionales", singular: "Instituto Profesional" },
  cft: { corto: "CFT", plural: "Centros de Formación Técnica", singular: "Centro de Formación Técnica" },
};

export const TIPO_ORDEN: readonly TipoIesKey[] = ["u", "ip", "cft"];

export interface OfertaResumen {
  programas: number;
  instituciones: number;
  regiones: string[];
  jornadas: string[];
  niveles: string[];
  vacantes_total: number;
  acred_max: number;
  arancel: { min: number; med: number | null; max: number } | null;
  costo_titulacion_med: number | null;
  paes: { min: number; max: number; count: number } | null;
  arancel_histograma: { label: string; min: number; max: number | null; count: number }[];
}

export interface CarreraTipoData {
  tipo_label: string;
  ing: (number | null)[];
  pct: {
    p10_1: number | null;
    p25_1: number | null;
    p50_1: number | null;
    p75_1: number | null;
    p90_1: number | null;
    p10_5: number | null;
    p25_5: number | null;
    p50_5: number | null;
    p75_5: number | null;
    p90_5: number | null;
  };
  evol_ing4: Record<string, number | null>;
  emp1: number | null;
  emp2: number | null;
  evol_emp1: Record<string, number | null>;
  evol_emp2: Record<string, number | null>;
  titulados: { m: number | null; h: number | null; t: number | null };
  dur_formal: number | null;
  dur_real: number | null;
  matricula: {
    primer_ano_m: number | null;
    primer_ano_h: number | null;
    primer_ano_t: number | null;
    total_m: number | null;
    total_h: number | null;
    total: number | null;
  };
  retencion: { r1: number | null; r2: number | null };
  origen: {
    municipal: number | null;
    subvencionado: number | null;
    pagado: number | null;
    delegada: number | null;
  };
  variacion: {
    crec_20_24: number | null;
    yoy_23_24: number | null;
    cagr_20_24: number | null;
    edicion_anterior_ing4_ajustado: number | null;
    edicion_anterior_yoy_real: number | null;
  };
  oferta?: OfertaResumen;
}

export interface CarreraRecord {
  slug: string;
  nombre: string;
  area: string;
  tipos: Partial<Record<TipoIesKey, CarreraTipoData>>;
  oferta: OfertaResumen | null;
}

export interface RankingItem {
  slug: string;
  nombre: string;
  area: string;
  tipo: TipoIesKey;
  nivel: string;
  ing1: number | null;
  ing4: number | null;
  ing5: number | null;
  p10_5: number | null;
  p50_5: number | null;
  p90_5: number | null;
  emp1: number | null;
  emp2: number | null;
  dur_formal: number | null;
  dur_real: number | null;
  titulados: number | null;
  titulados_m: number | null;
  retencion_1: number | null;
  arancel_min: number | null;
  arancel_med: number | null;
  arancel_max: number | null;
  costo_tit_med: number | null;
  yoy_real_4: number | null;
  yoy_23_24: number | null;
  regiones: string[];
  jornadas: string[];
  acred_max: number;
  vacantes_total: number;
  paes_min: number | null;
  paes_max: number | null;
  programas: number;
}

export interface InstitucionCarrera {
  codigo_ies: number;
  tipo: TipoIesKey;
  tipo_label: string;
  institucion: string;
  acreditacion: string;
  acred_anos: number;
  titulo: string;
  continuidad: number | null;
  retencion_1: number | null;
  dur_real: number | null;
  emp1: number | null;
  emp2: number | null;
  tramo: TramoIngreso | null;
}

export interface ProgramaCarrera {
  codigo: string;
  tipo: TipoIesKey;
  institucion: string;
  acred_anos: number;
  nombre: string;
  region: string;
  jornada: string;
  sede: string;
  arancel: number | null;
  costo_titulacion: number | null;
  dur_formal: number | null;
  nivel: string;
  vacantes: number | null;
  rango_paes: string;
  prom_paes: number | null;
  ponderaciones: {
    nem: number;
    ranking: number;
    lenguaje: number;
    mate1: number;
    mate2: number;
    historia: number;
    ciencias: number;
    otros: number;
  };
}

export interface MetaCarreras {
  edicion: string;
  pesos_de: string;
  fetched_at: string;
  fuentes: { nombre: string; url: string; sha256: string }[];
  ipc: { ultimo_mes: string | null; valor: number | null; fuente: string };
  conteos: {
    filas_A: number;
    genericas_unicas: number;
    filas_B: number;
    filas_C: number;
    cruce_B_A_pct: number;
    cruce_C_A_pct: number;
  };
  avisos: string[];
}
