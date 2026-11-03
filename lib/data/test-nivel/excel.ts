import type { TestNivel } from "./tipos";

export const testExcel: TestNivel = {
  tema: "excel",
  nombre: "Excel",
  titulo: "Test de nivel Excel",
  descripcion:
    "Responde 10 preguntas de Excel y descubre qué nivel tienes y qué curso te conviene.",
  curso: {
    slug: "excel",
    nombre: "Curso Excel",
    motivo:
      "Trabaja fórmulas avanzadas, tablas dinámicas, Power Query y dashboards con ejercicios aplicados.",
  },
  preguntas: [
    {
      id: "excel-buscarx",
      pregunta:
        "¿Qué función busca un valor y devuelve un resultado de otra columna, sin importar si está a la izquierda o a la derecha?",
      opciones: ["BUSCARV", "BUSCARX", "SI", "SUMA"],
      correcta: 1,
      explicacion:
        "BUSCARX (XLOOKUP) puede buscar hacia la izquierda o la derecha y permite definir el valor si no encuentra coincidencia.",
    },
    {
      id: "excel-referencia-absoluta",
      pregunta: "¿Qué referencia queda fija al copiar una fórmula?",
      opciones: ["A1", "$A$1", "A$1", "Hoja1!A1"],
      correcta: 1,
      explicacion:
        "Los dos signos $ fijan columna y fila, por lo que la referencia no cambia al copiar la fórmula.",
    },
    {
      id: "excel-tabla-dinamica",
      pregunta: "¿Para qué sirve principalmente una tabla dinámica?",
      opciones: [
        "Para resumir y agrupar grandes volúmenes de datos",
        "Para proteger el archivo con contraseña",
        "Para imprimir varias hojas a la vez",
        "Para cambiar el idioma de Excel",
      ],
      correcta: 0,
      explicacion:
        "Una tabla dinámica permite agrupar, filtrar y resumir datos para analizarlos desde distintos ángulos.",
    },
    {
      id: "excel-power-query",
      pregunta: "¿Qué herramienta de Excel se usa para importar y transformar datos?",
      opciones: ["Power Query", "Revisión", "Formato de celdas", "Comentarios"],
      correcta: 0,
      explicacion:
        "Power Query conecta fuentes, limpia y transforma datos, y deja el proceso listo para actualizarse.",
    },
    {
      id: "excel-textjoin",
      pregunta:
        "¿Qué función une varios textos en uno solo usando un delimitador?",
      opciones: ["CONCATENAR", "TEXTJOIN", "EXTRAE", "BUSCAR"],
      correcta: 1,
      explicacion:
        "TEXTJOIN une varios textos e indica un delimitador, por ejemplo una coma o un espacio.",
    },
    {
      id: "excel-iferror",
      pregunta: "¿Qué hace SI.ERROR (IFERROR)?",
      opciones: [
        "Ejecuta una fórmula solo si otra da error",
        "Devuelve un valor alternativo cuando una fórmula da error",
        "Borra la fórmula que contiene un error",
        "Convierte cualquier error en cero",
      ],
      correcta: 1,
      explicacion:
        "SI.ERROR evalúa una fórmula y devuelve el valor alternativo si esta produce un error.",
    },
    {
      id: "excel-tabla",
      pregunta:
        "¿Qué ventaja principal tiene convertir un rango en Tabla con Ctrl+T?",
      opciones: [
        "Usa referencias estructuradas y se expande con nuevos datos",
        "Bloquea la edición de todas las celdas",
        "Convierte el archivo en PDF automáticamente",
        "Elimina las fórmulas de la hoja",
      ],
      correcta: 0,
      explicacion:
        "Una Tabla usa referencias estructuradas, aplica formato y se amplía cuando agregas filas o columnas.",
    },
    {
      id: "excel-fila",
      pregunta: "¿Qué función devuelve el número de fila de una celda?",
      opciones: ["COLUMNA()", "FILA()", "CELDA()", "DIRECCION()"],
      correcta: 1,
      explicacion:
        "FILA() devuelve el número de fila de la referencia indicada o de la celda donde se escribe.",
    },
    {
      id: "excel-validacion",
      pregunta: "¿Para qué sirve la validación de datos?",
      opciones: [
        "Para restringir los valores que se pueden ingresar en una celda",
        "Para ordenar las hojas del libro",
        "Para cambiar el color de la pestaña",
        "Para calcular totales automáticamente",
      ],
      correcta: 0,
      explicacion:
        "La validación de datos limita lo que se puede escribir en una celda y puede mostrar un mensaje de ayuda.",
    },
    {
      id: "excel-grafico-lineas",
      pregunta: "¿Qué tipo de gráfico muestra mejor una tendencia a lo largo del tiempo?",
      opciones: ["Gráfico de líneas", "Gráfico de torta", "Gráfico de dispersión", "Gráfico de embudo"],
      correcta: 0,
      explicacion:
        "Un gráfico de líneas representa la evolución de una o más series en el tiempo.",
    },
  ],
};
