/**
 * Forma natural de profesión revisada a mano para el H1 de las fichas más buscadas.
 * Si una carrera no está aquí, se usa directamente el nombre oficial de la carrera.
 */
export const PROFESION_POR_SLUG: Record<string, string> = {
  medicina: "médico",
  "ingenieria-comercial": "ingeniero/a comercial",
  "ingenieria-civil-industrial": "ingeniero/a civil industrial",
  "ingenieria-civil-en-computacion-e-informatica": "ingeniero/a civil informático",
  "ingenieria-en-computacion-e-informatica": "ingeniero/a en informática",
  "ingenieria-civil-electrica": "ingeniero/a civil eléctrico",
  "ingenieria-civil-mecanica": "ingeniero/a civil mecánico",
  "ingenieria-civil-en-minas": "ingeniero/a civil en minas",
  "ingenieria-civil-metalurgica": "ingeniero/a civil metalúrgico",
  "ingenieria-civil-en-obras-civiles": "ingeniero/a civil en obras civiles",
  "ingenieria-civil-quimica": "ingeniero/a civil químico",
  derecho: "abogado/a",
  psicologia: "psicólogo/a",
  enfermeria: "enfermero/a",
  kinesiologia: "kinesiólogo/a",
  odontologia: "odontólogo/a",
  "quimica-y-farmacia": "químico farmacéutico",
  "tecnologia-medica": "tecnólogo/a médico",
  "obstetricia-y-puericultura": "matrona o matrón",
  "nutricion-y-dietetica": "nutricionista",
  fonoaudiologia: "fonoaudiólogo/a",
  "terapia-ocupacional": "terapeuta ocupacional",
  arquitectura: "arquitecto/a",
  periodismo: "periodista",
  "trabajo-social": "trabajador/a social",
  "contador-auditor": "contador auditor",
  "construccion-civil": "constructor civil",
  agronomia: "agrónomo/a",
  "medicina-veterinaria": "médico veterinario",
  geologia: "geólogo/a",
  "administracion-publica": "administrador/a público",
  "diseno-grafico": "diseñador/a gráfico",
  "tecnico-en-enfermeria": "técnico en enfermería (TENS)",
  "tecnico-en-computacion-e-informatica": "técnico en informática",
  "ingenieria-en-prevencion-de-riesgos": "ingeniero/a en prevención de riesgos",
  "pedagogia-en-educacion-basica": "profesor/a de educación básica",
  "pedagogia-en-educacion-fisica": "profesor/a de educación física",
  "pedagogia-en-educacion-diferencial": "educador/a diferencial",
  "pedagogia-en-educacion-de-parvulos": "educador/a de párvulos",
  "pedagogia-en-ingles": "profesor/a de inglés",
  "ingenieria-en-administracion-de-empresas": "ingeniero/a en administración",
  "tecnico-en-administracion-de-empresas": "técnico en administración",
};

export function tituloH1Ficha(slug: string, nombre: string): string {
  const prof = PROFESION_POR_SLUG[slug];
  if (prof) {
    return `¿Cuánto gana un/a ${prof} en Chile? Sueldo de ${nombre}`;
  }
  return `Sueldo y empleabilidad de ${nombre} en Chile`;
}
