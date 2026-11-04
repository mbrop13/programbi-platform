---
slug: curso-analisis-de-datos-costa-rica
ruta_sugerida: /cr/guias/curso-analisis-de-datos-costa-rica
pais: cr
hreflang: es-CR
curso: analisis-de-datos
url_curso: https://www.programbi.com/cr/cursos/analisis-de-datos
title: "Curso de Análisis de datos en Costa Rica | ProgramBI"
meta: "Curso de análisis de datos en Costa Rica en vivo: SQL Server, Power BI y Python, 60 h por nivel. Inicio 23 de noviembre, 16:30 hora de Costa Rica."
h1: "Curso de Análisis de datos en Costa Rica: SQL Server, Power BI y Python en una sola ruta"
updated: 2026-11-04
sources:
  - https://www.programbi.com/cr/cursos/analisis-de-datos
nota_hermes: |
  ELEMENTO VISUAL: matriz «Antes y después» (tarea → antes → después del nivel básico-intermedio).
  Intención: "curso análisis de datos costa rica", "analista de datos costa rica" (transaccional + informacional) → click_registro en /cr/cursos/analisis-de-datos. country=cr, course=analisis-de-datos.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave analisis-de-datos × cr. Manu aún no define el monto: NO escribas cifras. La ficha /cr/ hoy muestra un monto en USD «Se cobra en CLP» que no está aprobado: no copiarlo. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: ficha /cr/cursos/analisis-de-datos (4 nov 2026): inicio lunes 23 nov 2026, lunes y miércoles 16:30 a 18:30, hora de Costa Rica (UTC-6). Si cambia, actualizar.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Análisis de datos para Costa Rica en programbi.com y quiero info del curso en vivo".
---

# Curso de Análisis de datos en Costa Rica: SQL Server, Power BI y Python en una sola ruta

