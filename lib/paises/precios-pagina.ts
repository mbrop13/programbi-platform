import { getPais, ISO_CHILE, normalizarPais, type Pais } from "@/config/paises";
import { courses, type Course } from "@/lib/data/courses";
import {
  catalogHours,
  checkoutLevelName,
  isTieredCourse,
  levelsForView,
  openCourseLevel,
} from "@/lib/data/course-views";
import { resolverCobro } from "@/lib/paises/cobro";
import { montoConCodigo } from "@/lib/paises/detalle-curso";
import {
  NOTA_PAGO,
  formatMoneda,
  promocionesParaPais,
  resolverPrecioCursoPais,
  type OverridePrecio,
  type PromocionAplicable,
} from "@/lib/paises/precios";
import { getActivePromotions, getPriceOverrides } from "@/lib/supabase/comunidad-ai";

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

function filaChile(
  course: Course,
  promotions: readonly PromocionAplicable[],
  priceOverrides: readonly OverridePrecio[]
): PrecioCursoPagina {
  const nivel = nivelPublico(course);
  const resuelto = resolverPrecioCursoPais(ISO_CHILE, course.slug, promotions, {
    priceOverrides,
    levelName: nivel.storedName,
  });
  const cobro = resuelto?.finalPrice ?? null;
  const lista = resuelto?.listPrice ?? null;
  const tieneDescuento = lista != null && cobro != null && lista > cobro;

  return {
    slug: course.slug,
    title: course.title,
    description: course.shortDescription,
    hours: catalogHours(course),
    levelName: nivel.name,
    priceLabel: cobro ? montoConCodigo(ISO_CHILE, cobro) : "Consultar",
    priceValue: cobro,
    listLabel: tieneDescuento ? formatMoneda(ISO_CHILE, lista) : null,
    discount: resuelto?.discountPercentage ?? 0,
    currency: "CLP",
    chargeLabel: null,
  };
}

function filaLocal(
  course: Course,
  iso: string,
  promotions: readonly PromocionAplicable[]
): PrecioCursoPagina {
  const resuelto = resolverPrecioCursoPais(iso, course.slug, promotions);
  const local = resuelto?.finalPrice ?? null;
  const lista = resuelto?.listPrice ?? null;
  const pais = getPais(iso);

  return {
    slug: course.slug,
    title: course.title,
    description: course.shortDescription,
    hours: catalogHours(course),
    levelName: nivelPublico(course).name,
    priceLabel: local != null ? montoConCodigo(iso, local) : "Consultar",
    priceValue: local,
    listLabel: lista != null ? montoConCodigo(iso, lista) : null,
    discount: resuelto?.discountPercentage ?? 0,
    currency: pais.moneda,
    // La nota junta al precio es la de pago, sin aviso de CLP: el aviso de
    // moneda de cobro aparece recién en el checkout.
    chargeLabel: NOTA_PAGO,
  };
}

/**
 * Precios publicados por país. Aplica promociones activas del panel admin en
 * todos los mercados (y overrides CLP en Chile).
 */
export async function preciosDePais(
  iso: string | null | undefined
): Promise<{
  pais: Pais;
  cursos: PrecioCursoPagina[];
  moneda: string;
  cobroLocal: boolean;
  promotions: PromocionAplicable[];
}> {
  const pais = getPais(normalizarPais(iso));
  const [rawPromotions, priceOverrides] = await Promise.all([
    getActivePromotions(),
    pais.precios === "catalogo" ? getPriceOverrides() : Promise.resolve([]),
  ]);
  const promotions = promocionesParaPais(pais.iso, rawPromotions);

  // Solo Chile usa el catálogo. El resto publica su propia tabla (MP o referencia USD).
  if (pais.precios === "catalogo") {
    return {
      pais,
      cursos: courses.map((course) => filaChile(course, promotions, priceOverrides)),
      moneda: "CLP",
      cobroLocal: true,
      promotions,
    };
  }

  const cobroLocal = resolverCobro(pais.iso).modo === "local";

  return {
    pais,
    cursos: courses.map((course) => filaLocal(course, pais.iso, promotions)),
    moneda: pais.moneda,
    cobroLocal,
    promotions,
  };
}
