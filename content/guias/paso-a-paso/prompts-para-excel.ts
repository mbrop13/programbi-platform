import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "prompts-para-excel",
  title: "Prompts para Excel: 50 ejemplos para ChatGPT y Copilot",
  meta: "Biblioteca de prompts para Excel probados: fórmulas, limpieza de datos, tablas dinámicas, gráficos, VBA y Power Query. Copia, adapta y valida.",
  h1: "Prompts para Excel: biblioteca de prompts probados por tarea",
  subtitle:
    "Colección práctica de 50 prompts estructurados para pedirle a ChatGPT, Claude, Gemini o Copilot fórmulas exactas, limpieza en Power Query, macros VBA, tablas dinámicas y lectura ejecutiva de datos sin inventos ni errores silenciosos.",
  keywordPrincipal: "prompts para excel",
  keywords: [
    "prompts para excel",
    "prompts para Excel ChatGPT",
    "prompts para Excel Claude",
    "prompts para Copilot en Excel",
    "mejores prompts para Excel",
  ],
  curso: "excel",
  herramienta: "IA",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  esGuiaIA: true,
  avisoPrivacidad:
    "Antes de copiar una planilla en ChatGPT, Claude o Gemini web, elimina o reemplaza RUT, nombres completos, correos, teléfonos y sueldos reales por identificadores ficticios (por ejemplo, EMP-001). Envía únicamente la estructura de columnas y entre 5 y 10 filas de muestra sintética; si trabajas con información confidencial de clientes o nómina bajo normativa chilena de protección de datos, prioriza entornos corporativos con acuerdos de no entrenamiento.",
  en30Segundos: {
    queLogras:
      "Obtener fórmulas compatibles con Excel en español (con punto y coma), scripts de Power Query, macros VBA seguras y sugerencias de tablas dinámicas usando 50 prompts listos para adaptar.",
    herramienta: "ChatGPT, Claude, Gemini o Copilot en Excel",
    tiempo: "25 minutos de lectura y prueba",
    bullets: [
      "Aplicar una plantilla de prompt en 4 partes que evita respuestas genéricas o sintaxis en inglés.",
      "Elegir si tu tarea se resuelve mejor con fórmula, Power Query, VBA o análisis directo.",
      "Copiar 50 prompts numerados divididos en 6 categorías reales de trabajo en oficina.",
      "Validar cada salida de la IA con pruebas de borde antes de pegarla en tu planilla productiva.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Anatomía del prompt",
      resumen: "Define contexto, columnas, objetivo y formato regional.",
      anchorId: "como-escribir-buen-prompt",
      icono: "sparkles",
    },
    {
      numero: 2,
      titulo: "Qué enfoque pedir",
      resumen: "Compara fórmula, Power Query, VBA y análisis conversacional.",
      anchorId: "tabla-comparativa-tareas",
      icono: "layers",
    },
    {
      numero: 3,
      titulo: "Fórmulas y limpieza",
      resumen: "18 prompts para cálculos exactos y normalización de bases.",
      anchorId: "prompts-formulas",
      icono: "code",
    },
    {
      numero: 4,
      titulo: "Dinámicas y gráficos",
      resumen: "16 prompts para resumir KPIs y elegir visualizaciones claras.",
      anchorId: "prompts-tablas-dinamicas",
      icono: "chart",
    },
    {
      numero: 5,
      titulo: "VBA, PQ y análisis",
      resumen: "16 prompts para automatizar flujos y redactar hallazgos.",
      anchorId: "prompts-vba-power-query",
      icono: "terminal",
    },
    {
      numero: 6,
      titulo: "Validación final",
      resumen: "Lista de chequeo para detectar errores antes de entregar.",
      anchorId: "validar-respuesta-ia",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Microsoft Excel 365 / Excel 2021+ (compatible con ChatGPT, Claude, Gemini o Copilot)",
    lista: [
      "Acceso a un asistente de IA generativa (ChatGPT, Claude, Gemini o Microsoft Copilot según la documentación oficial de cada proveedor, consultado el 21 de noviembre de 2026).",
      "Planilla de Excel con encabezados claros en la fila 1 y formato de Tabla oficial (Ctrl + T) cuando trabajes con Copilot.",
      "Datos anonimizados o de ejemplo si vas a pegar filas en chats web externos.",
    ],
    compatibilidadMacWeb:
      "Los prompts funcionan igual desde navegador en Windows, Mac o Linux. En Excel para Mac o Excel Web ten en cuenta que algunas funciones modernas como BUSCARX están disponibles en Microsoft 365, mientras que las macros VBA completas requieren Excel de escritorio en Windows o Mac.",
  },
  herramientasHowTo: ["Microsoft Excel", "ChatGPT / Claude / Gemini / Copilot"],
  insumosHowTo: ["Tabla de ejemplo anonimizada", "Biblioteca de 50 prompts"],
  secciones: [
    {
      id: "como-escribir-buen-prompt",
      titulo: "1. Cómo escribir un buen prompt para Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Estructura tu instrucción en cuatro bloques: contexto de versión e idioma, esquema de tabla de ejemplo, resultado esperado y formato de entrega.",
      parrafos: [
        "La mayoría de las respuestas mediocres que entrega una IA en Excel no ocurren porque el modelo no sepa fórmulas, sino porque el usuario escribe una frase vaga como «dame una fórmula para buscar clientes». Sin saber en qué columna está la clave, qué versión de Excel utilizas ni si tu configuración regional usa punto y coma o coma, el modelo adivina y suele devolver sintaxis en inglés que arroja error de nombre o de argumento.",
        "Para obtener código que funcione al primer intento, estructura cada pedido en cuatro piezas breves: primero indica tu versión (por ejemplo, Excel 365 en español de Chile con separador punto y coma); segundo pega los nombres exactos de columnas y 3 filas ficticias; tercero describe la regla de negocio incluyendo qué hacer cuando falte un dato; cuarto exige el formato de respuesta (fórmula lista, explicación de bordes y equivalencia en inglés si compartes archivos).",
      ],
      lista: [
        "Contexto técnico: versión de Excel (2016, 2021, 365), idioma de la interfaz y separador de argumentos (; en español de Chile).",
        "Tabla de ejemplo: encabezados exactos (A1:E1) y al menos tres filas sintéticas con casos normales y casos difíciles (celdas vacías o texto con espacios).",
        "Resultado esperado: qué valor exacto debería devolver la fórmula para esas tres filas de muestra, de modo que la IA pueda verificar su propia lógica.",
        "Formato de salida: pide explícitamente «devuelve primero la fórmula en español lista para copiar y luego dime en qué casos podría fallar».",
      ],
      codigos: [
        {
          titulo: "Plantilla maestra reutilizable para cualquier tarea en Excel",
          lenguaje: "prompt",
          codigo: `Actúa como analista senior de Excel en español (Chile).
Versión: Microsoft Excel 365 en español, separador de argumentos punto y coma (;).
Mi tabla se llama tblVentas y tiene estas columnas:
- Columna A: Fecha (dd-mm-aaaa)
- Columna B: Sucursal (texto, puede traer espacios extra)
- Columna C: SKU (código alfanumérico)
- Columna D: MontoNeto (entero en CLP)

Necesito calcular en la columna E el monto acumulado por Sucursal y SKU, devolviendo 0 si no hay coincidencias.
Entrega:
1) La fórmula exacta en español usando ;
2) Su equivalente en inglés usando ,
3) Tres casos borde que debo revisar antes de arrastrar la fórmula.`,
        },
      ],
      captura: {
        id: "prompts-para-excel-paso-1",
        alt: "Ejemplo de prompt estructurado en cuatro partes pegado en un asistente de IA devolviendo fórmula Excel en español",
        caption:
          "Un prompt con esquema de columnas, idioma y separador evita errores #¿NOMBRE? al pegar la fórmula en Excel.",
        ratio: "16/9",
      },
      verificaResultado:
        "Comprueba que la respuesta use nombres de funciones en español (SI, BUSCARX, SUMAR.SI.CONJUNTO) y separador punto y coma (;), salvo que tu Excel esté configurado en inglés.",
    },
    {
      id: "tabla-comparativa-tareas",
      titulo: "2. Tabla comparativa según tipo de tarea",
      parrafos: [
        "Antes de pedirle una fórmula gigante a la IA, evalúa si realmente necesitas una fórmula en la hoja o si conviene resolver el problema en Power Query, VBA o análisis conversacional. Pedir una macro cuando basta un BUSCARX añade mantenimiento innecesario; pedir fórmulas anidadas de ocho niveles para limpiar veinte archivos mensuales vuelve lenta la planilla.",
      ],
      tabla: {
        caption: "Qué herramienta pedirle a la IA según el problema en Excel",
        encabezados: [
          "Tipo de tarea",
          "Mejor enfoque en Excel",
          "Qué pedirle a la IA",
          "Señal de alerta para cambiar de enfoque",
        ],
        filas: [
          [
            "Cálculos fila a fila o cruces puntuales",
            "Fórmulas nativas (BUSCARX, SUMAR.SI.CONJUNTO, SI.CONJUNTO)",
            "Fórmula directa en español (;) y prueba con 3 filas de ejemplo",
            "Cuando la fórmula supera 4 o 5 anidamientos difíciles de auditar",
          ],
          [
            "Limpiar CSV, unificar carpetas o separar columnas repetitivas",
            "Power Query (lenguaje M)",
            "Pasos de interfaz o script M completo desde Origen hasta Tipo cambiado",
            "Si requieres botones o interacción visual dentro de la hoja",
          ],
          [
            "Generar PDFs por sucursal, enviar correos o tareas de botón",
            "Macro VBA con Option Explicit",
            "Subrutina comentada con manejo de errores y sin usar Select",
            "Si el equipo trabaja en Excel Web donde VBA no se ejecuta",
          ],
          [
            "Explorar tendencias, redactar resumen ejecutivo o detectar anomalías",
            "Tabla dinámica + análisis con IA",
            "Preguntas sobre KPIs agregados sobre una tabla resumen anonimizada",
            "Nunca envíes bases crudas con datos personales a chats públicos",
          ],
        ],
      },
    },
    {
      id: "prompts-formulas",
      titulo: "3. Prompts para fórmulas (1 al 10)",
      esPasoHowTo: true,
      resumenHowTo:
        "Copia los primeros 10 prompts dedicados a búsquedas, condicionales, fechas hábiles, texto y agregaciones multicriterio, junto a sus fórmulas verificadas.",
      parrafos: [
        "Los primeros diez prompts cubren el 80 % de los cálculos diarios en áreas comerciales, financieras y de operaciones. En los bloques copiables tienes dos prompts listos para pegar y debajo la lista numerada del 1 al 10 con cada escenario concreto y su fórmula resultante en español e inglés.",
      ],
      listaOrdenada: [
        "1. Búsqueda exacta con manejo de ausencia: «Tengo SKU en A2 y la tabla Productos en Hoja2!A2:D500 (SKU en A, Precio en D). Dame una fórmula BUSCARX en español (;) que devuelva el precio y muestre 'Sin registro' si no existe.»",
        "2. Suma condicional por dos criterios y rango de fechas: «En Ventas!A2:E1000 tengo Fecha en A, Vendedor en B y Neto en E. Suma Neto del vendedor 'Norte-01' entre el 01-10-2026 y el 31-10-2026 usando SUMAR.SI.CONJUNTO.»",
        "3. Clasificación por tramos de cumplimiento: «Con el porcentaje de meta en C2, devuelve 'Bajo' si es menor a 80%, 'Cumple' entre 80% y 100%, y 'Sobresaliente' si supera 100%, usando SI.CONJUNTO en español.»",
        "4. Extraer texto entre delimitadores: «En A2 viene 'FAC-2026-00481-CL'. Dame una fórmula compatible con Excel 2021 y 365 que extraiga solo '00481' sin importar el largo del prefijo.»",
        "5. Calcular días hábiles excluyendo feriados: «Fecha inicio en A2, fecha término en B2 y rango de feriados en Feriados!$A$2:$A$20. Calcula los días hábiles reales con DIAS.LAB.»",
        "6. Buscar por dos columnas combinadas sin columna auxiliar: «Necesito traer el costo desde Tarifas!C2:C200 donde Tarifas!A2:A200 sea igual a A2 (Región) y Tarifas!B2:B200 sea igual a B2 (Servicio), usando BUSCARX.»",
        "7. Contar valores únicos con condición: «En A2:A500 hay clientes repetidos y en B2:B500 el estado ('Pagado' o 'Pendiente'). Dame una fórmula para Excel 365 que cuente clientes únicos en estado 'Pagado'.»",
        "8. Calcular variación porcentual segura frente a ceros: «Venta actual en B2 y venta anterior en A2. Calcula la variación porcentual devolviendo 0% si A2 es 0 o está vacía, sin usar SI.ERROR genérico que oculte otros fallos.»",
        "9. Último precio registrado por fecha: «En Movimientos!A2:C500 tengo Fecha (A), Producto (B) y Costo (C), sin ordenar. Dame la fórmula para obtener el costo más reciente del producto en E2.»",
        "10. Validar formato de texto y longitud mínima: «Verifica si el código en A2 tiene exactamente 10 caracteres, empieza con 'PRD-' y no contiene espacios al inicio ni al final, devolviendo VERDADERO o FALSO.»",
      ],
      codigos: [
        {
          titulo: "Prompt #1 y #6 — Búsqueda multicriterio con BUSCARX",
          lenguaje: "prompt",
          codigo: `En Excel 365 en español (separador ;), tengo Región en A2 y Servicio en B2.
La tabla Tarifas tiene Región en Tarifas!A2:A200, Servicio en Tarifas!B2:B200 y Costo en Tarifas!C2:C200.
Escribe la fórmula BUSCARX combinando ambos criterios sin crear columnas auxiliares, y devuelve "No tarifado" si no hay coincidencia.`,
        },
        {
          titulo: "Fórmulas verificadas para Prompt #1, #2, #3 y #6",
          lenguaje: "excel",
          codigo: `=BUSCARX(A2;Hoja2!A2:A500;Hoja2!D2:D500;"Sin registro";0)
=SUMAR.SI.CONJUNTO(Ventas!E2:E1000;Ventas!B2:B1000;"Norte-01";Ventas!A2:A1000;">=2026-10-01";Ventas!A2:A1000;"<=2026-10-31")
=SI.CONJUNTO(C2<0,8;"Bajo";C2<=1;"Cumple";C2>1;"Sobresaliente")
=BUSCARX(A2&"|"&B2;Tarifas!A2:A200&"|"&Tarifas!B2:B200;Tarifas!C2:C200;"No tarifado";0)`,
          codigoEn: `=XLOOKUP(A2,Hoja2!A2:A500,Hoja2!D2:D500,"Sin registro",0)
=SUMIFS(Ventas!E2:E1000,Ventas!B2:B1000,"Norte-01",Ventas!A2:A1000,">=2026-10-01",Ventas!A2:A1000,"<=2026-10-31")
=IFS(C2<0.8,"Bajo",C2<=1,"Cumple",C2>1,"Sobresaliente")
=XLOOKUP(A2&"|"&B2,Tarifas!A2:A200&"|"&Tarifas!B2:B200,Tarifas!C2:C200,"No tarifado",0)`,
          nota: "Nota el separador decimal: coma en español de Chile (0,8) y punto en inglés (0.8).",
        },
      ],
      captura: {
        id: "prompts-para-excel-paso-2",
        alt: "Fórmula BUSCARX multicriterio evaluándose correctamente en una planilla de Excel en español",
        caption:
          "Prueba siempre la fórmula devuelta por la IA sobre una fila existente y otra inexistente para confirmar el manejo de errores.",
        ratio: "16/9",
      },
      verificaResultado:
        "Revisa que las fechas dentro de SUMAR.SI.CONJUNTO respeten el formato ISO (AAAA-MM-DD) o usen FECHA(2026;10;1) para que no dependan del formato regional del equipo.",
    },
    {
      id: "prompts-limpieza-datos",
      titulo: "4. Prompts para limpieza de datos (11 al 18)",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa estos 8 prompts para quitar espacios invisibles, convertir fechas importadas como texto, unificar mayúsculas y detectar duplicados.",
      parrafos: [
        "Cuando importas exportaciones de ERP, bancos o formularios web, la mitad del tiempo se pierde limpiando caracteres invisibles, números guardados como texto o fechas invertidas entre mes y día. Estos ocho prompts atacan exactamente esos problemas.",
      ],
      listaOrdenada: [
        "11. Eliminar espacios dobles y caracteres no imprimibles: «La columna A tiene nombres de productos pegados desde PDF con saltos de línea y espacios extra. Dame la combinación de ESPACIOS y LIMPIAR en español.»",
        "12. Convertir números con punto de miles o texto a número real: «La columna B trae montos como '1.450.200 ' como texto. Dame una fórmula o pasos en Excel para convertirlos a entero sin dañar celdas vacías.»",
        "13. Reparar fechas en formato texto MM/DD/AAAA a fecha real: «Tengo fechas texto como '11/21/2026' en A2. Convierte esto a fecha válida de Excel sin depender de la configuración regional.»",
        "14. Normalizar nombres propios en español: «Convierte 'JUAN PÉREZ SOTO' en 'Juan Pérez Soto' y dime cómo evitar que preposiciones como 'de' queden mal si necesito reporte formal.»",
        "15. Separar nombre completo en Nombre y Apellido: «En A2 tengo 'María José González Muñoz'. Dame fórmulas para separar primer nombre y apellidos considerando nombres compuestos simples.»",
        "16. Marcar filas duplicadas conservando solo la primera aparición: «En A2:A1000 tengo folios de factura. Quiero una fórmula en B2 que marque 'Original' en la primera aparición y 'Duplicado' en las repeticiones.»",
        "17. Limpiar códigos con ceros a la izquierda perdidos: «Mis códigos de sucursal deberían tener 4 dígitos (ej. 0042), pero Excel los dejó como 42. Cómo los recupero como texto de 4 dígitos sin alterar los que ya tienen 4.»",
        "18. Unificar categorías escritas con faltas de ortografía: «Tengo la lista de 15 variantes sucias de comunas ('Stgo', 'Santiago Centro', 'SANTIAGO'). Arma una tabla de mapeo y la fórmula para estandarizarlas.»",
      ],
      codigos: [
        {
          titulo: "Prompt #13 — Reparar fechas importadas en texto",
          lenguaje: "prompt",
          codigo: `En Excel en español (;) tengo en la columna A fechas importadas como texto en formato estadounidense "MM/DD/AAAA", por ejemplo "11/21/2026".
Escribe una fórmula usando FECHA, EXTRAE o DIVIDIRTEXTO que convierta ese texto en una fecha real de Excel, y que devuelva vacío "" si A2 está en blanco.`,
        },
        {
          titulo: "Fórmulas verificadas para limpieza (Prompts #11, #13 y #16)",
          lenguaje: "excel",
          codigo: `=ESPACIOS(LIMPIAR(A2))
=SI(A2="";"";FECHA(VALOR(DERECHA(A2;4));VALOR(IZQUIERDA(A2;2));VALOR(EXTRAE(A2;4;2))))
=SI(CONTAR.SI($A$2:A2;A2)=1;"Original";"Duplicado")`,
          codigoEn: `=TRIM(CLEAN(A2))
=IF(A2="","",DATE(VALUE(RIGHT(A2,4)),VALUE(LEFT(A2,2)),VALUE(MID(A2,4,2))))
=IF(COUNTIF($A$2:A2,A2)=1,"Original","Duplicado")`,
        },
      ],
      verificaResultado:
        "Después de convertir fechas o números desde texto, aplica formato numérico y verifica que SUMA o PROMEDIO sobre la columna devuelva un valor distinto de cero.",
    },
    {
      id: "prompts-tablas-dinamicas",
      titulo: "5. Prompts para tablas dinámicas y resúmenes (19 al 26)",
      parrafos: [
        "Aunque la IA externa no hace clic por ti dentro del panel de campos de la tabla dinámica (salvo Copilot integrado en Microsoft 365 cuando la tabla es oficial), sí es excelente para diseñar la arquitectura exacta del resumen: qué poner en Filas, Columnas, Valores, Filtros y qué campos calculados conviene evitar.",
      ],
      listaOrdenada: [
        "19. Diseñar la estructura de una tabla dinámica desde cero: «Tengo columnas Fecha, Vendedor, Categoría, Canal, Unidades y VentaNeto. Quiero ver desempeño mensual por canal y participación %. Indícame exactamente qué campo va en Filas, Columnas, Valores y qué configuración de 'Mostrar valores como' usar.»",
        "20. Crear un campo calculado de margen sin error de promedio de promedios: «Tengo Ingreso y Costo en la base. Dame la fórmula exacta de Campo Calculado para Margen % en una tabla dinámica y explícame por qué no debo promediar la columna Margen % de la base.»",
        "21. Agrupar fechas por año y trimestre sin desordenar meses: «Al arrastrar Fecha a Filas me muestra días sueltos. Dame los pasos exactos en Excel en español para agrupar por Año y Trimestre y añadir una escala de tiempo.»",
        "22. Comparar mes actual contra el mismo mes del año anterior en tabla dinámica: «Cómo configuro 'Mostrar valores como > Diferencia de' o '% de diferencia de' para ver la variación interanual por categoría.»",
        "23. Filtrar el Top 10 de clientes por facturación: «Quiero que la tabla dinámica muestre solo los 10 clientes con mayor VentaNeto y agrupe o oculte el resto. Dame los pasos en el filtro de etiqueta/valor.»",
        "24. Conectar un segmentador de datos a tres tablas dinámicas distintas: «Tengo 3 tablas dinámicas creadas desde la misma tabla base. Cómo conecto un único Segmentador de Sucursal a las tres.»",
        "25. Diseño tabular para reutilizar la tabla dinámica como base de otro cálculo: «Cómo configuro Diseño de informe en formato tabular, repetir todas las etiquetas de elementos y quitar subtotales automáticos.»",
        "26. Prompt para Copilot dentro de Excel: «Agrega una columna calculada con el margen porcentual de cada fila y crea una tabla dinámica en una hoja nueva que resuma ventas y margen por Región y Trimestre.»",
      ],
      codigos: [
        {
          titulo: "Prompt #19 — Arquitectura exacta de tabla dinámica",
          lenguaje: "prompt",
          codigo: `Tengo una tabla en Excel llamada tblPedidos con las columnas: Fecha, Canal, Categoria, Vendedor, Unidades, VentaNeto y CostoTotal.
Necesito una tabla dinámica para gerencia que muestre:
1) Los meses en columnas y las categorías en filas.
2) El total de VentaNeto en CLP y el porcentaje del total de la columna.
Indícame paso a paso qué campo arrastrar a Filas, Columnas y Valores, y qué opción exacta elegir en "Mostrar valores como".`,
        },
      ],
      verificaResultado:
        "Comprueba que el total general de la tabla dinámica coincida exactamente al peso con =SUMA() de tu tabla origen antes de agregar filtros.",
    },
    {
      id: "prompts-graficos",
      titulo: "6. Prompts para gráficos efectivos (27 al 34)",
      parrafos: [
        "Muchos reportes fallan porque muestran ocho series en un gráfico circular o usan ejes truncados que exageran cambios mínimos. Usa estos ocho prompts para elegir el tipo de gráfico correcto, limpiar ruido visual y redactar títulos orientados a decisión.",
      ],
      listaOrdenada: [
        "27. Elegir el gráfico correcto según la pregunta: «Quiero comparar la participación de 12 sucursales en la venta total y destacar las 3 mejores. ¿Uso gráfico circular, barras horizontales ordenadas o treemap? Justifica en 3 líneas.»",
        "28. Configurar un gráfico combinado (columnas + línea de meta): «Tengo Mes en A2:A13, VentaReal en B2:B13 y Meta% en C2:C13. Dame los pasos exactos en Excel en español para crear un gráfico combinado con eje secundario solo para Meta%.»",
        "29. Crear un gráfico de cascada (Waterfall) para explicar variación de utilidad: «Tengo utilidad inicial, variación por precio, variación por volumen, gastos extra y utilidad final. Cómo armo los datos y configuro el puente en Excel.»",
        "30. Mejorar un gráfico recargado (decluttering): «Mi gráfico de líneas tiene 6 colores parecidos, cuadrícula oscura, leyenda abajo y etiquetas en cada punto. Dame una lista de 6 ajustes concretos en formato para volverlo ejecutivo.»",
        "31. Título dinámico vinculado a una celda: «Quiero que el título del gráfico cambie automáticamente según la sucursal elegida en el segmentador usando una celda auxiliar con fórmula.»",
        "32. Destacar automáticamente el valor máximo y mínimo en barras: «Dame la estructura de 2 columnas auxiliares con fórmulas SI y MAX/MIN para pintar en verde la barra más alta y en rojo la más baja.»",
        "33. Evitar distorsión en el eje vertical: «Mis ventas oscilan entre 98M y 102M y Excel puso el eje Y empezando en 95M. Explícame cuándo debo fijar el mínimo en 0 y cuándo conviene usar un gráfico de variación.»",
        "34. Redactar título y subtítulo orientados a hallazgo: «Mi gráfico muestra que la categoría Hogar subió 18% en Q3 mientras Electrónica cayó 4%. Dame 3 opciones de título ejecutivo de máximo 12 palabras.»",
      ],
      verificaResultado:
        "Confirma que el gráfico tenga un título descriptivo, unidades explícitas (por ejemplo, «Miles de CLP» o «%») y que los datos de las barras coincidan con la tabla origen.",
    },
    {
      id: "prompts-vba-power-query",
      titulo: "7. Prompts para VBA y Power Query (35 al 42)",
      esPasoHowTo: true,
      resumenHowTo:
        "Automatiza consolidación de archivos con Power Query (M) y tareas repetitivas de exportación con macros VBA seguras que incluyen Option Explicit.",
      parrafos: [
        "Cuando una tarea se repite todas las semanas, las fórmulas no alcanzan. Estos ocho prompts te ayudan a generar scripts en lenguaje M para Power Query y subrutinas VBA limpias, sin depender de grabadoras de macros llenas de ActiveCell y Select.",
      ],
      listaOrdenada: [
        "35. Unificar todos los CSV de una carpeta en Power Query: «Escribe el paso a paso en Power Query y el código M para leer todos los archivos .csv de una carpeta local, promover encabezados una sola vez y conservar el nombre del archivo origen como columna.»",
        "36. Anular dinamización de columnas de meses (Unpivot): «Tengo una tabla con Producto en la primera columna y 12 columnas llamadas Ene, Feb, Mar... Dic. Dame el código M de Table.UnpivotOtherColumns para dejarlo en formato largo (Producto, Mes, Valor).»",
        "37. Crear columna condicional limpia en Power Query: «En lenguaje M, agrega una columna llamada Tramo que clasifique Monto: menor a 100000 'Pequeño', entre 100000 y 500000 'Mediano', mayor a 500000 'Grande', y maneje nulos sin error.»",
        "38. Parámetro de ruta en Power Query para compartir archivos: «Cómo creo un parámetro RutaCarpeta en Power Query y lo reemplazo dentro de Folder.Files() para que otro colega solo cambie la ruta en un lugar.»",
        "39. Macro VBA para exportar cada hoja seleccionada a PDF: «Escribe una macro VBA con Option Explicit que exporte la hoja 'Resumen' a PDF en la misma carpeta del libro usando el valor de la celda B2 como parte del nombre y maneje errores si la carpeta es de solo lectura.»",
        "40. Macro VBA para limpiar filtros de todas las tablas del libro: «Dame una subrutina VBA que recorra todas las hojas y ListObjects y quite los autofiltros activos sin usar Select ni Activate.»",
        "41. Depurar un error 1004 en VBA: «Mi macro falla con 'Error 1004 en tiempo de ejecución' al copiar un rango entre hojas ocultas. Explícame las 3 causas más probables y reescribe el bloque usando referencias directas a Workbook y Worksheet.»",
        "42. Optimizar una macro lenta: «Mi macro tarda 40 segundos en procesar 5.000 filas. Dame el patrón en VBA para desactivar ScreenUpdating, Calculation y Events al inicio y restaurarlos siempre en un bloque de salida segura.»",
      ],
      codigos: [
        {
          titulo: "Prompt #39 — Macro VBA segura para exportar PDF",
          lenguaje: "prompt",
          codigo: `Escribe una macro VBA para Excel en Windows usando Option Explicit.
Debe exportar la hoja llamada "Resumen" a PDF en la misma carpeta donde está guardado el libro activo (ThisWorkbook.Path).
El nombre del archivo debe ser "Reporte_" seguido del texto en la celda B2 (sanitizando caracteres inválidos como / o :) y ".pdf".
Incluye manejo de errores On Error GoTo y verifica primero que el libro haya sido guardado alguna vez.`,
        },
        {
          titulo: "Código VBA resultante revisado (con Option Explicit)",
          lenguaje: "vba",
          codigo: `Option Explicit

Public Sub ExportarResumenAPDF()
    Dim ws As Worksheet
    Dim rutaBase As String
    Dim nombreLimpio As String
    Dim rutaFinal As String

    On Error GoTo ManejadorError

    rutaBase = ThisWorkbook.Path
    If Len(rutaBase) = 0 Then
        MsgBox "Guarda el libro antes de exportar a PDF.", vbExclamation
        Exit Sub
    End If

    Set ws = ThisWorkbook.Worksheets("Resumen")
    nombreLimpio = Trim$(CStr(ws.Range("B2").Value))
    nombreLimpio = Replace(nombreLimpio, "/", "-")
    nombreLimpio = Replace(nombreLimpio, ":", "-")
    If Len(nombreLimpio) = 0 Then nombreLimpio = "SinNombre"

    rutaFinal = rutaBase & Application.PathSeparator & "Reporte_" & nombreLimpio & ".pdf"
    ws.ExportAsFixedFormat Type:=xlTypePDF, Filename:=rutaFinal, OpenAfterPublish:=False
    MsgBox "PDF generado en: " & rutaFinal, vbInformation
    Exit Sub

ManejadorError:
    MsgBox "No se pudo exportar el PDF (" & Err.Number & "): " & Err.Description, vbCritical
End Sub`,
        },
      ],
      captura: {
        id: "prompts-para-excel-paso-3",
        alt: "Editor de VBA en Excel mostrando una subrutina con Option Explicit y manejo de errores",
        caption:
          "Exige siempre Option Explicit y referencias explícitas (ThisWorkbook.Worksheets) para evitar errores en segundo plano.",
        ratio: "16/9",
      },
      verificaResultado:
        "Prueba cualquier macro VBA o consulta Power Query primero en una copia del archivo, porque las macros ejecutadas desde VBA no se pueden deshacer con Ctrl + Z.",
    },
    {
      id: "prompts-analisis-conclusiones",
      titulo: "8. Prompts para análisis y conclusiones (43 al 50)",
      parrafos: [
        "Una vez que tus números están limpios y resumidos en una tabla pequeña (sin datos personales), la IA te ayuda a detectar variaciones atípicas, plantear hipótesis y redactar conclusiones claras para gerencia.",
      ],
      listaOrdenada: [
        "43. Resumen ejecutivo de una tabla de KPIs: «Te pego esta tabla agregada de ventas trimestrales por categoría (sin datos de clientes). Resume los 3 hallazgos principales en lenguaje directo para gerencia, citando únicamente cifras presentes en la tabla.»",
        "44. Detectar valores atípicos o anomalías: «Revisa esta tabla mensual de mermas por bodega e identifica qué meses y bodegas se desvían más de la tendencia habitual, explicando qué dato adicional deberíamos investigar.»",
        "45. Redactar preguntas de seguimiento antes de una reunión: «A partir de esta caída de margen en Q3 del canal mayorista, dime 5 preguntas concretas que debería hacerle al equipo comercial para confirmar la causa raíz.»",
        "46. Traducir métricas técnicas a lenguaje de negocio: «Explica en 4 líneas qué significa que el ticket promedio subió 9% pero la frecuencia de compra cayó 14% en esta tabla resumen.»",
        "47. Proponer hipótesis sobre estacionalidad: «Observando estos totales mensuales de los últimos 24 meses, describe el patrón estacional visible y qué cuidado debo tener al comparar noviembre contra octubre.»",
        "48. Armar tabla de riesgos y supuestos para un presupuesto: «Con base en estas líneas de gasto fijo y variable, redacta 4 supuestos clave y 3 riesgos que deberían ir al pie de la hoja de presupuesto.»",
        "49. Auditar consistencia entre dos tablas resumen: «Te pego el resumen por sucursal y el resumen por categoría del mismo mes. Verifica si ambos totales generales cuadran o dónde hay diferencia.»",
        "50. Convertir hallazgos en un correo breve de cierre mensual: «Redacta un correo de máximo 120 palabras para enviar junto al archivo Excel adjunto, destacando avance vs meta y el próximo paso para la semana.»",
      ],
      codigos: [
        {
          titulo: "Prompt #43 — Resumen ejecutivo sin alucinaciones",
          lenguaje: "prompt",
          codigo: `Analiza únicamente la siguiente tabla agregada de ventas y margen por categoría (datos sintéticos en miles de CLP).
Reglas estrictas:
- No inventes causas externas ni cifras que no aparezcan en la tabla.
- Entrega exactamente 3 hallazgos cuantificados y 2 preguntas para investigar en la base de detalle.
[Pega aquí tu tabla resumen de 5 a 15 filas]`,
        },
      ],
      verificaResultado:
        "Recalcula manualmente al menos dos porcentajes o diferencias citadas por la IA en su resumen escrito antes de enviar el correo a jefatura.",
    },
    {
      id: "validar-respuesta-ia",
      titulo: "9. Cómo validar lo que responde la IA",
      parrafos: [
        "La regla de oro al trabajar con IA en Excel es tratar cada fórmula, script o conclusión como un borrador de un practicante rápido: puede ahorrar veinte minutos de escritura, pero la responsabilidad final del número es tuya.",
        "Si quieres profundizar en flujos con modelos específicos, revisa nuestras guías dedicadas sobre cómo usar Claude para análisis de datos y la comparativa de Claude vs ChatGPT para análisis de datos.",
      ],
      lista: [
        "Prueba en 3 filas controladas: una fila normal, una con celda vacía y una con texto que no exista en la tabla de referencia.",
        "Verifica el separador: punto y coma (;) en español de Chile y coma (,) en inglés; revisa también decimales (coma vs punto).",
        "Confirma que la función exista en tu versión de Excel: BUSCARX, DIVIDIRTEXTO y UNICOS no funcionan en Excel 2016 sin Microsoft 365.",
        "En VBA y Power Query, ejecuta siempre sobre una copia de respaldo del libro antes de tocar datos productivos.",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "Excel muestra #¿NOMBRE? al pegar la fórmula generada por la IA",
      causa:
        "La IA respondió con nombres de funciones en inglés (XLOOKUP, IFERROR) en un Excel en español, o usó una función exclusiva de Microsoft 365 en Excel 2016/2019.",
      solucion:
        "Indica en el prompt «Excel en español, separador punto y coma (;)» y especifica tu versión exacta (por ejemplo, Excel 2019).",
    },
    {
      error: "Aparece una ventana emergente indicando que hay un problema con la fórmula",
      causa:
        "El prompt no especificó el separador regional y la IA usó coma (,) en lugar de punto y coma (;), o dejó comillas tipográficas curvas (“ ”) en vez de comillas rectas.",
      solucion:
        "Pide código en bloque sin formato enriquecido y reemplaza comas de argumento por punto y coma.",
    },
    {
      error: "La macro VBA funciona en el archivo de prueba pero falla en otro libro",
      causa:
        "El código generado por la IA usa nombres de hoja fijos ('Hoja1'), rangos fijos o ActiveSheet en lugar de parámetros flexibles.",
      solucion:
        "Exige Option Explicit y pide que los nombres de hoja y rutas se definan en constantes al inicio de la subrutina.",
    },
    {
      error: "La IA inventa cifras o porcentajes en el análisis escrito",
      causa:
        "Se pegó una tabla muy grande o con formato confuso y se pidió una conclusión abierta sin restringir al modelo a citar solo datos presentes.",
      solucion:
        "Pega tablas resumen pequeñas (máximo 15-20 filas) y añade la regla explícita de no inferir ni inventar valores fuera de la tabla.",
    },
  ],
  plantilla: {
    titulo: "Plantilla descargable con los 50 prompts y casos de prueba",
    descripcion:
      "Próximamente podrás descargar aquí un libro .xlsx de práctica con las tablas ficticias y las 50 fórmulas y scripts listos para probar.",
  },
  faqs: [
    {
      q: "¿Qué IA funciona mejor para fórmulas y macros de Excel?",
      a: "Tanto ChatGPT como Claude y Gemini resuelven bien fórmulas y Power Query si entregas el esquema de columnas y tu idioma/separador. Para macros VBA largas o refactorización de código M complejo, Claude y ChatGPT suelen mantener mejor la consistencia; dentro de Microsoft 365, Copilot tiene la ventaja de leer directamente las Tablas del libro sin copiar y pegar.",
    },
    {
      q: "¿Puedo pegar una planilla con sueldos o RUT reales en ChatGPT o Claude gratis?",
      a: "No es recomendable. Antes de usar chats públicos web, anonimiza identificadores personales (RUT, nombres, correos, sueldos reales) o reemplázalos por códigos y cifras sintéticas. Revisa siempre la política de privacidad y retención de tu plan antes de subir archivos corporativos.",
    },
    {
      q: "¿Por qué Copilot no me deja analizar mi rango de celdas en Excel?",
      a: "Copilot en Excel requiere que los datos estén convertidos en una Tabla oficial de Excel (Ctrl + T) y que el archivo esté guardado en OneDrive o SharePoint con Autoguardado activado, según la documentación oficial de Microsoft Learn (consultado el 21 de noviembre de 2026).",
    },
    {
      q: "¿Cómo evito que la IA me dé fórmulas de Excel 365 si uso Excel 2019?",
      a: "Declara explícitamente al inicio del prompt: «Uso Excel 2019 en español (sin BUSCARX, FILTRAR ni UNICOS). Resuélvelo con INDICE/COINCIDIR o SUMAR.SI.CONJUNTO».",
    },
  ],
  relacionadas: [
    "ia-para-excel-chatgpt-claude-gemini",
    "como-usar-copilot-en-excel",
    "tabla-dinamica-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Funciones de Excel (por categoría)",
      url: "https://learn.microsoft.com/es-es/office/vba/api/overview/excel",
      fuente: "Microsoft Learn",
    },
    {
      label: "Documentación de Copilot en Excel",
      url: "https://learn.microsoft.com/es-es/copilot/microsoft-365/excel-copilot",
      fuente: "Microsoft Learn",
    },
    {
      label: "Guía de ingeniería de prompts (OpenAI)",
      url: "https://platform.openai.com/docs/guides/prompt-engineering",
      fuente: "OpenAI Docs",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "Cómo usar Claude para análisis de datos",
      href: "/guias/como-usar-claude-para-analisis-de-datos",
      descripcion: "Flujo práctico para analizar planillas, escribir fórmulas y depurar scripts con Claude.",
    },
    {
      label: "Claude vs ChatGPT para análisis de datos",
      href: "/guias/claude-vs-chatgpt-analisis-de-datos",
      descripcion: "Comparativa práctica para elegir el modelo según tu tarea en Excel, SQL o Python.",
    },
  ],
};

export default guia;
