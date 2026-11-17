import { getPais } from "@/config/paises";

/** Datos de demostración del panel del hero, compartidos por Power BI y los editores. */
export const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago"];
export const CHANNELS = [
  { name: "Retail", color: "#118DFF" },
  { name: "B2B", color: "#E66C37" },
  { name: "Online", color: "#D9B300" },
] as const;

export type DemoPais = {
  pbix: string;
  locale: string;
  cortas: readonly [string, string, string];
  regiones: readonly [string, string, string];
  sqlRegiones: readonly [string, string, string, string];
};

const DEMO_POR_PAIS: Record<string, Omit<DemoPais, "pbix" | "locale">> = {
  cl: {
    cortas: ["RM", "Valparaíso", "Biobío"],
    regiones: ["Metropolitana", "Valparaíso", "Biobío"],
    sqlRegiones: ["Metropolitana", "Valparaíso", "Biobío", "Antofagasta"],
  },
  ar: {
    cortas: ["CABA", "Córdoba", "Santa Fe"],
    regiones: ["Buenos Aires", "Córdoba", "Santa Fe"],
    sqlRegiones: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza"],
  },
  mx: {
    cortas: ["CDMX", "Nuevo León", "Jalisco"],
    regiones: ["Ciudad de México", "Nuevo León", "Jalisco"],
    sqlRegiones: ["Ciudad de México", "Nuevo León", "Jalisco", "Querétaro"],
  },
  co: {
    cortas: ["Bogotá", "Antioquia", "Valle"],
    regiones: ["Bogotá D.C.", "Antioquia", "Valle del Cauca"],
    sqlRegiones: ["Bogotá D.C.", "Antioquia", "Valle del Cauca", "Atlántico"],
  },
  pe: {
    cortas: ["Lima", "Arequipa", "La Libertad"],
    regiones: ["Lima", "Arequipa", "La Libertad"],
    sqlRegiones: ["Lima", "Arequipa", "La Libertad", "Piura"],
  },
  uy: {
    cortas: ["Montevideo", "Canelones", "Maldonado"],
    regiones: ["Montevideo", "Canelones", "Maldonado"],
    sqlRegiones: ["Montevideo", "Canelones", "Maldonado", "Colonia"],
  },
  bo: {
    cortas: ["La Paz", "Santa Cruz", "Cochabamba"],
    regiones: ["La Paz", "Santa Cruz", "Cochabamba"],
    sqlRegiones: ["La Paz", "Santa Cruz", "Cochabamba", "Tarija"],
  },
  ec: {
    cortas: ["Pichincha", "Guayas", "Azuay"],
    regiones: ["Pichincha", "Guayas", "Azuay"],
    sqlRegiones: ["Pichincha", "Guayas", "Azuay", "Manabí"],
  },
  cr: {
    cortas: ["San José", "Alajuela", "Cartago"],
    regiones: ["San José", "Alajuela", "Cartago"],
    sqlRegiones: ["San José", "Alajuela", "Cartago", "Heredia"],
  },
  do: {
    cortas: ["Dist. Nac.", "Santiago", "La Romana"],
    regiones: ["Santo Domingo", "Santiago", "La Romana"],
    sqlRegiones: ["Santo Domingo", "Santiago", "La Romana", "Punta Cana"],
  },
  gt: {
    cortas: ["Guatemala", "Quetzalten.", "Escuintla"],
    regiones: ["Guatemala", "Quetzaltenango", "Escuintla"],
    sqlRegiones: ["Guatemala", "Quetzaltenango", "Escuintla", "Sacatepéquez"],
  },
  sv: {
    cortas: ["San Salvador", "La Libertad", "Santa Ana"],
    regiones: ["San Salvador", "La Libertad", "Santa Ana"],
    sqlRegiones: ["San Salvador", "La Libertad", "Santa Ana", "San Miguel"],
  },
  ve: {
    cortas: ["Caracas", "Miranda", "Zulia"],
    regiones: ["Caracas", "Miranda", "Zulia"],
    sqlRegiones: ["Caracas", "Miranda", "Zulia", "Carabobo"],
  },
  hn: {
    cortas: ["F. Morazán", "Cortés", "Atlántida"],
    regiones: ["Tegucigalpa", "San Pedro Sula", "La Ceiba"],
    sqlRegiones: ["Tegucigalpa", "San Pedro Sula", "La Ceiba", "Comayagua"],
  },
  ni: {
    cortas: ["Managua", "León", "Granada"],
    regiones: ["Managua", "León", "Granada"],
    sqlRegiones: ["Managua", "León", "Granada", "Masaya"],
  },
  pa: {
    cortas: ["Panamá", "Colón", "Chiriquí"],
    regiones: ["Panamá", "Colón", "Chiriquí"],
    sqlRegiones: ["Panamá", "Colón", "Chiriquí", "Veraguas"],
  },
  py: {
    cortas: ["Asunción", "Central", "Alto Paraná"],
    regiones: ["Asunción", "Central", "Alto Paraná"],
    sqlRegiones: ["Asunción", "Central", "Alto Paraná", "Itapúa"],
  },
};

export function getDemoPais(iso: string): DemoPais {
  const pais = getPais(iso);
  const datos = DEMO_POR_PAIS[pais.iso] ?? DEMO_POR_PAIS.cl;
  return {
    pbix: `Ventas ${pais.nombre}.pbix`,
    locale: pais.locale,
    ...datos,
  };
}

/** Pestañas del panel: cada una es un curso con ficha propia. */
export const HERO_TABS = [
  { id: "bi", title: "Power BI", slug: "power-bi" },
  { id: "sql", title: "SQL Server", slug: "sql-server" },
  { id: "python", title: "Python", slug: "python" },
] as const;

export type HeroTabId = (typeof HERO_TABS)[number]["id"];

/** Lo que la franja del panel muestra de cada curso. Lo arma el servidor. */
export type HeroCurso = {
  href: string;
  /** Fecha corta de la próxima cohorte ("30 nov"), o null si no hay. */
  inicio: string | null;
  dias: string | null;
  hora: string | null;
  horas: number;
  /** Porcentaje de descuento público; 0 si no aplica. */
  descuento: number;
};

export type HeroCursos = Record<HeroTabId, HeroCurso>;
