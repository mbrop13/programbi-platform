import { getPais, ISO_CHILE, normalizarPais, type Pais } from "@/config/paises";
import { courses, type Course } from "@/lib/data/courses";
import {
  catalogHours,
  checkoutLevelName,
  isTieredCourse,
  levelsForView,
  openCourseLevel,
} from "@/lib/data/course-views";
import { precioChile } from "@/config/pricing";
import { resolverCobro } from "@/lib/paises/cobro";
import { montoConCodigo } from "@/lib/paises/detalle-curso";
import { NOTA_PAGO, precioCurso, precioLista } from "@/lib/paises/precios";

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

function filaChile(course: Course): PrecioCursoPagina {
  const priceValue = precioChile(course.slug);

  return {
    slug: course.slug,
    title: course.title,
    description: course.shortDescription,
    hours: catalogHours(course),
    levelName: nivelPublico(course).name,
    priceLabel: priceValue ? montoConCodigo(ISO_CHILE, priceValue) : "Consultar",
    priceValue,
    listLabel: null,
    discount: 0,
    currency: "CLP",
    chargeLabel: null,
  };
}

function filaLocal(course: Course, iso: string): PrecioCursoPagina {
  const local = precioCurso(iso, course.slug);
  const lista = precioLista(iso, course.slug);
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
    discount:
      lista != null && local != null
        ? Math.round(((lista - local) / lista) * 100)
        : 0,
    currency: pais.moneda,
    // La nota junta al precio es la de pago, sin aviso de CLP: el aviso de
    // moneda de cobro aparece recién en el checkout.
    chargeLabel: NOTA_PAGO,
  };
}

/**
 * Precios publicados por país. Chile usa el catálogo, los overrides y las
 * promociones del checkout. Los países con cobro local usan su tabla.
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
    return {
      pais,
      cursos: courses.map((course) => filaChile(course)),
      moneda: "CLP",
      cobroLocal: true,
    };
  }

  const cobroLocal = resolverCobro(pais.iso).modo === "local";

  return {
    pais,
    cursos: courses.map((course) => filaLocal(course, pais.iso)),
    moneda: pais.moneda,
    cobroLocal,
  };
}
