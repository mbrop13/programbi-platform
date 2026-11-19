export interface InstitucionVisual {
  key: string;
  nombreOficial: string;
  nombreCorto: string;
  sigla: string;
  tipo: "U" | "IP" | "CFT";
  color: string;
  bgSoft: string;
  ciudad?: string;
  acreditacionAnios?: number;
}

const INSTITUCIONES_LIST: InstitucionVisual[] = [
  // Universidades
  {
    key: "UNIVERSIDAD DE CHILE",
    nombreOficial: "UNIVERSIDAD DE CHILE",
    nombreCorto: "U. de Chile",
    sigla: "UCH",
    tipo: "U",
    color: "#0033A0",
    bgSoft: "#EFF6FF",
    ciudad: "Santiago",
    acreditacionAnios: 7,
  },
  {
    key: "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE",
    nombreOficial: "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE",
    nombreCorto: "UC",
    sigla: "PUC",
    tipo: "U",
    color: "#004B8D",
    bgSoft: "#EFF6FF",
    ciudad: "Santiago",
    acreditacionAnios: 7,
  },
  {
    key: "UNIVERSIDAD TECNICA FEDERICO SANTA MARIA",
    nombreOficial: "UNIVERSIDAD TECNICA FEDERICO SANTA MARIA",
    nombreCorto: "UTFSM",
    sigla: "USM",
    tipo: "U",
    color: "#004B87",
    bgSoft: "#EFF6FF",
    ciudad: "Valparaíso",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD DE CONCEPCION",
    nombreOficial: "UNIVERSIDAD DE CONCEPCION",
    nombreCorto: "U. de Concepción",
    sigla: "UdeC",
    tipo: "U",
    color: "#003B71",
    bgSoft: "#EFF6FF",
    ciudad: "Concepción",
    acreditacionAnios: 7,
  },
  {
    key: "UNIVERSIDAD DE SANTIAGO DE CHILE",
    nombreOficial: "UNIVERSIDAD DE SANTIAGO DE CHILE",
    nombreCorto: "USACH",
    sigla: "USACH",
    tipo: "U",
    color: "#00A499",
    bgSoft: "#F0FDFA",
    ciudad: "Santiago",
    acreditacionAnios: 7,
  },
  {
    key: "PONTIFICIA UNIVERSIDAD CATOLICA DE VALPARAISO",
    nombreOficial: "PONTIFICIA UNIVERSIDAD CATOLICA DE VALPARAISO",
    nombreCorto: "PUCV",
    sigla: "PUCV",
    tipo: "U",
    color: "#004C97",
    bgSoft: "#EFF6FF",
    ciudad: "Valparaíso",
    acreditacionAnios: 7,
  },
  {
    key: "UNIVERSIDAD ADOLFO IBANEZ",
    nombreOficial: "UNIVERSIDAD ADOLFO IBAÑEZ",
    nombreCorto: "U. Adolfo Ibáñez",
    sigla: "UAI",
    tipo: "U",
    color: "#0F172A",
    bgSoft: "#F1F5F9",
    ciudad: "Santiago",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD DIEGO PORTALES",
    nombreOficial: "UNIVERSIDAD DIEGO PORTALES",
    nombreCorto: "UDP",
    sigla: "UDP",
    tipo: "U",
    color: "#B91C1C",
    bgSoft: "#FEF2F2",
    ciudad: "Santiago",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD AUSTRAL DE CHILE",
    nombreOficial: "UNIVERSIDAD AUSTRAL DE CHILE",
    nombreCorto: "U. Austral",
    sigla: "UACh",
    tipo: "U",
    color: "#15803D",
    bgSoft: "#F0FDF4",
    ciudad: "Valdivia",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD ANDRES BELLO",
    nombreOficial: "UNIVERSIDAD ANDRES BELLO",
    nombreCorto: "UNAB",
    sigla: "UNAB",
    tipo: "U",
    color: "#0C2340",
    bgSoft: "#F1F5F9",
    ciudad: "Santiago",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD SAN SEBASTIAN",
    nombreOficial: "UNIVERSIDAD SAN SEBASTIAN",
    nombreCorto: "U. San Sebastián",
    sigla: "USS",
    tipo: "U",
    color: "#1E3A8A",
    bgSoft: "#EFF6FF",
    ciudad: "Santiago",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD DEL DESARROLLO",
    nombreOficial: "UNIVERSIDAD DEL DESARROLLO",
    nombreCorto: "UDD",
    sigla: "UDD",
    tipo: "U",
    color: "#00529B",
    bgSoft: "#EFF6FF",
    ciudad: "Santiago",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD DE LOS ANDES",
    nombreOficial: "UNIVERSIDAD DE LOS ANDES",
    nombreCorto: "U. de los Andes",
    sigla: "UANDES",
    tipo: "U",
    color: "#991B1B",
    bgSoft: "#FEF2F2",
    ciudad: "Santiago",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD MAYOR",
    nombreOficial: "UNIVERSIDAD MAYOR",
    nombreCorto: "U. Mayor",
    sigla: "UMAYOR",
    tipo: "U",
    color: "#D97706",
    bgSoft: "#FFFBEB",
    ciudad: "Santiago",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD AUTONOMA DE CHILE",
    nombreOficial: "UNIVERSIDAD AUTONOMA DE CHILE",
    nombreCorto: "U. Autónoma",
    sigla: "UA",
    tipo: "U",
    color: "#B45309",
    bgSoft: "#FFFBEB",
    ciudad: "Santiago",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD DE LAS AMERICAS",
    nombreOficial: "UNIVERSIDAD DE LAS AMERICAS",
    nombreCorto: "UDLA",
    sigla: "UDLA",
    tipo: "U",
    color: "#EA580C",
    bgSoft: "#FFF7ED",
    ciudad: "Santiago",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD SANTO TOMAS",
    nombreOficial: "UNIVERSIDAD SANTO TOMAS",
    nombreCorto: "U. Santo Tomás",
    sigla: "UST",
    tipo: "U",
    color: "#047857",
    bgSoft: "#ECFDF5",
    ciudad: "Santiago",
    acreditacionAnios: 4,
  },
  {
    key: "UNIVERSIDAD CATOLICA DE LA SANTISIMA CONCEPCION",
    nombreOficial: "UNIVERSIDAD CATOLICA DE LA SANTISIMA CONCEPCION",
    nombreCorto: "UCSC",
    sigla: "UCSC",
    tipo: "U",
    color: "#0369A1",
    bgSoft: "#F0F9FF",
    ciudad: "Concepción",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD CENTRAL DE CHILE",
    nombreOficial: "UNIVERSIDAD CENTRAL DE CHILE",
    nombreCorto: "U. Central",
    sigla: "UCEN",
    tipo: "U",
    color: "#1D4ED8",
    bgSoft: "#EFF6FF",
    ciudad: "Santiago",
    acreditacionAnios: 4,
  },
  {
    key: "UNIVERSIDAD ARTURO PRAT",
    nombreOficial: "UNIVERSIDAD ARTURO PRAT",
    nombreCorto: "UNAP",
    sigla: "UNAP",
    tipo: "U",
    color: "#0284C7",
    bgSoft: "#F0F9FF",
    ciudad: "Iquique",
    acreditacionAnios: 4,
  },
  {
    key: "UNIVERSIDAD DE LOS LAGOS",
    nombreOficial: "UNIVERSIDAD DE LOS LAGOS",
    nombreCorto: "U. de Los Lagos",
    sigla: "ULAGOS",
    tipo: "U",
    color: "#0E7490",
    bgSoft: "#ECFEFF",
    ciudad: "Osorno",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD DE TALCA",
    nombreOficial: "UNIVERSIDAD DE TALCA",
    nombreCorto: "U. de Talca",
    sigla: "UTALCA",
    tipo: "U",
    color: "#9F1239",
    bgSoft: "#FFF1F2",
    ciudad: "Talca",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD DE LA FRONTERA",
    nombreOficial: "UNIVERSIDAD DE LA FRONTERA",
    nombreCorto: "UFRO",
    sigla: "UFRO",
    tipo: "U",
    color: "#1E40AF",
    bgSoft: "#EFF6FF",
    ciudad: "Temuco",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD DE VALPARAISO",
    nombreOficial: "UNIVERSIDAD DE VALPARAISO",
    nombreCorto: "U. de Valparaíso",
    sigla: "UV",
    tipo: "U",
    color: "#003A70",
    bgSoft: "#EFF6FF",
    ciudad: "Valparaíso",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD CATOLICA DEL NORTE",
    nombreOficial: "UNIVERSIDAD CATOLICA DEL NORTE",
    nombreCorto: "UCN",
    sigla: "UCN",
    tipo: "U",
    color: "#004B8D",
    bgSoft: "#EFF6FF",
    ciudad: "Antofagasta",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD DE ANTOFAGASTA",
    nombreOficial: "UNIVERSIDAD DE ANTOFAGASTA",
    nombreCorto: "U. de Antofagasta",
    sigla: "UA-ANT",
    tipo: "U",
    color: "#0369A1",
    bgSoft: "#F0F9FF",
    ciudad: "Antofagasta",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD DE LA SERENA",
    nombreOficial: "UNIVERSIDAD DE LA SERENA",
    nombreCorto: "U. de La Serena",
    sigla: "ULS",
    tipo: "U",
    color: "#1D4ED8",
    bgSoft: "#EFF6FF",
    ciudad: "La Serena",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD DEL BIO-BIO",
    nombreOficial: "UNIVERSIDAD DEL BIO-BIO",
    nombreCorto: "U. del Bío-Bío",
    sigla: "UBB",
    tipo: "U",
    color: "#1E3A8A",
    bgSoft: "#EFF6FF",
    ciudad: "Concepción",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD FINIS TERRAE",
    nombreOficial: "UNIVERSIDAD FINIS TERRAE",
    nombreCorto: "U. Finis Terrae",
    sigla: "UFT",
    tipo: "U",
    color: "#1E293B",
    bgSoft: "#F1F5F9",
    ciudad: "Santiago",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD ALBERTO HURTADO",
    nombreOficial: "UNIVERSIDAD ALBERTO HURTADO",
    nombreCorto: "U. Alberto Hurtado",
    sigla: "UAH",
    tipo: "U",
    color: "#0F766E",
    bgSoft: "#F0FDFA",
    ciudad: "Santiago",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD CATOLICA DEL MAULE",
    nombreOficial: "UNIVERSIDAD CATOLICA DEL MAULE",
    nombreCorto: "UCM",
    sigla: "UCM",
    tipo: "U",
    color: "#0369A1",
    bgSoft: "#F0F9FF",
    ciudad: "Talca",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD CATOLICA DE TEMUCO",
    nombreOficial: "UNIVERSIDAD CATOLICA DE TEMUCO",
    nombreCorto: "UCT",
    sigla: "UCT",
    tipo: "U",
    color: "#004C97",
    bgSoft: "#EFF6FF",
    ciudad: "Temuco",
    acreditacionAnios: 5,
  },
  {
    key: "UNIVERSIDAD DE TARAPACA",
    nombreOficial: "UNIVERSIDAD DE TARAPACA",
    nombreCorto: "UTA",
    sigla: "UTA",
    tipo: "U",
    color: "#0284C7",
    bgSoft: "#F0F9FF",
    ciudad: "Arica",
    acreditacionAnios: 6,
  },
  {
    key: "UNIVERSIDAD TECNOLOGICA METROPOLITANA",
    nombreOficial: "UNIVERSIDAD TECNOLOGICA METROPOLITANA",
    nombreCorto: "UTEM",
    sigla: "UTEM",
    tipo: "U",
    color: "#0369A1",
    bgSoft: "#F0F9FF",
    ciudad: "Santiago",
    acreditacionAnios: 4,
  },
  {
    key: "UNIVERSIDAD DE O'HIGGINS",
    nombreOficial: "UNIVERSIDAD DE O'HIGGINS",
    nombreCorto: "U. de O'Higgins",
    sigla: "UOH",
    tipo: "U",
    color: "#1E40AF",
    bgSoft: "#EFF6FF",
    ciudad: "Rancagua",
    acreditacionAnios: 4,
  },

  // Institutos Profesionales (IP)
  {
    key: "IP DUOC UC",
    nombreOficial: "IP DUOC UC",
    nombreCorto: "Duoc UC",
    sigla: "Duoc",
    tipo: "IP",
    color: "#111827",
    bgSoft: "#F1F5F9",
    ciudad: "Santiago",
    acreditacionAnios: 7,
  },
  {
    key: "IP INACAP",
    nombreOficial: "IP INACAP",
    nombreCorto: "IP INACAP",
    sigla: "INACAP",
    tipo: "IP",
    color: "#DC2626",
    bgSoft: "#FEF2F2",
    ciudad: "Santiago",
    acreditacionAnios: 7,
  },
  {
    key: "IP AIEP",
    nombreOficial: "IP AIEP",
    nombreCorto: "AIEP",
    sigla: "AIEP",
    tipo: "IP",
    color: "#1D4ED8",
    bgSoft: "#EFF6FF",
    ciudad: "Santiago",
    acreditacionAnios: 5,
  },
  {
    key: "IP SANTO TOMAS",
    nombreOficial: "IP SANTO TOMAS",
    nombreCorto: "IP Santo Tomás",
    sigla: "IP ST",
    tipo: "IP",
    color: "#047857",
    bgSoft: "#ECFDF5",
    ciudad: "Santiago",
    acreditacionAnios: 5,
  },
  {
    key: "IP DE CHILE",
    nombreOficial: "IP DE CHILE",
    nombreCorto: "IPChile",
    sigla: "IPChile",
    tipo: "IP",
    color: "#0369A1",
    bgSoft: "#F0F9FF",
    ciudad: "Santiago",
    acreditacionAnios: 4,
  },
  {
    key: "IP IACC",
    nombreOficial: "IP IACC",
    nombreCorto: "IACC",
    sigla: "IACC",
    tipo: "IP",
    color: "#2563EB",
    bgSoft: "#EFF6FF",
    ciudad: "Santiago",
    acreditacionAnios: 4,
  },
  {
    key: "IP DR. VIRGINIO GOMEZ G.",
    nombreOficial: "IP DR. VIRGINIO GOMEZ G.",
    nombreCorto: "IP Virginio Gómez",
    sigla: "VG",
    tipo: "IP",
    color: "#0F766E",
    bgSoft: "#F0FDFA",
    ciudad: "Concepción",
    acreditacionAnios: 4,
  },
  {
    key: "IP LATINOAMERICANO DE COMERCIO EXTERIOR - IPLACEX",
    nombreOficial: "IP LATINOAMERICANO DE COMERCIO EXTERIOR - IPLACEX",
    nombreCorto: "IPLACEX",
    sigla: "IPLACEX",
    tipo: "IP",
    color: "#1E3A8A",
    bgSoft: "#EFF6FF",
    ciudad: "Santiago",
    acreditacionAnios: 4,
  },

  // Centros de Formación Técnica (CFT)
  {
    key: "CFT INACAP",
    nombreOficial: "CFT INACAP",
    nombreCorto: "CFT INACAP",
    sigla: "CFT INACAP",
    tipo: "CFT",
    color: "#DC2626",
    bgSoft: "#FEF2F2",
    ciudad: "Santiago",
    acreditacionAnios: 7,
  },
  {
    key: "CFT SANTO TOMAS",
    nombreOficial: "CFT SANTO TOMAS",
    nombreCorto: "CFT Santo Tomás",
    sigla: "CFT ST",
    tipo: "CFT",
    color: "#047857",
    bgSoft: "#ECFDF5",
    ciudad: "Santiago",
    acreditacionAnios: 5,
  },
  {
    key: "CFT CEDUC - UCN",
    nombreOficial: "CFT CEDUC - UCN",
    nombreCorto: "CEDUC - UCN",
    sigla: "CEDUC",
    tipo: "CFT",
    color: "#0369A1",
    bgSoft: "#F0F9FF",
    ciudad: "Coquimbo",
    acreditacionAnios: 5,
  },
  {
    key: "CFT SAN AGUSTIN",
    nombreOficial: "CFT SAN AGUSTIN",
    nombreCorto: "CFT San Agustín",
    sigla: "CFT SA",
    tipo: "CFT",
    color: "#0F766E",
    bgSoft: "#F0FDFA",
    ciudad: "Talca",
    acreditacionAnios: 5,
  },
  {
    key: "CFT PUCV",
    nombreOficial: "CFT PUCV",
    nombreCorto: "CFT PUCV",
    sigla: "CFT PUCV",
    tipo: "CFT",
    color: "#004C97",
    bgSoft: "#EFF6FF",
    ciudad: "Viña del Mar",
    acreditacionAnios: 4,
  },
  {
    key: "CFT DE ENAC",
    nombreOficial: "CFT DE ENAC",
    nombreCorto: "ENAC",
    sigla: "ENAC",
    tipo: "CFT",
    color: "#1E40AF",
    bgSoft: "#EFF6FF",
    ciudad: "Santiago",
    acreditacionAnios: 5,
  },
];

