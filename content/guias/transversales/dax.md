---
title: Las 15 funciones DAX más importantes (con ejemplos)
description: CALCULATE, FILTER, SUMX, DIVIDE, RANKX y la inteligencia de tiempo explicadas con ejemplos reales. La guía de DAX que necesitas para usar Power BI en serio.
h1: Las funciones DAX más importantes de Power BI, explicadas con ejemplos
country: transversal
lang: es
slug: funciones-dax-mas-importantes
path: /guias/funciones-dax-mas-importantes
updated: 2026-11-04
course: power-bi
---
DAX es el lenguaje de fórmulas de Power BI. Se parece a Excel, y esa es justamente la trampa: las fórmulas se ven familiares, pero funcionan con otra lógica. En Excel calculas celda por celda; en DAX calculas sobre un **contexto**, es decir, sobre el conjunto de filas que quedan después de aplicar los filtros del informe. Si entiendes eso, el resto son herramientas. Aquí están las 15 funciones que resuelven la gran mayoría de los casos reales, agrupadas por lo que hacen.

<!-- CTA-TOP -->

##### Antes de empezar: medidas, no columnas

Una **columna calculada** se calcula una vez por fila y ocupa memoria. Una **medida** se calcula en el momento, según los filtros que el usuario tenga activos. Para totales, porcentajes y comparaciones, usa medidas. Regla práctica: si el resultado depende de qué filtró el usuario, es una medida.

##### 1. Agregaciones básicas

**SUM, AVERAGE, MIN, MAX.** Suman o promedian una columna.
`Ventas = SUM(Ventas[Monto])`

**COUNTROWS.** Cuenta filas de una tabla. Más claro que contar una columna.
`N° de pedidos = COUNTROWS(Ventas)`

**DISTINCTCOUNT.** Cuenta valores únicos.
`Clientes activos = DISTINCTCOUNT(Ventas[ID_Cliente])`

##### 2. DIVIDE: la división segura

`Margen % = DIVIDE([Ventas] - [Costo], [Ventas])`
Si el denominador es cero o está vacío, devuelve vacío en lugar de error. Úsala siempre en vez de «/».

##### 3. CALCULATE: la función más importante de DAX

CALCULATE evalúa una expresión **cambiando el contexto de filtro**. Es la que te permite responder «¿y si solo miro…?».

`Ventas online = CALCULATE([Ventas], Canal[Nombre] = "Online")`

Lo que hace: toma todos los filtros que ya hay en el informe, reemplaza el filtro sobre `Canal[Nombre]` por «Online» y calcula. Si el usuario filtra un mes, la medida respeta ese mes.

##### 4. FILTER: filtros con condiciones complejas

Cuando la condición no es una simple igualdad, combinas CALCULATE con FILTER:

`Ventas de pedidos grandes = CALCULATE([Ventas], FILTER(Ventas, Ventas[Monto] > 1000))`

Consejo de rendimiento: filtra columnas, no tablas completas, cuando puedas. `FILTER(ALL(Producto[Categoría]), …)` es más liviano que `FILTER(Ventas, …)` sobre millones de filas.

##### 5. ALL y ALLEXCEPT: quitar filtros

Para porcentajes sobre el total necesitas el total «sin filtrar»:

`% del total = DIVIDE([Ventas], CALCULATE([Ventas], ALL(Producto)))`

`ALLEXCEPT(Producto, Producto[Categoría])` quita todos los filtros de la tabla menos el de categoría: útil para «% dentro de la categoría».

##### 6. Iteradores: SUMX y AVERAGEX

SUM suma una columna que ya existe. **SUMX** recorre una tabla fila por fila, calcula una expresión y suma el resultado.

`Ventas = SUMX(Ventas, Ventas[Cantidad] * Ventas[Precio_unitario])`

Es la clave para convertir moneda por tipo de cambio diario, ponderar promedios o calcular márgenes por línea. `AVERAGEX(VALUES(Cliente[ID]), [Ventas])` da el promedio de ventas **por cliente**, no por fila.

##### 7. RELATED: traer un dato de otra tabla

Dentro de un iterador, RELATED trae el valor de la tabla relacionada (lado «uno»):

`Costo total = SUMX(Ventas, Ventas[Cantidad] * RELATED(Producto[Costo_unitario]))`

