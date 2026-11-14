---
slug: curso-sql-server-peru
ruta_sugerida: /pe/guias/curso-sql-server-peru
pais: pe
hreflang: es-PE
curso: sql-server
url_curso: https://www.programbi.com/pe/cursos/sql-server
title: "Curso de SQL Server en Perú en vivo: guía 2026 | ProgramBI"
meta: "Curso de SQL Server en vivo en Perú: consultas SQL desde cero en 20 h (martes y jueves 17:30 Lima) con ejercicios prácticos y Power BI."
h1: "Curso de SQL Server en Perú: aprende SQL online, en vivo y desde cero"
updated: 2026-11-14
sources:
  - https://www.programbi.com/pe/cursos/sql-server
  - https://www.programbi.com/pe/cursos/power-bi
  - https://www.programbi.com/pe/cursos/analisis-de-datos
  - https://pe.computrabajo.com/salarios/analista-de-datos
nota_hermes: |
  ELEMENTO VISUAL: diagrama de la ruta de aprendizaje + glosario como tarjetas + bloque «En 30 segundos».
  Intención: "curso SQL online en vivo Perú", "curso SQL Server Perú" → click_registro en /pe/cursos/sql-server. country=pe, course=sql-server.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave sql-server × pe. Monto sin definir: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - Horario ficha: martes y jueves 17:30–19:30 hora de Perú; inicio martes 24 nov 2026.
  - Sueldo: Computrabajo PE ya citado en la guía de Análisis de datos PE (dato de Radar 4 nov 2026; 403 a bots, revalidar). Se cita con link.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de SQL Server para Perú en programbi.com y quiero info del curso en vivo".
---

# Curso de SQL Server en Perú: aprende SQL online, en vivo y desde cero

