export interface CarreraMxRecord {
  cveCarrera: string;
  carrera: string;
  slug: string;
  publicable: boolean;
  motivoExclusion: string | null;
  esTsu: boolean;
  posicionIngreso: number | null;
  ingreso: number | null;
  ingresoQ50: number | null;
  ingresoQ25: number | null;
  ingresoQ75: number | null;
  ingresoQ100: number | null;
  ingresoFormal: number | null;
  ingresoInformal: number | null;
  ingresoHombre: number | null;
  ingresoMujer: number | null;
  ingresoLic: number | null;
  ingresoPosgrado: number | null;
  incrementoPosgrado: number | null;
  tasaDesocupacion: number | null;
  tasaInformalidad: number | null;
  tasaOcupacion: number | null;
  tasaRiesgo: number | null;
  probEmpleoCalidad: number | null;
  tasaAplicacion: number | null;
  ocupado: number | null;
  total: number | null;
  matricula: number | null;
  egresados: number | null;
  nuevoIngreso: number | null;
  solicitudes: number | null;
  lugares: number | null;
  tasaAceptacion: number | null;
  pctMujer: number | null;
  pctHombre: number | null;
  pct30Menos: number | null;
  pct30Mas: number | null;
  rankIngresoImco: number | null;
  rankEgresadosImco: number | null;
  costoTotalPublica: number | null;
  costoTotalPrivada: number | null;
  rsiPublica: number | null;
  rsiPrivada: number | null;
  tiempoInversionPublica: number | null;
  tiempoInversionPrivada: number | null;
}

export interface CarrerasImcoMeta {
  pais: "MX";
  edicion: string;
  fuente: string;
  fuenteUrl: string;
  totalCarreras: number;
  totalPublicables: number;
  totalExcluidas: number;
  medianaIngresoPublicables: number;
  promedioIngresoPublicables: number;
}

export interface CarrerasImcoDataset {
  meta: CarrerasImcoMeta;
  carreras: CarreraMxRecord[];
}

export interface TramoIsrMx {
  limiteInferior: number;
  limiteSuperior: number | null;
  cuotaFija: number;
  porcentajeExcedente: number;
}

export interface ParametrosLaboralesMx {
  anio: number;
  pais: "MX";
  moneda: "MXN";
  uma: {
    diaria: number;
    mensual: number;
    anual: number;
    vigenciaInicio: string;
    vigenciaFin: string;
    fuente: string;
  };
  salarioMinimo: {
    generalDiario: number;
    zlfnDiario: number;
    vigenciaInicio: string;
    fuente: string;
  };
  prestacionesLft: {
    aguinaldoDiasMinimo: number;
    aguinaldoExentoUmas: number;
    aguinaldoExentoPesos: number;
    ptuPorcentajeUtilidades: number;
    ptuExentaUmas: number;
    ptuExentaPesos: number;
    primaVacacionalPorcentajeMinimo: number;
    primaVacacionalExentaUmas: number;
    primaVacacionalExentaPesos: number;
    vacacionesDiasPrimerAnio: number;
    indemnizacionConstitucionalDias: number;
    primaAntiguedadDiasPorAnio: number;
    primaAntiguedadTopeSalariosMinimos: number;
    fuente: string;
  };
  isrArt96Mensual: {
    vigencia: string;
    fuente: string;
    tramos: TramoIsrMx[];
  };
  isrArt96Quincenal: {
    vigencia: string;
    fuente: string;
    tramos: TramoIsrMx[];
  };
}

export interface CursoAfinMx {
  slug: string;
  nombre: string;
  href: string;
  rol: "principal" | "complementario";
}

export interface FaqItemMx {
  pregunta: string;
  respuesta: string;
}

export interface MigajaMx {
  label: string;
  path: string;
}
