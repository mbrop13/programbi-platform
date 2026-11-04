import { courses } from "@/lib/data/courses";
import { levelsForView } from "@/lib/data/course-views";
import { resolverCobro } from "@/lib/paises/cobro";
import { montoConCodigo } from "@/lib/paises/detalle-curso";
import { NOTA_PAGO, muestraPrecioLocal, notaCobroClp, porcentajeDescuento, precioCurso, precioLista } from "@/lib/paises/precios";

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
    // Sin cuenta de Mercado Pago del país, el cargo se procesa en CLP: se avisa
    // sin monto, para no contradecir el precio publicado en moneda local.
    for (const level of levelsForView(course, "publico")) {
      notasPorNivel[level.name] = NOTA_PAGO;
    }
    nota = notaCobroClp();
  }

  return {
    actual: montoConCodigo(iso, monto),
    lista: lista != null ? montoConCodigo(iso, lista) : null,
    descuento: lista != null ? porcentajeDescuento(lista, monto) : 0,
    nota,
    notasPorNivel,
  };
}
