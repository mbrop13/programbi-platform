import { entero, porcentajeTexto, solesTexto } from "./formato";
import type { CarreraPe } from "./types";

interface ProfesionMeta {
  articulo: "un" | "una";
  persona: string;
  nombreCorto: string;
}

const PROFESIONES_PE: Record<string, ProfesionMeta> = {
  medicina: { articulo: "un", persona: "médico", nombreCorto: "Medicina" },
  "ingenieria-minera-metalurgia-y-petroleo": {
    articulo: "un",
    persona: "ingeniero de minas",
    nombreCorto: "Ing. Minera y Metalurgia",
  },
  "ingenieria-industrial": {
    articulo: "un",
    persona: "ingeniero industrial",
    nombreCorto: "Ingeniería Industrial",
  },
  "ingenieria-mecanica": {
    articulo: "un",
    persona: "ingeniero mecánico",
    nombreCorto: "Ingeniería Mecánica",
  },
  "ingenieria-de-sistemas": {
    articulo: "un",
    persona: "ingeniero de sistemas",
    nombreCorto: "Ing. de Sistemas",
  },
  "ingenieria-civil": {
    articulo: "un",
    persona: "ingeniero civil",
    nombreCorto: "Ingeniería Civil",
  },
  enfermeria: { articulo: "una", persona: "enfermera", nombreCorto: "Enfermería" },
  "arquitectura-y-urbanismo": {
    articulo: "un",
    persona: "arquitecto",
    nombreCorto: "Arquitectura",
  },
  derecho: { articulo: "un", persona: "abogado", nombreCorto: "Derecho" },
  "educacion-primaria": {
    articulo: "un",
    persona: "profesor de primaria",
    nombreCorto: "Educación Primaria",
  },
  economia: { articulo: "un", persona: "economista", nombreCorto: "Economía" },
  "educacion-secundaria": {
    articulo: "un",
    persona: "profesor de secundaria",
    nombreCorto: "Educación Secundaria",
  },
  "negocios-internacionales": {
    articulo: "un",
    persona: "especialista en negocios internacionales",
    nombreCorto: "Negocios Internacionales",
  },
  "ecologia-y-medio-ambiente": {
    articulo: "un",
    persona: "especialista ambiental",
    nombreCorto: "Ecología y Medio Ambiente",
  },
  contabilidad: { articulo: "un", persona: "contador", nombreCorto: "Contabilidad" },
  "administracion-de-empresas": {
    articulo: "un",
    persona: "administrador de empresas",
    nombreCorto: "Administración",
  },
  agropecuaria: {
    articulo: "un",
    persona: "ingeniero agrónomo",
    nombreCorto: "Agropecuaria",
  },
  obstetricia: { articulo: "una", persona: "obstetra", nombreCorto: "Obstetricia" },
  "ciencias-de-la-comunicacion": {
    articulo: "un",
    persona: "comunicador",
    nombreCorto: "Comunicaciones",
  },
  "educacion-inicial": {
    articulo: "una",
    persona: "profesora de inicial",
    nombreCorto: "Educación Inicial",
  },
  "administracion-de-servicios-turisticos": {
    articulo: "un",
    persona: "gestor turístico",
    nombreCorto: "Turismo y Hotelería",
  },
  psicologia: { articulo: "un", persona: "psicólogo", nombreCorto: "Psicología" },
  "educacion-primaria-tecnica": {
    articulo: "un",
    persona: "técnico en educación primaria",
    nombreCorto: "Educ. Primaria Técnica",
  },
  "ingenieria-electrica": {
    articulo: "un",
    persona: "técnico electricista",
    nombreCorto: "Ing. Eléctrica Técnica",
  },
  "ingenieria-mecanica-tecnica": {
    articulo: "un",
    persona: "técnico mecánico",
    nombreCorto: "Ing. Mecánica Técnica",
  },
  "educacion-secundaria-tecnica": {
    articulo: "un",
    persona: "técnico en educación secundaria",
    nombreCorto: "Educ. Secundaria Técnica",
  },
  "ingenieria-civil-tecnica": {
    articulo: "un",
    persona: "técnico en ingeniería civil",
    nombreCorto: "Ing. Civil Técnica",
  },
  diseno: { articulo: "un", persona: "diseñador técnico", nombreCorto: "Diseño Técnico" },
  "administracion-de-servicios-turisticos-tecnica": {
    articulo: "un",
    persona: "técnico en turismo y hotelería",
    nombreCorto: "Turismo y Hotelería Técnica",
  },
  "administracion-de-empresas-tecnica": {
    articulo: "un",
    persona: "técnico en administración",
    nombreCorto: "Administración Técnica",
  },
  "ciencias-de-la-computacion": {
    articulo: "un",
    persona: "técnico en computación",
    nombreCorto: "Computación Técnica",
  },
  "contabilidad-tecnica": {
    articulo: "un",
    persona: "técnico contable",
    nombreCorto: "Contabilidad Técnica",
  },
  secretariado: { articulo: "una", persona: "secretaria ejecutiva", nombreCorto: "Secretariado" },
  "agropecuaria-tecnica": {
    articulo: "un",
    persona: "técnico agropecuario",
    nombreCorto: "Agropecuaria Técnica",
  },
  "enfermeria-tecnica": {
    articulo: "una",
    persona: "técnica en enfermería",
    nombreCorto: "Enfermería Técnica",
  },
  "tecnologia-medica": {
    articulo: "un",
    persona: "técnico en tecnología médica",
    nombreCorto: "Tecnología Médica",
  },
  "farmacia-y-bioquimica": {
    articulo: "un",
    persona: "técnico en farmacia",
    nombreCorto: "Farmacia Técnica",
  },
  "educacion-inicial-tecnica": {
    articulo: "una",
    persona: "técnica en educación inicial",
    nombreCorto: "Educ. Inicial Técnica",
  },
};

