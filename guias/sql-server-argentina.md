---
slug: curso-sql-server-argentina
ruta_sugerida: /ar/guias/curso-sql-server-argentina
pais: ar
hreflang: es-AR
curso: sql-server
url_curso: https://www.programbi.com/ar/cursos/sql-server
title: "Curso de SQL Server Argentina en vivo: guía 2026 | ProgramBI"
meta: "Curso de SQL online en vivo en Argentina: SQL Server desde cero en 20 h, martes y jueves 19:30. Temario, consultas de ejemplo y cómo sumarlo a Power BI."
h1: "Curso de SQL Server en Argentina: aprendé SQL online y en vivo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/ar/cursos/sql-server
  - https://www.programbi.com/ar/cursos/power-bi
  - https://www.programbi.com/ar/cursos/analisis-de-datos
  - https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana
  - https://sysarmy.com/
nota_hermes: |
  ELEMENTO VISUAL: bloque «En 30 segundos» + checklist visual de la entrevista técnica.
  Intención: "curso SQL online en vivo Argentina", "curso SQL Server Argentina" → click_registro en /ar/cursos/sql-server. country=ar, course=sql-server.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave sql-server × ar. Monto sin definir: NO escribas cifras. Sin valor → "Consultá el valor por WhatsApp".
  - Horario ficha: martes y jueves 19:30–21:30 hora de Argentina; inicio martes 24 nov 2026. Voseo.
  - Sueldo: Sysarmy 2026.1 vía Instituto IEA, ya citado en la guía de Análisis de datos AR; se cita con link.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de SQL Server para Argentina en programbi.com y quiero info del curso en vivo".
---

# Curso de SQL Server en Argentina: aprendé SQL online y en vivo

