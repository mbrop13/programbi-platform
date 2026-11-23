import { getMetaCarreras, type CarreraRecord } from "./carreras";

const edicionMeta = getMetaCarreras().edicion;
export const ANO_EDICION_CARRERAS =
  edicionMeta.match(/(\d{4})$/)?.[1] ?? edicionMeta;

export interface CarreraSeoConfig {
  persona?: string;
  personaMeta?: string;
  articulo?: "un" | "una";
  nombreCorto?: string;
  titleOverride?: string;
  colaMetaOverride?: string;
}

export const CARRERAS_SEO_MAPA: Record<string, CarreraSeoConfig> = {
  // === Salud y Ciencias Médicas ===
  medicina: {
    persona: "médico",
  },
  enfermeria: {
    persona: "enfermero",
  },
  kinesiologia: {
    persona: "kinesiólogo",
  },
  odontologia: {
    persona: "odontólogo",
  },
  "quimica-y-farmacia": {
    persona: "químico farmacéutico",
  },
  "tecnologia-medica": {
    persona: "tecnólogo médico",
  },
  "obstetricia-y-puericultura": {
    persona: "matrona",
    articulo: "una",
  },
  "nutricion-y-dietetica": {
    persona: "nutricionista",
  },
  fonoaudiologia: {
    persona: "fonoaudiólogo",
  },
  "terapia-ocupacional": {
    persona: "terapeuta ocupacional",
  },
  psicologia: {
    persona: "psicólogo",
  },
  "medicina-veterinaria": {
    persona: "veterinario",
    personaMeta: "médico veterinario",
  },
  "tecnico-en-enfermeria": {
    persona: "TENS",
    titleOverride: "¿Cuánto gana un TENS en Chile? Sueldo técnico en enfermería",
    colaMetaOverride:
      " Compara institutos, aranceles y duración real de la carrera.",
  },
  "tecnico-en-farmacia": {
    persona: "técnico en farmacia",
  },
  "tecnico-en-laboratorio-clinico": {
    persona: "técnico en laboratorio clínico",
    nombreCorto: "Técnico en Laboratorio Clínico",
  },
  "tecnico-en-podologia": {
    persona: "podólogo",
    personaMeta: "técnico en podología",
  },
  "tecnico-en-radiologia-y-radioterapia": {
    persona: "técnico en radiología",
    nombreCorto: "Técnico en Radiología",
  },
  "tecnico-dental-y-asistente-de-odontologia": {
    persona: "asistente dental",
    nombreCorto: "Técnico Dental",
  },
  "tecnico-laboratorista-dental": {
    persona: "laboratorista dental",
    nombreCorto: "Técnico Laboratorista Dental",
  },
  "tecnico-en-masoterapia": {
    persona: "masoterapeuta",
    personaMeta: "técnico en masoterapia",
  },
  "tecnico-veterinario": {
    persona: "técnico veterinario",
  },
  "tecnico-en-prevencion-y-rehabilitacion": {
    nombreCorto: "Técnico en Rehabilitación",
  },

  // === Ingenierías Civiles ===
  "ingenieria-civil-industrial": {
    persona: "ingeniero civil industrial",
  },
  "ingenieria-civil-en-computacion-e-informatica": {
    persona: "ingeniero civil informático",
    nombreCorto: "Ingeniería Civil Informática",
  },
  "ingenieria-civil-electrica": {
    persona: "ingeniero civil eléctrico",
  },
  "ingenieria-civil-electronica": {
    persona: "ingeniero civil electrónico",
  },
  "ingenieria-civil-mecanica": {
    persona: "ingeniero civil mecánico",
  },
  "ingenieria-civil-en-minas": {
    persona: "ingeniero civil en minas",
    titleOverride: "¿Cuánto gana un ingeniero civil en minas? Sueldo Chile 2026",
  },
  "ingenieria-civil-metalurgica": {
    persona: "ingeniero civil metalúrgico",
    nombreCorto: "Ing. Civil Metalúrgica",
  },
  "ingenieria-civil-en-obras-civiles": {
    persona: "ingeniero civil en obras civiles",
    nombreCorto: "Ing. Civil en Obras Civiles",
  },
  "ingenieria-civil-quimica": {
    persona: "ingeniero civil químico",
  },
  "ingenieria-civil-ambiental": {
    persona: "ingeniero civil ambiental",
  },
  "ingenieria-civil-bioquimica": {
    persona: "ingeniero civil bioquímico",
  },
  "ingenieria-civil-en-biomedica": {
    persona: "ingeniero civil biomédico",
  },
  "ingenieria-civil-plan-comun-y-licenciatura-en-ciencias-de-la-ingenieria": {
    nombreCorto: "Ingeniería Civil plan común",
  },

  // === Otras Ingenierías ===
  "ingenieria-comercial": {
    persona: "ingeniero comercial",
  },
  "ingenieria-en-computacion-e-informatica": {
    persona: "ingeniero en informática",
    nombreCorto: "Ingeniería en Informática",
  },
  "ingenieria-en-conectividad-y-redes": {
    persona: "ingeniero en redes",
    personaMeta: "ingeniero en conectividad y redes",
    nombreCorto: "Ingeniería en Redes",
  },
  "ingenieria-en-automatizacion-instrumentacion-y-control": {
    persona: "ingeniero en automatización",
    nombreCorto: "Ing. en Automatización",
  },
  "ingenieria-en-construccion": {
    persona: "ingeniero en construcción",
  },
  "ingenieria-en-electricidad": {
    persona: "ingeniero eléctrico",
    personaMeta: "ingeniero en electricidad",
  },
  "ingenieria-en-electronica": {
    persona: "ingeniero electrónico",
    personaMeta: "ingeniero en electrónica",
  },
  "ingenieria-en-minas": {
    persona: "ingeniero en minas",
  },
  "ingenieria-en-metalurgia": {
    persona: "ingeniero en metalurgia",
  },
  "ingenieria-en-prevencion-de-riesgos": {
    persona: "prevencionista de riesgos",
    personaMeta: "ingeniero en prevención de riesgos",
    nombreCorto: "Ing. en Prevención de Riesgos",
  },
  "ingenieria-en-administracion-de-empresas": {
    persona: "ingeniero en administración",
    nombreCorto: "Ing. en Administración",
  },
  "ingenieria-en-finanzas": {
    persona: "ingeniero en finanzas",
  },
  "ingenieria-en-control-de-gestion": {
    persona: "ingeniero en control de gestión",
    nombreCorto: "Ing. en Control de Gestión",
  },
  "ingenieria-en-comercio-exterior": {
    persona: "ingeniero en comercio exterior",
    nombreCorto: "Ing. en Comercio Exterior",
  },
  "ingenieria-en-logistica": {
    persona: "ingeniero en logística",
  },
  "ingenieria-en-marketing": {
    persona: "ingeniero en marketing",
  },
  "ingenieria-en-recursos-humanos": {
    persona: "ingeniero en RR. HH.",
    personaMeta: "ingeniero en recursos humanos",
    nombreCorto: "Ing. en Recursos Humanos",
  },
  "ingenieria-en-gestion-publica": {
    persona: "ingeniero en gestión pública",
    nombreCorto: "Ing. en Gestión Pública",
  },
  "ingenieria-en-geomensura-y-cartografia": {
    persona: "ingeniero geomensor",
    nombreCorto: "Ingeniería en Geomensura",
  },
  "ingenieria-en-medio-ambiente": {
    persona: "ingeniero ambiental",
    personaMeta: "ingeniero en medio ambiente",
  },
  "ingenieria-en-recursos-renovables": {
    nombreCorto: "Ing. en Recursos Renovables",
  },
  "ingenieria-en-alimentos": {
    persona: "ingeniero en alimentos",
  },
  "ingenieria-en-biotecnologia-y-bioingenieria": {
    persona: "ingeniero en biotecnología",
    nombreCorto: "Ing. en Biotecnología",
  },
  "ingenieria-en-quimica": {
    persona: "ingeniero químico",
  },
  "ingenieria-en-matematica-y-estadistica": {
    nombreCorto: "Ing. en Matemática y Estadística",
  },
  "ingenieria-en-mecanica-automotriz": {
    persona: "ingeniero automotriz",
    personaMeta: "ingeniero en mecánica automotriz",
    nombreCorto: "Ing. en Mecánica Automotriz",
  },
  "ingenieria-en-refrigeracion-y-climatizacion": {
    nombreCorto: "Ing. en Refrigeración",
  },
  "ingenieria-en-seguridad-privada": {
    nombreCorto: "Ing. en Seguridad Privada",
  },
  "ingenieria-en-sonido": {
    persona: "ingeniero en sonido",
  },
  "ingenieria-en-telecomunicaciones": {
    persona: "ingeniero en telecomunicaciones",
    nombreCorto: "Ing. en Telecomunicaciones",
  },
  "ingenieria-industrial": {
    persona: "ingeniero industrial",
  },
  "ingenieria-mecanica": {
    persona: "ingeniero mecánico",
  },
  "ingenieria-agricola": {
    persona: "ingeniero agrícola",
  },
  "ingenieria-forestal": {
    persona: "ingeniero forestal",
  },
  "ingenieria-marina-y-maritimo-portuaria": {
    nombreCorto: "Ing. Marina y Portuaria",
  },

  // === Derecho, Economía, Administración y Ciencias Sociales ===
  derecho: {
    persona: "abogado",
  },
  "contador-auditor": {
    persona: "contador auditor",
  },
  "administracion-publica": {
    persona: "administrador público",
  },
  "administracion-de-empresas-e-ing-asociadas": {
    nombreCorto: "Administración de Empresas",
  },
  "administracion-gastronomica": {
    nombreCorto: "Administración Gastronómica",
  },
  "administracion-turistica-y-hotelera": {
    nombreCorto: "Administración Turística",
  },
  "trabajo-social": {
    persona: "trabajador social",
  },
  periodismo: {
    persona: "periodista",
  },
  publicidad: {
    persona: "publicista",
  },
  "relaciones-publicas": {
    persona: "relacionador público",
  },
  sociologia: {
    persona: "sociólogo",
  },
  antropologia: {
    persona: "antropólogo",
  },
  "ciencias-politicas": {
    persona: "cientista político",
  },
  geografia: {
    persona: "geógrafo",
  },
  bibliotecologia: {
    persona: "bibliotecólogo",
  },
  psicopedagogia: {
    persona: "psicopedagogo",
  },

  // === Construcción, Arquitectura, Diseño y Artes ===
  arquitectura: {
    persona: "arquitecto",
  },
  "construccion-civil": {
    persona: "constructor civil",
  },
  "diseno-grafico": {
    persona: "diseñador gráfico",
  },
  "diseno-industrial": {
    persona: "diseñador industrial",
  },
  "diseno-de-ambientes-e-interiores": {
    persona: "diseñador de interiores",
    nombreCorto: "Diseño de Interiores",
  },
  "diseno-de-vestuario": {
    persona: "diseñador de vestuario",
  },
  diseno: {
    persona: "diseñador",
  },
  "animacion-digital": {
    persona: "animador digital",
  },
  "comunicacion-audiovisual-y-o-multimedia": {
    persona: "comunicador audiovisual",
    nombreCorto: "Comunicación Audiovisual",
  },
  "realizador-de-cine-y-television": {
    nombreCorto: "Cine y Televisión",
  },
  "actuacion-y-teatro": {
    nombreCorto: "Actuación y Teatro",
  },
  "artes-y-licenciatura-en-artes": {
    nombreCorto: "Artes y Licenciatura en Artes",
  },
  "musica-canto-o-danza": {
    nombreCorto: "Música, Canto o Danza",
  },

  // === Ciencias Básicas y Agro ===
  geologia: {
    persona: "geólogo",
  },
  agronomia: {
    persona: "agrónomo",
    personaMeta: "ingeniero agrónomo",
  },
  biologia: {
    persona: "biólogo",
  },
  "biologia-marina-y-ecologia-marina": {
    persona: "biólogo marino",
    nombreCorto: "Biología Marina",
  },
  bioquimica: {
    persona: "bioquímico",
  },
  "quimica-licenciado-en-quimica": {
    persona: "químico",
    nombreCorto: "Química",
  },
  "licenciatura-en-letras-y-literatura": {
    nombreCorto: "Letras y Literatura",
  },
  "traduccion-e-interpretacion": {
    persona: "traductor e intérprete",
    nombreCorto: "Traducción e Interpretación",
  },

  // === Pedagogías ===
  "pedagogia-en-educacion-basica": {
    persona: "profesor de educación básica",
    nombreCorto: "Pedagogía Básica",
  },
  "pedagogia-en-educacion-fisica": {
    persona: "profesor de educación física",
    nombreCorto: "Pedagogía en Ed. Física",
  },
  "pedagogia-en-educacion-diferencial": {
    persona: "educadora diferencial",
    articulo: "una",
    nombreCorto: "Pedagogía Diferencial",
  },
  "pedagogia-en-educacion-de-parvulos": {
    persona: "educadora de párvulos",
    articulo: "una",
    nombreCorto: "Educación de Párvulos",
  },
  "pedagogia-en-ingles": {
    persona: "profesor de inglés",
  },
  "pedagogia-en-artes-y-musica": {
    persona: "profesor de artes y música",
    nombreCorto: "Pedagogía en Artes y Música",
  },
  "pedagogia-en-ciencias": {
    persona: "profesor de ciencias",
  },
  "pedagogia-en-educacion-media": {
    persona: "profesor de enseñanza media",
    nombreCorto: "Pedagogía en Ed. Media",
  },
  "pedagogia-en-educacion-tecnico-profesional": {
    nombreCorto: "Pedagogía Técnico Profesional",
  },
  "pedagogia-en-filosofia-y-religion": {
    persona: "profesor de filosofía",
    nombreCorto: "Pedagogía en Filosofía",
  },
  "pedagogia-en-historia-geografia-y-ciencias-sociales": {
    persona: "profesor de historia",
    nombreCorto: "Pedagogía en Historia",
  },
  "pedagogia-en-idiomas": {
    persona: "profesor de idiomas",
  },
  "pedagogia-en-lenguaje-comunicacion-y-o-castellano": {
    persona: "profesor de lenguaje",
    nombreCorto: "Pedagogía en Lenguaje",
  },
  "pedagogia-en-matematicas-y-computacion": {
    persona: "profesor de matemáticas",
    nombreCorto: "Pedagogía en Matemáticas",
  },
  "programas-de-formacion-pedagogica": {
    nombreCorto: "Formación Pedagógica",
  },

  // === Carreras Técnicas ===
  "tecnico-en-computacion-e-informatica": {
    persona: "técnico en informática",
    nombreCorto: "Técnico en Informática",
  },
  "tecnico-en-administracion-de-empresas": {
    persona: "técnico en administración",
    nombreCorto: "Técnico en Administración",
  },
  "tecnico-en-administracion-de-recursos-humanos-y-personal": {
    persona: "técnico en RR. HH.",
    nombreCorto: "Técnico en RR. HH.",
  },
  "tecnico-en-administracion-financiera-y-finanzas": {
    persona: "técnico en finanzas",
    nombreCorto: "Técnico en Finanzas",
  },
  "tecnico-en-administracion-publica-o-municipal": {
    nombreCorto: "Técnico en Adm. Pública",
  },
  "tecnico-en-administracion-de-redes-y-soporte": {
    persona: "técnico en redes",
    nombreCorto: "Técnico en Redes y Soporte",
  },
  "tecnico-en-contabilidad-general": {
    persona: "técnico contable",
    personaMeta: "técnico en contabilidad general",
    nombreCorto: "Técnico en Contabilidad",
  },
  "tecnico-en-comercio-exterior": {
    persona: "técnico en comercio exterior",
    nombreCorto: "Técnico en Comercio Exterior",
  },
  "tecnico-en-logistica": {
    persona: "técnico en logística",
  },
  "tecnico-juridico": {
    persona: "técnico jurídico",
  },
  "tecnico-en-servicio-social": {
    persona: "técnico en servicio social",
    nombreCorto: "Técnico en Servicio Social",
  },
  "tecnico-asistente-del-educador-de-parvulos": {
    persona: "asistente de párvulos",
    articulo: "una",
    nombreCorto: "Asistente de Párvulos",
  },
  "tecnico-asistente-del-educador-diferencial": {
    persona: "asistente diferencial",
    articulo: "una",
    nombreCorto: "Asistente Diferencial",
  },
  "tecnico-en-prevencion-de-riesgos": {
    persona: "técnico en prevención",
    personaMeta: "técnico en prevención de riesgos",
    nombreCorto: "Téc. Prevención de Riesgos",
  },
  "tecnico-en-construccion-y-obras-civiles": {
    persona: "técnico en construcción",
    nombreCorto: "Técnico en Construcción",
  },
  "tecnico-en-electricidad-y-electricidad-industrial": {
    persona: "técnico electricista",
    personaMeta: "técnico en electricidad",
    nombreCorto: "Técnico en Electricidad",
  },
  "tecnico-en-electronica-y-electronica-industrial": {
    persona: "técnico en electrónica",
    nombreCorto: "Técnico en Electrónica",
  },
  "tecnico-en-electromecanica": {
    persona: "técnico en electromecánica",
  },
  "tecnico-en-mantenimiento-industrial": {
    nombreCorto: "Téc. Mantenimiento Industrial",
  },
  "tecnico-en-mecanica-automotriz": {
    persona: "mecánico automotriz",
    personaMeta: "técnico en mecánica automotriz",
    nombreCorto: "Téc. en Mecánica Automotriz",
  },
  "tecnico-en-mecanica-industrial": {
    persona: "técnico en mecánica industrial",
    nombreCorto: "Técnico en Mecánica Industrial",
  },
  "tecnico-en-instrumentacion-automatizacion-y-control-industrial": {
    persona: "técnico en automatización",
    nombreCorto: "Técnico en Automatización",
  },
  "tecnico-en-refrigeracion-y-climatizacion": {
    persona: "técnico en climatización",
    nombreCorto: "Técnico en Climatización",
  },
  "tecnico-en-energia": {
    persona: "técnico en energía",
  },
  "tecnico-en-telecomunicaciones": {
    persona: "técnico en telecomunicaciones",
    nombreCorto: "Téc. en Telecomunicaciones",
  },
  "tecnico-en-metalurgia": {
    persona: "técnico en metalurgia",
  },
  "tecnico-en-mineria": {
    persona: "técnico en minería",
  },
  "tecnico-en-geomineria": {
    persona: "técnico en geominería",
  },
  "tecnico-en-geologia": {
    persona: "técnico en geología",
  },
  "tecnico-en-topografia": {
    persona: "técnico en topografía",
  },
  "tecnico-en-dibujo-arquitectonico": {
    persona: "dibujante arquitectónico",
    nombreCorto: "Dibujo Arquitectónico",
  },
  "tecnico-en-quimica-analisis-e-industrial": {
    persona: "técnico químico",
    nombreCorto: "Técnico en Química",
  },
  "tecnico-en-alimentos": {
    persona: "técnico en alimentos",
  },
  "tecnico-agropecuario": {
    persona: "técnico agropecuario",
  },
  "tecnico-en-acuicultura-y-pesca": {
    persona: "técnico en acuicultura",
    nombreCorto: "Técnico en Acuicultura",
  },
  "tecnico-en-gastronomia-y-cocina": {
    persona: "técnico en gastronomía",
    nombreCorto: "Técnico en Gastronomía",
  },
  "tecnico-en-turismo-y-hoteleria": {
    persona: "técnico en turismo",
    nombreCorto: "Técnico en Turismo",
  },
  "tecnico-en-deporte-recreacion-y-preparacion-fisica": {
    persona: "preparador físico",
    nombreCorto: "Preparación Física",
  },
  "tecnico-en-peluqueria-y-estetica": {
    persona: "esteticista",
    nombreCorto: "Peluquería y Estética",
  },
  "tecnico-en-diseno-grafico": {
    persona: "técnico en diseño gráfico",
    nombreCorto: "Téc. en Diseño Gráfico",
  },
  "tecnico-en-produccion-grafica-y-multimedia": {
    nombreCorto: "Producción Gráfica y Multimedia",
  },
  "tecnico-en-comunicacion-audiovisual": {
    nombreCorto: "Téc. Comunicación Audiovisual",
  },
  "tecnico-en-sonido": {
    persona: "técnico en sonido",
  },
  "tecnico-en-traduccion-e-interpretariado": {
    nombreCorto: "Téc. en Traducción",
  },
  "secretariado-bilingue": {
    persona: "secretaria bilingüe",
    articulo: "una",
    nombreCorto: "Secretariado Bilingüe",
  },
};

