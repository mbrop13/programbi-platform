const fmtEntero = new Intl.NumberFormat("es-CO", {
  useGrouping: true,
  maximumFractionDigits: 0,
});

const fmt1Decimal = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const fmt2Decimales = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PALABRAS_MENORES = new Set([
  "de",
  "del",
  "la",
  "las",
  "los",
  "y",
  "e",
  "en",
  "a",
  "al",
  "para",
  "con",
  "por",
  "o",
  "u",
]);

const SIGLAS = new Set([
  "TIC", "SENA", "SQL", "BI", "CAD", "BIM", "CNC", "3D",
  // Siglas de instituciones que el OLE publica en mayúsculas.
  "ATEC", "AUNAR", "CECAR", "CEIPA", "CENDA", "CES", "CESA", "CESMAG", "CET", "CIAF", "CIDCA", "CIDE", "CTB",
  "CUC", "CUE", "CUL", "CUN", "CUR", "EAE", "EAFIT", "EAM", "EAN", "ECCI", "EIA", "ESAP", "ETA",
  "FET", "FITEC", "FUAC", "IAFIC", "ICESI", "INCCA", "ISER", "ITA", "IU", "IUB", "IUMAFIS", "UCO",
  "UDCA", "UDEC", "UDES", "UDI", "UMB", "UNAB", "UNAC", "UNAD", "UNAULA", "UPTC", "UTP",
]);

/**
 * El OLE publica los nombres en MAYÚSCULAS y sin tildes («TECNOLOGIA EN GESTION»).
 * Este diccionario devuelve la forma correcta de las palabras que la llevan; también
 * corrige caracteres dañados en la fuente («INGL¿S») y erratas recurrentes.
 */