##### 8. Inteligencia de tiempo

Requiere una **tabla calendario** marcada como tabla de fechas, sin huecos.

- `Ventas YTD = TOTALYTD([Ventas], Calendario[Fecha])` — acumulado del año (acepta fecha de cierre fiscal como tercer argumento).
- `Ventas AA = CALCULATE([Ventas], SAMEPERIODLASTYEAR(Calendario[Fecha]))` — mismo período del año anterior.
- `Ventas mes anterior = CALCULATE([Ventas], DATEADD(Calendario[Fecha], -1, MONTH))`
- `Var. % interanual = DIVIDE([Ventas] - [Ventas AA], [Ventas AA])`

##### 9. RANKX: rankings dinámicos

`Ranking producto = RANKX(ALL(Producto[Nombre]), [Ventas])`
El ALL es clave: sin él, cada producto se compara solo consigo mismo y todos quedan en el puesto 1.

##### 10. SWITCH y SELECTEDVALUE: medidas que cambian según lo que elige el usuario

Con una tabla desconectada `Métrica` (Ventas, Margen, Unidades):

`Valor elegido = SWITCH(SELECTEDVALUE(Métrica[Nombre]), "Ventas", [Ventas], "Margen", [Margen %], "Unidades", [Unidades])`

Así un solo gráfico muestra la métrica que el usuario elige en un segmentador.

##### 11. VAR: fórmulas legibles y más rápidas

`Crecimiento % =
VAR Actual = [Ventas]
VAR Anterior = [Ventas AA]
RETURN DIVIDE(Actual - Anterior, Anterior)`

Las variables se calculan una vez, hacen la fórmula legible y evitan repetir cálculos.

<!-- CTA-MID --> — Descarga la plantilla con estas 15 medidas ya creadas.

##### Los errores de DAX más comunes

- **Usar columnas calculadas para totales.**
- **Olvidar ALL en RANKX o en porcentajes del total.**
- **Inteligencia de tiempo sin tabla calendario** o con fechas que tienen hora.
- **Relaciones bidireccionales «por si acaso»**, que generan resultados ambiguos.
- **Copiar fórmulas de Excel** esperando que funcionen igual.

##### Por dónde seguir

Domina primero CALCULATE, DIVIDE, SUMX y la inteligencia de tiempo: con eso resuelves el 80 % de los informes de negocio. Después vienen el contexto de transición, las tablas virtuales y la optimización.

Si quieres aprenderlo con ejemplos de tu país, elige tu guía: [Chile](/guias/como-aprender-power-bi-en-chile) · [México](/mx/guias/como-aprender-power-bi-en-mexico) · [Colombia](/co/guias/como-aprender-power-bi-en-colombia) · [Argentina](/ar/guias/como-aprender-power-bi-en-argentina) · [Perú](/pe/guias/como-aprender-power-bi-en-peru) · [Uruguay](/uy/guias/como-aprender-power-bi-en-uruguay) · [Paraguay](/py/guias/como-aprender-power-bi-en-paraguay).

<!-- CTA-END --> — El curso Power BI en vivo de ProgramBI dedica módulos completos a DAX: CALCULATE y FILTER, Time Intelligence, RANKX e iteradores y tabla de métricas con SWITCH. 20 horas en vivo por Zoom, grabaciones de por vida y certificado.

##### Preguntas frecuentes

**¿Qué es DAX?** Data Analysis Expressions, el lenguaje de fórmulas de Power BI, Power Pivot y Analysis Services.
**¿Cuál es la función DAX más importante?** CALCULATE, porque permite modificar el contexto de filtro y está detrás de casi todas las medidas de negocio.
**¿Cuál es la diferencia entre SUM y SUMX?** SUM suma una columna; SUMX calcula una expresión fila por fila y luego suma.
**¿Se puede aprender DAX sin saber programar?** Sí. Requiere práctica con el concepto de contexto, no experiencia en programación.
**¿Cuánto tiempo toma aprender DAX?** Lo esencial, unas 3 a 4 semanas de práctica regular. Dominarlo es un proceso más largo.
**¿DAX sirve en Excel?** Sí, en Power Pivot dentro de Excel se usa el mismo lenguaje.
