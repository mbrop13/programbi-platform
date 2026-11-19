import { normalizarTexto } from "./formato";

/**
 * Sinónimos y búsquedas frecuentes de postulantes en Chile → slugs reales de mifuturo.cl.
 */
export const SINONIMOS_CARRERAS: Record<string, string[]> = {
  "ingenieria-comercial": ["ing comercial", "inge comercial", "comercial", "administracion empresas"],
  medicina: ["medico", "medica", "doctor", "doctora", "cirujano"],
  derecho: ["abogado", "abogada", "leyes", "ciencias juridicas"],
  kinesiologia: ["kine", "kinesiologo", "kinesiologa", "fisioterapia"],
  psicologia: ["psico", "psicologo", "psicologa"],
  enfermeria: ["enfermera", "enfermero"],
  "tecnico-en-enfermeria": ["tens", "tecnico enfermeria", "auxiliar enfermeria"],
  "ingenieria-civil-en-computacion-e-informatica": [
    "informatica",
    "computacion",
    "programacion",
    "software",
    "desarrollador",
    "ing informatica",
    "ciencia de datos",
    "data science",
  ],
  "ingenieria-en-computacion-e-informatica": [
    "informatica",
    "computacion",
    "programacion",
    "software",
    "analista programador",
    "ing en informatica",
  ],
  "tecnico-en-computacion-e-informatica": [
    "tecnico informatica",
    "tecnico programacion",
    "analista programador",
    "soporte computacional",
  ],
  "ingenieria-en-conectividad-y-redes": ["redes", "ciberseguridad", "telecomunicaciones"],
  "ingenieria-en-matematica-y-estadistica": ["estadistica", "ciencia de datos", "data science", "matematica aplicada"],
  "contador-auditor": ["contador", "auditor", "contabilidad", "auditoria"],
  "pedagogia-en-educacion-de-parvulos": ["parvulo", "parvulos", "educadora de parvulos", "parvularia"],
  "tecnico-asistente-del-educador-de-parvulos": ["asistente de parvulos", "tecnico parvulo"],
  odontologia: ["dentista", "odontologo", "odontologa"],
  "quimica-y-farmacia": ["farmaceutico", "farmacia", "quimico farmaceutico"],
  "tecnologia-medica": ["tecnologo medico", "laboratorio clinico"],
  "obstetricia-y-puericultura": ["matrona", "matron", "obstetra"],
  "nutricion-y-dietetica": ["nutricionista", "nutricion"],
  fonoaudiologia: ["fonoaudiologo", "fono"],
  "terapia-ocupacional": ["terapeuta ocupacional", "to"],
  "ingenieria-civil-industrial": ["industrial", "ing civil industrial", "ici"],
  "ingenieria-civil-en-minas": ["minas", "mineria", "ing civil minas"],
  "ingenieria-civil-electrica": ["electrica", "electricidad", "ing civil electrica"],
  "ingenieria-civil-mecanica": ["mecanica", "ing civil mecanica"],
  "ingenieria-civil-en-obras-civiles": ["obras civiles", "ingenieria civil"],
  "construccion-civil": ["constructor civil", "construccion"],
  arquitectura: ["arquitecto", "arquitecta"],
  periodismo: ["periodista", "comunicacion social"],
  "trabajo-social": ["asistente social", "trabajador social"],
  "medicina-veterinaria": ["veterinario", "veterinaria", "vet"],
  agronomia: ["agronomo", "agricultura"],
  "diseno-grafico": ["disenador grafico", "diseno"],
  "administracion-publica": ["administrador publico", "sector publico"],
  "ingenieria-en-prevencion-de-riesgos": ["prevencionista", "prevencion de riesgos"],
};

const ABREVIATURAS: readonly [RegExp, string][] = [
  [/\bing\.?\b/g, "ingenieria"],
  [/\binge\b/g, "ingenieria"],
  [/\btec\.?\b/g, "tecnico"],
  [/\badm\.?\b/g, "administracion"],
  [/\bped\.?\b/g, "pedagogia"],
  [/\bcont\.?\b/g, "contador"],
  [/\bmed\.?\b/g, "medicina"],
];

export function expandirConsulta(raw: string): string {
  let q = normalizarTexto(raw);
  for (const [re, rep] of ABREVIATURAS) {
    q = q.replace(re, rep);
  }
  return q.replace(/\s+/g, " ").trim();
}

/** Distancia de Levenshtein acotada a 1 error para tolerancia de tipeo en palabras ≥ 5 letras. */
export function distanciaUnoOMenos(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let diffs = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
    } else {
      diffs++;
      if (diffs > 1) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else {
        i++;
        j++;
      }
    }
  }
  if (i < a.length || j < b.length) diffs++;
  return diffs <= 1;
}

export interface BuscadorEntry {
  slug: string;
  nombre: string;
  area: string;
  tipos: { tipo: "u" | "ip" | "cft"; ing4: number | null; emp1: number | null }[];
  aliases: string[];
}

export function buscarCarreras(
  query: string,
  items: readonly BuscadorEntry[],
  limit = 12
): { exactos: BuscadorEntry[]; sugeridos: BuscadorEntry[] } {
  const q = expandirConsulta(query);
  if (!q) {
    return { exactos: items.slice(0, limit), sugeridos: [] };
  }
  const tokens = q.split(" ").filter(Boolean);

  const scored = items
    .map((item) => {
      const nombreNorm = expandirConsulta(item.nombre);
      const sinonimos = (SINONIMOS_CARRERAS[item.slug] ?? []).map(expandirConsulta);
      const aliases = item.aliases.map(expandirConsulta);
      let score = 0;

      if (nombreNorm === q || sinonimos.includes(q)) score += 120;
      else if (nombreNorm.startsWith(q)) score += 90;
      else if (sinonimos.some((s) => s.includes(q))) score += 80;
      else if (nombreNorm.includes(q)) score += 70;
      else if (aliases.some((a) => a.includes(q))) score += 50;
      else {
        // Coincidencia por tokens + tolerancia de 1 error en palabras >= 5 letras
        const poolWords = [
          ...nombreNorm.split(" "),
          ...sinonimos.flatMap((s) => s.split(" ")),
          ...aliases.flatMap((a) => a.split(" ")),
        ];
        let matched = 0;
        for (const tok of tokens) {
          if (poolWords.some((w) => w.includes(tok))) {
            matched += 1;
          } else if (tok.length >= 5 && poolWords.some((w) => w.length >= 4 && distanciaUnoOMenos(tok, w))) {
            matched += 0.7;
          }
        }
        if (matched >= tokens.length * 0.75) score += Math.round(matched * 25);
      }

      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    return { exactos: scored.slice(0, limit).map((s) => s.item), sugeridos: [] };
  }

  // Si no hay resultados exactos, sugiere las 3 más parecidas por similitud de palabras/prefijos
  const fallback = items
    .map((item) => {
      const words = expandirConsulta(item.nombre).split(" ");
      let sim = 0;
      for (const tok of tokens) {
        for (const w of words) {
          if (tok.length >= 3 && w.startsWith(tok.slice(0, 3))) sim += 2;
          if (tok.length >= 4 && distanciaUnoOMenos(tok, w)) sim += 3;
        }
      }
      return { item, sim };
    })
    .sort((a, b) => b.sim - a.sim)
    .slice(0, 3)
    .map((x) => x.item);

  return { exactos: [], sugeridos: fallback };
}
