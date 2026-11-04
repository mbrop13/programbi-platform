import { courses } from "@/lib/data/courses";
import { levelsForView } from "@/lib/data/course-views";
import { montoConCodigo } from "@/lib/paises/detalle-curso";
import { NOTA_PAGO, muestraPrecioLocal, porcentajeDescuento, precioCurso, precioLista } from "@/lib/paises/precios";

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
 * Precio de la ficha para los países con tabla propia (Argentina, México,
 * Perú, Colombia, Uruguay y los secundarios). Sale del servidor: el HTML ya
 * trae la moneda local y la nota de pago, sin avisos de CLP junto al precio
 * (ese aviso vive solo en el checkout, donde se cobra de verdad).
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
  if (course) {
    for (const level of levelsForView(course, "publico")) {
      notasPorNivel[level.name] = NOTA_PAGO;
    }
  }

  return {
    actual: montoConCodigo(iso, monto),
    lista: lista != null ? montoConCodigo(iso, lista) : null,
    descuento: lista != null ? porcentajeDescuento(lista, monto) : 0,
    nota: NOTA_PAGO,
    notasPorNivel,
  };
}