**Respuesta corta:** el [curso de SQL Server de ProgramBI para Argentina](https://www.programbi.com/ar/cursos/sql-server) es **online y en vivo por Zoom**, con **20 horas en 8 módulos** de nivel básico-intermedio. Se cursa **martes y jueves de 19:30 a 21:30, hora de Argentina**, empieza el **martes 24 de noviembre de 2026** y cuesta **{precio_local}**. Tenés grabaciones de por vida y certificado.

**¿Qué vas a saber hacer?** Consultar bases de datos sin depender de nadie: filtrar, agrupar, cruzar tablas con `JOIN`, usar subconsultas, CTEs, tablas temporales, funciones de ventana y `PIVOT`. Es la habilidad más pedida en búsquedas de datos y la que hace que tus tableros de Power BI tengan números confiables.

**[CTA-TOP]** — Próxima clase en vivo: martes 24 de noviembre de 2026 · 19:30 hora de Argentina · «Ver el curso».

## Por qué SQL te cambia el laburo

En una distribuidora de Córdoba, una fintech porteña o una agroexportadora de Rosario pasa lo mismo: los datos están en una base, pero vos trabajás con exportaciones. Cuando la gerencia pide «lo mismo pero ajustado por la lista de precios nueva», empieza otra ronda de pedidos a sistemas. Con la velocidad a la que cambian los precios en Argentina, esperar una semana para un reporte es llegar tarde.

Con SQL hacés la pregunta directo. Además, como muchos analistas argentinos trabajan para empresas de afuera, SQL es casi un requisito universal en esas búsquedas: es el idioma común de los equipos de datos en cualquier país.

## SQL Server frente a otros motores

SQL Server es la base de datos de Microsoft, muy común en empresas que usan Office y Power BI. Lo que aprendés en SQL Server sirve casi igual en PostgreSQL, MySQL u Oracle, que también vas a encontrar en startups y empresas de software. Cambian detalles como `TOP` vs. `LIMIT` o algunas funciones de fecha, pero la lógica es la misma.

## Cuánto se paga (referencia)

La Encuesta de Sueldos de Sysarmy 2026.1 (marzo de 2026) muestra, para analistas de datos o BI, una mediana de sueldo bruto mensual de **$1.785.000** (junior), **$2.557.772** (semi-senior) y **$3.382.000** (senior), según el cálculo del Instituto IEA. [institutoiea.edu.ar](https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana) · [sysarmy.com](https://sysarmy.com/) Con inflación, tomalo como orden de magnitud. SQL es una de las habilidades que más aparece en esos perfiles.

## Ejemplos con datos argentinos

Una distribuidora de consumo masivo con ventas en ARS y listas de precios que cambian seguido.

**Facturación del mes por provincia:**
```sql
SELECT provincia, SUM(importe_ars) AS facturado
FROM facturas
WHERE fecha >= '2026-10-01' AND fecha < '2026-11-01'
GROUP BY provincia
ORDER BY facturado DESC;
```

**Productos vendidos por debajo de la lista vigente:**
```sql
SELECT f.producto, f.precio_unit, l.precio_lista
FROM facturas_detalle f
JOIN listas_precios l
  ON l.producto = f.producto
 AND f.fecha BETWEEN l.vigencia_desde AND l.vigencia_hasta
WHERE f.precio_unit < l.precio_lista;
```

**Variación mensual de ventas con `LAG`:**
```sql
SELECT mes, ventas,
       ventas * 1.0 / LAG(ventas) OVER (ORDER BY mes) - 1 AS var_mensual
FROM resumen_mensual;
```

La última consulta es clave en un contexto inflacionario: comparar meses en valores nominales sin calcular la variación lleva a conclusiones equivocadas.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas en pesos argentinos.

## Caso: el CUIT que no cruza

Un detalle muy local: el CUIT aparece con guiones en el sistema de facturación («30-12345678-9») y sin ellos en el CRM. Si hacés el `JOIN` así, perdés clientes sin darte cuenta. La solución:

```sql
SELECT c.razon_social, SUM(f.importe_ars) AS total
FROM facturas f
JOIN clientes c ON REPLACE(f.cuit, '-', '') = c.cuit
GROUP BY c.razon_social;
```

Moraleja: antes de confiar en un total, contá las filas antes y después del cruce.

## SQL y Power BI: el combo que piden las búsquedas

Power BI conectado a una vista de SQL Server se actualiza solo y pesa menos que un Excel enorme. Si querés dar ese paso, mirá el [curso de Power BI](https://www.programbi.com/ar/cursos/power-bi) y la [guía de Power BI en Argentina](/ar/guias/como-aprender-power-bi-en-argentina). Si preferís todo junto —SQL, Power BI y Python—, está el [curso de Análisis de datos](https://www.programbi.com/ar/cursos/analisis-de-datos).

## Plan de práctica de cuatro semanas

- **Semana 1:** instalá SQL Server Express y SSMS (son gratuitos) y practicá `SELECT`, `WHERE` y `ORDER BY`.
- **Semana 2:** `GROUP BY` y `HAVING` para resumir por provincia, vendedor o mes.
- **Semana 3:** `JOIN` con validación de totales, y `LAG` para variaciones mensuales.
- **Semana 4:** convertí un reporte que hacés a mano en una vista y conectala a Power BI.

Si apuntás a laburos para el exterior, escribí los nombres de tablas y columnas de tu proyecto en inglés: es lo que vas a encontrar en esos equipos.

## Búsquedas donde vas a encontrar SQL

No te quedes solo con «analista de datos». En Bumeran, ZonaJobs, Computrabajo, GetOnBoard y LinkedIn también piden SQL:

- **Analista de pricing**, sobre todo en consumo masivo y retail, donde las listas cambian seguido.
- **Analista de riesgo o de cobranzas** en fintech y bancos.
- **Analista de planeamiento** en industria y agroindustria.
- **Data analyst o BI analyst** en empresas de software y en posiciones remotas para el exterior.

En las búsquedas para afuera, además de SQL te van a pedir inglés y, muchas veces, una prueba técnica con consultas en vivo. Practicá explicar en voz alta qué hace cada parte de tu consulta: es lo que evalúan.

## Después del básico: el nivel avanzado

Cuando ya resolvés consultas con `JOIN`, CTEs y funciones de ventana sin trabarte, el nivel avanzado del curso (20 h) entra en procedimientos almacenados y diseño de esquemas. Es lo que te permite automatizar procesos dentro de la base (por ejemplo, recalcular un tablero de precios cada noche) y opinar sobre cómo deberían estar armadas las tablas. Ese salto es el que separa a quien consulta datos de quien diseña cómo se guardan.

## Cuánto tiempo lleva aprender SQL

Con cuatro o cinco horas por semana, en un mes manejás consultas básicas y agrupaciones; en dos, `JOIN`, subconsultas y funciones de ventana. Lo que más acelera es usar datos de tu laburo desde el principio: cada consulta que te ahorra una tarde de planilla te motiva a seguir.

## Checklist antes de una entrevista técnica de SQL

Si te llaman para una búsqueda de datos, repasá esto la noche anterior:

- Escribir de memoria un `SELECT` con `WHERE`, `GROUP BY`, `HAVING` y `ORDER BY`, en ese orden.
- Explicar la diferencia entre `INNER JOIN` y `LEFT JOIN` con un ejemplo de clientes sin compras.
- Calcular una variación mensual con `LAG` y decir por qué, con inflación, conviene mirar porcentajes y no montos.
- Encontrar duplicados con `GROUP BY` + `HAVING COUNT(*) > 1`.
- Contar qué hiciste en tu proyecto en dos minutos: problema, consulta, resultado.

Si alguna te cuesta, ya sabés qué repasar.

## Errores comunes

- **Comparar montos nominales entre meses** sin calcular la variación.
- **`JOIN` sin normalizar claves** como el CUIT.
- **Abusar de `SELECT *`** en tablas grandes.
- **Confundir `WHERE` y `HAVING`.**
- **No guardar ni comentar las consultas.** En tres meses no vas a recordar por qué filtraste algo.

## Cómo elegir un curso de SQL online en Argentina

- **En vivo y en tu horario**, a la salida del laburo.
- **Que llegue a funciones de ventana**: `LAG`, `ROW_NUMBER` y compañía son las que más vas a usar.
- **Proyecto con datos reales.**
- **Grabaciones** para repasar.
- **Conexión con Power BI**, el uso más común en áreas de negocio.

## El curso SQL Server en vivo de ProgramBI (Argentina)

Datos de la [ficha del curso para Argentina](https://www.programbi.com/ar/cursos/sql-server), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, martes y jueves de **19:30 a 21:30**, hora de Argentina.
- **20 horas, 8 módulos**, nivel básico-intermedio, desde cero.
- Temario: SELECT, WHERE y ORDER BY; funciones y operadores; GROUP BY y HAVING; subconsultas; JOINs y vistas; CTEs y tablas temporales; funciones de ventana; PIVOT y UNPIVOT; IA aplicada a SQL Server.
- **Nivel avanzado** (20 h): procedimientos almacenados y diseño de esquemas.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Inicio: **martes 24 de noviembre de 2026**. Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · martes y jueves 19:30–21:30 hora de Argentina · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto sale el curso de SQL Server en Argentina?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿Es online?**
Sí, online y en vivo por Zoom, martes y jueves de 19:30 a 21:30, hora de Argentina.

**¿Necesito saber programar?**
No. Arranca desde cero; alcanza con manejar Excel.

**¿Me sirve para PostgreSQL o MySQL?**
Sí. La lógica y la mayor parte de la sintaxis son iguales.

**¿Qué tiene que ver con Power BI?**
SQL prepara los datos y Power BI los muestra; conectados, el tablero se actualiza solo.

**¿Hay certificado?**
Sí, certificado digital de ProgramBI al completar el curso.
