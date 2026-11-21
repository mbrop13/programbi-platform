import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "formulas-de-excel-mas-usadas",
  title: "Fórmulas de Excel más usadas: 30 ejemplos por nivel",
  meta: "Las fórmulas de Excel más usadas, de básicas a avanzadas: SUMAR.SI, CONTAR.SI, SI, BUSCARX, FILTRAR, UNICOS, LET y más, con ejemplos para copiar.",
  h1: "Las fórmulas de Excel más usadas (con ejemplos)",
  subtitle:
    "Domina 30 fórmulas esenciales de Excel organizadas por nivel —desde suma y promedios hasta BUSCARX, matrices dinámicas, LET y LAMBDA—, con sintaxis en español (;), equivalente en inglés (,) y tabla de equivalencias.",
  keywordPrincipal: "fórmulas de excel",
  keywords: [
    "fórmulas de excel",
    "fórmulas de Excel más utilizadas",
    "fórmulas Excel básicas intermedias avanzadas",
    "SUMAR.SI CONTAR.SI Excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT30M",
  en30Segundos: {
    queLogras:
      "Tener a mano las 30 fórmulas de Excel más utilizadas en el trabajo diario, listas para copiar en español o inglés y entender qué problema resuelve cada nivel.",
    herramienta: "Microsoft Excel",
    tiempo: "30 minutos",
    bullets: [
      "Resolver conteos, mínimos, máximos y resúmenes básicos sin errores de celdas vacías.",
      "Aplicar lógica condicional con SI, Y, O, SUMAR.SI.CONJUNTO y CONTAR.SI.CONJUNTO.",
      "Cruzar tablas con BUSCARV, BUSCARX e INDICE + COINCIDIR sin romper columnas.",
      "Limpiar textos, calcular fechas hábiles y usar matrices dinámicas (FILTRAR, UNICOS, LET, LAMBDA).",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Básicas (1–5)",
      resumen: "SUMA, PROMEDIO, CONTAR, CONTARA, MIN y MAX.",
      anchorId: "formulas-basicas",
      icono: "table",
    },
    {
      numero: 2,
      titulo: "Condicionales (6–12)",
      resumen: "SI, Y/O, SUMAR.SI, CONTAR.SI y variantes CONJUNTO.",
      anchorId: "formulas-condicionales",
      icono: "settings",
    },
    {
      numero: 3,
      titulo: "Búsqueda (13–15)",
      resumen: "BUSCARV, BUSCARX e INDICE + COINCIDIR.",
      anchorId: "formulas-busqueda",
      icono: "database",
    },
    {
      numero: 4,
      titulo: "Texto y fechas (16–23)",
      resumen: "ESPACIOS, EXTRAE, TEXTODESPUES, HOY, FIN.MES, DIAS.LAB.",
      anchorId: "formulas-texto-fechas",
      icono: "file",
    },
    {
      numero: 5,
      titulo: "Matrices (24–27)",
      resumen: "FILTRAR, UNICOS, ORDENAR y SECUENCIA.",
      anchorId: "matrices-dinamicas",
      icono: "layers",
    },
    {
      numero: 6,
      titulo: "Avanzadas (28–30)",
      resumen: "LET, LAMBDA, SI.ERROR y tabla ES/EN.",
      anchorId: "formulas-avanzadas-equivalencias",
      icono: "code",
    },
  ],
  requisitos: {
    version: "Excel 2016+ para funciones clásicas; Excel 365 / 2021+ para BUSCARX, matrices y LET",
    lista: [
      "Microsoft Excel en español (separador de argumentos ;) o en inglés (separador ,).",
      "Planilla con una fila de encabezados y columnas con tipos de datos consistentes (números como número, fechas como fecha).",
      "Para BUSCARX, TEXTODESPUES, FILTRAR, UNICOS, ORDENAR, SECUENCIA, LET y LAMBDA se requiere Excel para Microsoft 365 o Excel Web.",
    ],
    compatibilidadMacWeb:
      "Todas las fórmulas funcionan tanto en Excel para Windows como en Excel para macOS y Excel en la web. En equipos con configuración regional de Chile, el separador de lista estándar es punto y coma (;), mientras que en configuraciones en inglés es coma (,).",
    avisoEducativo:
      "Los rangos de ejemplo (como A2:A50 o B2:B50) asumen que la fila 1 contiene los encabezados de tu tabla.",
  },
  herramientasHowTo: ["Microsoft Excel"],
  insumosHowTo: ["Planilla de datos tabulares"],
  secciones: [
    {
      id: "formulas-basicas",
      titulo: "1. Fórmulas básicas (ejemplos 1 al 5)",
      esPasoHowTo: true,
      resumenHowTo:
        "Aplica las funciones esenciales de agregación y conteo para resumir cualquier rango numérico o de texto.",
      parrafos: [
        "Antes de saltar a funciones complejas, el 60% del trabajo operativo en planillas se resuelve dominando las funciones de agregación básica. La clave para no equivocarse está en saber qué hace cada función cuando encuentra texto o celdas vacías dentro del rango.",
        "Por ejemplo, CONTAR cuenta únicamente celdas que contienen números o fechas válidas, mientras que CONTARA cuenta cualquier celda que no esté vacía (incluyendo textos y códigos alfanuméricos como un RUT o un SKU). Por su parte, PROMEDIO ignora celdas vacías pero sí incluye ceros escritos explícitamente.",
      ],
      codigos: [
        {
          titulo: "Ejemplos 1 al 5: SUMA, PROMEDIO, CONTAR, CONTARA y MIN/MAX",
          lenguaje: "excel",
          codigo: `// 1. SUMA: total de ventas en el rango D2:D50
=SUMA(D2:D50)

// 2. PROMEDIO: ticket promedio de ventas
=PROMEDIO(D2:D50)

// 3. CONTAR: cuántas celdas tienen monto numérico en D2:D50
=CONTAR(D2:D50)

// 4. CONTARA: cuántos pedidos o códigos no vacíos hay en A2:A50
=CONTARA(A2:A50)

// 5. MIN y MAX: menor y mayor venta registrada en el período
=MIN(D2:D50)
=MAX(D2:D50)`,
          codigoEn: `// 1. SUM
=SUM(D2:D50)

// 2. AVERAGE
=AVERAGE(D2:D50)

// 3. COUNT
=COUNT(D2:D50)

// 4. COUNTA
=COUNTA(A2:A50)

// 5. MIN & MAX
=MIN(D2:D50)
=MAX(D2:D50)`,
        },
      ],
      captura: {
        id: "formulas-de-excel-mas-usadas-paso-1",
        alt: "Planilla de Excel mostrando tarjetas resumen con SUMA, PROMEDIO, CONTAR, CONTARA, MIN y MAX",
        caption:
          "Combina CONTAR (solo números) y CONTARA (cualquier celda no vacía) para detectar filas sin monto.",
        ratio: "16/9",
      },
    },
    {
      id: "formulas-condicionales",
      titulo: "2. Fórmulas condicionales (ejemplos 6 al 12)",
      esPasoHowTo: true,
      resumenHowTo:
        "Evalúa reglas de negocio con SI, Y, O y resume montos o conteos por uno o múltiples criterios.",
      parrafos: [
        "Las fórmulas condicionales permiten que tu planilla tome decisiones automáticas o sume únicamente las filas que cumplen determinadas reglas, sin tener que filtrar y copiar a mano cada fin de mes.",
        "Cuando necesites evaluar más de una condición en una fila, combina SI con Y (todas deben cumplirse) o con O (basta con que una se cumpla). Para resumir columnas completas, acostúmbrate a usar SUMAR.SI.CONJUNTO y CONTAR.SI.CONJUNTO incluso cuando tengas un solo criterio, porque permiten agregar nuevas condiciones después sin reescribir el orden de los argumentos.",
      ],
      codigos: [
        {
          titulo: "Ejemplos 6 al 12: SI, Y/O, SUMAR.SI, SUMAR.SI.CONJUNTO, CONTAR.SI, CONTAR.SI.CONJUNTO y PROMEDIO.SI",
          lenguaje: "excel",
          codigo: `// 6. SI: clasifica si la venta supera la meta de $500.000
=SI(D2>=500000; "Cumple"; "Bajo meta")

// 7. Y / O dentro de SI: bono si región es Norte Y monto >= 300.000 (o VIP)
=SI(O(E2="VIP"; Y(B2="Norte"; D2>=300000)); "Aplica bono"; "Sin bono")

// 8. SUMAR.SI: total vendido en la sucursal "Centro"
=SUMAR.SI(B2:B50; "Centro"; D2:D50)

// 9. SUMAR.SI.CONJUNTO: total "Centro" en estado "Pagado"
=SUMAR.SI.CONJUNTO(D2:D50; B2:B50; "Centro"; C2:C50; "Pagado")

// 10. CONTAR.SI: cantidad de pedidos en estado "Pendiente"
=CONTAR.SI(C2:C50; "Pendiente")

// 11. CONTAR.SI.CONJUNTO: pedidos "Pagado" mayores a 200.000
=CONTAR.SI.CONJUNTO(C2:C50; "Pagado"; D2:D50; ">200000")

// 12. PROMEDIO.SI: ticket promedio solo de la sucursal "Centro"
=PROMEDIO.SI(B2:B50; "Centro"; D2:D50)`,
          codigoEn: `// 6. IF
=IF(D2>=500000, "Cumple", "Bajo meta")

// 7. AND / OR inside IF
=IF(OR(E2="VIP", AND(B2="Norte", D2>=300000)), "Aplica bono", "Sin bono")

// 8. SUMIF
=SUMIF(B2:B50, "Centro", D2:D50)

// 9. SUMIFS
=SUMIFS(D2:D50, B2:B50, "Centro", C2:C50, "Pagado")

// 10. COUNTIF
=COUNTIF(C2:C50, "Pendiente")

// 11. COUNTIFS
=COUNTIFS(C2:C50, "Pagado", D2:D50, ">200000")

// 12. AVERAGEIF
=AVERAGEIF(B2:B50, "Centro", D2:D50)`,
        },
      ],
      captura: {
        id: "formulas-de-excel-mas-usadas-paso-2",
        alt: "Tabla resumen en Excel calculada con SUMAR.SI.CONJUNTO y CONTAR.SI.CONJUNTO por sucursal y estado",
        caption:
          "En SUMAR.SI.CONJUNTO el rango a sumar va siempre como primer argumento, a diferencia de SUMAR.SI.",
        ratio: "16/9",
      },
    },
    {
      id: "formulas-busqueda",
      titulo: "3. Fórmulas de búsqueda y cruce de tablas (ejemplos 13 al 15)",
      esPasoHowTo: true,
      resumenHowTo:
        "Trae datos desde otra tabla usando BUSCARV, su sucesor moderno BUSCARX o el clásico INDICE + COINCIDIR.",
      parrafos: [
        "Cruzar un listado de ventas con un maestro de productos o clientes es la tarea más repetida en Excel. Durante años reinó BUSCARV, aunque exige que la columna buscada esté siempre a la izquierda y falla si alguien inserta una columna intermedia.",
        "Hoy, si utilizas Microsoft 365 o Excel 2021+, la recomendación directa es BUSCARX: busca hacia la izquierda o derecha, exige coincidencia exacta por defecto e incluye un argumento nativo para devolver un mensaje limpio cuando el código no existe. Si debes mantener compatibilidad con versiones antiguas de Excel, INDICE + COINCIDIR sigue siendo la alternativa más robusta.",
      ],
      codigos: [
        {
          titulo: "Ejemplos 13 al 15: BUSCARV, BUSCARX e INDICE + COINCIDIR",
          lenguaje: "excel",
          codigo: `// 13. BUSCARV: busca el SKU de A2 en Maestro!A:C y trae columna 3 (coincidencia exacta FALSO)
=BUSCARV(A2; Maestro!$A$2:$C$200; 3; FALSO)

// 14. BUSCARX: busca hacia cualquier lado con mensaje si no existe
=BUSCARX(A2; Maestro!$A$2:$A$200; Maestro!$C$2:$C$200; "SKU no encontrado")

// 15. INDICE + COINCIDIR: compatible con todas las versiones de Excel
=INDICE(Maestro!$C$2:$C$200; COINCIDIR(A2; Maestro!$A$2:$A$200; 0))`,
          codigoEn: `// 13. VLOOKUP
=VLOOKUP(A2, Maestro!$A$2:$C$200, 3, FALSE)

// 14. XLOOKUP
=XLOOKUP(A2, Maestro!$A$2:$A$200, Maestro!$C$2:$C$200, "SKU no encontrado")

// 15. INDEX + MATCH
=INDEX(Maestro!$C$2:$C$200, MATCH(A2, Maestro!$A$2:$A$200, 0))`,
        },
      ],
      captura: {
        id: "formulas-de-excel-mas-usadas-paso-3",
        alt: "Ejemplo en Excel comparando BUSCARX frente a BUSCARV al traer precios desde una hoja Maestro",
        caption:
          "BUSCARX elimina el conteo manual de columnas y permite definir un texto de respaldo sin anidar SI.ERROR.",
        ratio: "16/9",
      },
    },
    {
      id: "formulas-texto-fechas",
      titulo: "4. Fórmulas de texto y fechas (ejemplos 16 al 23)",
      esPasoHowTo: true,
      resumenHowTo:
        "Normaliza textos con espacios sobrantes, extrae códigos y calcula vencimientos o días hábiles reales.",
      parrafos: [
        "Cuando importas planillas desde un ERP o formulario web, casi siempre llegan nombres con espacios dobles al final, códigos compuestos como «FAC-2026-0045» o fechas de emisión a las que debes sumar días hábiles o llevar al último día del mes.",
        "Combinar ESPACIOS antes de cruzar tablas evita cientos de falsos #N/D provocados por un espacio invisible al final de un código. Por otro lado, TEXTODESPUES (disponible en Excel 365) simplifica enormemente extraer subcadenas después de un guion o arroba sin anidar LARGO ni ENCONTRAR.",
      ],
      codigos: [
        {
          titulo: "Ejemplos 16 al 23: Texto (ESPACIOS, IZQUIERDA, DERECHA, EXTRAE, TEXTODESPUES) y Fechas (HOY, FIN.MES, DIAS.LAB)",
          lenguaje: "excel",
          codigo: `// 16. ESPACIOS: elimina espacios iniciales, finales y dobles entre palabras
=ESPACIOS(A2)

// 17. IZQUIERDA: extrae los primeros 3 caracteres (ej. prefijo "FAC")
=IZQUIERDA(A2; 3)

// 18. DERECHA: extrae los últimos 4 dígitos de un folio
=DERECHA(A2; 4)

// 19. EXTRAE: extrae 4 caracteres desde la posición 5 (ej. el año en "FAC-2026-0045")
=EXTRAE(A2; 5; 4)

// 20. TEXTODESPUES: obtiene todo lo que sigue después del primer "-"
=TEXTODESPUES(A2; "-")

// 21. HOY: fecha actual dinámica del sistema
=HOY()

// 22. FIN.MES: último día del mes siguiente a la fecha en B2
=FIN.MES(B2; 1)

// 23. DIAS.LAB: días hábiles entre fecha inicio B2 y término C2 (excluye feriados en $H$2:$H$15)
=DIAS.LAB(B2; C2; $H$2:$H$15)`,
          codigoEn: `// 16. TRIM
=TRIM(A2)

// 17. LEFT
=LEFT(A2, 3)

// 18. RIGHT
=RIGHT(A2, 4)

// 19. MID
=MID(A2, 5, 4)

// 20. TEXTAFTER
=TEXTAFTER(A2, "-")

// 21. TODAY
=TODAY()

// 22. EOMONTH
=EOMONTH(B2, 1)

// 23. NETWORKDAYS
=NETWORKDAYS(B2, C2, $H$2:$H$15)`,
        },
      ],
      captura: {
        id: "formulas-de-excel-mas-usadas-paso-4",
        alt: "Hoja de Excel aplicando ESPACIOS, TEXTODESPUES, FIN.MES y DIAS.LAB sobre códigos de factura y fechas",
        caption:
          "Usa DIAS.LAB con un rango de feriados locales para medir plazos de entrega o SLA reales.",
        ratio: "16/9",
      },
    },
    {
      id: "matrices-dinamicas",
      titulo: "5. Matrices dinámicas en Excel moderno (ejemplos 24 al 27)",
      esPasoHowTo: true,
      resumenHowTo:
        "Genera listas filtradas, valores únicos, tablas ordenadas y secuencias numéricas con una sola fórmula que se desborda.",
      parrafos: [
        "Las matrices dinámicas cambiaron la forma de construir reportes en Excel 365 y 2021+. En lugar de arrastrar una fórmula por quinientas filas y preocuparte por ajustar rangos cada lunes, escribes una sola expresión en la celda superior izquierda y Excel desborda automáticamente el resultado hacia abajo o hacia la derecha según la cantidad real de filas devueltas.",
        "Con FILTRAR, UNICOS y ORDENAR puedes construir paneles ejecutivos y listados maestros de sucursales, vendedores o clientes que se actualizan solos cuando ingresan nuevos registros en tu tabla origen, sin necesidad de hacer clic en Actualizar Tabla Dinámica ni mantener macros complejas.",
        "Si encadenas estas funciones en una sola celda (por ejemplo, ORDENAR(UNICOS(FILTRAR(...)))), obtienes resúmenes ordenados alfabéticamente o por magnitud sin duplicados, respetando el rango de desbordamiento con el operador # (por ejemplo A2#) cuando otra fórmula necesite referenciar el listado completo generado.",
      ],
      codigos: [
        {
          titulo: "Ejemplos 24 al 27: FILTRAR, UNICOS, ORDENAR y SECUENCIA",
          lenguaje: "excel",
          codigo: `// 24. FILTRAR: extrae filas de A2:D50 donde región B2:B50 es "Sur"
=FILTRAR(A2:D50; B2:B50="Sur"; "Sin registros")

// 25. UNICOS: lista sin duplicados de sucursales en B2:B50
=UNICOS(B2:B50)

// 26. ORDENAR: ordena el rango A2:D50 por la columna 4 (Monto) descendente (-1)
=ORDENAR(A2:D50; 4; -1)

// 27. SECUENCIA: genera correlativo de 12 meses del 1 al 12
=SECUENCIA(12; 1; 1; 1)`,
          codigoEn: `// 24. FILTER
=FILTER(A2:D50, B2:B50="Sur", "Sin registros")

// 25. UNIQUE
=UNIQUE(B2:B50)

// 26. SORT
=SORT(A2:D50, 4, -1)

// 27. SEQUENCE
=SEQUENCE(12, 1, 1, 1)`,
        },
      ],
      captura: {
        id: "formulas-de-excel-mas-usadas-paso-5",
        alt: "Fórmula FILTRAR y UNICOS desbordándose dinámicamente en Excel 365 con borde azul de matriz",
        caption:
          "Las matrices dinámicas se rodean de un borde azul al seleccionarlas y ajustan su tamaño automáticamente.",
        ratio: "16/9",
      },
    },
    {
      id: "formulas-avanzadas-equivalencias",
      titulo: "6. Fórmulas avanzadas (28 al 30) y tabla de equivalencias ES / EN",
      esPasoHowTo: false,
      parrafos: [
        "Para cerrar las 30 fórmulas esenciales, el nivel avanzado se enfoca en legibilidad, reutilización y control de errores en modelos financieros, comerciales y de control de gestión. LET te permite declarar variables con nombre dentro de una fórmula para no repetir el mismo cálculo complejo tres veces, facilitar la auditoría por parte de otro analista y acelerar la evaluación del libro cuando tienes miles de filas.",
        "LAMBDA, por su parte, convierte una expresión compleja en tu propia función personalizada reutilizable en todo el libro (mediante el Administrador de nombres) sin escribir una línea de VBA ni guardar el archivo como libro habilitado para macros (.xlsm). Finalmente, SI.ERROR actúa como red de seguridad controlada para mostrar un texto limpio o un cero cuando una búsqueda o división no encuentra datos, aunque en cruces de tablas conviene preferir SI.ND para no ocultar fallos reales de referencia.",
        "Como buena práctica de trabajo profesional en Chile y Latinoamérica, revisa siempre la configuración regional antes de copiar fórmulas entre equipos: un mismo cálculo usa punto y coma (;) en Windows configurado en español-Chile y coma (,) en interfaces o documentación en inglés, además de nombres traducidos en funciones como BUSCARX (XLOOKUP) o SUMAR.SI.CONJUNTO (SUMIFS).",
      ],
      codigos: [
        {
          titulo: "Ejemplos 28 al 30: LET, LAMBDA y SI.ERROR",
          lenguaje: "excel",
          codigo: `// 28. LET: asigna nombres a cálculos intermedios para evitar repetirlos
=LET(bruto; D2; neto; bruto/1,19; neto*0,15)

// 29. LAMBDA: define función reutilizable (ej. calcular IVA 19%) y pruébala en línea
=LAMBDA(monto; monto*0,19)(D2)

// 30. SI.ERROR: captura errores de división por cero o búsqueda fallida
=SI.ERROR(D2/E2; 0)`,
          codigoEn: `// 28. LET
=LET(bruto, D2, neto, bruto/1.19, neto*0.15)

// 29. LAMBDA
=LAMBDA(monto, monto*0.19)(D2)

// 30. IFERROR
=IFERROR(D2/E2, 0)`,
          nota: "Para guardar LAMBDA como función reutilizable (por ejemplo =CALC_IVA(D2)), pégala sin el parámetro final (D2) en Fórmulas > Administrador de nombres.",
        },
      ],
      tabla: {
        caption: "Tabla rápida de equivalencias de funciones Excel Español / Inglés",
        encabezados: [
          "Nivel",
          "Función en Español (;)",
          "Función en Inglés (,)",
          "Uso principal",
        ],
        filas: [
          ["Básico", "SUMA / PROMEDIO", "SUM / AVERAGE", "Total y media aritmética"],
          ["Básico", "CONTAR / CONTARA", "COUNT / COUNTA", "Contar números vs no vacíos"],
          ["Condicional", "SI / Y / O", "IF / AND / OR", "Reglas lógicas por fila"],
          ["Condicional", "SUMAR.SI.CONJUNTO", "SUMIFS", "Sumar con múltiples criterios"],
          ["Condicional", "CONTAR.SI.CONJUNTO", "COUNTIFS", "Contar con múltiples criterios"],
          ["Búsqueda", "BUSCARV / BUSCARX", "VLOOKUP / XLOOKUP", "Cruzar tablas por clave"],
          ["Búsqueda", "INDICE + COINCIDIR", "INDEX + MATCH", "Búsqueda bidireccional clásica"],
          ["Texto/Fecha", "ESPACIOS / EXTRAE", "TRIM / MID", "Limpieza y extracción de texto"],
          ["Texto/Fecha", "TEXTODESPUES / DIAS.LAB", "TEXTAFTER / NETWORKDAYS", "Delimitadores y días hábiles"],
          ["Dinámicas", "FILTRAR / UNICOS / ORDENAR", "FILTER / UNIQUE / SORT", "Tablas dinámicas por fórmula"],
          ["Avanzado", "LET / LAMBDA / SI.ERROR", "LET / LAMBDA / IFERROR", "Variables, funciones propias y control"],
        ],
      },
    },
  ],
  erroresComunes: [
    {
      error: "Error #¿NOMBRE? al pegar una fórmula de internet",
      causa:
        "Pegaste el nombre de la función en inglés dentro de un Excel configurado en español (o viceversa), o tu versión de Excel es anterior a 365 y no soporta BUSCARX/FILTRAR.",
      solucion:
        "Revisa la tabla de equivalencias ES/EN y verifica si tu licencia de Excel soporta matrices dinámicas.",
    },
    {
      error: "Error #¡DESBORDAMIENTO! (#SPILL!) en FILTRAR, UNICOS o SECUENCIA",
      causa:
        "Hay texto, números o celdas combinadas ocupando el espacio donde la matriz necesita expandirse.",
      solucion:
        "Limpia las celdas debajo o a la derecha de la fórmula hasta que el rango quede despejado, y evita usar matrices dinámicas dentro de Tablas de Excel (Ctrl+T).",
    },
    {
      error: "BUSCARV o BUSCARX devuelve #N/D aunque el código se vea igual",
      causa:
        "Espacios invisibles al final del texto o un código guardado como texto en una hoja y como número en la otra.",
      solucion:
        "Aplica ESPACIOS() para limpiar textos y homogeneiza el formato numérico entre ambas tablas.",
    },
    {
      error: "Excel rechaza la fórmula indicando un problema de sintaxis",
      causa:
        "Usaste coma (,) como separador de argumentos cuando tu configuración regional en Chile exige punto y coma (;).",
      solucion:
        "Reemplaza las comas entre argumentos por punto y coma (;), manteniendo la coma decimal en números como 1,19 si corresponde a tu sistema.",
    },
  ],
  plantilla: {
    titulo: "Libro de práctica con las 30 fórmulas de Excel por nivel",
    descripcion:
      "Próximamente: archivo .xlsx descargable con hojas separadas para Básicas, Condicionales, Búsqueda, Texto/Fechas, Matrices y Avanzadas.",
  },
  faqs: [
    {
      q: "¿Cuáles son las 5 fórmulas de Excel que más piden en entrevistas laborales?",
      a: "En pruebas prácticas para analistas y cargos administrativos suelen aparecer casi siempre: BUSCARX (o BUSCARV), SUMAR.SI.CONJUNTO, CONTAR.SI.CONJUNTO, SI combinado con Y/O, y funciones de limpieza o fecha como ESPACIOS y FIN.MES.",
    },
    {
      q: "¿Por qué en algunos tutoriales usan coma (,) y en mi Excel funciona con punto y coma (;)?",
      a: "Depende de la configuración regional de tu sistema operativo. En Chile y la mayor parte de Latinoamérica/España el separador decimal es la coma, por lo que Excel usa punto y coma (;) para separar argumentos.",
    },
    {
      q: "¿En qué versión de Excel funcionan BUSCARX, FILTRAR, UNICOS y LET?",
      a: "Están disponibles en Excel para Microsoft 365, Excel en la web y Excel 2021 o superior (según la documentación oficial de Microsoft Learn, consultado el 21 de noviembre de 2026). En Excel 2016 o 2019 usa INDICE + COINCIDIR y Tablas Dinámicas.",
    },
    {
      q: "¿Es mejor usar SI.ERROR alrededor de todas mis fórmulas?",
      a: "No conviene abusar de SI.ERROR en todas partes porque puede ocultar errores reales de referencia (#¡REF!). Úsalo de forma puntual en divisiones donde el denominador puede ser cero o en búsquedas donde esperas registros faltantes.",
    },
  ],
  relacionadas: [
    "buscarv-y-buscarx-en-excel",
    "funcion-si-excel-varias-condiciones",
    "tabla-dinamica-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Documentación oficial de Microsoft Learn",
      url: "https://learn.microsoft.com",
      fuente: "Microsoft Learn",
    },
  ],
  enlacesInternosExtra: [
    {
      label: "BUSCARV y BUSCARX en Excel paso a paso",
      href: "/guias/buscarv-y-buscarx-en-excel",
      descripcion: "Profundiza en cruces de tablas, coincidencias aproximadas y búsquedas con múltiples criterios.",
    },
  ],
};

export default guia;
