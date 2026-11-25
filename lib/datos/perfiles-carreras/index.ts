import type { CarreraRecord } from "@/lib/datos/carreras";
import type { ContextoComparativoFicha } from "@/lib/datos/textos-carreras";
import { anosDesdeSemestres, pesos, porcentaje } from "@/lib/datos/formato";
import { profesionDeCarrera } from "@/lib/datos/carreras-profesion";
import type { PerfilCarrera } from "./tipos";
import { perfilesParte1 } from "./parte-1";
import { perfilesParte2 } from "./parte-2";
import { perfilesParte3 } from "./parte-3";
import { perfilesParte4 } from "./parte-4";

export type { PerfilCarrera } from "./tipos";

const PERFILES: Record<string, PerfilCarrera> = {
  ...perfilesParte1,
  ...perfilesParte2,
  ...perfilesParte3,
  ...perfilesParte4,
};

export function getPerfilCarrera(slug: string): PerfilCarrera | null {
  return PERFILES[slug] ?? null;
}

/** «un/a ingeniero/a civil informático» o «quien estudia Diseño Gráfico». */
export function sujetoCarrera(carrera: Pick<CarreraRecord, "slug" | "nombre">): string {
  const prof = profesionDeCarrera(carrera.slug);
  return prof ? `un/a ${prof}` : `quien estudia ${carrera.nombre}`;
}

/** Primera letra en minúscula, para encadenar «Te gusta…» dentro de una frase. */
function enFrase(texto: string): string {
  const limpio = texto.trim().replace(/[.;]\s*$/, "");
  return limpio.charAt(0).toLowerCase() + limpio.slice(1);
}

function lista(items: string[]): string {
  const limpios = items.map((i) => enFrase(i));
  if (limpios.length <= 1) return limpios.join("");
  return `${limpios.slice(0, -1).join(", ")} y ${limpios.at(-1)}`;
}

export type PreguntaPerfil = { pregunta: string; respuesta: string };

/**
 * Preguntas de decisión («¿Debería estudiar…?», «¿Qué hace…?») armadas con el
 * perfil cualitativo y las cifras oficiales de la ficha. Se suman a las
 * preguntas de datos existentes, en pantalla y en el JSON-LD FAQPage.
 */
export function preguntasPerfilCarrera(
  carrera: CarreraRecord,
  ctx: ContextoComparativoFicha,
  perfil: PerfilCarrera
): PreguntaPerfil[] {
  const { data } = ctx;
  const sujeto = sujetoCarrera(carrera);
  const cifras: string[] = [];
  if (data.ing[3]) cifras.push(`al cuarto año de titulación el ingreso promedio es de ${pesos(data.ing[3])} brutos`);
  if (data.emp1 !== null)
    cifras.push(
      `al primer año, ${porcentaje(data.emp1)} de los titulados percibe ingresos iguales o superiores al sueldo mínimo`
    );
  if (data.dur_real) cifras.push(`la duración real promedio es de ${anosDesdeSemestres(data.dur_real)}`);

  const partes = [
    `Si ${lista(perfil.paraQuien.slice(0, 2))}, ${carrera.nombre} es una buena opción para evaluar.`,
  ];
  if (perfil.noEsParaTi[0]) partes.push(`Quizás no sea para ti ${enFrase(perfil.noEsParaTi[0])}.`);
  if (cifras.length > 0) partes.push(`En cifras oficiales de mifuturo.cl: ${cifras.join("; ")}.`);
  const deberia = partes.join(" ");

  return [
    { pregunta: `¿Debería estudiar ${carrera.nombre}?`, respuesta: deberia },
    { pregunta: `¿Qué hace ${sujeto}?`, respuesta: perfil.queHace },
    {
      pregunta: `¿Dónde trabaja ${sujeto}?`,
      respuesta: `Suele trabajar en ${lista(perfil.dondeTrabaja)}.`,
    },
    {
      pregunta: `¿Qué ramos tiene la carrera de ${carrera.nombre}?`,
      respuesta: `Entre los ramos habituales de la malla están ${lista(perfil.ramos)}. Cada institución define su propia malla.`,
    },
  ];
}
