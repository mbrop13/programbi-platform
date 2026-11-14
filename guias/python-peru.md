---
slug: curso-python-peru
ruta_sugerida: /pe/guias/curso-python-peru
pais: pe
hreflang: es-PE
curso: python
url_curso: https://www.programbi.com/pe/cursos/python
title: "Curso de Python en Perú en vivo: guía 2026 | ProgramBI"
meta: "Curso de Python online en vivo en Perú: Python para datos desde cero en 20 h (lunes y miércoles 17:30 Lima). Pandas y automatización."
h1: "Curso de Python en Perú: Python para datos, online y desde cero"
updated: 2026-11-14
sources:
  - https://www.programbi.com/pe/cursos/python
  - https://www.programbi.com/pe/cursos/sql-server
  - https://www.programbi.com/pe/cursos/power-bi
  - https://www.programbi.com/pe/cursos/analisis-de-datos
  - https://pe.computrabajo.com/salarios/analista-de-datos
nota_hermes: |
  Intención: "curso Python online en vivo Perú", "curso Python para análisis de datos Perú" → click_registro en /pe/cursos/python. country=pe, course=python.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave python × pe. Monto sin definir: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - Horario ficha: lunes y miércoles 17:30–19:30 hora de Perú; inicio lunes 23 nov 2026.
  - ELEMENTO VISUAL: bloque «En 30 segundos» + diagrama del flujo de automatización (archivos de agencias → Python → Excel/Power BI) para el caso de microfinanzas.
  - Sueldo: Computrabajo PE ya citado en las guías de Análisis de datos y SQL PE (dato de Radar 4 nov 2026; 403 a bots, revalidar). Citado con link.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de Python para Perú en programbi.com y quiero info del curso en vivo".
---

# Curso de Python en Perú: Python para datos, online y desde cero

