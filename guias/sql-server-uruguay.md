---
slug: curso-sql-server-uruguay
ruta_sugerida: /uy/guias/curso-sql-server-uruguay
pais: uy
hreflang: es-UY
curso: sql-server
url_curso: https://www.programbi.com/uy/cursos/sql-server
title: "Curso de SQL Server Uruguay en vivo: guía 2026 | ProgramBI"
meta: "Curso de SQL online en vivo en Uruguay: SQL Server desde cero en 20 h, martes y jueves 19:30. Temario, ejemplos y cómo conectarlo con Power BI."
h1: "Curso de SQL Server en Uruguay: aprendé SQL online y en vivo"
updated: 2026-11-14
sources:
  - https://www.programbi.com/uy/cursos/sql-server
  - https://www.programbi.com/uy/cursos/power-bi
  - https://www.programbi.com/uy/cursos/analisis-de-datos
  - https://www.elpais.com.uy/informacion/servicios/mef-llama-a-concurso-para-analista-de-datos-con-salario-de-64-986-y-plazo-en-agosto-2026
nota_hermes: |
  ELEMENTO VISUAL: diagrama del flujo «datos abiertos + datos propios → SQL Server → Power BI» + bloque «En 30 segundos».
  Intención: "curso SQL online en vivo Uruguay", "curso SQL Server Uruguay" → click_registro en /uy/cursos/sql-server. country=uy, course=sql-server.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave sql-server × uy. Monto sin definir: NO escribas cifras. Sin valor → "Consultá el valor por WhatsApp".
  - Horario ficha: martes y jueves 19:30–21:30 hora de Uruguay; inicio martes 24 nov 2026. Voseo.
  - Referencia salarial: llamado MEF vía El País, ya citado en la guía de Análisis de datos UY (dato de Radar; Cloudflare bloquea bots, revalidar). Se cita con link.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de SQL Server para Uruguay en programbi.com y quiero info del curso en vivo".
---

# Curso de SQL Server en Uruguay: aprendé SQL online y en vivo

