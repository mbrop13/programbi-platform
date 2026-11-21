import type { GuiaPasoAPaso } from "@/lib/guias/paso-a-paso-tipos";

export const guia: GuiaPasoAPaso = {
  slug: "funcion-si-excel-varias-condiciones",
  title: "Función SI en Excel con varias condiciones (ejemplos)",
  meta: "Domina la función SI en Excel: con dos o tres condiciones, SI anidada, SI.CONJUNTO, combinada con Y y O, y errores típicos. Ejemplos listos para copiar.",
  h1: "Función SI en Excel: de una a varias condiciones",
  subtitle:
    "Aprende a evaluar reglas de negocio en tus planillas sin enredarte en paréntesis: desde una prueba lógica simple hasta combinaciones con Y, O, SI anidada, SI.CONJUNTO y el salto a BUSCARX para tramos numéricos.",
  keywordPrincipal: "función si excel",
  keywords: [
    "función si excel",
    "función SI con 2 o 3 condiciones",
    "SI anidada Excel",
    "SI.CONJUNTO Excel",
    "SI con Y O Excel",
  ],
  curso: "excel",
  herramienta: "Excel",
  nivel: "Básico",
  updated: "2026-11-21",
  published: "2026-11-21",
  totalTimeIso: "PT25M",
  en30Segundos: {
    queLogras:
      "Construir fórmulas condicionales limpias y sin errores en Excel para clasificar ventas, calcular bonos por tramos, validar requisitos simultáneos y elegir entre SI anidada, SI.CONJUNTO o BUSCARX según el caso.",
    herramienta: "Microsoft Excel",
    tiempo: "25 minutos",
    bullets: [
      "Escribir la función SI básica con separador de punto y coma (;) en español y coma (,) en inglés.",
      "Evaluar dos o más criterios simultáneos u opcionales combinando SI con Y (AND) y O (OR).",
      "Encadenar niveles jerárquicos con SI anidada o simplificarlos con SI.CONJUNTO (IFS) en Excel 2019 y 365.",
      "Reemplazar escalas largas de descuentos o comisiones por BUSCARX en modo aproximado.",
    ],
  },
  rutaVisual: [
    {
      numero: 1,
      titulo: "Sintaxis de SI",
      resumen: "Prueba lógica, valor verdadero y falso.",
      anchorId: "sintaxis-basica-si",
      icono: "code",
    },
    {
      numero: 2,
      titulo: "SI con Y y O",
      resumen: "Evalúa múltiples requisitos a la vez.",
      anchorId: "si-con-y-y-o",
      icono: "layers",
    },
    {
      numero: 3,
      titulo: "SI anidada",
      resumen: "Cuando el orden de evaluación manda.",
      anchorId: "si-anidada-jerarquia",
      icono: "settings",
    },
    {
      numero: 4,
      titulo: "SI.CONJUNTO",
      resumen: "Múltiples condiciones sin paréntesis anidados.",
      anchorId: "si-conjunto-ifs",
      icono: "check",
    },
    {
      numero: 5,
      titulo: "Tramos con BUSCARX",
      resumen: "Cuándo dejar SI y usar búsqueda por rango.",
      anchorId: "reemplazar-si-con-buscarx",
      icono: "table",
    },
  ],
  requisitos: {
    version: "Microsoft Excel 2019, 2021, 2024 o Microsoft 365 (para SI.CONJUNTO y BUSCARX)",
    lista: [
      "Excel en español o inglés instalado en Windows, Mac o versión web.",
      "Conocimiento básico de referencias de celdas (por ejemplo, B2, $E$2) y operadores de comparación (=, >, <, >=, <=, <>).",
      "Una tabla de ejemplo con ventas, metas o puntajes para probar las fórmulas directamente.",
    ],
    compatibilidadMacWeb:
      "La función SI, Y, O y SI anidada funcionan en todas las versiones de Excel (Windows, Mac y Excel para la Web). SI.CONJUNTO requiere Excel 2019 o superior; BUSCARX requiere Excel 2021, 365 o Excel en la Web.",
  },
  secciones: [
    {
      id: "sintaxis-basica-si",
      titulo: "Sintaxis básica de la función SI en Excel",
      esPasoHowTo: true,
      resumenHowTo:
        "Escribe =SI(prueba_logica; valor_si_verdadero; valor_si_falso) usando comillas para textos y sin comillas para números o cálculos.",
      parrafos: [
        "La función SI toma una decisión binaria: evalúa una afirmación que solo puede resultar VERDADERO o FALSO y devuelve un resultado distinto para cada camino. Es la piedra angular de cualquier modelo en Excel porque permite que la planilla reaccione ante cambios de datos sin intervención manual.",
        "Su estructura tiene tres argumentos obligatorios en la práctica: la prueba lógica (por ejemplo, B2>=100000), el valor si la prueba se cumple y el valor si no se cumple. En configuraciones regionales de Chile y Latinoamérica, los argumentos se separan con punto y coma (;), mientras que en inglés se utiliza coma (,).",
        "Un detalle clave al empezar es distinguir entre texto y número. Cualquier palabra o etiqueta que quieras mostrar como resultado debe ir entre comillas dobles (\"Aprobado\"), mientras que los números (0, 50000) o fórmulas internas (B2*0,1) se escriben sin comillas. Si omites el tercer argumento, Excel devolverá la palabra FALSO cuando no se cumpla la condición, lo que suele verse poco prolijo en reportes.",
      ],
      lista: [
        "prueba_logica: comparación usando =, >, <, >=, <= o <> (distinto de).",
        "valor_si_verdadero: número, texto entre comillas, celda o fórmula a ejecutar si se cumple.",
        "valor_si_falso: resultado alternativo cuando la prueba lógica da FALSO.",
      ],
      codigos: [
        {
          titulo: "Evaluar si una venta en B2 alcanza la meta de $500.000",
          lenguaje: "excel",
          codigo: '=SI(B2>=500000; "Meta cumplida"; "Bajo meta")',
          codigoEn: '=IF(B2>=500000, "Meta cumplida", "Bajo meta")',
          nota: "En Chile el separador decimal es la coma y el separador de argumentos es el punto y coma (;).",
        },
        {
          titulo: "Calcular un bono del 5% solo cuando se supera la meta",
          lenguaje: "excel",
          codigo: "=SI(B2>500000; B2*0,05; 0)",
          codigoEn: "=IF(B2>500000, B2*0.05, 0)",
          nota: "El resultado numérico 0 y la multiplicación van sin comillas para poder sumarlos después.",
        },
      ],
      captura: {
        id: "funcion-si-excel-varias-condiciones-paso-1",
        alt: "Hoja de Excel mostrando una tabla de vendedores con la fórmula SI básica evaluando si la venta supera la meta.",
        caption: "Estructura de SI básica devolviendo texto o cálculo numérico según la prueba lógica.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "tip",
        titulo: "Evita escribir los umbrales fijos dentro de la fórmula",
        texto:
          "En lugar de escribir 500000 dentro de cada fila, colócalo en una celda de parámetro (por ejemplo, $E$1) y referencia esa celda en la prueba lógica: =SI(B2>=$E$1; ...). Así actualizas la meta en un solo lugar.",
      },
    },
    {
      id: "si-con-y-y-o",
      titulo: "SI combinada con Y y O para evaluar 2 o 3 condiciones",
      esPasoHowTo: true,
      resumenHowTo:
        "Inserta Y(...) o O(...) dentro del primer argumento de SI cuando necesites validar varias reglas a la vez.",
      parrafos: [
        "Cuando una regla de negocio exige verificar dos o tres criterios al mismo tiempo, no necesitas anidar múltiples SI de inmediato. Excel ofrece las funciones lógicas Y (AND) y O (OR), que se insertan directamente dentro del primer argumento (prueba_logica) de la función SI.",
        "La función Y devuelve VERDADERO únicamente cuando todas las condiciones internas se cumplen sin excepción. Es ideal para requisitos estrictos: por ejemplo, otorgar un bono solo si el vendedor superó los $800.000 en ventas, tuvo menos de 2 devoluciones y pertenece a la sucursal Santiago.",
        "Por su parte, la función O devuelve VERDADERO si al menos una de las condiciones se cumple. Resulta muy útil para alertas de riesgo o excepciones comerciales: por ejemplo, marcar un pedido para revisión si el monto excede $2.000.000 o si el cliente presenta mora vencida. Incluso puedes combinar Y y O dentro de la misma prueba lógica cuando la regla mezcla requisitos obligatorios con alternativas.",
      ],
      codigos: [
        {
          titulo: "SI + Y: exige cumplir las tres condiciones simultáneamente",
          lenguaje: "excel",
          codigo: '=SI(Y(B2>=800000; C2<2; D2="Santiago"); "Bono aprobado"; "No aplica")',
          codigoEn: '=IF(AND(B2>=800000, C2<2, D2="Santiago"), "Bono aprobado", "No aplica")',
          nota: "Si falla una sola de las tres comparaciones, Y devuelve FALSO y Excel muestra No aplica.",
        },
        {
          titulo: "SI + O: basta con que se cumpla una de las condiciones",
          lenguaje: "excel",
          codigo: '=SI(O(B2>2000000; E2="Con mora"); "Revisar crédito"; "Despacho normal")',
          codigoEn: '=IF(OR(B2>2000000, E2="Con mora"), "Revisar crédito", "Despacho normal")',
        },
        {
          titulo: "Combinación mixta: cliente VIP o compra alta con pago al día",
          lenguaje: "excel",
          codigo: '=SI(Y(E2="Al día"; O(A2="VIP"; B2>=1500000)); "Despacho prioritario"; "Estándar")',
          codigoEn: '=IF(AND(E2="Al día", OR(A2="VIP", B2>=1500000)), "Despacho prioritario", "Estándar")',
          nota: "Primero exige que E2 sea Al día, y además que sea VIP o tenga una compra igual o mayor a 1.500.000.",
        },
      ],
      captura: {
        id: "funcion-si-excel-varias-condiciones-paso-2",
        alt: "Tabla en Excel con columnas de Venta, Devoluciones y Sucursal evaluadas mediante SI combinada con Y y O.",
        caption: "Combinación de SI con Y y O para validar reglas compuestas sin anidar múltiples funciones SI.",
        ratio: "16/9",
      },
    },
    {
      id: "si-anidada-jerarquia",
      titulo: "SI anidada: cuándo usarla y cómo respetar la jerarquía",
      esPasoHowTo: true,
      resumenHowTo:
        "Coloca otra función SI dentro del argumento valor_si_falso cuando necesites más de dos resultados posibles en orden jerárquico.",
      parrafos: [
        "Las funciones Y y O resuelven múltiples condiciones, pero siempre entregan solo dos salidas posibles (verdadero o falso). Cuando necesitas clasificar un dato en tres, cuatro o cinco categorías distintas —como niveles de desempeño, estados de factura o tramos de comisión—, entra en juego la función SI anidada.",
        "Anidar consiste en escribir una nueva función SI dentro del argumento valor_si_falso de la función SI anterior. Excel evalúa las pruebas de izquierda a derecha y se detiene en la primera que resulte verdadera. Por esa razón, el orden en que escribes las condiciones define completamente la lógica del resultado.",
        "Si ordenas mal los umbrales numéricos, la fórmula arrojará resultados erróneos sin mostrar ningún código de error. Por ejemplo, al clasificar notas o porcentajes de cumplimiento, debes avanzar estrictamente de mayor a menor (o de menor a mayor, según el operador), asegurándote de no atrapar casos altos en una condición demasiado amplia al comienzo.",
      ],
      listaOrdenada: [
        "Define primero el límite más estricto o el valor más alto (por ejemplo, >=100%).",
        "En el valor_si_falso abre el siguiente SI para el tramo inmediatamente inferior (>=80%).",
        "Repite hasta el penúltimo nivel y deja la última categoría directamente como valor_si_falso final.",
        "Verifica que la cantidad de paréntesis de cierre al final coincida con la cantidad de funciones SI abiertas.",
      ],
      codigos: [
        {
          titulo: "Clasificación en 4 tramos de cumplimiento (orden descendente obligatorio)",
          lenguaje: "excel",
          codigo: '=SI(B2>=1; "Sobresaliente"; SI(B2>=0,85; "Cumplido"; SI(B2>=0,6; "En desarrollo"; "Crítico")))',
          codigoEn: '=IF(B2>=1, "Sobresaliente", IF(B2>=0.85, "Cumplido", IF(B2>=0.6, "En desarrollo", "Crítico")))',
          nota: "Si pusieras B2>=0,6 al inicio, un 110% caería en En desarrollo porque 1,10 también es >= 0,6.",
        },
      ],
      captura: {
        id: "funcion-si-excel-varias-condiciones-paso-3",
        alt: "Barra de fórmulas de Excel mostrando una función SI anidada con colores de paréntesis diferenciados para cuatro niveles.",
        caption: "SI anidada evaluando porcentajes de cumplimiento en orden estrictamente descendente.",
        ratio: "16/9",
      },
      alerta: {
        tipo: "warning",
        titulo: "No superes 3 o 4 niveles de anidación",
        texto:
          "Aunque Excel moderno soporta hasta 64 funciones SI anidadas, mantener más de cuatro niveles vuelve la fórmula casi imposible de auditar para tus colegas. Si superas ese límite, pasa a SI.CONJUNTO o a una tabla de búsqueda.",
      },
    },
    {
      id: "si-conjunto-ifs",
      titulo: "SI.CONJUNTO (IFS) para escribir múltiples condiciones limpias",
      esPasoHowTo: true,
      resumenHowTo:
        "Usa =SI.CONJUNTO(cond1; res1; cond2; res2; VERDADERO; res_defecto) para eliminar los paréntesis encadenados.",
      parrafos: [
        "Introducida en Excel 2019 y disponible en Microsoft 365 y Excel Web, la función SI.CONJUNTO (IFS en inglés) reemplaza las cadenas largas de SI anidadas por pares ordenados de condición y resultado. Su gran ventaja es la legibilidad: todos los criterios quedan al mismo nivel y la fórmula termina con un único paréntesis de cierre.",
        "Al igual que la versión anidada, SI.CONJUNTO evalúa cada prueba lógica en orden de aparición y devuelve el resultado asociado a la primera condición que se cumpla. No tiene un argumento específico para el caso 'si nada se cumple'; si ninguna prueba da verdadero, la fórmula devolverá el error #N/A.",
        "Para replicar el comportamiento del último 'si no' de una SI tradicional, la convención estándar consiste en agregar la palabra lógica VERDADERO (TRUE en inglés) como última condición, seguida del texto o valor por defecto. De ese modo garantizas que ninguna fila quede con #N/A por un caso imprevisto.",
      ],
      codigos: [
        {
          titulo: "Misma escala de cumplimiento escrita con SI.CONJUNTO y respaldo VERDADERO",
          lenguaje: "excel",
          codigo: '=SI.CONJUNTO(B2>=1; "Sobresaliente"; B2>=0,85; "Cumplido"; B2>=0,6; "En desarrollo"; VERDADERO; "Crítico")',
          codigoEn: '=IFS(B2>=1, "Sobresaliente", B2>=0.85, "Cumplido", B2>=0.6, "En desarrollo", TRUE, "Crítico")',
          nota: "El par final VERDADERO; \"Crítico\" actúa como red de seguridad para evitar errores #N/A.",
        },
        {
          titulo: "SI.CONJUNTO combinada con Y para reglas de descuento por segmento",
          lenguaje: "excel",
          codigo: '=SI.CONJUNTO(Y(A2="Mayorista"; B2>=100); 0,18; Y(A2="Mayorista"; B2>=50); 0,12; B2>=100; 0,08; VERDADERO; 0)',
          codigoEn: '=IFS(AND(A2="Mayorista", B2>=100), 0.18, AND(A2="Mayorista", B2>=50), 0.12, B2>=100, 0.08, TRUE, 0)',
        },
      ],
      captura: {
        id: "funcion-si-excel-varias-condiciones-paso-4",
        alt: "Fórmula SI.CONJUNTO en Excel comparando pares de condición y resultado sin paréntesis múltiples al final.",
        caption: "SI.CONJUNTO simplifica la lectura manteniendo la evaluación secuencial de arriba hacia abajo.",
        ratio: "16/9",
      },
    },
    {
      id: "reemplazar-si-con-buscarx",
      titulo: "Cuándo reemplazar SI anidada por BUSCARX aproximado (tramos)",
      esPasoHowTo: true,
      resumenHowTo:
        "Cuando tengas 5 o más tramos numéricos (comisiones, impuestos, descuentos), usa una tabla auxiliar con BUSCARX en modo -1.",
      parrafos: [
        "Uno de los errores de diseño más frecuentes en planillas financieras y comerciales es construir una función SI anidada de 8 o 10 niveles para asignar comisiones, descuentos por volumen o tramos de impuesto. Cada vez que la gerencia cambia un porcentaje o agrega un escalón, hay que editar la fórmula en cientos de filas.",
        "La solución profesional es separar los datos de la lógica: creas una pequeña tabla de referencia con el límite inferior de cada tramo y su porcentaje correspondiente, y luego utilizas BUSCARX (XLOOKUP) con el quinto argumento (modo_de_coincidencia) en -1 (coincidencia exacta o el siguiente elemento menor).",
        "De esta forma, si un vendedor vende $1.350.000 y los tramos parten en $0, $500.000, $1.000.000 y $2.000.000, BUSCARX encuentra automáticamente el piso inmediatamente inferior ($1.000.000) y devuelve su comisión sin escribir una sola condición SI. Si usas Excel 2016 o anterior y no tienes BUSCARX, puedes lograr el mismo efecto con BUSCARV ordenando la tabla de menor a mayor y usando VERDADERO en el cuarto argumento.",
      ],
      codigos: [
        {
          titulo: "Asignar tasa de comisión por tramos con BUSCARX (modo -1)",
          lenguaje: "excel",
          codigo: "=BUSCARX(B2; $G$2:$G$6; $H$2:$H$6; 0; -1)",
          codigoEn: "=XLOOKUP(B2, $G$2:$G$6, $H$2:$H$6, 0, -1)",
          nota: "G2:G6 contiene los pisos de cada tramo (0; 500000; 1000000...) y H2:H6 la tasa asociada.",
        },
      ],
      tabla: {
        caption: "Comparativa: SI anidada vs SI.CONJUNTO vs BUSCARX por tramos",
        encabezados: [
          "Criterio",
          "SI anidada",
          "SI.CONJUNTO (IFS)",
          "BUSCARX aproximado (-1)",
        ],
        filas: [
          [
            "Caso de uso ideal",
            "2 a 4 categorías simples o reglas con texto",
            "3 a 6 condiciones variadas sin paréntesis anidados",
            "5 o más tramos numéricos (comisiones, descuentos, notas)",
          ],
          [
            "Facilidad de mantenimiento",
            "Baja: editar umbrales exige abrir la fórmula",
            "Media: más legible, pero los valores siguen dentro de la fórmula",
            "Alta: cambias la tabla auxiliar y toda la planilla se actualiza",
          ],
          [
            "Compatibilidad de versión",
            "Todas las versiones de Excel",
            "Excel 2019, 2021, 2024, 365 y Web",
            "Excel 2021, 2024, 365 y Web",
          ],
          [
            "Manejo de caso por defecto",
            "Incluido en el último argumento valor_si_falso",
            "Requiere agregar VERDADERO al final para evitar #N/A",
            "Incluido en el cuarto argumento si_no_se_encuentra",
          ],
        ],
      },
      captura: {
        id: "funcion-si-excel-varias-condiciones-paso-5",
        alt: "Comparación en Excel entre una tabla auxiliar de tramos de comisión y la fórmula BUSCARX con modo -1.",
        caption: "Tabla de tramos en G2:H6 consultada limpiamente con BUSCARX en lugar de una SI gigante.",
        ratio: "16/9",
      },
    },
  ],
  erroresComunes: [
    {
      error: "Error #NOMBRE? al escribir SI.CONJUNTO o BUSCARX",
      causa:
        "Escribiste el nombre de la función en inglés teniendo Excel en español (por ejemplo, IF o IFS), olvidaste las comillas alrededor de un texto o estás usando una versión de Excel anterior a 2019/2021.",
      solucion:
        "Verifica el idioma de tu Excel (SI, Y, O, SI.CONJUNTO en español), encierra cualquier palabra de resultado entre comillas dobles y revisa la compatibilidad de tu versión.",
    },
    {
      error: "La condición numérica siempre da FALSO aunque el número coincide",
      causa:
        "Pusiste el número entre comillas dentro de la prueba lógica (por ejemplo, B2>\"500000\") o la celda B2 contiene un número almacenado como texto importado desde un sistema externo.",
      solucion:
        "Quita las comillas a los números en fórmulas y convierte la columna de datos a número real usando 'Texto en columnas' o la función VALOR.",
    },
    {
      error: "SI.CONJUNTO devuelve #N/A en algunas filas",
      causa:
        "Ninguna de las pruebas lógicas resultó verdadera para el dato de esa fila y faltó definir una condición final por defecto.",
      solucion:
        "Agrega al final de los argumentos el par VERDADERO; \"Otro\" (o el valor por defecto que corresponda) para capturar cualquier caso restante.",
    },
    {
      error: "Excel muestra mensaje 'Hay un problema con esta fórmula'",
      causa:
        "Usaste coma (,) como separador de argumentos en un equipo configurado en español de Chile, o falta un paréntesis de cierre en una función Y/O interna.",
      solucion:
        "Cambia las comas de separación de argumentos por punto y coma (;) y asegúrate de cerrar el paréntesis de Y(...) o O(...) antes de escribir el resultado.",
    },
  ],
  plantilla: {
    titulo: "Planilla de práctica: SI, Y/O, SI.CONJUNTO y BUSCARX por tramos",
    descripcion:
      "Próximamente podrás descargar aquí el libro .xlsx con casos reales de bonos comerciales, validación de crédito y tabla de comisiones lista para probar.",
  },
  faqs: [
    {
      q: "¿Cuántas condiciones soporta la función SI en Excel?",
      a: "Desde Excel 2007 en adelante puedes anidar hasta 64 funciones SI, y dentro de Y u O puedes incluir hasta 255 argumentos lógicos. Sin embargo, por claridad y mantenimiento, se recomienda no pasar de 4 niveles anidados.",
    },
    {
      q: "¿Cuál es la diferencia entre SI anidada y SI.CONJUNTO?",
      a: "Ambas evalúan condiciones en orden y devuelven el primer resultado verdadero. La diferencia es que SI anidada mete una función dentro de otra acumulando paréntesis al final, mientras que SI.CONJUNTO lista los pares condición-resultado de forma plana y mucho más legible.",
    },
    {
      q: "¿La función SI distingue entre mayúsculas y minúsculas al comparar texto?",
      a: "No. Para Excel, \"Santiago\"=\"SANTIAGO\" es VERDADERO. Si necesitas una comparación estricta sensible a mayúsculas, debes envolver la comparación dentro de la función IGUAL(A2; \"Santiago\").",
    },
    {
      q: "¿Cómo hago para que la función SI deje la celda vacía si no se cumple la condición?",
      a: "Usa un par de comillas dobles sin espacio en medio como resultado: =SI(B2>0; B2*0,1; \"\"). Ten presente que para otras fórmulas matemáticas esa celda contendrá un texto vacío y no un cero.",
    },
    {
      q: "¿Puedo usar SI con fechas en Excel?",
      a: "Sí. La forma más segura es comparar la celda contra la función FECHA, por ejemplo =SI(A2>=FECHA(2026;11;1); \"Vigente\"; \"Anterior\"), evitando escribir fechas como texto suelto.",
    },
  ],
  relacionadas: [
    "formulas-de-excel-mas-usadas",
    "buscarv-y-buscarx-en-excel",
    "como-hacer-presupuesto-en-excel",
  ],
  enlacesExternos: [
    {
      label: "Referencia de funciones lógicas en Excel (DAX / Excel)",
      url: "https://learn.microsoft.com/es-es/office/vba/excel/concepts/workbooks-and-worksheets/using-worksheet-functions-in-visual-basic",
      fuente: "Microsoft Learn",
    },
    {
      label: "Guía de fórmulas y funciones en Office Scripts / Excel",
      url: "https://learn.microsoft.com/es-es/office/dev/scripts/overview/excel",
      fuente: "Microsoft Learn",
    },
  ],
};

export default guia;
