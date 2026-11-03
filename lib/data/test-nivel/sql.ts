import type { TestNivel } from "./tipos";

export const testSql: TestNivel = {
  tema: "sql",
  nombre: "SQL",
  titulo: "Test de nivel SQL",
  descripcion:
    "Responde 10 preguntas de SQL Server y descubre qué nivel tienes y qué curso te conviene.",
  curso: {
    slug: "sql-server",
    nombre: "Curso SQL Server",
    motivo:
      "Recorre consultas, JOINs, CTEs, funciones de ventana y procedimientos almacenados con práctica guiada.",
  },
  preguntas: [
    {
      id: "sql-where",
      pregunta: "¿Qué cláusula filtra las filas antes de agrupar?",
      opciones: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
      correcta: 0,
      explicacion:
        "WHERE filtra filas antes de GROUP BY. HAVING filtra los grupos después de agregar.",
    },
    {
      id: "sql-inner-join",
      pregunta:
        "¿Qué tipo de JOIN devuelve solo las filas que tienen coincidencia en ambas tablas?",
      opciones: ["LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "INNER JOIN"],
      correcta: 3,
      explicacion:
        "INNER JOIN conserva únicamente las filas que cumplen la condición de unión en ambas tablas.",
    },
    {
      id: "sql-count",
      pregunta: "¿Cuál es la función de agregación que cuenta filas?",
      opciones: ["SUM()", "COUNT()", "AVG()", "MAX()"],
      correcta: 1,
      explicacion:
        "COUNT() cuenta filas. COUNT(*) incluye las filas con valores NULL; COUNT(columna) no las cuenta.",
    },
    {
      id: "sql-having",
      pregunta: "¿Cuál es la diferencia principal entre WHERE y HAVING?",
      opciones: [
        "WHERE filtra grupos y HAVING filtra filas",
        "WHERE filtra filas y HAVING filtra grupos",
        "Son equivalentes y se pueden usar indistintamente",
        "HAVING solo funciona con ORDER BY",
      ],
      correcta: 1,
      explicacion:
        "WHERE se evalúa antes de agrupar; HAVING se evalúa después de GROUP BY y puede usar agregaciones.",
    },
    {
      id: "sql-null",
      pregunta: "En SQL, ¿qué representa NULL?",
      opciones: [
        "El número cero",
        "Una cadena vacía",
        "Un valor desconocido o ausente",
        "Un error de sintaxis",
      ],
      correcta: 2,
      explicacion:
        "NULL representa ausencia de valor o un valor desconocido. No es igual a 0 ni a una cadena vacía.",
    },
    {
      id: "sql-update",
      pregunta: "¿Qué instrucción permite modificar filas existentes?",
      opciones: ["INSERT", "UPDATE", "ALTER", "CREATE"],
      correcta: 1,
      explicacion:
        "UPDATE modifica filas existentes. INSERT agrega filas y ALTER cambia la estructura de la tabla.",
    },
    {
      id: "sql-primary-key",
      pregunta: "¿Cuál es la función de una PRIMARY KEY?",
      opciones: [
        "Permitir valores duplicados",
        "Identificar de forma única cada fila",
        "Ordenar automáticamente la tabla",
        "Guardar un historial de cambios",
      ],
      correcta: 1,
      explicacion:
        "Una PRIMARY KEY identifica de forma única cada fila y no admite valores NULL ni duplicados.",
    },
    {
      id: "sql-window",
      pregunta: "¿Cuál de estas opciones es una función de ventana?",
      opciones: [
        "SUM(total)",
        "ROW_NUMBER() OVER (ORDER BY fecha)",
        "COUNT(*)",
        "CAST(total AS INT)",
      ],
      correcta: 1,
      explicacion:
        "ROW_NUMBER() OVER (...) calcula un número por fila dentro de una ventana definida por OVER.",
    },
    {
      id: "sql-cte",
      pregunta: "¿Qué palabra inicia una CTE (Common Table Expression)?",
      opciones: ["WITH", "SELECT", "CREATE", "DECLARE"],
      correcta: 0,
      explicacion:
        "Una CTE empieza con WITH, seguida del nombre, la consulta y luego la consulta principal.",
    },
    {
      id: "sql-top",
      pregunta:
        "En SQL Server, ¿qué consulta devuelve las 10 ventas con mayor total?",
      opciones: [
        "SELECT * FROM ventas LIMIT 10;",
        "SELECT TOP 10 * FROM ventas;",
        "SELECT * FROM ventas ORDER BY total ASC;",
        "SELECT TOP 10 * FROM ventas ORDER BY total DESC;",
      ],
      correcta: 3,
      explicacion:
        "TOP 10 limita las filas y ORDER BY total DESC pone primero las ventas de mayor total.",
    },
  ],
};
