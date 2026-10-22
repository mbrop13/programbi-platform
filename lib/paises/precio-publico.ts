import { courses } from "@/lib/data/courses";
import { checkoutLevelName, levelsForView } from "@/lib/data/course-views";
import { getCheckoutCatalog } from "@/lib/pago/catalogo";
import { precioDescontadoClp } from "@/lib/pago/precio-clp";
import { resolverCobro } from "@/lib/paises/cobro";
import { montoConCodigo } from "@/lib/paises/detalle-curso";
import { muestraPrecioLocal, notaCobroClp, porcentajeDescuento, precioCurso, precioLista } from "@/lib/paises/precios";

export type PrecioTarjeta = {
  /** Precio local con el código de moneda, por ejemplo "$159.900 ARS". */
  actual: string;
  lista: string | null;
  descuento: number;
  /** Nota del nivel que se ve al abrir la ficha. */
  nota: string | null;
  /** Misma nota, por el nombre del nivel que muestra la ficha. */
  notasPorNivel: Record<string, string>;
};

/**
 * Precio de la ficha para Argentina, México, Perú, Colombia y Uruguay.
 * Sale del servidor: el HTML ya trae la moneda local y, si no hay cuenta
 * de Mercado Pago de ese país, la nota con el monto real en CLP.
 */
export async function precioTarjetaPublico(
  iso: string | null | undefined,
  slug: string
): Promise<PrecioTarjeta | null> {
  if (!muestraPrecioLocal(iso)) return null;
  const monto = precioCurso(iso, slug);
  if (monto == null) return null;
  const lista = precioLista(iso, slug);
  const course = courses.find((item) => item.slug === slug);
  const notasPorNivel: Record<string, string> = {};
  let nota: string | null = null;

  if (course && resolverCobro(iso).modo !== "local") {
    const catalog = await getCheckoutCatalog();
    const levels = levelsForView(course, "publico");
    for (const level of levels) {
      const name = checkoutLevelName(course, level.name) || level.name;
      const stored = course.levels?.find((item) => item.name === name);
      const base = stored?.price || level.price;
      if (!base) continue;
      const final = precioDescontadoClp(slug, base, name, catalog.priceOverrides, catalog.promotions).finalPrice;
      if (final <= 0) continue;
      notasPorNivel[level.name] = notaCobroClp(final);
    }
    const primero = levels[0]?.name;
    nota = (primero && notasPorNivel[primero]) || Object.values(notasPorNivel)[0] || null;
  }

  return {
    actual: montoConCodigo(iso, monto),
    lista: lista != null ? montoConCodigo(iso, lista) : null,
    descuento: lista != null ? porcentajeDescuento(lista, monto) : 0,
    nota,
    notasPorNivel,
  };
}
