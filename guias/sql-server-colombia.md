---
slug: curso-sql-server-colombia
ruta_sugerida: /co/guias/curso-sql-server-colombia
pais: co
hreflang: es-CO
curso: sql-server
url_curso: https://www.programbi.com/co/cursos/sql-server
title: "Curso de SQL Server Colombia en vivo: guía 2026 | ProgramBI"
meta: "Curso de SQL Server en vivo en Colombia: consultas SQL desde cero en 20 h (martes y jueves 17:30 Bogotá) y conexión directa con Power BI."
h1: "Curso de SQL Server en Colombia: aprende SQL online y en vivo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/co/cursos/sql-server
  - https://www.programbi.com/co/cursos/power-bi
  - https://www.programbi.com/co/cursos/analisis-de-datos
  - https://co.computrabajo.com/salarios/analista-de-datos
nota_hermes: |
  ELEMENTO VISUAL: tabla comparativa de tramos de cartera (resultado del ejemplo con CASE) + bloque «En 30 segundos».
  Intención: "curso SQL online en vivo Colombia", "curso SQL Server Colombia" → click_registro en /co/cursos/sql-server. country=co, course=sql-server.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave sql-server × co. Monto sin definir por Manu: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - Horario ficha: martes y jueves 17:30–19:30 hora de Colombia; inicio martes 24 nov 2026.
  - Sueldo: Computrabajo CO ya citado en la guía de Análisis de datos CO (dato de Radar 4 nov 2026; 403 a bots, revalidar). Se cita con link.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de SQL Server para Colombia en programbi.com y quiero info del curso en vivo".
---

# Curso de SQL Server en Colombia: aprende SQL online y en vivo

