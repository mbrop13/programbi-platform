---
slug: curso-analisis-de-datos-guatemala
ruta_sugerida: /gt/guias/curso-analisis-de-datos-guatemala
pais: gt
hreflang: es-GT
curso: analisis-de-datos
url_curso: https://www.programbi.com/gt/cursos/analisis-de-datos
title: "Curso de Análisis de datos en Guatemala | ProgramBI"
meta: "Curso de análisis de datos en Guatemala en vivo: SQL Server, Power BI y Python, 60 h por nivel. Horario 16:30 Guatemala y cupos abiertos."
h1: "Curso de Análisis de datos en Guatemala: SQL, Power BI y Python para dar el salto a analista"
updated: 2026-11-14
sources:
  - https://www.programbi.com/gt/cursos/analisis-de-datos
nota_hermes: |
  ELEMENTO VISUAL: bloque «Tres preguntas para saber si este curso es para ti» + caso «clientes en riesgo» en 4 pasos.
  Intención: "curso análisis de datos guatemala", "analista de datos guatemala" (transaccional + informacional) → click_registro en /gt/cursos/analisis-de-datos. country=gt, course=analisis-de-datos.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave analisis-de-datos × gt. Manu aún no define el monto: NO escribas cifras. La ficha /gt/ hoy muestra un monto en USD «Se cobra en CLP» que no está aprobado: no copiarlo. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: ficha /gt/cursos/analisis-de-datos (4 nov 2026): inicio lunes 23 nov 2026, lunes y miércoles 16:30 a 18:30, hora de Guatemala (UTC-6). Si cambia, actualizar.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Análisis de datos para Guatemala en programbi.com y quiero info del curso en vivo".
---

# Curso de Análisis de datos en Guatemala: SQL, Power BI y Python para dar el salto a analista