export function profesionDeCarreraPe(carrera: CarreraPe): ProfesionMeta {
  return (
    PROFESIONES_PE[carrera.slug] ?? {
      articulo: "un",
      persona: `egresado de ${carrera.nombre}`,
      nombreCorto: carrera.nombre,
    }
  );
}

function recortarTitulo60(texto: string): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= 60) return limpio;
  let corte = limpio.slice(0, 60).trim();
  const espacio = corte.lastIndexOf(" ");
  if (espacio >= 32) corte = corte.slice(0, espacio);
  return corte.replace(/[\s:;,.\-–—|]+$/, "");
}

/** Título SEO de ficha individual (siempre ≤ 60 caracteres). */
export function tituloFichaPe(carrera: CarreraPe): string {
  const prof = profesionDeCarreraPe(carrera);
  const candidatos = [
    `Cuánto gana ${prof.articulo} ${prof.persona} en Perú (2026)`,
    `Sueldo de ${prof.nombreCorto} en Perú (2026) | ProgramBI`,
    `Sueldo de ${prof.nombreCorto} en Perú (2026)`,
    `${prof.nombreCorto}: sueldo en Perú 2026`,
  ];
  for (const c of candidatos) {
    if (c.length <= 60) return c;
  }
  return recortarTitulo60(candidatos[candidatos.length - 1]);
}

export function h1FichaPe(carrera: CarreraPe): { titulo: string; subtitulo: string } {
  const prof = profesionDeCarreraPe(carrera);
  const nivel = carrera.tipo === "universitaria" ? "carrera universitaria" : "carrera técnica";
  return {
    titulo: `Cuánto gana ${prof.articulo} ${prof.persona} en Perú`,
    subtitulo: `${carrera.nombre} (${nivel}, código INEI ${carrera.codigoInei}) — ingresos reales ENAHO y planilla MTPE`,
  };
}

export function narrativaUnicaFichaPe(carrera: CarreraPe): string[] {
  const nivelTexto = carrera.tipo === "universitaria" ? "universitaria" : "técnica superior";
  const medStr = solesTexto(carrera.enaho.mediana);
  const p25Str = solesTexto(carrera.enaho.p25);
  const p75Str = solesTexto(carrera.enaho.p75);
  const ocupStr = porcentajeTexto(carrera.enaho.pctOcupados);
  const pensionStr = porcentajeTexto(carrera.enaho.pctPension);

  const p1 = `Según el pool 2022–2024 de la ENAHO (INEI, n = ${entero(carrera.enaho.nConIngreso)} egresados con ingreso entre 25 y 40 años), la ${nivelTexto} de ${carrera.nombre} registra una mediana mensual de ${medStr}, con un rango intercuartílico entre ${p25Str} (P25) y ${p75Str} (P75). En el mercado laboral peruano, el ${ocupStr} de sus egresados se encuentra ocupado y el ${pensionStr} aporta a un sistema de pensiones.`;

  const partesMtpe: string[] = [];
  if (carrera.mtpe.nacional !== null) {
    partesMtpe.push(
      `En la Planilla Electrónica formal privada del MTPE (jóvenes de 18 a 29 años, nov-2022 a oct-2023), el promedio nacional alcanza ${solesTexto(carrera.mtpe.nacional)}${carrera.mtpe.lima !== null ? ` y en Lima llega a ${solesTexto(carrera.mtpe.lima)}` : ""}.`,
    );
  }
  if (carrera.mtpe.topDepartamentos.length > 0) {
    const top1 = carrera.mtpe.topDepartamentos[0];
    partesMtpe.push(
      `Entre los departamentos con dato publicado por MTPE, destaca ${top1.nombreDepartamento} con un promedio de ${solesTexto(top1.promedio)}.`,
    );
  }
  if (carrera.mtpe.nacional !== null) {
    partesMtpe.push(
      `A diferencia de ENAHO —que mide la mediana total de egresados de 25 a 40 años en empleo formal e independiente—, el registro MTPE refleja el promedio de jóvenes en planilla privada formal.`,
    );
  }

  const partesOferta: string[] = [];
  if (carrera.sunedu && carrera.sunedu.totalUniversidades > 0) {
    partesOferta.push(
      `De acuerdo con el padrón de programas de SUNEDU (corte 28-08-2024), existen ${entero(carrera.sunedu.totalUniversidades)} universidades licenciadas que ofrecen programas de pregrado afines a esta familia.`,
    );
  }
  if (carrera.edo2026) {
    partesOferta.push(
      `En la Encuesta de Demanda Ocupacional (EDO 2026) del MTPE, la familia «${carrera.edo2026.familia}» figura entre las más demandadas con ${entero(carrera.edo2026.puestos)} puestos proyectados.`,
    );
  }

  const parrafos = [p1];
  if (partesMtpe.length > 0) parrafos.push(partesMtpe.join(" "));
  if (partesOferta.length > 0) parrafos.push(partesOferta.join(" "));
  return parrafos;
}