const TILDES: Record<string, string> = {
  administracion: "administración", aeronautica: "aeronáutica", agricola: "agrícola",
  agronomia: "agronomía", agronomica: "agronómica", america: "américa", americas: "américas",
  analisis: "análisis", animacion: "animación", antropologia: "antropología",
  archivistica: "archivística", arevalo: "arévalo", arquitectonicos: "arquitectónicos",
  artistica: "artística", atencion: "atención", atlantica: "atlántica", atlantico: "atlántico",
  auditoria: "auditoría", automatizacion: "automatización", autonoma: "autónoma",
  bacteriologia: "bacteriología", basica: "básica", beltran: "beltrán",
  bibliotecologia: "bibliotecología", biologia: "biología", biomedica: "biomédica",
  biomedico: "biomédico", biotecnologicos: "biotecnológicos", bogota: "bogotá", bolivar: "bolívar",
  boyaca: "boyacá", camara: "cámara", catolica: "católica", cesantias: "cesantías", choco: "chocó",
  clinico: "clínico", comercializacion: "comercialización", computacion: "computación",
  computo: "cómputo", comunicacion: "comunicación", confeccion: "confección",
  construccion: "construcción", consultoria: "consultoría", contaduria: "contaduría",
  cordoba: "córdoba", corporacion: "corporación", criminalistica: "criminalística",
  decoracion: "decoración", diagnosticas: "diagnósticas", diagnostico: "diagnóstico",
  dietetica: "dietética", direccion: "dirección", distribucion: "distribución",
  documentacion: "documentación", ecologica: "ecológica", economia: "economía",
  educacion: "educación", electrica: "eléctrica", electromecanica: "electromecánica",
  electromecanico: "electromecánico", electromecanicos: "electromecánicos",
  electronica: "electrónica", electronico: "electrónico", elias: "elías", energia: "energía",
  enfasis: "énfasis", "¿nfasis": "énfasis", enfermeria: "enfermería", estadistica: "estadística",
  etnoeducacion: "etnoeducación", fabricacion: "fabricación", farmaceutica: "farmacéutica",
  fisica: "física", formacion: "formación", formulacion: "formulación", fotografia: "fotografía",
  frances: "francés", "franc¿s": "francés", fundacion: "fundación", garcia: "garcía",
  gastronomia: "gastronomía", gastronomica: "gastronómica", gastronomicas: "gastronómicas",
  gastronomicos: "gastronómicos", geologia: "geología", geologica: "geológica", gestion: "gestión",
  grafica: "gráfica", grafico: "gráfico", hidraulicas: "hidráulicas", hoteleria: "hotelería",
  ibague: "ibagué", imagenes: "imágenes", implementacion: "implementación",
  informacion: "información", informatica: "informática", informatico: "informático",
  informaticos: "informáticos", ingenieria: "ingeniería", ingles: "inglés", "ingl¿s": "inglés",
  instalacion: "instalación", institucion: "institución", instrumentacion: "instrumentación",
  integracion: "integración", investigacion: "investigación", inyeccion: "inyección",
  jesus: "jesús", jose: "josé", logistica: "logística", logisticos: "logísticos",
  maquinas: "máquinas", maria: "maría", martin: "martín", matematica: "matemática",
  matematicas: "matemáticas", mecanica: "mecánica", mecanico: "mecánico", mecanicos: "mecánicos",
  mecanizacion: "mecanización", mecatronica: "mecatrónica", mecatronico: "mecatrónico",
  mecatronicos: "mecatrónicos", medellin: "medellín", metalicos: "metálicos",
  metalurgica: "metalúrgica", metrologico: "metrológico", microbiologia: "microbiología",
  mision: "misión", musica: "música", negociacion: "negociación", nutricion: "nutrición",
  odontologia: "odontología", operacion: "operación", optometria: "optometría",
  organizacion: "organización", pacifico: "pacífico", pedagogia: "pedagogía",
  pedagogica: "pedagógica", perez: "pérez", petroleo: "petróleo", petroleos: "petróleos",
  petroquimicas: "petroquímicas", plasticas: "plásticas", plasticos: "plásticos",
  politecnico: "politécnico", politica: "política", politicos: "políticos", popayan: "popayán",
  prevencion: "prevención", produccion: "producción", promocion: "promoción",
  psicologia: "psicología", publica: "pública", quimica: "química", quindio: "quindío",
  quirurgica: "quirúrgica", radiologia: "radiología", recreacion: "recreación",
  rehabilitacion: "rehabilitación", robotica: "robótica", rodriguez: "rodríguez",
  roldan: "roldán", simon: "simón", sinu: "sinú", sistematizacion: "sistematización",
  sociologia: "sociología", suarez: "suárez", supervision: "supervisión", tecnica: "técnica",
  tecnico: "técnico", tecnologia: "tecnología", tecnolgia: "tecnología", tecnonologia: "tecnología",
  tecnologias: "tecnologías", tecnologica: "tecnológica", tecnologicas: "tecnológicas",
  tecnologico: "tecnológico", tecnologicos: "tecnológicos", television: "televisión",
  teologia: "teología", teologico: "teológico", terapeutico: "terapéutico", tesoreria: "tesorería",
  tomas: "tomás", topografia: "topografía", tropico: "trópico", turistica: "turística",
  turisticas: "turísticas", turisticos: "turísticos", velasquez: "velásquez", vision: "visión",
  // Erratas de la fuente.
  insustrial: "industrial",
};

/** Palabras pegadas en la fuente: se separan antes de formatear. */
const SEPARAR: Record<string, string> = {
  eltrabajo: "el trabajo",
  socialy: "social y",
  saluden: "salud en",
};

/**
 * Nombres de instituciones del OLE: «UNIVERSIDAD AUTONOMA DE BUCARAMANGA-UNAB-» pasa a
 * «Universidad Autónoma de Bucaramanga (UNAB)». Los demás guiones separan partes del
 * nombre oficial («UNIVERSIDAD MILITAR-NUEVA GRANADA») y se reemplazan por un espacio.
 */
