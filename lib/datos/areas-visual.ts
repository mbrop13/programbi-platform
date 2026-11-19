export interface AreaVisual {
  slug: string;
  nombre: string;
  image: string;
  tagline: string;
  accent: string;
  softBg: string;
  border: string;
}

const DEFAULT_AREA_VISUAL: AreaVisual = {
  slug: "tecnologia",
  nombre: "Otras áreas",
  image: "/images/datos/areas/tecnologia.svg",
  tagline: "Datos oficiales de empleabilidad",
  accent: "#2563EB",
  softBg: "#EFF6FF",
  border: "#BFDBFE",
};

export const AREAS_VISUAL: Record<string, AreaVisual> = {
  Salud: {
    slug: "salud",
    nombre: "Salud",
    image: "/images/datos/areas/salud.svg",
    tagline: "Clínica, medicina y bienestar",
    accent: "#0F766E",
    softBg: "#F0FDFA",
    border: "#99F6E4",
  },
  Tecnología: {
    slug: "tecnologia",
    nombre: "Tecnología",
    image: "/images/datos/areas/tecnologia.svg",
    tagline: "Software, ingeniería e industria",
    accent: "#2563EB",
    softBg: "#EFF6FF",
    border: "#BFDBFE",
  },
  "Administración y Comercio": {
    slug: "administracion",
    nombre: "Administración y Comercio",
    image: "/images/datos/areas/administracion.svg",
    tagline: "Gestión, finanzas y negocios",
    accent: "#1D4ED8",
    softBg: "#EFF6FF",
    border: "#C7D2FE",
  },
  Derecho: {
    slug: "derecho",
    nombre: "Derecho",
    image: "/images/datos/areas/derecho.svg",
    tagline: "Ciencias jurídicas y regulación",
    accent: "#1E293B",
    softBg: "#F1F5F9",
    border: "#CBD5E1",
  },
  "Ciencias Básicas": {
    slug: "ciencias",
    nombre: "Ciencias Básicas",
    image: "/images/datos/areas/ciencias.svg",
    tagline: "Investigación y ciencias exactas",
    accent: "#0369A1",
    softBg: "#F0F9FF",
    border: "#BAE6FD",
  },
  Educación: {
    slug: "educacion",
    nombre: "Educación",
    image: "/images/datos/areas/educacion.svg",
    tagline: "Pedagogía y formación docente",
    accent: "#047857",
    softBg: "#ECFDF5",
    border: "#A7F3D0",
  },
  "Arte y Arquitectura": {
    slug: "arte",
    nombre: "Arte y Arquitectura",
    image: "/images/datos/areas/arte.svg",
    tagline: "Diseño, espacio y creación",
    accent: "#B45309",
    softBg: "#FFFBEB",
    border: "#FDE68A",
  },
  "Ciencias Sociales": {
    slug: "sociales",
    nombre: "Ciencias Sociales",
    image: "/images/datos/areas/sociales.svg",
    tagline: "Sociedad, política y comunicación",
    accent: "#4338CA",
    softBg: "#EEF2FF",
    border: "#C7D2FE",
  },
  Agropecuaria: {
    slug: "agropecuaria",
    nombre: "Agropecuaria",
    image: "/images/datos/areas/agropecuaria.svg",
    tagline: "Agronomía, recursos y territorio",
    accent: "#15803D",
    softBg: "#F0FDF4",
    border: "#BBF7D0",
  },
  Humanidades: {
    slug: "humanidades",
    nombre: "Humanidades",
    image: "/images/datos/areas/humanidades.svg",
    tagline: "Letras, historia y cultura",
    accent: "#9F1239",
    softBg: "#FFF1F2",
    border: "#FECDD3",
  },
};

function normalizeAreaKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

const NORMALIZED_AREA_MAP = new Map<string, AreaVisual>(
  Object.values(AREAS_VISUAL).map((item) => [normalizeAreaKey(item.nombre), item]),
);

// Also allow lookup by slug (e.g. "tecnologia", "administracion")
for (const item of Object.values(AREAS_VISUAL)) {
  NORMALIZED_AREA_MAP.set(item.slug, item);
}

/**
 * Returns the visual metadata for one of the 10 official CNED/Mineduc areas,
 * using accent- and case-insensitive normalization with a safe fallback.
 */
export function getAreaVisual(area: string): AreaVisual {
  if (!area) return DEFAULT_AREA_VISUAL;
  const direct = AREAS_VISUAL[area];
  if (direct) return direct;
  const normalized = normalizeAreaKey(area);
  return NORMALIZED_AREA_MAP.get(normalized) ?? {
    ...DEFAULT_AREA_VISUAL,
    nombre: area.trim() || DEFAULT_AREA_VISUAL.nombre,
  };
}
