import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "control-de-ventas-en-excel",
  title: "Control de ventas en Excel: registro, reporte y metas",
  meta: "Registra tus ventas en Excel y obtén reportes por mes, producto y vendedor con tablas dinámicas, metas y ranking. Paso a paso, listo para pasar a Power BI.",
  h1: "Cómo llevar el control de ventas en Excel",
  subtitle:
    "Construye un registro comercial limpio con validaciones, arma reportes por mes y vendedor en segundos con tablas dinámicas, compara metas contra ventas reales y genera un ranking automático.",
  keywordPrincipal: "control de ventas en Excel",
  keywords: [
    "control de ventas en Excel",
    "plantilla Excel ventas",
    "registro de ventas Excel",
    "reporte de ventas por vendedor Excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Un libro de control de ventas escalable con registro validado, tabla dinámica por mes/producto/vendedor, seguimiento de cumplimiento de metas y ranking Top N automático.",
    herramienta: "Microsoft Excel (Microsoft 365 recomendado para ORDENARPOR y TOMAR)",
    tiempo: "25 minutos",
    bullets: [
      "Estructurar una tabla tabular larga en vez de una matriz con meses en columnas.",
      "Blindar el ingreso con listas desplegables y fórmulas de total por línea.",
      "Crear reportes dinámicos por período, categoría y vendedor sin copiar ni pegar.",
      "Comparar meta vs real y extraer el Top 5 automático con ORDENARPOR y TOMAR.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Estructura tabular",
      resumen: "Define columnas normalizadas para analizar sin límites.",
      anchorId: "estructura-datos-ventas",
      icono: "database",
    },
    {
      numero: 2,
      titulo: "Registro validado",
      resumen: "Agrega listas desplegables y cálculo automático de monto neto.",
      anchorId: "registro-con-validaciones",
      icono: "table",
    },
    {
      numero: 3,
      titulo: "Tabla dinámica",
      resumen: "Resume ventas por mes, producto y vendedor en tres clics.",
      anchorId: "reporte-tabla-dinamica",
      icono: "chart",
    },
    {
      numero: 4,
      titulo: "Meta vs real",
      resumen: "Cruza ventas reales contra presupuesto y calcula cumplimiento.",
      anchorId: "seguimiento-meta-vs-real",
      icono: "check",
    },
    {
      numero: 5,
      titulo: "Ranking dinámico",
      resumen: "Ordena vendedores y productos estrella con ORDENARPOR y TOMAR.",
      anchorId: "ranking-ordenarpor-tomar",
      icono: "sparkles",
    },
    {
      numero: 6,
      titulo: "Salto a Power BI",
      resumen: "Prepara tu archivo para conectarlo a un dashboard interactivo.",
      anchorId: "siguiente-nivel-power-bi",
      icono: "layers",
    },
  ],
  requisitos: {
    version: "Excel 2016 o superior (Microsoft 365 para ORDENARPOR y TOMAR)",
    lista: [
      "Microsoft Excel en Windows, macOS o Excel para la Web.",
      "Listado base de productos/servicios, vendedores y metas comerciales del período.",
      "Microsoft 365 si deseas usar las funciones dinámicas ORDENARPOR y TOMAR (en versiones anteriores se reemplaza con ordenar la tabla dinámica).",
    ],
    compatibilidadMacWeb:
      "Las tablas estructuradas, validaciones de datos y tablas dinámicas funcionan en Windows, Mac y Excel Web. ORDENARPOR y TOMAR requieren Microsoft 365 o Excel para la Web.",
  },
  herramientasHowTo: [
    "Microsoft Excel (Microsoft 365 o Excel 2016+)",
  ],
  insumosHowTo: [
    "Catálogo de vendedores y productos",
    "Registro de transacciones de venta y metas mensuales",
  ],
  secciones: [
    {
      id: "estructura-datos-ventas",
      titulo: "1. Diseñar la estructura de datos correcta (tabla larga vs matriz)",
      esPasoHowTo: true,
      resumenHowTo:
        "Organiza el registro de ventas en formato tabular largo (una fila por transacción o ítem vendido) en lugar de repartir los meses en columnas.",
      parrafos: [
        "El error más frecuente al armar un control de ventas en Excel es diseñar la hoja de ingreso como si fuera un reporte final: vendedores en las filas y los doce meses del año repartidos en columnas hacia la derecha (Enero, Febrero, Marzo...). Ese formato «bonito» a la vista se vuelve un callejón sin salida apenas quieres filtrar por producto, analizar un canal de venta o conectar el archivo a Power BI.",
        "Para que tus datos trabajen a tu favor, debes usar una tabla larga normalizada: cada fila representa una operación o línea de venta individual, y cada atributo ocupa una columna fija. Si vendiste tres productos distintos en una misma boleta o factura, registras tres filas compartiendo el mismo número de documento.",
        "Esta estructura permite que el archivo crezca durante años sin tener que reescribir fórmulas ni insertar columnas nuevas cada mes. Además, es exactamente el formato que esperan las tablas dinámicas de Excel, Power Query y Power BI.",
      ],
      tabla: {
        caption: "Comparación entre tabla larga normalizada y tabla matriz con meses en columnas",
        encabezados: [
          "Criterio",
          "Tabla larga normalizada (recomendada)",
          "Tabla «bonita» con meses en columnas",
        ],
        filas: [
          [
            "Cómo se registra",
            "Una fila por venta con columna Fecha, Vendedor, Producto y Monto.",
            "Se sobreescribe o suma manualmente en la celda del mes.",
          ],
          [
            "Tablas dinámicas",
            "Compatibilidad total: agrupa por día, mes, trimestre o año automático.",
            "Imposible agrupar fechas; exige transformar con Power Query antes.",
          ],
          [
            "Agregar nuevos meses o años",
            "Solo agregas filas abajo; las fórmulas y reportes se mantienen.",
            "Obliga a insertar columnas y corregir rangos de suma.",
          ],
          [
            "Detalle por factura o cliente",
            "Conserva cada transacción individual y su historial completo.",
            "Pierde el detalle; solo guarda un total agregado por mes.",
          ],
          [
            "Conexión con Power BI",
            "Directa y lista para modelar medidas DAX.",
            "Requiere anular dinamización (Unpivot) en cada carga.",
          ],
        ],
      },
      captura: {
        id: "control-de-ventas-en-excel-paso-1",
        alt: "Comparativa visual en Excel entre una tabla tabular larga con columnas fijas y una matriz mensual tradicional",
        caption:
          "Estructura recomendada: cada fila es una transacción y los atributos (Fecha, Vendedor, Producto) viven en columnas fijas.",
        ratio: "16/9",
      },
    },
    {
      id: "registro-con-validaciones",
      titulo: "2. Construir la hoja Ventas con validaciones y cálculo automático",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una hoja Catálogos para vendedores y productos, convierte el registro en Tabla de Excel (tblVentas) y aplica listas desplegables para evitar errores de tipeo.",
      parrafos: [
        "Antes de ingresar la primera venta, crea una hoja llamada Catalogos con dos listas pequeñas: una columna con los nombres oficiales de tus vendedores y otra con tus productos o líneas de negocio (junto a su precio unitario de lista si manejas precios estándar). Tener un catálogo central evita que en una fila alguien escriba «María» y en otra «Maria » con espacio al final, lo que luego dividiría a la misma vendedora en dos filas distintas en el reporte.",
        "En la hoja principal llamada Ventas, define los encabezados en la fila 1: Fecha, Mes, NroDocumento, Cliente, Vendedor, Categoria, Producto, Cantidad, PrecioUnitario, DescuentoPct y TotalNeto. Convierte el rango en una Tabla de Excel presionando Ctrl + T y asígnale el nombre tblVentas en Diseño de tabla.",
        "Aplica Validación de datos en las columnas Vendedor y Producto (pestaña Datos > Validación de datos > Permitir: Lista) apuntando a las columnas de tu hoja Catalogos. Si usas una Tabla para los catálogos, las listas desplegables crecerán automáticamente cuando incorpores nuevos vendedores o productos.",
      ],
      listaOrdenada: [
        "En la hoja Catalogos, crea tblVendedores (columna Vendedor) y tblProductos (columnas Producto, Categoria, PrecioLista).",
        "En la hoja Ventas, crea tblVentas con las columnas de transacción.",
        "Configura Validación de datos tipo Lista en Vendedor y Producto apuntando a los rangos de Catalogos.",
        "En Fecha, agrega validación de tipo Fecha (por ejemplo, mayor o igual a 01-01-2024) y formato dd-mm-aaaa.",
        "Ingresa las fórmulas automáticas en Mes, Categoria (opcional con BUSCARX) y TotalNeto para reducir digitación manual.",
      ],
      codigos: [
        {
          titulo: "Calcular TotalNeto por línea en tblVentas",
          lenguaje: "excel",
          codigo: "=REDONDEAR([@Cantidad]*[@PrecioUnitario]*(1-[@DescuentoPct]); 0)",
          codigoEn: "=ROUND([@Cantidad]*[@PrecioUnitario]*(1-[@DescuentoPct]), 0)",
          nota: "Redondea a 0 decimales para trabajar en pesos chilenos (CLP) sin centavos ocultos que descuadren sumas.",
        },
        {
          titulo: "Traer automáticamente la Categoría desde tblProductos",
          lenguaje: "excel",
          codigo: "=BUSCARX([@Producto]; tblProductos[Producto]; tblProductos[Categoria]; \"Sin categoría\")",
          codigoEn: "=XLOOKUP([@Producto], tblProductos[Producto], tblProductos[Categoria], \"Sin categoría\")",
          nota: "En Excel 2016 o 2019 puedes usar BUSCARV junto a SI.ERROR.",
        },
      ],
      captura: {
        id: "control-de-ventas-en-excel-paso-2",
        alt: "Hoja Ventas en Excel mostrando la tabla tblVentas con lista desplegable abierta en la columna Vendedor y fórmula de TotalNeto",
        caption:
          "Registro blindado con listas desplegables y cálculo automático de TotalNeto por fila.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "No escribas el signo pesos a mano",
        texto:
          "Ingresa los precios siempre como números puros (por ejemplo 45990) y aplica formato Moneda o Contabilidad sin decimales. Si escribes '$ 45.990' como texto, Excel no podrá sumarlo.",
      },
    },
    {
      id: "reporte-tabla-dinamica",
      titulo: "3. Generar reportes por mes, producto y vendedor con tabla dinámica",
      esPasoHowTo: true,
      resumenHowTo:
        "Inserta una tabla dinámica basada en tblVentas para cruzar ventas por mes, vendedor y categoría, y añade segmentaciones de datos para filtrar de forma visual.",
      parrafos: [
        "Con tblVentas funcionando, nunca más tendrás que armar resúmenes copiando y pegando datos al final del mes. Haz clic en cualquier celda dentro de tblVentas, ve a la pestaña Insertar > Tabla dinámica y elige ubicarla en una hoja nueva llamada Reporte. Al apuntar al nombre de la tabla (tblVentas) en lugar de un rango fijo como A1:K500, cada nueva venta quedará incluida apenas presiones Actualizar todo.",
        "Para obtener el reporte mensual por vendedor, arrastra Vendedor al área Filas, Fecha al área Columnas (Excel agrupará automáticamente por Años y Meses) y TotalNeto al área Valores. Haz clic derecho sobre un número en el área de valores, entra a Formato de número y elige Moneda sin decimales.",
        "Puedes insertar una segunda tabla dinámica en la misma hoja Reporte (copiando y pegando la primera y cambiando sus campos) para ver el desglose por Categoría y Producto. Luego, desde Analizar tabla dinámica > Insertar segmentación de datos, agrega botones interactivos de Año, Mes y Vendedor, y conéctalos a ambas tablas mediante Conexiones de informes.",
      ],
      lista: [
        "Filas: Vendedor (o Producto en la segunda tabla dinámica).",
        "Columnas: Meses (agrupado desde el campo Fecha).",
        "Valores: Suma de TotalNeto (con formato CLP $ #.##0) y Recuento de NroDocumento para medir cantidad de operaciones.",
        "Segmentación de datos: Año y Categoría conectados a todas las tablas dinámicas de la hoja.",
      ],
      captura: {
        id: "control-de-ventas-en-excel-paso-3",
        alt: "Hoja Reporte en Excel con tabla dinámica de ventas por vendedor y mes junto a segmentadores de datos de Año y Categoría",
        caption:
          "Reporte dinámico por vendedor y mes con botones de segmentación conectados.",
        ratio: "16/9",
      },
    },
    {
      id: "seguimiento-meta-vs-real",
      titulo: "4. Comparar Meta vs Real y calcular porcentaje de cumplimiento",
      esPasoHowTo: true,
      resumenHowTo:
        "Crea una tabla pequeña de metas por vendedor y mes, trae la venta real con SUMAR.SI.CONJUNTO y destaca desviaciones con formato condicional.",
      parrafos: [
        "Saber cuánto vendiste es solo la mitad del control comercial; la otra mitad es saber qué tan cerca o lejos quedaste del objetivo. Para evitar mezclar metas dentro de la tabla de transacciones, crea una tabla independiente llamada tblMetas (en la hoja Metas o en el mismo Reporte) con columnas Vendedor, MesInicio (fecha del día 1 de cada mes, ej. 01-11-2026) y Meta.",
        "En una cuarta columna llamada VentaReal, usa SUMAR.SI.CONJUNTO sobre tblVentas filtrando por Vendedor y por el rango de fechas del mes completo (desde MesInicio hasta FIN.MES(MesInicio; 0)). De esta forma no necesitas crear columnas auxiliares de mes en tblVentas si prefieres mantenerla lo más liviana posible.",
        "Luego agrega dos columnas finales: Diferencia (=VentaReal - Meta) y CumplimientoPct (=SI.ERROR(VentaReal / Meta; 0)) en formato Porcentaje. Aplica Formato condicional > Conjuntos de íconos o Barras de datos sobre CumplimientoPct para identificar de inmediato quién superó el 100% y quién requiere apoyo.",
      ],
      codigos: [
        {
          titulo: "Sumar ventas reales del mes para un vendedor usando fechas límite",
          lenguaje: "excel",
          codigo: "=SUMAR.SI.CONJUNTO(tblVentas[TotalNeto]; tblVentas[Vendedor]; [@Vendedor]; tblVentas[Fecha]; \">=\"&[@MesInicio]; tblVentas[Fecha]; \"<=\"&FIN.MES([@MesInicio]; 0))",
          codigoEn: "=SUMIFS(tblVentas[TotalNeto], tblVentas[Vendedor], [@Vendedor], tblVentas[Fecha], \">=\"&[@MesInicio], tblVentas[Fecha], \"<=\"&EOMONTH([@MesInicio], 0))",
          nota: "FIN.MES([@MesInicio]; 0) calcula automáticamente el último día del mes (28, 29, 30 o 31) sin errores en años bisiestos.",
        },
        {
          titulo: "Porcentaje de cumplimiento seguro ante metas en cero",
          lenguaje: "excel",
          codigo: "=SI.ERROR([@VentaReal]/[@Meta]; 0)",
          codigoEn: "=IFERROR([@VentaReal]/[@Meta], 0)",
          nota: "Aplica formato Porcentaje con 1 decimal (ej. 104,5%).",
        },
      ],
      captura: {
        id: "control-de-ventas-en-excel-paso-4",
        alt: "Tabla tblMetas en Excel comparando Meta, VentaReal, Diferencia y CumplimientoPct con formato condicional de barras",
        caption:
          "Seguimiento de metas mensuales por vendedor calculado dinámicamente desde tblVentas.",
        ratio: "16/9",
      },
    },
    {
      id: "ranking-ordenarpor-tomar",
      titulo: "5. Armar un ranking Top 5 automático con ORDENARPOR y TOMAR",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa las funciones matriciales dinámicas ORDENARPOR y TOMAR en Microsoft 365 para listar automáticamente los 5 mejores vendedores o productos sin reordenar a mano.",
      parrafos: [
        "En reuniones semanales suele necesitarse un bloque compacto con el Top 5 de vendedores o el Top 5 de productos más vendidos, ordenado siempre de mayor a menor. Si ordenas una tabla manual, la semana siguiente tendrás que volver a ordenarla cuando cambien las ventas.",
        "En Microsoft 365 y Excel para la Web puedes automatizar este ranking con dos funciones matriciales modernas: ORDENARPOR (SORTBY en inglés) y TOMAR (TAKE en inglés). Suponiendo que en la tabla de cumplimiento tienes las columnas Vendedor, VentaReal y CumplimientoPct para el mes actual, ORDENARPOR reordena esas columnas en memoria según VentaReal de forma descendente (-1).",
        "Al envolver el resultado con TOMAR(...; 5), Excel recorta la matriz y devuelve únicamente las 5 primeras filas. La fórmula se escribe en una sola celda superior izquierda y se desborda automáticamente hacia abajo y hacia la derecha, siempre que dejes esas celdas vacías debajo.",
      ],
      codigos: [
        {
          titulo: "Top 5 vendedores ordenados por VentaReal descendente",
          lenguaje: "excel",
          codigo: "=TOMAR(ORDENARPOR(APILARH(tblMetas[Vendedor]; tblMetas[VentaReal]; tblMetas[CumplimientoPct]); tblMetas[VentaReal]; -1); 5)",
          codigoEn: "=TAKE(SORTBY(HSTACK(tblMetas[Vendedor], tblMetas[VentaReal], tblMetas[CumplimientoPct]), tblMetas[VentaReal], -1), 5)",
          nota: "APILARH (HSTACK) une las 3 columnas que quieres mostrar aunque no estén contiguas en tblMetas. Requiere Microsoft 365.",
        },
        {
          titulo: "Alternativa compatible con Excel 2021 (sin TOMAR ni APILARH)",
          lenguaje: "excel",
          codigo: "=INDICE(ORDENARPOR(tblMetas[[Vendedor]:[VentaReal]]; tblMetas[VentaReal]; -1); SECUENCIA(5); {1\\2})",
          codigoEn: "=INDEX(SORTBY(tblMetas[[Vendedor]:[VentaReal]], tblMetas[VentaReal], -1), SEQUENCE(5), {1,2})",
          nota: "Usa barra invertida \\ entre columnas en la constante matricial si tu separador de listas es punto y coma.",
        },
      ],
      captura: {
        id: "control-de-ventas-en-excel-paso-5",
        alt: "Fórmula con TOMAR, ORDENARPOR y APILARH generando un bloque Top 5 de vendedores ordenado automáticamente en Excel",
        caption:
          "Ranking Top 5 dinámico que se reordena solo cada vez que ingresas nuevas ventas.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "info",
        titulo: "Si aparece el error #¡DESBORDAMIENTO!",
        texto:
          "Significa que hay algún texto, espacio o borde de celda ocupando el área donde la fórmula necesita expandirse (5 filas por 3 columnas). Borra el contenido de esas celdas y el ranking aparecerá de inmediato.",
      },
    },
    {
      id: "siguiente-nivel-power-bi",
      titulo: "6. Cuándo y cómo llevar este control al siguiente nivel en Power BI",
      esPasoHowTo: false,
      parrafos: [
        "Excel maneja con soltura decenas de miles de filas de ventas, pero cuando acumulas varios años de boletas, necesitas cruzar inventario y cobranza en paralelo, o quieres compartir un tablero web interactivo con gerencia sin enviar archivos adjuntos por correo, es momento de dar el salto a Power BI.",
        "La buena noticia es que, como construiste tblVentas en formato tabular largo y mantuviste tus catálogos separados en la hoja Catalogos, tu archivo ya cumple con las reglas de un modelo en estrella. Solo necesitas abrir Power BI Desktop, conectar este mismo libro de Excel, seleccionar tblVentas, tblProductos, tblVendedores y tblMetas, y empezar a crear tus medidas DAX.",
        "Si quieres ver paso a paso cómo transformar este registro comercial en un tablero interactivo con KPIs, mapas y filtros cruzados, revisa nuestra guía dedicada de dashboard de ventas en Power BI.",
      ],
      lista: [
        "Mantén los nombres de columnas sin tildes ni espacios raros si planeas automatizar la carga luego.",
        "Guarda el libro en OneDrive o SharePoint para que Power BI pueda actualizarlo en la nube sin depender de tu computador encendido.",
        "Continúa con la guía /guias/dashboard-de-ventas-en-power-bi-paso-a-paso para construir el tablero completo.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "La tabla dinámica no muestra las ventas agregadas hoy",
      causa:
        "Las tablas dinámicas en Excel guardan una caché en memoria y no se recalculan solas al escribir nuevas filas en tblVentas.",
      solucion:
        "Ve a Datos > Actualizar todo (o haz clic derecho sobre la tabla dinámica > Actualizar). Si el origen era un rango fijo, cámbialo por el nombre de la tabla tblVentas.",
    },
    {
      error: "Un mismo vendedor aparece repetido dos veces en el reporte",
      causa:
        "Se escribió el nombre de forma distinta en alguna fila (por ejemplo, con un espacio extra al final o sin tilde).",
      solucion:
        "Activa Validación de datos tipo Lista apuntando a tblVendedores y usa la función ESPACIOS si estás limpiando registros antiguos.",
    },
    {
      error: "Error #¿NOMBRE? al escribir ORDENARPOR o TOMAR",
      causa:
        "Tu versión de Excel (por ejemplo, Excel 2016 o 2019 perpetuo) no incluye funciones de matrices dinámicas.",
      solucion:
        "Usa una tabla dinámica ordenada por Suma de TotalNeto de mayor a menor y aplica el filtro de valor 'Diez mejores' configurado en 5 elementos.",
    },
    {
      error: "La suma de TotalNeto da diferente por 1 o 2 pesos frente a la suma manual",
      causa:
        "Los precios con descuento tenían decimales ocultos por el formato de celda y Excel sumó las fracciones decimales.",
      solucion:
        "Envuelve la fórmula de TotalNeto con REDONDEAR(...; 0) para que el valor almacenado coincida exactamente con el mostrado.",
    },
  ],
  plantilla: {
    titulo: "Plantilla de control de ventas, metas y ranking en Excel",
    descripcion:
      "Libro listo para usar con hojas Ventas (tblVentas), Catalogos, Reporte con tablas dinámicas y segmentadores, y seguimiento de metas con ranking Top 5.",
  },
  faqs: [
    {
      q: "¿Puedo usar esta misma estructura si vendo servicios y no productos físicos?",
      a: "Sí. En la columna Producto ingresa el nombre del servicio o plan, en Cantidad deja 1 (o la cantidad de horas/meses facturados) y en Categoria agrupa por línea de servicio.",
    },
    {
      q: "¿Cómo manejo notas de crédito o devoluciones en el registro?",
      a: "Regístralas como una nueva fila con la fecha de la nota de crédito y la Cantidad (o PrecioUnitario) en negativo. Así la tabla dinámica descontará automáticamente la devolución en el mes en que ocurrió.",
    },
    {
      q: "¿Conviene registrar los montos netos o con IVA incluido?",
      a: "Para control comercial y cálculo de metas o comisiones suele trabajarse con valores netos (sin IVA). Lo importante es no mezclar ambos en la misma columna; si necesitas el IVA, agrega una columna calculada aparte.",
    },
    {
      q: "¿Cuántas filas soporta este control en Excel antes de volverse lento?",
      a: "En formato tabular limpio y sin formatos condicionales excesivos sobre toda la hoja, Excel maneja sin problemas entre 50.000 y 150.000 filas. Si superas ese volumen o cruzas múltiples fuentes, conviene pasar el archivo a Power Query o Power BI.",
    },
    {
      q: "¿Cómo filtro el ranking de ORDENARPOR y TOMAR para un solo mes si tblMetas tiene todo el año?",
      a: "Envuelve el rango dentro de FILTRAR antes de ordenarlo: =TOMAR(ORDENARPOR(FILTRAR(APILARH(tblMetas[Vendedor]; tblMetas[VentaReal]); tblMetas[MesInicio]=C2); FILTRAR(tblMetas[VentaReal]; tblMetas[MesInicio]=C2); -1); 5).",
    },
  ],
  relacionadas: [
    "como-hacer-dashboard-en-excel",
    "dashboard-de-ventas-en-power-bi-paso-a-paso",
    "inventario-en-excel-entradas-y-salidas",
  ],
  enlacesExternos: [
    {
      label: "Referencia oficial de funciones en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.worksheetfunction",
      fuente: "Microsoft Learn",
    },
    {
      label: "Documentación oficial de tablas dinámicas en Excel",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.pivottable",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Dashboard de ventas en Power BI paso a paso",
      href: "/guias/dashboard-de-ventas-en-power-bi-paso-a-paso",
      descripcion:
        "Lleva tu tabla de ventas de Excel a un tablero interactivo en Power BI con medidas DAX.",
    },
  ],
};

export default guia;
