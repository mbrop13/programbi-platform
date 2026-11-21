import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "inventario-en-excel-entradas-y-salidas",
  title: "Inventario en Excel con entradas, salidas y stock mínimo",
  meta: "Arma un control de inventario en Excel con entradas y salidas, stock actual por producto, valorización y alerta de stock mínimo. Paso a paso.",
  h1: "Cómo hacer un inventario en Excel con entradas y salidas",
  subtitle:
    "Separa el maestro de productos del historial de movimientos, calcula el stock disponible en tiempo real con SUMAR.SI.CONJUNTO, valoriza tu bodega al costo promedio ponderado y activa alertas visuales de reposición.",
  keywordPrincipal: "como hacer un inventario en Excel",
  keywords: [
    "como hacer un inventario en Excel",
    "inventario entradas y salidas Excel",
    "control de stock Excel",
    "stock minimo Excel",
    "inventario con precios",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Un sistema de control de inventario en Excel con kardex de entradas y salidas, cálculo automático de stock actual por SKU, valorización de bodega y alertas de quiebre de stock.",
    herramienta: "Microsoft Excel (365, 2021 o Web)",
    tiempo: "25 minutos",
    bullets: [
      "Tabla maestra de productos (tblProductos) con SKU, stock inicial, stock mínimo y costo unitario.",
      "Kardex cronológico de movimientos (tblMovimientos) con validación de Entradas y Salidas.",
      "Cálculo automático de existencias mediante SUMAR.SI.CONJUNTO sin sobreescribir celdas a mano.",
      "Buscador rápido por código con BUSCARX y semáforo rojo cuando el stock cae bajo el mínimo.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Arquitectura del libro",
      resumen: "Define por qué separar Maestro de Productos y Movimientos evita descuadres.",
      anchorId: "estructura-maestro-movimientos",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Kardex de movimientos",
      resumen: "Registra cada compra, ajuste o venta en una tabla única cronológica.",
      anchorId: "registro-entradas-salidas",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Stock actual automático",
      resumen: "Suma entradas y resta salidas por SKU usando SUMAR.SI.CONJUNTO.",
      anchorId: "stock-actual-sumar-si-conjunto",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Valorización de bodega",
      resumen: "Calcula el costo promedio ponderado y el capital inmovilizado por producto.",
      anchorId: "valorizacion-costo-promedio",
      icono: "table",
    },
    {
      numero: 5,
      titulo: "Alertas de stock mínimo",
      resumen: "Configura la columna Estado con SI y formato condicional rojo de reposición.",
      anchorId: "alerta-stock-minimo",
      icono: "check",
    },
    {
      numero: 6,
      titulo: "Buscador y salto a BI",
      resumen: "Consulta cualquier SKU al instante con BUSCARX y evalúa cuándo migrar a Power BI.",
      anchorId: "busqueda-rapida-codigo",
      icono: "chart",
    },
  ],
  requisitos: {
    version: "Excel 365 o Excel 2021 (para BUSCARX); las fórmulas de stock y alertas funcionan desde Excel 2010 en adelante",
    lista: [
      "Microsoft Excel en escritorio (Windows o Mac) o Excel para la Web.",
      "Listado actual de tus productos con código único (SKU), unidad de medida y conteo físico inicial.",
      "Facturas de compra o notas de despacho recientes para comenzar a registrar movimientos.",
    ],
    compatibilidadMacWeb:
      "SUMAR.SI.CONJUNTO, SI, BUSCARX y el formato condicional funcionan sin diferencias en Windows, macOS y Excel Web. Recuerda usar Cmd+T en Mac para crear Tablas estructuradas.",
  },
  herramientasHowTo: ["Microsoft Excel 365 / 2021 / Web"],
  insumosHowTo: [
    "Maestro de productos con SKU y stock inicial",
    "Registro histórico de compras y ventas",
  ],
  secciones: [
    {
      id: "estructura-maestro-movimientos",
      titulo: "1. Estructura del inventario: Maestro de productos vs planilla única",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea la hoja Productos convertida en tabla tblProductos con SKU, descripción, categoría, stock inicial y stock mínimo.",
      parrafos: [
        "Quien intenta llevar un inventario en Excel por primera vez suele abrir una sola hoja con columnas como Stock_Ayer, Compras_Hoy, Ventas_Hoy y Stock_Final, y cada día borra y sobreescribe los números encima. Ese método funciona una semana, pero en cuanto ocurre una devolución, un error de digitación o necesitas saber cuánto vendiste el mes pasado, no queda rastro alguno de qué pasó.",
        "La solución profesional en Excel consiste en separar los datos en dos tablas distintas: una hoja Productos (el maestro o catálogo) donde cada SKU aparece una sola vez con sus atributos fijos, y una hoja Movimientos (el kardex) donde cada compra, venta, merma o ajuste ocupa una nueva fila hacia abajo sin borrar jamás el historial.",
        "En la hoja Productos, crea las columnas: SKU, Producto, Categoria, Unidad, Stock_Inicial, Stock_Minimo, Entradas, Salidas, Stock_Actual, Costo_Promedio, Valor_Inventario y Estado. Selecciona el rango y presiona Ctrl+T (Cmd+T en Mac) para convertirlo en una Tabla llamada tblProductos.",
      ],
      tabla: {
        caption: "Comparativa entre planilla única sobreescrita y arquitectura Maestro + Movimientos",
        encabezados: [
          "Criterio",
          "Planilla única (sobreescrita)",
          "Maestro + Movimientos (recomendada)",
        ],
        filas: [
          [
            "Trazabilidad histórica",
            "Nula; al editar el stock se pierde el historial del día anterior",
            "Completa; cada entrada y salida queda fechada con documento de respaldo",
          ],
          [
            "Riesgo de error humano",
            "Alto; una suma mal tecleada rompe el saldo para siempre",
            "Bajo; las existencias se recalculan solas con fórmulas",
          ],
          [
            "Cálculo de rotación y quiebres",
            "Imposible sin llevar otro archivo paralelo",
            "Directo desde la hoja Movimientos mediante tablas dinámicas",
          ],
          [
            "Escalabilidad hacia Power BI",
            "Requiere rehacer todo desde cero",
            "Inmediata; es exactamente el modelo dimensional (Dimensión + Hechos)",
          ],
        ],
      },
      captura: {
        id: "inventario-en-excel-entradas-y-salidas-paso-1",
        alt: "Hoja Productos en Excel convertida en tabla tblProductos con columnas SKU, Producto, Stock_Inicial, Stock_Minimo y columnas calculadas",
        caption: "Tabla maestra tblProductos donde cada SKU tiene una única fila de resumen.",
        ratio: "16/9",
      },
    },
    {
      id: "registro-entradas-salidas",
      titulo: "2. Crear el registro de entradas y salidas (kardex)",
      esPasoHowTo: true,
      resumenHowTo:
        "Construye la hoja Movimientos como tabla tblMovimientos con lista desplegable de SKU, tipo de movimiento (Entrada o Salida), cantidad positiva y costo unitario.",
      parrafos: [
        "Crea una segunda hoja llamada Movimientos y define siete columnas: Fecha, Documento (ej. FAC-412, BOL-980, AJU-01), SKU, Producto, Tipo, Cantidad y Costo_Unitario_Entrada. Convierte el rango en Tabla con Ctrl+T y nómbrala tblMovimientos.",
        "Para evitar que un digitador escriba 'entrada' con minúscula o invente un SKU inexistente, aplica Validación de datos en dos columnas. En SKU, configura Datos > Validación de datos > Lista apuntando a =INDIRECTO(\"tblProductos[SKU]\") (o al rango A2:A200 de Productos). En Tipo, crea una lista fija con exactamente dos valores: Entrada,Salida.",
        "Mantén siempre la columna Cantidad en números positivos (por ejemplo, 25 unidades tanto para una compra como para una venta). El signo lo controla la columna Tipo al momento de sumar, lo que evita errores frecuentes de usuarios que olvidan poner el signo menos en las salidas. En la columna Producto dentro de Movimientos, trae el nombre automáticamente con BUSCARX para confirmar visualmente que elegiste el código correcto.",
      ],
      codigos: [
        {
          titulo: "Autocompletar el nombre del producto al elegir el SKU en Movimientos",
          lenguaje: "excel",
          codigo: `=BUSCARX([@SKU];tblProductos[SKU];tblProductos[Producto];"SKU no existe")`,
          codigoEn: `=XLOOKUP([@SKU],tblProductos[SKU],tblProductos[Producto],"SKU not found")`,
          nota: "Al estar dentro de una Tabla estructurada, la referencia [@SKU] se copia automáticamente cada vez que agregas una nueva fila debajo.",
        },
      ],
      captura: {
        id: "inventario-en-excel-entradas-y-salidas-paso-2",
        alt: "Hoja Movimientos en Excel con tabla tblMovimientos, desplegable de Tipo Entrada o Salida, cantidades positivas y nombre traído por BUSCARX",
        caption: "Kardex cronológico tblMovimientos con validación de SKU y tipo de movimiento.",
        ratio: "16/9",
      },
    },
    {
      id: "stock-actual-sumar-si-conjunto",
      titulo: "3. Calcular el stock actual con SUMAR.SI.CONJUNTO",
      esPasoHowTo: true,
      resumenHowTo:
        "Vincula tblProductos con tblMovimientos usando SUMAR.SI.CONJUNTO para totalizar Entradas y Salidas por SKU y obtener el Stock_Actual.",
      parrafos: [
        "Volvemos a la hoja Productos para dar vida a las columnas de cálculo. En la columna Entradas queremos sumar todas las filas de tblMovimientos donde el SKU coincida con la fila actual y el Tipo sea exactamente \"Entrada\". La función ideal para evaluar múltiples criterios simultáneos es SUMAR.SI.CONJUNTO.",
        "En la columna Salidas aplicamos exactamente la misma lógica cambiando el segundo criterio a \"Salida\". Finalmente, en Stock_Actual sumamos el Stock_Inicial (el conteo físico con el que inauguraste la planilla) más las Entradas menos las Salidas.",
        "Gracias a que ambas hojas usan Tablas oficiales de Excel, nunca tendrás que arrastrar fórmulas ni preocuparte por si el kardex creció de 50 a 3.000 filas: las referencias estructuradas tblMovimientos[Cantidad] cubren automáticamente todo el historial nuevo.",
      ],
      codigos: [
        {
          titulo: "Total de Entradas por SKU en tblProductos",
          lenguaje: "excel",
          codigo: `=SUMAR.SI.CONJUNTO(tblMovimientos[Cantidad];tblMovimientos[SKU];[@SKU];tblMovimientos[Tipo];"Entrada")`,
          codigoEn: `=SUMIFS(tblMovimientos[Cantidad],tblMovimientos[SKU],[@SKU],tblMovimientos[Tipo],"Entrada")`,
        },
        {
          titulo: "Total de Salidas por SKU en tblProductos",
          lenguaje: "excel",
          codigo: `=SUMAR.SI.CONJUNTO(tblMovimientos[Cantidad];tblMovimientos[SKU];[@SKU];tblMovimientos[Tipo];"Salida")`,
          codigoEn: `=SUMIFS(tblMovimientos[Cantidad],tblMovimientos[SKU],[@SKU],tblMovimientos[Tipo],"Salida")`,
        },
        {
          titulo: "Fórmula de Stock_Actual en tblProductos",
          lenguaje: "excel",
          codigo: `=[@[Stock_Inicial]]+[@Entradas]-[@Salidas]`,
          codigoEn: `=[@[Stock_Inicial]]+[@Entradas]-[@Salidas]`,
          nota: "Si un SKU muestra stock negativo, significa que registraste una venta antes de ingresar la factura de compra o el stock inicial estaba incompleto.",
        },
      ],
      captura: {
        id: "inventario-en-excel-entradas-y-salidas-paso-3",
        alt: "Tabla tblProductos mostrando las columnas Entradas, Salidas y Stock_Actual calculadas automáticamente con SUMAR.SI.CONJUNTO",
        caption: "Cálculo en tiempo real de Entradas, Salidas y Stock_Actual para cada SKU.",
        ratio: "16/9",
      },
    },
    {
      id: "valorizacion-costo-promedio",
      titulo: "4. Valorizar el inventario por costo promedio de compra",
      esPasoHowTo: true,
      resumenHowTo:
        "Calcula el costo promedio ponderado de las compras registradas en Movimientos y multiplícalo por el Stock_Actual para conocer el valor de tu bodega.",
      parrafos: [
        "Saber cuántas unidades hay en bodega es solo la mitad del control; la otra mitad es saber cuánta plata hay inmovilizada en estantería. Como los precios de los proveedores cambian entre una compra y otra, tomar solo el último precio puede distorsionar tu margen.",
        "Para calcular un costo promedio ponderado simple en Excel sin macros, añade una columna auxiliar en tblMovimientos llamada Total_Compra con la fórmula =SI([@Tipo]=\"Entrada\";[@Cantidad]*[@[Costo_Unitario_Entrada]];0). Luego, en tblProductos, calcula el Costo_Promedio dividiendo la suma de Total_Compra de ese SKU por el total de unidades que entraron.",
        "Envuelve esa división en SI.ERROR: si un producto todavía tiene cero entradas registradas (solo cuenta con stock inicial), puedes indicar que tome un Costo_Inicial base o devuelva 0. Finalmente, multiplica Stock_Actual × Costo_Promedio en la columna Valor_Inventario y activa la Fila de totales de la tabla para ver la valorización completa de la bodega en la última línea.",
      ],
      codigos: [
        {
          titulo: "Costo promedio ponderado de entradas por SKU",
          lenguaje: "excel",
          codigo: `=SI.ERROR(SUMAR.SI.CONJUNTO(tblMovimientos[Total_Compra];tblMovimientos[SKU];[@SKU];tblMovimientos[Tipo];"Entrada")/[@Entradas];0)`,
          codigoEn: `=IFERROR(SUMIFS(tblMovimientos[Total_Compra],tblMovimientos[SKU],[@SKU],tblMovimientos[Tipo],"Entrada")/[@Entradas],0)`,
          nota: "Este cálculo pondera automáticamente el costo según el volumen de cada factura de compra ingresada.",
        },
        {
          titulo: "Valorización total por producto",
          lenguaje: "excel",
          codigo: `=[@[Stock_Actual]]*[@[Costo_Promedio]]`,
          codigoEn: `=[@[Stock_Actual]]*[@[Costo_Promedio]]`,
        },
      ],
      captura: {
        id: "inventario-en-excel-entradas-y-salidas-paso-4",
        alt: "Columnas Costo_Promedio y Valor_Inventario en tblProductos con fila de total general al pie de la tabla",
        caption: "Valorización de existencias al costo promedio ponderado y total general de bodega.",
        ratio: "16/9",
      },
    },
    {
      id: "alerta-stock-minimo",
      titulo: "5. Configurar alerta de stock mínimo con SI y formato condicional",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una columna Estado que clasifique cada SKU en Sin Stock, Reponer o OK, y resalta automáticamente las filas críticas con formato condicional.",
      parrafos: [
        "De nada sirve notar que un producto estrella se agotó cuando el cliente ya está pidiendo la cotización. La columna Stock_Minimo define el colchón de seguridad (por ejemplo, las ventas promedio de 7 días multiplicadas por el tiempo que demora tu proveedor en despachar).",
        "En la columna Estado de tblProductos escribe una fórmula condicional con SI anidado (o SI.CONJUNTO en Excel 2021/365) que evalúe tres escenarios en orden estricto: primero, si Stock_Actual <= 0 devuelve \"Sin stock\"; segundo, si Stock_Actual <= Stock_Minimo devuelve \"Reponer\"; de lo contrario devuelve \"OK\".",
        "Para que la alerta salte a la vista apenas abras el libro, selecciona toda la columna Estado y ve a Inicio > Formato condicional > Reglas para resaltar celdas > Texto que contiene. Crea una regla con relleno rojo oscuro para \"Sin stock\", relleno amarillo para \"Reponer\" y relleno verde suave para \"OK\".",
      ],
      codigos: [
        {
          titulo: "Estado de reposición con tres niveles de alerta",
          lenguaje: "excel",
          codigo: `=SI([@[Stock_Actual]]<=0;"Sin stock";SI([@[Stock_Actual]]<=[@[Stock_Minimo]];"Reponer";"OK"))`,
          codigoEn: `=IF([@[Stock_Actual]]<=0,"Sin stock",IF([@[Stock_Actual]]<=[@[Stock_Minimo]],"Reponer","OK"))`,
          nota: "El orden importa: evalúa primero <=0 para que un producto en cero no quede etiquetado simplemente como Reponer.",
        },
      ],
      captura: {
        id: "inventario-en-excel-entradas-y-salidas-paso-5",
        alt: "Columna Estado en tblProductos con etiquetas Sin stock en rojo, Reponer en amarillo y OK en verde mediante formato condicional",
        caption: "Alertas visuales automáticas de quiebre y reposición según el stock mínimo de cada SKU.",
        ratio: "16/9",
      },
    },
    {
      id: "busqueda-rapida-codigo",
      titulo: "6. Buscador rápido por código con BUSCARX",
      esPasoHowTo: true,
      resumenHowTo:
        "Arma una ficha de consulta rápida en la parte superior o en una hoja Consulta donde al digitar o escanear un SKU se muestren nombre, stock, valor y estado.",
      parrafos: [
        "Cuando tienes más de 150 productos en tblProductos, desplazarte hacia abajo o filtrar cada vez que alguien pregunta por teléfono '¿cuántas unidades quedan del SKU-048?' quita tiempo. Crear una mini ficha de consulta rápida resuelve esto en tres celdas.",
        "En una hoja nueva llamada Consulta (o en las filas superiores inmovilizadas sobre la tabla Productos), designa una celda destacada con borde azul para ingresar el SKU a buscar (por ejemplo, B2). Si trabajas con lector de código de barras USB, basta hacer clic en B2 y escanear el producto: el lector escribirá el código y presionará Enter solo.",
        "En las celdas contiguas usa BUSCARX para traer en simultáneo Producto, Stock_Actual, Stock_Minimo, Costo_Promedio y Estado. Como BUSCARX permite devolver un rango de varias columnas contiguas en Excel 365 (matriz desbordada), una sola fórmula puede poblar toda la ficha de respuesta.",
      ],
      codigos: [
        {
          titulo: "Consulta rápida de múltiples campos por SKU con BUSCARX",
          lenguaje: "excel",
          codigo: `=BUSCARX(B2;tblProductos[SKU];tblProductos[[Producto]:[Estado]];"SKU no registrado")`,
          codigoEn: `=XLOOKUP(B2,tblProductos[SKU],tblProductos[[Producto]:[Estado]],"SKU not found")`,
          nota: "En Excel 2021/365 esta fórmula desborda horizontalmente todas las columnas desde Producto hasta Estado. En versiones anteriores usa INDICE/COINCIDIR columna por columna.",
        },
      ],
      captura: {
        id: "inventario-en-excel-entradas-y-salidas-paso-6",
        alt: "Ficha de búsqueda rápida en Excel donde al ingresar un SKU en B2 se despliegan nombre, stock actual, costo y alerta de reposición",
        caption: "Buscador instantáneo por SKU compatible con ingreso manual o lector de código de barras.",
        ratio: "16/9",
      },
    },
    {
      id: "cuando-pasar-a-power-bi",
      titulo: "7. Cuándo dar el salto desde Excel hacia Power BI",
      parrafos: [
        "Este sistema en Excel soporta cómodamente entre 50 y 2.000 SKUs y decenas de miles de movimientos históricos. Sin embargo, existen señales claras de que tu operación superó la planilla: cuando el archivo demora en abrir por exceso de fórmulas SUMAR.SI.CONJUNTO, cuando necesitas cruzar inventario entre tres sucursales distintas o cuando quieres calcular análisis ABC de rotación y días de cobertura sin tocar fórmulas manuales.",
        "La buena noticia es que haber construido tu inventario con la separación Maestro (tblProductos) + Kardex (tblMovimientos) deja el archivo listo para conectarse directamente a Power BI sin reestructurar datos. Si ya estás en esa etapa, revisa nuestra plantilla de Control de Inventario y ABC en Power BI (/plantillas/control-inventario-stock-power-bi) para automatizar alertas de sobre-stock, quiebres por bodega y valorización histórica.",
      ],
      alerta: {
        tipo: "info",
        titulo: "Siguiente paso recomendado para bodegas en crecimiento",
        texto: "Si manejas múltiples bodegas o más de 30.000 movimientos al año, mantén el registro en CSV/ERP y analiza la rotación y clasificación ABC directamente en Power BI.",
      },
    },
  ],
  erroresComunes: [
    {
      error: "El stock actual aparece en negativo en algunos productos",
      causa: "Se registró una salida (venta) antes de cargar la entrada inicial o una factura de compra pendiente.",
      solucion: "Verifica el Stock_Inicial en tblProductos y filtra el SKU en tblMovimientos ordenado por fecha para detectar qué ingreso falta registrar.",
    },
    {
      error: "SUMAR.SI.CONJUNTO no suma un movimiento recién ingresado",
      causa: "El SKU se escribió con un espacio adelante o atrás, o la palabra en Tipo no coincide exactamente ('Entradas' en plural en vez de 'Entrada').",
      solucion: "Aplica Validación de datos tipo Lista tanto en SKU como en Tipo dentro de tblMovimientos para impedir variaciones de texto.",
    },
    {
      error: "La tabla tblMovimientos no expande sus fórmulas al agregar una fila nueva",
      causa: "Se dejaron filas completamente en blanco entre el último movimiento y el nuevo registro.",
      solucion: "Ingresa siempre el nuevo movimiento en la fila inmediatamente inferior a la tabla (donde aparece el pequeño marcador azul en la esquina inferior derecha).",
    },
    {
      error: "El Costo_Promedio muestra #¡DIV/0! en productos nuevos sin compras",
      causa: "Un producto tiene Stock_Inicial cargado manualmente pero cero filas de Entrada en tblMovimientos.",
      solucion: "Envuelve la fórmula en SI.ERROR(...;0) o registra el inventario inicial como un primer movimiento de Tipo 'Entrada' con su costo unitario de apertura.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Control de Inventario (Entradas, Salidas y Stock Mínimo)",
    descripcion:
      "Libro de Excel listo para usar con tablas tblProductos y tblMovimientos, fórmulas SUMAR.SI.CONJUNTO, valorización por costo promedio, semáforos y buscador por SKU.",
  },
  faqs: [
    {
      q: "¿Cómo registro un ajuste por merma, robo o conteo físico?",
      a: "Regístralo como una fila normal en tblMovimientos usando el documento 'AJU-01' (o similar). Si faltan unidades físicas, ingrésalo con Tipo 'Salida'; si sobran unidades encontradas en bodega, ingrésalo con Tipo 'Entrada'. Así nunca alteras las fórmulas.",
    },
    {
      q: "¿Puedo manejar precios de compra con IVA y sin IVA?",
      a: "En empresas afectas a IVA en Chile se recomienda llevar el Costo_Unitario_Entrada en valores netos (sin IVA), porque el IVA crédito fiscal se recupera y no forma parte del costo real de la mercadería. Si eres emprendedor sin contabilidad de IVA o compras con boleta, usa el valor bruto pagado.",
    },
    {
      q: "¿Cómo hago si un producto lo compro en cajas de 12 y lo vendo por unidad?",
      a: "Define siempre la columna Unidad en la unidad mínima en que vendes o controlas (por ejemplo, 'Unidad'). Cuando llegue una factura por 5 cajas de 12, registra directamente 60 unidades en Cantidad y divide el precio de la caja por 12 para obtener el Costo_Unitario_Entrada.",
    },
    {
      q: "¿Esta planilla sirve para controlar varias bodegas o sucursales?",
      a: "Sí, agregando una columna Bodega en tblMovimientos y creando una hoja resumen donde SUMAR.SI.CONJUNTO incluya tblMovimientos[Bodega] como tercer criterio. Si tienes más de tres sucursales, conviene evaluarlo en Power BI.",
    },
    {
      q: "¿Funciona si tengo Excel 2016 sin la función BUSCARX?",
      a: "Perfectamente. Solo cambia las fórmulas BUSCARX del nombre del producto y del buscador rápido por =SI.ERROR(INDICE(tblProductos[Producto];COINCIDIR([@SKU];tblProductos[SKU];0));\"SKU no existe\"). Todas las demás fórmulas funcionan desde Excel 2010.",
    },
  ],
  relacionadas: [
    "control-de-ventas-en-excel",
    "como-hacer-dashboard-en-excel",
    "como-hacer-flujo-de-caja-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de SUMAR.SI.CONJUNTO (SumIfs)",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.worksheetfunction.sumifs",
      fuente: "Microsoft Learn",
    },
    {
      label: "Referencia de formato condicional en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.formatconditions",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Plantilla de Control de Inventario y ABC en Power BI",
      href: "/plantillas/control-inventario-stock-power-bi",
      descripcion: "Lleva tu control de bodega a Power BI con análisis ABC, días de cobertura y alertas por sucursal.",
    },
  ],
};

export default guia;
