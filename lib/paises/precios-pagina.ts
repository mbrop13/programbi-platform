import { getPais, ISO_CHILE, normalizarPais, type Pais } from "@/config/paises";
import { courses, type Course } from "@/lib/data/courses";
import {
  catalogHours,
  checkoutLevelName,
  isTieredCourse,
  levelsForView,
  openCourseLevel,
} from "@/lib/data/course-views";
import { getCheckoutCatalog, type CheckoutCatalog } from "@/lib/pago/catalogo";
import { resolverPrecioClp } from "@/lib/pago/precio-clp";
import { resolverCobro } from "@/lib/paises/cobro";
import { montoConCodigo } from "@/lib/paises/detalle-curso";
import { notaCobroClp, precioCurso, precioLista } from "@/lib/paises/precios";

export type PrecioCursoPagina = {
  slug: string;
  title: string;
  description: string;
  hours: number;
  levelName: string;
  priceLabel: string;
  priceValue: number | null;
  listLabel: string | null;
  discount: number;
  currency: string;
  /** Monto real del checkout cuando el cobro no es en la moneda local. */
  chargeLabel: string | null;
};

type NivelPublico = {
  name: string;
  storedName: string;
  price?: number;
  originalPrice?: number;
};

/** Nivel que se vende en la ficha pública: el curso abierto, no la escalera de empresas. */
function nivelPublico(course: Course): NivelPublico {
  if (isTieredCourse(course)) {
    const open = openCourseLevel(course);
    const fallback = levelsForView(course, "publico")[0];
    const name = open?.name || fallback?.name || "Básico";
    return {
      name,
      storedName: checkoutLevelName(course, name) || name,
      price: open?.price ?? fallback?.price,
      originalPrice: open?.originalPrice,
    };
  }

  const level = levelsForView(course, "publico")[0] || course.levels?.[0];
  return {
    name: level?.name || "Completo",
    storedName: level?.name || "Completo",
    price: level?.price,
    originalPrice: level?.originalPrice,
  };
}

function filaChile(course: Course, catalog: CheckoutCatalog): PrecioCursoPagina {
  const nivel = nivelPublico(course);
  const priced = nivel.price
    ? resolverPrecioClp(
        course.slug,
        nivel.price,
        nivel.storedName,
        catalog.priceOverrides,
        catalog.promotions,
        nivel.originalPrice
      )
    : null;
  const priceValue = priced && priced.finalPrice > 0 ? priced.finalPrice : null;
  const listValue = priceValue ? priced?.listPrice ?? null : null;

  return {
    slug: course.slug,
    title: course.title,
    description: course.shortDescription,
    hours: catalogHours(course),
    levelName: nivel.name,
    priceLabel: priceValue ? montoConCodigo(ISO_CHILE, priceValue) : "Consultar",
    priceValue,
    listLabel: listValue ? montoConCodigo(ISO_CHILE, listValue) : null,
    discount: priceValue ? priced?.discountPercentage ?? 0 : 0,
    currency: "CLP",
    chargeLabel: null,
  };
}

function filaLocal(
  course: Course,
  iso: string,
  catalog: CheckoutCatalog | null
): PrecioCursoPagina {
  const local = precioCurso(iso, course.slug);
  const lista = precioLista(iso, course.slug);
  const pais = getPais(iso);
  const clp = catalog ? filaChile(course, catalog) : null;

  return {
    slug: course.slug,
    title: course.title,
    description: course.shortDescription,
    hours: catalogHours(course),
    levelName: nivelPublico(course).name,
    priceLabel: local != null ? montoConCodigo(iso, local) : "Consultar",
    priceValue: local,
    listLabel: lista != null ? montoConCodigo(iso, lista) : null,
    discount:
      lista != null && local != null
        ? Math.round(((lista - local) / lista) * 100)
        : 0,
    currency: pais.moneda,
    chargeLabel: clp?.priceValue ? notaCobroClp(clp.priceValue) : null,
  };
}

/**
 * Precios publicados por país. Chile usa el catálogo, los overrides y las
 * promociones del checkout. Los países con cobro local usan su tabla; si el
 * checkout termina cobrando con la cuenta de Chile, la página muestra además
 * el monto real en CLP.
 */
export async function preciosDePais(
  iso: string | null | undefined
): Promise<{
  pais: Pais;
  cursos: PrecioCursoPagina[];
  moneda: string;
  cobroLocal: boolean;
}> {
  const pais = getPais(normalizarPais(iso));

  // Solo Chile usa el catálogo. El resto publica su propia tabla (MP o referencia USD).
  if (pais.precios === "catalogo") {
    const catalog = await getCheckoutCatalog();
    return {
      pais,
      cursos: courses.map((course) => filaChile(course, catalog)),
      moneda: "CLP",
      cobroLocal: true,
    };
  }

  const cobroLocal = resolverCobro(pais.iso).modo === "local";
  const catalog = cobroLocal ? null : await getCheckoutCatalog();

  return {
    pais,
    cursos: courses.map((course) => filaLocal(course, pais.iso, catalog)),
    moneda: pais.moneda,
    cobroLocal,
  };
}
