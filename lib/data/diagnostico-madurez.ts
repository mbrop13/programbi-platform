/**
 * Diagnóstico de madurez de datos — herramienta B2B de /empresas/diagnostico.
 *
 * 10 preguntas de práctica real (no de conocimiento técnico), cada una con 4
 * opciones que suman 0 a 3 puntos. El puntaje total va de 0 a 30 y define el
 * nivel de madurez del equipo. Los cursos recomendados usan slugs que ya
 * existen en `lib/data/courses.ts`.
 *
 * Sin cifras de mercado: los textos describen prácticas internas, no
 * estadísticas de la industria.
 */

export type DiagnosticoAreaId =
  | "fuentes"
  | "herramientas"
  | "reportes"
  | "automatizacion"
  | "equipo";

export type PuntosDiagnostico = 0 | 1 | 2 | 3;

export type DiagnosticoOpcion = {
  /** Texto visible de la alternativa. */
  texto: string;
  /** 0 = práctica inicial, 3 = práctica madura. */
  puntos: PuntosDiagnostico;
};

export type DiagnosticoPregunta = {
  id: string;
  area: DiagnosticoAreaId;
  pregunta: string;
  /** Aclaración corta de qué se está midiendo. */
  ayuda?: string;
  /** Siempre 4 opciones, ordenadas de menor a mayor madurez. */
  opciones: readonly [
    DiagnosticoOpcion,
    DiagnosticoOpcion,
    DiagnosticoOpcion,
    DiagnosticoOpcion,
  ];
};

export type DiagnosticoArea = {
  id: DiagnosticoAreaId;
  nombre: string;
  descripcion: string;
  /** Puntaje máximo del área (3 puntos por pregunta). */
  max: number;
};

export type CursoDiagnosticoSlug =
  | "excel"
  | "power-bi"
  | "sql-server"
  | "python"
  | "power-automate"
  | "analisis-de-datos";

export type DiagnosticoNivel = {
  id: "inicial" | "en-desarrollo" | "intermedio" | "avanzado";
  nombre: string;
  /** Rango inclusivo de puntaje sobre 30. */
  min: number;
  max: number;
  descripcion: string;
  recomendacion: string;
  cursos: readonly CursoDiagnosticoSlug[];
};

export type DiagnosticoEstadoArea = "fortaleza" | "en-proceso" | "brecha";

export type DiagnosticoAreaResultado = DiagnosticoArea & {
  puntos: number;
  /** puntos / max, entre 0 y 1. */
  ratio: number;
  estado: DiagnosticoEstadoArea;
};

export type DiagnosticoResultado = {
  puntos: number;
  total: number;
  nivel: DiagnosticoNivel;
  areas: readonly DiagnosticoAreaResultado[];
  fortalezas: readonly DiagnosticoAreaResultado[];
  brechas: readonly DiagnosticoAreaResultado[];
  enProceso: readonly DiagnosticoAreaResultado[];
};

export const DIAGNOSTICO_TOTAL = 30;

/** Las 5 áreas suman 30 puntos (3 puntos por pregunta). */
export const DIAGNOSTICO_AREAS: readonly DiagnosticoArea[] = [
  {
    id: "fuentes",
    nombre: "Fuentes y calidad de datos",
    descripcion:
      "De dónde salen los datos, si hay una sola definición y quién puede consultarlos.",
    max: 9,
  },
  {
    id: "herramientas",
    nombre: "Herramientas de análisis",
    descripcion:
      "Cuánto pesa Excel como reporte final y cuánto entró Power BI en la rutina.",
    max: 6,
  },
  {
    id: "reportes",
    nombre: "Reportes y tiempo del equipo",
    descripcion:
      "Cada cuánto se actualiza el reporte y cuántas horas se van en armarlo.",
    max: 6,
  },
  {
    id: "automatizacion",
    nombre: "Automatización",
    descripcion:
      "Qué parte de la cadena de reportes corre sin intervención manual.",
    max: 3,
  },
  {
    id: "equipo",
    nombre: "Equipo y decisiones",
    descripcion:
      "Qué puede hacer el equipo solo y cuánto pesan los datos al decidir.",
    max: 6,
  },
];

