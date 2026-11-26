import {
  getFichasCarrerasCo,
  medianaNivelCo,
  posicionEnNivelCo,
} from "./carreras";
import {
  enteroCo,
  millonesCortoCo,
  nombreProgramaCo,
  pesosCo,
  plural,
  porcentajeCo,
  smmlvCo,
} from "./formato";
import type { CarreraCo } from "./types";

export interface PreguntaFaqCo {
  pregunta: string;
  respuesta: string;
}

function truncarTitulo(texto: string, max = 60): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= max) return limpio;
  let corte = limpio.slice(0, max).trim();
  const ultimoEspacio = corte.lastIndexOf(" ");
  if (ultimoEspacio >= Math.floor(max * 0.55)) {
    corte = corte.slice(0, ultimoEspacio);
  }
  return corte.replace(/[\s:;,.\-–—|]+$/, "");
}

/** Título SEO para ficha de carrera (siempre <= 60 caracteres). */
export function tituloFichaCo(carrera: CarreraCo): string {
  const nombre = nombreProgramaCo(carrera.programa);
  const conMarca = `${nombre}: salario en Colombia | ProgramBI`;
  if (conMarca.length <= 60) return conMarca;

  const sinMarca = `${nombre}: salario en Colombia`;
  if (sinMarca.length <= 60) return sinMarca;

  const corto = `Cuánto gana ${nombre} en Colombia`;
  if (corto.length <= 60) return corto;

  return truncarTitulo(`${nombre} en Colombia | ProgramBI`, 60);
}

/** H1 visible de la ficha individual de carrera. */
export function h1FichaCo(carrera: CarreraCo): string {
  const nombre = nombreProgramaCo(carrera.programa);
  return `Cuánto gana un graduado de ${nombre} en Colombia`;
}

/** Meta description (130–155 caracteres) sin términos prohibidos. */
export function metaFichaCo(carrera: CarreraCo): string {
  const nombre = nombreProgramaCo(carrera.programa);
  const medCop = millonesCortoCo(carrera.mediana_cop_2026);
  const medSmmlv = smmlvCo(carrera.mediana_smmlv).replace("\u00a0", " ");
  const pct4 = porcentajeCo(carrera.pct_4plus_smmlv).replace("\u00a0", " ");
  const grad = enteroCo(carrera.graduados_cotizantes);

  const candidata1 = `${nombre} en Colombia: mediana de ${medCop} (${medSmmlv}) y ${pct4} con 4+ SMMLV entre ${grad} graduados cotizantes OLE.`;
  if (candidata1.length <= 155) return candidata1;

  const candidata2 = `${nombre}: mediana de ${medCop} (${medSmmlv}) y ${pct4} con 4+ SMMLV en ${grad} cotizantes OLE.`;
  if (candidata2.length <= 155) return candidata2;

  return truncarTitulo(candidata2, 154) + ".";
}

/**
 * Narrativa única por programa con posición en su nivel, comparación frente
 * a la mediana del nivel, porcentaje >=4 SMMLV, número de IES y graduados SNIES 2025.
 */
export function narrativaUnicaFichaCo(carrera: CarreraCo): string[] {
  const nombre = nombreProgramaCo(carrera.programa);
  const pos = posicionEnNivelCo(carrera.slug);
  const medNivel = medianaNivelCo(carrera.nivel_formacion);
  const medSmmlv = smmlvCo(carrera.mediana_smmlv);
  const medCop = pesosCo(carrera.mediana_cop_2026);
  const pct4 = porcentajeCo(carrera.pct_4plus_smmlv);
  const grad = enteroCo(carrera.graduados_cotizantes);

  const parrafos: string[] = [];

  if (pos) {
    const diff = carrera.mediana_smmlv - medNivel.mediana_smmlv;
    const comparacion =
      Math.abs(diff) < 0.05
        ? `en línea con la mediana de su nivel (${smmlvCo(medNivel.mediana_smmlv)})`
        : diff > 0
          ? `${smmlvCo(diff)} por encima de la mediana de ${carrera.nivel_formacion} (${smmlvCo(medNivel.mediana_smmlv)})`
          : `${smmlvCo(Math.abs(diff))} por debajo de la mediana de ${carrera.nivel_formacion} (${smmlvCo(medNivel.mediana_smmlv)})`;

    parrafos.push(
      `En la cohorte 2020–2022 (seguimiento 2023 del OLE), ${nombre} ocupa el puesto ${pos.posicion} de ${pos.total} programas de nivel ${carrera.nivel_formacion}, con una mediana interpolada de ${medSmmlv} (${medCop} a valores de SMMLV 2026), ubicada ${comparacion}.`
    );
  } else {
    parrafos.push(
      `En la cohorte 2020–2022 (seguimiento 2023 del OLE), ${nombre} registra una mediana interpolada de ${medSmmlv} (${medCop} a valores de SMMLV 2026) en el nivel ${carrera.nivel_formacion}.`
    );
  }

  const parteSnies = carrera.snies_2025
    ? ` En el registro SNIES 2025, este programa reportó ${enteroCo(carrera.snies_2025.graduados_2025)} graduados en ${plural(carrera.snies_2025.n_ies, "institución", "instituciones")}.`
    : "";

  parrafos.push(
    `De sus ${grad} graduados cotizantes en seguridad social distribuidos en ${plural(carrera.n_ies, "institución", "instituciones")} de educación superior, el ${pct4} percibe 4 SMMLV o más.${parteSnies}`
  );

  if (carrera.sector_ies) {
    const { oficial, privado } = carrera.sector_ies;
    parrafos.push(
      `Por sector de origen, las instituciones oficiales (${enteroCo(oficial.n_ies)} IES, ${enteroCo(oficial.graduados_cotizantes)} cotizantes) registran una mediana de ${smmlvCo(oficial.mediana_smmlv)} (${pesosCo(oficial.mediana_cop_2026)}), frente a ${smmlvCo(privado.mediana_smmlv)} (${pesosCo(privado.mediana_cop_2026)}) en las privadas (${enteroCo(privado.n_ies)} IES, ${enteroCo(privado.graduados_cotizantes)} cotizantes).`
    );
  }

  return parrafos;
}