export const INSTITUCIONES_DESTACADAS_KEYS: string[] = [
  // Universidades
  "UNIVERSIDAD DE CHILE",
  "PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE",
  "UNIVERSIDAD TECNICA FEDERICO SANTA MARIA",
  "UNIVERSIDAD DE CONCEPCION",
  "UNIVERSIDAD DE SANTIAGO DE CHILE",
  "PONTIFICIA UNIVERSIDAD CATOLICA DE VALPARAISO",
  "UNIVERSIDAD ADOLFO IBANEZ",
  "UNIVERSIDAD DIEGO PORTALES",
  "UNIVERSIDAD AUSTRAL DE CHILE",
  "UNIVERSIDAD ANDRES BELLO",
  "UNIVERSIDAD DEL DESARROLLO",
  "UNIVERSIDAD DE LOS ANDES",
  // IP
  "IP DUOC UC",
  "IP INACAP",
  "IP AIEP",
  "IP SANTO TOMAS",
  "IP DE CHILE",
  "IP IACC",
  // CFT
  "CFT INACAP",
  "CFT SANTO TOMAS",
  "CFT CEDUC - UCN",
  "CFT SAN AGUSTIN",
  "CFT PUCV",
  "CFT DE ENAC",
];

function normalizeInstKey(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

const INSTITUCION_MAP = new Map<string, InstitucionVisual>();
for (const item of INSTITUCIONES_LIST) {
  INSTITUCION_MAP.set(normalizeInstKey(item.key), item);
  INSTITUCION_MAP.set(normalizeInstKey(item.nombreOficial), item);
}

// Common aliases for convenience
const ALIASES: Array<[string, string]> = [
  ["IP CHILE", "IP DE CHILE"],
  ["CFT ENAC", "CFT DE ENAC"],
  ["DUOC UC", "IP DUOC UC"],
];
for (const [alias, target] of ALIASES) {
  const found = INSTITUCION_MAP.get(normalizeInstKey(target));
  if (found) INSTITUCION_MAP.set(normalizeInstKey(alias), found);
}

const FALLBACK_PALETTE: Array<{ color: string; bgSoft: string }> = [
  { color: "#1E3A8A", bgSoft: "#EFF6FF" },
  { color: "#0F172A", bgSoft: "#F1F5F9" },
  { color: "#0369A1", bgSoft: "#F0F9FF" },
  { color: "#1D4ED8", bgSoft: "#EFF6FF" },
  { color: "#0F766E", bgSoft: "#F0FDFA" },
  { color: "#334155", bgSoft: "#F8FAFC" },
];

const STOP_WORDS = new Set([
  "UNIVERSIDAD",
  "INSTITUTO",
  "PROFESIONAL",
  "CENTRO",
  "FORMACION",
  "TECNICA",
  "DE",
  "DEL",
  "LA",
  "LAS",
  "LOS",
  "EL",
  "Y",
  "E",
  "EN",
  "IP",
  "CFT",
  "REGION",
]);

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function inferTipo(nombreNorm: string, tipo?: string): "U" | "IP" | "CFT" {
  const t = (tipo || "").trim().toUpperCase();
  if (t === "IP") return "IP";
  if (t === "CFT") return "CFT";
  if (t === "U") return "U";
  if (nombreNorm.startsWith("IP ") || nombreNorm.includes("INSTITUTO PROFESIONAL")) return "IP";
  if (nombreNorm.startsWith("CFT ") || nombreNorm.includes("FORMACION TECNICA")) return "CFT";
  return "U";
}

function buildFallbackSigla(nombreNorm: string): string {
  const words = nombreNorm
    .replace(/[^A-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOP_WORDS.has(w));
  if (words.length === 0) {
    return nombreNorm.replace(/[^A-Z0-9]/g, "").slice(0, 3) || "IES";
  }
  if (words.length === 1) {
    return words[0].slice(0, 4);
  }
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("");
}

function toTitleCaseShort(nombre: string): string {
  const clean = nombre.trim();
  if (!clean) return "Institución";
  return clean
    .toLowerCase()
    .replace(/(^|\s)([a-záéíóúñ])/g, (_, sep: string, ch: string) => sep + ch.toUpperCase())
    .replace(/\bIp\b/g, "IP")
    .replace(/\bCft\b/g, "CFT")
    .replace(/\bDe\b/g, "de")
    .replace(/\bDel\b/g, "del")
    .replace(/\bLa\b/g, "la")
    .replace(/\bLas\b/g, "las")
    .replace(/\bLos\b/g, "los")
    .replace(/\bY\b/g, "y");
}

/**
 * Accent- and case-insensitive lookup for Chilean higher-education institutions,
 * with a deterministic monogram and slate/blue fallback for unlisted institutions.
 */
export function getInstitucionVisual(nombre: string, tipo?: string): InstitucionVisual {
  const norm = normalizeInstKey(nombre || "");
  const match = INSTITUCION_MAP.get(norm);
  if (match) return match;

  const resolvedTipo = inferTipo(norm, tipo);
  const palette = FALLBACK_PALETTE[hashString(norm || "ies") % FALLBACK_PALETTE.length];

  return {
    key: norm || "INSTITUCION",
    nombreOficial: nombre.trim() || "Institución",
    nombreCorto: toTitleCaseShort(nombre),
    sigla: buildFallbackSigla(norm),
    tipo: resolvedTipo,
    color: palette.color,
    bgSoft: palette.bgSoft,
  };
}
