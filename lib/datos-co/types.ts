export type NivelFormacionCo =
  | "Universitario"
  | "Tecnológico"
  | "Formación técnica profesional";

export type SectorIesCo = "Oficial" | "Privado";

export interface RangosSmmlvCo {
  n_1_sm: number;
  n_1_y_1_5_sm: number;
  n_1_5_y_2_5_sm: number;
  n_2_5_y_4_sm: number;
  n_4_y_6_sm: number;
  n_6_y_9_sm: number;
  n_mas_de_9_sm: number;
}

export interface SniesGraduados2025Co {
  graduados_2025: number;
  n_ies: number;
  nbc: string;
}

export interface SectorIesResumenCo {
  n_ies: number;
  graduados_cotizantes: number;
  mediana_smmlv: number;
  mediana_cop_2026: number;
  pct_4plus_smmlv: number;
}

export interface SectorIesComparativaCo {
  oficial: SectorIesResumenCo;
  privado: SectorIesResumenCo;
}

export interface CarreraCo {
  slug: string;
  programa: string;
  programa_normalizado: string;
  nivel_formacion: NivelFormacionCo;
  area_conocimiento: string;
  graduados_cotizantes: number;
  n_ies: number;
  pct_4plus_smmlv: number;
  mediana_smmlv: number;
  mediana_cop_2026: number;
  promedio_smmlv: number;
  promedio_cop_2026: number;
  sugerido_ranking: boolean;
  sugerido_ficha: boolean;
  rangos_smmlv: RangosSmmlvCo;
  snies_2025: SniesGraduados2025Co | null;
  sector_ies: SectorIesComparativaCo | null;
}

export interface MetaCarrerasCo {
  cohorte: string;
  anio_seguimiento: number;
  smmlv_2026_cop: number;
  fuente_ole: string;
  fuente_ole_url: string;
  fuente_snies: string;
  fuente_snies_url: string;
  conteos: {
    total_fuente: number;
    publicados: number;
    fichas: number;
    rankings: number;
    fichas_por_nivel: Record<string, number>;
    rankings_por_nivel: Record<string, number>;
  };
  niveles: NivelFormacionCo[];
  areas: string[];
}

export interface CarrerasDatasetCo {
  meta: MetaCarrerasCo;
  programas: CarreraCo[];
}

export interface CarreraIesItemCo {
  ies: string;
  sector_ies: SectorIesCo;
  graduados_cotizantes: number;
  pct_4plus_smmlv: number;
  mediana_smmlv: number;
  mediana_cop_2026: number;
}

export interface CarrerasIesDatasetCo {
  meta: {
    cohorte: string;
    anio_seguimiento: number;
    smmlv_2026_cop: number;
    umbral_min_cotizantes: number;
    total_registros: number;
    fuente_ole: string;
    fuente_ole_url: string;
  };
  por_programa: Record<string, CarreraIesItemCo[]>;
}

export interface DesempleoNacionalPuntoCo {
  anio: number;
  mes: number;
  periodo: string;
  mes_nombre: string;
  tasa_desocupacion_pct: number;
}

export interface DesempleoCiudadCo {
  ciudad: string;
  tasa_desocupacion_pct: number;
  tipo: "ciudad" | "agregado";
}

export interface DesempleoDatasetCo {
  meta: {
    fuente: string;
    fuente_url: string;
    periodo_nacional_actual: string;
    tasa_nacional_actual_pct: number;
    periodo_ciudades: string;
    cobertura_ciudades: string;
    nota_metodologica: string;
  };
  nacional: DesempleoNacionalPuntoCo[];
  ciudades: DesempleoCiudadCo[];
}

export interface InflacionPuntoCo {
  anio: number;
  mes: number;
  periodo: string;
  mes_nombre: string;
  indice_base_dic2018: number;
  var_12m_pct: number | null;
}

export interface InflacionDatasetCo {
  meta: {
    base: string;
    periodo_actual: string;
    indice_actual: number;
    var_12m_actual_pct: number;
    fuente_ipc: string;
    fuente_ipc_url: string;
    tasa_intervencion_pct: number;
    tasa_intervencion_fecha: string;
    tasa_intervencion_fuente: string;
    tasa_intervencion_url: string;
    trm_cop_usd: number;
    trm_fecha: string;
    trm_fuente: string;
    trm_url: string;
    trm_licencia: string;
  };
  serie: InflacionPuntoCo[];
}

export interface SalarioMinimoCo {
  anio: number;
  smmlv_cop: number;
  auxilio_transporte_cop: number;
  total_smmlv_mas_auxilio_cop: number;
  tope_auxilio_transporte_smmlv: number;
  tope_auxilio_transporte_cop: number;
  salud_empleado_pct: number;
  pension_empleado_pct: number;
  fsp_desde_smmlv: number;
  intereses_cesantias_pct_anual: number;
  fuentes: {
    smmlv: string;
    auxilio_transporte: string;
    mintrabajo_url: string;
  };
}

export interface ParametrosLaborales2026Co {
  smmlv_2026_cop: number;
  auxilio_transporte_2026_cop: number;
  total_smmlv_mas_auxilio_2026_cop: number;
  smmlv_fuente: string;
  auxilio_fuente: string;
  trm_2026_11_25: number;
  trm_fuente: string;
  tasa_intervencion_pct_2026_11_24: number;
  tasa_intervencion_fuente: string;
  desempleo_nacional_sep_2026_pct: number;
  ipc_indice_oct_2026: number;
  ipc_var_12m_oct_2026_pct: number;
  ipc_base: string;
  licencias: Record<string, string>;
  notas: string[];
}
