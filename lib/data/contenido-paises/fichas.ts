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
  bo: {
    parrafos: [
      "En Bolivia el cierre de mes suele empezar en la facturación electrónica en línea del SIN y terminar en una planilla que alguien rearma cada vez. El curso ordena ese recorrido con un modelo que se actualiza solo: la consulta trae los comprobantes, el modelo cruza volumen y costo, y el tablero responde sin depender de una persona. Los ejercicios vienen de minería e hidrocarburos, donde producción por turno y costo por operación pesan tanto como el margen final.",
      "Las clases se dictan desde Chile y se ven en hora de La Paz. Bolivia se mantiene en UTC-4 todo el año mientras Chile cambia entre UTC-3 y UTC-4 por el horario de verano, así que la equivalencia se mueve en parte del año y la hora se confirma en la ficha de cada cohorte. Los casos de práctica cubren también agro y comercio: campaña y rendimiento por hectárea, rotación de inventario y margen por línea de venta.",
    ],
  },
  cr: {
    parrafos: [
      "En Costa Rica el reporte de gestión convive con los comprobantes electrónicos del Ministerio de Hacienda, el sistema de reservas y la planilla de operaciones. El curso une esas fuentes en un modelo único, para que el tablero de ocupación, ingreso por servicio y costo por atención se actualice sin intervención manual y resista la pregunta de gerencia sobre qué cambió respecto del mes anterior. Los ejercicios usan servicios y turismo: temporada alta y baja, ocupación por propiedad y margen por paquete vendido.",
      "Las clases se ven en hora de San José: Costa Rica se mantiene en UTC-6 todo el año y Chile cambia con el horario de verano, por eso la equivalencia se corre en algunos meses y conviene revisar el horario publicado para cada cohorte. Los casos incluyen también dispositivos médicos y agro: rendimiento por línea, control de calidad, costo por hectárea y destino de exportación. Los datos salen de los comprobantes electrónicos, del sistema de producción y de las planillas de campo.",
    ],
  },
  ec: {
    parrafos: [
      "En Ecuador el dato suele llegar tarde porque vive en los comprobantes electrónicos del SRI, en el sistema de planta y en la planilla que exportaciones actualiza a mano. El curso convierte ese flujo en un proceso repetible: la consulta se ejecuta sola, el modelo calcula costo y margen, y el tablero llega a la reunión sin retoques de último minuto. Las prácticas usan agroexportación de banano, cacao y flores, con campaña, calibre y destino como variables.",
      "Las clases se dictan desde Chile y se ven en hora de Quito: Ecuador se mantiene en UTC-5 todo el año y Chile cambia entre UTC-3 y UTC-4 por el horario de verano, así que la equivalencia se mueve según la fecha. Los ejercicios cubren también petróleo, retail y el crédito de cooperativas: producción y costo por operación, venta por local y cartera por socio. Los datos de partida son comprobantes del SRI, registros de planta y el sistema comercial.",
    ],
  },
  sv: {
    parrafos: [
      "En El Salvador el control de gestión se arma cerca del comercio: el Documento Tributario Electrónico del Ministerio de Hacienda marca la venta y el resto se cruza con el inventario y la planilla de sucursal. El curso deja ese cruce en un modelo que se actualiza solo y responde por tienda, por día y por margen, sin que nadie rehaga el archivo cada semana. Los ejercicios usan comercio y manufactura ligera: rotación de inventario, quiebre por local y costo por línea.",
      "Las clases se ven en hora de San Salvador: El Salvador se mantiene en UTC-6 todo el año y Chile cambia con el horario de verano, por eso la equivalencia se corre en algunos meses y la hora se confirma en la ficha de cada cohorte. Los casos de práctica incluyen banca y el flujo de remesas: cartera, mora, recaudo y conciliación de pagos. Los datos salen del DTE, del sistema de inventario y de las bases transaccionales del negocio.",
    ],
  },
  gt: {
    parrafos: [
      "En Guatemala la factura electrónica en línea de la SAT convive con el sistema de inventario y con la planilla que retail actualiza a diario. El curso ordena ese material en un modelo que se actualiza sin intervención: venta por tienda, inventario disponible y margen por categoría, con el detalle suficiente para explicar la variación en el comité. Los ejercicios vienen de agroexportación y retail, con campaña, calibre, destino y quiebre de stock como variables.",
      "Las clases se dictan desde Chile y se ven en hora de Guatemala: el país se mantiene en UTC-6 todo el año y Chile cambia por horario de verano, así que la equivalencia se mueve en parte del año y el horario se publica en la ficha de la cohorte. Las prácticas cubren también manufactura y remesas: rendimiento por línea, costo por turno y conciliación de pagos. Los datos de partida son los documentos de la FEL, los registros del ERP y los reportes de tienda.",
    ],
  },
  do: {
    parrafos: [
      "En República Dominicana el tablero de gestión suele mezclar turismo y zonas francas en la misma conversación: ocupación, ingreso por servicio, producción por línea y costo por turno. El curso toma el Comprobante Fiscal Electrónico de la DGII como punto de partida y lo cruza con el sistema de operación, para que el modelo se actualice solo y el área comercial discuta decisiones y no definiciones de campos. Los ejercicios usan turismo y zonas francas, con temporada, ocupación, rendimiento por línea y margen por contrato.",
      "Las clases se ven en hora de Santo Domingo: República Dominicana se mantiene en UTC-4 todo el año y Chile cambia entre UTC-3 y UTC-4 por el horario de verano, por eso la equivalencia se corre en algunos meses y el horario publicado se ajusta a esa diferencia. Los casos incluyen también retail y banca: venta por canal, inventario, cartera y recaudo. Los datos salen del e-CF, del sistema comercial y de las bases de operación.",
    ],
  },
  ve: {
    parrafos: [
      "En Venezuela el reporte de gestión se arma con lo que hay: la facturación electrónica del SENIAT, el sistema de inventario y la planilla de operaciones. El curso convierte ese material disperso en un modelo que se actualiza solo, con venta por canal, costo por operación y margen visibles para quien decide, sin que el informe dependa de una persona. Los ejercicios usan petróleo y comercio: producción, despacho, rotación de inventario y margen por línea de venta.",
      "Las clases se dictan desde Chile y se ven en hora de Caracas: Venezuela se mantiene en UTC-4 todo el año, igual que Bolivia, mientras Chile cambia con el horario de verano, así que la equivalencia se mueve en parte del año. Los casos de práctica incluyen servicios: costo por atención, tiempo de respuesta y rentabilidad por contrato. Los datos de partida son los comprobantes del SENIAT, los registros del sistema comercial y las planillas de operación.",
    ],
  },
};

/** Texto de ficha del mercado. `null` para países sin ficha propia. */
export function getFichaPais(iso: string | null | undefined): FichaPais | null {
  if (!iso) return null;
  return FICHA_PAIS[iso] ?? null;
}
