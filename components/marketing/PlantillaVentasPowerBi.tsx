import { Download, FileSpreadsheet, Filter } from "lucide-react";
import PlantillaDescarga from "@/components/marketing/PlantillaDescarga";
import { NOMBRE_PLANTILLA_VENTAS } from "@/lib/leads-magnet";

/**
 * Bloque único de la antigua landing /curso-power-bi, migrado a la ficha
 * canónica /cursos/power-bi antes de redirigirla.
 *
 * Solo describe el CSV que ya se entrega en `/plantillas/plantilla-ventas-powerbi.csv`
 * y el flujo de práctica con Power BI Desktop. No publica precios, fechas ni
 * casos de clientes: el arancel vive en el brochure PDF de la ficha.
 */
export default function PlantillaVentasPowerBi({ pais }: { pais: string }) {
  const incluidos = [
    "Columnas listas para modelar: fecha, país, moneda, región, vendedor, categoría, producto, unidades, precio unitario, venta neta, costo y margen.",
    "18 filas de ejemplo con ventas de Chile, Argentina, México, Perú, Colombia y Uruguay. Las cifras son referenciales: es un ejercicio, no un caso de cliente.",
    "Se descarga con tu email y se abre en Excel, Google Sheets o directo en Power BI Desktop.",
  ];

  const pasos = [
    {
      title: "Descarga el archivo",
      body: `Guarda ${NOMBRE_PLANTILLA_VENTAS} en una carpeta local. No necesita credenciales ni conexión a una base de datos.`,
    },
    {
      title: "Cárgalo en Power BI Desktop",
      body: "Usa Obtener datos > Texto/CSV, revisa los tipos y deja que Power Query limpie fechas, números y textos.",
    },
    {
      title: "Crea tus primeras medidas",
      body: "Calcula venta total, margen porcentual y ventas por país, y compáralas en un gráfico de barras o un mapa.",
    },
  ];

  return (
    <section
      id="plantilla-power-bi"
      aria-labelledby="plantilla-power-bi-title"
      className="border-t border-line bg-paper px-5 py-16 lg:py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">
            Recurso gratis
          </p>
          <h2
            id="plantilla-power-bi-title"
            className="mt-3 max-w-[26ch] text-balance text-2xl font-bold tracking-tight text-ink sm:text-3xl"
          >
            Plantilla de ventas para practicar en Power BI
          </h2>
          <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-mute">
            Un CSV de ejemplo para llegar a clase con un caso propio: ábrelo en Power BI Desktop,
            limpia los datos con Power Query y arma tus primeras medidas sin depender de un ERP.
          </p>

          <ul className="mt-6 space-y-3">
            {incluidos.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                <FileSpreadsheet size={16} className="mt-0.5 shrink-0 text-mute" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <PlantillaDescarga pais={pais} location="ficha_power_bi_plantilla" />
          </div>
          <p className="mt-3 text-xs text-faint">
            CSV de ejemplo · Solo email · Compatible con Power BI Desktop
          </p>
        </div>

        <div className="rounded-[26px] border border-line bg-canvas p-6">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-mute" aria-hidden />
            <h3 className="text-base font-bold text-ink">Cómo usarla en tres pasos</h3>
          </div>
          <ol className="mt-5 space-y-4">
            {pasos.map((paso, i) => (
              <li key={paso.title} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-canvas">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{paso.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-mute">{paso.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-xs leading-relaxed text-faint">
            <Download size={14} aria-hidden /> El mismo CSV se usa como ejercicio de apoyo en el
            curso; no reemplaza el temario.
          </p>
        </div>
      </div>
    </section>
  );
}
