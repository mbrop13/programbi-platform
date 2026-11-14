---
slug: curso-python-uruguay
ruta_sugerida: /uy/guias/curso-python-uruguay
pais: uy
hreflang: es-UY
curso: python
url_curso: https://www.programbi.com/uy/cursos/python
title: "Curso de Python Uruguay en vivo: guía 2026 | ProgramBI"
meta: "Curso de Python online en vivo en Uruguay: Python para datos desde cero en 20 h (lunes y miércoles 19:30). Pandas y automatización."
h1: "Curso de Python en Uruguay: Python para datos, online y en vivo"
updated: 2026-11-14
sources:
  - https://www.programbi.com/uy/cursos/python
  - https://www.programbi.com/uy/cursos/sql-server
  - https://www.programbi.com/uy/cursos/power-bi
  - https://www.programbi.com/uy/cursos/analisis-de-datos
  - https://catalogodatos.gub.uy/
  - https://www.elpais.com.uy/informacion/servicios/mef-llama-a-concurso-para-analista-de-datos-con-salario-de-64-986-y-plazo-en-agosto-2026
nota_hermes: |
  Intención: "curso Python online en vivo Uruguay", "curso Python para análisis de datos Uruguay" → click_registro en /uy/cursos/python. country=uy, course=python.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave python × uy. Monto sin definir: NO escribas cifras. Sin valor → "Consultá el valor por WhatsApp".
  - Horario ficha: lunes y miércoles 19:30–21:30 hora de Uruguay; inicio lunes 23 nov 2026. Voseo.
  - ELEMENTO VISUAL: bloque «En 30 segundos» + tabla comparativa «Excel vs. Python vs. Power BI» como componente destacado.
  - Referencia salarial: llamado MEF vía El País, ya citado en las guías de Análisis de datos y SQL UY (dato de Radar; Cloudflare bloquea bots, revalidar). Citado con link.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de Python para Uruguay en programbi.com y quiero info del curso en vivo".
---

# Curso de Python en Uruguay: Python para datos, online y en vivo