export const DIAGNOSTICO_PREGUNTAS: readonly DiagnosticoPregunta[] = [
  {
    id: "fuentes-reporte",
    area: "fuentes",
    pregunta: "¿De dónde salen los datos con los que reporta el equipo?",
    ayuda: "Piensa en el reporte que más se usa, no en el caso ideal.",
    opciones: [
      {
        texto: "De planillas que arma cada área a mano, y cada una tiene su versión.",
        puntos: 0,
      },
      {
        texto: "De varias planillas y sistemas que alguien junta manualmente cada vez.",
        puntos: 1,
      },
      {
        texto: "De los sistemas de la empresa, pero cada área extrae y ordena lo suyo.",
        puntos: 2,
      },
      {
        texto: "De sistemas conectados a un modelo común; nadie rehace la extracción.",
        puntos: 3,
      },
    ],
  },
  {
    id: "excel-vs-bi",
    area: "herramientas",
    pregunta: "¿Cómo conviven hoy Excel y una herramienta de BI?",
    ayuda: "BI es Power BI u otra herramienta de tableros, no una planilla con gráficos.",
    opciones: [
      {
        texto: "Todo se arma en Excel; no hay herramienta de BI en uso.",
        puntos: 0,
      },
      {
        texto: "Hay Power BI, pero los reportes que se usan siguen siendo planillas.",
        puntos: 1,
      },
      {
        texto: "Se complementan: Excel para trabajo puntual, Power BI para reportes.",
        puntos: 2,
      },
      {
        texto: "El reporte oficial vive en BI; Excel queda para análisis ad hoc.",
        puntos: 3,
      },
    ],
  },
  {
    id: "frecuencia-reportes",
    area: "reportes",
    pregunta: "¿Cada cuánto se actualizan los reportes que mira la dirección?",
    opciones: [
      {
        texto: "Solo cuando alguien los pide; no hay frecuencia fija.",
        puntos: 0,
      },
      {
        texto: "Una vez al mes, a mano, y a veces se atrasa.",
        puntos: 1,
      },
      {
        texto: "Cada semana, con un proceso definido que alguien ejecuta.",
        puntos: 2,
      },
      {
        texto: "A diario o en vivo desde el sistema, sin intervención manual.",
        puntos: 3,
      },
    ],
  },
  {
    id: "tiempo-reportes",
    area: "reportes",
    pregunta: "¿Cuánto tiempo se va el equipo armando reportes cada semana?",
    opciones: [
      {
        texto: "Más de un día completo por persona.",
        puntos: 0,
      },
      {
        texto: "Entre medio día y un día completo por persona.",
        puntos: 1,
      },
      {
        texto: "Un par de horas; la mayor parte ya está resuelta.",
        puntos: 2,
      },
      {
        texto: "Menos de una hora; se revisa el tablero, no se arma desde cero.",
        puntos: 3,
      },
    ],
  },
  {
    id: "una-sola-verdad",
    area: "fuentes",
    pregunta: "Si dos áreas piden «las ventas de marzo», ¿qué pasa?",
    opciones: [
      {
        texto: "Salen números distintos y hay que decidir cuál vale.",
        puntos: 0,
      },
      {
        texto: "Coinciden si se ponen de acuerdo, pero cada uno tiene su planilla.",
        puntos: 1,
      },
      {
        texto: "Hay una definición acordada y un lugar donde consultarla.",
        puntos: 2,
      },
      {
        texto: "Hay una sola fuente con métricas definidas y documentadas.",
        puntos: 3,
      },
    ],
  },
  {
    id: "uso-power-bi",
    area: "herramientas",
    pregunta: "¿Qué tanto se usa Power BI (u otra herramienta de BI) en la empresa?",
    opciones: [
      {
        texto: "Nada: no hay licencia ni tableros.",
        puntos: 0,
      },
      {
        texto: "Hay licencias, pero casi nadie los abre.",
        puntos: 1,
      },
      {
        texto: "Un área lo usa a diario; el resto pide capturas o PDFs.",
        puntos: 2,
      },
      {
        texto: "Varias áreas entran al tablero y filtran por su cuenta.",
        puntos: 3,
      },
    ],
  },
  {
    id: "sql-bases",
    area: "fuentes",
    pregunta: "¿Cómo llega el equipo a las bases de datos para sacar información?",
    opciones: [
      {
        texto: "Nadie consulta la base: todo llega por exportaciones.",
        puntos: 0,
      },
      {
        texto: "Una persona sabe hacer consultas y el resto le pide a ella.",
        puntos: 1,
      },
      {
        texto: "Varias personas escriben consultas simples con filtros y joins.",
        puntos: 2,
      },
      {
        texto: "El equipo modela, documenta y mantiene sus propias vistas.",
        puntos: 3,
      },
    ],
  },
  {
    id: "automatizacion-cadena",
    area: "automatizacion",
    pregunta: "¿Qué parte de la cadena de reportes corre sola?",
    opciones: [
      {
        texto: "Nada: se copia, pega y ordena a mano.",
        puntos: 0,
      },
      {
        texto: "Algunas macros de Excel o tareas puntuales.",
        puntos: 1,
      },
      {
        texto: "La carga de datos y el refresco del tablero están programados.",
        puntos: 2,
      },
      {
        texto: "La cadena completa corre sola y avisa cuando algo falla.",
        puntos: 3,
      },
    ],
  },
  {
    id: "habilidades-equipo",
    area: "equipo",
    pregunta: "¿Qué puede hacer el equipo hoy sin apoyo externo?",
    opciones: [
      {
        texto: "Abrir el archivo y leer el número que le pasaron.",
        puntos: 0,
      },
      {
        texto: "Armar tablas dinámicas y fórmulas básicas en Excel.",
        puntos: 1,
      },
      {
        texto: "Conectar datos, armar un tablero y explicar qué muestra.",
        puntos: 2,
      },
      {
        texto: "Modelar datos, escribir consultas y enseñarle al resto.",
        puntos: 3,
      },
    ],
  },
  {
    id: "decisiones-con-datos",
    area: "equipo",
    pregunta: "¿Cómo se usan los datos en las decisiones del mes?",
    opciones: [
      {
        texto: "Casi no se usan: pesa la experiencia o la urgencia.",
        puntos: 0,
      },
      {
        texto: "Se piden números cuando hay una discusión, a último minuto.",
        puntos: 1,
      },
      {
        texto: "Cada área lleva sus indicadores a la reunión mensual.",
        puntos: 2,
      },
      {
        texto: "Se decide sobre un tablero con indicadores acordados.",
        puntos: 3,
      },
    ],
  },
];

