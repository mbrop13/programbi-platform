/**
 * Texto propio de la ficha de curso por país.
 *
 * Cada entrada son párrafos editoriales del mercado, escritos para la ficha y
 * no reutilizados de la home. Todo lo que afirman sale de `config/paises.ts`,
 * de `lib/data/contenido-paises` o de las guías por país: no hay cifras ni
 * empresas inventadas. El resto del bloque (precio, medios de pago, horario,
 * caso de industria y referencias) se arma en runtime con esos mismos datos.
 *
 * Chile no tiene archivo en `contenido-paises` porque su mercado vive en la
 * configuración y en las guías chilenas: por eso su texto es más largo y cubre
 * lo que en los demás países aportan el caso y la moneda.
 */

export type FichaPais = {
  /** Párrafos únicos del mercado, en orden de lectura. */
  parrafos: string[];
};

export const FICHA_PAIS: Record<string, FichaPais> = {
  cl: {
    parrafos: [
      "En Chile el dato de gestión suele vivir en tres lugares a la vez: el ERP, la planilla que alguien actualiza cada lunes y el informe que llega a gerencia a mitad de semana. Este curso se dicta en vivo por Zoom desde Santiago y trabaja ese recorrido completo: conectar la fuente, ordenar el modelo, escribir las medidas y dejar una actualización que no dependa de una persona. Las clases quedan grabadas en el campus, así que quien trabaja en región o tiene turnos puede repetirlas.",
      "Los ejercicios usan lo que ya existe en las empresas chilenas: Microsoft 365, que muchas compañías ya pagan; reportes de producción y disponibilidad de equipos en minería y energía; venta por tienda y quiebres de stock en retail; cartera y control de gestión en banca, salud y servicios. La meta no es sumar gráficos, sino que el tablero responda una pregunta de negocio y aguante la reunión del comité.",
      "El precio se publica en pesos chilenos y se paga con los medios habilitados en el checkout. Los proyectos para empresas se cotizan aparte, con alcance y moneda en la propuesta.",
    ],
  },
  ar: {
    parrafos: [
      "En Argentina el número casi nunca está en un solo sistema: se reparte entre la facturación electrónica de ARCA (ex AFIP), el ERP, las planillas de campo y el archivo que finanzas arma a mano. El curso parte de ese desorden real y muestra cómo dejar un modelo que se actualiza con los precios del mes, sin rehacer la planilla cada vez. Los ejercicios recorren agro y exportación, fintech, retail e industria, y tratan la inflación, el cierre de mes y el tipo de cambio como variables del modelo, no como una regla contable.",
      "La clase se dicta desde Chile y se ve en hora de Buenos Aires: Argentina mantiene UTC-3 todo el año, así que la equivalencia depende del horario de verano chileno y la ficha de la cohorte muestra la hora exacta. Los casos de práctica cubren también cartera y mora en fintech y venta por canal en retail. Los datos de partida son los que ya existen en la empresa: comprobantes de ARCA, registros del ERP y planillas de tesorería.",
    ],
  },
  mx: {
    parrafos: [
      "En México el cierre de mes suele empezar juntando reportes de varias áreas y terminar en una discusión sobre qué archivo tiene la cifra buena. El curso trabaja ese problema con un modelo común: ventas por sucursal con inventario y margen, producción por turno y costo por ruta, sin depender de un consolidado manual. Las prácticas usan manufactura y nearshoring, retail y consumo, fintech y banca, y logística y comercio exterior: OEE por línea, sell-out por tienda, cartera y cobranza, nivel de servicio por ruta.",
      "Las clases se ven en hora del centro de México: el país ya no cambia la hora en la mayor parte de su territorio y Chile sí, por eso la equivalencia se mueve entre 16:30 y 17:30 según la época del año. Además de manufactura y retail, los ejercicios incluyen cartera y cobranza en fintech y banca, y nivel de servicio por ruta en logística. Los datos salen del CFDI, del ERP y de los reportes de tienda.",
    ],
  },
  pe: {
    parrafos: [
      "En Perú el reporte de gestión todavía se arma mucho a mano: se bajan los comprobantes de SUNAT, se cruzan con la planta y se pega todo en una planilla. El curso ordena ese flujo con SQL, un modelo en Power BI y, cuando hace falta, Python para lo que Excel no aguanta. Los casos de práctica vienen de minería, agroexportación, retail y consumo masivo, y banca y microfinanzas: producción y leyes por tajo, campaña y destino de exportación, venta por tienda, cartera por zona.",
      "El horario se publica en hora de Lima: Perú se mantiene en UTC-5 todo el año y Chile cambia con el verano, así que la clase de 19:30 en Chile se ve a las 17:30 o 18:30 en Perú según la fecha. Los casos incluyen además banca y microfinanzas, con cartera y cobranza por zona. Los datos de partida son comprobantes de SUNAT, reportes de planta y registros del sistema comercial.",
    ],
  },
  co: {
    parrafos: [
      "En Colombia el informe semanal suele depender de una persona que junta archivos y los cuadra a mano; cuando esa persona no está, el informe no sale. El curso convierte ese trabajo en un proceso: la consulta se ejecuta sola, el modelo calcula las métricas y el tablero queda listo para el comité. Las prácticas usan retail y consumo, fintech y banca, energía y servicios públicos, y agro y café: venta por canal, cartera y recaudo, consumo y facturación por zona, costos por finca.",
      "Las clases se ven en hora de Bogotá: Colombia se mantiene en UTC-5 todo el año y Chile cambia por horario de verano, por eso la equivalencia se mueve entre 17:30 y 18:30. Los ejercicios cubren también energía y servicios públicos (consumo y facturación por zona) y agro y café (costos por finca). Los datos vienen del POS, de la facturación electrónica de la DIAN y de las bases de recaudo.",
    ],
  },
  uy: {
    parrafos: [
      "Uruguay es un mercado chico con una industria de software y servicios que exporta, y eso se nota en lo que se pide: tableros claros, trazabilidad y margen por operación. El curso trabaja con datos de facturación electrónica, planillas de campo y sistemas de faena, y deja un modelo que se puede explicar a la gerencia sin abrir cinco archivos. Los casos de práctica vienen de agro y ganadería, frigoríficos y exportación, servicios financieros y fintech, y turismo y logística: costo por hectárea y margen por potrero, rendimiento por faena y destino, cartera y venta cruzada, ocupación y costo por ruta.",
      "Las clases se ven en hora de Montevideo: Uruguay mantiene UTC-3 todo el año, igual que Argentina, así que la equivalencia con Chile cambia cuando este pasa a horario de verano. Los casos de práctica incluyen también servicios financieros y turismo: cartera, venta cruzada, ocupación y costo por ruta. Los datos salen de la facturación electrónica de DGI, de las planillas de campo y de los sistemas de faena.",
    ],
  },
};

/** Texto de ficha del mercado. `null` para países sin ficha propia. */
export function getFichaPais(iso: string | null | undefined): FichaPais | null {
  if (!iso) return null;
  return FICHA_PAIS[iso] ?? null;
}
