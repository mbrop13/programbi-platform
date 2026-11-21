import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "como-hacer-dashboard-en-excel",
  title: "Cómo hacer un dashboard en Excel desde cero (paso a paso)",
  meta: "Diseña un dashboard en Excel con tablas dinámicas, segmentaciones, KPIs y gráficos que se actualizan solos. Guía completa con un ejemplo de ventas.",
  h1: "Cómo hacer un dashboard en Excel desde cero",
  subtitle:
    "Convierte una tabla plana de ventas en un tablero de control interactivo con tablas dinámicas, segmentaciones conectadas, tarjetas KPI con IMPORTARDATOSDINAMICOS, diseño limpio en cuadrícula y actualización en un clic.",
  keywordPrincipal: "como hacer un dashboard en Excel",
  keywords: [
    "como hacer un dashboard en Excel",
    "dashboard en Excel desde cero",
    "dashboard con tablas dinamicas",
    "tablero de control Excel",
    "KPI en Excel",
  ],
  curso: "excel",
  cursoSecundario: "power-bi",
  herramienta: "Excel",
  nivel: "Intermedio",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT35M",
  en30Segundos: {
    queLogras:
      "Un tablero de control comercial en Excel separado en tres capas (Datos, Cálculos y Dashboard) que responde al instante a filtros de fecha, región y vendedor.",
    herramienta: "Microsoft Excel (365, 2021 o 2019)",
    tiempo: "35 minutos",
    bullets: [
      "Base de datos estructurada como Tabla (Ctrl+T) libre de celdas combinadas y subtotales manuales.",
      "Tres o cuatro tablas dinámicas en una hoja oculta alimentando gráficos dinámicos limpios.",
      "Segmentaciones de datos y escala de tiempo conectadas simultáneamente a todo el tablero.",
      "Tarjetas KPI enlazadas con IMPORTARDATOSDINAMICOS y actualización automatizada con Power Query.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Elegir los KPIs",
      resumen: "Selecciona 4 a 6 indicadores accionables según el área de negocio.",
      anchorId: "que-kpis-elegir",
      icono: "layers",
    },
    {
      numero: 2,
      titulo: "Normalizar los datos",
      resumen: "Convierte tu base en Tabla oficial (Ctrl+T) y limpia columnas mixtas.",
      anchorId: "preparar-datos-tabla",
      icono: "database",
    },
    {
      numero: 3,
      titulo: "Tablas y gráficos",
      resumen: "Crea tablas dinámicas de resumen y gráficos dinámicos sin ruido visual.",
      anchorId: "tablas-y-graficos-dinamicos",
      icono: "chart",
    },
    {
      numero: 4,
      titulo: "Filtros conectados",
      resumen: "Inserta segmentaciones y escala de tiempo vinculadas a todas las vistas.",
      anchorId: "segmentaciones-escala-tiempo",
      icono: "settings",
    },
    {
      numero: 5,
      titulo: "Tarjetas KPI",
      resumen: "Extrae cifras clave con IMPORTARDATOSDINAMICOS hacia tarjetas superiores.",
      anchorId: "tarjetas-kpi-importardatosdinamicos",
      icono: "code",
    },
    {
      numero: 6,
      titulo: "Diseño y automatización",
      resumen: "Aplica cuadrícula ejecutiva, automatiza con Power Query y evalúa Power BI.",
      anchorId: "diseno-cuadricula-jerarquia",
      icono: "sparkles",
    },
  ],
  requisitos: {
    version: "Excel 2016, 2019, 2021 o Microsoft 365 (la escala de tiempo y las segmentaciones requieren Excel 2013 o superior)",
    lista: [
      "Microsoft Excel de escritorio (Windows o Mac); Excel Web permite ver e interactuar con segmentaciones, pero tiene menos opciones de formato fino.",
      "Un archivo o tabla transaccional de ejemplo (por ejemplo, ventas con Fecha, Sucursal, Vendedor, Categoría, Unidades, Venta_Neta y Costo).",
    ],
    compatibilidadMacWeb:
      "Las tablas dinámicas, gráficos dinámicos, segmentaciones e IMPORTARDATOSDINAMICOS funcionan en Windows y macOS. Power Query también está disponible en Excel para Mac (Microsoft 365) para importar CSV/Excel, aunque con menos conectores de bases de datos que Windows.",
  },
  herramientasHowTo: ["Microsoft Excel 2016+ / 365", "Power Query (integrado en Excel)"],
  insumosHowTo: ["Base transaccional de ventas en formato tabular"],
  secciones: [
    {
      id: "que-kpis-elegir",
      titulo: "1. Qué KPIs elegir antes de dibujar el primer gráfico",
      parrafos: [
        "El error número uno al armar un dashboard en Excel es empezar por los gráficos en lugar de empezar por las preguntas que el gerente o el equipo necesita responder el lunes en la mañana. Llenar una pantalla con doce gráficos coloridos no informa: distrae. Un buen tablero responde en cinco segundos cómo vamos frente a la meta, dónde está la desviación y qué segmento la explica.",
        "Antes de tocar el mouse, delimita entre cuatro y seis KPIs principales acompañados de dos o tres dimensiones de corte (tiempo, sucursal, categoría o responsable). Si tu audiencia es comercial, no le muestres el detalle contable de remuneraciones; si es financiera, prioriza margen y liquidez por sobre clics de campañas.",
      ],
      tabla: {
        caption: "Guía de KPIs y gráficos recomendados por área funcional",
        encabezados: [
          "Área",
          "KPIs principales (Tarjetas)",
          "Dimensiones de corte",
          "Gráficos que mejor funcionan",
        ],
        filas: [
          [
            "Comercial / Ventas",
            "Venta Neta, Margen Bruto %, Ticket Promedio, Cumplimiento Meta %",
            "Mes, Sucursal, Vendedor, Categoría",
            "Línea de tendencia mensual + barras horizontales Top 5 productos",
          ],
          [
            "Finanzas",
            "EBITDA, Flujo Neto, Días de Cobro (DSO), Desviación Ppto %",
            "Centro de Costo, Unidad de Negocio, Mes",
            "Cascada de resultados + columnas agrupadas Real vs Presupuesto",
          ],
          [
            "Operaciones / Bodega",
            "Rotación de Stock, Quiebres %, OTIF (entregas a tiempo), Valor Bodega",
            "Bodega, Proveedor, Familia SKU",
            "Pareto 80/20 + barras apiladas de estado de stock",
          ],
          [
            "Recursos Humanos",
            "Dotación Activa, Rotación Mensual %, Ausentismo %, Horas Extra",
            "Área, Jefatura, Tipo de Contrato",
            "Línea de evolución de dotación + barras por departamento",
          ],
        ],
      },
      alerta: {
        tipo: "tip",
        titulo: "Regla de los 5 segundos",
        texto: "Si alguien mira tu dashboard por primera vez y tarda más de cinco segundos en saber si el mes va bien o mal, sobran elementos o falta una comparación contra meta o período anterior.",
      },
    },
    {
      id: "preparar-datos-tabla",
      titulo: "2. Preparar los datos como Tabla oficial de Excel (Ctrl+T)",
      esPasoHowTo: true,
      resumenHowTo:
        "Limpia tu base transaccional eliminando filas vacías y celdas combinadas, y conviértela en Tabla oficial llamada tblVentas con Ctrl+T.",
      parrafos: [
        "Todo dashboard estable en Excel respeta una arquitectura de tres hojas separadas: Datos (la base cruda), Calculos (las tablas dinámicas que resumen la información) y Dashboard (la vitrina visual limpia). Jamás pongas las tablas dinámicas en la misma hoja del diseño final, porque al filtrar una tabla su tamaño cambia y puede pisar o desplazar gráficos.",
        "En la hoja Datos, revisa que la base tenga formato estrictamente tabular: una sola fila de encabezados en la fila 1, cero celdas combinadas, cero filas de subtotales intermedios y cada columna con un único tipo de dato (fechas reales en Fecha, números limpios en Venta_Neta y Costo). Si te falta el Margen en pesos, añade una columna calculada =[@[Venta_Neta]]-[@Costo].",
        "Haz clic dentro de cualquier celda de la base y presiona Ctrl+T (Cmd+T en Mac). Asegúrate de que 'La tabla tiene encabezados' esté marcado, acepta y ve a Diseño de tabla > Nombre de tabla para llamarla tblVentas. A partir de este momento, cualquier fila nueva que pegues debajo quedará incluida automáticamente cuando actualices el tablero.",
      ],
      captura: {
        id: "como-hacer-dashboard-en-excel-paso-1",
        alt: "Base de ventas en Excel convertida en tabla oficial tblVentas con columnas Fecha, Sucursal, Vendedor, Categoria, Venta_Neta y Margen",
        caption: "Capa de Datos normalizada como Tabla estructurada tblVentas sin celdas combinadas.",
        ratio: "16/9",
      },
    },
    {
      id: "tablas-y-graficos-dinamicos",
      titulo: "3. Crear las tablas dinámicas y gráficos dinámicos de apoyo",
      esPasoHowTo: true,
      resumenHowTo:
        "Genera tablas dinámicas en la hoja Calculos a partir de tblVentas y construye gráficos dinámicos limpios sin botones grises ni leyenda redundante.",
      parrafos: [
        "Con el cursor dentro de tblVentas, ve a Insertar > Tabla dinámica y elige colocarla en una hoja nueva llamada Calculos. Para un dashboard comercial sólido bastan cuatro tablas dinámicas en esa hoja (dejando al menos 4 columnas o filas libres entre cada una para evitar colisiones al expandirse):",
        "1) Tabla de KPIs globales: sin filas ni columnas, solo Valores con Suma de Venta_Neta, Suma de Costo, Suma de Margen y Recuento de ID_Venta. 2) Tendencia mensual: Fecha agrupada por Meses en Filas y Suma de Venta_Neta en Valores (gráfico de líneas con marcadores). 3) Ventas por Sucursal o Canal: Sucursal en Filas y Venta_Neta en Valores ordenados de mayor a menor (gráfico de columnas o barras horizontales). 4) Top 5 Categorías o Productos: Categoria en Filas con filtro 'Diez mejores > Superiores 5' (gráfico de barras horizontales).",
        "Al insertar cada gráfico dinámico desde Analizar tabla dinámica > Gráfico dinámico, límpialo de inmediato: haz clic derecho sobre cualquier botón gris del gráfico (como 'Suma de Venta_Neta') y elige 'Ocultar todos los botones de campo en gráfico'. Borra las líneas de cuadrícula horizontales, quita el borde exterior del gráfico y, si solo hay una serie, elimina la leyenda porque el título del gráfico ya explica qué estás mostrando. Corta (Ctrl+X) cada gráfico limpio y pégalo (Ctrl+V) en la hoja Dashboard.",
      ],
      captura: {
        id: "como-hacer-dashboard-en-excel-paso-2",
        alt: "Hoja Calculos con tres tablas dinámicas ordenadas y gráfico dinámico limpio con botones de campo ocultos",
        caption: "Capa de Cálculos con tablas dinámicas independientes alimentando los gráficos del tablero.",
        ratio: "16/9",
      },
    },
    {
      id: "segmentaciones-escala-tiempo",
      titulo: "4. Conectar segmentaciones y escala de tiempo a todo el dashboard",
      esPasoHowTo: true,
      resumenHowTo:
        "Inserta segmentaciones de datos y una escala de tiempo en la hoja Dashboard y vincúlalas a todas las tablas dinámicas mediante Conexiones de informes.",
      parrafos: [
        "Un gráfico estático es una foto; un dashboard real permite explorar la causa de una caída haciendo dos clics. Haz clic sobre uno de tus gráficos en la hoja Dashboard, ve a Analizar gráfico dinámico > Insertar segmentación de datos y marca Sucursal y Vendedor. Repite el paso eligiendo Insertar escala de tiempo y marca Fecha.",
        "Por defecto, cada segmentación recién creada solo filtra la tabla dinámica desde la cual la insertaste, dejando los demás gráficos congelados. Para que todo el tablero reaccione al unísono, haz clic derecho sobre la segmentación de Sucursal > Conexiones de informes y marca las casillas de TODAS las tablas dinámicas de tu hoja Calculos. Haz exactamente lo mismo con la segmentación de Vendedor y con la Escala de tiempo.",
        "Para que la botonera se vea profesional, selecciona la segmentación, ve a la pestaña Segmentación > Columnas y ajústala a 2 o 3 columnas según el ancho de tu barra lateral o superior. En Configuración de segmentación de datos, desmarca 'Mostrar encabezado' si el contexto es obvio o personaliza un título corto, y activa 'Ocultar elementos sin datos' para mantener los filtros limpios.",
      ],
      captura: {
        id: "como-hacer-dashboard-en-excel-paso-3",
        alt: "Ventana Conexiones de informes de Excel mostrando todas las tablas dinámicas vinculadas a la misma segmentación de datos",
        caption: "Conexiones de informes activadas para que un solo clic filtre simultáneamente todos los gráficos y KPIs.",
        ratio: "16/9",
      },
    },
    {
      id: "tarjetas-kpi-importardatosdinamicos",
      titulo: "5. Construir tarjetas KPI dinámicas con IMPORTARDATOSDINAMICOS",
      esPasoHowTo: true,
      resumenHowTo:
        "Diseña tarjetas superiores de métricas clave vinculadas a la tabla dinámica de resumen mediante IMPORTARDATOSDINAMICOS (GETPIVOTDATA).",
      parrafos: [
        "Las tarjetas KPI en la parte superior del tablero comunican los totales ejecutivos sin obligar a leer ejes de gráficos. Aunque podrías enlazar una celda directamente con =Calculos!B4, esa referencia fija puede romperse si la tabla dinámica cambia de forma. La función IMPORTARDATOSDINAMICOS (GETPIVOTDATA en inglés) resuelve esto leyendo el valor por el nombre del campo, sin importar si la celda se movió.",
        "Para generar la fórmula sin memorizar su sintaxis, ve a una celda libre de la hoja Dashboard (por ejemplo, C4), escribe el signo = y haz clic directamente en el total de Venta_Neta dentro de tu primera tabla dinámica en la hoja Calculos. Excel escribirá automáticamente la función IMPORTARDATOSDINAMICOS apuntando a ese campo.",
        "Una vez que tengas los valores en celdas de Excel (Venta Neta, Margen $, Margen % calculado como Margen/Venta, y Cantidad de Ventas), puedes diseñar la tarjeta de dos formas: directamente sobre celdas con fondo blanco, borde sutil y fuente grande, o insertando una Forma (rectángulo con esquinas redondeadas) cuyo texto esté vinculado en la barra de fórmulas a la celda KPI (ej. =C4). Al filtrar por sucursal o mes en las segmentaciones, todas las tarjetas se recalcularán al instante.",
      ],
      codigos: [
        {
          titulo: "Extraer Venta Neta desde tabla dinámica con IMPORTARDATOSDINAMICOS",
          lenguaje: "excel",
          codigo: `=IMPORTARDATOSDINAMICOS("Venta_Neta";Calculos!$A$3)`,
          codigoEn: `=GETPIVOTDATA("Venta_Neta",Calculos!$A$3)`,
          nota: "El segundo argumento ($A$3) es la celda de esquina superior izquierda de la tabla dinámica de KPIs globales en la hoja Calculos.",
        },
        {
          titulo: "Calcular Margen % seguro sobre las celdas extraídas",
          lenguaje: "excel",
          codigo: `=SI.ERROR(IMPORTARDATOSDINAMICOS("Margen";Calculos!$A$3)/IMPORTARDATOSDINAMICOS("Venta_Neta";Calculos!$A$3);0)`,
          codigoEn: `=IFERROR(GETPIVOTDATA("Margen",Calculos!$A$3)/GETPIVOTDATA("Venta_Neta",Calculos!$A$3),0)`,
        },
      ],
      captura: {
        id: "como-hacer-dashboard-en-excel-paso-4",
        alt: "Cuatro tarjetas KPI superiores en el dashboard mostrando Venta Neta, Margen Bruto, Margen % y Transacciones vinculadas con IMPORTARDATOSDINAMICOS",
        caption: "Tarjetas KPI conectadas con IMPORTARDATOSDINAMICOS que se actualizan con cada segmentación.",
        ratio: "16/9",
      },
    },
    {
      id: "diseno-cuadricula-jerarquia",
      titulo: "6. Diseño visual: cuadrícula, paleta de colores y jerarquía",
      esPasoHowTo: true,
      resumenHowTo:
        "Organiza el tablero sobre un lienzo gris claro sin líneas de cuadrícula, con tarjetas blancas alineadas y máximo dos colores de acento.",
      parrafos: [
        "La diferencia entre una hoja recargada y un dashboard ejecutivo está en el orden visual. Sigue el patrón de lectura natural en 'Z': arriba a la izquierda va el título del reporte y el filtro de período; en la franja superior, las 4 tarjetas KPI; en la zona media, la evolución temporal (el gráfico más ancho); y en la zona inferior, los desgloses por sucursal y categoría.",
        "Para lograr un acabado limpio sin herramientas externas: ve a la pestaña Vista y desmarca 'Líneas de cuadrícula' y 'Encabezados' en la hoja Dashboard. Pinta el fondo completo de la hoja con un gris muy suave (#F1F5F9 o el gris más claro de tu paleta) y deja los fondos de tus gráficos y tarjetas en blanco puro (#FFFFFF) con borde gris tenue.",
        "Usa un solo color primario corporativo (por ejemplo, azul marino o verde petróleo) para la serie principal de datos y reserva un color de acento (naranja o rojo suave) únicamente para resaltar alertas o metas no cumplidas. Evita gráficos 3D, degradados pesados y gráficos circulares con más de 4 categorías.",
      ],
      captura: {
        id: "como-hacer-dashboard-en-excel-paso-5",
        alt: "Dashboard completo en Excel con fondo gris claro, líneas de cuadrícula ocultas, tarjetas KPI blancas, filtros a la izquierda y dos gráficos alineados",
        caption: "Resultado final del tablero aplicando cuadrícula limpia, contraste tarjeta-fondo y jerarquía visual.",
        ratio: "16/9",
      },
    },
    {
      id: "actualizacion-power-query",
      titulo: "7. Automatizar la carga de nuevos meses con Power Query",
      esPasoHowTo: true,
      resumenHowTo:
        "Conecta la tabla de datos a un archivo CSV o carpeta mensual usando Power Query para que el dashboard se actualice con Datos > Actualizar todo.",
      parrafos: [
        "Si cada cierre de mes tienes que abrir un CSV exportado de tu ERP, borrar columnas sobrantes, corregir fechas y copiar y pegar debajo de tblVentas, tarde o temprano cometerás un error manual. Power Query (disponible en la pestaña Datos > Obtener datos) automatiza esa limpieza para siempre.",
        "Conecta Power Query a tu archivo fuente o a una carpeta donde guardas los cierres mensuales (Datos > Obtener datos > Desde un archivo > Desde una carpeta). Dentro del editor de Power Query aplica una sola vez los pasos de limpieza: quitar columnas innecesarias, asegurar el tipo Fecha y Número entero, y cerrar y cargar en la hoja Datos como Tabla.",
        "Una vez configurado, tu flujo mensual se reduce a guardar el nuevo archivo en la carpeta y presionar Datos > Actualizar todo (o Ctrl+Alt+F5) en Excel: Power Query importará los nuevos registros y todas las tablas dinámicas, gráficos y tarjetas KPI del dashboard se refrescarán en segundos.",
      ],
      captura: {
        id: "como-hacer-dashboard-en-excel-paso-6",
        alt: "Editor de Power Query en Excel mostrando los pasos aplicados a la derecha para limpiar ventas antes de cargar al dashboard",
        caption: "Flujo repetible en Power Query para alimentar el dashboard sin copiar y pegar manualmente.",
        ratio: "16/9",
      },
    },
    {
      id: "excel-vs-power-bi",
      titulo: "8. Cuándo pasar tu dashboard de Excel a Power BI",
      parrafos: [
        "Excel es imbatible cuando el equipo ya domina las hojas de cálculo, el volumen de filas es manejable (bajo 100.000 registros) y necesitas distribuir un archivo autónomo por correo o SharePoint sin licencias adicionales. Además, permite hacer simulaciones rápidas tipo 'qué pasa si' cambiando celdas de supuestos en el acto.",
        "No obstante, cuando necesitas cruzar cinco bases distintas (ventas, inventario, presupuesto, metas y cobranza), publicar enlaces web seguros con permisos por vendedor (Row-Level Security) o programar refrescos automáticos diarios sin abrir el archivo en tu computador, Power BI toma la delantera. Si estás evaluando esa migración, revisa nuestra comparativa detallada de Power BI vs Excel (/guias/power-bi-vs-excel) o da tus primeros pasos en los cursos de Power BI (/cursos/power-bi).",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Al hacer clic en una segmentación solo cambia un gráfico y los demás quedan iguales",
      causa: "La segmentación está conectada únicamente a la tabla dinámica desde la cual fue creada.",
      solucion: "Haz clic derecho sobre la segmentación > Conexiones de informes y marca todas las tablas dinámicas de la hoja Calculos.",
    },
    {
      error: "Al agregar nuevas filas a la base y actualizar, la tabla dinámica no las muestra",
      causa: "La base original era un rango estático ($A$1:$G$500) en vez de una Tabla oficial (Ctrl+T), o faltó presionar Actualizar todo.",
      solucion: "Convierte la base en Tabla (tblVentas), verifica en Analizar tabla dinámica > Cambiar origen de datos que apunte a tblVentas y usa Datos > Actualizar todo.",
    },
    {
      error: "IMPORTARDATOSDINAMICOS devuelve #¡REF! cuando filtro por un vendedor sin ventas en un mes",
      causa: "Al filtrar, la tabla dinámica oculta la fila o columna buscada y la función no encuentra el campo.",
      solucion: "Envuelve siempre la fórmula en SI.ERROR(IMPORTARDATOSDINAMICOS(...);0) para mostrar 0 en lugar de #¡REF! cuando un cruce no tenga registros.",
    },
    {
      error: "Los gráficos se deforman o cambian de ancho de columna cada vez que filtro",
      causa: "La propiedad del gráfico permite que se mueva y cambie de tamaño con las celdas, o las tablas dinámicas están en la misma hoja del dashboard.",
      solucion: "Mantén las tablas dinámicas en la hoja Calculos. En cada gráfico del Dashboard, haz clic derecho > Formato del área del gráfico > Propiedades y marca 'No mover ni cambiar tamaño con celdas'.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de Dashboard Comercial Interactivo en Excel",
    descripcion:
      "Libro estructurado en tres capas (Datos, Cálculos y Dashboard) con 4 tablas dinámicas, tarjetas KPI con IMPORTARDATOSDINAMICOS, segmentaciones conectadas y paleta ejecutiva lista para reemplazar con tus ventas.",
  },
  faqs: [
    {
      q: "¿Puedo hacer este dashboard sin usar IMPORTARDATOSDINAMICOS?",
      a: "Sí. Si prefieres no usar IMPORTARDATOSDINAMICOS, puedes desactivar 'Generar GetPivotData' en Analizar tabla dinámica > Opciones y referenciar celdas fijas, o usar SUMAR.SI.CONJUNTO directamente sobre tblVentas, aunque en ese caso las tarjetas no reaccionarán a las segmentaciones de las tablas dinámicas.",
    },
    {
      q: "¿Cómo hago para que los gráficos se vean bien si alguien abre el Excel en otra pantalla?",
      a: "Diseña todo el dashboard dentro de un ancho fijo (por ejemplo, columnas A hasta P con zoom al 100 %) y activa Vista > Ver saltos de página o ajusta todo a 1 página de ancho en Diseño de página. Así evitas que los gráficos queden cortados en monitores más pequeños.",
    },
    {
      q: "¿Se pueden conectar segmentaciones a tablas normales que no son tablas dinámicas?",
      a: "Sí, desde Excel 2013 puedes insertar una segmentación directamente sobre una Tabla de Excel (Diseño de tabla > Insertar segmentación de datos), pero esa segmentación solo filtra visualmente esa tabla y no se conecta por 'Conexiones de informes' a otras tablas dinámicas.",
    },
    {
      q: "¿Por qué desaparece la opción de Escala de tiempo al intentar insertarla?",
      a: "La Escala de tiempo solo aparece disponible si la columna Fecha de tu base tiene formato de fecha real en Excel y está colocada o reconocida en el caché de la tabla dinámica. Si las fechas entraron como texto ('15/03/2026' alineado a la izquierda), conviértelas primero a fecha con Texto en columnas o Power Query.",
    },
    {
      q: "¿Cómo protejo el dashboard para que los usuarios solo puedan usar los filtros sin borrar fórmulas?",
      a: "Oculta las hojas Calculos y Datos (o protégelas con contraseña). En la hoja Dashboard, selecciona las segmentaciones y gráficos, abre Formato > Propiedades y desmarca 'Bloqueado'; luego ve a Revisar > Proteger hoja permitiendo únicamente 'Seleccionar celdas desbloqueadas' y 'Usar tabla dinámica y gráfico dinámico'.",
    },
  ],
  relacionadas: [
    "dashboard-de-ventas-en-power-bi-paso-a-paso",
    "power-bi-vs-excel",
    "automatizar-excel-con-power-query",
  ],
  enlacesExternos: [
    {
      label: "Segmentaciones de datos (SlicerCache) en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.slicercache",
      fuente: "Microsoft Learn",
    },
    {
      label: "Referencia oficial de tablas dinámicas y funciones de Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.pivottable",
      fuente: "Microsoft Learn",
    },
    {
      label: "Referencia de funciones de hoja de cálculo en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.worksheetfunction",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Power BI vs Excel: cuándo dar el salto",
      href: "/guias/power-bi-vs-excel",
      descripcion: "Comparativa técnica para decidir si mantener tu tablero en Excel o migrar a Power BI.",
    },
    {
      label: "Cursos de Power BI en ProgramBI",
      href: "/cursos/power-bi",
      descripcion: "Aprende modelado estrella, DAX y publicación de tableros ejecutivos en la nube.",
    },
  ],
};

export default guia;
