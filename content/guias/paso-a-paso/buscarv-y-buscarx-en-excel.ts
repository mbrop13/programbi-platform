import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "buscarv-y-buscarx-en-excel",
  title: "BUSCARV y BUSCARX en Excel: diferencias y ejemplos (2026)",
  meta: "Aprende BUSCARV y BUSCARX con ejemplos: búsqueda exacta y aproximada, con dos condiciones, errores #N/A y cuándo conviene usar INDICE y COINCIDIR.",
  h1: "BUSCARV y BUSCARX en Excel: cómo usarlas con ejemplos",
  subtitle:
    "Domina las tres formas principales de cruzar tablas en Excel: BUSCARV (VLOOKUP), BUSCARX (XLOOKUP) e INDICE + COINCIDIR (INDEX/MATCH). Incluye dataset de prueba, búsqueda exacta, búsqueda aproximada por tramos, dos condiciones simultáneas y equivalencias ES/EN.",
  keywordPrincipal: "buscarv",
  keywords: [
    "buscarv",
    "BUSCARX",
    "BUSCARX o BUSCARV",
    "BUSCARV con 2 condiciones",
    "BUSCARX en inglés",
    "INDICE y COINCIDIR",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Cruzar datos entre tablas en Excel sin errores de referencia ni falsos positivos, sabiendo elegir entre BUSCARV, BUSCARX e INDICE/COINCIDIR según la versión de Excel de tu equipo.",
    herramienta: "Microsoft Excel (365, 2021, 2019 y compatibilidad previa)",
    tiempo: "25 minutos",
    bullets: [
      "Aplicar BUSCARV con coincidencia exacta (FALSO / 0) evitando el clásico error al insertar columnas.",
      "Reemplazar cruces frágiles por BUSCARX buscando hacia la izquierda y controlando errores sin SI.ERROR.",
      "Resolver búsquedas con 2 condiciones simultáneas y búsquedas aproximadas por tramos de descuento.",
      "Mantener compatibilidad con Excel 2016/2019 usando INDICE + COINCIDIR y conocer sus nombres en inglés.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Dataset base",
      resumen: "Arma el catálogo de productos y la hoja de pedidos.",
      anchorId: "dataset-ejemplo",
      icono: "table",
    },
    {
      numero: 2,
      titulo: "BUSCARV paso a paso",
      resumen: "Sintaxis clásica, anclaje con $ y argumento FALSO.",
      anchorId: "buscarv-paso-a-paso",
      icono: "code",
    },
    {
      numero: 3,
      titulo: "BUSCARX paso a paso",
      resumen: "Búsqueda bidireccional con mensaje integrado si no existe.",
      anchorId: "buscarx-paso-a-paso",
      icono: "sparkles",
    },
    {
      numero: 4,
      titulo: "Tabla comparativa",
      resumen: "Compara BUSCARV, BUSCARX e INDICE/COINCIDIR.",
      anchorId: "diferencias-comparativa",
      icono: "layers",
    },
    {
      numero: 5,
      titulo: "2 condiciones y tramos",
      resumen: "Cruces multicriterio y escalas de descuento aproximadas.",
      anchorId: "busqueda-dos-condiciones",
      icono: "settings",
    },
    {
      numero: 6,
      titulo: "Compatibilidad y errores",
      resumen: "INDICE/COINCIDIR, #N/A, #REF! y nombres en inglés.",
      anchorId: "indice-coincidir-compatibilidad",
      icono: "check",
    },
  ],
  requisitos: {
    version: "Microsoft Excel 365 o Excel 2021+ para BUSCARX; Excel 2016+ para BUSCARV e INDICE/COINCIDIR",
    lista: [
      "Libro de Excel en español (separador de argumentos punto y coma ;) o en inglés (separador coma ,).",
      "Para usar BUSCARX nativa: Excel para Microsoft 365, Excel 2021, Excel 2024 o Excel Web.",
      "Si compartes archivos con colegas que usan Excel 2016 o 2019 sin suscripción 365, utiliza INDICE + COINCIDIR o BUSCARV.",
    ],
    compatibilidadMacWeb:
      "Tanto BUSCARV, BUSCARX como INDICE + COINCIDIR funcionan de forma idéntica en Excel para Windows, Excel para Mac y Excel en la web (cuando el archivo está en Microsoft 365 / OneDrive). Recuerda que la función BUSCARX no existe en versiones perpetuas antiguas como Excel 2016 o 2019.",
  },
  herramientasHowTo: ["Microsoft Excel"],
  insumosHowTo: ["Tabla Catálogo (SKU, Producto, Precio)", "Tabla Pedidos y Tramos"],
  secciones: [
    {
      id: "dataset-ejemplo",
      titulo: "1. Dataset de ejemplo incluido",
      esPasoHowTo: true,
      resumenHowTo:
        "Prepara dos tablas pequeñas en tu libro de práctica: Catalogo en A1:D6 y Pedidos en F1:H6, para probar cada fórmula con resultados verificables.",
      parrafos: [
        "La mejor forma de no confundir argumentos es practicar sobre un ejemplo concreto con pocas filas. En una hoja llamada Practica, crea la tabla de catálogo en las columnas A a D (filas 1 a 6) y una tabla de pedidos en las columnas F a H.",
        "Observa que en el catálogo pusimos el SKU en la columna B y la Categoría en la columna A a propósito: así comprobarás rápidamente por qué BUSCARV no puede devolver la Categoría a la izquierda del SKU sin reordenar columnas, mientras BUSCARX e INDICE/COINCIDIR lo resuelven sin mover nada.",
      ],
      tabla: {
        caption: "Tabla Catalogo (rango A1:D6) para los ejercicios",
        encabezados: ["Col A: Categoria", "Col B: SKU", "Col C: Producto", "Col D: PrecioCLP"],
        filas: [
          ["Periféricos", "SKU-101", "Mouse Inalámbrico", "18990"],
          ["Periféricos", "SKU-102", "Teclado Mecánico", "54990"],
          ["Audio", "SKU-201", "Audífonos USB-C", "39990"],
          ["Monitores", "SKU-301", "Monitor 24 Pulgadas", "149990"],
          ["Cables", "SKU-401", "Adaptador HDMI", "12990"],
        ],
      },
      captura: {
        id: "buscarv-y-buscarx-en-excel-paso-1",
        alt: "Hoja de Excel con la tabla Catalogo en A1:D6 y la tabla Pedidos lista para cruzar por SKU",
        caption:
          "Colocar Categoria a la izquierda del SKU permite demostrar la diferencia práctica entre BUSCARV y BUSCARX.",
        ratio: "16/9",
      },
    },
    {
      id: "buscarv-paso-a-paso",
      titulo: "2. BUSCARV paso a paso",
      esPasoHowTo: true,
      resumenHowTo:
        "Escribe BUSCARV indicando valor buscado, matriz desde la columna clave hacia la derecha, número de columna a devolver y FALSO para coincidencia exacta.",
      parrafos: [
        "BUSCARV (búsqueda vertical) busca un código en la primera columna de una matriz y devuelve un valor de otra columna situada a su derecha. Su sintaxis tiene cuatro argumentos: =BUSCARV(valor_buscado; matriz_tabla; indicador_columnas; [rango]).",
        "En nuestra tabla Pedidos, supongamos que tienes el código buscado en la celda F2 (por ejemplo, SKU-201) y quieres traer el PrecioCLP hacia G2. Como SKU está en la columna B, tu matriz debe empezar obligatoriamente en B (B2:D6), nunca en A2:D6. Dentro de B2:D6, la columna B es la 1, C es la 2 y D (PrecioCLP) es la 3. Además, fija la matriz con signos peso ($B$2:$D$6) para que no se desplace al arrastrar hacia abajo y cierra siempre con FALSO (o 0) para exigir coincidencia exacta.",
      ],
      codigos: [
        {
          titulo: "Traer PrecioCLP desde el catálogo con BUSCARV",
          lenguaje: "excel",
          codigo: `=BUSCARV(F2;$B$2:$D$6;3;FALSO)`,
          codigoEn: `=VLOOKUP(F2,$B$2:$D$6,3,FALSE)`,
          nota: "El tercer argumento (3) cuenta columnas desde B (1=B, 2=C, 3=D). Si insertas una columna entre B y D, el número 3 quedará apuntando a la columna equivocada.",
        },
      ],
      captura: {
        id: "buscarv-y-buscarx-en-excel-paso-2",
        alt: "Fórmula BUSCARV en Excel devolviendo 39990 para el código SKU-201 con referencia absoluta $B$2:$D$6",
        caption:
          "Usa siempre FALSO (o 0) como cuarto argumento cuando busques códigos, SKU o RUT para evitar coincidencias aproximadas erróneas.",
        ratio: "16/9",
      },
    },
    {
      id: "buscarx-paso-a-paso",
      titulo: "3. BUSCARX paso a paso",
      esPasoHowTo: true,
      resumenHowTo:
        "Implementa BUSCARX separando la columna donde buscas de la columna que devuelves, permitiendo buscar hacia la izquierda y controlar valores no encontrados.",
      parrafos: [
        "BUSCARX nació en Excel moderno para corregir todos los puntos débiles de BUSCARV. En lugar de pasar una gran matriz y contar columnas a mano con un número fijo, entregas dos rangos separados: primero la columna donde está el código (matriz_buscada) y segundo la columna de donde quieres traer el dato (matriz_devuelta).",
        "Esa separación trae tres ventajas inmediatas: puedes traer la Categoria (columna A) aunque esté a la izquierda del SKU (columna B); si alguien inserta columnas nuevas en medio del catálogo, la fórmula se actualiza sola sin romperse; y el cuarto argumento te permite escribir el texto que quieras mostrar cuando no exista el código (por ejemplo, \"No existe\"), sin envolver todo en SI.ERROR. Además, en BUSCARX la coincidencia exacta (0) ya viene activada por defecto.",
      ],
      codigos: [
        {
          titulo: "Traer Categoria (hacia la izquierda) y PrecioCLP con BUSCARX",
          lenguaje: "excel",
          codigo: `=BUSCARX(F2;$B$2:$B$6;$A$2:$A$6;"SKU no encontrado")
=BUSCARX(F2;$B$2:$B$6;$D$2:$D$6;0)`,
          codigoEn: `=XLOOKUP(F2,$B$2:$B$6,$A$2:$A$6,"SKU no encontrado")
=XLOOKUP(F2,$B$2:$B$6,$D$2:$D$6,0)`,
          nota: "Si F2 no existe en el catálogo, la primera fórmula devuelve 'SKU no encontrado' y la segunda devuelve 0.",
        },
      ],
      captura: {
        id: "buscarv-y-buscarx-en-excel-paso-3",
        alt: "Fórmula BUSCARX en Excel trayendo la Categoría desde la columna A ubicada a la izquierda del SKU",
        caption:
          "BUSCARX separa el rango de búsqueda del rango de resultado, permitiendo traer columnas hacia la izquierda sin reordenar la tabla.",
        ratio: "16/9",
      },
    },
    {
      id: "diferencias-comparativa",
      titulo: "4. Diferencias entre BUSCARV, BUSCARX e INDICE/COINCIDIR",
      parrafos: [
        "Si trabajas en una empresa donde conviven equipos con Microsoft 365 y otros con Excel 2019 o 2016, saber cuándo usar cada función evita planillas rotas al compartir archivos por correo.",
      ],
      tabla: {
        caption: "Comparativa técnica entre BUSCARV, BUSCARX e INDICE + COINCIDIR",
        encabezados: [
          "Criterio",
          "BUSCARV (VLOOKUP)",
          "BUSCARX (XLOOKUP)",
          "INDICE + COINCIDIR",
        ],
        filas: [
          [
            "¿Busca hacia la izquierda?",
            "No (solo hacia la derecha)",
            "Sí (cualquier dirección)",
            "Sí (cualquier dirección)",
          ],
          [
            "Modo por defecto",
            "Aproximado (VERDADERO) — peligroso si olvidas FALSO",
            "Exacto (0) — seguro por defecto",
            "Exacto si pones 0 en COINCIDIR",
          ],
          [
            "Resistencia al insertar columnas",
            "Frágil (depende del número de columna)",
            "Robusta (rangos independientes)",
            "Robusta (rangos independientes)",
          ],
          [
            "Manejo de no encontrado integrado",
            "No (requiere SI.ERROR / SI.ND)",
            "Sí (4.º argumento [si_no_se_encuentra])",
            "No (requiere SI.ERROR / SI.ND)",
          ],
          [
            "Compatibilidad con Excel 2016/2019",
            "Total (todas las versiones)",
            "No (requiere Excel 2021 o 365)",
            "Total (todas las versiones)",
          ],
        ],
      },
    },
    {
      id: "busqueda-dos-condiciones",
      titulo: "5. Búsqueda con 2 condiciones simultáneas",
      esPasoHowTo: true,
      resumenHowTo:
        "Combina dos columnas criterio usando concatenación (&) dentro de BUSCARX o mediante una columna auxiliar limpia cuando uses BUSCARV.",
      parrafos: [
        "Un caso muy común en Chile es buscar un precio o tarifa que depende de dos columnas a la vez, por ejemplo Sucursal y SKU, o Mes y Cargo. Con BUSCARV tradicional no puedes pasar dos rangos separados sin crear una columna auxiliar concatenada en la tabla origen (por ejemplo, =A2&\"|\"&B2).",
        "Con BUSCARX en Excel 365 o 2021 puedes concatenar directamente en memoria los dos valores buscados y los dos rangos de búsqueda usando un separador como \"|\" para evitar falsas uniones (por ejemplo, que \"1\" y \"23\" se confundan con \"12\" y \"3\").",
      ],
      codigos: [
        {
          titulo: "Búsqueda con 2 condiciones en BUSCARX (sin columna auxiliar)",
          lenguaje: "excel",
          codigo: `=BUSCARX(F2&"|"&G2;$A$2:$A$6&"|"&$B$2:$B$6;$D$2:$D$6;"Sin tarifa";0)`,
          codigoEn: `=XLOOKUP(F2&"|"&G2,$A$2:$A$6&"|"&$B$2:$B$6,$D$2:$D$6,"Sin tarifa",0)`,
          nota: "El separador '|' garantiza que la combinación Categoria + SKU sea única y sin ambigüedades.",
        },
        {
          titulo: "Alternativa compatible con cualquier Excel (con columna auxiliar en A)",
          lenguaje: "excel",
          codigo: `=BUSCARV(F2&"|"&G2;$A$2:$E$6;5;FALSO)`,
          codigoEn: `=VLOOKUP(F2&"|"&G2,$A$2:$E$6,5,FALSE)`,
          nota: "Requiere tener previamente en la columna A de la tabla origen la fórmula concatenada =B2&\"|\"&C2.",
        },
      ],
    },
    {
      id: "busqueda-aproximada-tramos",
      titulo: "6. Búsqueda aproximada por tramos (descuentos o comisiones)",
      parrafos: [
        "No todas las búsquedas son exactas. Cuando calculas una escala de comisiones por venta o un tramo de descuento por volumen de unidades (por ejemplo: desde 1 unidad 0 %, desde 10 unidades 5 %, desde 50 unidades 12 %), el monto exacto de un pedido rara vez coincide con el límite inferior de la tabla.",
        "En BUSCARV debes ordenar la tabla de tramos de menor a mayor y usar VERDADERO (o 1) como cuarto argumento. En BUSCARX, el quinto argumento modo_coincidencia acepta -1 (coincidencia exacta o el siguiente elemento menor), que funciona incluso si la tabla de tramos no estuviera ordenada, aunque ordenarla de menor a mayor sigue siendo buena práctica visual.",
      ],
      codigos: [
        {
          titulo: "Búsqueda por tramos con BUSCARX (-1) y con BUSCARV (VERDADERO)",
          lenguaje: "excel",
          codigo: `=BUSCARX(H2;$J$2:$J$4;$K$2:$K$4;0;-1)
=BUSCARV(H2;$J$2:$K$4;2;VERDADERO)`,
          codigoEn: `=XLOOKUP(H2,$J$2:$J$4,$K$2:$K$4,0,-1)
=VLOOKUP(H2,$J$2:$K$4,2,TRUE)`,
          nota: "Asume que J2:J4 contiene los límites mínimos ordenados (1, 10, 50) y K2:K4 los porcentajes de descuento (0%, 5%, 12%).",
        },
      ],
    },
    {
      id: "indice-coincidir-compatibilidad",
      titulo: "7. INDICE y COINCIDIR para máxima compatibilidad",
      parrafos: [
        "Si tu archivo será abierto por clientes externos o colegas que aún utilizan Excel 2016 o Excel 2019 sin Microsoft 365, BUSCARX mostrará el error #¿NOMBRE?. En esos casos, la pareja INDICE + COINCIDIR ofrece casi todas las ventajas estructurales de BUSCARX (buscar hacia la izquierda y resistir inserción de columnas) con 100 % de compatibilidad histórica.",
        "La lógica funciona en dos pasos: COINCIDIR busca el código en la columna clave y devuelve su posición numérica (fila 1, 2, 3...); luego INDICE toma esa posición y extrae la celda correspondiente de la columna de resultado.",
      ],
      codigos: [
        {
          titulo: "Traer Categoria (izquierda del SKU) con INDICE y COINCIDIR + control de error",
          lenguaje: "excel",
          codigo: `=SI.ND(INDICE($A$2:$A$6;COINCIDIR(F2;$B$2:$B$6;0));"SKU no encontrado")`,
          codigoEn: `=IFNA(INDEX($A$2:$A$6,MATCH(F2,$B$2:$B$6,0)),"SKU no encontrado")`,
          nota: "SI.ND captura únicamente #N/A sin ocultar otros errores de fórmula como #REF! o #¡VALOR!.",
        },
      ],
      captura: {
        id: "buscarv-y-buscarx-en-excel-paso-4",
        alt: "Fórmula INDICE y COINCIDIR envuelta en SI.ND devolviendo la categoría del SKU en Excel",
        caption:
          "Usa SI.ND en lugar de SI.ERROR alrededor de INDICE/COINCIDIR para atrapar solo códigos inexistentes.",
        ratio: "16/9",
      },
    },
    {
      id: "errores-y-equivalencias-ingles",
      titulo: "8. Errores #N/A, #REF! y equivalencias en inglés",
      parrafos: [
        "Cuando una búsqueda falla, el código de error que muestra Excel te da la pista exacta de qué revisar. Un error #N/A indica que la fórmula está bien escrita pero no encontró coincidencia; un error #REF! en BUSCARV suele significar que pediste el indicador de columna 5 en una matriz que solo tiene 3 columnas (o que eliminaste la columna origen).",
        "Además, si trabajas con colegas en casa matriz o cursos en inglés, ten presente la tabla de equivalencias exactas y recuerda cambiar punto y coma (;) por coma (,).",
      ],
      tabla: {
        caption: "Equivalencias exactas de funciones de búsqueda en español e inglés",
        encabezados: [
          "Función en español",
          "Función en inglés",
          "Separador habitual (Chile vs EN)",
          "Uso principal",
        ],
        filas: [
          ["BUSCARV", "VLOOKUP", "; vs ,", "Búsqueda vertical clásica hacia la derecha"],
          ["BUSCARX", "XLOOKUP", "; vs ,", "Búsqueda moderna bidireccional en 365/2021+"],
          ["INDICE", "INDEX", "; vs ,", "Extraer celda por número de fila/columna"],
          ["COINCIDIR", "MATCH", "; vs ,", "Obtener posición numérica de un valor"],
          ["SI.ND", "IFNA", "; vs ,", "Manejar únicamente errores #N/A"],
        ],
      },
    },
  ],
  erroresComunes: [
    {
      error: "Devuelve #N/A aunque veo el código exactamente igual en ambas tablas",
      causa:
        "Uno de los dos lados tiene espacios ocultos al final ('SKU-101 ') o uno está guardado como número y el otro como texto ('101' vs 101).",
      solucion:
        "Limpia espacios con ESPACIOS() o normaliza el formato de texto/número en ambas columnas antes de cruzar.",
    },
    {
      error: "BUSCARV devuelve #REF! al arrastrar o después de editar la hoja",
      causa:
        "El indicador de columnas es mayor que el ancho de la matriz seleccionada, o alguien eliminó una columna dentro del rango.",
      solucion:
        "Verifica el ancho de la matriz o migra a BUSCARX / INDICE+COINCIDIR para no depender de un número fijo de columna.",
    },
    {
      error: "BUSCARV devuelve el precio de otro producto parecido",
      causa:
        "Se omitió el cuarto argumento o se dejó en VERDADERO, activando búsqueda aproximada sobre una lista sin ordenar.",
      solucion:
        "Agrega siempre ;FALSO o ;0 al final de BUSCARV cuando busques códigos exactos.",
    },
    {
      error: "BUSCARX muestra #¿NOMBRE? en el computador de un colega",
      causa:
        "El colega abrió el archivo en Excel 2016 o Excel 2019 perpetuo, versiones que no incluyen BUSCARX.",
      solucion:
        "Reemplaza BUSCARX por INDICE + COINCIDIR si el libro debe ser compatible con versiones anteriores a Excel 2021.",
    },
  ],
  plantilla: {
    titulo: "Libro de práctica BUSCARV, BUSCARX e INDICE/COINCIDIR",
    descripcion:
      "Próximamente podrás descargar aquí el archivo .xlsx con la tabla Catalogo, Pedidos, búsqueda con 2 condiciones y tabla de tramos lista para practicar.",
  },
  faqs: [
    {
      q: "¿Debo dejar de usar BUSCARV y pasarme a BUSCARX?",
      a: "Si todo tu equipo usa Excel 365 o Excel 2021+, sí: BUSCARX es más segura, busca hacia la izquierda, no se rompe al insertar columnas y maneja #N/A de forma nativa. Si compartes archivos con usuarios en Excel 2016/2019, usa INDICE + COINCIDIR o BUSCARV.",
    },
    {
      q: "¿Cómo busco hacia la izquierda sin usar BUSCARX?",
      a: "Usa =INDICE(columna_resultado; COINCIDIR(valor_buscado; columna_clave; 0)). No importa si la columna resultado está a la izquierda o a la derecha de la columna clave.",
    },
    {
      q: "¿Qué diferencia hay entre SI.ERROR y SI.ND en búsquedas?",
      a: "SI.ERROR oculta cualquier tipo de fallo (incluidos errores de referencia #REF! o de sintaxis #¡VALOR!), mientras que SI.ND captura únicamente el error #N/A cuando el código buscado no existe.",
    },
    {
      q: "¿Puedo usar BUSCARX para devolver varias columnas a la vez?",
      a: "Sí. En Excel 365, si el tercer argumento matriz_devuelta abarca varias columnas contiguas (por ejemplo, $C$2:$D$6), BUSCARX desbordará automáticamente Producto y PrecioCLP en dos celdas adyacentes.",
    },
  ],
  relacionadas: [
    "formulas-de-excel-mas-usadas",
    "liquidacion-de-sueldo-en-excel-chile",
    "funcion-si-excel-varias-condiciones",
  ],
  enlacesExternos: [
    {
      label: "Función BUSCARX (XLOOKUP) en Microsoft",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.worksheetfunction.xlookup",
      fuente: "Microsoft Learn",
    },
    {
      label: "Función BUSCARV (VLOOKUP) en Microsoft",
      url: "https://learn.microsoft.com/es-es/office/vba/api/excel.worksheetfunction.vlookup",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
