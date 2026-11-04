---
slug: curso-sql-server-chile
ruta_sugerida: /guias/curso-sql-server-chile
pais: cl
hreflang: es-CL
curso: sql-server
url_curso: https://www.programbi.com/cursos/sql-server
title: "Curso de SQL Server en Chile en vivo: guía 2026 | ProgramBI"
meta: "Curso de SQL online en vivo en Chile: SQL Server desde cero en 20 h, martes y jueves 19:30, por $169.000 CLP. Qué aprender, ejemplos y cómo usarlo con Power BI."
h1: "Curso de SQL Server en Chile: aprende SQL en vivo y online"
updated: 2026-11-04
sources:
  - https://www.programbi.com/cursos/sql-server
  - https://www.programbi.com/cursos/power-bi
  - https://www.programbi.com/cursos/analisis-de-datos
  - https://www.chiletrabajos.cl/sueldos/analista/datos
nota_hermes: |
  ELEMENTO VISUAL: tabla comparativa «Del Excel al SQL» (ya en el texto; renderízala destacada) + bloque «En 30 segundos».
  Intención: "curso SQL online en vivo Chile", "curso SQL Server Chile", "aprender SQL desde cero" → click_registro en /cursos/sql-server. country=cl, course=sql-server.
  - PRECIO: 169.000 CLP confirmado por Manu (4 nov 2026) para cursos básico-intermedio. Igual léelo como {precio_local} desde config/pricing.ts para no desalinear guía/ficha/Offer/checkout. El JSON-LD actual dice 249.000: debe corregirlo WS1.
  - OJO ficha: el encabezado dice "Martes y Jueves 19:30–21:30, inicio martes 24 nov 2026", pero el bloque final repite "Lunes y Miércoles". La guía usa martes y jueves; pedir a WS1/WS2 corregir la ficha.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. CTAs §2.5 con course=sql-server.
  - WhatsApp: "Hola, vengo de la guía de SQL Server para Chile en programbi.com y quiero info del curso en vivo".
  - Sueldo: se cita Chiletrabajos (misma fuente que la guía de Análisis de datos), con link.
---

# Curso de SQL Server en Chile: aprende SQL en vivo y online

