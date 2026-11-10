/**
 * Bloque local de país: datos duros, FAQ y enlaces.
 *
 * La definición (`DefinicionBloqueLocal`) vive en `pe.ts` / `mx.ts` y solo
 * aporta texto propio del mercado. Los montos, el horario, las cuotas y los
 * medios de pago NO se escriben ahí: se calculan en este archivo desde las
 * fuentes únicas del repo (`config/pricing.ts`, `config/paises.ts`,
 * `config/cuotas.ts`, `config/flags.ts` y `lib/paises/horarios.ts`).
 *
 * Los textos de la definición pueden usar marcadores entre llaves
 * (`{precio}`, `{horario}`, `{cuotas}`…) que se resuelven con esos mismos
 * datos. Así el copy local nunca queda desincronizado de un cambio de precio
 * o de horario.
 */

import { CUOTAS_SIN_INTERES, textoCuotas } from "@/config/cuotas";
import { CLASE_GRATIS, claseGratisPublicada } from "@/config/flags";
import { getPais, normalizarPais } from "@/config/paises";
import { precioPublico } from "@/config/pricing";
import { courses } from "@/lib/data/courses";
import { guiasDePais, indiceGuias } from "@/lib/guias";
import { esGuiaPublicada } from "@/lib/guias/relacionadas";
import { etiquetaHoraLocal, horarioLocal } from "@/lib/paises/horarios";
import { NOTA_PAGO } from "@/lib/paises/precios";
import { rutaLocal } from "@/lib/paises/rutas";
import type { SeoPagina } from "./tipos";

/** Hechos duros que todo bloque local muestra, en este orden. */
export type ClaveHechoLocal =
  | "precio"
  | "horario"
  | "pago"
  | "cuotas"
  | "clase-gratis"
  | "certificado";

export type HechoLocal = {
  clave: ClaveHechoLocal;
  etiqueta: string;
  /** Dato ya formateado en la moneda / hora / unidad que corresponde. */
  valor: string;
  /** Explicación del mercado, con los mismos datos de la fuente única. */
  detalle: string;
};

export type FaqLocal = { q: string; a: string };

export type EnlaceLocal = { href: string; label: string };

/**
 * Bloque ya resuelto que consume `BloqueLocalPais`. Todo lo que muestra sale
 * de aquí: la página no recalcula precios ni horarios.
 */
export type DatosBloqueLocal = {
  iso: string;
  nombre: string;
  /** H2 del bloque. */
  titulo: string;
  /** Párrafos propios del país. */
  parrafos: string[];
  /** Nota de capacitación in-company, solo se renderiza en /empresas. */
  empresas: string;
  hechos: HechoLocal[];
  faqs: FaqLocal[];
  /** Fichas de curso del mercado, ya con la ruta del país. */
  fichas: EnlaceLocal[];
  /** Guías publicadas del mercado. */
  guias: EnlaceLocal[];
  /** Índice de guías del país. */
  indiceGuias: string;
  /** Curso de la página cuando el bloque va en una ficha. */
  curso?: { slug: string; title: string };
};

/** Rutas con metadata propia por país (las siete del frente). */
export const RUTAS_SEO_LOCAL = [
  "hub",
  "cursos",
  "power-bi",
  "analisis-de-datos",
  "python",
  "empresas",
  "precios",
] as const;

export type RutaSeoLocal = (typeof RUTAS_SEO_LOCAL)[number];

export function esRutaSeoLocal(valor: string): valor is RutaSeoLocal {
  return (RUTAS_SEO_LOCAL as readonly string[]).includes(valor);
}

/**
 * Texto local de un país. Es lo único que WS8 tiene que escribir para sumar
 * Argentina y Colombia: la estructura y los números ya están resueltos.
 */
export type DefinicionBloqueLocal = {
  iso: string;
  titulo: string;
  parrafos: string[];
  empresas: string;
  /** Nota por hecho. Si falta, se usa la explicación genérica. */
  notas: Partial<Record<ClaveHechoLocal, string>>;
  /** 4 a 6 preguntas. Aceptan los mismos marcadores que las notas. */
  preguntas: FaqLocal[];
  /** Title y description de las siete rutas. */
  seo: Record<RutaSeoLocal, SeoPagina>;
};

type Ctx = {
  iso: string;
  pais: string;
  moneda: string;
  horario: string;
  horarioChile: string;
  horaLocal: string;
  cuotas: string;
  medios: string;
  notaPago: string;
  claseGratis: string;
};

const MARCADOR = /\{([\w-]+)\}/g;

/** Reemplaza `{clave}` por su valor. Un marcador desconocido queda visible. */
function resolver(texto: string, ctx: Ctx): string {
  return texto.replace(MARCADOR, (original, clave: string) => {
    const valor = (ctx as unknown as Record<string, string>)[clave];
    return valor ?? original;
  });
}

