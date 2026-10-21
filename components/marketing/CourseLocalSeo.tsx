import type { DetalleCursoLocal } from "@/lib/paises/detalle-curso";

/**
 * Bloque local de la ficha de curso: horario en la hora del país, precio y
 * moneda, medios de pago y las tres preguntas frecuentes del mercado.
 * Se renderiza en el servidor para que el precio y el horario lleguen al HTML.
 */
export default function CourseLocalSeo({ detalle }: { detalle: DetalleCursoLocal }) {
  return (
    <section className="border-t border-line bg-canvas px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[860px]">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Clases y pago en {detalle.pais.nombre}
        </h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-mute">
          <p>{detalle.horarioTexto}</p>
          <p>
            {detalle.precioTexto ? (
              <>
                El valor del curso es{" "}
                <strong className="font-semibold text-ink">{detalle.precioTexto}</strong>
                {detalle.precioUsdTexto ? ` (${detalle.precioUsdTexto} de referencia)` : ""}.{" "}
              </>
            ) : null}
            {detalle.mediosPagoTexto}
          </p>
        </div>

        <h3 className="mt-12 text-xl font-bold tracking-tight text-ink sm:text-2xl">
          Preguntas frecuentes
        </h3>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {detalle.faqs.map((item) => (
            <details key={item.q} className="faq group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                <span className="text-lg font-semibold tracking-tight text-ink sm:text-xl">{item.q}</span>
                <span className="text-2xl leading-none text-faint group-open:hidden">+</span>
                <span className="hidden text-2xl leading-none text-faint group-open:block">–</span>
              </summary>
              <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-mute sm:text-base">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