export function faqsFichaPe(carrera: CarreraPe): { pregunta: string; respuesta: string }[] {
  const prof = profesionDeCarreraPe(carrera);
  const medStr = solesTexto(carrera.enaho.mediana);
  const p25Str = solesTexto(carrera.enaho.p25);
  const p75Str = solesTexto(carrera.enaho.p75);
  const ocupStr = porcentajeTexto(carrera.enaho.pctOcupados);
  const pensionStr = porcentajeTexto(carrera.enaho.pctPension);

  const faqs: { pregunta: string; respuesta: string }[] = [
    {
      pregunta: `¿Cuánto gana ${prof.articulo} ${prof.persona} en Perú?`,
      respuesta: `La mediana de ingreso laboral mensual para egresados completos de 25 a 40 años es ${medStr} (soles de 2024 deflactados con IPC de Lima, ENAHO 2022–2024). El 25 % de menores ingresos parte en ${p25Str} y el 25 % superior supera ${p75Str}.`,
    },
    {
      pregunta: `¿Qué porcentaje de egresados de ${carrera.nombre} está ocupado y aporta a pensión?`,
      respuesta: `En la muestra ENAHO 2022–2024 (25 a 40 años), el ${ocupStr} se encuentra ocupado y el ${pensionStr} registra afiliación a un sistema de pensiones (AFP u ONP), indicador utilizado como referencia de formalidad laboral.`,
    },
  ];

  if (carrera.mtpe.nacional !== null) {
    faqs.push({
      pregunta: `¿Cuánto paga la planilla formal privada a jóvenes en ${carrera.nombre}?`,
      respuesta: `Según MTPE-DISEL (nov-2022 a oct-2023, jóvenes de 18 a 29 años en planilla privada formal), el sueldo promedio nacional es ${solesTexto(carrera.mtpe.nacional)}${carrera.mtpe.lima !== null ? ` y en Lima es ${solesTexto(carrera.mtpe.lima)}` : ""}.`,
    });
  }

  if (carrera.sunedu && carrera.sunedu.totalUniversidades > 0) {
    faqs.push({
      pregunta: `¿Cuántas universidades licenciadas ofrecen ${carrera.nombre} en Perú?`,
      respuesta: `Según el registro de programas académicos de SUNEDU (corte agosto 2024), hay ${entero(carrera.sunedu.totalUniversidades)} universidades licenciadas con programas de pregrado en esta familia de carrera.`,
    });
  } else {
    faqs.push({
      pregunta: `¿Qué puesto ocupa ${carrera.nombre} en el ranking de carreras técnicas?`,
      respuesta: `Ocupa el puesto #${carrera.rankNivel} entre las 16 carreras técnicas publicables en Perú y el puesto #${carrera.rankGeneral} en el ranking general de 38 carreras.`,
    });
  }

  return faqs;
}

export function relacionadasFichaPe(carrera: CarreraPe, todas: readonly CarreraPe[], limite = 6): CarreraPe[] {
  const resultado: CarreraPe[] = [];
  const vistos = new Set<string>([carrera.slug]);

  if (carrera.slugHermana) {
    const hermana = todas.find((c) => c.slug === carrera.slugHermana);
    if (hermana) {
      resultado.push(hermana);
      vistos.add(hermana.slug);
    }
  }

  const candidatas = todas
    .filter((c) => !vistos.has(c.slug))
    .sort((a, b) => {
      const mismoNivelA = a.tipo === carrera.tipo ? 0 : 1;
      const mismoNivelB = b.tipo === carrera.tipo ? 0 : 1;
      if (mismoNivelA !== mismoNivelB) return mismoNivelA - mismoNivelB;
      return (
        Math.abs(a.enaho.mediana - carrera.enaho.mediana) - Math.abs(b.enaho.mediana - carrera.enaho.mediana)
      );
    });

  for (const c of candidatas) {
    if (resultado.length >= limite) break;
    resultado.push(c);
  }

  return resultado;
}
