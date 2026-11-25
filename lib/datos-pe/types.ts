export type NivelCarreraPe = "universitaria" | "tecnica";

export interface FuentePe {
  id: string;
  nombre: string;
  url: string;
}

export interface MetaCarrerasPe {
  edicion: string;
  fechaCorte: string;
  unidad: string;
  periodoEnaho: string;
  periodoMtpe: string;
  corteSunedu: string;
  fuentes: FuentePe[];
}

export interface ResumenCarrerasPe {
  totalFichas: number;
  totalUniversitarias: number;
  totalTecnicas: number;
  mayorMediana: {
    slug: string;
    nombre: string;
    tipo: NivelCarreraPe;
    mediana: number;
  };
  medianaUniversitaria: number;
  medianaTecnica: number;
}

export interface EnahoCarreraPe {
  nMuestra: number;
  nConIngreso: number;
  mediana: number;
  p25: number;
  p75: number;
  ic90Low: number;
  ic90High: number;
  cvMediana: number;
  pctOcupados: number;
  pctPension: number;
  pctOcupProfTec: number;
}

export interface MtpeDepartamentoPe {
  departamento: string;
  nombreDepartamento: string;
  promedio: number;
  p10: number | null;
  p90: number | null;
}

export interface MtpeCarreraPe {
  nacional: number | null;
  p10: number | null;
  p90: number | null;
  rankNacional: number | null;
  lima: number | null;
  prom2022PubPriv: number | null;
  topDepartamentos: MtpeDepartamentoPe[];
}

export interface Edo2026Pe {
  familia: string;
  puestos: number;
}

export interface UniversidadSuneduPe {
  codigoEntidad: string;
  nombre: string;
  tipoGestion: string;
  departamento: string;
}

export interface SuneduCarreraPe {
  totalUniversidades: number;
  universidades: UniversidadSuneduPe[];
}

export interface CarreraPe {
  slug: string;
  tipo: NivelCarreraPe;
  codigoInei: string;
  nombre: string;
  rankNivel: number;
  rankGeneral: number;
  slugHermana: string | null;
  enaho: EnahoCarreraPe;
  mtpe: MtpeCarreraPe;
  edo2026: Edo2026Pe | null;
  sunedu: SuneduCarreraPe | null;
}

export interface DatasetCarrerasPe {
  meta: MetaCarrerasPe;
  resumen: ResumenCarrerasPe;
  carreras: CarreraPe[];
}
