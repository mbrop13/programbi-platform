export interface DisciplinaAraucano {
  disciplinaId: number;
  nombreOficial: string | null;
  slug: string | null;
  nFilas: number;
  nConSalarioSipa: number;
  porcentajeSipa: number;
  porcentajeSipaPct: number;
  medianaNominal: number;
  p25Nominal: number;
  p75Nominal: number;
  medianaAjustadaOct2026: number;
  p25AjustadoOct2026: number;
  p75AjustadoOct2026: number;
  aniosSalario: string;
  aniosEgreso: string;
}

export interface MetricasDiu {
  estudiantes: number;
  nuevosInscriptos: number;
  reinscriptos: number;
  egresados: number;
  estatal: {
    estudiantes: number;
    nuevosInscriptos: number;
    reinscriptos: number;
    egresados: number;
  };
  privado: {
    estudiantes: number;
    nuevosInscriptos: number;
    reinscriptos: number;
    egresados: number;
  };
}

export interface DisciplinaDiu extends MetricasDiu {
  disciplina: string;
  slug: string;
  rama: string;
}

export interface RamaDiu extends MetricasDiu {
  rama: string;
  slug: string;
  disciplinas: DisciplinaDiu[];
}

export interface AnuarioDiu2024 {
  anio: number;
  nivel: string;
  cuadro: string;
  fuente: {
    organismo: string;
    url: string;
    licenciaEstado: string;
  };
  totalSistema: MetricasDiu | null;
  ramas: RamaDiu[];
}

export interface CarrerasArData {
  actualizado: string;
  anioBase: string;
  mesAjusteIpc: string;
  ipcPromedioBase: number;
  ipcMesAjuste: number;
  factorAjusteIpc: number;
  diccionarioDisponible: boolean;
  fichasPublicadas: number;
  totalDisciplinasPublicables: number;
  disciplinasExcluidasPorUmbral: Array<{ disciplinaId: number; nConSalarioSipa: number }>;
  fuenteAraucano: {
    organismo: string;
    nombre: string;
    datasetUrl: string;
    baseCsvUrl: string;
    licenseUrl: string;
    licenseNombre: string;
  };
  disciplinas: DisciplinaAraucano[];
  anuarioDiu2024: AnuarioDiu2024 | null;
}

export interface PuntoIpcAr {
  mes: string;
  indice: number;
  variacionMensual: number | null;
  variacionInteranual: number | null;
  variacionAcumuladaAnio: number | null;
}

export interface DivisionIpcAr {
  codigo: string;
  nombre: string;
  indice: number | null;
  variacionMensual: number | null;
  variacionInteranual: number | null;
}

export interface InflacionArData {
  actualizado: string;
  serieIdDatosGobAr: string;
  base: string;
  fuente: {
    organismo: string;
    nombre: string;
    url: string;
    licenciaEstado: string;
  };
  actual: PuntoIpcAr;
  divisionesUltimoMes: DivisionIpcAr[];
  serie: PuntoIpcAr[];
}

export interface PuntoDesempleoAr {
  fecha: string;
  trimestre: string;
  tasaPct: number;
  tasaProporcion: number;
}

export interface DesempleoArData {
  actualizado: string;
  serieIdDatosGobAr: string;
  fuente: {
    organismo: string;
    nombre: string;
    url: string;
    licenciaEstado: string;
  };
  actual: PuntoDesempleoAr;
  serie: PuntoDesempleoAr[];
}

export interface BcraVariableDato {
  idVariable: number;
  fecha: string;
  valor: number;
  descripcion?: string;
}

export interface BcraVariablesMacro {
  fuente: string;
  url: string;
  origen: "api" | "sin-datos";
  variable27: BcraVariableDato | null;
  variable28: BcraVariableDato | null;
}

export interface MacroArResumen {
  inflacion: InflacionArData & { origen: "api" | "respaldo" };
  desempleo: DesempleoArData & { origen: "api" | "respaldo" };
  bcra: BcraVariablesMacro;
}
