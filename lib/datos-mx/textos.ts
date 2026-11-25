import { getCarrerasPublicablesMx, getMetaCarrerasMx } from "./carreras";
import { enteroMx, pesosMx, porcentajeMx } from "./formato";
import type { CarreraMxRecord, FaqItemMx } from "./types";

const MAX_TITULO = 60;
const SUFIJO_MARCA = " | ProgramBI";

function limpiarEspacios(texto: string): string {
  return texto.replace(/\s+/g, " ").trim();
}

function acortarEnPalabra(texto: string, max: number): string {
  const limpio = limpiarEspacios(texto);
  if (limpio.length <= max) return limpio;
  let corte = limpio.slice(0, max).trim();
  const ultimoEspacio = corte.lastIndexOf(" ");
  if (ultimoEspacio >= Math.floor(max * 0.55)) {
    corte = corte.slice(0, ultimoEspacio);
  }
  return corte.replace(/[\s:;,.\-–—|]+$/, "");
}

function nombreSinPrefijoTsu(nombre: string): string {
  return nombre.replace(/^TSU\.\s+/i, "TSU en ");
}

/**
 * Título SEO (≤ 60 caracteres) con vocabulario mexicano.
 */
export function tituloFichaMx(carrera: CarreraMxRecord): string {
  const nombre = nombreSinPrefijoTsu(carrera.carrera);
  const candidatos = [
    `Cuánto gana ${nombre} en México 2026`,
    `Sueldo de ${nombre} en México 2026`,
    `${nombre}: sueldo en México 2026`,
    `${nombre} en México 2026`,
  ];

  for (const base of candidatos) {
    if (base.length + SUFIJO_MARCA.length <= MAX_TITULO) {
      return `${base}${SUFIJO_MARCA}`;
    }
  }

  for (const base of candidatos) {
    if (base.length <= MAX_TITULO) {
      return base;
    }
  }

  const disponible = MAX_TITULO - SUFIJO_MARCA.length;
  return `${acortarEnPalabra(nombre, disponible)}${SUFIJO_MARCA}`;
}

export function h1FichaMx(carrera: CarreraMxRecord): string {
  const nombre = nombreSinPrefijoTsu(carrera.carrera);
  return `Cuánto gana ${nombre} en México (2026)`;
}

export function metaFichaMx(carrera: CarreraMxRecord): string {
  const nombre = nombreSinPrefijoTsu(carrera.carrera);
  const ingreso = pesosMx(carrera.ingreso);
  const pos = carrera.posicionIngreso;
  const total = getMetaCarrerasMx().totalPublicables;
  const desocupacion =
    carrera.tasaDesocupacion !== null
      ? `, desocupación de ${porcentajeMx(carrera.tasaDesocupacion)}`
      : "";
  const informalidad =
    carrera.tasaInformalidad !== null
      ? ` e informalidad de ${porcentajeMx(carrera.tasaInformalidad)}`
      : "";

  const texto = `Ingreso mensual de ${nombre} en México: ${ingreso} (lugar #${pos ?? "-"} de ${total})${desocupacion}${informalidad}. Datos IMCO 2026.`;
  if (texto.length <= 155) return texto;
  return acortarEnPalabra(texto, 154) + ".";
}