export const DIAGNOSTICO_NIVELES: readonly DiagnosticoNivel[] = [
  {
    id: "inicial",
    nombre: "Inicial",
    min: 0,
    max: 7,
    descripcion:
      "El reporte depende de planillas y del tiempo del equipo. Cada área tiene su versión y actualizar los números cuesta horas.",
    recomendacion:
      "Parte por una base común: una tabla bien estructurada, fórmulas que no se rompan y un primer tablero en Power BI con datos de la empresa. Sin esa base, cualquier herramienta nueva hereda el desorden.",
    cursos: ["excel", "power-bi"],
  },
  {
    id: "en-desarrollo",
    nombre: "En desarrollo",
    min: 8,
    max: 15,
    descripcion:
      "Ya hay herramientas y algo de práctica, pero el reporte se sigue armando a mano y las cifras no siempre coinciden entre áreas.",
    recomendacion:
      "Consolida Power BI como reporte oficial y automatiza la carga y el refresco. Definir cada métrica una sola vez evita que cada área rehaga el cálculo.",
    cursos: ["power-bi", "power-automate"],
  },
  {
    id: "intermedio",
    nombre: "Intermedio",
    min: 16,
    max: 23,
    descripcion:
      "El reporte oficial vive en BI y hay consultas propias. Falta estandarizar el modelo, documentar las métricas y cerrar la automatización.",
    recomendacion:
      "Ordena el modelo de datos y documenta las métricas en un solo lugar. Con SQL el equipo deja de depender de exportaciones, y con automatización el reporte llega sin que nadie lo arme.",
    cursos: ["power-bi", "sql-server", "power-automate"],
  },
  {
    id: "avanzado",
    nombre: "Avanzado",
    min: 24,
    max: 30,
    descripcion:
      "La empresa decide con datos y el equipo se autoabastece: consulta, modela y mantiene sus propios tableros.",
    recomendacion:
      "Profundiza el análisis con estadística y Python, y forma a quien modele para otras áreas. El foco deja de ser reportar y pasa a explicar y anticipar.",
    cursos: ["analisis-de-datos", "python"],
  },
];