/** Preguntas frecuentes únicas por ficha de carrera. */
export function faqsFichaCo(carrera: CarreraCo): PreguntaFaqCo[] {
  const nombre = nombreProgramaCo(carrera.programa);
  const medSmmlv = smmlvCo(carrera.mediana_smmlv);
  const medCop = pesosCo(carrera.mediana_cop_2026);
  const pct4 = porcentajeCo(carrera.pct_4plus_smmlv);
  const grad = enteroCo(carrera.graduados_cotizantes);

  const faqs: PreguntaFaqCo[] = [
    {
      pregunta: `¿Cuánto gana un graduado de ${nombre} en Colombia?`,
      respuesta: `Según el seguimiento 2023 del Observatorio Laboral para la Educación (OLE) sobre la cohorte 2020–2022, la mediana interpolada de ingreso de ${nombre} es de ${medSmmlv}, equivalente a ${medCop} con el SMMLV 2026 ($1.750.905).`,
    },
    {
      pregunta: `¿Qué porcentaje gana 4 SMMLV o más en ${nombre}?`,
      respuesta: `Entre los ${grad} graduados cotizantes en seguridad social observados por el OLE en ${plural(carrera.n_ies, "institución", "instituciones")}, el ${pct4} se ubica en los tramos de 4 SMMLV o superiores ($7.003.620 o más a valores de 2026).`,
    },
  ];

  if (carrera.sector_ies) {
    const { oficial, privado } = carrera.sector_ies;
    faqs.push({
      pregunta: `¿Hay diferencia salarial entre universidades oficiales y privadas en ${nombre}?`,
      respuesta: `En las IES con al menos 30 graduados cotizantes, el sector oficial promedia una mediana de ${smmlvCo(oficial.mediana_smmlv)} (${pesosCo(oficial.mediana_cop_2026)}) y el sector privado ${smmlvCo(privado.mediana_smmlv)} (${pesosCo(privado.mediana_cop_2026)}).`,
    });
  }

  if (carrera.snies_2025) {
    faqs.push({
      pregunta: `¿Cuántos estudiantes se graduaron de ${nombre} en 2025?`,
      respuesta: `De acuerdo con el SNIES del Ministerio de Educación Nacional, en 2025 se registraron ${enteroCo(carrera.snies_2025.graduados_2025)} graduados de ${nombre} (${carrera.nivel_formacion}) en ${plural(carrera.snies_2025.n_ies, "institución", "instituciones")}.`,
    });
  }

  faqs.push({
    pregunta: "¿Cómo se calcula la mediana salarial del OLE?",
    respuesta:
      "El OLE publica los ingresos de cotizantes en 7 rangos de SMMLV. La mediana se interpola de forma lineal dentro del tramo que contiene al percentil 50 (cerrando el tramo abierto «Más de 9 SMMLV» en 12 solo para interpolar) y se expresa en pesos con el SMMLV 2026 ($1.750.905).",
  });

  return faqs;
}

/**
 * Devuelve entre 3 y 5 carreras relacionadas dentro de las 354 fichas
 * del mismo `nivel_formacion`, priorizando misma `area_conocimiento` y
 * cercanía en `mediana_smmlv`.
 */
export function relacionadasFichaCo(carrera: CarreraCo, limite = 4): CarreraCo[] {
  const tope = Math.min(5, Math.max(3, limite));
  const candidatas = getFichasCarrerasCo().filter(
    (p) => p.slug !== carrera.slug && p.nivel_formacion === carrera.nivel_formacion
  );

  return candidatas
    .slice()
    .sort((a, b) => {
      const mismaAreaA = a.area_conocimiento === carrera.area_conocimiento ? 0 : 1;
      const mismaAreaB = b.area_conocimiento === carrera.area_conocimiento ? 0 : 1;
      if (mismaAreaA !== mismaAreaB) return mismaAreaA - mismaAreaB;
      const diffA = Math.abs(a.mediana_smmlv - carrera.mediana_smmlv);
      const diffB = Math.abs(b.mediana_smmlv - carrera.mediana_smmlv);
      return diffA - diffB || b.graduados_cotizantes - a.graduados_cotizantes;
    })
    .slice(0, tope);
}