**Respuesta corta:** el [curso de Python para datos de ProgramBI en Perú](https://www.programbi.com/pe/cursos/python) es **online y en vivo por Zoom**: **20 horas, 8 módulos**, nivel básico-intermedio, los **lunes y miércoles de 17:30 a 19:30, hora de Perú**. Cuenta con **inicios todos los meses** (revisa la próxima fecha en la ficha) y cuesta **{precio_local}**. Incluye grabaciones de por vida y certificado.

**¿Qué aprendes?** Python desde los fundamentos con enfoque en análisis de datos: variables, funciones, listas y diccionarios, y luego Pandas para limpiar, transformar, agrupar y cruzar información; gráficos con Matplotlib y conexión a bases de datos y APIs. En tu chamba, eso se traduce en automatizar el consolidado que hoy armas juntando archivos de cada agencia, fundo o tienda.

**[CTA-TOP]** — Inicios todos los meses · lunes y miércoles 17:30 (Perú) · «Ver el curso».

## Por qué Python vale la pena en Perú

Los sectores que más pesan en el empleo calificado peruano —banca y microfinanzas, minería, agroexportación, retail y consumo masivo— tienen algo en común: la información llega fragmentada. Cada agencia manda su reporte, cada fundo su planilla, cada tienda su cierre. Alguien en Lima los consolida a mano, revisa que cuadren y arma el informe para gerencia.

Python automatiza ese consolidado. Lee todos los archivos, los estandariza, detecta los que vienen incompletos y entrega el resumen. Y como el trabajo híbrido y remoto creció, quien domina esta herramienta puede hacerlo desde Arequipa, Trujillo o Piura con el mismo impacto.

## Excel, Python y Power BI: cuándo usar cada uno

| Necesidad | Herramienta |
|---|---|
| Un análisis puntual o una tabla dinámica | Excel |
| Consolidar los reportes de 50 agencias | Python |
| Limpiar códigos, DNI o fechas en miles de filas | Python |
| Tablero para gerencia que se actualiza solo | Power BI |
| Proceso mensual completo, de archivos a tablero | Python + Power BI |

No es una competencia: Python prepara y automatiza, Power BI presenta.

## Lo que pide el mercado (referencia)

Python aparece cada vez más en avisos de analista de datos, riesgos e inteligencia comercial, junto a SQL, Excel y Power BI. Como referencia, Computrabajo Perú informa un sueldo medio de **S/ 2.224 al mes** para «analista de datos», con 467 salarios de los últimos 12 meses (consultado el 4 de noviembre de 2026). [pe.computrabajo.com/salarios/analista-de-datos](https://pe.computrabajo.com/salarios/analista-de-datos) Los avisos que piden Python y SQL suelen estar en la parte alta del rango.

## Ejemplos con datos peruanos

**Consolidar los reportes de todas las agencias:**
```python
import pandas as pd
from pathlib import Path

reportes = pd.concat(
    [pd.read_excel(f, dtype={"dni": str}).assign(agencia=f.stem)
     for f in Path("agencias").glob("*.xlsx")],
    ignore_index=True)
```

**Recuperar el cero inicial del DNI:**
```python
reportes["dni"] = reportes["dni"].str.replace(r"\D", "", regex=True).str.zfill(8)
```

**Mora por agencia y producto:**
```python
reportes["en_mora"] = reportes["dias_atraso"] > 30
mora = (reportes.groupby(["agencia", "producto"])
                .apply(lambda g: g.loc[g["en_mora"], "saldo_pen"].sum() / g["saldo_pen"].sum()))
```

**Detectar agencias que no enviaron su reporte:**
```python
esperadas = set(maestro_agencias["agencia"])
recibidas = set(reportes["agencia"])
faltantes = esperadas - recibidas
```

El último ejemplo es pequeño pero muy útil: antes de calcular cualquier indicador, sabes si el consolidado está completo.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en soles.

## Caso: la campaña de arándanos, al día

Una agroexportadora en La Libertad recibe cada semana los registros de cosecha y despacho de varios fundos. Gerencia comercial quiere saber kilos por destino y calibre, y cómo va la campaña frente a la anterior. Con Python:

```python
despachos = pd.concat([pd.read_excel(f) for f in Path("fundos").glob("*.xlsx")])
resumen = despachos.pivot_table(index="destino", columns="calibre",
                                values="kilos", aggfunc="sum", fill_value=0)
resumen.to_excel("campania_semana.xlsx")
```

El script reemplaza una tarde de copiar y pegar. Conectado a Power BI, el avance de la campaña se ve sin esperar al lunes.

## Ruta de aprendizaje recomendada

1. **Excel con soltura**: si te falta base, el [curso de Excel](https://www.programbi.com/pe/cursos/excel).
2. **SQL** para extraer datos: [curso de SQL Server](https://www.programbi.com/pe/cursos/sql-server).
3. **Python con Pandas** para consolidar y automatizar (este curso).
4. **Power BI** para presentar: [curso de Power BI](https://www.programbi.com/pe/cursos/power-bi) y [guía de Power BI en Perú](/pe/guias/como-aprender-power-bi-en-peru).

Si quieres las tres herramientas técnicas en un programa, está el [curso de Análisis de datos](https://www.programbi.com/pe/cursos/analisis-de-datos).

## Plan de práctica de cuatro semanas

- **Semana 1:** usa Google Colab (gratis, sin instalar nada) y practica variables, listas, diccionarios y ciclos.
- **Semana 2:** lee con Pandas un reporte de tu trabajo (anonimizado), filtra y crea columnas calculadas.
- **Semana 3:** consolida varios archivos con `concat`, cruza con `merge` y resume con `groupby`.
- **Semana 4:** automatiza un consolidado real y compara el resultado con el manual.

## Cómo prepararte para una evaluación técnica con Python

Algunas empresas y convocatorias incluyen una prueba práctica. Suele parecerse a esto:

1. **Un archivo con errores**: fechas mezcladas, DNI sin ceros, montos como texto.
2. **Preguntas concretas**: «¿qué agencia tiene mayor mora?», «¿cuál fue el mes con más colocaciones?».
3. **Un entregable**: un cuaderno de Jupyter con código y respuestas, o un gráfico.

Practica con un caso así cronometrándote. Comenta tu código: quien evalúa quiere entender tu razonamiento, no solo ver el resultado.

## Cinco procesos que puedes automatizar en tu primer mes

- **El consolidado de colocaciones** que cada agencia envía por correo, con validación de que llegaron todas.
- **La depuración de la base de clientes**: DNI con ceros perdidos, nombres en mayúsculas y minúsculas, teléfonos con espacios.
- **El reporte de cobranza** por tramo de atraso (0–30, 31–60, 61–90 y más de 90 días), listo para el comité.
- **El seguimiento de despachos** por destino y semana en una agroexportadora.
- **El cierre de ventas de tiendas** en retail, con comparación contra la misma semana del año anterior.

Cada uno empieza igual: leer archivos, limpiar, unir y resumir. Cuando dominas ese patrón con Pandas, puedes aplicarlo a casi cualquier reporte de tu empresa. Y cada proceso automatizado es un ejemplo concreto para contar en una entrevista: qué hacías antes, qué hace ahora el script y cuántas horas ahorras al mes.

## Cargos que piden Python en Perú

En Computrabajo, Bumeran, LinkedIn y Talento Perú, Python aparece en avisos de «analista de datos», «analista de riesgos», «analista de inteligencia comercial» y «analista de planeamiento». En banca y consultoras es frecuente que lo pidan junto a SQL.

## Errores comunes al empezar

- **Leer el DNI como número.** Pierde el cero inicial y deja de cruzar.
- **No validar que llegaron todos los archivos.** Un consolidado incompleto da indicadores falsos.
- **Uniones que duplican filas.** Revisa el número de filas antes y después del `merge`.
- **Copiar código sin entenderlo.** Cuando cambie el formato del archivo, no sabrás corregirlo.
- **Ir directo a modelos predictivos** sin dominar la limpieza.

## Cómo elegir un curso de Python online en Perú

- **Enfocado en análisis de datos**, con Pandas como eje.
- **En vivo y en hora peruana**, para resolver dudas en el momento.
- **Con casos de negocio** como cartera, ventas o campañas.
- **Con grabaciones**, sobre todo si vives fuera de Lima y tu horario varía.
- **Que conecte con SQL y Power BI**.

## El curso Python en vivo de ProgramBI (Perú)

Según la [ficha del curso para Perú](https://www.programbi.com/pe/cursos/python), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, lunes y miércoles de **17:30 a 19:30**, hora de Perú.
- **20 horas, 8 módulos**, nivel básico-intermedio, desde cero.
- Temario: variables, tipos de datos y operadores; control de flujo y funciones; listas, diccionarios y tuplas; módulos y librerías; DataFrames y Series con Pandas; limpieza y transformación; GroupBy, agregaciones y Merge; conexión a bases de datos y APIs; visualización con Matplotlib; IA aplicada a Python.
- **Nivel avanzado**: análisis avanzado con Pandas y ciencia de datos aplicada a negocios.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Inicio: **grupos todos los meses** (próxima fecha en la ficha). Precio: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · lunes y miércoles 17:30–19:30 hora de Perú · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Python en Perú?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿El curso de Python es online?**
Sí, online y en vivo por Zoom, lunes y miércoles de 17:30 a 19:30, hora de Perú.

**¿Puedo llevarlo sin saber programar?**
Sí. Se parte desde los fundamentos y se llega hasta análisis con Pandas.

**¿Sirve para consolidar reportes de varias agencias o sedes?**
Sí. Es uno de los usos más comunes: leer muchos archivos, estandarizarlos y resumirlos con un script.

**¿Cómo se relaciona con Power BI?**
Python prepara y automatiza los datos; Power BI los presenta en tableros.

**¿Entregan certificado?**
Sí, un certificado digital de ProgramBI.
