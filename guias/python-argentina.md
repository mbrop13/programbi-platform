---
slug: curso-python-argentina
ruta_sugerida: /ar/guias/curso-python-argentina
pais: ar
hreflang: es-AR
curso: python
url_curso: https://www.programbi.com/ar/cursos/python
title: "Curso de Python Argentina en vivo: guía 2026 | ProgramBI"
meta: "Curso de Python online en vivo en Argentina: Python para datos desde cero en 20 h, lunes y miércoles 19:30. Pandas, listas de precios y automatización."
h1: "Curso de Python en Argentina: Python para datos, online y en vivo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/ar/cursos/python
  - https://www.programbi.com/ar/cursos/sql-server
  - https://www.programbi.com/ar/cursos/power-bi
  - https://www.programbi.com/ar/cursos/analisis-de-datos
  - https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana
  - https://sysarmy.com/
nota_hermes: |
  Intención: "curso Python online en vivo Argentina", "curso Python para análisis de datos Argentina" → click_registro en /ar/cursos/python. country=ar, course=python.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave python × ar. Monto sin definir: NO escribas cifras. Sin valor → "Consultá el valor por WhatsApp".
  - Horario ficha: lunes y miércoles 19:30–21:30 hora de Argentina; inicio lunes 23 nov 2026. Voseo.
  - ELEMENTO VISUAL: diagrama de la ruta de aprendizaje (Excel → SQL → Python → Power BI) + bloque «En 30 segundos». Opcional: mini-gráfico de ejemplo «ventas nominales vs. variación %» para ilustrar el caso de inflación.
  - Sueldo: Sysarmy 2026.1 vía Instituto IEA, ya citado en las guías de Análisis de datos y SQL AR. Citado con link.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de Python para Argentina en programbi.com y quiero info del curso en vivo".
---

# Curso de Python en Argentina: Python para datos, online y en vivo

