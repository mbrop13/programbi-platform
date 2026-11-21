import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "uf-utm-ipc-en-excel-automatico",
  title: "UF, UTM e IPC en Excel actualizados automáticamente",
  meta: "Conecta Excel a la UF, la UTM y el IPC con Power Query y conviértelos a pesos con fórmulas. Guía paso a paso con el código y las fuentes oficiales.",
  h1: "Cómo tener la UF, la UTM y el IPC actualizados en Excel",
  subtitle:
    "Construye una función reutilizable en Power Query para descargar la Unidad de Fomento, la Unidad Tributaria Mensual y el IPC en un solo libro, convertir montos a pesos y reajustar contratos por inflación.",
  keywordPrincipal: "UF en Excel",
  keywords: [
    "UF en Excel",
    "valor UF en Excel",
    "actualizar UF en Excel",
    "formula UF hoy Excel",
    "UTM en Excel",
    "IPC en Excel",
    "convertir UF a pesos",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Un libro de Excel con tablas actualizables de UF diaria, UTM mensual e IPC para calcular arriendos, honorarios, multas y reajustes acumulados sin digitar valores a mano.",
    herramienta: "Excel con Power Query (función M personalizada) y fórmulas BUSCARX / PRODUCTO",
    tiempo: "25 minutos",
    bullets: [
      "Creas una sola función M llamada fnIndicador(codigo) para consultar UF, UTM y otros indicadores sin duplicar código.",
      "Conviertes montos de UF a CLP (y viceversa) con formato visual personalizado \"UF \"#.##0,00.",
      "Calculas reajustes por IPC acumulado con PRODUCTO(1+rango)-1 y sabes cuándo pasar a la API oficial del Banco Central o al INE.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Diferenciar indicadores",
      resumen: "Frecuencia, entidad oficial y uso de UF, UTM e IPC.",
      anchorId: "que-es-cada-indicador",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "Función fnIndicador",
      resumen: "Crea una función M reutilizable para consultar indicadores.",
      anchorId: "consulta-unica-indicadores",
      icono: "code",
    },
    {
      numero: 3,
      titulo: "UF diaria y formato",
      resumen: "Convierte UF↔CLP y aplica formato personalizado.",
      anchorId: "uf-diaria-y-conversion",
      icono: "table",
    },
    {
      numero: 4,
      titulo: "UTM mensual",
      resumen: "Cruza fechas de pago o declaraciones contra la UTM del mes.",
      anchorId: "utm-mensual-en-excel",
      icono: "calendar",
    },
    {
      numero: 5,
      titulo: "IPC y reajustes",
      resumen: "Calcula inflación acumulada y verifica la fuente oficial.",
      anchorId: "ipc-y-reajuste-montos",
      icono: "chart",
    },
  ],
  requisitos: {
    version: "Excel 2016 o superior en Windows (Microsoft 365 recomendado para BUSCARX y FIN.MES).",
    lista: [
      "Acceso a internet para consultar mindicador.cl o la API BDE del Banco Central de Chile.",
      "Conocimientos básicos de tablas estructuradas en Excel (Ctrl + T) y barra de fórmulas.",
      "Para producción con IPC vigente: cuenta gratuita en los Web Services del Banco Central de Chile o descarga mensual desde el INE.",
    ],
    compatibilidadMacWeb:
      "Las funciones personalizadas de Power Query funcionan en Excel para Windows y en versiones recientes de Excel para Mac (Microsoft 365). En Excel para la Web no es posible crear ni editar funciones M personalizadas en el navegador.",
  },
  herramientasHowTo: [
    "Excel con Power Query",
    "Editor avanzado de lenguaje M",
  ],
  insumosHowTo: [
    "Conexión a internet",
    "API pública mindicador.cl y/o credenciales gratuitas BDE del Banco Central de Chile",
  ],
  secciones: [
    {
      id: "que-es-cada-indicador",
      titulo: "Qué es cada indicador y cuándo se actualiza en Chile",
      esPasoHowTo: false,
      parrafos: [
        "En la gestión financiera, inmobiliaria y tributaria chilena conviven tres unidades reajustables que suelen confundirse cuando se arman planillas apuradas: la UF (Unidad de Fomento), la UTM (Unidad Tributaria Mensual) y el IPC (Índice de Precios al Consumidor). Cada una tiene una periodicidad distinta y un organismo responsable de calcularla o publicarla.",
        "La UF cambia todos los días calendario —incluidos sábados, domingos y feriados— entre el día 10 de cada mes y el día 9 del mes siguiente, en función de la variación del IPC del mes anterior. La UTM, en cambio, es un valor fijo para todo el mes calendario utilizado por el SII para tramos de impuestos, multas y patentes. Finalmente, el IPC mide la variación porcentual mensual de la canasta de precios y sirve tanto para alimentar la UF como para reajustar contratos pactados directamente en porcentaje de inflación.",
        "Si administras contratos de arriendo comercial, honorarios de asesoría pactados en UF, liquidaciones con tramo tributario en UTM o reajustes anuales por inflación en una pyme en Chile, mantener estos tres indicadores en hojas conectadas evita el clásico error de copiar cifras desactualizadas de meses anteriores o mezclar fechas de devengo con fechas de pago.",
      ],
      tabla: {
        caption: "Comparativa operativa de UF, UTM e IPC para modelos en Excel",
        encabezados: [
          "Indicador",
          "Frecuencia de cambio",
          "Entidad que calcula / publica",
          "Uso típico en planillas de oficina",
        ],
        filas: [
          [
            "UF (Unidad de Fomento)",
            "Diaria (incluye fines de semana y feriados)",
            "Banco Central de Chile (sobre IPC del INE)",
            "Arriendos, créditos hipotecarios, seguros, honorarios y contratos comerciales",
          ],
          [
            "UTM (Unidad Tributaria Mensual)",
            "Mensual (un valor por cada mes calendario)",
            "Servicio de Impuestos Internos (SII)",
            "Impuesto Único de Segunda Categoría, multas laborales, patentes municipales",
          ],
          [
            "IPC (Índice de Precios al Consumidor)",
            "Mensual (variación % publicada los primeros días del mes siguiente)",
            "Instituto Nacional de Estadísticas (INE)",
            "Reajuste anual o semestral de sueldos, tarifas y cláusulas de contratos",
          ],
        ],
      },
    },
    {
      id: "consulta-unica-indicadores",
      titulo: "Paso 1: Crear la función única fnIndicador(codigo) en Power Query",
      esPasoHowTo: true,
      resumenHowTo:
        "Escribe una sola función personalizada en Power Query llamada fnIndicador que reciba el código del indicador (\"uf\", \"utm\" o \"ipc\") y devuelva una tabla limpia con Fecha y Valor.",
      parrafos: [
        "Si creas una consulta separada desde cero para la UF, otra para la UTM y otra para el IPC, terminarás manteniendo tres bloques de código casi idénticos. En Power Query es mucho más limpio encapsular la lógica de conexión en una función personalizada llamada fnIndicador y luego invocarla pasando únicamente el nombre del indicador.",
        "Abre Excel, ve a Datos > Obtener datos > De otras fuentes > Consulta en blanco. Entra al Editor avanzado, pega el código M de abajo y cámbiale el nombre a la consulta en el panel derecho por fnIndicador. Verás que su ícono cambia a fx, lo que confirma que quedó registrada como función reutilizable.",
      ],
      codigos: [
        {
          titulo: "Función M reutilizable fnIndicador(codigo) para mindicador.cl",
          lenguaje: "m",
          mostrarLineas: true,
          codigo: `(codigo as text) as table =>
let
    Url = "https://mindicador.cl/api/" & Text.Lower(Text.Trim(codigo)),
    Origen = Json.Document(Web.Contents(Url)),
    Serie = Origen[serie],
    ATabla = Table.FromList(Serie, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    Expandido = Table.ExpandRecordColumn(ATabla, "Column1", {"fecha", "valor"}, {"FechaRaw", "ValorRaw"}),
    ConFecha = Table.TransformColumns(
        Expandido,
        {{"FechaRaw", each Date.From(DateTimeZone.SwitchZone(DateTimeZone.From(_), -3)), type date}}
    ),
    Renombrado = Table.RenameColumns(ConFecha, {{"FechaRaw", "Fecha"}, {"ValorRaw", "Valor"}}),
    TipoFinal = Table.TransformColumnTypes(Renombrado, {{"Fecha", type date}, {"Valor", type number}}),
    Ordenado = Table.Sort(TipoFinal, {{"Fecha", Order.Descending}})
in
    Ordenado`,
          nota: "El parámetro codigo acepta valores como \"uf\", \"utm\", \"dolar\" o \"euro\". Si necesitas un año completo histórico, puedes adaptar la URL agregando & \"/2026\".",
        },
      ],
      captura: {
        id: "uf-utm-ipc-en-excel-automatico-paso-1",
        alt: "Editor de Power Query mostrando la función personalizada fnIndicador con el parámetro codigo y el ícono fx en el panel izquierdo",
        caption: "Función personalizada fnIndicador(codigo) lista en el panel de consultas de Power Query.",
        ratio: "16/9",
      },
    },
    {
      id: "uf-diaria-y-conversion",
      titulo: "Paso 2: Cargar la UF diaria, convertir UF↔CLP y aplicar formato visual",
      esPasoHowTo: true,
      resumenHowTo:
        "Invoca fnIndicador(\"uf\"), carga la tabla tblUF en Excel, aplica fórmulas de conversión UF a CLP y viceversa usando el valor de ejemplo del 21-nov-2026 ($41.377,93), y configura el formato \"UF \"#.##0,00.",
      parrafos: [
        "Con fnIndicador lista, selecciona la función en el panel izquierdo de Power Query, escribe uf en la caja de parámetro y presiona Invocar. Power Query creará una nueva consulta llamada Función invocada: renómbrala a tblUF y cárgala mediante Cerrar y cargar en... hacia una hoja llamada Indicadores_UF.",
        "A diferencia del dólar observado, la UF sí tiene valor publicado para todos los días de la semana, incluyendo sábados, domingos y feriados. Por ejemplo, al 21 de noviembre de 2026 el valor de referencia verificado de la UF es de $41.377,93 CLP (valor de ejemplo con fecha real verificada). Si un contrato de arriendo está pactado en 25,50 UF, el monto en pesos al 21-nov-2026 equivale a 25,50 × $41.377,93 = $1.055.137 CLP.",
        "Para que tus celdas en UF muestren claramente la unidad sin perder su naturaleza numérica (nunca escribas \"UF\" como texto dentro de la celda porque romperás las sumas), presiona Ctrl + 1 sobre el rango en UF, elige Personalizada y escribe el formato \"UF \"#.##0,00.",
      ],
      codigos: [
        {
          titulo: "Convertir un monto en UF (C2) a CLP según la fecha (B2)",
          lenguaje: "excel",
          codigo: `=REDONDEAR(C2*BUSCARX(B2;tblUF[Fecha];tblUF[Valor];;-1);0)`,
          codigoEn: `=ROUND(C2*XLOOKUP(B2,tblUF[Fecha],tblUF[Valor],,-1),0)`,
          nota: "El modo -1 actúa como red de seguridad por si alguien ingresa una fecha futura que aún no ha sido publicada.",
        },
        {
          titulo: "Convertir un monto en CLP (D2) a UF según la fecha (B2)",
          lenguaje: "excel",
          codigo: `=REDONDEAR(D2/BUSCARX(B2;tblUF[Fecha];tblUF[Valor];;-1);2)`,
          codigoEn: `=ROUND(D2/XLOOKUP(B2,tblUF[Fecha],tblUF[Valor],,-1),2)`,
          nota: "Aplica el formato numérico personalizado \"UF \"#.##0,00 sobre esta celda para ver por ejemplo UF 25,50.",
        },
      ],
      captura: {
        id: "uf-utm-ipc-en-excel-automatico-paso-2",
        alt: "Tabla tblUF cargada en Excel junto a una tabla de contratos convirtiendo UF a CLP con BUSCARX y formato personalizado UF #.##0,00",
        caption: "Conversión bidireccional UF↔CLP usando tblUF y formato numérico personalizado en Excel.",
        ratio: "16/9",
      },
    },
    {
      id: "utm-mensual-en-excel",
      titulo: "Paso 3: Traer la UTM mensual y cruzar fechas por inicio de mes",
      esPasoHowTo: true,
      resumenHowTo:
        "Invoca fnIndicador(\"utm\"), carga la tabla tblUTM y normaliza cualquier fecha de operación al día 1 de su mes con FIN.MES para obtener el valor exacto en pesos.",
      parrafos: [
        "Repite el proceso invocando fnIndicador con el texto utm, renombra la tabla resultante a tblUTM y cárgala en una hoja llamada Indicadores_UTM. En la serie que entrega la API, cada registro mensual viene fechado con el día 1 de ese mes (por ejemplo, 2026-11-01 para noviembre de 2026, cuyo valor de referencia verificado es de $72.440 CLP, usado aquí como ejemplo ilustrativo).",
        "Aquí aparece un tropiezo muy frecuente: si tu tabla de multas o remuneraciones tiene la fecha exacta de pago, digamos 21-nov-2026, y buscas esa fecha exacta en tblUTM[Fecha], Excel no la encontrará porque la tabla de UTM solo contiene el 01-nov-2026. La solución limpia es envolver la fecha buscada con FIN.MES(B2;-1)+1, que transforma cualquier día del mes en el primer día de ese mismo mes.",
      ],
      codigos: [
        {
          titulo: "Obtener la UTM del mes correspondiente a cualquier fecha en B2",
          lenguaje: "excel",
          codigo: `=BUSCARX(FIN.MES(B2;-1)+1;tblUTM[Fecha];tblUTM[Valor])`,
          codigoEn: `=XLOOKUP(EOMONTH(B2,-1)+1,tblUTM[Fecha],tblUTM[Valor])`,
          nota: "FIN.MES(fecha;-1)+1 calcula el último día del mes anterior y le suma 1 día, devolviendo siempre el día 1 del mes actual.",
        },
      ],
      captura: {
        id: "uf-utm-ipc-en-excel-automatico-paso-3",
        alt: "Hoja de cálculo mostrando tblUTM con fechas al día 1 de cada mes y fórmula BUSCARX con FIN.MES calculando el monto en pesos de una multa en UTM",
        caption: "Cruce de fechas de operación con la tabla mensual tblUTM mediante FIN.MES.",
        ratio: "16/9",
      },
    },
    {
      id: "ipc-y-reajuste-montos",
      titulo: "Paso 4: Reajustar montos con IPC y verificar la fuente en producción",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula la variación acumulada del IPC multiplicando factores (1 + variación mensual) con PRODUCTO, y revisa la advertencia crítica sobre la vigencia del endpoint de IPC.",
      parrafos: [
        "Cuando un contrato o tarifa se reajusta por IPC acumulado de un período (por ejemplo, los últimos 12 meses), nunca debes sumar los porcentajes mensuales de manera simple. La inflación es compuesta: si un mes subió 0,5% y el siguiente 0,4%, el factor acumulado es (1 + 0,005) × (1 + 0,004) − 1. En Excel, esa operación se resuelve en una sola fórmula usando PRODUCTO sobre un rango de variaciones mensuales expresadas en porcentaje (divididas por 100 si la tabla viene en puntos porcentuales como 0,4 en lugar de 0,004).",
        "Antes de llevar esta planilla a producción contable o RR. HH., presta mucha atención a la fuente del IPC: al 21 de noviembre de 2026, el endpoint público mindicador.cl/api/ipc devolvía como último registro disponible diciembre de 2025 (-0,2), es decir, presentaba un rezago importante respecto al año en curso. Por esa razón, para obtener el IPC mensual vigente en un entorno productivo debes consultar la API oficial BDE del Banco Central de Chile (buscando la serie mensual vigente con function=SearchSeries&frequency=MONTHLY) o descargar las variaciones mensuales directamente desde el Instituto Nacional de Estadísticas (INE).",
      ],
      codigos: [
        {
          titulo: "Calcular IPC acumulado de un rango mensual (valores ya en % decimal, ej. 0,004)",
          lenguaje: "excel",
          codigo: `=PRODUCTO(1+C2:C13)-1`,
          codigoEn: `=PRODUCT(1+C2:C13)-1`,
          nota: "En Excel 2016/2019 (sin matrices dinámicas) confirma esta fórmula con Ctrl + Shift + Enter. En Microsoft 365 y Excel 2021+ basta con Enter normal. Si la API entrega 0,4 en vez de 0,004, usa =PRODUCTO(1+C2:C13/100)-1.",
        },
        {
          titulo: "Aplicar el reajuste por IPC acumulado sobre un monto base en E2",
          lenguaje: "excel",
          codigo: `=REDONDEAR(E2*(1+F2);0)`,
          codigoEn: `=ROUND(E2*(1+F2),0)`,
          nota: "Donde F2 contiene el IPC acumulado calculado con PRODUCTO.",
        },
      ],
      captura: {
        id: "uf-utm-ipc-en-excel-automatico-paso-4",
        alt: "Tabla de variaciones mensuales de IPC en Excel con la fórmula PRODUCTO(1+rango)-1 calculando el reajuste acumulado sobre un contrato",
        caption: "Cálculo de inflación acumulada compuesta con PRODUCTO y monto reajustado.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "warning",
        titulo: "Verifica la vigencia del endpoint de IPC antes de usar en producción",
        texto:
          "Al 21-nov-2026, mindicador.cl/api/ipc entregaba como último dato dic-2025 (-0,2). Para cálculos reales de sueldos, arriendos o contratos que dependan del IPC del mes en curso, obtén la serie mensual desde la API BDE del Banco Central (SearchSeries) o desde el portal oficial del INE.",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Sumar directamente la columna de IPC mensual en vez de componerla",
      causa:
        "La inflación de cada mes se aplica sobre el nivel de precios ya reajustado del mes anterior; una suma lineal subestima o distorsiona el reajuste acumulado.",
      solucion:
        "Usa siempre =PRODUCTO(1+rango)-1 (o dividiendo por 100 si los porcentajes vienen como números enteros/decimales sin el símbolo %).",
    },
    {
      error: "Fórmula BUSCARX sobre tblUTM devuelve #N/D para fechas distintas al día 1",
      causa:
        "Las tablas mensuales de UTM e IPC solo tienen una fila por mes fechada en el primer día del mes (YYYY-MM-01).",
      solucion:
        "Normaliza la fecha buscada con FIN.MES(fecha;-1)+1 dentro del primer argumento de BUSCARX, o usa modo de coincidencia -1.",
    },
    {
      error: "Las celdas con \"UF\" escrita a mano impiden sumar columnas",
      causa:
        "Escribir \"UF 15,2\" como texto convierte la celda en una cadena no numérica y las funciones SUMA o multiplicaciones devuelven 0 o #¡VALOR!.",
      solucion:
        "Deja solo el número en la celda (15,2) y aplica el formato personalizado \"UF \"#.##0,00 desde Ctrl + 1.",
    },
    {
      error: "Fórmula PRODUCTO(1+C2:C13)-1 arroja #¡VALOR! en Excel 2016 o 2019",
      causa:
        "Las versiones anteriores a Microsoft 365 no evalúan matrices en línea automáticamente sin entrada matricial.",
      solucion:
        "Presiona Ctrl + Shift + Enter al confirmar la fórmula para que aparezcan llaves { } alrededor, o crea una columna auxiliar con =1+C2 y aplica PRODUCTO sobre ella.",
    },
  ],
  plantilla: {
    titulo: "Plantilla multifunción UF, UTM e IPC en Excel",
    descripcion:
      "Libro .xlsx con la función M fnIndicador, hojas separadas para UF y UTM, calculadora de conversión UF↔CLP y módulo de reajuste por IPC compuesto. Próximamente disponible para descarga.",
  },
  faqs: [
    {
      q: "¿Hasta qué fecha del mes está disponible el valor de la UF?",
      a: "El Banco Central publica la tabla de la UF cada mes alrededor del día 9, cubriendo desde el día 10 del mes actual hasta el día 9 del mes siguiente. Por eso puedes consultar la UF de los próximos días sin esperar a que llegue cada mañana.",
    },
    {
      q: "¿Puedo usar fnIndicador para traer también el dólar o el euro?",
      a: "Sí. La función fnIndicador(codigo) funciona con cualquier indicador soportado por mindicador.cl, como \"uf\", \"utm\", \"dolar\", \"euro\" o \"ivp\". Solo debes invocarla cambiando el parámetro de texto.",
    },
    {
      q: "¿Qué pasa si necesito la UF de hace tres años para revisar un contrato antiguo?",
      a: "El endpoint base mindicador.cl/api/uf entrega solo los últimos registros recientes. Para un año específico puedes consultar mindicador.cl/api/uf/2023 o bien conectarte a la API oficial BDE del Banco Central indicando firstdate=\"2023-01-01\".",
    },
    {
      q: "¿Cuántos decimales conviene usar al convertir UF a pesos chilenos?",
      a: "En Chile los pagos en pesos chilenos se redondean a entero (0 decimales) con REDONDEAR(...;0). Si conviertes de pesos a UF para registrar un contrato o deuda, lo habitual es trabajar con 2 o 4 decimales según lo estipulado en la escritura.",
    },
    {
      q: "¿Por qué la UF sube o baja si el IPC fue negativo?",
      a: "Porque la UF refleja exactamente la variación del IPC del mes anterior distribuida día a día durante el período del 10 al 9. Si un mes registra IPC negativo, la UF desciende levemente durante ese ciclo.",
    },
  ],
  relacionadas: [
    "dolar-observado-en-excel-automatico",
    "conectar-power-bi-api-banco-central",
    "liquidacion-de-sueldo-en-excel-chile",
  ],
  enlacesExternos: [
    {
      label: "API pública de indicadores económicos en Chile",
      url: "https://mindicador.cl",
      fuente: "mindicador.cl",
    },
    {
      label: "Portal oficial Base de Datos Estadísticos (BDE / SIETE)",
      url: "https://si3.bcentral.cl/siete",
      fuente: "Banco Central de Chile",
    },
    {
      label: "Información oficial de la Base de Datos Estadísticos (BDE)",
      url: "https://www.bcentral.cl/areas/estadisticas/base-de-datos-estadisticos-bde",
      fuente: "Banco Central de Chile",
    },
    {
      label: "Valores y fechas oficiales de UF y UTM",
      url: "https://www.sii.cl/valores_y_fechas/",
      fuente: "Servicio de Impuestos Internos (SII)",
    },
    {
      label: "Portal oficial de estadísticas del IPC",
      url: "https://www.ine.gob.cl",
      fuente: "Instituto Nacional de Estadísticas (INE)",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Calculadora y datos de inflación en Chile",
      href: "/datos/inflacion",
      descripcion: "Revisa series históricas de inflación y herramientas de reajuste en ProgramBI.",
    },
    {
      label: "Curso práctico de Excel",
      href: "/cursos/excel",
      descripcion: "Aprende Power Query, funciones matriciales y automatización financiera.",
    },
  ],
};

export default guia;
