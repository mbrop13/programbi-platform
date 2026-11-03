export type TemaTest = "sql" | "excel";

export type NivelTestId = "inicial" | "basico" | "intermedio" | "avanzado";

export type NivelTest = {
  id: NivelTestId;
  label: string;
  descripcion: string;
};

export type PreguntaTest = {
  id: string;
  pregunta: string;
  opciones: readonly string[];
  correcta: number;
  explicacion: string;
};

export type CursoRecomendado = {
  slug: string;
  nombre: string;
  motivo: string;
};

export type TestNivel = {
  tema: TemaTest;
  nombre: string;
  titulo: string;
  descripcion: string;
  curso: CursoRecomendado;
  preguntas: readonly PreguntaTest[];
};

export type ResultadoTest = {
  aciertos: number;
  total: number;
  porcentaje: number;
  nivel: NivelTest;
};

const NIVELES: NivelTest[] = [
  {
    id: "avanzado",
    label: "Avanzado",
    descripcion:
      "Manejas los conceptos con soltura. El siguiente paso es ordenar el conocimiento y aplicarlo a proyectos completos.",
  },
  {
    id: "intermedio",
    label: "Intermedio",
    descripcion:
      "Tienes una base sólida. Un curso en vivo te ayuda a cerrar brechas y practicar con casos de negocio.",
  },
  {
    id: "basico",
    label: "Básico",
    descripcion:
      "Conoces lo esencial. Conviene reforzar fundamentos y practicar antes de avanzar a temas complejos.",
  },
  {
    id: "inicial",
    label: "Inicial",
    descripcion:
      "Estás empezando. Un curso desde cero te da el orden y la práctica para ganar confianza.",
  },
];

export function calcularResultado(aciertos: number, total: number): ResultadoTest {
  const seguro = Math.max(0, Math.min(aciertos, total));
  const porcentaje = total > 0 ? Math.round((seguro / total) * 100) : 0;
  const nivel =
    porcentaje >= 90
      ? NIVELES[0]
      : porcentaje >= 70
        ? NIVELES[1]
        : porcentaje >= 40
          ? NIVELES[2]
          : NIVELES[3];

  return { aciertos: seguro, total, porcentaje, nivel };
}