**Respuesta corta:** el [curso de SQL Server de ProgramBI para Uruguay](https://www.programbi.com/uy/cursos/sql-server) es **online y en vivo por Zoom**, con **20 horas en 8 módulos**, nivel básico-intermedio. Las clases son **martes y jueves de 19:30 a 21:30, hora de Uruguay**, abre **ediciones nuevas todos los meses** (fecha actualizada en la ficha) y el valor es **{precio_local}**. Incluye grabaciones de por vida y certificado.

**¿Qué vas a aprender?** A consultar bases de datos por tu cuenta: filtrar con `WHERE`, resumir con `GROUP BY`, cruzar tablas con `JOIN`, armar subconsultas, CTEs, tablas temporales, funciones de ventana y `PIVOT`. Es la habilidad base de cualquier perfil de datos y la que hace confiables tus tableros de Power BI.

**[CTA-TOP]** — Cupos abiertos · martes y jueves 19:30 (Uruguay) · «Ver el curso».

## Por qué SQL es una apuesta segura en Uruguay

En Montevideo conviven empresas de software que trabajan para el exterior, bancos y aseguradoras, frigoríficos, forestales, operadores logísticos del puerto y un Estado que publica datos y contrata analistas. En casi todas, la información está en bases de datos y el área de negocio recibe planillas exportadas.

SQL te da acceso directo. Y como en un mercado chico los equipos son reducidos, la persona que sabe escribir una consulta suele terminar siendo la referente de datos del área. En empresas de software, además, SQL es requisito básico para casi cualquier rol vinculado a datos o producto.

## SQL Server y otros motores

SQL Server es la base de datos de Microsoft. Vas a encontrar también PostgreSQL y MySQL, sobre todo en empresas de software, y Oracle en algunas organizaciones grandes. La lógica que aprendés es la misma en todos; cambian detalles de sintaxis como `TOP` frente a `LIMIT`.

## Una referencia salarial pública

En 2026 el Ministerio de Economía y Finanzas llamó a concurso para **Analista de datos e información**, con una remuneración nominal de **$64.986 por 40 horas semanales** (valores a enero de 2026), según publicó [El País Uruguay](https://www.elpais.com.uy/informacion/servicios/mef-llama-a-concurso-para-analista-de-datos-con-salario-de-64-986-y-plazo-en-agosto-2026). Es un dato del sector público; en el privado los rangos varían según experiencia e inglés. En ese tipo de cargos, SQL aparece como herramienta habitual.

## Ejemplos con datos uruguayos

Un operador logístico que mueve contenedores en el puerto de Montevideo.

**Contenedores movidos por mes y tipo de operación:**
```sql
SELECT FORMAT(fecha, 'yyyy-MM') AS mes, operacion, COUNT(*) AS contenedores
FROM movimientos
WHERE fecha >= '2026-01-01'
GROUP BY FORMAT(fecha, 'yyyy-MM'), operacion
ORDER BY mes;
```

**Tiempo promedio de permanencia por cliente:**
```sql
SELECT c.cliente, AVG(DATEDIFF(HOUR, m.ingreso, m.salida) * 1.0) AS horas_prom
FROM movimientos m
JOIN clientes c ON c.id = m.id_cliente
WHERE m.salida IS NOT NULL
GROUP BY c.cliente
ORDER BY horas_prom DESC;
```

**Pasar meses a columnas con `PIVOT`:**
```sql
SELECT * FROM (
  SELECT operacion, MONTH(fecha) AS mes, 1 AS n FROM movimientos
) src
PIVOT (SUM(n) FOR mes IN ([1],[2],[3],[4],[5],[6])) p;
```

Un detalle práctico: el RUT de empresas uruguayas tiene 12 dígitos y a veces llega con espacios o puntos desde sistemas distintos. Normalizalo antes de cruzar tablas.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas en pesos uruguayos.

## Caso: datos abiertos + datos propios

Una ventaja uruguaya es la cantidad de datos abiertos que publica el Estado. Un analista de un frigorífico puede cargar en SQL Server un conjunto público de exportaciones y cruzarlo con sus propios embarques:

```sql
SELECT e.destino, SUM(e.toneladas) AS propias, SUM(a.toneladas) AS total_pais
FROM embarques e
LEFT JOIN abiertos_exportaciones a
  ON a.destino = e.destino AND a.anio = YEAR(e.fecha)
GROUP BY e.destino;
```

Así calcula su participación por mercado sin pedirle nada a nadie. Revisá siempre la licencia y la fecha de actualización del dato abierto antes de usarlo.

## SQL y Power BI, juntos

Power BI conectado a una vista de SQL Server se actualiza solo y no depende de que alguien guarde la planilla en la carpeta correcta. Para seguir, mirá el [curso de Power BI](https://www.programbi.com/uy/cursos/power-bi) y la [guía de Power BI en Uruguay](/uy/guias/como-aprender-power-bi-en-uruguay). Si querés SQL, Power BI y Python en un solo programa, está el [curso de Análisis de datos](https://www.programbi.com/uy/cursos/analisis-de-datos).

## Plan de práctica de cuatro semanas

- **Semana 1:** instalá SQL Server Express y SSMS (gratuitos) y escribí tus primeras consultas.
- **Semana 2:** agrupaciones, `HAVING` y `CASE`.
- **Semana 3:** `JOIN` entre varias tablas y validación de totales.
- **Semana 4:** cargá un conjunto de datos abiertos, cruzalo con datos propios y conectalo a Power BI.

## Dónde se pide SQL en Uruguay

SQL aparece en muchas más búsquedas que las de «analista de datos». En BuscoJobs, Gallito Trabajo, LinkedIn y Uruguay Concursa lo vas a ver en:

- **Empresas de software y servicios globales**: data analyst, BI analyst, QA de datos y roles de producto.
- **Banca y seguros**: analistas de riesgo, de siniestros y de información comercial.
- **Agro, frigoríficos y forestal**: analistas de costos, producción y exportaciones.
- **Sector público**: llamados de analista de datos e información, cuyas bases detallan el temario.

En empresas que trabajan para el exterior, la prueba técnica suele ser en inglés y con consultas en vivo. Practicá explicar tu razonamiento mientras escribís: es tan importante como el resultado.

## Después del básico: el nivel avanzado

Cuando ya resolvés cruces, CTEs y funciones de ventana con soltura, el nivel avanzado del curso (20 h) aborda procedimientos almacenados y diseño de esquemas. Con eso podés automatizar procesos dentro de la base —por ejemplo, un resumen diario de movimientos del puerto— y participar en cómo se diseñan las tablas. Es el paso que te lleva de usuario avanzado a referente técnico del equipo.

## Cuánto tiempo lleva

Con cuatro o cinco horas por semana, en un mes dominás consultas básicas y agrupaciones; en dos, cruces y funciones de ventana. Si cada ejercicio lo hacés sobre un problema real de tu trabajo, el aprendizaje se fija mucho más rápido y además empezás a mostrar resultados antes de terminar el curso.

## Cómo armar un proyecto para tu portafolio

Elegí un conjunto de datos abiertos del Estado uruguayo, cargalo en SQL Server, escribí cinco consultas que respondan preguntas concretas y conectá el resultado a Power BI. Documentá todo en una página: la pregunta, los datos, las consultas y la conclusión. Es un portafolio sin datos confidenciales, fácil de mostrar en cualquier entrevista.

## Seguridad y buenas prácticas con datos

Cuando empezás a consultar bases reales, tené presente:

- **Pedí acceso de solo lectura.** Así no hay riesgo de modificar datos por error.
- **No saques datos personales** (cédulas, teléfonos) a planillas sueltas; trabajá con datos agregados o anonimizados.
- **Probá en una copia** antes de correr consultas pesadas en horario laboral.
- **Documentá de dónde sale cada número.** En un llamado o una auditoría te lo van a preguntar.
- **Cuidá el rendimiento.** Filtrá por fecha primero; una consulta sin `WHERE` sobre años de movimientos puede frenar el sistema para todos.

## Errores comunes

- **Cruces que duplican filas** por claves repetidas.
- **Fechas guardadas como texto.**
- **No contemplar `NULL`** en promedios de tiempos.
- **Usar datos abiertos sin revisar su vigencia.**
- **Consultas largas sin CTEs**, difíciles de mantener.

## Cómo elegir un curso de SQL online en Uruguay

- **En vivo y en hora uruguaya.**
- **Temario hasta funciones de ventana y `PIVOT`.**
- **Proyecto con datos reales.**
- **Grabaciones de por vida.**
- **Integración con Power BI.**

## El curso SQL Server en vivo de ProgramBI (Uruguay)

Datos de la [ficha del curso para Uruguay](https://www.programbi.com/uy/cursos/sql-server), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, martes y jueves de **19:30 a 21:30**, hora de Uruguay.
- **20 horas, 8 módulos**, nivel básico-intermedio, desde cero.
- Temario: SELECT, WHERE y ORDER BY; funciones y operadores; GROUP BY y HAVING; subconsultas; JOINs y vistas; CTEs y tablas temporales; funciones de ventana; PIVOT y UNPIVOT; IA aplicada a SQL Server.
- **Nivel avanzado** (20 h): procedimientos almacenados y diseño de esquemas.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Inicio: **ediciones mensuales** (mirá la próxima fecha en la ficha). Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · martes y jueves 19:30–21:30 hora de Uruguay · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de SQL Server en Uruguay?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿Es un curso online?**
Sí, online y en vivo por Zoom, martes y jueves de 19:30 a 21:30, hora de Uruguay.

**¿Hace falta experiencia previa?**
No. Se arranca desde cero.

**¿Sirve para PostgreSQL o MySQL?**
Sí. La lógica y casi toda la sintaxis son iguales.

**¿Cómo se combina con Power BI?**
Power BI se conecta a vistas de SQL Server y el tablero se actualiza solo.

**¿Dan certificado?**
Sí, un certificado digital de ProgramBI al completar el curso.