export function narrativaUnicaFichaMx(carrera: CarreraMxRecord): string {
  const meta = getMetaCarrerasMx();
  const nombre = nombreSinPrefijoTsu(carrera.carrera);
  const pos = carrera.posicionIngreso ?? 0;
  const ingreso = carrera.ingreso ?? 0;
  const mediana = meta.medianaIngresoPublicables;
  const diffPct = mediana > 0 ? ((ingreso - mediana) / mediana) * 100 : 0;
  const comparacionMediana =
    Math.abs(diffPct) < 1
      ? `prácticamente en línea con la mediana de las ${meta.totalPublicables} carreras evaluadas (${pesosMx(mediana)})`
      : diffPct > 0
        ? `un ${Math.abs(diffPct).toFixed(1)} % por encima de la mediana de las ${meta.totalPublicables} carreras evaluadas (${pesosMx(mediana)})`
        : `un ${Math.abs(diffPct).toFixed(1)} % por debajo de la mediana de las ${meta.totalPublicables} carreras evaluadas (${pesosMx(mediana)})`;

  const partes: string[] = [
    `${nombre} ocupa la posición #${pos} de ${meta.totalPublicables} en el ranking de carreras mejor pagadas de México según IMCO Compara Carreras 2026, con un ingreso mensual promedio de ${pesosMx(ingreso)}, ${comparacionMediana}.`,
  ];

  if (carrera.tasaDesocupacion !== null && carrera.tasaInformalidad !== null) {
    partes.push(
      `En su campo laboral, presenta una tasa de desocupación de ${porcentajeMx(carrera.tasaDesocupacion)} y una tasa de informalidad de ${porcentajeMx(carrera.tasaInformalidad)}.`
    );
  } else if (carrera.tasaInformalidad !== null) {
    partes.push(
      `En su campo laboral, registra una tasa de informalidad de ${porcentajeMx(carrera.tasaInformalidad)} (la tasa de desocupación no cuenta con muestra suficiente en la ENOE para esta carrera).`
    );
  }

  if (carrera.solicitudes !== null && carrera.tasaAceptacion !== null) {
    partes.push(
      `En admisión universitaria (ANUIES), registró ${enteroMx(carrera.solicitudes)} solicitudes y una tasa de aceptación de ${porcentajeMx(carrera.tasaAceptacion, 0)}.`
    );
  }

  return partes.join(" ");
}

export function faqsFichaMx(carrera: CarreraMxRecord): FaqItemMx[] {
  const meta = getMetaCarrerasMx();
  const nombre = nombreSinPrefijoTsu(carrera.carrera);
  const faqs: FaqItemMx[] = [
    {
      pregunta: `¿Cuánto gana un/a egresado/a de ${nombre} en México en 2026?`,
      respuesta: `De acuerdo con IMCO Compara Carreras 2026 (con base en la ENOE del INEGI), el ingreso mensual promedio de ${nombre} es de ${pesosMx(carrera.ingreso)} y la mediana (Q50) es de ${pesosMx(carrera.ingresoQ50)}, ubicándola en el puesto #${carrera.posicionIngreso ?? "-"} de ${meta.totalPublicables} carreras.`,
    },
    {
      pregunta: `¿Qué tan amplio es el campo laboral de ${nombre} en México?`,
      respuesta:
        carrera.tasaDesocupacion !== null
          ? `Presenta una tasa de ocupación de ${porcentajeMx(carrera.tasaOcupacion)}, desocupación de ${porcentajeMx(carrera.tasaDesocupacion)} e informalidad de ${porcentajeMx(carrera.tasaInformalidad)}, con ${enteroMx(carrera.ocupado)} personas ocupadas en el país.`
          : `Registra ${enteroMx(carrera.ocupado)} personas ocupadas y una tasa de informalidad de ${porcentajeMx(carrera.tasaInformalidad)} según datos de la ENOE publicados por IMCO 2026.`,
    },
  ];

  if (carrera.ingresoPosgrado !== null && carrera.incrementoPosgrado !== null) {
    faqs.push({
      pregunta: `¿Conviene estudiar un posgrado en ${nombre}?`,
      respuesta: `Quienes cuentan con posgrado en ${nombre} perciben un ingreso promedio de ${pesosMx(carrera.ingresoPosgrado)} mensuales, frente a ${pesosMx(carrera.ingresoLic)} con nivel licenciatura.`,
    });
  }

  if (carrera.solicitudes !== null && carrera.lugares !== null) {
    faqs.push({
      pregunta: `¿Qué demanda de ingreso tiene ${nombre} en universidades de México?`,
      respuesta: `Según cifras de ANUIES incluidas en IMCO 2026, recibió ${enteroMx(carrera.solicitudes)} solicitudes para ${enteroMx(carrera.lugares)} lugares disponibles, lo que equivale a una tasa de aceptación de ${porcentajeMx(carrera.tasaAceptacion, 0)}.`,
    });
  }

  return faqs;
}

export function relacionadasFichaMx(
  carrera: CarreraMxRecord,
  limite = 4
): CarreraMxRecord[] {
  const publicables = getCarrerasPublicablesMx();
  const ingresoBase = carrera.ingreso ?? 0;

  return publicables
    .filter((c) => c.slug !== carrera.slug)
    .map((c) => {
      const diffIngreso = Math.abs((c.ingreso ?? 0) - ingresoBase);
      const bonusMismoNivel = c.esTsu === carrera.esTsu ? 0 : 4000;
      return { carrera: c, score: diffIngreso + bonusMismoNivel };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, limite)
    .map((item) => item.carrera);
}