**Respuesta corta:** el [curso de Python para datos de ProgramBI para Uruguay](https://www.programbi.com/uy/cursos/python) es **online y en vivo por Zoom**, con **20 horas en 8 módulos**, nivel básico-intermedio. Las clases son **lunes y miércoles de 19:30 a 21:30, hora de Uruguay**, tiene **ediciones nuevas todos los meses** (fecha actualizada en la ficha) y el valor es **{precio_local}**. Incluye grabaciones de por vida y certificado.

**¿Qué vas a aprender?** Python desde cero con foco en análisis: fundamentos del lenguaje y, sobre todo, Pandas para limpiar, transformar, agrupar y cruzar datos; gráficos con Matplotlib y conexión a bases de datos y APIs. En la práctica, vas a poder automatizar el informe que hoy armás juntando planillas y a trabajar con datos abiertos sin abrirlos uno por uno.

**[CTA-TOP]** — Cupos abiertos · lunes y miércoles 19:30 (Uruguay) · «Ver el curso».

## Por qué Python tiene tanto sentido en Uruguay

Uruguay tiene una combinación particular: una industria de software y servicios globales donde Python es moneda corriente, sectores tradicionales muy medidos —frigoríficos, forestal y celulosa, logística portuaria, banca y seguros— y un Estado que publica muchos datos abiertos. En los tres mundos hay un mismo cuello de botella: la información existe, pero procesarla lleva demasiado tiempo cuando se hace a mano.

Python con Pandas lo resuelve. Y en un mercado de este tamaño, la persona que automatiza un proceso suele volverse la referente de datos de su área, algo que se nota rápido en evaluaciones internas y en recomendaciones entre empresas.

## Excel, Python y Power BI: quién hace qué

| Tarea | Herramienta |
|---|---|
| Revisar un dato o hacer una tabla dinámica | Excel |
| Procesar un conjunto de datos abiertos de cientos de miles de filas | Python |
| Unir planillas de varias plantas o sucursales | Python |
| Presentar indicadores a la dirección con actualización automática | Power BI |
| Un proceso semanal completo, de los archivos al tablero | Python + Power BI |

Se complementan: Python prepara y automatiza; Power BI comunica.

## Una referencia salarial pública

En 2026 el Ministerio de Economía y Finanzas llamó a concurso para **Analista de datos e información**, con una remuneración nominal de **$64.986 por 40 horas semanales** (valores a enero de 2026), según publicó [El País Uruguay](https://www.elpais.com.uy/informacion/servicios/mef-llama-a-concurso-para-analista-de-datos-con-salario-de-64-986-y-plazo-en-agosto-2026). Es un dato del sector público; en el privado, y en empresas que trabajan para el exterior, los rangos varían según experiencia e inglés.

## Ejemplos con datos uruguayos

**Leer un conjunto de datos abiertos directamente desde una URL en CSV:**
```python
import pandas as pd
abiertos = pd.read_csv("URL_DEL_RECURSO.csv", encoding="utf-8")
```
(Reemplazá `URL_DEL_RECURSO.csv` por el enlace de descarga del recurso que elijas en el [catálogo de datos abiertos de Uruguay](https://catalogodatos.gub.uy/); revisá siempre su fecha de actualización.)

**Unir las planillas de faena de varias plantas:**
```python
from pathlib import Path
faena = pd.concat(
    [pd.read_excel(f).assign(planta=f.stem) for f in Path("plantas").glob("*.xlsx")],
    ignore_index=True)
```

**Toneladas exportadas por destino y trimestre:**
```python
faena["trimestre"] = pd.to_datetime(faena["fecha"], dayfirst=True).dt.to_period("Q")
resumen = faena.pivot_table(index="destino", columns="trimestre",
                            values="toneladas", aggfunc="sum", fill_value=0)
```

**Normalizar el RUT de empresas (12 dígitos) antes de cruzar:**
```python
clientes["rut"] = clientes["rut"].astype(str).str.replace(r"\D", "", regex=True).str.zfill(12)
```

Leer los identificadores como texto y completarlos con `zfill` evita los cruces fallidos que aparecen cuando un sistema guarda el RUT como número.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas en pesos uruguayos.

## Caso: movimientos del puerto sin planillas

Un analista de un operador logístico en Montevideo recibe cada día el detalle de movimientos de contenedores. Necesita permanencia promedio por cliente y ocupación del depósito. Con Python:

```python
mov = pd.read_csv("movimientos.csv", parse_dates=["ingreso", "salida"])
mov["horas"] = (mov["salida"] - mov["ingreso"]).dt.total_seconds() / 3600
permanencia = mov.groupby("cliente")["horas"].mean().sort_values(ascending=False)
ocupacion = mov[mov["salida"].isna()].groupby("zona").size()
```

Dos indicadores clave en segundos, listos para conectar a Power BI. El tiempo que antes se iba en planillas ahora se usa para hablar con los clientes que más demoran.

## Ruta de aprendizaje recomendada

1. **Planillas con soltura**: si te falta base, el [curso de Excel](https://www.programbi.com/uy/cursos/excel).
2. **SQL** para extraer datos: [curso de SQL Server](https://www.programbi.com/uy/cursos/sql-server).
3. **Python con Pandas** para limpiar y automatizar (este curso).
4. **Power BI** para presentar: [curso de Power BI](https://www.programbi.com/uy/cursos/power-bi) y [guía de Power BI en Uruguay](/uy/guias/como-aprender-power-bi-en-uruguay).

Si querés todo junto, está el [curso de Análisis de datos](https://www.programbi.com/uy/cursos/analisis-de-datos).

## Plan de práctica de cuatro semanas

- **Semana 1:** Google Colab (gratis) o Anaconda. Variables, listas, diccionarios y ciclos.
- **Semana 2:** cargá con Pandas un conjunto de datos abiertos y explorá sus columnas con `head`, `info` y `describe`.
- **Semana 3:** cruzá ese conjunto con una planilla propia (anonimizada) y resumí con `groupby`.
- **Semana 4:** automatizá un informe real y presentá el resultado en un gráfico de Matplotlib o en Power BI.

## Cuatro tareas para automatizar en tu primer mes

- **El resumen semanal de ventas o faena** que hoy armás juntando planillas de cada planta o sucursal.
- **La conciliación de cobros** entre el sistema de facturación y los movimientos bancarios, listando solo las diferencias.
- **La limpieza del maestro de clientes**: RUT con formatos distintos, departamentos escritos de varias maneras, duplicados.
- **La descarga periódica de un indicador público** que tu área usa como referencia, lista para cruzar con datos propios.

Cada una sigue el mismo patrón —leer, limpiar, unir, resumir— y cada una es un ejemplo concreto para contar en una entrevista o en una evaluación interna.

## Un proyecto de portafolio con datos abiertos

Una ventaja uruguaya es la disponibilidad de datos públicos. Armá un proyecto así:

1. **Elegí una pregunta**: «¿cómo evolucionaron las exportaciones de un sector en los últimos años?».
2. **Descargá los datos** del catálogo oficial con Python y documentá la fuente y la fecha.
3. **Limpialos y resumilos** con Pandas.
4. **Mostrá el resultado** en dos o tres gráficos claros.
5. **Escribí la conclusión** en un párrafo, como si se la contaras a un gerente.

Publicado en GitHub con un README (en español y en inglés si apuntás a empresas que trabajan para afuera), es una carta de presentación sin datos confidenciales.

## Dónde se pide Python en Uruguay

En BuscoJobs, Gallito Trabajo, LinkedIn y Uruguay Concursa, Python aparece en búsquedas de «data analyst», «analista de datos e información», «analista de riesgo» y roles en empresas de software. En las que trabajan para el exterior, casi siempre va junto a SQL e inglés.

## Errores comunes al arrancar

- **Usar datos abiertos sin revisar su vigencia ni su metodología.**
- **Leer identificadores como número** y perder dígitos.
- **Fechas en formato día/mes** mal interpretadas: usá `dayfirst=True`.
- **Uniones que duplican filas.** Revisá la cantidad de filas antes y después.
- **Saltar a machine learning** sin dominar la limpieza y el resumen.

## Cómo elegir un curso de Python online en Uruguay

- **Enfocado en datos**, con Pandas como eje.
- **En vivo y en hora uruguaya**.
- **Con casos de negocio y datos reales**.
- **Con grabaciones de por vida**.
- **Que conecte con SQL y Power BI**.

## El curso Python en vivo de ProgramBI (Uruguay)

Datos de la [ficha del curso para Uruguay](https://www.programbi.com/uy/cursos/python), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30**, hora de Uruguay.
- **20 horas, 8 módulos**, nivel básico-intermedio, desde cero.
- Temario: variables, tipos de datos y operadores; control de flujo y funciones; listas, diccionarios y tuplas; módulos y librerías; DataFrames y Series con Pandas; limpieza y transformación; GroupBy, agregaciones y Merge; conexión a bases de datos y APIs; visualización con Matplotlib; IA aplicada a Python.
- **Nivel avanzado**: análisis avanzado con Pandas y ciencia de datos aplicada a negocios.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Inicio: **ediciones mensuales** (mirá la próxima fecha en la ficha). Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · lunes y miércoles 19:30–21:30 hora de Uruguay · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Python en Uruguay?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿Es un curso online?**
Sí, online y en vivo por Zoom, lunes y miércoles de 19:30 a 21:30, hora de Uruguay.

**¿Hace falta saber programar?**
No. Se arranca desde los fundamentos y se llega hasta análisis con Pandas.

**¿Sirve para trabajar con datos abiertos?**
Sí. Pandas lee archivos CSV y Excel, incluidos los que publican los catálogos de datos abiertos, y permite cruzarlos con datos propios.

**¿Cómo se combina con Power BI?**
Python limpia y automatiza; Power BI presenta los resultados en tableros.

**¿Dan certificado?**
Sí, un certificado digital de ProgramBI al completar el curso.