function fechaClaseGratis(): string | null {
  if (!claseGratisPublicada() || !CLASE_GRATIS.fecha) return null;
  const fecha = new Date(`${CLASE_GRATIS.fecha}T12:00:00Z`);
  if (Number.isNaN(fecha.getTime())) return null;
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long" }).format(fecha);
}

/** Primer medio de pago sin el paréntesis: «Mercado Pago Perú». */
function medioPrincipal(medios: string[]): string {
  const primero = medios[0] || "Mercado Pago";
  return primero.replace(/\s*\([^)]*\)\s*$/, "");
}

/** Construye el bloque resuelto de un país. `null` si no hay definición. */
export function construirBloque(
  definicion: DefinicionBloqueLocal | null | undefined,
  opciones: { curso?: string } = {}
): DatosBloqueLocal | null {
  if (!definicion) return null;

  const iso = normalizarPais(definicion.iso);
  const pais = getPais(iso);
  const horario = horarioLocal(iso);
  const curso = opciones.curso ? courses.find((item) => item.slug === opciones.curso) : undefined;
  // El sitio oculta los montos en el HTML hasta que el visitante descarga el
  // brochure (`hooks/usePriceUnlock`). El bloque respeta ese gate: publica la
  // moneda y remite al brochure, nunca el importe.
  const hayPrecio = precioPublico(iso, curso?.slug ?? "power-bi") != null;
  const fechaGratis = fechaClaseGratis();

  const ctx: Ctx = {
    iso,
    pais: pais.nombre,
    moneda: pais.moneda,
    horario: `${horario.inicio} a ${horario.fin}`,
    horarioChile: `${horario.inicioChile} a ${horario.finChile}`,
    horaLocal: etiquetaHoraLocal(iso),
    cuotas: textoCuotas(iso),
    medios: pais.mediosPago.join("; "),
    notaPago: NOTA_PAGO,
    claseGratis: fechaGratis ?? "sin fecha confirmada",
  };

  const nota = (clave: ClaveHechoLocal, generico: string) =>
    resolver(definicion.notas[clave] ?? generico, ctx);

  const hechos: HechoLocal[] = [
    {
      clave: "precio",
      etiqueta: `Precio en ${pais.moneda}`,
      valor: hayPrecio ? "En el brochure PDF" : "Consulta el valor",
      detalle: nota(
        "precio",
        hayPrecio
          ? `El monto vigente y los descuentos están en el brochure del curso; el checkout muestra el total antes de pagar.`
          : `Sin precio público aprobado para ${pais.nombre}: se confirma con admisiones.`
      ),
    },
    {
      clave: "horario",
      etiqueta: "Horario en hora local",
      valor: ctx.horario,
      detalle: nota(
        "horario",
        `Lunes y miércoles o martes y jueves, según la cohorte. En Chile, ${ctx.horarioChile}.`
      ),
    },
    {
      clave: "pago",
      etiqueta: "Pago internacional",
      valor: medioPrincipal(pais.mediosPago),
      detalle: nota(
        "pago",
        `${ctx.medios}. ${NOTA_PAGO}`
      ),
    },
    {
      clave: "cuotas",
      etiqueta: "Cuotas sin interés",
      valor: ctx.cuotas,
      detalle: nota(
        "cuotas",
        `${CUOTAS_SIN_INTERES} pagos, sin recargo por financiamiento. La pasarela confirma la disponibilidad al pagar.`
      ),
    },
    {
      clave: "clase-gratis",
      etiqueta: "Clase gratis",
      valor: fechaGratis ? `Próxima: ${fechaGratis}` : "Sin fecha confirmada",
      detalle: nota(
        "clase-gratis",
        "Clase abierta por Zoom, sin costo y sin crear cuenta. La fecha se publica cuando está confirmada."
      ),
    },
    {
      clave: "certificado",
      etiqueta: "Certificado",
      valor: "Certificado digital",
      detalle: nota(
        "certificado",
        "Certificado de ProgramBI con código de verificación y grabaciones de por vida en el campus."
      ),
    },
  ];

  const fichas: EnlaceLocal[] = courses
    .filter((item) => item.slug !== curso?.slug)
    .map((item) => ({
      href: rutaLocal(iso, `/cursos/${item.slug}`),
      label: item.title,
    }));

  const guias: EnlaceLocal[] = guiasDePais(iso)
    .filter(esGuiaPublicada)
    .map((guia) => ({ href: guia.path, label: guia.h1 }));

  return {
    iso,
    nombre: pais.nombre,
    titulo: definicion.titulo,
    parrafos: definicion.parrafos.map((parrafo) => resolver(parrafo, ctx)),
    empresas: resolver(definicion.empresas, ctx),
    hechos,
    faqs: definicion.preguntas.map((faq) => ({
      q: resolver(faq.q, ctx),
      a: resolver(faq.a, ctx),
    })),
    fichas,
    guias,
    indiceGuias: indiceGuias(iso),
    ...(curso ? { curso: { slug: curso.slug, title: curso.title } } : {}),
  };
}
