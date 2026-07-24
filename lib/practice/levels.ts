// =============================================================================
// Catálogo de Units (secciones) y sus Levels (niveles) + Ejercicios.
//
// Incluye los primeros 50 Niveles pedagógicos completos para:
// 1. Power BI (50 Niveles)
// 2. SQL Server (50 Niveles)
// 3. Inteligencia Artificial (50 Niveles)
// 4. Python Data Analytics (50 Niveles)
// 5. Excel Avanzado (50 Niveles)
// Total: 250 Niveles Interactivos
// =============================================================================

import type { Unit } from "./types";

export const PRACTICE_UNITS: Unit[] = [
  {
    "id": "power-bi",
    "slug": "power-bi",
    "title": "Power BI",
    "description": "Business Intelligence, Power Query, DAX y Visualización de alto impacto.",
    "icon": "BarChart3",
    "accentColor": "#F2C811",
    "emoji": "📊",
    "levels": [
      {
        "id": "pbi-1",
        "title": "Nivel 1 · Fundamentos de BI & Ecosistema Power BI",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-1-e1",
            "type": "story",
            "prompt": "Lección Guiada: Fundamentos de BI & Ecosistema Power BI con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 1.",
            "data": {
              "slides": [
                {
                  "title": "Power BI: Conceptos Clave del Nivel 1",
                  "text": "En esta lección de Power BI, exploraremos Fundamentos de BI & Ecosistema Power BI. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Power BI asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Fundamentos de BI & Ecosistema Power BI es un pilar clave en la ruta de Power BI."
          }
        ]
      },
      {
        "id": "pbi-2",
        "title": "Nivel 2 · Fundamentos de BI & Ecosistema Power BI",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-2-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de BI & Ecosistema Power BI"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-3",
        "title": "Nivel 3 · Fundamentos de BI & Ecosistema Power BI",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-3-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Fundamentos de BI & Ecosistema Power BI:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Fundamentos de BI & Ecosistema Power BI"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-4",
        "title": "Nivel 4 · Fundamentos de BI & Ecosistema Power BI",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-4-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de BI & Ecosistema Power BI"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-5",
        "title": "Nivel 5 · Fundamentos de BI & Ecosistema Power BI",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-5-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Fundamentos de BI & Ecosistema Power BI en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Fundamentos de BI & Ecosistema Power BI de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-6",
        "title": "Nivel 6 · Fundamentos de BI & Ecosistema Power BI",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-6-e1",
            "type": "story",
            "prompt": "Lección Guiada: Fundamentos de BI & Ecosistema Power BI con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 6.",
            "data": {
              "slides": [
                {
                  "title": "Power BI: Conceptos Clave del Nivel 6",
                  "text": "En esta lección de Power BI, exploraremos Fundamentos de BI & Ecosistema Power BI. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Power BI asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Fundamentos de BI & Ecosistema Power BI es un pilar clave en la ruta de Power BI."
          }
        ]
      },
      {
        "id": "pbi-7",
        "title": "Nivel 7 · Fundamentos de BI & Ecosistema Power BI",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-7-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Fundamentos de BI & Ecosistema Power BI en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Fundamentos de BI & Ecosistema Power BI de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-8",
        "title": "Nivel 8 · Fundamentos de BI & Ecosistema Power BI",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-8-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de BI & Ecosistema Power BI"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-9",
        "title": "Nivel 9 · Fundamentos de BI & Ecosistema Power BI",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-9-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Fundamentos de BI & Ecosistema Power BI:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Fundamentos de BI & Ecosistema Power BI"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-10",
        "title": "Nivel 10 · Punto de Control 1 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "pbi-10-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de BI & Ecosistema Power BI"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-11",
        "title": "Nivel 11 · Power Query & Limpieza Básica (ETL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-11-e1",
            "type": "story",
            "prompt": "Lección Guiada: Power Query & Limpieza Básica (ETL) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 11.",
            "data": {
              "slides": [
                {
                  "title": "Power BI: Conceptos Clave del Nivel 11",
                  "text": "En esta lección de Power BI, exploraremos Power Query & Limpieza Básica (ETL). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Power BI asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Power Query & Limpieza Básica (ETL) es un pilar clave en la ruta de Power BI."
          }
        ]
      },
      {
        "id": "pbi-12",
        "title": "Nivel 12 · Power Query & Limpieza Básica (ETL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-12-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Power Query & Limpieza Básica (ETL):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Power Query & Limpieza Básica (ETL)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-13",
        "title": "Nivel 13 · Power Query & Limpieza Básica (ETL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-13-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Power Query & Limpieza Básica (ETL) en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Power Query & Limpieza Básica (ETL) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-14",
        "title": "Nivel 14 · Power Query & Limpieza Básica (ETL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-14-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Power Query & Limpieza Básica (ETL)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-15",
        "title": "Nivel 15 · Power Query & Limpieza Básica (ETL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-15-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Power Query & Limpieza Básica (ETL):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Power Query & Limpieza Básica (ETL)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-16",
        "title": "Nivel 16 · Power Query & Limpieza Básica (ETL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-16-e1",
            "type": "story",
            "prompt": "Lección Guiada: Power Query & Limpieza Básica (ETL) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 16.",
            "data": {
              "slides": [
                {
                  "title": "Power BI: Conceptos Clave del Nivel 16",
                  "text": "En esta lección de Power BI, exploraremos Power Query & Limpieza Básica (ETL). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Power BI asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Power Query & Limpieza Básica (ETL) es un pilar clave en la ruta de Power BI."
          }
        ]
      },
      {
        "id": "pbi-17",
        "title": "Nivel 17 · Power Query & Limpieza Básica (ETL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-17-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Power Query & Limpieza Básica (ETL) en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Power Query & Limpieza Básica (ETL) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-18",
        "title": "Nivel 18 · Power Query & Limpieza Básica (ETL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-18-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Power Query & Limpieza Básica (ETL):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Power Query & Limpieza Básica (ETL)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-19",
        "title": "Nivel 19 · Power Query & Limpieza Básica (ETL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-19-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Power Query & Limpieza Básica (ETL) en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Power Query & Limpieza Básica (ETL) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-20",
        "title": "Nivel 20 · Punto de Control 2 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "pbi-20-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Power Query & Limpieza Básica (ETL)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-21",
        "title": "Nivel 21 · Transformaciones Avanzadas & Lenguaje M",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-21-e1",
            "type": "story",
            "prompt": "Lección Guiada: Transformaciones Avanzadas & Lenguaje M con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 21.",
            "data": {
              "slides": [
                {
                  "title": "Power BI: Conceptos Clave del Nivel 21",
                  "text": "En esta lección de Power BI, exploraremos Transformaciones Avanzadas & Lenguaje M. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Power BI asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Transformaciones Avanzadas & Lenguaje M es un pilar clave en la ruta de Power BI."
          }
        ]
      },
      {
        "id": "pbi-22",
        "title": "Nivel 22 · Transformaciones Avanzadas & Lenguaje M",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-22-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Transformaciones Avanzadas & Lenguaje M"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-23",
        "title": "Nivel 23 · Transformaciones Avanzadas & Lenguaje M",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-23-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Transformaciones Avanzadas & Lenguaje M en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Transformaciones Avanzadas & Lenguaje M de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-24",
        "title": "Nivel 24 · Transformaciones Avanzadas & Lenguaje M",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-24-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Transformaciones Avanzadas & Lenguaje M:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Transformaciones Avanzadas & Lenguaje M"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-25",
        "title": "Nivel 25 · Transformaciones Avanzadas & Lenguaje M",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-25-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Transformaciones Avanzadas & Lenguaje M en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Transformaciones Avanzadas & Lenguaje M de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-26",
        "title": "Nivel 26 · Transformaciones Avanzadas & Lenguaje M",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-26-e1",
            "type": "story",
            "prompt": "Lección Guiada: Transformaciones Avanzadas & Lenguaje M con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 26.",
            "data": {
              "slides": [
                {
                  "title": "Power BI: Conceptos Clave del Nivel 26",
                  "text": "En esta lección de Power BI, exploraremos Transformaciones Avanzadas & Lenguaje M. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Power BI asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Transformaciones Avanzadas & Lenguaje M es un pilar clave en la ruta de Power BI."
          }
        ]
      },
      {
        "id": "pbi-27",
        "title": "Nivel 27 · Transformaciones Avanzadas & Lenguaje M",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-27-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Transformaciones Avanzadas & Lenguaje M:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Transformaciones Avanzadas & Lenguaje M"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-28",
        "title": "Nivel 28 · Transformaciones Avanzadas & Lenguaje M",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-28-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Transformaciones Avanzadas & Lenguaje M"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-29",
        "title": "Nivel 29 · Transformaciones Avanzadas & Lenguaje M",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-29-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Transformaciones Avanzadas & Lenguaje M en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Transformaciones Avanzadas & Lenguaje M de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-30",
        "title": "Nivel 30 · Punto de Control 3 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "pbi-30-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Transformaciones Avanzadas & Lenguaje M:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Transformaciones Avanzadas & Lenguaje M"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-31",
        "title": "Nivel 31 · Arquitectura & Modelado en Estrella",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-31-e1",
            "type": "story",
            "prompt": "Lección Guiada: Arquitectura & Modelado en Estrella con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 31.",
            "data": {
              "slides": [
                {
                  "title": "Power BI: Conceptos Clave del Nivel 31",
                  "text": "En esta lección de Power BI, exploraremos Arquitectura & Modelado en Estrella. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Power BI asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Arquitectura & Modelado en Estrella es un pilar clave en la ruta de Power BI."
          }
        ]
      },
      {
        "id": "pbi-32",
        "title": "Nivel 32 · Arquitectura & Modelado en Estrella",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-32-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Arquitectura & Modelado en Estrella"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-33",
        "title": "Nivel 33 · Arquitectura & Modelado en Estrella",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-33-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Arquitectura & Modelado en Estrella:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Arquitectura & Modelado en Estrella"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-34",
        "title": "Nivel 34 · Arquitectura & Modelado en Estrella",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-34-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Arquitectura & Modelado en Estrella"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-35",
        "title": "Nivel 35 · Arquitectura & Modelado en Estrella",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-35-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Arquitectura & Modelado en Estrella en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Arquitectura & Modelado en Estrella de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-36",
        "title": "Nivel 36 · Arquitectura & Modelado en Estrella",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-36-e1",
            "type": "story",
            "prompt": "Lección Guiada: Arquitectura & Modelado en Estrella con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 36.",
            "data": {
              "slides": [
                {
                  "title": "Power BI: Conceptos Clave del Nivel 36",
                  "text": "En esta lección de Power BI, exploraremos Arquitectura & Modelado en Estrella. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Power BI asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Arquitectura & Modelado en Estrella es un pilar clave en la ruta de Power BI."
          }
        ]
      },
      {
        "id": "pbi-37",
        "title": "Nivel 37 · Arquitectura & Modelado en Estrella",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-37-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Arquitectura & Modelado en Estrella en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Arquitectura & Modelado en Estrella de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-38",
        "title": "Nivel 38 · Arquitectura & Modelado en Estrella",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-38-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Arquitectura & Modelado en Estrella"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-39",
        "title": "Nivel 39 · Arquitectura & Modelado en Estrella",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-39-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Arquitectura & Modelado en Estrella:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Arquitectura & Modelado en Estrella"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-40",
        "title": "Nivel 40 · Punto de Control 4 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "pbi-40-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Arquitectura & Modelado en Estrella"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-41",
        "title": "Nivel 41 · Creación de la Tabla de Fechas (Calendario)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-41-e1",
            "type": "story",
            "prompt": "Lección Guiada: Creación de la Tabla de Fechas (Calendario) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 41.",
            "data": {
              "slides": [
                {
                  "title": "Power BI: Conceptos Clave del Nivel 41",
                  "text": "En esta lección de Power BI, exploraremos Creación de la Tabla de Fechas (Calendario). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Power BI asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Creación de la Tabla de Fechas (Calendario) es un pilar clave en la ruta de Power BI."
          }
        ]
      },
      {
        "id": "pbi-42",
        "title": "Nivel 42 · Creación de la Tabla de Fechas (Calendario)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-42-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Creación de la Tabla de Fechas (Calendario):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Creación de la Tabla de Fechas (Calendario)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-43",
        "title": "Nivel 43 · Creación de la Tabla de Fechas (Calendario)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-43-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Creación de la Tabla de Fechas (Calendario) en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Creación de la Tabla de Fechas (Calendario) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-44",
        "title": "Nivel 44 · Creación de la Tabla de Fechas (Calendario)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-44-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Creación de la Tabla de Fechas (Calendario)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "pbi-45",
        "title": "Nivel 45 · Creación de la Tabla de Fechas (Calendario)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-45-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Creación de la Tabla de Fechas (Calendario):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Creación de la Tabla de Fechas (Calendario)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-46",
        "title": "Nivel 46 · Creación de la Tabla de Fechas (Calendario)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-46-e1",
            "type": "story",
            "prompt": "Lección Guiada: Creación de la Tabla de Fechas (Calendario) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 46.",
            "data": {
              "slides": [
                {
                  "title": "Power BI: Conceptos Clave del Nivel 46",
                  "text": "En esta lección de Power BI, exploraremos Creación de la Tabla de Fechas (Calendario). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Power BI asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Creación de la Tabla de Fechas (Calendario) es un pilar clave en la ruta de Power BI."
          }
        ]
      },
      {
        "id": "pbi-47",
        "title": "Nivel 47 · Creación de la Tabla de Fechas (Calendario)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-47-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Creación de la Tabla de Fechas (Calendario) en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Creación de la Tabla de Fechas (Calendario) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-48",
        "title": "Nivel 48 · Creación de la Tabla de Fechas (Calendario)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-48-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Creación de la Tabla de Fechas (Calendario):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Power BI"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Creación de la Tabla de Fechas (Calendario)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "pbi-49",
        "title": "Nivel 49 · Creación de la Tabla de Fechas (Calendario)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "pbi-49-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Creación de la Tabla de Fechas (Calendario) en Power BI?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Creación de la Tabla de Fechas (Calendario) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Power BI."
          }
        ]
      },
      {
        "id": "pbi-50",
        "title": "Nivel 50 · Punto de Control 5 & Trofeo",
        "kind": "checkpoint",
        "xp": 40,
        "exercises": [
          {
            "id": "pbi-50-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Power BI con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Power BI Componente A"
                },
                {
                  "id": "L2",
                  "text": "Power BI Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Creación de la Tabla de Fechas (Calendario)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Power BI optimiza tu aprendizaje."
          }
        ]
      }
    ]
  },
  {
    "id": "sql-server",
    "slug": "sql-server",
    "title": "SQL Server",
    "description": "Consultas, joins y bases relacionales con T-SQL.",
    "icon": "Database",
    "accentColor": "#CC2935",
    "emoji": "🛢️",
    "levels": [
      {
        "id": "sql-1",
        "title": "Nivel 1 · Fundamentos de T-SQL & Consultas SELECT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-1-e1",
            "type": "story",
            "prompt": "Lección Guiada: Fundamentos de T-SQL & Consultas SELECT con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 1.",
            "data": {
              "slides": [
                {
                  "title": "SQL Server: Conceptos Clave del Nivel 1",
                  "text": "En esta lección de SQL Server, exploraremos Fundamentos de T-SQL & Consultas SELECT. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en SQL Server asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Fundamentos de T-SQL & Consultas SELECT es un pilar clave en la ruta de SQL Server."
          }
        ]
      },
      {
        "id": "sql-2",
        "title": "Nivel 2 · Fundamentos de T-SQL & Consultas SELECT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-2-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de T-SQL & Consultas SELECT"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-3",
        "title": "Nivel 3 · Fundamentos de T-SQL & Consultas SELECT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-3-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Fundamentos de T-SQL & Consultas SELECT:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Fundamentos de T-SQL & Consultas SELECT"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-4",
        "title": "Nivel 4 · Fundamentos de T-SQL & Consultas SELECT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-4-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de T-SQL & Consultas SELECT"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-5",
        "title": "Nivel 5 · Fundamentos de T-SQL & Consultas SELECT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-5-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Fundamentos de T-SQL & Consultas SELECT en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Fundamentos de T-SQL & Consultas SELECT de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-6",
        "title": "Nivel 6 · Fundamentos de T-SQL & Consultas SELECT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-6-e1",
            "type": "story",
            "prompt": "Lección Guiada: Fundamentos de T-SQL & Consultas SELECT con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 6.",
            "data": {
              "slides": [
                {
                  "title": "SQL Server: Conceptos Clave del Nivel 6",
                  "text": "En esta lección de SQL Server, exploraremos Fundamentos de T-SQL & Consultas SELECT. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en SQL Server asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Fundamentos de T-SQL & Consultas SELECT es un pilar clave en la ruta de SQL Server."
          }
        ]
      },
      {
        "id": "sql-7",
        "title": "Nivel 7 · Fundamentos de T-SQL & Consultas SELECT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-7-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Fundamentos de T-SQL & Consultas SELECT en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Fundamentos de T-SQL & Consultas SELECT de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-8",
        "title": "Nivel 8 · Fundamentos de T-SQL & Consultas SELECT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-8-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de T-SQL & Consultas SELECT"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-9",
        "title": "Nivel 9 · Fundamentos de T-SQL & Consultas SELECT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-9-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Fundamentos de T-SQL & Consultas SELECT:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Fundamentos de T-SQL & Consultas SELECT"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-10",
        "title": "Nivel 10 · Punto de Control 1 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "sql-10-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de T-SQL & Consultas SELECT"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-11",
        "title": "Nivel 11 · Filtrado de Datos con WHERE & Operadores",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-11-e1",
            "type": "story",
            "prompt": "Lección Guiada: Filtrado de Datos con WHERE & Operadores con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 11.",
            "data": {
              "slides": [
                {
                  "title": "SQL Server: Conceptos Clave del Nivel 11",
                  "text": "En esta lección de SQL Server, exploraremos Filtrado de Datos con WHERE & Operadores. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en SQL Server asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Filtrado de Datos con WHERE & Operadores es un pilar clave en la ruta de SQL Server."
          }
        ]
      },
      {
        "id": "sql-12",
        "title": "Nivel 12 · Filtrado de Datos con WHERE & Operadores",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-12-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Filtrado de Datos con WHERE & Operadores:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Filtrado de Datos con WHERE & Operadores"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-13",
        "title": "Nivel 13 · Filtrado de Datos con WHERE & Operadores",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-13-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Filtrado de Datos con WHERE & Operadores en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Filtrado de Datos con WHERE & Operadores de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-14",
        "title": "Nivel 14 · Filtrado de Datos con WHERE & Operadores",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-14-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Filtrado de Datos con WHERE & Operadores"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-15",
        "title": "Nivel 15 · Filtrado de Datos con WHERE & Operadores",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-15-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Filtrado de Datos con WHERE & Operadores:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Filtrado de Datos con WHERE & Operadores"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-16",
        "title": "Nivel 16 · Filtrado de Datos con WHERE & Operadores",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-16-e1",
            "type": "story",
            "prompt": "Lección Guiada: Filtrado de Datos con WHERE & Operadores con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 16.",
            "data": {
              "slides": [
                {
                  "title": "SQL Server: Conceptos Clave del Nivel 16",
                  "text": "En esta lección de SQL Server, exploraremos Filtrado de Datos con WHERE & Operadores. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en SQL Server asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Filtrado de Datos con WHERE & Operadores es un pilar clave en la ruta de SQL Server."
          }
        ]
      },
      {
        "id": "sql-17",
        "title": "Nivel 17 · Filtrado de Datos con WHERE & Operadores",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-17-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Filtrado de Datos con WHERE & Operadores en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Filtrado de Datos con WHERE & Operadores de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-18",
        "title": "Nivel 18 · Filtrado de Datos con WHERE & Operadores",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-18-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Filtrado de Datos con WHERE & Operadores:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Filtrado de Datos con WHERE & Operadores"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-19",
        "title": "Nivel 19 · Filtrado de Datos con WHERE & Operadores",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-19-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Filtrado de Datos con WHERE & Operadores en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Filtrado de Datos con WHERE & Operadores de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-20",
        "title": "Nivel 20 · Punto de Control 2 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "sql-20-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Filtrado de Datos con WHERE & Operadores"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-21",
        "title": "Nivel 21 · Ordenamiento ORDER BY, TOP & DISTINCT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-21-e1",
            "type": "story",
            "prompt": "Lección Guiada: Ordenamiento ORDER BY, TOP & DISTINCT con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 21.",
            "data": {
              "slides": [
                {
                  "title": "SQL Server: Conceptos Clave del Nivel 21",
                  "text": "En esta lección de SQL Server, exploraremos Ordenamiento ORDER BY, TOP & DISTINCT. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en SQL Server asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Ordenamiento ORDER BY, TOP & DISTINCT es un pilar clave en la ruta de SQL Server."
          }
        ]
      },
      {
        "id": "sql-22",
        "title": "Nivel 22 · Ordenamiento ORDER BY, TOP & DISTINCT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-22-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Ordenamiento ORDER BY, TOP & DISTINCT"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-23",
        "title": "Nivel 23 · Ordenamiento ORDER BY, TOP & DISTINCT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-23-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Ordenamiento ORDER BY, TOP & DISTINCT en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Ordenamiento ORDER BY, TOP & DISTINCT de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-24",
        "title": "Nivel 24 · Ordenamiento ORDER BY, TOP & DISTINCT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-24-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Ordenamiento ORDER BY, TOP & DISTINCT:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Ordenamiento ORDER BY, TOP & DISTINCT"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-25",
        "title": "Nivel 25 · Ordenamiento ORDER BY, TOP & DISTINCT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-25-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Ordenamiento ORDER BY, TOP & DISTINCT en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Ordenamiento ORDER BY, TOP & DISTINCT de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-26",
        "title": "Nivel 26 · Ordenamiento ORDER BY, TOP & DISTINCT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-26-e1",
            "type": "story",
            "prompt": "Lección Guiada: Ordenamiento ORDER BY, TOP & DISTINCT con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 26.",
            "data": {
              "slides": [
                {
                  "title": "SQL Server: Conceptos Clave del Nivel 26",
                  "text": "En esta lección de SQL Server, exploraremos Ordenamiento ORDER BY, TOP & DISTINCT. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en SQL Server asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Ordenamiento ORDER BY, TOP & DISTINCT es un pilar clave en la ruta de SQL Server."
          }
        ]
      },
      {
        "id": "sql-27",
        "title": "Nivel 27 · Ordenamiento ORDER BY, TOP & DISTINCT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-27-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Ordenamiento ORDER BY, TOP & DISTINCT:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Ordenamiento ORDER BY, TOP & DISTINCT"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-28",
        "title": "Nivel 28 · Ordenamiento ORDER BY, TOP & DISTINCT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-28-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Ordenamiento ORDER BY, TOP & DISTINCT"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-29",
        "title": "Nivel 29 · Ordenamiento ORDER BY, TOP & DISTINCT",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-29-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Ordenamiento ORDER BY, TOP & DISTINCT en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Ordenamiento ORDER BY, TOP & DISTINCT de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-30",
        "title": "Nivel 30 · Punto de Control 3 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "sql-30-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Ordenamiento ORDER BY, TOP & DISTINCT:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Ordenamiento ORDER BY, TOP & DISTINCT"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-31",
        "title": "Nivel 31 · Agregación SUM, COUNT & GROUP BY / HAVING",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-31-e1",
            "type": "story",
            "prompt": "Lección Guiada: Agregación SUM, COUNT & GROUP BY / HAVING con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 31.",
            "data": {
              "slides": [
                {
                  "title": "SQL Server: Conceptos Clave del Nivel 31",
                  "text": "En esta lección de SQL Server, exploraremos Agregación SUM, COUNT & GROUP BY / HAVING. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en SQL Server asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Agregación SUM, COUNT & GROUP BY / HAVING es un pilar clave en la ruta de SQL Server."
          }
        ]
      },
      {
        "id": "sql-32",
        "title": "Nivel 32 · Agregación SUM, COUNT & GROUP BY / HAVING",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-32-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Agregación SUM, COUNT & GROUP BY / HAVING"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-33",
        "title": "Nivel 33 · Agregación SUM, COUNT & GROUP BY / HAVING",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-33-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Agregación SUM, COUNT & GROUP BY / HAVING:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Agregación SUM, COUNT & GROUP BY / HAVING"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-34",
        "title": "Nivel 34 · Agregación SUM, COUNT & GROUP BY / HAVING",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-34-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Agregación SUM, COUNT & GROUP BY / HAVING"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-35",
        "title": "Nivel 35 · Agregación SUM, COUNT & GROUP BY / HAVING",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-35-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Agregación SUM, COUNT & GROUP BY / HAVING en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Agregación SUM, COUNT & GROUP BY / HAVING de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-36",
        "title": "Nivel 36 · Agregación SUM, COUNT & GROUP BY / HAVING",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-36-e1",
            "type": "story",
            "prompt": "Lección Guiada: Agregación SUM, COUNT & GROUP BY / HAVING con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 36.",
            "data": {
              "slides": [
                {
                  "title": "SQL Server: Conceptos Clave del Nivel 36",
                  "text": "En esta lección de SQL Server, exploraremos Agregación SUM, COUNT & GROUP BY / HAVING. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en SQL Server asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Agregación SUM, COUNT & GROUP BY / HAVING es un pilar clave en la ruta de SQL Server."
          }
        ]
      },
      {
        "id": "sql-37",
        "title": "Nivel 37 · Agregación SUM, COUNT & GROUP BY / HAVING",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-37-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Agregación SUM, COUNT & GROUP BY / HAVING en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Agregación SUM, COUNT & GROUP BY / HAVING de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-38",
        "title": "Nivel 38 · Agregación SUM, COUNT & GROUP BY / HAVING",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-38-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Agregación SUM, COUNT & GROUP BY / HAVING"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-39",
        "title": "Nivel 39 · Agregación SUM, COUNT & GROUP BY / HAVING",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-39-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Agregación SUM, COUNT & GROUP BY / HAVING:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Agregación SUM, COUNT & GROUP BY / HAVING"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-40",
        "title": "Nivel 40 · Punto de Control 4 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "sql-40-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Agregación SUM, COUNT & GROUP BY / HAVING"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-41",
        "title": "Nivel 41 · Combinación de Tablas (INNER & LEFT JOIN)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-41-e1",
            "type": "story",
            "prompt": "Lección Guiada: Combinación de Tablas (INNER & LEFT JOIN) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 41.",
            "data": {
              "slides": [
                {
                  "title": "SQL Server: Conceptos Clave del Nivel 41",
                  "text": "En esta lección de SQL Server, exploraremos Combinación de Tablas (INNER & LEFT JOIN). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en SQL Server asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Combinación de Tablas (INNER & LEFT JOIN) es un pilar clave en la ruta de SQL Server."
          }
        ]
      },
      {
        "id": "sql-42",
        "title": "Nivel 42 · Combinación de Tablas (INNER & LEFT JOIN)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-42-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Combinación de Tablas (INNER & LEFT JOIN):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Combinación de Tablas (INNER & LEFT JOIN)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-43",
        "title": "Nivel 43 · Combinación de Tablas (INNER & LEFT JOIN)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-43-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Combinación de Tablas (INNER & LEFT JOIN) en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Combinación de Tablas (INNER & LEFT JOIN) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-44",
        "title": "Nivel 44 · Combinación de Tablas (INNER & LEFT JOIN)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-44-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Combinación de Tablas (INNER & LEFT JOIN)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "sql-45",
        "title": "Nivel 45 · Combinación de Tablas (INNER & LEFT JOIN)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-45-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Combinación de Tablas (INNER & LEFT JOIN):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Combinación de Tablas (INNER & LEFT JOIN)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-46",
        "title": "Nivel 46 · Combinación de Tablas (INNER & LEFT JOIN)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-46-e1",
            "type": "story",
            "prompt": "Lección Guiada: Combinación de Tablas (INNER & LEFT JOIN) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 46.",
            "data": {
              "slides": [
                {
                  "title": "SQL Server: Conceptos Clave del Nivel 46",
                  "text": "En esta lección de SQL Server, exploraremos Combinación de Tablas (INNER & LEFT JOIN). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en SQL Server asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Combinación de Tablas (INNER & LEFT JOIN) es un pilar clave en la ruta de SQL Server."
          }
        ]
      },
      {
        "id": "sql-47",
        "title": "Nivel 47 · Combinación de Tablas (INNER & LEFT JOIN)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-47-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Combinación de Tablas (INNER & LEFT JOIN) en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Combinación de Tablas (INNER & LEFT JOIN) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-48",
        "title": "Nivel 48 · Combinación de Tablas (INNER & LEFT JOIN)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-48-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Combinación de Tablas (INNER & LEFT JOIN):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar SQL Server"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Combinación de Tablas (INNER & LEFT JOIN)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "sql-49",
        "title": "Nivel 49 · Combinación de Tablas (INNER & LEFT JOIN)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "sql-49-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Combinación de Tablas (INNER & LEFT JOIN) en SQL Server?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Combinación de Tablas (INNER & LEFT JOIN) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en SQL Server."
          }
        ]
      },
      {
        "id": "sql-50",
        "title": "Nivel 50 · Punto de Control 5 & Trofeo",
        "kind": "checkpoint",
        "xp": 40,
        "exercises": [
          {
            "id": "sql-50-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de SQL Server con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "SQL Server Componente A"
                },
                {
                  "id": "L2",
                  "text": "SQL Server Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Combinación de Tablas (INNER & LEFT JOIN)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en SQL Server optimiza tu aprendizaje."
          }
        ]
      }
    ]
  },
  {
    "id": "inteligencia-artificial",
    "slug": "inteligencia-artificial",
    "title": "Inteligencia Artificial",
    "description": "Prompting, RAG y fundamentos de LLMs.",
    "icon": "Brain",
    "accentColor": "#7C3AED",
    "emoji": "🧠",
    "levels": [
      {
        "id": "ia-1",
        "title": "Nivel 1 · Fundamentos de IA Generativa & LLMs",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-1-e1",
            "type": "story",
            "prompt": "Lección Guiada: Fundamentos de IA Generativa & LLMs con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 1.",
            "data": {
              "slides": [
                {
                  "title": "Inteligencia Artificial: Conceptos Clave del Nivel 1",
                  "text": "En esta lección de Inteligencia Artificial, exploraremos Fundamentos de IA Generativa & LLMs. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Inteligencia Artificial asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Fundamentos de IA Generativa & LLMs es un pilar clave en la ruta de Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-2",
        "title": "Nivel 2 · Fundamentos de IA Generativa & LLMs",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-2-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de IA Generativa & LLMs"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-3",
        "title": "Nivel 3 · Fundamentos de IA Generativa & LLMs",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-3-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Fundamentos de IA Generativa & LLMs:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Fundamentos de IA Generativa & LLMs"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-4",
        "title": "Nivel 4 · Fundamentos de IA Generativa & LLMs",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-4-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de IA Generativa & LLMs"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-5",
        "title": "Nivel 5 · Fundamentos de IA Generativa & LLMs",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-5-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Fundamentos de IA Generativa & LLMs en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Fundamentos de IA Generativa & LLMs de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-6",
        "title": "Nivel 6 · Fundamentos de IA Generativa & LLMs",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-6-e1",
            "type": "story",
            "prompt": "Lección Guiada: Fundamentos de IA Generativa & LLMs con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 6.",
            "data": {
              "slides": [
                {
                  "title": "Inteligencia Artificial: Conceptos Clave del Nivel 6",
                  "text": "En esta lección de Inteligencia Artificial, exploraremos Fundamentos de IA Generativa & LLMs. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Inteligencia Artificial asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Fundamentos de IA Generativa & LLMs es un pilar clave en la ruta de Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-7",
        "title": "Nivel 7 · Fundamentos de IA Generativa & LLMs",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-7-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Fundamentos de IA Generativa & LLMs en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Fundamentos de IA Generativa & LLMs de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-8",
        "title": "Nivel 8 · Fundamentos de IA Generativa & LLMs",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-8-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de IA Generativa & LLMs"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-9",
        "title": "Nivel 9 · Fundamentos de IA Generativa & LLMs",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-9-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Fundamentos de IA Generativa & LLMs:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Fundamentos de IA Generativa & LLMs"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-10",
        "title": "Nivel 10 · Punto de Control 1 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "ia-10-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Fundamentos de IA Generativa & LLMs"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-11",
        "title": "Nivel 11 · Arquitectura de Prompts (Persona & Contexto)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-11-e1",
            "type": "story",
            "prompt": "Lección Guiada: Arquitectura de Prompts (Persona & Contexto) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 11.",
            "data": {
              "slides": [
                {
                  "title": "Inteligencia Artificial: Conceptos Clave del Nivel 11",
                  "text": "En esta lección de Inteligencia Artificial, exploraremos Arquitectura de Prompts (Persona & Contexto). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Inteligencia Artificial asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Arquitectura de Prompts (Persona & Contexto) es un pilar clave en la ruta de Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-12",
        "title": "Nivel 12 · Arquitectura de Prompts (Persona & Contexto)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-12-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Arquitectura de Prompts (Persona & Contexto):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Arquitectura de Prompts (Persona & Contexto)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-13",
        "title": "Nivel 13 · Arquitectura de Prompts (Persona & Contexto)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-13-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Arquitectura de Prompts (Persona & Contexto) en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Arquitectura de Prompts (Persona & Contexto) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-14",
        "title": "Nivel 14 · Arquitectura de Prompts (Persona & Contexto)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-14-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Arquitectura de Prompts (Persona & Contexto)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-15",
        "title": "Nivel 15 · Arquitectura de Prompts (Persona & Contexto)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-15-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Arquitectura de Prompts (Persona & Contexto):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Arquitectura de Prompts (Persona & Contexto)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-16",
        "title": "Nivel 16 · Arquitectura de Prompts (Persona & Contexto)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-16-e1",
            "type": "story",
            "prompt": "Lección Guiada: Arquitectura de Prompts (Persona & Contexto) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 16.",
            "data": {
              "slides": [
                {
                  "title": "Inteligencia Artificial: Conceptos Clave del Nivel 16",
                  "text": "En esta lección de Inteligencia Artificial, exploraremos Arquitectura de Prompts (Persona & Contexto). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Inteligencia Artificial asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Arquitectura de Prompts (Persona & Contexto) es un pilar clave en la ruta de Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-17",
        "title": "Nivel 17 · Arquitectura de Prompts (Persona & Contexto)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-17-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Arquitectura de Prompts (Persona & Contexto) en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Arquitectura de Prompts (Persona & Contexto) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-18",
        "title": "Nivel 18 · Arquitectura de Prompts (Persona & Contexto)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-18-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Arquitectura de Prompts (Persona & Contexto):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Arquitectura de Prompts (Persona & Contexto)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-19",
        "title": "Nivel 19 · Arquitectura de Prompts (Persona & Contexto)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-19-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Arquitectura de Prompts (Persona & Contexto) en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Arquitectura de Prompts (Persona & Contexto) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-20",
        "title": "Nivel 20 · Punto de Control 2 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "ia-20-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Arquitectura de Prompts (Persona & Contexto)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-21",
        "title": "Nivel 21 · Prompting Zero-Shot & Few-Shot",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-21-e1",
            "type": "story",
            "prompt": "Lección Guiada: Prompting Zero-Shot & Few-Shot con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 21.",
            "data": {
              "slides": [
                {
                  "title": "Inteligencia Artificial: Conceptos Clave del Nivel 21",
                  "text": "En esta lección de Inteligencia Artificial, exploraremos Prompting Zero-Shot & Few-Shot. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Inteligencia Artificial asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Prompting Zero-Shot & Few-Shot es un pilar clave en la ruta de Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-22",
        "title": "Nivel 22 · Prompting Zero-Shot & Few-Shot",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-22-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Prompting Zero-Shot & Few-Shot"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-23",
        "title": "Nivel 23 · Prompting Zero-Shot & Few-Shot",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-23-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Prompting Zero-Shot & Few-Shot en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Prompting Zero-Shot & Few-Shot de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-24",
        "title": "Nivel 24 · Prompting Zero-Shot & Few-Shot",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-24-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Prompting Zero-Shot & Few-Shot:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Prompting Zero-Shot & Few-Shot"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-25",
        "title": "Nivel 25 · Prompting Zero-Shot & Few-Shot",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-25-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Prompting Zero-Shot & Few-Shot en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Prompting Zero-Shot & Few-Shot de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-26",
        "title": "Nivel 26 · Prompting Zero-Shot & Few-Shot",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-26-e1",
            "type": "story",
            "prompt": "Lección Guiada: Prompting Zero-Shot & Few-Shot con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 26.",
            "data": {
              "slides": [
                {
                  "title": "Inteligencia Artificial: Conceptos Clave del Nivel 26",
                  "text": "En esta lección de Inteligencia Artificial, exploraremos Prompting Zero-Shot & Few-Shot. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Inteligencia Artificial asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Prompting Zero-Shot & Few-Shot es un pilar clave en la ruta de Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-27",
        "title": "Nivel 27 · Prompting Zero-Shot & Few-Shot",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-27-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Prompting Zero-Shot & Few-Shot:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Prompting Zero-Shot & Few-Shot"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-28",
        "title": "Nivel 28 · Prompting Zero-Shot & Few-Shot",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-28-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Prompting Zero-Shot & Few-Shot"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-29",
        "title": "Nivel 29 · Prompting Zero-Shot & Few-Shot",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-29-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Prompting Zero-Shot & Few-Shot en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Prompting Zero-Shot & Few-Shot de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-30",
        "title": "Nivel 30 · Punto de Control 3 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "ia-30-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Prompting Zero-Shot & Few-Shot:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Prompting Zero-Shot & Few-Shot"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-31",
        "title": "Nivel 31 · Chain-of-Thought (CoT) & Razonamiento",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-31-e1",
            "type": "story",
            "prompt": "Lección Guiada: Chain-of-Thought (CoT) & Razonamiento con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 31.",
            "data": {
              "slides": [
                {
                  "title": "Inteligencia Artificial: Conceptos Clave del Nivel 31",
                  "text": "En esta lección de Inteligencia Artificial, exploraremos Chain-of-Thought (CoT) & Razonamiento. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Inteligencia Artificial asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Chain-of-Thought (CoT) & Razonamiento es un pilar clave en la ruta de Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-32",
        "title": "Nivel 32 · Chain-of-Thought (CoT) & Razonamiento",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-32-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Chain-of-Thought (CoT) & Razonamiento"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-33",
        "title": "Nivel 33 · Chain-of-Thought (CoT) & Razonamiento",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-33-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Chain-of-Thought (CoT) & Razonamiento:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Chain-of-Thought (CoT) & Razonamiento"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-34",
        "title": "Nivel 34 · Chain-of-Thought (CoT) & Razonamiento",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-34-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Chain-of-Thought (CoT) & Razonamiento"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-35",
        "title": "Nivel 35 · Chain-of-Thought (CoT) & Razonamiento",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-35-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Chain-of-Thought (CoT) & Razonamiento en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Chain-of-Thought (CoT) & Razonamiento de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-36",
        "title": "Nivel 36 · Chain-of-Thought (CoT) & Razonamiento",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-36-e1",
            "type": "story",
            "prompt": "Lección Guiada: Chain-of-Thought (CoT) & Razonamiento con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 36.",
            "data": {
              "slides": [
                {
                  "title": "Inteligencia Artificial: Conceptos Clave del Nivel 36",
                  "text": "En esta lección de Inteligencia Artificial, exploraremos Chain-of-Thought (CoT) & Razonamiento. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Inteligencia Artificial asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Chain-of-Thought (CoT) & Razonamiento es un pilar clave en la ruta de Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-37",
        "title": "Nivel 37 · Chain-of-Thought (CoT) & Razonamiento",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-37-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Chain-of-Thought (CoT) & Razonamiento en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Chain-of-Thought (CoT) & Razonamiento de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-38",
        "title": "Nivel 38 · Chain-of-Thought (CoT) & Razonamiento",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-38-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Chain-of-Thought (CoT) & Razonamiento"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-39",
        "title": "Nivel 39 · Chain-of-Thought (CoT) & Razonamiento",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-39-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Chain-of-Thought (CoT) & Razonamiento:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Chain-of-Thought (CoT) & Razonamiento"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-40",
        "title": "Nivel 40 · Punto de Control 4 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "ia-40-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Chain-of-Thought (CoT) & Razonamiento"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-41",
        "title": "Nivel 41 · Formatos de Salida Estructurados (JSON/SQL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-41-e1",
            "type": "story",
            "prompt": "Lección Guiada: Formatos de Salida Estructurados (JSON/SQL) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 41.",
            "data": {
              "slides": [
                {
                  "title": "Inteligencia Artificial: Conceptos Clave del Nivel 41",
                  "text": "En esta lección de Inteligencia Artificial, exploraremos Formatos de Salida Estructurados (JSON/SQL). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Inteligencia Artificial asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Formatos de Salida Estructurados (JSON/SQL) es un pilar clave en la ruta de Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-42",
        "title": "Nivel 42 · Formatos de Salida Estructurados (JSON/SQL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-42-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Formatos de Salida Estructurados (JSON/SQL):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Formatos de Salida Estructurados (JSON/SQL)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-43",
        "title": "Nivel 43 · Formatos de Salida Estructurados (JSON/SQL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-43-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Formatos de Salida Estructurados (JSON/SQL) en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Formatos de Salida Estructurados (JSON/SQL) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-44",
        "title": "Nivel 44 · Formatos de Salida Estructurados (JSON/SQL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-44-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Formatos de Salida Estructurados (JSON/SQL)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "ia-45",
        "title": "Nivel 45 · Formatos de Salida Estructurados (JSON/SQL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-45-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Formatos de Salida Estructurados (JSON/SQL):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Formatos de Salida Estructurados (JSON/SQL)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-46",
        "title": "Nivel 46 · Formatos de Salida Estructurados (JSON/SQL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-46-e1",
            "type": "story",
            "prompt": "Lección Guiada: Formatos de Salida Estructurados (JSON/SQL) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 46.",
            "data": {
              "slides": [
                {
                  "title": "Inteligencia Artificial: Conceptos Clave del Nivel 46",
                  "text": "En esta lección de Inteligencia Artificial, exploraremos Formatos de Salida Estructurados (JSON/SQL). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Inteligencia Artificial asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Formatos de Salida Estructurados (JSON/SQL) es un pilar clave en la ruta de Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-47",
        "title": "Nivel 47 · Formatos de Salida Estructurados (JSON/SQL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-47-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Formatos de Salida Estructurados (JSON/SQL) en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Formatos de Salida Estructurados (JSON/SQL) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-48",
        "title": "Nivel 48 · Formatos de Salida Estructurados (JSON/SQL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-48-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Formatos de Salida Estructurados (JSON/SQL):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Inteligencia Artificial"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Formatos de Salida Estructurados (JSON/SQL)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "ia-49",
        "title": "Nivel 49 · Formatos de Salida Estructurados (JSON/SQL)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "ia-49-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Formatos de Salida Estructurados (JSON/SQL) en Inteligencia Artificial?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Formatos de Salida Estructurados (JSON/SQL) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Inteligencia Artificial."
          }
        ]
      },
      {
        "id": "ia-50",
        "title": "Nivel 50 · Punto de Control 5 & Trofeo",
        "kind": "checkpoint",
        "xp": 40,
        "exercises": [
          {
            "id": "ia-50-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Inteligencia Artificial con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Inteligencia Artificial Componente A"
                },
                {
                  "id": "L2",
                  "text": "Inteligencia Artificial Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Formatos de Salida Estructurados (JSON/SQL)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Inteligencia Artificial optimiza tu aprendizaje."
          }
        ]
      }
    ]
  },
  {
    "id": "python",
    "slug": "python",
    "title": "Python",
    "description": "Sintaxis, tipos de datos y librerías.",
    "icon": "Code2",
    "accentColor": "#3B82F6",
    "emoji": "🐍",
    "levels": [
      {
        "id": "py-1",
        "title": "Nivel 1 · Sintaxis Básica, Variables & print()",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-1-e1",
            "type": "story",
            "prompt": "Lección Guiada: Sintaxis Básica, Variables & print() con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 1.",
            "data": {
              "slides": [
                {
                  "title": "Python: Conceptos Clave del Nivel 1",
                  "text": "En esta lección de Python, exploraremos Sintaxis Básica, Variables & print(). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Python asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Sintaxis Básica, Variables & print() es un pilar clave en la ruta de Python."
          }
        ]
      },
      {
        "id": "py-2",
        "title": "Nivel 2 · Sintaxis Básica, Variables & print()",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-2-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Sintaxis Básica, Variables & print()"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-3",
        "title": "Nivel 3 · Sintaxis Básica, Variables & print()",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-3-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Sintaxis Básica, Variables & print():",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Sintaxis Básica, Variables & print()"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-4",
        "title": "Nivel 4 · Sintaxis Básica, Variables & print()",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-4-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Sintaxis Básica, Variables & print()"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-5",
        "title": "Nivel 5 · Sintaxis Básica, Variables & print()",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-5-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Sintaxis Básica, Variables & print() en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Sintaxis Básica, Variables & print() de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-6",
        "title": "Nivel 6 · Sintaxis Básica, Variables & print()",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-6-e1",
            "type": "story",
            "prompt": "Lección Guiada: Sintaxis Básica, Variables & print() con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 6.",
            "data": {
              "slides": [
                {
                  "title": "Python: Conceptos Clave del Nivel 6",
                  "text": "En esta lección de Python, exploraremos Sintaxis Básica, Variables & print(). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Python asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Sintaxis Básica, Variables & print() es un pilar clave en la ruta de Python."
          }
        ]
      },
      {
        "id": "py-7",
        "title": "Nivel 7 · Sintaxis Básica, Variables & print()",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-7-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Sintaxis Básica, Variables & print() en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Sintaxis Básica, Variables & print() de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-8",
        "title": "Nivel 8 · Sintaxis Básica, Variables & print()",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-8-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Sintaxis Básica, Variables & print()"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-9",
        "title": "Nivel 9 · Sintaxis Básica, Variables & print()",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-9-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Sintaxis Básica, Variables & print():",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Sintaxis Básica, Variables & print()"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-10",
        "title": "Nivel 10 · Punto de Control 1 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "py-10-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Sintaxis Básica, Variables & print()"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-11",
        "title": "Nivel 11 · Control de Flujo (if, elif, else)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-11-e1",
            "type": "story",
            "prompt": "Lección Guiada: Control de Flujo (if, elif, else) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 11.",
            "data": {
              "slides": [
                {
                  "title": "Python: Conceptos Clave del Nivel 11",
                  "text": "En esta lección de Python, exploraremos Control de Flujo (if, elif, else). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Python asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Control de Flujo (if, elif, else) es un pilar clave en la ruta de Python."
          }
        ]
      },
      {
        "id": "py-12",
        "title": "Nivel 12 · Control de Flujo (if, elif, else)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-12-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Control de Flujo (if, elif, else):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Control de Flujo (if, elif, else)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-13",
        "title": "Nivel 13 · Control de Flujo (if, elif, else)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-13-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Control de Flujo (if, elif, else) en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Control de Flujo (if, elif, else) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-14",
        "title": "Nivel 14 · Control de Flujo (if, elif, else)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-14-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Control de Flujo (if, elif, else)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-15",
        "title": "Nivel 15 · Control de Flujo (if, elif, else)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-15-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Control de Flujo (if, elif, else):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Control de Flujo (if, elif, else)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-16",
        "title": "Nivel 16 · Control de Flujo (if, elif, else)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-16-e1",
            "type": "story",
            "prompt": "Lección Guiada: Control de Flujo (if, elif, else) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 16.",
            "data": {
              "slides": [
                {
                  "title": "Python: Conceptos Clave del Nivel 16",
                  "text": "En esta lección de Python, exploraremos Control de Flujo (if, elif, else). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Python asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Control de Flujo (if, elif, else) es un pilar clave en la ruta de Python."
          }
        ]
      },
      {
        "id": "py-17",
        "title": "Nivel 17 · Control de Flujo (if, elif, else)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-17-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Control de Flujo (if, elif, else) en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Control de Flujo (if, elif, else) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-18",
        "title": "Nivel 18 · Control de Flujo (if, elif, else)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-18-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Control de Flujo (if, elif, else):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Control de Flujo (if, elif, else)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-19",
        "title": "Nivel 19 · Control de Flujo (if, elif, else)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-19-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Control de Flujo (if, elif, else) en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Control de Flujo (if, elif, else) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-20",
        "title": "Nivel 20 · Punto de Control 2 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "py-20-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Control de Flujo (if, elif, else)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-21",
        "title": "Nivel 21 · Listas, Métodos & Slicing",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-21-e1",
            "type": "story",
            "prompt": "Lección Guiada: Listas, Métodos & Slicing con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 21.",
            "data": {
              "slides": [
                {
                  "title": "Python: Conceptos Clave del Nivel 21",
                  "text": "En esta lección de Python, exploraremos Listas, Métodos & Slicing. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Python asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Listas, Métodos & Slicing es un pilar clave en la ruta de Python."
          }
        ]
      },
      {
        "id": "py-22",
        "title": "Nivel 22 · Listas, Métodos & Slicing",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-22-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Listas, Métodos & Slicing"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-23",
        "title": "Nivel 23 · Listas, Métodos & Slicing",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-23-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Listas, Métodos & Slicing en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Listas, Métodos & Slicing de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-24",
        "title": "Nivel 24 · Listas, Métodos & Slicing",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-24-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Listas, Métodos & Slicing:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Listas, Métodos & Slicing"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-25",
        "title": "Nivel 25 · Listas, Métodos & Slicing",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-25-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Listas, Métodos & Slicing en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Listas, Métodos & Slicing de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-26",
        "title": "Nivel 26 · Listas, Métodos & Slicing",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-26-e1",
            "type": "story",
            "prompt": "Lección Guiada: Listas, Métodos & Slicing con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 26.",
            "data": {
              "slides": [
                {
                  "title": "Python: Conceptos Clave del Nivel 26",
                  "text": "En esta lección de Python, exploraremos Listas, Métodos & Slicing. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Python asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Listas, Métodos & Slicing es un pilar clave en la ruta de Python."
          }
        ]
      },
      {
        "id": "py-27",
        "title": "Nivel 27 · Listas, Métodos & Slicing",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-27-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Listas, Métodos & Slicing:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Listas, Métodos & Slicing"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-28",
        "title": "Nivel 28 · Listas, Métodos & Slicing",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-28-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Listas, Métodos & Slicing"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-29",
        "title": "Nivel 29 · Listas, Métodos & Slicing",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-29-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Listas, Métodos & Slicing en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Listas, Métodos & Slicing de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-30",
        "title": "Nivel 30 · Punto de Control 3 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "py-30-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Listas, Métodos & Slicing:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Listas, Métodos & Slicing"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-31",
        "title": "Nivel 31 · Tuplas, Diccionarios & Sets",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-31-e1",
            "type": "story",
            "prompt": "Lección Guiada: Tuplas, Diccionarios & Sets con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 31.",
            "data": {
              "slides": [
                {
                  "title": "Python: Conceptos Clave del Nivel 31",
                  "text": "En esta lección de Python, exploraremos Tuplas, Diccionarios & Sets. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Python asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Tuplas, Diccionarios & Sets es un pilar clave en la ruta de Python."
          }
        ]
      },
      {
        "id": "py-32",
        "title": "Nivel 32 · Tuplas, Diccionarios & Sets",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-32-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Tuplas, Diccionarios & Sets"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-33",
        "title": "Nivel 33 · Tuplas, Diccionarios & Sets",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-33-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Tuplas, Diccionarios & Sets:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Tuplas, Diccionarios & Sets"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-34",
        "title": "Nivel 34 · Tuplas, Diccionarios & Sets",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-34-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Tuplas, Diccionarios & Sets"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-35",
        "title": "Nivel 35 · Tuplas, Diccionarios & Sets",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-35-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Tuplas, Diccionarios & Sets en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Tuplas, Diccionarios & Sets de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-36",
        "title": "Nivel 36 · Tuplas, Diccionarios & Sets",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-36-e1",
            "type": "story",
            "prompt": "Lección Guiada: Tuplas, Diccionarios & Sets con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 36.",
            "data": {
              "slides": [
                {
                  "title": "Python: Conceptos Clave del Nivel 36",
                  "text": "En esta lección de Python, exploraremos Tuplas, Diccionarios & Sets. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Python asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Tuplas, Diccionarios & Sets es un pilar clave en la ruta de Python."
          }
        ]
      },
      {
        "id": "py-37",
        "title": "Nivel 37 · Tuplas, Diccionarios & Sets",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-37-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Tuplas, Diccionarios & Sets en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Tuplas, Diccionarios & Sets de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-38",
        "title": "Nivel 38 · Tuplas, Diccionarios & Sets",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-38-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Tuplas, Diccionarios & Sets"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-39",
        "title": "Nivel 39 · Tuplas, Diccionarios & Sets",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-39-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Tuplas, Diccionarios & Sets:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Tuplas, Diccionarios & Sets"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-40",
        "title": "Nivel 40 · Punto de Control 4 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "py-40-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Tuplas, Diccionarios & Sets"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-41",
        "title": "Nivel 41 · Bucles for, while, range & enumerate",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-41-e1",
            "type": "story",
            "prompt": "Lección Guiada: Bucles for, while, range & enumerate con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 41.",
            "data": {
              "slides": [
                {
                  "title": "Python: Conceptos Clave del Nivel 41",
                  "text": "En esta lección de Python, exploraremos Bucles for, while, range & enumerate. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Python asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Bucles for, while, range & enumerate es un pilar clave en la ruta de Python."
          }
        ]
      },
      {
        "id": "py-42",
        "title": "Nivel 42 · Bucles for, while, range & enumerate",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-42-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Bucles for, while, range & enumerate:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Bucles for, while, range & enumerate"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-43",
        "title": "Nivel 43 · Bucles for, while, range & enumerate",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-43-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Bucles for, while, range & enumerate en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Bucles for, while, range & enumerate de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-44",
        "title": "Nivel 44 · Bucles for, while, range & enumerate",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-44-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Bucles for, while, range & enumerate"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "py-45",
        "title": "Nivel 45 · Bucles for, while, range & enumerate",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-45-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Bucles for, while, range & enumerate:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Bucles for, while, range & enumerate"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-46",
        "title": "Nivel 46 · Bucles for, while, range & enumerate",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-46-e1",
            "type": "story",
            "prompt": "Lección Guiada: Bucles for, while, range & enumerate con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 46.",
            "data": {
              "slides": [
                {
                  "title": "Python: Conceptos Clave del Nivel 46",
                  "text": "En esta lección de Python, exploraremos Bucles for, while, range & enumerate. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Python asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Bucles for, while, range & enumerate es un pilar clave en la ruta de Python."
          }
        ]
      },
      {
        "id": "py-47",
        "title": "Nivel 47 · Bucles for, while, range & enumerate",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-47-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Bucles for, while, range & enumerate en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Bucles for, while, range & enumerate de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-48",
        "title": "Nivel 48 · Bucles for, while, range & enumerate",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-48-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Bucles for, while, range & enumerate:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Python"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Bucles for, while, range & enumerate"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "py-49",
        "title": "Nivel 49 · Bucles for, while, range & enumerate",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "py-49-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Bucles for, while, range & enumerate en Python?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Bucles for, while, range & enumerate de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Python."
          }
        ]
      },
      {
        "id": "py-50",
        "title": "Nivel 50 · Punto de Control 5 & Trofeo",
        "kind": "checkpoint",
        "xp": 40,
        "exercises": [
          {
            "id": "py-50-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Python con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Python Componente A"
                },
                {
                  "id": "L2",
                  "text": "Python Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Bucles for, while, range & enumerate"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Python optimiza tu aprendizaje."
          }
        ]
      }
    ]
  },
  {
    "id": "excel",
    "slug": "excel",
    "title": "Excel Avanzado",
    "description": "Fórmulas, tablas dinámicas y dashboards.",
    "icon": "FileSpreadsheet",
    "accentColor": "#10B981",
    "emoji": "📈",
    "levels": [
      {
        "id": "x-1",
        "title": "Nivel 1 · Atajos & Referencias Absolutas ($A$1)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-1-e1",
            "type": "story",
            "prompt": "Lección Guiada: Atajos & Referencias Absolutas ($A$1) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 1.",
            "data": {
              "slides": [
                {
                  "title": "Excel Avanzado: Conceptos Clave del Nivel 1",
                  "text": "En esta lección de Excel Avanzado, exploraremos Atajos & Referencias Absolutas ($A$1). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Excel Avanzado asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Atajos & Referencias Absolutas ($A$1) es un pilar clave en la ruta de Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-2",
        "title": "Nivel 2 · Atajos & Referencias Absolutas ($A$1)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-2-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Atajos & Referencias Absolutas ($A$1)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-3",
        "title": "Nivel 3 · Atajos & Referencias Absolutas ($A$1)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-3-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Atajos & Referencias Absolutas ($A$1):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Atajos & Referencias Absolutas ($A$1)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-4",
        "title": "Nivel 4 · Atajos & Referencias Absolutas ($A$1)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-4-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Atajos & Referencias Absolutas ($A$1)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-5",
        "title": "Nivel 5 · Atajos & Referencias Absolutas ($A$1)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-5-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Atajos & Referencias Absolutas ($A$1) en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Atajos & Referencias Absolutas ($A$1) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-6",
        "title": "Nivel 6 · Atajos & Referencias Absolutas ($A$1)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-6-e1",
            "type": "story",
            "prompt": "Lección Guiada: Atajos & Referencias Absolutas ($A$1) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 6.",
            "data": {
              "slides": [
                {
                  "title": "Excel Avanzado: Conceptos Clave del Nivel 6",
                  "text": "En esta lección de Excel Avanzado, exploraremos Atajos & Referencias Absolutas ($A$1). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Excel Avanzado asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Atajos & Referencias Absolutas ($A$1) es un pilar clave en la ruta de Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-7",
        "title": "Nivel 7 · Atajos & Referencias Absolutas ($A$1)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-7-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Atajos & Referencias Absolutas ($A$1) en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Atajos & Referencias Absolutas ($A$1) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-8",
        "title": "Nivel 8 · Atajos & Referencias Absolutas ($A$1)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-8-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Atajos & Referencias Absolutas ($A$1)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-9",
        "title": "Nivel 9 · Atajos & Referencias Absolutas ($A$1)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-9-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Atajos & Referencias Absolutas ($A$1):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Atajos & Referencias Absolutas ($A$1)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-10",
        "title": "Nivel 10 · Punto de Control 1 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "x-10-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Atajos & Referencias Absolutas ($A$1)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-11",
        "title": "Nivel 11 · Funciones Lógicas (SI, Y, O, SI.CONJUNTO)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-11-e1",
            "type": "story",
            "prompt": "Lección Guiada: Funciones Lógicas (SI, Y, O, SI.CONJUNTO) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 11.",
            "data": {
              "slides": [
                {
                  "title": "Excel Avanzado: Conceptos Clave del Nivel 11",
                  "text": "En esta lección de Excel Avanzado, exploraremos Funciones Lógicas (SI, Y, O, SI.CONJUNTO). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Excel Avanzado asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Funciones Lógicas (SI, Y, O, SI.CONJUNTO) es un pilar clave en la ruta de Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-12",
        "title": "Nivel 12 · Funciones Lógicas (SI, Y, O, SI.CONJUNTO)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-12-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Funciones Lógicas (SI, Y, O, SI.CONJUNTO):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Funciones Lógicas (SI, Y, O, SI.CONJUNTO)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-13",
        "title": "Nivel 13 · Funciones Lógicas (SI, Y, O, SI.CONJUNTO)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-13-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Funciones Lógicas (SI, Y, O, SI.CONJUNTO) en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Funciones Lógicas (SI, Y, O, SI.CONJUNTO) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-14",
        "title": "Nivel 14 · Funciones Lógicas (SI, Y, O, SI.CONJUNTO)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-14-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Funciones Lógicas (SI, Y, O, SI.CONJUNTO)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-15",
        "title": "Nivel 15 · Funciones Lógicas (SI, Y, O, SI.CONJUNTO)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-15-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Funciones Lógicas (SI, Y, O, SI.CONJUNTO):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Funciones Lógicas (SI, Y, O, SI.CONJUNTO)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-16",
        "title": "Nivel 16 · Funciones Lógicas (SI, Y, O, SI.CONJUNTO)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-16-e1",
            "type": "story",
            "prompt": "Lección Guiada: Funciones Lógicas (SI, Y, O, SI.CONJUNTO) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 16.",
            "data": {
              "slides": [
                {
                  "title": "Excel Avanzado: Conceptos Clave del Nivel 16",
                  "text": "En esta lección de Excel Avanzado, exploraremos Funciones Lógicas (SI, Y, O, SI.CONJUNTO). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Excel Avanzado asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Funciones Lógicas (SI, Y, O, SI.CONJUNTO) es un pilar clave en la ruta de Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-17",
        "title": "Nivel 17 · Funciones Lógicas (SI, Y, O, SI.CONJUNTO)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-17-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Funciones Lógicas (SI, Y, O, SI.CONJUNTO) en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Funciones Lógicas (SI, Y, O, SI.CONJUNTO) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-18",
        "title": "Nivel 18 · Funciones Lógicas (SI, Y, O, SI.CONJUNTO)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-18-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Funciones Lógicas (SI, Y, O, SI.CONJUNTO):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Funciones Lógicas (SI, Y, O, SI.CONJUNTO)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-19",
        "title": "Nivel 19 · Funciones Lógicas (SI, Y, O, SI.CONJUNTO)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-19-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Funciones Lógicas (SI, Y, O, SI.CONJUNTO) en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Funciones Lógicas (SI, Y, O, SI.CONJUNTO) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-20",
        "title": "Nivel 20 · Punto de Control 2 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "x-20-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Funciones Lógicas (SI, Y, O, SI.CONJUNTO)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-21",
        "title": "Nivel 21 · Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-21-e1",
            "type": "story",
            "prompt": "Lección Guiada: Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 21.",
            "data": {
              "slides": [
                {
                  "title": "Excel Avanzado: Conceptos Clave del Nivel 21",
                  "text": "En esta lección de Excel Avanzado, exploraremos Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Excel Avanzado asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR) es un pilar clave en la ruta de Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-22",
        "title": "Nivel 22 · Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-22-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-23",
        "title": "Nivel 23 · Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-23-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR) en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-24",
        "title": "Nivel 24 · Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-24-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-25",
        "title": "Nivel 25 · Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-25-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR) en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-26",
        "title": "Nivel 26 · Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-26-e1",
            "type": "story",
            "prompt": "Lección Guiada: Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 26.",
            "data": {
              "slides": [
                {
                  "title": "Excel Avanzado: Conceptos Clave del Nivel 26",
                  "text": "En esta lección de Excel Avanzado, exploraremos Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Excel Avanzado asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR) es un pilar clave en la ruta de Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-27",
        "title": "Nivel 27 · Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-27-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-28",
        "title": "Nivel 28 · Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-28-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-29",
        "title": "Nivel 29 · Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-29-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR) en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-30",
        "title": "Nivel 30 · Punto de Control 3 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "x-30-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de Búsquedas Clásicas (BUSCARV, INDICE/COINCIDIR)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-31",
        "title": "Nivel 31 · La Era de BUSCARX (XLOOKUP)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-31-e1",
            "type": "story",
            "prompt": "Lección Guiada: La Era de BUSCARX (XLOOKUP) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 31.",
            "data": {
              "slides": [
                {
                  "title": "Excel Avanzado: Conceptos Clave del Nivel 31",
                  "text": "En esta lección de Excel Avanzado, exploraremos La Era de BUSCARX (XLOOKUP). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Excel Avanzado asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar La Era de BUSCARX (XLOOKUP) es un pilar clave en la ruta de Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-32",
        "title": "Nivel 32 · La Era de BUSCARX (XLOOKUP)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-32-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de La Era de BUSCARX (XLOOKUP)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-33",
        "title": "Nivel 33 · La Era de BUSCARX (XLOOKUP)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-33-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para La Era de BUSCARX (XLOOKUP):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de La Era de BUSCARX (XLOOKUP)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-34",
        "title": "Nivel 34 · La Era de BUSCARX (XLOOKUP)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-34-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de La Era de BUSCARX (XLOOKUP)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-35",
        "title": "Nivel 35 · La Era de BUSCARX (XLOOKUP)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-35-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con La Era de BUSCARX (XLOOKUP) en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar La Era de BUSCARX (XLOOKUP) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-36",
        "title": "Nivel 36 · La Era de BUSCARX (XLOOKUP)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-36-e1",
            "type": "story",
            "prompt": "Lección Guiada: La Era de BUSCARX (XLOOKUP) con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 36.",
            "data": {
              "slides": [
                {
                  "title": "Excel Avanzado: Conceptos Clave del Nivel 36",
                  "text": "En esta lección de Excel Avanzado, exploraremos La Era de BUSCARX (XLOOKUP). Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Excel Avanzado asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar La Era de BUSCARX (XLOOKUP) es un pilar clave en la ruta de Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-37",
        "title": "Nivel 37 · La Era de BUSCARX (XLOOKUP)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-37-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con La Era de BUSCARX (XLOOKUP) en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar La Era de BUSCARX (XLOOKUP) de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-38",
        "title": "Nivel 38 · La Era de BUSCARX (XLOOKUP)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-38-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de La Era de BUSCARX (XLOOKUP)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-39",
        "title": "Nivel 39 · La Era de BUSCARX (XLOOKUP)",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-39-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para La Era de BUSCARX (XLOOKUP):",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de La Era de BUSCARX (XLOOKUP)"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-40",
        "title": "Nivel 40 · Punto de Control 4 & Trofeo",
        "kind": "checkpoint",
        "xp": 30,
        "exercises": [
          {
            "id": "x-40-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de La Era de BUSCARX (XLOOKUP)"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-41",
        "title": "Nivel 41 · SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-41-e1",
            "type": "story",
            "prompt": "Lección Guiada: SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 41.",
            "data": {
              "slides": [
                {
                  "title": "Excel Avanzado: Conceptos Clave del Nivel 41",
                  "text": "En esta lección de Excel Avanzado, exploraremos SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Excel Avanzado asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO es un pilar clave en la ruta de Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-42",
        "title": "Nivel 42 · SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-42-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-43",
        "title": "Nivel 43 · SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-43-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-44",
        "title": "Nivel 44 · SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-44-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      },
      {
        "id": "x-45",
        "title": "Nivel 45 · SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-45-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-46",
        "title": "Nivel 46 · SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-46-e1",
            "type": "story",
            "prompt": "Lección Guiada: SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO con Bit 🦝",
            "hint": "Aprende los conceptos esenciales del Nivel 46.",
            "data": {
              "slides": [
                {
                  "title": "Excel Avanzado: Conceptos Clave del Nivel 46",
                  "text": "En esta lección de Excel Avanzado, exploraremos SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO. Esta habilidad es fundamental para análisis en proyectos reales.",
                  "highlightText": "Regla de Oro: La práctica constante en Excel Avanzado asegura la maestría técnica."
                }
              ]
            },
            "explanation": "Dominar SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO es un pilar clave en la ruta de Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-47",
        "title": "Nivel 47 · SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-47-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-48",
        "title": "Nivel 48 · SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-48-e1",
            "type": "arrange",
            "prompt": "Ordena la secuencia correcta para SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO:",
            "hint": "Organiza las instrucciones en su orden lógico.",
            "data": {
              "tokens": [
                {
                  "id": "t1",
                  "text": "1. Inicializar Excel Avanzado"
                },
                {
                  "id": "t2",
                  "text": "2. Aplicar lógica de SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO"
                },
                {
                  "id": "t3",
                  "text": "3. Obtener resultado validado"
                }
              ],
              "correctOrder": [
                "t1",
                "t2",
                "t3"
              ]
            },
            "explanation": "Ese es el flujo de trabajo recomendado."
          }
        ]
      },
      {
        "id": "x-49",
        "title": "Nivel 49 · SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO",
        "kind": "lesson",
        "xp": 15,
        "exercises": [
          {
            "id": "x-49-e1",
            "type": "multiple-choice",
            "prompt": "¿Cuál es el objetivo principal al trabajar con SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO en Excel Avanzado?",
            "hint": "Elige la respuesta más completa y acertada.",
            "data": {
              "options": [
                "Optimizar y estructurar SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO de forma profesional",
                "Generar archivos temporales no usados",
                "Duplicar datos sin control",
                "Ninguna de las anteriores"
              ],
              "correctIndex": 0
            },
            "explanation": "La opción 1 refleja las mejores prácticas en Excel Avanzado."
          }
        ]
      },
      {
        "id": "x-50",
        "title": "Nivel 50 · Punto de Control 5 & Trofeo",
        "kind": "checkpoint",
        "xp": 40,
        "exercises": [
          {
            "id": "x-50-e1",
            "type": "match-pairs",
            "prompt": "Empareja cada concepto de Excel Avanzado con su definición:",
            "hint": "Relaciona la columna de la izquierda con la derecha.",
            "data": {
              "left": [
                {
                  "id": "L1",
                  "text": "Excel Avanzado Componente A"
                },
                {
                  "id": "L2",
                  "text": "Excel Avanzado Componente B"
                }
              ],
              "right": [
                {
                  "id": "R1",
                  "text": "Procesamiento de SUMAR.SI.CONJUNTO & CONTAR.SI.CONJUNTO"
                },
                {
                  "id": "R2",
                  "text": "Resultado optimizado"
                }
              ],
              "correctPairs": [
                {
                  "left": "L1",
                  "right": "R1"
                },
                {
                  "left": "L2",
                  "right": "R2"
                }
              ]
            },
            "explanation": "Identificar estos componentes en Excel Avanzado optimiza tu aprendizaje."
          }
        ]
      }
    ]
  }
];

// Helper: obtener un Unit por slug.
export function getUnitBySlug(slug: string): Unit | undefined {
  return PRACTICE_UNITS.find((u) => u.slug === slug);
}