**Respuesta corta:** el [curso de Python para datos de ProgramBI para Argentina](https://www.programbi.com/ar/cursos/python) es **online y en vivo por Zoom**, con **20 horas en 8 módulos** de nivel básico-intermedio. Se cursa **lunes y miércoles de 19:30 a 21:30, hora de Argentina**, empieza el **lunes 23 de noviembre de 2026** y cuesta **{precio_local}**. Tenés grabaciones de por vida y certificado.

**¿Qué vas a aprender?** Python desde cero con foco en análisis: las bases del lenguaje y, sobre todo, Pandas para limpiar, transformar, agrupar y cruzar tablas; gráficos con Matplotlib y conexión a bases de datos y APIs. En el laburo, eso significa que la planilla que actualizás a mano cada vez que cambia una lista de precios se recalcula sola con un script.

**[CTA-TOP]** — Próxima clase en vivo: lunes 23 de noviembre de 2026 · 19:30 hora de Argentina · «Ver el curso».

## Por qué Python rinde tanto en Argentina

Hay dos razones muy locales. La primera es la velocidad a la que cambian los números: listas de precios, costos de proveedores y tipos de cambio se actualizan seguido, y cada cambio obliga a rehacer cálculos en decenas de planillas. Con Python, el proceso se escribe una vez y se vuelve a correr cuando llega la lista nueva.

La segunda es el mercado laboral: muchos analistas argentinos trabajan para empresas de otros países, y en esos equipos de datos Python es casi un estándar, junto con SQL. Saberlo te abre búsquedas que piden exactamente ese perfil.

A eso se suma un ecosistema de fintech, software y agroindustria que genera datos todo el tiempo y necesita gente capaz de procesarlos sin depender de sistemas.

## Excel, Python y Power BI: quién hace qué

| Tarea | Herramienta |
|---|---|
| Una cuenta rápida o una tabla dinámica | Excel |
| Actualizar 40 listas de precios de proveedores | Python |
| Calcular variaciones mensuales sobre años de historia | Python o SQL |
| Mostrar márgenes a la gerencia con actualización automática | Power BI |
| Proceso semanal completo, de los archivos al tablero | Python + Power BI |

Se complementan: Python prepara y automatiza; Power BI comunica.

## Cuánto se paga (referencia)

La Encuesta de Sueldos de Sysarmy 2026.1 (marzo de 2026) muestra, para analistas de datos o BI, una mediana de sueldo bruto mensual de **$1.785.000** (junior), **$2.557.772** (semi-senior) y **$3.382.000** (senior), según el cálculo del Instituto IEA. [institutoiea.edu.ar](https://institutoiea.edu.ar/publicaciones/que-hace-un-analista-de-datos-y-cuanto-gana) · [sysarmy.com](https://sysarmy.com/) Con inflación, tomalo como orden de magnitud. Python es una de las herramientas que más se repite en esos perfiles.

## Ejemplos con datos argentinos

**Juntar las listas de precios de todos los proveedores:**
```python
import pandas as pd
from pathlib import Path

listas = pd.concat(
    [pd.read_excel(f).assign(proveedor=f.stem) for f in Path("listas").glob("*.xlsx")],
    ignore_index=True)
```

**Limpiar precios con formato argentino («$ 12.345,67»):**
```python
listas["precio"] = (listas["precio"].astype(str)
                    .str.replace(r"[$\s.]", "", regex=True)
                    .str.replace(",", ".", regex=False)
                    .astype(float))
```

**Variación mensual de costos por producto:**
```python
costos = listas.sort_values("fecha").groupby(["producto", pd.Grouper(key="fecha", freq="M")])["precio"].mean()
variacion = costos.groupby(level="producto").pct_change()
```

**Normalizar el CUIT antes de cruzar con clientes:**
```python
ventas["cuit"] = ventas["cuit"].astype(str).str.replace("-", "", regex=False)
```

El formato con coma decimal y punto de miles es una de las causas más comunes de errores al pasar de Excel a Python: resolvelo al leer los datos y te ahorrás horas.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas en pesos argentinos.

## Caso: márgenes que se actualizan solos

Una distribuidora de Córdoba recalculaba márgenes cada vez que un proveedor mandaba lista nueva: abrir el archivo, copiar precios, revisar fórmulas, avisar a comercial. Con Python:

```python
base = ventas.merge(listas_vigentes, on="producto", how="left")
base["margen_pct"] = (base["precio_venta"] - base["costo"]) / base["precio_venta"]
en_rojo = base[base["margen_pct"] < 0][["producto", "precio_venta", "costo"]]
en_rojo.to_excel("productos_en_rojo.xlsx", index=False)
```

Cuando llega una lista, se corre el script y comercial recibe en minutos los productos que quedaron por debajo del costo. En un contexto inflacionario, esa velocidad vale plata.

## Ruta de aprendizaje recomendada

1. **Excel con soltura**: si te falta, el [curso de Excel](https://www.programbi.com/ar/cursos/excel).
2. **SQL** para sacar datos de la base: [curso de SQL Server](https://www.programbi.com/ar/cursos/sql-server).
3. **Python con Pandas** para limpiar y automatizar (este curso).
4. **Power BI** para presentar: [curso de Power BI](https://www.programbi.com/ar/cursos/power-bi) y [guía de Power BI en Argentina](/ar/guias/como-aprender-power-bi-en-argentina).

Si preferís todo en un programa, está el [curso de Análisis de datos](https://www.programbi.com/ar/cursos/analisis-de-datos).

## Plan de práctica de cuatro semanas

- **Semana 1:** Google Colab (gratis) o Anaconda. Variables, listas, diccionarios, `if` y `for`.
- **Semana 2:** leé con Pandas una planilla de tu laburo (anonimizada), filtrá y creá columnas.
- **Semana 3:** `merge` con un maestro y `groupby` con variaciones mensuales (`pct_change`).
- **Semana 4:** automatizá un proceso real y medí cuánto tiempo te ahorra.

## Datos públicos para practicar sin usar info del laburo

Para armar ejercicios y portafolio sin exponer datos de tu empresa, usá fuentes abiertas:

- **datos.gob.ar**: el portal nacional de datos abiertos, con conjuntos de comercio, transporte, energía y más, muchos en CSV.
- **Series de tiempo oficiales**: indicadores económicos que podés descargar y cruzar con ventas ficticias para practicar ajustes por inflación.
- **Portales de datos de ciudades y provincias**: varias jurisdicciones publican presupuesto, movilidad o servicios en formatos abiertos.

Un ejercicio que funciona muy bien en entrevistas: tomar una serie de ventas nominales (inventada o pública), deflactarla con un índice de precios oficial descargado con Python y mostrar en un gráfico la diferencia entre crecer en pesos y crecer en términos reales. Demuestra Pandas, Matplotlib y criterio de negocio en un solo proyecto.

Antes de usar cualquier conjunto, revisá la fecha de actualización y la metodología que publica la fuente.

## Si apuntás a laburos para el exterior

- **Escribí tu código en inglés**: nombres de variables, comentarios y títulos de gráficos.
- **Subí tus proyectos a GitHub** con un README que explique el problema y el resultado.
- **Practicá explicar tu código en voz alta**: muchas entrevistas técnicas son en vivo.
- **Sumá SQL**: casi ninguna búsqueda de datos pide Python solo.

En Bumeran, ZonaJobs, GetOnBoard y LinkedIn, buscá también «data analyst», «analista de pricing» y «analista de riesgo»: muchos piden Python aunque no lo pongan en el título.

## Errores comunes al arrancar

- **Coma decimal mal leída.** Un precio de «1.234,56» se convierte en otra cosa si no lo limpiás.
- **Comparar montos nominales** entre meses sin calcular variación.
- **`merge` que duplica filas.** Revisá cantidad de filas antes y después.
- **Copiar código de internet sin entenderlo.** Si no sabés qué hace cada línea, cuando cambie el formato del archivo no vas a poder arreglarlo.
- **Guardar todo en un solo cuaderno eterno.** Separá lectura, limpieza y resumen en pasos claros; te va a resultar mucho más fácil encontrar errores.
- **Saltar a machine learning** sin dominar limpieza y agregación.

## Cómo elegir un curso de Python online en Argentina

- **Que esté enfocado en datos**, con Pandas como eje.
- **Que sea en vivo y en tu horario**.
- **Que use casos de negocio**, no solo ejercicios abstractos.
- **Que tenga grabaciones** para repasar.
- **Que conecte con SQL y Power BI**.

## El curso Python en vivo de ProgramBI (Argentina)

Datos de la [ficha del curso para Argentina](https://www.programbi.com/ar/cursos/python), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30**, hora de Argentina.
- **20 horas, 8 módulos**, nivel básico-intermedio, desde cero.
- Temario: variables, tipos de datos y operadores; control de flujo y funciones; listas, diccionarios y tuplas; módulos y librerías; DataFrames y Series con Pandas; limpieza y transformación; GroupBy, agregaciones y Merge; conexión a bases de datos y APIs; visualización con Matplotlib; IA aplicada a Python.
- **Nivel avanzado**: análisis avanzado con Pandas y ciencia de datos aplicada a negocios.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Inicio: **lunes 23 de noviembre de 2026**. Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**[CTA-END]** — {precio_local} · lunes y miércoles 19:30–21:30 hora de Argentina · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto sale el curso de Python en Argentina?**
El nivel básico-intermedio de 20 horas cuesta {precio_local}, con grabaciones de por vida y certificado.

**¿Es online?**
Sí, online y en vivo por Zoom, lunes y miércoles de 19:30 a 21:30, hora de Argentina.

**¿Necesito saber programar?**
No. Arranca desde los fundamentos y llega hasta análisis con Pandas.

**¿Me sirve para búsquedas remotas del exterior?**
Python y Pandas son herramientas habituales en esas búsquedas; además te van a pedir SQL, inglés y un portafolio.

**¿Qué diferencia hay con Power BI?**
Python prepara y automatiza los datos; Power BI los presenta en tableros. Se usan juntos.

**¿Hay certificado?**
Sí, certificado digital de ProgramBI al completar el curso.
