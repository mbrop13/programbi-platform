import type { FilaComparativa } from "@/components/guias/TablaComparativa";
import { fichaCurso } from "@/lib/guias/curso";

/**
 * Filas honestas para comparar el curso en vivo con aprender solo o con una
 * carrera universitaria. No incluye precios de terceros: solo describe el
 * formato, el acompañamiento y el certificado.
 */
export function filasComparativa(curso: string): FilaComparativa[] {
  const ficha = fichaCurso(curso);
  return [
    {
      criterio: "Horas y ritmo",
      enVivo: `${ficha.horasTexto} con horario fijo`,
      autodidacta: "A tu ritmo, sin fecha de término",
      universidad: "Semestres y ramos de carrera",
    },
    {
      criterio: "Feedback de un profe",
      enVivo: "Sí, en cada clase y por el campus",
      autodidacta: "No (o foros)",
      universidad: "Sí, en clases y ayudantías",
    },
    {
      criterio: "Tiempo hasta aplicarlo",
      enVivo: "Semanas: sales con un tablero propio",
      autodidacta: "Depende de tu disciplina",
      universidad: "Años, con título profesional",
    },
    {
      criterio: "Certificado",
      enVivo: "Certificado de ProgramBI al completar",
      autodidacta: "No",
      universidad: "Título profesional",
    },
    {
      criterio: "Costo",
      enVivo: "Un pago por curso (o por nivel)",
      autodidacta: "Gratis, pero cuesta el tiempo",
      universidad: "Matrícula y arancel de la carrera",
    },
  ];
}
