export type ExcelToDaxCategory =
  | "Búsqueda y relaciones"
  | "Condicionales y filtros"
  | "Inteligencia de tiempo"
  | "Agregaciones e iteradores"
  | "Texto y fechas"
  | "KPIs de negocio";

export interface ExcelToDaxItem {
  id: string;
  category: ExcelToDaxCategory;
  excelEs: string;
  excelEn: string;
  keywords: string[];
  excelExample: string;
  daxFunction: string;
  daxMeasure: string;
  explanation: string;
  commonTrap: string;
  businessCase: string;
}

export interface ExcelToDaxFaq {
  q: string;
  a: string;
}

export const EXCEL_TO_DAX_CATEGORIES: ExcelToDaxCategory[] = [
  "Búsqueda y relaciones",
  "Condicionales y filtros",
  "Inteligencia de tiempo",
  "Agregaciones e iteradores",
  "Texto y fechas",
  "KPIs de negocio",
];

export const EXCEL_TO_DAX_ITEMS: ExcelToDaxItem[] = [
  {
    id: "buscarv-vlookup",
    category: "Búsqueda y relaciones",
    excelEs: "BUSCARV",
    excelEn: "VLOOKUP",
    keywords: ["buscar", "cruzar tablas", "traer columna", "precio", "categoria", "relacion"],
    excelExample: "=BUSCARV(A2; Productos!A:C; 3; FALSO)",
    daxFunction: "RELATED / LOOKUPVALUE",
    daxMeasure: `Precio Unitario = RELATED(Productos[Precio_CLP])`,
    explanation:
      "En Power BI no necesitas buscar celda por celda. Si las tablas están unidas en el modelo estrella (por ejemplo Ventas → Productos), RELATED trae el campo al instante. Si no hay relación activa, usa LOOKUPVALUE.",
    commonTrap:
      "Error común: abusar de columnas calculadas con LOOKUPVALUE para copiar datos de una tabla a otra. Si existe relación de uno a varios, usa la columna de la dimensión directamente en el visual o una medida.",
    businessCase:
      "En un reporte de ventas en CLP, relacionas Ventas[SKU] con Productos[SKU] para analizar márgenes por categoría sin duplicar columnas.",
  },
  {
    id: "buscarx-xlookup",
    category: "Búsqueda y relaciones",
    excelEs: "BUSCARX",
    excelEn: "XLOOKUP",
    keywords: ["buscar", "izquierda", "valor no encontrado", "cruzar", "moneda", "tipo de cambio"],
    excelExample: '=BUSCARX(B2; TipoCambio[Fecha]; TipoCambio[USD_CLP]; "Sin dato")',
    daxFunction: "LOOKUPVALUE",
    daxMeasure: `TC Dólar =
LOOKUPVALUE(
    TipoCambio[USD_CLP],
    TipoCambio[Fecha], Ventas[Fecha],
    BLANK()
)`,
    explanation:
      "LOOKUPVALUE permite buscar en cualquier dirección y definir un valor alternativo si no hay coincidencia (como el cuarto argumento de BUSCARX).",
    commonTrap:
      "Error común: que la búsqueda devuelva más de una coincidencia en la tabla destino. LOOKUPVALUE arroja error si encuentra duplicados y no pasaste un valor alternativo.",
    businessCase:
      "Convertir facturas de exportación en USD a pesos chilenos según el tipo de cambio observado del día.",
  },
  {
    id: "indice-coincidir-index-match",
    category: "Búsqueda y relaciones",
    excelEs: "INDICE + COINCIDIR",
    excelEn: "INDEX + MATCH",
    keywords: ["indice", "coincidir", "doble criterio", "buscar", "matriz", "tarifa"],
    excelExample: "=INDICE(Tarifas!C:C; COINCIDIR(A2&B2; Tarifas!A:A&Tarifas!B:B; 0))",
    daxFunction: "LOOKUPVALUE (múltiples criterios)",
    daxMeasure: `Tarifa Flete =
LOOKUPVALUE(
    Tarifas[Costo_CLP],
    Tarifas[Region], Envios[Region],
    Tarifas[Tramo_Kg], Envios[Tramo_Kg]
)`,
    explanation:
      "En DAX no necesitas concatenar columnas auxiliares para buscar con dos o más criterios: LOOKUPVALUE acepta múltiples pares de columna y valor.",
    commonTrap:
      "Error común: crear llaves concatenadas en DAX con & cuando puedes pasar varios criterios limpios o resolver el cruce en Power Query.",
    businessCase:
      "Asignar tarifa de despacho según región de destino (ej. Antofagasta, Biobío, RM) y tramo de peso.",
  },
  {
    id: "sumar-si-sumif",
    category: "Condicionales y filtros",
    excelEs: "SUMAR.SI",
    excelEn: "SUMIF",
    keywords: ["sumar si", "condicion", "filtro", "sucursal", "solo", "ventas filtradas"],
    excelExample: '=SUMAR.SI(A:A; "Santiago"; C:C)',
    daxFunction: "CALCULATE(SUM(...), filtro)",
    daxMeasure: `Ventas Santiago =
CALCULATE(
    SUM(Ventas[Monto_CLP]),
    Sucursal[Ciudad] = "Santiago"
)`,
    explanation:
      "CALCULATE modifica el contexto de filtro antes de evaluar la suma. Es el equivalente natural y dinámico de SUMAR.SI.",
    commonTrap:
      "Error común: envolver toda la tabla en FILTER(Ventas, ...) cuando un filtro simple sobre una columna de dimensión basta y es mucho más rápido.",
    businessCase:
      "Medir las ventas de la sucursal Santiago o de un canal específico (e-commerce vs tienda física) dentro de un KPI.",
  },
  {
    id: "sumar-si-conjunto-sumifs",
    category: "Condicionales y filtros",
    excelEs: "SUMAR.SI.CONJUNTO",
    excelEn: "SUMIFS",
    keywords: ["sumar si conjunto", "varios filtros", "multiples condiciones", "canal", "estado"],
    excelExample: '=SUMAR.SI.CONJUNTO(D:D; A:A; "Online"; B:B; "Pagado")',
    daxFunction: "CALCULATE(SUM(...), filtro1, filtro2)",
    daxMeasure: `Ventas Online Pagadas =
CALCULATE(
    [Ventas Totales],
    Ventas[Canal] = "Online",
    Ventas[Estado] = "Pagado"
)`,
    explanation:
      "En CALCULATE cada argumento de filtro separado por coma actúa como una condición Y (AND), igual que en SUMAR.SI.CONJUNTO.",
    commonTrap:
      "Error común: usar el operador && sobre columnas de distintas tablas dentro de un mismo predicado. Escribe cada condición como argumento separado de CALCULATE.",
    businessCase:
      "Calcular ingresos efectivamente recaudados del canal online excluyendo órdenes anuladas o pendientes.",
  },
  {
    id: "contar-si-countif",
    category: "Condicionales y filtros",
    excelEs: "CONTAR.SI",
    excelEn: "COUNTIF",
    keywords: ["contar si", "cuantos", "frecuencia", "pedidos", "tickets", "estado"],
    excelExample: '=CONTAR.SI(B:B; "Atrasado")',
    daxFunction: "CALCULATE(COUNTROWS(...), filtro)",
    daxMeasure: `Pedidos Atrasados =
CALCULATE(
    COUNTROWS(Pedidos),
    Pedidos[Estado_Entrega] = "Atrasado"
)`,
    explanation:
      "COUNTROWS cuenta las filas de la tabla filtrada por CALCULATE. Es más claro y menos propenso a errores con blancos que COUNT sobre una columna.",
    commonTrap:
      "Error común: usar COUNT sobre una columna con celdas vacías pensando que cuenta todas las filas del pedido.",
    businessCase:
      "Contar despachos con atraso para monitorear cumplimiento SLA en logística.",
  },
  {
    id: "contar-si-conjunto-countifs",
    category: "Condicionales y filtros",
    excelEs: "CONTAR.SI.CONJUNTO",
    excelEn: "COUNTIFS",
    keywords: ["contar si conjunto", "varias condiciones", "tickets", "clientes activos"],
    excelExample: '=CONTAR.SI.CONJUNTO(A:A; "VIP"; C:C; ">50000")',
    daxFunction: "CALCULATE(COUNTROWS(...), filtro1, filtro2)",
    daxMeasure: `Órdenes VIP Altas =
CALCULATE(
    COUNTROWS(Ventas),
    Clientes[Segmento] = "VIP",
    Ventas[Monto_CLP] > 50000
)`,
    explanation:
      "Combina COUNTROWS con múltiples argumentos de filtro en CALCULATE para replicar CONTAR.SI.CONJUNTO sobre cualquier tabla del modelo.",
    commonTrap:
      "Error común: filtrar la tabla de hechos completa en lugar de filtrar las tablas de dimensión (Clientes, Productos) cuando el atributo vive allí.",
    businessCase:
      "Contar compras de clientes VIP sobre $50.000 CLP para evaluar campañas de fidelización.",
  },
  {
    id: "contara-counta",
    category: "Agregaciones e iteradores",
    excelEs: "CONTARA",
    excelEn: "COUNTA",
    keywords: ["contara", "no vacios", "registros", "filas", "counta"],
    excelExample: "=CONTARA(A2:A500)",
    daxFunction: "COUNTA / COUNTROWS",
    daxMeasure: `Registros con Rut = COUNTA(Clientes[RUT])`,
    explanation:
      "COUNTA existe en DAX y cuenta valores no vacíos en una columna (texto, números o fechas). Si quieres contar filas totales de la tabla, prefiere COUNTROWS.",
    commonTrap:
      "Error común: confundir espacios en blanco o strings vacíos (\"\") con BLANK(). COUNTA cuenta cadenas vacías si no se limpiaron en Power Query.",
    businessCase:
      "Verificar cuántos clientes tienen RUT o correo registrado antes de lanzar una campaña.",
  },
  {
    id: "contar-unico-distinctcount",
    category: "Agregaciones e iteradores",
    excelEs: "CONTAR.UNICO / UNICOS",
    excelEn: "COUNTA(UNIQUE(...))",
    keywords: ["unicos", "distintos", "clientes unicos", "sku", "sin repetir", "distinct"],
    excelExample: "=CONTARA(UNICOS(A2:A5000))",
    daxFunction: "DISTINCTCOUNT",
    daxMeasure: `Clientes Únicos = DISTINCTCOUNT(Ventas[ID_Cliente])`,
    explanation:
      "En Excel contar valores únicos requería fórmulas matriciales complejas hasta la llegada de UNICOS. En DAX, DISTINCTCOUNT lo resuelve en una línea.",
    commonTrap:
      "Error común: usar DISTINCTCOUNT sobre una columna con muchos valores nulos (cuenta el BLANK como 1 valor distinto) o sumarla sin pensar que el total general no es la suma de los meses.",
    businessCase:
      "Medir cuántos clientes distintos compraron en el trimestre en Santiago y regiones.",
  },
  {
    id: "promedio-si-averageif",
    category: "Condicionales y filtros",
    excelEs: "PROMEDIO.SI",
    excelEn: "AVERAGEIF",
    keywords: ["promedio si", "ticket promedio", "media condicionada", "averageif"],
    excelExample: '=PROMEDIO.SI(A:A; "Retail"; C:C)',
    daxFunction: "CALCULATE(AVERAGE(...), filtro)",
    daxMeasure: `Ticket Promedio Retail =
CALCULATE(
    AVERAGE(Ventas[Monto_CLP]),
    Clientes[Rubro] = "Retail"
)`,
    explanation:
      "Evalúa el promedio aritmético de una columna bajo los filtros indicados en CALCULATE.",
    commonTrap:
      "Error común: promediar promedios ya calculados o usar AVERAGE sobre una línea de detalle cuando el negocio quiere promedio por boleta (para eso usa AVERAGEX sobre VALUES(Ventas[Nro_Boleta])).",
    businessCase:
      "Calcular el monto promedio por transacción del segmento Retail.",
  },
  {
    id: "promedio-si-conjunto-averageifs",
    category: "Condicionales y filtros",
    excelEs: "PROMEDIO.SI.CONJUNTO",
    excelEn: "AVERAGEIFS",
    keywords: ["promedio si conjunto", "media", "varios filtros", "averageifs"],
    excelExample: '=PROMEDIO.SI.CONJUNTO(D:D; A:A; "Norte"; B:B; ">0")',
    daxFunction: "CALCULATE(AVERAGE(...), filtro1, filtro2)",
    daxMeasure: `Ticket Promedio Norte =
CALCULATE(
    AVERAGE(Ventas[Monto_CLP]),
    Sucursal[Zona] = "Norte",
    Ventas[Monto_CLP] > 0
)`,
    explanation:
      "Agrega todas las condiciones necesarias como argumentos dentro de CALCULATE para obtener el promedio filtrado.",
    commonTrap:
      "Error común: incluir devoluciones negativas o montos en 0 que distorsionan el ticket promedio real.",
    businessCase:
      "Analizar el ticket promedio positivo de sucursales de la zona norte (Antofagasta, Iquique, Copiapó).",
  },
  {
    id: "si-if",
    category: "Condicionales y filtros",
    excelEs: "SI",
    excelEn: "IF",
    keywords: ["si", "condicional", "cumple", "meta", "semaforo", "if"],
    excelExample: '=SI(B2>=C2; "Cumple"; "Bajo meta")',
    daxFunction: "IF",
    daxMeasure: `Estado Meta =
IF(
    [Ventas Totales] >= [Meta Mensual],
    "Cumple",
    "Bajo meta"
)`,
    explanation:
      "IF en DAX tiene la misma sintaxis que en Excel: condición, resultado verdadero y resultado falso (opcional, por defecto BLANK()).",
    commonTrap:
      "Error común: devolver \"\" (texto vacío) en lugar de BLANK() cuando no hay dato, lo que obliga a Power BI a mostrar filas vacías en tablas y matrices.",
    businessCase:
      "Etiquetar vendedores o sucursales que alcanzaron su presupuesto mensual.",
  },
  {
    id: "si-conjunto-ifs",
    category: "Condicionales y filtros",
    excelEs: "SI.CONJUNTO",
    excelEn: "IFS",
    keywords: ["si conjunto", "anidado", "tramos", "rangos", "switch", "ifs"],
    excelExample: '=SI.CONJUNTO(A2>=90; "Alto"; A2>=60; "Medio"; VERDADERO; "Bajo")',
    daxFunction: "SWITCH(TRUE(), ...)",
    daxMeasure: `Tramo Cumplimiento =
SWITCH(
    TRUE(),
    [Cumplimiento %] >= 1, "Sobre meta",
    [Cumplimiento %] >= 0.8, "En rango",
    "Crítico"
)`,
    explanation:
      "En DAX el patrón SWITCH(TRUE(), ...) reemplaza tanto a SI.CONJUNTO como a los SI anidados interminables de Excel, con lectura mucho más limpia.",
    commonTrap:
      "Error común: ordenar las condiciones al revés (por ejemplo poner >= 0.8 antes que >= 1), lo que hace que nunca entre al tramo superior.",
    businessCase:
      "Clasificar cumplimiento comercial o riesgo de morosidad en tramos claros para un tablero gerencial.",
  },
  {
    id: "si-error-iferror",
    category: "Condicionales y filtros",
    excelEs: "SI.ERROR",
    excelEn: "IFERROR",
    keywords: ["error", "evitar error", "nulo", "vacio", "iferror", "coalesce"],
    excelExample: "=SI.ERROR(A2/B2; 0)",
    daxFunction: "IFERROR / COALESCE",
    daxMeasure: `Variación Segura = COALESCE([Variación %], 0)`,
    explanation:
      "IFERROR captura errores de evaluación, pero en DAX suele ser mejor evitar el error de raíz (usando DIVIDE) y usar COALESCE para reemplazar BLANK() por 0 cuando sea necesario.",
    commonTrap:
      "Error común: envolver fórmulas pesadas en IFERROR, lo que degrada el rendimiento del motor DAX y oculta errores reales de modelamiento.",
    businessCase:
      "Mostrar 0% en lugar de vacío cuando una categoría nueva no tenía ventas el mes anterior.",
  },
  {
    id: "division-segura-divide",
    category: "KPIs de negocio",
    excelEs: "División (/) con SI.ERROR",
    excelEn: "IFERROR(A/B, 0)",
    keywords: ["dividir", "division", "margen", "margen sin error", "cero", "div/0", "ratio"],
    excelExample: "=SI.ERROR((B2-C2)/B2; 0)",
    daxFunction: "DIVIDE",
    daxMeasure: `Margen % =
DIVIDE(
    [Ventas Totales] - [Costo Total],
    [Ventas Totales]
)`,
    explanation:
      "DIVIDE maneja automáticamente la división por cero devolviendo BLANK() (o un tercer argumento opcional como 0), evitando el clásico #¡DIV/0! de Excel.",
    commonTrap:
      "Error común: usar el operador / directamente en medidas. Si una sucursal no vendió en el período, el visual mostrará Infinity o error.",
    businessCase:
      "Calcular el margen bruto porcentual por tienda o SKU sin que las filas sin venta rompan la matriz.",
  },
  {
    id: "sumaproducto-sumproduct",
    category: "Agregaciones e iteradores",
    excelEs: "SUMAPRODUCTO",
    excelEn: "SUMPRODUCT",
    keywords: ["sumaproducto", "cantidad por precio", "fila por fila", "iterador", "sumx"],
    excelExample: "=SUMAPRODUCTO(B2:B100; C2:C100)",
    daxFunction: "SUMX",
    daxMeasure: `Venta Bruta =
SUMX(
    Ventas,
    Ventas[Cantidad] * Ventas[Precio_Unitario_CLP]
)`,
    explanation:
      "SUMX recorre la tabla fila por fila (contexto de fila), multiplica cantidad por precio en memoria y luego suma el resultado sin necesidad de crear una columna calculada.",
    commonTrap:
      "Error común: escribir SUM(Ventas[Cantidad]) * SUM(Ventas[Precio_Unitario_CLP]), lo cual multiplica los totales y da un número absurdamente inflado.",
    businessCase:
      "Calcular el ingreso total desde una tabla de detalle de boletas que solo trae cantidad y precio unitario.",
  },
  {
    id: "jerarquia-rank",
    category: "KPIs de negocio",
    excelEs: "JERARQUIA / JERARQUIA.EQV",
    excelEn: "RANK / RANK.EQ",
    keywords: ["ranking", "top", "posicion", "orden", "jerarquia", "rankx"],
    excelExample: "=JERARQUIA.EQV(B2; $B$2:$B$20; 0)",
    daxFunction: "RANKX",
    daxMeasure: `Ranking Sucursal =
RANKX(
    ALL(Sucursal[Ciudad]),
    [Ventas Totales],
    ,
    DESC,
    DENSE
)`,
    explanation:
      "RANKX evalúa una medida para cada elemento de una tabla (por ejemplo todas las ciudades con ALL) y devuelve su posición dinámica según los filtros del reporte.",
    commonTrap:
      "Error común: olvidar ALL() en el primer argumento. Sin ALL(), cada fila de la tabla visual solo se compara consigo misma y todas quedan en puesto 1.",
    businessCase:
      "Construir un ranking dinámico de vendedores, sucursales o productos más vendidos.",
  },
  {
    id: "porcentaje-del-total",
    category: "KPIs de negocio",
    excelEs: "% del total (referencia fija $)",
    excelEn: "=B2/$B$10",
    keywords: ["porcentaje del total", "participacion", "share", "mix", "peso", "all"],
    excelExample: "=B2/$B$10",
    daxFunction: "DIVIDE + ALL",
    daxMeasure: `% Participación =
DIVIDE(
    [Ventas Totales],
    CALCULATE([Ventas Totales], ALL(Productos[Categoría]))
)`,
    explanation:
      "En Excel fijas el denominador con $. En DAX remueves el filtro de la columna actual usando ALL() dentro de CALCULATE para obtener el gran total.",
    commonTrap:
      "Error común: usar ALL(Tabla_Completa) cuando el usuario quiere que sigan aplicando otros segmentadores (como Año o Región). Si quieres respetar filtros externos, usa ALLSELECTED.",
    businessCase:
      "Calcular el mix de ventas (%) por categoría de producto o participación de mercado por región.",
  },
  {
    id: "acumulado-ytd",
    category: "Inteligencia de tiempo",
    excelEs: "Acumulado año ($B$2:B2)",
    excelEn: "SUM($B$2:B2)",
    keywords: ["acumulado", "ytd", "year to date", "corrido", "anual", "fecha"],
    excelExample: "=SUMA($B$2:B2)",
    daxFunction: "TOTALYTD",
    daxMeasure: `Ventas YTD =
TOTALYTD(
    [Ventas Totales],
    Calendario[Fecha]
)`,
    explanation:
      "TOTALYTD acumula automáticamente desde el 1 de enero hasta la fecha del contexto actual usando una tabla Calendario continua.",
    commonTrap:
      "Error común: usar la columna de fecha de la tabla de hechos en lugar de una tabla Calendario dedicada y marcada como tabla de fechas.",
    businessCase:
      "Comparar el acumulado de ventas o presupuesto ejecutado desde enero hasta el mes actual en control de gestión.",
  },
  {
    id: "mismo-periodo-anio-anterior",
    category: "Inteligencia de tiempo",
    excelEs: "Mismo período año anterior",
    excelEn: "Year over Year (YoY)",
    keywords: ["año anterior", "yoy", "mismo periodo", "comparativo", "interanual", "aa"],
    excelExample: "=C2-B2 (comparando columnas 2026 vs 2025)",
    daxFunction: "SAMEPERIODLASTYEAR",
    daxMeasure: `Ventas Año Anterior =
CALCULATE(
    [Ventas Totales],
    SAMEPERIODLASTYEAR(Calendario[Fecha])
)`,
    explanation:
      "Desplaza exactamente un año hacia atrás las fechas seleccionadas en el filtro actual, funcionando tanto a nivel de día como de mes o trimestre.",
    commonTrap:
      "Error común: tener huecos de días en la tabla de fechas o filtrar meses sin año, lo que rompe las funciones de inteligencia de tiempo.",
    businessCase:
      "Comparar las ventas de noviembre 2026 contra noviembre 2025 en una misma tarjeta KPI.",
  },
  {
    id: "variacion-yoy-porcentual",
    category: "Inteligencia de tiempo",
    excelEs: "Variación % interanual",
    excelEn: "=(Actual-Anterior)/Anterior",
    keywords: ["crecimiento", "variacion", "yoy %", "diferencia porcentual", "año anterior"],
    excelExample: "=SI.ERROR((C2-B2)/B2; 0)",
    daxFunction: "DIVIDE + SAMEPERIODLASTYEAR",
    daxMeasure: `Variación YoY % =
VAR VentasActual = [Ventas Totales]
VAR VentasAA = [Ventas Año Anterior]
RETURN
DIVIDE(VentasActual - VentasAA, VentasAA)`,
    explanation:
      "Combina variables (VAR/RETURN) con la medida del año anterior y DIVIDE para calcular el crecimiento porcentual limpio y reutilizable.",
    commonTrap:
      "Error común: repetir dos veces el cálculo de [Ventas Año Anterior] dentro de la fórmula sin guardarlo en una variable VAR.",
    businessCase:
      "Medir el crecimiento interanual de facturación por línea de negocio.",
  },
  {
    id: "promedio-movil-3-meses",
    category: "Inteligencia de tiempo",
    excelEs: "Promedio móvil 3 meses",
    excelEn: "AVERAGE(B2:B4)",
    keywords: ["promedio movil", "rolling", "ultimos 3 meses", "suavizado", "tendencia"],
    excelExample: "=PROMEDIO(B2:B4)",
    daxFunction: "DATESINPERIOD + AVERAGEX",
    daxMeasure: `Promedio Móvil 3M =
CALCULATE(
    AVERAGEX(
        VALUES(Calendario[AñoMes]),
        [Ventas Totales]
    ),
    DATESINPERIOD(
        Calendario[Fecha],
        MAX(Calendario[Fecha]),
        -3,
        MONTH
    )
)`,
    explanation:
      "DATESINPERIOD construye una ventana dinámica de los últimos 3 meses terminando en la fecha máxima del contexto actual.",
    commonTrap:
      "Error común: usar AVERAGE(Ventas[Monto]) en vez de promediar la medida mensual; eso promedia transacciones individuales de los últimos 3 meses y no el total mensual.",
    businessCase:
      "Suavizar estacionalidad de ventas o rotación de inventario en minería y retail.",
  },
  {
    id: "texto-text",
    category: "Texto y fechas",
    excelEs: "TEXTO",
    excelEn: "TEXT",
    keywords: ["formato", "texto", "moneda", "fecha texto", "mes nombre", "format"],
    excelExample: '=TEXTO(A2; "mmm-yyyy")',
    daxFunction: "FORMAT",
    daxMeasure: `Mes Etiqueta = FORMAT(Calendario[Fecha], "mmm-yyyy")`,
    explanation:
      "FORMAT convierte fechas o números en texto con el formato especificado. Útil para etiquetas o títulos dinámicos.",
    commonTrap:
      "Error común: usar FORMAT dentro de una medida numérica para darle formato de pesos o porcentaje; FORMAT devuelve texto y ya no podrás graficarlo en ejes numéricos.",
    businessCase:
      "Crear títulos dinámicos en tarjetas como \"Ventas acumuladas a nov-2026\".",
  },
  {
    id: "concatenar-concat",
    category: "Texto y fechas",
    excelEs: "CONCATENAR / UNIRCADENAS",
    excelEn: "CONCAT / TEXTJOIN",
    keywords: ["concatenar", "unir texto", "combinar", "nombre completo", "etiqueta"],
    excelExample: '=CONCATENAR(A2; " - "; B2)',
    daxFunction: "CONCATENATE / & / COMBINEVALUES",
    daxMeasure: `Sucursal Completa = Sucursal[Ciudad] & " - " & Sucursal[Nombre]`,
    explanation:
      "El operador & une textos de forma directa e ilimitada (CONCATENATE en DAX solo acepta 2 argumentos). Para tablas con delimitador usa CONCATENATEX.",
    commonTrap:
      "Error común: usar CONCATENATE intentando pasar 3 o más argumentos como en Excel; en DAX solo admite dos.",
    businessCase:
      "Mostrar código y nombre de producto juntos en un segmentador o tooltip.",
  },
  {
    id: "sifecha-datedif",
    category: "Texto y fechas",
    excelEs: "SIFECHA / DIAS",
    excelEn: "DATEDIF / DAYS",
    keywords: ["diferencia fechas", "dias", "antiguedad", "plazo", "mora", "lead time"],
    excelExample: '=SIFECHA(A2; B2; "D")',
    daxFunction: "DATEDIFF",
    daxMeasure: `Días de Despacho =
DATEDIFF(
    Pedidos[Fecha_Compra],
    Pedidos[Fecha_Entrega],
    DAY
)`,
    explanation:
      "DATEDIFF calcula la diferencia exacta entre dos fechas en DAY, MONTH, QUARTER, YEAR, HOUR o MINUTE.",
    commonTrap:
      "Error común: invertir el orden de las fechas (si la primera es mayor que la segunda devuelve error o negativo según la versión; valida con IF o en Power Query).",
    businessCase:
      "Medir días promedio de cobranza (DSO) o tiempo de entrega desde la orden de compra.",
  },
  {
    id: "hoy-today",
    category: "Texto y fechas",
    excelEs: "HOY",
    excelEn: "TODAY",
    keywords: ["hoy", "fecha actual", "vencimiento", "edad", "today"],
    excelExample: "=HOY()-A2",
    daxFunction: "TODAY",
    daxMeasure: `Días desde Vencimiento = DATEDIFF(Facturas[Vencimiento], TODAY(), DAY)`,
    explanation:
      "TODAY() devuelve la fecha actual del servidor al momento de actualizar el modelo o evaluar la medida.",
    commonTrap:
      "Error común: olvidar que en Power BI Service TODAY() usa la zona horaria UTC del servidor, lo que después de las 21:00 en Chile ya marca el día siguiente.",
    businessCase:
      "Calcular antigüedad de deuda vencida en cuentas por cobrar.",
  },
  {
    id: "anio-mes-dia",
    category: "Texto y fechas",
    excelEs: "AÑO / MES / DIA",
    excelEn: "YEAR / MONTH / DAY",
    keywords: ["año", "mes", "dia", "extraer fecha", "calendario", "year", "month"],
    excelExample: "=AÑO(A2) & MES(A2)",
    daxFunction: "YEAR / MONTH / DAY",
    daxMeasure: `Año = YEAR(Calendario[Fecha])`,
    explanation:
      "Extraen el componente numérico de una fecha. En Power BI lo ideal es generar estas columnas una sola vez en tu tabla Calendario.",
    commonTrap:
      "Error común: crear columnas de Año y Mes en la tabla de ventas en lugar de centralizarlas en la tabla Calendario.",
    businessCase:
      "Estructurar jerarquías de tiempo (Año → Trimestre → Mes) para filtrar cualquier tablero.",
  },
  {
    id: "subtotales-allselected",
    category: "KPIs de negocio",
    excelEs: "SUBTOTALES",
    excelEn: "SUBTOTAL",
    keywords: ["subtotales", "filtro visual", "seleccionado", "allselected", "total dinamico"],
    excelExample: "=SUBTOTALES(9; C2:C100)",
    daxFunction: "ALLSELECTED",
    daxMeasure: `% Sobre Selección =
DIVIDE(
    [Ventas Totales],
    CALCULATE([Ventas Totales], ALLSELECTED(Productos))
)`,
    explanation:
      "Mientras ALL ignora todos los filtros, ALLSELECTED respeta los segmentadores externos elegidos por el usuario (igual que SUBTOTALES respeta los autofiltros de Excel).",
    commonTrap:
      "Error común: usar ALL cuando el usuario filtra 2 o 3 regiones en un slicer y espera que los porcentajes del gráfico sumen 100% entre las regiones elegidas.",
    businessCase:
      "Permitir que un gerente filtre dos categorías y vea qué porcentaje representa cada una sobre ese subconjunto.",
  },
];