/** Nivel correspondiente a un puntaje (se acota a 0–30). */
export function nivelPorPuntaje(puntos: number): DiagnosticoNivel {
  const seguro = Math.max(0, Math.min(DIAGNOSTICO_TOTAL, Math.round(puntos)));
  return (
    DIAGNOSTICO_NIVELES.find((nivel) => seguro >= nivel.min && seguro <= nivel.max) ??
    DIAGNOSTICO_NIVELES[0]
  );
}

function estadoDeArea(ratio: number): DiagnosticoEstadoArea {
  if (ratio >= 0.7) return "fortaleza";
  if (ratio < 0.4) return "brecha";
  return "en-proceso";
}

/**
 * Evalúa las respuestas del diagnóstico. `respuestas` guarda el índice de la
 * opción elegida por pregunta (null si quedó sin responder).
 */
export function evaluarDiagnostico(
  respuestas: readonly (number | null)[],
): DiagnosticoResultado {
  const puntosPorPregunta: number[] = DIAGNOSTICO_PREGUNTAS.map((pregunta, posicion) => {
    const elegida = respuestas[posicion];
    if (elegida === null || elegida === undefined) return 0;
    const opcion = pregunta.opciones[elegida];
    return opcion ? opcion.puntos : 0;
  });

  const puntos = puntosPorPregunta.reduce((total, valor) => total + valor, 0);

  const areas: DiagnosticoAreaResultado[] = DIAGNOSTICO_AREAS.map((area) => {
    const puntosArea = DIAGNOSTICO_PREGUNTAS.reduce(
      (total, pregunta, posicion) =>
        pregunta.area === area.id ? total + puntosPorPregunta[posicion] : total,
      0,
    );
    const ratio = area.max > 0 ? puntosArea / area.max : 0;
    return {
      ...area,
      puntos: puntosArea,
      ratio,
      estado: estadoDeArea(ratio),
    };
  });

  const fortalezas = areas
    .filter((area) => area.estado === "fortaleza")
    .sort((a, b) => b.ratio - a.ratio);
  const brechas = areas
    .filter((area) => area.estado === "brecha")
    .sort((a, b) => a.ratio - b.ratio);
  const enProceso = areas.filter((area) => area.estado === "en-proceso");

  return {
    puntos,
    total: DIAGNOSTICO_TOTAL,
    nivel: nivelPorPuntaje(puntos),
    areas,
    fortalezas,
    brechas,
    enProceso,
  };
}

/** Texto corto para el mensaje del lead: «fuentes y calidad de datos, automatización». */
export function textoBrechas(resultado: DiagnosticoResultado): string {
  if (resultado.brechas.length === 0) {
    return "ninguna detectada";
  }
  return resultado.brechas.map((area) => area.nombre.toLowerCase()).join(", ");
}
