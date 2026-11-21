import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "control-de-gastos-en-excel",
  title: "Control de gastos en Excel paso a paso (personal y hogar)",
  meta: "Crea tu control de ingresos y gastos en Excel con categorías, listas desplegables, tabla dinámica y gráfico mensual. Paso a paso y con fórmulas.",
  h1: "Cómo hacer un control de gastos en Excel paso a paso",
  subtitle:
    "Organiza tus finanzas personales o del hogar sin planillas rígidas por mes: registra todo en una sola tabla con listas desplegables dinámicas, compara presupuesto vs real y automatiza la carga de tu cartola bancaria.",
  keywordPrincipal: "como hacer un control de gastos en Excel",
  keywords: [
    "como hacer un control de gastos en Excel",
    "control de gastos personales Excel",
    "gastos mensuales Excel",
    "ingresos y gastos hogar Excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT20M",
  en30Segundos: {
    queLogras:
      "Un sistema de control de ingresos y gastos en Excel con catálogo de categorías, validación de datos sin errores de tipeo, tablero presupuesto vs real y segmentaciones por mes.",
    herramienta: "Excel (Tablas, UNICOS, Validación de datos, SUMAR.SI.CONJUNTO y Tabla Dinámica)",
    tiempo: "20 minutos",
    bullets: [
      "Reemplazas las doce pestañas separadas por una sola tabla histórica fácil de analizar.",
      "Creas listas desplegables que se actualizan solas cuando agregas una categoría nueva usando =UNICOS(tblCategorias[Categoría]).",
      "Comparas cuándo conviene resumir con SUMAR.SI.CONJUNTO y cuándo con Tabla Dinámica, y conectas Power Query para importar cartolas bancarias.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Catálogo de categorías",
      resumen: "Define qué registrar y arma tblCategorias.",
      anchorId: "que-registrar-y-categorias",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Tabla y desplegables",
      resumen: "Valida movimientos con lista dinámica UNICOS.",
      anchorId: "tabla-movimientos-validacion",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Resumen mensual",
      resumen: "Compara SUMAR.SI.CONJUNTO vs Tabla Dinámica.",
      anchorId: "resumen-categoria-y-mes",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Presupuesto vs real",
      resumen: "Mide desvíos por categoría con alertas visuales.",
      anchorId: "presupuesto-vs-real",
      icono: "check",
    },
    {
      numero: 5,
      titulo: "Gráficos y cartola",
      resumen: "Agrega segmentaciones e importa cartolas con Power Query.",
      anchorId: "graficos-y-cartola-power-query",
      icono: "chart",
    },
  ],
  requisitos: {
    version: "Excel 2021 o Microsoft 365 recomendado (para usar UNICOS; incluye alternativa compatible con Excel 2016/2019).",
    lista: [
      "Listado de categorías fijas y variables de tu hogar o finanzas personales.",
      "Opcional: archivo CSV o Excel de cartola mensual descargado desde tu banco.",
    ],
    compatibilidadMacWeb:
      "Las tablas, validación de datos, UNICOS, SUMAR.SI.CONJUNTO y tablas dinámicas funcionan tanto en Excel para Windows como en Excel para Mac y Excel para la Web.",
  },
  herramientasHowTo: [
    "Microsoft Excel (Windows, Mac o Web)",
    "Validación de datos y Tablas Dinámicas",
  ],
  insumosHowTo: [
    "Catálogo de categorías de ingresos y gastos",
    "Registro de movimientos o cartola bancaria",
  ],
  secciones: [
    {
      id: "que-registrar-y-categorias",
      titulo: "Paso 1: Qué registrar y cómo definir tu catálogo de categorías",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una hoja Config con la tabla tblCategorias que agrupe Tipo (Ingreso/Gasto), Categoría y Tope Mensual para evitar listas interminables.",
      parrafos: [
        "El motivo número uno por el que la gente abandona un control de gastos al segundo mes es el exceso de detalle: crear 40 categorías distintas o armar una hoja nueva para enero, otra para febrero y otra para marzo. Cuando quieres saber cuánto gastaste en supermercado en todo el año, terminas sumando doce pestañas a mano.",
        "La regla de oro es mantener una única tabla de movimientos para todo el año y un catálogo acotado de 8 a 12 categorías claras en una hoja llamada Config. Crea allí una tabla (Ctrl + T) llamada tblCategorias con tres columnas: Tipo (Ingreso o Gasto), Categoría (por ejemplo Sueldo, Vivienda, Supermercado, Transporte, Cuentas Básicas, Salud, Ocio, Ahorro) y PresupuestoMensual (monto tope en CLP, usando cifras de referencia como $350.000 ficticios para Supermercado o $120.000 ficticios para Cuentas Básicas).",
        "En cuanto a qué registrar exactamente, anota cada movimiento que altere tu liquidez disponible: compras con débito, pagos con tarjeta de crédito (al momento de la compra), transferencias electrónicas, giros en efectivo y abonos de sueldo o boletas de honorarios. No registres movimientos internos entre tus propias cuentas bancarias como si fueran ingresos o gastos reales, porque inflarían artificialmente tus totales mensuales.",
      ],
      captura: {
        id: "control-de-gastos-en-excel-paso-1",
        alt: "Hoja Config en Excel mostrando la tabla tblCategorias con columnas Tipo, Categoría y PresupuestoMensual",
        caption: "Catálogo maestro tblCategorias con tipos, categorías acotadas y presupuesto mensual objetivo.",
        ratio: "16/9",
      },
    },
    {
      id: "tabla-movimientos-validacion",
      titulo: "Paso 2: Tabla de movimientos con validación de datos dinámica (UNICOS)",
      esPasoHowTo: true,
      resumenHowTo:
        "Genera una lista derramada con =UNICOS(tblCategorias[Categoría]) y conéctala mediante validación de datos usando el operador # a la tabla tblGastos.",
      parrafos: [
        "Si un día escribes \"Supermercado\", otro \"super\" y otro \"Supermercado \", tus resúmenes se partirán en tres filas distintas. Para blindar el registro, crea una hoja Movimientos con la tabla tblGastos (Fecha, Tipo, Categoría, Medio de Pago, Descripción, Monto) y aplica formato de moneda CLP sin decimales en la columna Monto.",
        "En la hoja Config, en una celda libre (por ejemplo F2), escribe la fórmula =UNICOS(tblCategorias[Categoría]). Esto genera una lista dinámica que crece sola cada vez que agregas una categoría nueva. Luego selecciona la columna Categoría de tblGastos, ve a Datos > Validación de datos > Permitir: Lista, y en Origen escribe =Config!$F$2# (el símbolo # al final le indica a Excel que tome todo el rango derramado por UNICOS). Así garantizas que nadie pueda ingresar una categoría mal escrita en toda la planilla.",
      ],
      codigos: [
        {
          titulo: "Lista dinámica de categorías únicas para alimentar la validación de datos",
          lenguaje: "excel",
          codigo: `=UNICOS(tblCategorias[Categoría])`,
          codigoEn: `=UNIQUE(tblCategorias[Categoría])`,
          nota: "En Validación de datos > Origen escribe =Config!$F$2# (con el signo numeral). Si usas Excel 2016/2019 sin UNICOS, apunta directamente al rango =tblCategorias[Categoría] usando INDIRECTO.",
        },
      ],
      captura: {
        id: "control-de-gastos-en-excel-paso-2",
        alt: "Ventana de Validación de datos en Excel configurada como Lista con origen =Config!$F$2# conectado a la fórmula UNICOS",
        caption: "Lista desplegable dinámica en tblGastos conectada al rango derramado de UNICOS.",
        ratio: "16/9",
      },
    },
    {
      id: "resumen-categoria-y-mes",
      titulo: "Paso 3: Resumen por categoría y mes (SUMAR.SI.CONJUNTO vs Tabla Dinámica)",
      esPasoHowTo: true,
      resumenHowTo:
        "Agrega la columna Mes a tblGastos y elige entre construir un resumen fijo con SUMAR.SI.CONJUNTO o explorar libremente con una Tabla Dinámica.",
      parrafos: [
        "Al igual que en un flujo de caja, agrega una columna calculada Mes en tblGastos con =TEXTO([@Fecha];\"aaaa-mm\") (o con fecha de inicio de mes =FIN.MES([@Fecha];-1)+1) para agrupar cada compra en su mes correspondiente. A partir de aquí tienes dos caminos excelentes para resumir tus gastos: fórmulas con SUMAR.SI.CONJUNTO o una Tabla Dinámica.",
        "Si optas por Tabla Dinámica, haz clic dentro de tblGastos, ve a Insertar > Tabla dinámica, elige ubicarla en una hoja nueva llamada Analisis y arrastra Categoría a Filas, Mes a Columnas y Monto a Valores (con formato de moneda sin decimales $ #.##0). En pocos segundos tendrás la matriz completa de todo el año sin escribir ni una fórmula.",
        "¿Cuál conviene usar? La tabla comparativa siguiente te ayuda a decidir según cómo prefieres revisar tus números cada fin de mes:",
      ],
      tabla: {
        caption: "SUMAR.SI.CONJUNTO vs Tabla Dinámica en un control de gastos",
        encabezados: [
          "Criterio",
          "Fórmulas (SUMAR.SI.CONJUNTO)",
          "Tabla Dinámica",
        ],
        filas: [
          [
            "Actualización al ingresar un gasto",
            "Inmediata y automática en tiempo real",
            "Requiere clic derecho > Actualizar (o Ctrl + Alt + F5)",
          ],
          [
            "Diseño fijo de reporte (Presupuesto vs Real)",
            "Ideal: mantiene el orden exacto de tus filas y colores",
            "Menos flexible si mezclas columnas calculadas externas",
          ],
          [
            "Exploración rápida (por medio de pago o día)",
            "Requiere escribir nuevas fórmulas",
            "Instantánea arrastrando campos o agregando segmentadores",
          ],
          [
            "Riesgo de olvidar una categoría nueva",
            "Debes agregarla al resumen si no usas UNICOS",
            "Aparece sola al actualizar la tabla dinámica",
          ],
        ],
      },
      captura: {
        id: "control-de-gastos-en-excel-paso-3",
        alt: "Tabla Dinámica en Excel agrupando gastos por Categoría en filas y Mes en columnas desde tblGastos",
        caption: "Resumen mensual por categoría generado con Tabla Dinámica sobre tblGastos.",
        ratio: "16/9",
      },
    },
    {
      id: "presupuesto-vs-real",
      titulo: "Paso 4: Comparar presupuesto vs gasto real por categoría",
      esPasoHowTo: true,
      resumenHowTo:
        "Arma una hoja Resumen con las categorías de gasto, el presupuesto asignado desde tblCategorias, el gasto real del mes seleccionado y el porcentaje ejecutado.",
      parrafos: [
        "Saber que gastaste $380.000 ficticios en supermercado no dice mucho si no lo comparas contra tu meta. En una hoja Resumen, coloca una celda arriba (por ejemplo B2) con el mes a analizar, lista tus categorías de gasto y trae el gasto real del mes con SUMAR.SI.CONJUNTO. Al lado, muestra el Presupuesto Mensual usando BUSCARX sobre tblCategorias, la Diferencia (=Presupuesto - Real) y el % Ejecutado (=Real / Presupuesto).",
        "Aplica formato condicional de barras de datos o escala de color sobre el % Ejecutado: verde cuando estás bajo el 85%, amarillo entre 85% y 100%, y rojo cuando superas el 100% del presupuesto asignado. De esta manera, si tu presupuesto de ocio era de $100.000 ficticios y al día 18 del mes ya llevas $92.000, la alerta amarilla te avisa con tiempo para frenar gastos discrecionales antes del cierre.",
        "También conviene añadir una fila de tasa de ahorro al final del resumen: =(Ingresos_Reales - Gastos_Reales) / Ingresos_Reales. Medir ese porcentaje mes a mes te da una señal mucho más clara de salud financiera que mirar el saldo bancario aislado.",
      ],
      codigos: [
        {
          titulo: "Gasto real del mes seleccionado ($B$2) para la categoría en A6",
          lenguaje: "excel",
          codigo: `=SUMAR.SI.CONJUNTO(tblGastos[Monto];tblGastos[Categoría];A6;tblGastos[Mes];$B$2)`,
          codigoEn: `=SUMIFS(tblGastos[Monto],tblGastos[Categoría],A6,tblGastos[Mes],$B$2)`,
          nota: "Si también quieres filtrar por Tipo=\"Gasto\" para excluir ingresos, agrega el par tblGastos[Tipo];\"Gasto\".",
        },
      ],
      captura: {
        id: "control-de-gastos-en-excel-paso-4",
        alt: "Tabla comparativa Presupuesto vs Real por categoría en Excel con columnas Presupuesto, Gasto Real, Diferencia y % Ejecutado con formato condicional",
        caption: "Tablero Presupuesto vs Real con semáforo de cumplimiento por categoría.",
        ratio: "16/9",
      },
    },
    {
      id: "graficos-y-cartola-power-query",
      titulo: "Paso 5: Gráficos, segmentaciones e importación de cartola con Power Query",
      esPasoHowTo: true,
      resumenHowTo:
        "Inserta gráficos dinámicos con segmentadores por Mes y Medio de Pago, y conecta Power Query para no digitar a mano las compras de tu cartola bancaria.",
      parrafos: [
        "Desde tu Tabla Dinámica, ve a Analizar tabla dinámica > Insertar segmentación de datos y marca Mes y Medio de Pago (Débito, Crédito, Transferencia). Luego agrega un gráfico de barras horizontales ordenado de mayor a menor gasto para ver al instante en qué se va el dinero cada mes.",
        "Acompaña ese gráfico de barras con un gráfico de líneas de evolución mensual que compare tus ingresos totales frente a tus gastos totales a lo largo del año. Ver ambas curvas juntas te permite detectar rápidamente meses estacionales más caros —como marzo por permisos y matrículas, o septiembre y diciembre por celebraciones— y planificar ahorros previos.",
        "Cuando ya tengas el hábito formado, el siguiente salto de productividad es dejar de tipear compra por compra: descarga la cartola mensual de tu banco en CSV o Excel y usa Power Query para limpiar las glosas, estandarizar fechas y anexar los movimientos a tu tabla. Si quieres aprender a armar ese flujo automático paso a paso, revisa nuestra guía para [automatizar Excel con Power Query](/guias/automatizar-excel-con-power-query).",
      ],
      captura: {
        id: "control-de-gastos-en-excel-paso-5",
        alt: "Dashboard personal en Excel con gráfico de barras de gastos por categoría y segmentadores interactivos de Mes y Medio de Pago",
        caption: "Gráfico dinámico de gastos y segmentadores interactivos por mes y medio de pago.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "Evita duplicar gastos con tarjeta de crédito",
        texto:
          "Cuando pagas la cuenta total de tu tarjeta de crédito a fin de mes, ese pago es una transferencia entre cuentas, no un gasto nuevo. Registra cada compra individual en su categoría o registra solo el detalle de la cartola, pero nunca ambos a la vez.",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Validación de datos rechaza =Config!$F$2# diciendo que el origen evalúa a un error",
      causa:
        "La celda F2 no contiene una fórmula de matriz dinámica (UNICOS) sino un rango normal, o el rango derramado está vacío.",
      solucion:
        "Verifica que en Config!F2 esté escrita exactamente la fórmula =UNICOS(tblCategorias[Categoría]) y que devuelva al menos una categoría.",
    },
    {
      error: "Al agregar una compra nueva en tblGastos, la Tabla Dinámica no la muestra",
      causa:
        "Las tablas dinámicas en Excel no se recalculan solas al editar celdas; trabajan sobre una caché en memoria.",
      solucion:
        "Haz clic derecho sobre la Tabla Dinámica y presiona Actualizar, o usa Datos > Actualizar todo.",
    },
    {
      error: "Doble conteo al pagar la tarjeta de crédito",
      causa:
        "Se registraron las compras individuales hechas con tarjeta durante el mes y además se cargó como gasto el pago del estado de cuenta.",
      solucion:
        "Clasifica el pago de la tarjeta como \"Transferencia interna\" (fuera de las categorías de gasto) para conservar intactos tus totales reales.",
    },
    {
      error: "Fórmulas SUMAR.SI.CONJUNTO devuelven 0 aunque hay gastos ingresados en tblGastos",
      causa:
        "La celda de filtro $B$2 tiene el mes escrito en formato distinto al de la columna tblGastos[Mes] (por ejemplo \"noviembre\" frente a \"2026-11\").",
      solucion:
        "Estandariza ambos lados usando siempre el formato \"aaaa-mm\" (como \"2026-11\") o fechas reales del día 1 de cada mes con FIN.MES([@Fecha];-1)+1.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Control de Gastos Personales y del Hogar",
    descripcion:
      "Archivo .xlsx con hoja Config (tblCategorias y lista UNICOS), hoja Movimientos (tblGastos validada) y tablero Presupuesto vs Real con segmentadores. Próximamente disponible para descarga.",
  },
  faqs: [
    {
      q: "¿Es mejor usar signos negativos para los gastos o dejar todo en positivo?",
      a: "Es mucho más cómodo digitar todos los montos en positivo y usar la columna Tipo (\"Ingreso\" o \"Gasto\") para distinguirlos. Así evitas errores de teclado al ingresar montos en el celular o en el computador.",
    },
    {
      q: "¿Qué hago si no tengo UNICOS en mi versión de Excel?",
      a: "En Excel 2016 o 2019 puedes crear la lista desplegable apuntando directamente a =tblCategorias[Categoría] (si no hay categorías repetidas en esa tabla) o usando =INDIRECTO(\"tblCategorias[Categoría]\") en el cuadro de Validación de datos.",
    },
    {
      q: "¿Cómo registro gastos compartidos en pareja o familia?",
      a: "Agrega una columna Persona o Responsable en tblGastos. Con eso podrás usar una segmentación adicional en tu Tabla Dinámica para ver el total del hogar o filtrar cuánto gastó cada integrante.",
    },
    {
      q: "¿Cada cuánto tiempo conviene actualizar el control de gastos?",
      a: "Lo ideal es dedicar 5 minutos una vez a la semana o importar la cartola bancaria cada 15 días. Esperar al día 30 hace más difícil recordar en qué se gastó cada compra de supermercado o transferencia.",
    },
    {
      q: "¿Sirve este mismo modelo para controlar gastos de un emprendimiento pequeño?",
      a: "Para finanzas personales o del hogar funciona perfecto. Si manejas un emprendimiento o pyme con facturación a plazo y pagos de IVA (F29), te conviene dar el paso hacia un flujo de caja formal separado de tus gastos personales.",
    },
  ],
  relacionadas: [
    "como-hacer-presupuesto-en-excel",
    "como-hacer-flujo-de-caja-en-excel",
    "automatizar-excel-con-power-query",
  ],
  enlacesExternos: [
    {
      label: "Referencia oficial de validación de datos en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.validation",
      fuente: "Microsoft Learn",
    },
    {
      label: "Documentación oficial de tablas dinámicas en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.pivottable",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