**Respuesta directa:** el [curso de Análisis de datos de ProgramBI para Costa Rica](https://www.programbi.com/cr/cursos/analisis-de-datos) es un programa **en vivo por Zoom de 60 horas por nivel**, dividido en **20 horas de SQL Server, 20 de Power BI y 20 de Python**, para quienes desean asumir funciones de analista: extraer información de bases de datos, construir modelos y tableros, y explorar datos con código. El nivel básico-intermedio inicia el **lunes 23 de noviembre de 2026**, con sesiones **lunes y miércoles de 16:30 a 18:30, hora de Costa Rica**. Precio: **{precio_local}**.

La ficha ofrece dos niveles de 60 horas —básico-intermedio y avanzado—, grabaciones con acceso de por vida, certificado digital y un proyecto final con datos reales. En cada módulo se incorpora inteligencia artificial para generar y revisar consultas, medidas y scripts. Información verificada en la ficha el 4 de noviembre de 2026.

**[CTA-TOP]** — Inicio 23 de noviembre · 16:30 hora de Costa Rica · «Ver el curso».

## ¿Qué distingue a un analista de datos?

No es quien conoce más fórmulas, sino quien convierte datos dispersos en respuestas confiables. En una organización costarricense típica, la información vive en el ERP, en hojas de Excel de cada departamento y en sistemas especializados. El analista sabe consultarlos, unirlos y presentarlos de forma que la gerencia pueda decidir. Para eso necesita dominar tres capas:

- **La capa de datos**, con SQL: saber qué tablas existen, cómo se relacionan y cómo pedir exactamente lo necesario.
- **La capa de negocio**, con Power BI: un modelo con medidas que reflejen cómo la empresa mide su desempeño, y tableros claros.
- **La capa de exploración**, con Python: limpiar, combinar y analizar volúmenes o estructuras que superan a Excel.

Según la ficha, el programa es adecuado para **perfiles administrativos, financieros, comerciales, ingenieros y analistas que buscan dominar el ciclo completo del dato**.

## Contenido del nivel básico-intermedio

**SQL Server (20 horas) — consultas y agregaciones.** Recuperación de datos con SELECT, TOP y la cláusula WHERE; operadores lógicos AND y OR; funciones de fecha MONTH y YEAR; cruce de tablas con INNER, LEFT, RIGHT y FULL JOIN; GROUP BY, HAVING y funciones de agregación con ORDER BY; vistas de valorización y consolidados departamentales; uso de IA para generar y revisar consultas a la medida.

**Power BI (20 horas) — tableros y DAX inicial.** Entorno, instalaciones y cuentas; Power Query para importar desde Excel, SQL y APIs; limpieza básica, cálculos y columnas personalizadas; visualizaciones de barras, líneas, mapas y KPIs; Unpivot Columns y títulos dinámicos con SELECTEDVALUE; publicación en línea con roles y seguridad organizacional; IA en el informe con Q&A en lenguaje natural y Smart Narratives.

**Python (20 horas) — Pandas y visualización.** Variables, tipos de datos, control de flujo y estructuras como listas, tuplas y diccionarios; DataFrames desde Excel y exploración tabular; groupby con agregaciones múltiples; limpieza de columnas, tipos y fechas de transacciones; Matplotlib y Seaborn para reportes de complejidad media; IA para generar scripts de análisis y automatizar reportes.

## Matriz de habilidades: antes y después

| Tarea | Antes del curso | Después del nivel básico-intermedio |
|---|---|---|
| Obtener ventas del trimestre | Pedirle un export a TI y esperar | Escribir la consulta SQL usted mismo |
| Unir clientes con facturas | BUSCARV en una hoja enorme | JOIN en SQL o relación en Power BI |
| Reporte mensual a gerencia | Copiar, pegar y formatear cada mes | Tablero que se actualiza solo |
| Revisar datos con errores | Filtrar a mano | Script de Pandas que detecta y corrige |
| Explicar una caída en ventas | Intuición | Análisis con evidencia y gráficos |

## Un ejemplo de la vida real

Una empresa de distribución con bodegas en Alajuela y Cartago quiere entender por qué aumentan las devoluciones. El analista:

1. **Consulta en SQL** las devoluciones unidas a pedidos, productos y clientes, agrupadas por mes, motivo y bodega.
2. **Construye en Power BI** un tablero con la tasa de devolución por bodega y por categoría, con tendencia mensual y filtro por cliente.
3. **Explora en Python** el detalle de los pedidos devueltos para ver si hay patrones en fechas de entrega o en tipos de producto, y lo grafica con Seaborn.
4. **Presenta** dos causas principales y una recomendación concreta para la jefatura de logística.

Este flujo resume lo que se practica en el programa y es un buen modelo para el proyecto final.

## Mini ejemplo de medida DAX

```dax
Tasa de Devolución =
DIVIDE ( SUM ( Devoluciones[Unidades] ), SUM ( Ventas[Unidades] ) )
```

La misma medida responde por bodega, por categoría o por mes, según el filtro que se aplique en el tablero.

## ¿Con qué nivel empezar?

El **básico-intermedio** está diseñado para instalar bases sólidas en las tres herramientas: consultas, primeros tableros y análisis tabular en Python. El **avanzado**, también de 60 horas, es para quienes ya manejan esos fundamentos. Si usted no ha escrito consultas SQL antes, conviene iniciar por el primero.

## Cómo elegir el tema de su proyecto final

El programa cierra con un **proyecto con datos reales**, y elegir bien el tema facilita todo lo demás. Tres criterios ayudan:

1. **Que usted conozca el negocio.** Si trabaja en finanzas, un análisis de gastos o de cuentas por cobrar le permitirá hacer mejores preguntas que un tema ajeno.
2. **Que haya datos suficientes.** Al menos varios meses de historia y más de una tabla, para practicar relaciones y consultas con JOIN.
3. **Que responda una pregunta concreta.** "¿Qué clientes explican la caída del margen?" funciona mejor que "analizar las ventas".

Algunas ideas que suelen funcionar: rotación de inventario por bodega, puntualidad de pagos de clientes, tiempos de atención en un centro de servicio, ausentismo por departamento o rentabilidad por línea de producto. Si sus datos de trabajo son confidenciales, puede usar conjuntos públicos con estructura similar.

Un buen proyecto incluye las tres piezas: la consulta SQL que prepara los datos, el tablero de Power BI con sus medidas y un notebook de Python con el análisis exploratorio. Acompáñelo de una página que explique la pregunta, el método y la conclusión. Eso es exactamente lo que se espera de un analista en una entrevista o en una presentación interna.

## Recomendaciones para aprovechar el programa

- **Reserve tiempo fijo** después de cada sesión para practicar, aunque sean treinta minutos.
- **Use datos de su trabajo,** eliminando información confidencial o personal.
- **Documente sus consultas y medidas:** qué hacen y de dónde salen los datos.
- **Revise lo que propone la IA:** es un apoyo valioso, pero la responsabilidad del resultado es suya.
- **Aproveche las grabaciones** para repasar los temas más técnicos.

## Errores frecuentes

- Comenzar por Python sin entender bases de datos ni relaciones.
- Construir tableros sin acordar antes las definiciones de cada indicador.
- No validar los resultados contra la fuente original.
- Sobrecargar los informes con visualizaciones innecesarias.
- Copiar código sin comprenderlo.

## Rutas relacionadas

- Para enfocarse solo en tableros: [guía para aprender Power BI en Costa Rica](/cr/guias/como-aprender-power-bi-en-costa-rica) y [curso de Power BI](https://www.programbi.com/cr/cursos/power-bi).
- Para bases de datos: [curso de SQL Server](https://www.programbi.com/cr/cursos/sql-server).
- Para programación aplicada: [curso de Python](https://www.programbi.com/cr/cursos/python).

## Datos del curso

- **Inicio:** lunes 23 de noviembre de 2026.
- **Días y horario:** lunes y miércoles, 16:30 a 18:30, hora de Costa Rica.
- **Duración:** 60 horas por nivel (20 por herramienta).
- **Modalidad:** en vivo por Zoom; grabaciones de por vida.
- **Certificado:** digital, al finalizar.
- **Instructor:** Manuel Oliva, Magíster en Data Science (UAI); según la ficha, ha liderado capacitaciones en AngloAmerican, CAP, Deloitte y SQM.
- **Precio:** {precio_local}. Puedes pagar en 3 cuotas sin interés.

**[CTA-MID]** — Descargue el temario completo.

**[CTA-END]** — {precio_local} · Inicio 23 de noviembre · «Inscribirme» · «Escribir por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Análisis de datos en Costa Rica?**
{precio_local}. Escríbanos por WhatsApp para confirmar monto y forma de pago.

**¿Cuánto dura el programa?**
60 horas por nivel: 20 de SQL Server, 20 de Power BI y 20 de Python.

**¿Cuándo inicia?**
El lunes 23 de noviembre de 2026; lunes y miércoles de 16:30 a 18:30, hora de Costa Rica.

**¿Necesito conocimientos de programación?**
No. El nivel básico-intermedio parte de cero en cada herramienta.

**¿Qué ocurre si no puedo asistir a una sesión?**
Queda grabada en el campus con acceso de por vida, para que se ponga al día antes de la siguiente.

**¿Puedo llevar solo una herramienta?**
Sí. Los cursos de SQL Server, Power BI y Python existen por separado; este programa los integra con un proyecto común.

**¿Sirve si trabajo en un centro de servicios o en una multinacional?**
Sí. SQL, Power BI y Python son herramientas comunes en equipos de finanzas, operaciones y reportería, y lo aprendido se aplica tanto en español como en entornos donde se trabaja en inglés.

**¿Qué recibo al terminar?**
Certificado digital de ProgramBI y acceso de por vida a las grabaciones.