**En pocas palabras:** el [curso de Análisis de datos de ProgramBI para Guatemala](https://www.programbi.com/gt/cursos/analisis-de-datos) es un programa **en vivo por Zoom de 60 horas por nivel**, con **20 horas de SQL Server, 20 de Power BI y 20 de Python**, para aprender a sacar datos de una base, convertirlos en tableros y analizarlos con código. El nivel básico-intermedio ofrece **nuevas cohortes mensuales** (fecha publicada en la ficha), con clases **lunes y miércoles de 16:30 a 18:30, hora de Guatemala**. Precio: **{precio_local}**.

En la misma ficha hay dos niveles de 60 horas —básico-intermedio y avanzado—, y el programa incluye grabaciones de por vida, certificado digital, proyecto final con datos reales e inteligencia artificial como apoyo en cada módulo. Información de la ficha revisada el 4 de noviembre de 2026.

**[CTA-TOP]** — Cohortes cada mes · 16:30 hora de Guatemala · «Ver el curso».

## Tres preguntas para saber si este curso es para ti

**¿Pasas buena parte de tu semana armando reportes en Excel?** Si la respuesta es sí, el curso te enseña a automatizar ese trabajo con SQL y Power BI.

**¿Dependes de que alguien de sistemas te pase los datos?** Con SQL aprendes a consultarlos directamente, con los permisos adecuados.

**¿Sientes que Excel se queda corto?** Con Python y Pandas manejas volúmenes y transformaciones que en una hoja de cálculo se vuelven lentas.

La ficha recomienda el programa para **perfiles administrativos, financieros, comerciales, ingenieros y analistas que buscan dominar el ciclo completo del dato**, desde principiantes hasta quienes buscan análisis predictivo y automatización avanzada.

## El temario del nivel básico-intermedio

**SQL Server — 20 horas.**
- SELECT, TOP y la cláusula WHERE.
- Operadores AND/OR y funciones de fecha (MONTH, YEAR).
- INNER, LEFT, RIGHT y FULL JOIN.
- GROUP BY, HAVING, SUM, COUNT y ORDER BY.
- Vistas de valorización y consolidados departamentales.
- IA para generar y revisar consultas.

**Power BI — 20 horas.**
- Entorno, instalaciones y cuentas.
- Power Query: importación desde Excel, SQL y APIs; limpieza y columnas a medida.
- Barras, líneas, mapas y KPIs.
- Unpivot Columns y SELECTEDVALUE.
- Publicación con roles y seguridad organizacional.
- Q&A en lenguaje natural y Smart Narratives.

**Python — 20 horas.**
- Variables, tipos de datos, control de flujo, listas, tuplas y diccionarios.
- DataFrames desde Excel y exploración tabular.
- Groupby y agregaciones múltiples.
- Limpieza de columnas, tipos y fechas.
- Matplotlib y Seaborn.
- IA para generar scripts y automatizar reportes.

## Un ejemplo completo con sabor chapín

Una empresa de distribución de productos de consumo atiende tiendas de barrio en la capital y en los departamentos, y quiere saber qué clientes están dejando de comprar.

1. **SQL:** el analista une facturas, clientes y vendedores, y calcula para cada cliente la fecha de su última compra y el promedio mensual de los últimos meses.
2. **Power BI:** arma un tablero con ventas por departamento, ruta y vendedor, más una página de "clientes en riesgo" con filtros. Con roles, cada vendedor ve solo su cartera.
3. **Python:** con Pandas, compara la frecuencia de compra reciente con la histórica de cada cliente y genera una lista priorizada de quienes muestran la mayor caída.
4. **Acción:** el equipo comercial recibe la lista y planifica visitas. El tablero permite medir, semanas después, si esos clientes volvieron a comprar.

Este es el tipo de proyecto con datos reales con el que cierra el curso.

## Mini ejemplo en SQL

```sql
SELECT c.NombreCliente, MAX(f.Fecha) AS UltimaCompra, COUNT(*) AS Facturas
FROM Facturas f
INNER JOIN Clientes c ON f.IdCliente = c.IdCliente
GROUP BY c.NombreCliente
HAVING MAX(f.Fecha) < '2026-09-01'
ORDER BY UltimaCompra;
```

Una consulta como esta, que aprendes a escribir y revisar con apoyo de IA, te da en segundos la lista de clientes sin compras recientes, lista para el equipo comercial.

## Por qué el orden SQL → Power BI → Python tiene sentido

Muchas personas quieren arrancar por Python porque es lo que más se menciona en redes. Pero un analista que no entiende cómo están organizados los datos se tropieza una y otra vez, sin importar el lenguaje. Por eso conviene empezar por SQL: aprendes qué es una tabla, qué es una clave, cómo se unen dos tablas y cómo se resume la información. Esos mismos conceptos aparecen en Power BI cuando relacionas tablas en el modelo, y otra vez en Python cuando haces un merge o un groupby en Pandas.

Cuando llegas a Python con esa base, el código deja de ser intimidante: ya sabes qué quieres lograr y solo aprendes otra forma de escribirlo. Además, cada herramienta cubre una necesidad distinta, así que al final no compiten entre sí: SQL prepara, Power BI comunica y Python explora a fondo.

## Lo que vas a poder hacer al terminar

- Consultar bases de datos con filtros, uniones y agrupaciones, y guardar vistas reutilizables.
- Construir un modelo en Power BI con relaciones, medidas y roles, y publicarlo para tu equipo.
- Limpiar, resumir y graficar datos con Pandas, Matplotlib y Seaborn.
- Usar IA como apoyo para escribir consultas, medidas y scripts, revisándolos con criterio.
- Presentar un análisis completo con pregunta, método, evidencia y recomendación.

## Cómo prepararte

Antes de la primera sesión, repasa filtros, tablas dinámicas y BUSCARV en Excel; esos conceptos reaparecen con otro nombre. Elige un tema que conozcas para tu proyecto y consigue datos de práctica, quitando nombres y montos sensibles. Instala Power BI Desktop con tiempo —según Microsoft, se instala en Windows— y reserva un rato después de cada clase para practicar. Con eso aprovechas el curso desde el primer día.

## Glosario para no perderte

- **Base de datos relacional:** tablas conectadas entre sí por claves.
- **Consulta:** instrucción SQL para obtener datos filtrados y agrupados.
- **JOIN:** unión de tablas por un campo común.
- **Power Query:** herramienta de limpieza y transformación dentro de Power BI.
- **Medida DAX:** cálculo que se adapta a los filtros del tablero.
- **DataFrame:** la tabla de trabajo en Pandas.
- **Rol:** regla que define qué datos ve cada usuario en Power BI.

## Básico-intermedio o avanzado

| Si tú… | Empieza por |
|---|---|
| Manejas Excel pero no has escrito SQL | Básico-intermedio |
| Quieres automatizar reportes y construir tableros | Básico-intermedio |
| Ya dominas lo básico de SQL, Power BI y Pandas | Avanzado |

Ambos niveles tienen 60 horas, 20 por herramienta.

## Consejos para terminar con un buen proyecto

- **Elige un tema que conozcas:** ventas, inventario, cartera, compras, recursos humanos.
- **Plantea una pregunta concreta,** no "analizar los datos".
- **Usa las tres herramientas:** SQL para preparar, Power BI para mostrar, Python para profundizar.
- **Valida tus números** contra la fuente antes de presentarlos.
- **Cierra con una recomendación:** qué debería hacer la empresa con lo que encontraste.

## Errores frecuentes

- Empezar por Python sin entender cómo se relacionan las tablas.
- Copiar código sin comprenderlo.
- Saturar los tableros de gráficos.
- No documentar de dónde sale cada indicador.
- Confiar sin revisar en lo que sugiere la IA.

## Rutas relacionadas

- Solo tableros: [guía para aprender Power BI en Guatemala](/gt/guias/como-aprender-power-bi-en-guatemala) y [curso de Power BI](https://www.programbi.com/gt/cursos/power-bi).
- Bases de datos: [curso de SQL Server](https://www.programbi.com/gt/cursos/sql-server).
- Programación: [curso de Python](https://www.programbi.com/gt/cursos/python).

## Datos del curso

- **Inicio:** apertura mensual de grupos (fecha vigente en la ficha del curso).
- **Días y horario:** lunes y miércoles, 16:30 a 18:30, hora de Guatemala.
- **Duración:** 60 horas por nivel (20 por herramienta).
- **Modalidad:** en vivo por Zoom; grabaciones de por vida.
- **Certificado:** digital, al finalizar.
- **Instructor:** Manuel Oliva, Magíster en Data Science (UAI); según la ficha, ha liderado capacitaciones en AngloAmerican, CAP, Deloitte y SQM.
- **Precio:** {precio_local}. Puedes pagar en 3 cuotas sin interés.

**[CTA-MID]** — Descarga el temario completo.

**[CTA-END]** — {precio_local} · Inicios todos los meses · «Inscribirme» · «Escribir por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Análisis de datos en Guatemala?**
{precio_local}. Escríbenos por WhatsApp para confirmar monto y forma de pago.

**¿Cuánto dura?**
60 horas por nivel: 20 de SQL Server, 20 de Power BI y 20 de Python.

**¿Cuándo empieza y a qué hora?**
Abrimos grupos mensualmente los lunes y miércoles de 16:30 a 18:30, hora de Guatemala; verifica la fecha de arranque en la ficha.

**¿Necesito saber programar?**
No. El nivel básico-intermedio parte desde cero en cada una de las tres herramientas, paso a paso.

**¿Qué pasa si falto?**
La clase queda grabada en el campus con acceso de por vida, para que te pongas al día antes de la siguiente.

**¿Puedo tomar solo una herramienta?**
Sí. Los cursos de SQL Server, Power BI y Python existen por separado; este programa los integra con un proyecto común.

**¿Sirve si trabajo en exportación, banca o comercio?**
Sí. En todos esos sectores hay bases de datos, reportes que se repiten cada mes y decisiones que mejoran con análisis; el método que aprendes se adapta a cualquier rubro.

**¿Qué recibo al terminar?**
Certificado digital de ProgramBI y acceso de por vida a las grabaciones.