export function nombreIesCo(nombre: string): string {
  const base = (nombre || "").replace(/[\s-]+$/, "").trim();
  const conSigla = base.match(/^(.*?)\s*-\s*([A-ZÑ]+)$/);
  const cuerpo = (conSigla ? conSigla[1] : base).replace(/\s*-\s*/g, " ");
  const nombreLegible = nombreProgramaCo(cuerpo);
  if (!conSigla) return nombreLegible;
  const sigla = conSigla[2];
  const siglaLegible = SIGLAS.has(sigla) ? sigla : nombreProgramaCo(sigla);
  // «FUNDACION UNIVERSITARIA - CEIPA-»: la sigla es el nombre, no una abreviatura.
  if (cuerpo.split(" ").length <= 2) return `${nombreLegible} ${siglaLegible}`;
  return `${nombreLegible} (${siglaLegible})`;
}

/** «1 institución», «3 instituciones». */
export function plural(n: number, singular: string, pluralForma: string): string {
  return `${enteroCo(n)} ${n === 1 ? singular : pluralForma}`;
}

/** Formatea pesos colombianos completos: `$1.750.905`. */
export function pesosCo(monto: number | null | undefined): string {
  if (monto === null || monto === undefined || !Number.isFinite(monto)) return "s/d";
  const redondeado = Math.round(monto);
  return redondeado < 0
    ? `−$${fmtEntero.format(Math.abs(redondeado))}`
    : `$${fmtEntero.format(redondeado)}`;
}

/** Formatea millones abreviados para tarjetas: `$6,9 millones` o `$950 mil`. */
export function millonesCortoCo(monto: number | null | undefined): string {
  if (monto === null || monto === undefined || !Number.isFinite(monto)) return "s/d";
  if (monto >= 995_000) {
    return `$${fmt1Decimal.format(monto / 1_000_000)} millones`;
  }
  return `$${fmtEntero.format(Math.round(monto / 1_000))} mil`;
}

/** Formatea ingresos en SMMLV: `3,99 SMMLV`. */
export function smmlvCo(valor: number | null | undefined, conUnidad = true): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/d";
  const texto = fmt2Decimales.format(valor);
  return conUnidad ? `${texto}\u00a0SMMLV` : texto;
}

/** Formatea un porcentaje que ya viene en escala 0..100 (ej. `49.8` -> `49,8 %`). */
export function porcentajeCo(valorPct: number | null | undefined, conEspacio = true): string {
  if (valorPct === null || valorPct === undefined || !Number.isFinite(valorPct)) return "s/d";
  const sep = conEspacio ? "\u00a0" : "";
  return `${fmt1Decimal.format(valorPct)}${sep}%`;
}

/** Formatea tasas macroeconómicas (ej. `8.0` -> `8,0 %`, `12.25` -> `12,25 %`). */
export function tasaCo(valorPct: number | null | undefined, decimales = 1): string {
  if (valorPct === null || valorPct === undefined || !Number.isFinite(valorPct)) return "s/d";
  const texto = decimales === 2 ? fmt2Decimales.format(valorPct) : fmt1Decimal.format(valorPct);
  return `${texto}\u00a0%`;
}

/** Formatea enteros con separador de miles de Colombia: `14.422`. */
export function enteroCo(valor: number | null | undefined): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return "s/d";
  return fmtEntero.format(Math.round(valor));
}

/** Convierte nombres en MAYÚSCULAS del OLE/SNIES a formato legible en español. */
export function nombreProgramaCo(nombre: string): string {
  const limpio = (nombre || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((p) => SEPARAR[p.toLowerCase()] ?? p)
    .join(" ");
  if (!limpio) return "";
  return limpio
    .split(" ")
    .map((palabra, idx) => {
      // Separa la puntuación pegada («FISICA,» o «EXTRANJERAS:») para corregir solo la palabra.
      const m = palabra.match(/^(.*?)([,:;.)]*)$/);
      const nucleo = m?.[1] ?? palabra;
      const cola = m?.[2] ?? "";
      const upper = nucleo.toUpperCase();
      if (SIGLAS.has(upper)) return upper + cola;
      const lower = nucleo.toLowerCase();
      if (idx > 0 && PALABRAS_MENORES.has(lower)) return lower + cola;
      const conTilde = TILDES[lower] ?? lower;
      return conTilde.charAt(0).toUpperCase() + conTilde.slice(1) + cola;
    })
    .join(" ");
}