**Respuesta corta:** el [curso de SQL Server de ProgramBI en Colombia](https://www.programbi.com/co/cursos/sql-server) es **online y en vivo por Zoom**: **20 horas, 8 módulos**, nivel básico-intermedio, los **martes y jueves de 17:30 a 19:30, hora de Colombia**. Arranca el **martes 24 de noviembre de 2026** y su valor es **{precio_local}**. Trae grabaciones de por vida y certificado.

**¿Para qué sirve?** Para consultar bases de datos por tu cuenta: filtrar, agrupar, unir tablas con `JOIN`, armar CTEs, tablas temporales, funciones de ventana y `PIVOT`. Es la habilidad que te saca de esperar el archivo que manda sistemas y la base para construir tableros en Power BI que no fallen.

**[CTA-TOP]** — Próxima clase en vivo: martes 24 de noviembre de 2026 · 17:30 hora de Colombia · «Ver el curso».

## El problema que resuelve SQL en una empresa colombiana

En un banco en Bogotá, una EPS en Medellín o un BPO en Barranquilla, la información está en bases de datos, pero el área de negocio trabaja con extractos: un plano que llega por correo, un Excel con 200.000 filas que se cuelga al abrirlo, un reporte que solo trae lo que alguien decidió hace años. Si la pregunta cambia, hay que pedir un extracto nuevo.

Saber SQL te da autonomía. Escribes la consulta, filtras solo lo que necesitas y la base hace el trabajo pesado, no tu computador. En sectores con volúmenes grandes —autorizaciones de salud, transacciones bancarias, interacciones de call center— esa diferencia se nota desde el primer día.

## SQL Server y el resto de motores

SQL Server es la base de datos de Microsoft, muy usada en empresas que trabajan con Office y Power BI. La sintaxis que aprendes —`SELECT`, `WHERE`, `JOIN`, `GROUP BY`, funciones de ventana— es casi la misma en Oracle, PostgreSQL o MySQL. Si tu empresa usa otro motor, lo aprendido te sirve igual; solo cambian algunas funciones de fecha y texto.

## Lo que pide el mercado (referencia)

SQL aparece en buena parte de las vacantes de analista de datos en Colombia, junto a Excel y Power BI. Como referencia, Computrabajo Colombia informa un sueldo medio de **$2.416.855 COP al mes** para «analista de datos», con 7.156 salarios de los últimos 12 meses (consultado el 4 de noviembre de 2026). [co.computrabajo.com/salarios/analista-de-datos](https://co.computrabajo.com/salarios/analista-de-datos) La media mezcla cargos muy distintos; los avisos que piden SQL y Power BI tienden a ubicarse arriba.

## Ejemplos con datos colombianos

Una cooperativa con oficinas en Bogotá, Cali y Bucaramanga, montos en COP.

**Desembolsos del mes por ciudad:**
```sql
SELECT ciudad, COUNT(*) AS creditos, SUM(valor_cop) AS desembolsado
FROM desembolsos
WHERE fecha >= '2026-10-01' AND fecha < '2026-11-01'
GROUP BY ciudad
ORDER BY desembolsado DESC;
```

**Asociados con mora mayor a 30 días y su oficina:**
```sql
SELECT a.cedula, a.nombre, o.oficina, c.dias_mora, c.saldo_cop
FROM cartera c
JOIN asociados a ON a.cedula = c.cedula
JOIN oficinas o ON o.id = a.id_oficina
WHERE c.dias_mora > 30;
```

**Clasificar la cartera por antigüedad con `CASE`:**
```sql
SELECT CASE WHEN dias_mora <= 30 THEN '0-30'
            WHEN dias_mora <= 60 THEN '31-60'
            WHEN dias_mora <= 90 THEN '61-90'
            ELSE '+90' END AS rango,
       SUM(saldo_cop) AS saldo
FROM cartera
GROUP BY CASE WHEN dias_mora <= 30 THEN '0-30'
              WHEN dias_mora <= 60 THEN '31-60'
              WHEN dias_mora <= 90 THEN '61-90'
              ELSE '+90' END;
```

Ojo con un detalle común: en muchas bases la cédula está guardada como texto en una tabla y como número en otra. Conviértela al mismo tipo antes del `JOIN` (`CAST` o `CONVERT`) o el cruce fallará en silencio.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en pesos colombianos.

## Caso: el informe de SLA de un call center

Un analista de un BPO arma cada mañana el informe de nivel de servicio por campaña. Antes, exportaba las llamadas del día anterior, las pegaba en Excel y calculaba con fórmulas. Con SQL:

```sql
SELECT campania,
       COUNT(*) AS llamadas,
       AVG(CAST(segundos_espera AS float)) AS espera_prom,
       SUM(CASE WHEN segundos_espera <= 20 THEN 1 ELSE 0 END) * 1.0 / COUNT(*) AS nivel_servicio
FROM llamadas
WHERE CAST(fecha_hora AS date) = CAST(DATEADD(DAY, -1, GETDATE()) AS date)
GROUP BY campania;
```

Guardada como vista y conectada a Power BI, el informe está listo antes de que llegue el supervisor.

## SQL y Power BI, la pareja que piden las vacantes

Un tablero de Power BI conectado a una vista de SQL Server se actualiza solo, pesa menos y no se rompe cuando alguien cambia el nombre de una columna en el Excel. Para seguir, mira el [curso de Power BI](https://www.programbi.com/co/cursos/power-bi) y la [guía de Power BI para Colombia](/co/guias/como-aprender-power-bi-en-colombia). Si quieres SQL, Power BI y Python juntos, está el [curso de Análisis de datos](https://www.programbi.com/co/cursos/analisis-de-datos).

## Plan de práctica de cuatro semanas

- **Semana 1:** instala SQL Server Express y SSMS (gratuitos) y practica consultas simples.
- **Semana 2:** `GROUP BY`, `HAVING` y `CASE` para clasificar y resumir.
- **Semana 3:** `JOIN` entre tres tablas; valida siempre los totales antes y después.
- **Semana 4:** convierte un informe que hoy haces a mano en una vista y conéctala a Power BI.

## Cargos y portales donde aparece SQL en Colombia

SQL no solo lo piden los avisos de «analista de datos». Búscalo también en:

- **Analista de riesgo de crédito** en bancos y cooperativas: cartera, provisiones y scoring.
- **Analista de información en salud**: autorizaciones, glosas y facturación en EPS e IPS.
- **Analista de WFM o de reportes** en BPO: SLA, ausentismo y productividad por agente.
- **Analista de inteligencia comercial** en consumo masivo y retail.

Los portales con más volumen son Computrabajo, elempleo.com, Magneto Empleos y LinkedIn. Un consejo: en tu hoja de vida escribe «SQL Server (consultas, JOIN, CTE, funciones de ventana)» y no solo «SQL»; los filtros de los portales buscan esas palabras.

## Después del básico: qué sigue

Cuando ya escribes consultas con soltura, el nivel avanzado del curso (20 h) entra en procedimientos almacenados y diseño de esquemas: cómo automatizar procesos dentro de la base y cómo se arma un modelo de tablas bien pensado. Es el paso que te permite proponer mejoras, no solo consultar.

## Buenas prácticas para que tus consultas duren

- **Nombra bien**: `v_cartera_mora_oficina` dice más que `consulta3`.
- **Comenta el porqué**, no el qué: `-- excluye créditos castigados por política de riesgo`.
- **Usa CTEs** para dividir pasos largos; se leen de arriba abajo como una receta.
- **Valida totales** contra el reporte oficial antes de publicar un tablero.
- **Guarda versiones**: una carpeta con fecha o un repositorio sencillo evita perder cambios.

Así, cuando te vayas de vacaciones, otra persona puede correr tu consulta sin llamarte.

## Errores frecuentes

- **Traer todo con `SELECT *`.** En tablas de millones de filas, la consulta se vuelve eterna.
- **No revisar duplicados tras un `JOIN`.** Las sumas se inflan sin que lo notes.
- **Ignorar los `NULL`.** Afectan conteos y promedios.
- **Tipos de dato mezclados.** Cédulas como texto en una tabla y como número en otra.
- **No documentar.** Una consulta sin comentarios es difícil de mantener para ti mismo en tres meses.

## Cómo elegir un curso de SQL online en Colombia

- **En vivo y en hora colombiana**, para preguntar en el momento.
- **Temario completo**: que llegue a CTEs y funciones de ventana.
- **Proyecto con datos reales** para tu hoja de vida.
- **Grabaciones** para repasar.
- **Enfoque de negocio**, no solo administración de bases de datos.

## El curso SQL Server en vivo de ProgramBI (Colombia)

Según la [ficha del curso para Colombia](https://www.programbi.com/co/cursos/sql-server), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, martes y jueves de **17:30 a 19:30**, hora de Colombia.
- **20 horas, 8 módulos**, nivel básico-intermedio, desde cero.
- Temario: SELECT, WHERE y ORDER BY; funciones y operadores; GROUP BY y HAVING; subconsultas; JOINs y vistas; CTEs y tablas temporales; funciones de ventana; PIVOT y UNPIVOT; IA aplicada a SQL Server.
- **Nivel avanzado** (20 h): procedimientos almacenados y diseño de esquemas.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Inicio: **martes 24 de noviembre de 2026**. Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · martes y jueves 17:30–19:30 hora de Colombia · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto vale el curso de SQL Server en Colombia?**
El nivel básico-intermedio de 20 horas tiene un valor de {precio_local}, con grabaciones de por vida y certificado.

**¿El curso es online?**
Sí, online y en vivo por Zoom, martes y jueves de 17:30 a 19:30, hora de Colombia.

**¿Puedo empezar sin saber nada de SQL?**
Sí. El nivel básico-intermedio arranca desde cero.

**¿Me sirve si mi empresa usa Oracle?**
Sí. La mayor parte de la sintaxis es común; cambian algunas funciones.

**¿Cómo se conecta con Power BI?**
Power BI se conecta a vistas o consultas de SQL Server, y así el tablero se actualiza solo.

**¿Entregan certificado?**
Sí, un certificado digital de ProgramBI al completar el curso.