export const EXCEL_TO_DAX_FAQS: ExcelToDaxFaq[] = [
  {
    q: "¿Puedo copiar una fórmula de Excel directo en Power BI?",
    a: "No directamente. Aunque funciones como IF, SUM o TODAY comparten nombre, Excel trabaja sobre celdas (A2:B10) y DAX trabaja sobre tablas, columnas y contexto de filtro. Debes traducir las referencias de celda a columnas y medidas.",
  },
  {
    q: "¿Cuál es la diferencia entre una columna calculada y una medida en DAX?",
    a: "Una columna calculada se evalúa fila por fila al actualizar el modelo y ocupa memoria RAM. Una medida se calcula dinámicamente en el momento según los filtros y segmentadores del reporte. Para KPIs como márgenes, variaciones y totales, usa siempre medidas.",
  },
  {
    q: "¿Cómo reemplazo BUSCARV o BUSCARX en Power BI?",
    a: "La forma óptima es unir tus tablas en el modelo estrella (por ejemplo Ventas → Productos por SKU) y usar directamente los campos de la dimensión o la función RELATED. Si no hay relación, usa LOOKUPVALUE.",
  },
  {
    q: "¿Cómo se traduce SUMAR.SI.CONJUNTO (SUMIFS) a DAX?",
    a: "Con CALCULATE. Por ejemplo: CALCULATE(SUM(Ventas[Monto]), Sucursal[Ciudad] = \"Santiago\", Ventas[Estado] = \"Pagado\"). Cada filtro separado por coma funciona como condición Y.",
  },
  {
    q: "¿Por qué recomiendan DIVIDE en lugar de usar la barra (/) en DAX?",
    a: "DIVIDE(numerador, denominador) maneja automáticamente la división por cero devolviendo BLANK() (o un valor alternativo opcional), evitando errores visuales sin necesidad de envolver todo en IFERROR.",
  },
  {
    q: "¿Qué necesito para que funcionen TOTALYTD y SAMEPERIODLASTYEAR?",
    a: "Necesitas una tabla Calendario con fechas continuas (sin días faltantes para todos los años completos del rango), relacionada con tu tabla de hechos y marcada como tabla de fechas en Power BI.",
  },
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Busca y detecta funciones de Excel (ES/EN) o intenciones de negocio en la consulta del usuario.
 */
export function matchExcelToDax(rawQuery: string): {
  items: ExcelToDaxItem[];
  detectedFunctions: string[];
} {
  const query = rawQuery.trim();
  if (!query) {
    return { items: EXCEL_TO_DAX_ITEMS, detectedFunctions: [] };
  }

  const norm = normalizeText(query);
  // Extrae tokens tipo nombre de función Excel (ej. SUMAR.SI.CONJUNTO, VLOOKUP, BUSCARV)
  const rawTokens = norm
    .replace(/^=/, "")
    .split(/[^a-z0-9._]+/)
    .filter((t) => t.length >= 2);

  const detectedSet = new Set<string>();
  const scored: { item: ExcelToDaxItem; score: number }[] = [];

  for (const item of EXCEL_TO_DAX_ITEMS) {
    let score = 0;
    const esNorm = normalizeText(item.excelEs);
    const enNorm = normalizeText(item.excelEn);
    const daxNorm = normalizeText(item.daxFunction);

    // Coincidencia directa con token de fórmula pegada
    for (const token of rawTokens) {
      if (
        esNorm.split(/[\s/+]+/).some((part) => part === token) ||
        enNorm.split(/[\s/+(),]+/).some((part) => part === token)
      ) {
        score += 100;
        detectedSet.add(`${item.excelEs} / ${item.excelEn}`);
      }
    }

    // Coincidencia por inclusión en nombres de función
    if (esNorm.includes(norm) || enNorm.includes(norm)) {
      score += 60;
    }
    if (daxNorm.includes(norm)) {
      score += 50;
    }

    // Coincidencia con división `/` o `%`
    if (norm.includes("/") && item.id === "division-segura-divide") {
      score += 45;
      detectedSet.add("División (/)");
    }
    if (norm.includes("%") && (item.id === "porcentaje-del-total" || item.id === "variacion-yoy-porcentual")) {
      score += 35;
    }

    // Coincidencia en keywords de intención y contenido
    for (const kw of item.keywords) {
      const kwNorm = normalizeText(kw);
      if (norm.includes(kwNorm) || kwNorm.includes(norm)) {
        score += 30;
      }
    }

    const haystack = normalizeText(
      `${item.excelEs} ${item.excelEn} ${item.daxFunction} ${item.explanation} ${item.businessCase}`
    );
    const words = norm.split(/\s+/).filter((w) => w.length >= 3);
    for (const w of words) {
      if (haystack.includes(w)) score += 10;
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  return {
    items: scored.map((s) => s.item),
    detectedFunctions: Array.from(detectedSet),
  };
}
