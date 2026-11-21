import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "tabla-dinamica-en-excel",
  title: "Tabla dinámica en Excel: cómo se hace paso a paso (2026)",
  meta: "Aprende a crear tablas dinámicas en Excel: agrupar, filtrar, contar valores únicos, campos calculados, segmentaciones y gráficos dinámicos. Con ejemplos.",
  h1: "Cómo hacer una tabla dinámica en Excel paso a paso",
  subtitle:
    "Resume miles de filas de ventas, gastos o inventario en segundos sin escribir fórmulas repetitivas. Domina desde la preparación con Ctrl+T hasta el conteo de valores únicos con Modelo de datos, campos calculados, segmentaciones interactivas y la alternativa moderna con AGRUPARPOR y PIVOTARPOR en Excel 365.",
  keywordPrincipal: "tabla dinámica en excel",
  keywords: [
    "tabla dinámica en excel",
    "cómo hacer tabla dinámica",
    "contar valores únicos tabla dinámica",
    "campos calculados Excel",
    "segmentación de datos Excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Transformar una base plana de ventas en un reporte interactivo que agrupa por mes, cuenta clientes únicos, calcula márgenes con campos calculados y se filtra con botones visuales y gráficos vinculados.",
    herramienta: "Microsoft Excel (2016, 2021, 2024 o Microsoft 365)",
    tiempo: "25 minutos",
    bullets: [
      "Convertir tus datos en una Tabla oficial de Excel (Ctrl+T) para que el resumen crezca solo.",
      "Configurar los cuatro cuadrantes: Filas, Columnas, Valores y Filtros, más agrupación de fechas.",
      "Activar el Modelo de datos para habilitar el recuento distinto de clientes o facturas únicas.",
      "Sumar segmentaciones, escala de tiempo, gráfico dinámico y conocer AGRUPARPOR / PIVOTARPOR en Excel 365.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Preparar como Tabla",
      resumen: "Limpia encabezados y convierte el rango con Ctrl+T.",
      anchorId: "preparar-datos-tabla",
      icono: "table",
    },
    {
      numero: 2,
      titulo: "Crear y armar ejes",
      resumen: "Inserta la tabla dinámica y distribuye Filas, Columnas y Valores.",
      anchorId: "crear-configurar-ejes",
      icono: "layers",
    },
    {
      numero: 3,
      titulo: "Agrupar y únicos",
      resumen: "Agrupa fechas/tramos y cuenta clientes distintos con Modelo de datos.",
      anchorId: "agrupar-valores-unicos",
      icono: "database",
    },
    {
      numero: 4,
      titulo: "Cálculos y filtros",
      resumen: "Crea campos calculados, segmentaciones y gráfico dinámico.",
      anchorId: "campos-segmentaciones-grafico",
      icono: "chart",
    },
    {
      numero: 5,
      titulo: "Fórmulas modernas",
      resumen: "Compara tablas dinámicas frente a AGRUPARPOR y PIVOTARPOR.",
      anchorId: "alternativa-formulas-modernas",
      icono: "code",
    },
  ],
  requisitos: {
    version: "Microsoft Excel 2016 o superior (recomendado Microsoft 365 para AGRUPARPOR y PIVOTARPOR)",
    lista: [
      "Base de datos tabular sin filas ni columnas completamente vacías y con un único encabezado por columna.",
      "Excel de escritorio en Windows (recomendado para Modelo de datos y campos calculados completos) o macOS.",
      "Opcional: Excel en Microsoft 365 si deseas probar las fórmulas dinámicas AGRUPARPOR y PIVOTARPOR.",
    ],
    compatibilidadMacWeb:
      "Las tablas dinámicas clásicas, segmentaciones y gráficos dinámicos funcionan en Windows, macOS y Excel para la Web. Sin embargo, el Modelo de datos (Power Pivot / recuento distinto) está integrado de forma completa en Excel de escritorio para Windows; en Mac clásico la opción de Modelo de datos al crear la tabla dinámica puede no estar disponible según compilación.",
  },
  herramientasHowTo: ["Microsoft Excel"],
  insumosHowTo: ["Base de ventas tabular (tbVentas)", "Campo de fecha, cliente, categoría, costo y venta neta"],
  secciones: [
    {
      id: "preparar-datos-tabla",
      titulo: "1. Preparar los datos como Tabla de Excel (Ctrl+T)",
      esPasoHowTo: true,
      resumenHowTo:
        "Asegura una estructura tabular sin celdas combinadas y convierte tu base en una Tabla oficial de Excel con Ctrl+T.",
      parrafos: [
        "Antes de presionar el botón de Tabla dinámica, el ochenta por ciento del éxito se juega en cómo está ordenada tu hoja de origen. Excel necesita una base en formato tabular puro: una única fila de encabezados en la parte superior, sin celdas combinadas, sin columnas en blanco intercaladas y sin filas de subtotales o totales generales al final.",
        "Un paso que separa a los usuarios principiantes de quienes mantienen reportes mensuales sin dolor de cabeza es convertir el rango en una Tabla oficial de Excel presionando Ctrl+T (o desde Insertar → Tabla). Al hacerlo y darle un nombre descriptivo como tbVentas en la pestaña Diseño de tabla, cualquier fila nueva que pegues al mes siguiente quedará incluida automáticamente cuando actualices la tabla dinámica.",
        "Para seguir cada paso de esta guía en tu propio libro, crea una hoja llamada Datos y pega el siguiente conjunto de ventas de ejemplo a partir de la celda A1, luego presiona Ctrl+T y confirma que «La tabla tiene encabezados» está marcado.",
      ],
      codigos: [
        {
          titulo: "Dataset de ventas de ejemplo (pegar en Excel y usar Datos > Texto en columnas por coma)",
          lenguaje: "bash",
          codigo: `Fecha,Sucursal,Cliente_ID,Categoria,Unidades,Costo_Unitario,Precio_Unitario
2026-07-03,Santiago,CL-101,Notebooks,2,420000,590000
2026-07-08,Concepción,CL-102,Monitores,3,110000,175000
2026-07-15,Santiago,CL-101,Accesorios,5,12000,24900
2026-08-02,Valparaíso,CL-103,Notebooks,1,420000,590000
2026-08-11,Santiago,CL-104,Monitores,2,110000,175000
2026-08-19,Concepción,CL-102,Accesorios,4,12000,24900
2026-09-04,Valparaíso,CL-105,Notebooks,2,420000,590000
2026-09-10,Santiago,CL-101,Monitores,1,110000,175000
2026-09-22,Concepción,CL-106,Accesorios,6,12000,24900`,
          nota: "Si agregas dos columnas calculadas dentro de la Tabla llamada tbVentas: Total_Costo = [@Unidades]*[@[Costo_Unitario]] y Total_Venta = [@Unidades]*[@[Precio_Unitario]], podrás calcular margen real con exactitud.",
        },
      ],
      captura: {
        id: "tabla-dinamica-en-excel-paso-1",
        ratio: "16/9",
        alt: "Hoja de Excel con los datos de ventas convertidos en una Tabla oficial llamada tbVentas tras presionar Ctrl+T.",
        caption:
          "Convierte siempre el origen en Tabla (Ctrl+T) y nómbrala en Diseño de tabla para que las nuevas filas entren al actualizar.",
      },
    },
    {
      id: "crear-configurar-ejes",
      titulo: "2. Crear la tabla dinámica y dominar sus 4 cuadrantes",
      esPasoHowTo: true,
      resumenHowTo:
        "Inserta la tabla dinámica en una hoja nueva y distribuye los campos entre Filas, Columnas, Valores y Filtros.",
      parrafos: [
        "Con el cursor dentro de cualquier celda de tbVentas, ve a la pestaña Insertar → Tabla dinámica (o Tabla dinámica de una tabla o rango). En el cuadro de diálogo, verifica que el origen indique tbVentas, elige «Nueva hoja de cálculo» para mantener separado el reporte de los datos crudos y haz clic en Aceptar.",
        "A la derecha aparecerá el panel Campos de tabla dinámica dividido en cuatro cuadrantes inferiores. Entender qué va en cada caja es todo lo que necesitas para diseñar cualquier cruce:",
      ],
      lista: [
        "Filas: define las categorías que bajarán verticalmente (por ejemplo, Sucursal o Categoria). Si pones dos campos, Excel crea una jerarquía expandible.",
        "Columnas: despliega categorías hacia la derecha en formato matriz (por ejemplo, Meses o Sucursal arriba y Categoria a la izquierda).",
        "Valores: recibe exclusivamente lo que quieres resumir numéricamente (Suma de Total_Venta, Promedio de Precio_Unitario o Recuento de transacciones).",
        "Filtros: crea un selector superior global encima de la tabla (por ejemplo, filtrar todo el resumen por un Cliente_ID o año específico).",
      ],
      subsecciones: [
        {
          id: "formato-moneda-valores",
          titulo: "Ajustar formato numérico sin formatear celdas a mano",
          parrafos: [
            "Un error habitual es seleccionar la columna de la tabla dinámica y aplicarle formato peso desde Inicio, lo que suele perderse al filtrar o reorganizar campos. En lugar de eso, haz clic derecho sobre cualquier monto dentro de la tabla dinámica → Formato de número… (no Formato de celdas) y asigna Moneda o Contabilidad sin decimales para pesos chilenos.",
          ],
        },
      ],
      captura: {
        id: "tabla-dinamica-en-excel-paso-2",
        ratio: "16/9",
        alt: "Panel Campos de tabla dinámica en Excel mostrando Sucursal en Filas, Categoria en Columnas y Suma de Total_Venta en Valores.",
        caption:
          "Distribución clásica de los cuatro cuadrantes: los textos agrupan en Filas/Columnas y los montos se resumen en Valores.",
      },
    },
    {
      id: "agrupar-valores-unicos",
      titulo: "3. Agrupar fechas/números y contar valores únicos (Modelo de datos)",
      esPasoHowTo: true,
      resumenHowTo:
        "Agrupa fechas por meses o trimestres, crea tramos numéricos y activa el Modelo de datos para contar clientes distintos.",
      parrafos: [
        "Cuando arrastras una columna de Fecha hacia Filas, versiones recientes de Excel suelen agrupar automáticamente en Años, Trimestres y Meses. Si tu fecha aparece día por día, haz clic derecho sobre cualquier fecha dentro de la tabla dinámica → Agrupar… y selecciona Meses y Años (manteniendo ambos marcados para no mezclar julio de un año con julio del siguiente).",
        "El mismo comando Agrupar funciona sobre campos numéricos en Filas: si pones Precio_Unitario en Filas y haces clic derecho → Agrupar, puedes definir un inicio, un fin y un intervalo (por ejemplo, tramos cada $100.000) para construir un histograma de ventas sin fórmulas.",
      ],
      subsecciones: [
        {
          id: "contar-valores-unicos-modelo",
          titulo: "Cómo contar valores únicos (clientes o facturas distintas)",
          parrafos: [
            "Por defecto, si arrastras Cliente_ID al cuadrante Valores y eliges «Recuento», Excel contará cuántas filas/boletas existen (9 transacciones), no cuántos clientes únicos compraron (6 clientes distintos en nuestro ejemplo, porque CL-101 y CL-102 compraron más de una vez).",
            "Para habilitar el cálculo de valores únicos reales: al crear la tabla dinámica en Insertar → Tabla dinámica, marca la casilla inferior «Agregar estos datos al Modelo de datos» antes de presionar Aceptar. Luego arrastra Cliente_ID a Valores, haz clic derecho sobre la columna → Resumir valores por → Más opciones…, baja hasta el final de la lista y selecciona «Recuento distinto».",
          ],
        },
      ],
      captura: {
        id: "tabla-dinamica-en-excel-paso-3",
        ratio: "16/9",
        alt: "Cuadro de diálogo Configuración de campo de valor mostrando la opción Recuento distinto habilitada gracias al Modelo de datos.",
        caption:
          "La opción «Recuento distinto» solo aparece al final de la lista cuando marcas «Agregar estos datos al Modelo de datos» al crear la tabla.",
      },
    },
    {
      id: "campos-segmentaciones-grafico",
      titulo: "4. Campos calculados, segmentaciones, escala de tiempo y gráfico dinámico",
      esPasoHowTo: true,
      resumenHowTo:
        "Agrega métricas propias como porcentaje de margen, botones interactivos de filtro y un gráfico dinámico sincronizado.",
      parrafos: [
        "En una tabla dinámica tradicional (sin Modelo de datos, donde usas DAX), puedes crear nuevas métricas directamente desde la cinta Análisis de tabla dinámica → Cálculos → Campos, elementos y conjuntos → Campo calculado. Por ejemplo, para obtener el margen porcentual real sobre la venta sin promediar porcentajes fila a fila, crea un campo llamado Margen_Pct con la fórmula =(Total_Venta - Total_Costo) / Total_Venta y aplícale formato de porcentaje.",
        "Para que cualquier jefatura pueda filtrar el reporte sin tocar el panel lateral, agrega controles visuales desde Análisis de tabla dinámica → Filtrar:",
      ],
      lista: [
        "Insertar segmentación de datos: crea botones interactivos por Sucursal o Categoria. Si tienes dos tablas dinámicas basadas en el mismo origen, usa Conexiones de informes (clic derecho sobre la segmentación) para que un solo clic filtre ambas tablas a la vez.",
        "Insertar escala de tiempo: funciona únicamente sobre columnas de fecha válidas y permite deslizar por Días, Meses, Trimestres o Años con un clic.",
        "Gráfico dinámico: desde Análisis de tabla dinámica → Herramientas → Gráfico dinámico, inserta un gráfico de columnas o barras que se reorganiza automáticamente cada vez que filtras o agrupas la tabla.",
      ],
      captura: {
        id: "tabla-dinamica-en-excel-paso-4",
        ratio: "16/9",
        alt: "Hoja de Excel con una tabla dinámica de margen por sucursal, segmentación de datos por categoría, escala de tiempo mensual y gráfico dinámico.",
        caption:
          "Tablero liviano con tabla dinámica, campo calculado de margen, segmentación visual y gráfico sincronizado.",
      },
    },
    {
      id: "alternativa-formulas-modernas",
      titulo: "5. Alternativa moderna con fórmulas: AGRUPARPOR, PIVOTARPOR e IMPORTARDATOSDINAMICOS",
      parrafos: [
        "Aunque la tabla dinámica clásica sigue siendo la vía más rápida para explorar datos, exige presionar «Actualizar todo» cada vez que cambian los datos de origen y su diseño rígido a veces complica armar estados financieros a medida. En Microsoft 365, Excel incorporó dos funciones de matriz dinámica —AGRUPARPOR (GROUPBY) y PIVOTARPOR (PIVOTBY)— que replican tablas dinámicas mediante fórmulas vivas que se recalculan al instante.",
        "Además, si ya trabajas con una tabla dinámica clásica pero necesitas extraer una celda puntual hacia una carátula ejecutiva sin que se rompa cuando cambie el orden, puedes apoyarte en IMPORTARDATOSDINAMICOS (GETPIVOTDATA). A continuación tienes la sintaxis verificada en español (con punto y coma) e inglés (con coma).",
      ],
      codigos: [
        {
          titulo: "Resumen por sucursal con actualización automática (AGRUPARPOR / GROUPBY)",
          lenguaje: "excel",
          codigo: `=AGRUPARPOR(tbVentas[Sucursal]; tbVentas[Total_Venta]; SUMA; 3; 1; -2)`,
          codigoEn: `=GROUPBY(tbVentas[Sucursal], tbVentas[Total_Venta], SUM, 3, 1, -2)`,
          nota: "El argumento 3 muestra encabezados, 1 muestra total general al pie y -2 ordena de mayor a menor por la columna de valores.",
        },
        {
          titulo: "Matriz cruzada de sucursal vs categoría (PIVOTARPOR / PIVOTBY)",
          lenguaje: "excel",
          codigo: `=PIVOTARPOR(tbVentas[Sucursal]; tbVentas[Categoria]; tbVentas[Total_Venta]; SUMA; 3; 1; 0; 1)`,
          codigoEn: `=PIVOTBY(tbVentas[Sucursal], tbVentas[Categoria], tbVentas[Total_Venta], SUM, 3, 1, 0, 1)`,
          nota: "Requiere Excel en Microsoft 365. Si la tabla de origen recibe nuevas filas, la matriz desbordada crece sola sin presionar Actualizar.",
        },
        {
          titulo: "Extraer un cruce fijo desde una tabla dinámica existente (IMPORTARDATOSDINAMICOS)",
          lenguaje: "excel",
          codigo: `=IMPORTARDATOSDINAMICOS("Total_Venta"; $A$3; "Sucursal"; "Santiago")`,
          codigoEn: `=GETPIVOTDATA("Total_Venta", $A$3, "Sucursal", "Santiago")`,
          nota: "A3 debe apuntar a la esquina superior izquierda de la tabla dinámica. Útil para alimentar cuadros resumen sin depender de posiciones fijas de fila.",
        },
      ],
      tabla: {
        caption: "Comparativa práctica: Tabla dinámica clásica vs Fórmulas AGRUPARPOR / PIVOTARPOR.",
        encabezados: [
          "Criterio",
          "Tabla dinámica clásica",
          "Fórmulas AGRUPARPOR / PIVOTARPOR",
        ],
        filas: [
          [
            "Actualización al agregar filas",
            "Manual (clic derecho → Actualizar o Datos → Actualizar todo)",
            "Automática e instantánea en cuanto cambia tbVentas",
          ],
          [
            "Compatibilidad de versiones",
            "Todas las versiones de Excel (2016, 2019, 2021, 365, Mac y Web)",
            "Solo Microsoft 365 (y Excel para la Web actualizado)",
          ],
          [
            "Interactividad visual (clics)",
            "Segmentaciones, escala de tiempo y doble clic para ver detalle",
            "Sin botones nativos; requiere combinar con listas desplegables o FILTRAR",
          ],
          [
            "Recuento distinto integrado",
            "Sí, activando Modelo de datos en Windows",
            "Requiere pasar función lambda personalizada o función auxiliar",
          ],
        ],
      },
      alerta: {
        tipo: "tip",
        titulo: "Consejo de diseño limpio",
        texto:
          "Si compartes el archivo con clientes o jefaturas que usan Excel 2019 o 2021, quédate con la Tabla dinámica clásica: AGRUPARPOR y PIVOTARPOR mostrarán el error #¿NOMBRE? en versiones perpetuas antiguas.",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Al arrastrar montos a Valores aparece «Cuenta de Total_Venta» en lugar de «Suma»",
      causa:
        "La columna tiene al menos una celda vacía o un texto mezclado (como 'N/A' o un espacio), por lo que Excel asume que es texto y aplica Recuento.",
      solucion:
        "Limpia los textos o vacíos en la base de origen (reemplaza por 0 si corresponde), actualiza la tabla dinámica y cambia a Suma en Configuración de campo de valor.",
    },
    {
      error: "La opción «Agrupar» sobre fechas aparece deshabilitada o da error «No se puede agrupar esa selección»",
      causa:
        "Al menos una celda de la columna Fecha está guardada como texto o quedó en blanco.",
      solucion:
        "Filtra la columna Fecha en la tabla de origen para detectar textos o vacíos, conviértelos a fechas válidas de Excel y actualiza la tabla dinámica.",
    },
    {
      error: "Los datos nuevos pegados en la base no aparecen en la tabla dinámica",
      causa:
        "Creaste la tabla dinámica desde un rango fijo (por ejemplo, Datos!$A$1:$G$10) en vez de convertirla primero en Tabla (Ctrl+T), o olvidaste Actualizar.",
      solucion:
        "Convierte el origen en Tabla (Ctrl+T), apunta Cambiar origen de datos al nombre de la Tabla y presiona Datos → Actualizar todo.",
    },
    {
      error: "Un campo calculado de margen o porcentaje promedio arroja cifras absurdas",
      causa:
        "Creaste un campo calculado sobre una columna que ya venía dividida fila a fila (por ejemplo, sumando porcentajes individuales).",
      solucion:
        "Define el campo calculado usando los totales base: =(Total_Venta - Total_Costo) / Total_Venta, nunca sumando porcentajes precalculados.",
    },
  ],
  plantilla: {
    titulo: "Libro de práctica: Tabla dinámica + Segmentaciones + AGRUPARPOR",
    descripcion:
      "Próximamente podrás descargar aquí el libro .xlsx con la tabla tbVentas, la tabla dinámica armada con Modelo de datos y la pestaña comparativa con AGRUPARPOR y PIVOTARPOR.",
  },
  faqs: [
    {
      q: "¿Cómo actualizo una tabla dinámica automáticamente al abrir el archivo?",
      a: "Haz clic derecho sobre la tabla dinámica → Opciones de tabla dinámica → pestaña Datos y marca «Actualizar datos al abrir el archivo». Así te aseguras de ver cifras al día cada vez que abras el libro.",
    },
    {
      q: "¿Por qué no me aparece la opción «Recuento distinto» en Valores?",
      a: "Porque creaste la tabla dinámica de forma estándar sin marcar «Agregar estos datos al Modelo de datos» en el cuadro inicial. Crea una nueva tabla dinámica marcando esa casilla para habilitar Recuento distinto.",
    },
    {
      q: "¿Se puede hacer un campo calculado si activé el Modelo de datos?",
      a: "En tablas dinámicas conectadas al Modelo de datos, el botón clásico de «Campo calculado» se desactiva porque ese motor trabaja con medidas DAX desde Power Pivot. Si solo necesitas campos calculados simples, usa una tabla dinámica estándar sin Modelo de datos.",
    },
    {
      q: "¿Cómo evito que los anchos de columna se desordenen al filtrar la tabla dinámica?",
      a: "Haz clic derecho dentro de la tabla dinámica → Opciones de tabla dinámica → Diseño y formato, y desmarca «Autoajustar anchos de columnas al actualizar».",
    },
    {
      q: "¿Conviene usar AGRUPARPOR o Tabla dinámica en 2026?",
      a: "Usa Tabla dinámica cuando necesites exploración rápida, segmentaciones visuales o compatibilidad con cualquier versión de Excel. Usa AGRUPARPOR o PIVOTARPOR si todo tu equipo tiene Microsoft 365 y necesitas resúmenes que se actualicen solos sin presionar Actualizar.",
    },
  ],
  relacionadas: [
    "como-hacer-dashboard-en-excel",
    "control-de-gastos-en-excel",
    "formulas-de-excel-mas-usadas",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de la función AGRUPARPOR / GROUPBY en Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/office/troubleshoot/excel/",
      fuente: "Microsoft Learn",
    },
    {
      label: "Referencia de Excel y análisis tabular en Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/office/dev/add-ins/excel/",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