export function nombreCortoCarrera(carrera: Pick<CarreraRecord, "slug" | "nombre">): string {
  return CARRERAS_SEO_MAPA[carrera.slug]?.nombreCorto ?? carrera.nombre;
}

export function tituloFichaCarreraConFormato(
  carrera: Pick<CarreraRecord, "slug" | "nombre">
): { title: string; formato: 1 | 2 | 3 | 4 | 5 | "override" } {
  const cfg = CARRERAS_SEO_MAPA[carrera.slug] ?? {};
  const ano = ANO_EDICION_CARRERAS;

  if (cfg.titleOverride && cfg.titleOverride.length <= 60) {
    return { title: cfg.titleOverride, formato: "override" };
  }

  if (cfg.persona) {
    const art = cfg.articulo ?? "un";
    const f1 = `¿Cuánto gana ${art} ${cfg.persona} en Chile? Sueldo ${ano}`;
    if (f1.length <= 60) {
      return { title: f1, formato: 1 };
    }
    const f2 = `¿Cuánto gana ${art} ${cfg.persona} en Chile?`;
    if (f2.length <= 60) {
      return { title: f2, formato: 2 };
    }
  }

  const nombre = nombreCortoCarrera(carrera);
  const f3 = `Sueldo de ${nombre} en Chile ${ano}`;
  if (f3.length <= 60) {
    return { title: f3, formato: 3 };
  }

  const f4 = `${nombre}: sueldo en Chile ${ano}`;
  if (f4.length <= 60) {
    return { title: f4, formato: 4 };
  }

  const f5 = `Sueldo de ${nombre} en Chile`;
  return { title: f5, formato: 5 };
}