**Respuesta corta:** el [curso de SQL Server de ProgramBI en Perú](https://www.programbi.com/pe/cursos/sql-server) es **online y en vivo por Zoom**: **20 horas, 8 módulos**, nivel básico-intermedio, los **martes y jueves de 17:30 a 19:30, hora de Perú**. Tiene **inicios todos los meses** (revisa la próxima fecha en la ficha) y cuesta **{precio_local}**. Incluye grabaciones de por vida y certificado.

**¿Qué aprendes?** A sacar tú mismo la información de una base de datos: consultas con `SELECT` y `WHERE`, resúmenes con `GROUP BY`, cruces con `JOIN`, subconsultas, CTEs, tablas temporales, funciones de ventana y `PIVOT`. Es la habilidad que más se repite en las convocatorias de analista y la que alimenta tus tableros de Power BI.

**[CTA-TOP]** — Inicios todos los meses · martes y jueves 17:30 (Perú) · «Ver el curso».

## Por qué SQL es clave para tu chamba en Perú

En una caja municipal, un banco, una minera o una agroexportadora, los datos viven en sistemas que corren sobre bases de datos. El área de negocio, en cambio, suele recibir un Excel que alguien descarga del sistema. Si el jefe pide «la mora por agencia, pero solo de créditos MYPE», hay que esperar a que sistemas genere otro reporte.

Con SQL esa espera desaparece. Además, si trabajas fuera de Lima —en Arequipa, Trujillo o Piura—, saber consultar la base te da independencia del equipo central y te vuelve el referente de datos de tu sede.

## SQL Server y otros motores

SQL Server es el motor de bases de datos de Microsoft, frecuente en empresas que usan Office y Power BI. Lo que aprendes vale también para Oracle, PostgreSQL o MySQL, que son comunes en banca y en el sector público: la sintaxis base es la misma y solo cambian algunas funciones.

## Lo que pide el mercado (referencia)

SQL aparece en la mayoría de los avisos de analista de datos, inteligencia comercial y riesgos. Como referencia, Computrabajo Perú informa un sueldo medio de **S/ 2.224 al mes** para «analista de datos», con 467 salarios de los últimos 12 meses (consultado el 4 de noviembre de 2026). [pe.computrabajo.com/salarios/analista-de-datos](https://pe.computrabajo.com/salarios/analista-de-datos) Los avisos que piden SQL y Power BI suelen estar en la parte alta del rango.

## Ejemplos con datos peruanos

Una financiera con agencias en Lima, Arequipa y Chiclayo, montos en soles.

**Colocaciones del mes por agencia:**
```sql
SELECT agencia, COUNT(*) AS creditos, SUM(monto_pen) AS colocado
FROM colocaciones
WHERE fecha >= '2026-10-01' AND fecha < '2026-11-01'
GROUP BY agencia
ORDER BY colocado DESC;
```

**Índice de mora por producto:**
```sql
SELECT producto,
       SUM(CASE WHEN dias_atraso > 30 THEN saldo_pen ELSE 0 END) * 1.0 / SUM(saldo_pen) AS mora
FROM cartera
GROUP BY producto;
```

**Top 5 asesores por colocación en cada agencia:**
```sql
WITH r AS (
  SELECT agencia, asesor, SUM(monto_pen) AS colocado,
         ROW_NUMBER() OVER (PARTITION BY agencia ORDER BY SUM(monto_pen) DESC) AS pos
  FROM colocaciones GROUP BY agencia, asesor
)
SELECT * FROM r WHERE pos <= 5;
```

Un detalle frecuente: el DNI se guarda como número en un sistema (y pierde el cero inicial) y como texto de 8 dígitos en otro. Normalízalo con `RIGHT('00000000' + CAST(dni AS varchar(8)), 8)` antes del cruce.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en soles.

## Caso: la campaña de una agroexportadora

Una exportadora de arándanos en La Libertad necesita saber, cada semana, cuántos kilos salieron por destino y calibre. Antes: tres archivos de tres fundos y una tarde de copiar y pegar. Con SQL:

```sql
SELECT destino, calibre, SUM(kilos) AS kilos
FROM despachos
WHERE campania = '2026' AND semana = DATEPART(WEEK, GETDATE()) - 1
GROUP BY destino, calibre
ORDER BY kilos DESC;
```

Guardada como vista y conectada a Power BI, gerencia comercial ve la campaña al día sin pedir nada.

## SQL y Power BI van de la mano

Un tablero conectado a una vista de SQL Server se actualiza solo y es mucho más liviano que uno armado sobre Excel. Para seguir, revisa el [curso de Power BI](https://www.programbi.com/pe/cursos/power-bi) y la [guía de Power BI en Perú](/pe/guias/como-aprender-power-bi-en-peru). Si quieres SQL, Power BI y Python en un solo programa, está el [curso de Análisis de datos](https://www.programbi.com/pe/cursos/analisis-de-datos).

## Cómo prepararte para una prueba técnica de SQL

Muchas empresas y convocatorias públicas en Perú incluyen una evaluación práctica. Suele incluir:

1. **Consultas de filtro y orden**: «lista los clientes de Arequipa con saldo mayor a S/ 10.000».
2. **Agregaciones**: totales y promedios por agencia o producto.
3. **Cruces**: unir dos o tres tablas sin duplicar filas.
4. **Una pregunta abierta**: «¿qué agencia tiene peor desempeño y por qué?».

Practica con bases de ejemplo y cronométrate: en la prueba importa tanto la respuesta correcta como explicar cómo llegaste a ella.

## Cargos donde piden SQL en Perú

En Computrabajo, Bumeran, LinkedIn y Talento Perú, SQL aparece en muchos puestos además de «analista de datos»:

- **Analista de riesgos** en bancos, cajas municipales y financieras.
- **Analista de inteligencia comercial** en consumo masivo y retail.
- **Analista de planeamiento y control de gestión** en minería y agroexportación.
- **Analista de información** en el sector público, con convocatorias que detallan qué evalúan.

Tip: copia el temario de dos o tres convocatorias que te interesen y úsalo como checklist. Si el curso lo cubre y tú practicas cada punto, llegas a la prueba con ventaja.

## Después del básico: el nivel avanzado

El nivel avanzado del curso (20 h) entra en procedimientos almacenados y diseño de esquemas. Con eso puedes automatizar cálculos dentro de la base —por ejemplo, actualizar cada noche la tabla de mora por agencia— y participar en decisiones sobre cómo se guardan los datos. Es el paso natural cuando ya resuelves consultas con `JOIN` y funciones de ventana sin dificultad.

## Cuánto tiempo toma

Con cinco horas por semana, la mayoría maneja consultas básicas en un mes y cruces y funciones de ventana al segundo. El atajo: practicar con datos de tu propio trabajo, siempre con permiso y con información anonimizada.

## Glosario rápido para no perderte

- **Tabla**: filas (registros) y columnas (campos), como una hoja bien ordenada.
- **Clave primaria**: el campo que identifica cada fila sin repetirse, como el código de crédito.
- **Clave foránea**: el campo que conecta con otra tabla, como el código de agencia en la tabla de créditos.
- **Vista**: una consulta guardada que se usa como si fuera una tabla; ideal para conectar Power BI.
- **CTE**: un paso intermedio con nombre dentro de una consulta (`WITH ...`).
- **Función de ventana**: un cálculo por grupo que no colapsa las filas, como un ranking por agencia.

Con estos seis términos claros, el resto del temario se entiende mucho más rápido.

## Errores comunes

- **Perder ceros iniciales** en DNI o códigos al convertir tipos.
- **`JOIN` sin validar totales.**
- **Ignorar los `NULL`** en promedios y conteos.
- **Consultas sin comentarios** que nadie entiende después.
- **Practicar sin un caso real.**

## Cómo elegir un curso de SQL online en Perú

- **En vivo y en hora peruana**, para resolver dudas en el momento.
- **Temario hasta funciones de ventana y CTEs.**
- **Proyecto con datos reales.**
- **Grabaciones**, sobre todo si vives fuera de Lima y tu horario varía.
- **Enfoque de negocio y conexión con Power BI.**

## El curso SQL Server en vivo de ProgramBI (Perú)

Según la [ficha del curso para Perú](https://www.programbi.com/pe/cursos/sql-server), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, martes y jueves de **17:30 a 19:30**, hora de Perú.
- **20 horas, 8 módulos**, nivel básico-intermedio, desde cero.
- Temario: SELECT, WHERE y ORDER BY; funciones y operadores; GROUP BY y HAVING; subconsultas; JOINs y vistas; CTEs y tablas temporales; funciones de ventana; PIVOT y UNPIVOT; IA aplicada a SQL Server.
- **Nivel avanzado** (20 h): procedimientos almacenados y diseño de esquemas.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Inicio: **grupos todos los meses** (próxima fecha en la ficha). Precio: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · martes y jueves 17:30–19:30 hora de Perú · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de SQL Server en Perú?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿El curso de SQL es online?**
Sí, online y en vivo por Zoom, martes y jueves de 17:30 a 19:30, hora de Perú.

**¿Puedo llevarlo sin experiencia?**
Sí. El nivel básico-intermedio parte desde cero.

**¿Sirve para Oracle, que usa mi empresa?**
Sí. La mayor parte de la sintaxis es igual; cambian algunas funciones.

**¿Cómo se usa con Power BI?**
Power BI se conecta a vistas o consultas de SQL Server y el tablero se actualiza solo.

**¿Entregan certificado?**
Sí, un certificado digital de ProgramBI.