**Respuesta corta:** el [curso de SQL Server de ProgramBI](https://www.programbi.com/cursos/sql-server) es un curso de SQL **online y en vivo por Zoom** para Chile: **20 horas, 8 módulos, nivel básico-intermedio**, los **martes y jueves de 19:30 a 21:30, hora de Chile**. El próximo inicio es el **martes 24 de noviembre de 2026** y el valor es **$169.000 CLP**, con grabaciones de por vida y certificado.

**¿Qué aprendes?** A escribir consultas desde cero (`SELECT`, `WHERE`, `ORDER BY`), agrupar con `GROUP BY` y `HAVING`, cruzar tablas con todos los tipos de `JOIN`, usar subconsultas, CTEs, tablas temporales, funciones de ventana y `PIVOT`. En la práctica: dejar de pedirle a TI el Excel de cada lunes y sacarlo tú directo de la base.

**[CTA-TOP]** — Próxima clase en vivo: martes 24 de noviembre de 2026 · 19:30 hora de Chile · «Ver el curso».

## Por qué SQL es la habilidad que más rinde en la pega

En harta empresa chilena el flujo es el mismo: el ERP (SAP, Softland, Defontana o uno propio) guarda todo en una base de datos, pero el área de finanzas o control de gestión recibe un Excel exportado que alguien de sistemas manda cuando puede. Si el gerente pide «lo mismo, pero por sucursal y sin las notas de crédito», hay que pedirlo de nuevo y esperar.

Quien sabe SQL corta esa cadena. Escribe la consulta, la guarda y la vuelve a correr cada mes. Además, SQL es la puerta de entrada a todo lo demás: Power BI, Python y cualquier herramienta de datos se conectan a una base, y sin entender cómo están armadas las tablas, el tablero termina mostrando números que no cuadran.

## Qué es SQL Server y por qué este y no otro

SQL es el lenguaje; SQL Server es el motor de base de datos de Microsoft, muy presente en empresas que ya trabajan con Windows, Excel y Power BI. La sintaxis base (`SELECT`, `JOIN`, `GROUP BY`) es casi igual en PostgreSQL, MySQL u Oracle, así que lo que aprendes te sirve aunque tu empresa use otro motor. Lo que cambia son detalles como funciones de fecha o el `TOP` en lugar de `LIMIT`.

## Lo que se pide en el mercado (referencia)

Revisa diez avisos de «analista de datos» o «analista de control de gestión» en Chile y vas a ver SQL en casi todos, junto a Excel y Power BI. Como referencia de sueldo, Chiletrabajos informa un sueldo **pretendido** promedio de **$979.205 al mes** para «analista datos» (noviembre de 2026; es lo que piden los postulantes, no lo que pagan las empresas). [chiletrabajos.cl/sueldos/analista/datos](https://www.chiletrabajos.cl/sueldos/analista/datos)

SQL no es un cargo en sí: es la herramienta que hace creíble tu postulación a esos cargos.

## Del Excel al SQL: equivalencias que te ahorran semanas

| Lo que haces en Excel | Cómo se dice en SQL |
|---|---|
| Filtro de una columna | `WHERE region = 'Biobío'` |
| Ordenar de mayor a menor | `ORDER BY ventas DESC` |
| Tabla dinámica con suma por sucursal | `GROUP BY sucursal` + `SUM(monto)` |
| BUSCARV / BUSCARX | `LEFT JOIN productos ON ...` |
| Filtrar el resultado de la tabla dinámica | `HAVING SUM(monto) > 10000000` |
| Columna con ranking | `RANK() OVER (ORDER BY ventas DESC)` |

Si ya manejas tablas dinámicas y BUSCARX, tienes media cabeza en SQL.

## Ejemplos con datos chilenos

Imagina una distribuidora con sucursales de Arica a Punta Arenas que factura en CLP.

**Ventas del mes por región, solo facturas (sin notas de crédito):**
```sql
SELECT region, SUM(monto_clp) AS ventas
FROM documentos
WHERE tipo_doc = 'FACTURA'
  AND fecha >= '2026-10-01' AND fecha < '2026-11-01'
GROUP BY region
ORDER BY ventas DESC;
```

**Clientes sin compras en 90 días (para el equipo comercial):**
```sql
SELECT c.rut, c.razon_social, MAX(d.fecha) AS ultima_compra
FROM clientes c
LEFT JOIN documentos d ON d.rut_cliente = c.rut
GROUP BY c.rut, c.razon_social
HAVING MAX(d.fecha) < DATEADD(DAY, -90, GETDATE()) OR MAX(d.fecha) IS NULL;
```

**Top 3 productos por sucursal con funciones de ventana:**
```sql
WITH ranking AS (
  SELECT sucursal, producto, SUM(monto_clp) AS ventas,
         ROW_NUMBER() OVER (PARTITION BY sucursal ORDER BY SUM(monto_clp) DESC) AS pos
  FROM ventas GROUP BY sucursal, producto
)
SELECT * FROM ranking WHERE pos <= 3;
```

Un detalle chileno: el RUT suele venir con puntos y guion en un sistema y sin ellos en otro. Antes de un `JOIN`, normalízalo (por ejemplo con `REPLACE`), o el cruce te va a dejar clientes «perdidos».

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en pesos chilenos.

## SQL + Power BI: la dupla que piden los avisos

SQL deja los datos limpios y agregados; Power BI los convierte en un tablero. Si conectas Power BI a una vista de SQL Server en vez de a un Excel, el informe se actualiza solo y pesa mucho menos. Por eso el temario del curso incluye la conexión a bases de datos para Power BI. Si quieres el siguiente paso, mira el [curso de Power BI](https://www.programbi.com/cursos/power-bi) o la [guía para aprender Power BI en Chile](/guias/como-aprender-power-bi-en-chile). Y si quieres SQL, Power BI y Python en un solo programa, está el [curso de Análisis de datos](https://www.programbi.com/cursos/analisis-de-datos).

## Un plan de cuatro semanas para partir

- **Semana 1:** instala SQL Server Express y SSMS (son gratuitos) y practica `SELECT`, `WHERE` y `ORDER BY` con una tabla de ventas.
- **Semana 2:** agrupa con `GROUP BY` y filtra grupos con `HAVING`: ventas por región, por vendedor y por mes.
- **Semana 3:** une tablas con `JOIN`. Cruza ventas con clientes y productos, y verifica que el total no cambie después del cruce.
- **Semana 4:** reescribe tu reporte semanal como una consulta guardada, o una vista, y conéctalo a Power BI.

Al terminar, tu informe de los lunes ya no depende de un archivo exportado.

## Errores típicos al aprender SQL

- **`SELECT *` para todo.** Trae columnas que no usas y vuelve lenta la consulta. Pide solo lo necesario.
- **`JOIN` que duplica filas.** Si la tabla de la derecha tiene más de una fila por clave, la suma se infla. Revisa siempre el conteo antes y después del cruce.
- **Confundir `WHERE` con `HAVING`.** `WHERE` filtra filas antes de agrupar; `HAVING`, grupos después.
- **Fechas como texto.** Comparar «01-10-2026» como texto da resultados raros. Usa tipos de fecha.
- **Practicar solo con ejercicios de juguete.** El salto real llega cuando consultas la base de tu propio trabajo (con permiso de TI, claro).

## Cómo elegir un curso de SQL online en Chile

- **En vivo y en hora chilena.** Para resolver dudas en el momento y no depender de foros.
- **Que llegue a funciones de ventana y CTEs.** Un curso que se queda en `SELECT` y `WHERE` te deja a mitad de camino.
- **Con proyecto y datos reales.** Es lo que vas a mostrar en una entrevista.
- **Grabaciones disponibles.** Entre cierres de mes y reuniones, alguna clase vas a perder.
- **Integración con Power BI.** Es el uso más común de SQL en áreas de negocio.

## El curso SQL Server en vivo de ProgramBI

Datos de la [ficha del curso](https://www.programbi.com/cursos/sql-server), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, martes y jueves de **19:30 a 21:30**, hora de Chile.
- **20 horas, 8 módulos**, nivel básico-intermedio, pensado para quienes parten desde cero.
- Temario: SELECT, WHERE y ORDER BY; funciones y operadores; GROUP BY y HAVING; subconsultas y filtrado avanzado; JOINs (INNER, LEFT, RIGHT, FULL) y vistas; CTEs y tablas temporales; funciones de ventana; PIVOT y UNPIVOT; e introducción al uso de IA en SQL Server.
- **Nivel avanzado** (20 h) con procedimientos almacenados y diseño de esquemas.
- **Grabaciones de por vida**, **certificado** al completar y proyectos con datos reales.
- Próximo inicio: **martes 24 de noviembre de 2026**. Valor: **$169.000 CLP**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM.
- Para equipos: cotización en `/cursos/sql-server/empresas`.

**[CTA-END]** — {precio_local} · martes y jueves 19:30–21:30 hora de Chile · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de SQL Server en Chile?**
El nivel básico-intermedio cuesta $169.000 CLP e incluye 20 horas en vivo, grabaciones de por vida y certificado.

**¿El curso de SQL es online?**
Sí, es online y en vivo por Zoom, martes y jueves de 19:30 a 21:30, hora de Chile. Las clases quedan grabadas.

**¿Necesito saber programar para aprender SQL?**
No. El nivel básico-intermedio parte desde cero. Si manejas tablas dinámicas en Excel, ya tienes buena base.

**¿Lo que aprendo en SQL Server sirve para MySQL u Oracle?**
Sí, la mayor parte. La sintaxis base es la misma; cambian algunas funciones, como las de fecha.

**¿Qué relación tiene con Power BI?**
SQL prepara y entrega los datos; Power BI los visualiza. Conectar Power BI a SQL Server hace que los informes se actualicen solos.

**¿Entregan certificado?**
Sí, un certificado digital de ProgramBI al completar el curso.
