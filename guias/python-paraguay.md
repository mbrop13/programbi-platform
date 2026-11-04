---
slug: curso-python-paraguay
ruta_sugerida: /py/guias/curso-python-paraguay
pais: py
hreflang: es-PY
curso: python
url_curso: https://www.programbi.com/py/cursos/python
title: "Curso de Python Paraguay en vivo: guía 2026 | ProgramBI"
meta: "Curso de Python online en vivo en Paraguay: Python para datos desde cero en 20 h, lunes y miércoles 19:30. Pandas, ejemplos locales y automatización de reportes."
h1: "Curso de Python en Paraguay: Python para datos, online y en vivo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/py/cursos/python
  - https://www.programbi.com/py/cursos/sql-server
  - https://www.programbi.com/py/cursos/power-bi
  - https://www.programbi.com/py/cursos/analisis-de-datos
nota_hermes: |
  Intención: "curso Python online en vivo Paraguay", "curso Python para análisis de datos Paraguay" → click_registro en /py/cursos/python. country=py, course=python.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave python × py (USD). Manu no definió el monto: NO escribas cifras. La ficha /py/ ya publica un Offer en USD no aprobado: WS1 debe quitarlo o alinearlo. Sin valor → "Consultá el valor por WhatsApp" y sin Offer.
  - Horario ficha: lunes y miércoles 19:30–21:30 hora de Paraguay; inicio lunes 23 nov 2026. Voseo moderado.
  - ELEMENTO VISUAL: diagrama de la ruta de aprendizaje (planillas → SQL → Python → Power BI) + bloque «En 30 segundos».
  - Sueldo omitido: no hay fuente pública con muestra suficiente.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de Python para Paraguay en programbi.com y quiero info del curso en vivo".
---

# Curso de Python en Paraguay: Python para datos, online y en vivo

**Respuesta corta:** el [curso de Python para datos de ProgramBI para Paraguay](https://www.programbi.com/py/cursos/python) es **online y en vivo por Zoom**: **20 horas, 8 módulos**, nivel básico-intermedio, los **lunes y miércoles de 19:30 a 21:30, hora de Paraguay**. Empieza el **lunes 23 de noviembre de 2026** y el valor es **{precio_local}**. Tenés grabaciones de por vida y certificado.

**¿Qué vas a aprender?** Python desde cero con foco en análisis de datos: las bases del lenguaje y, sobre todo, Pandas para limpiar, transformar, agrupar y cruzar tablas; gráficos con Matplotlib y conexión a bases de datos y APIs. En el trabajo, eso significa que el consolidado que hoy armás con planillas que llegan por correo o por WhatsApp se genera con un script.

**[CTA-TOP]** — Próxima clase en vivo: lunes 23 de noviembre de 2026 · 19:30 hora de Paraguay · «Ver el curso».

## Por qué aprender Python en Paraguay

La economía paraguaya mueve mucho volumen con equipos chicos: agroindustria y ganadería, bancos, financieras y cooperativas, comercio y distribución, maquila, energía y logística fluvial. En muchos de esos lugares la información vive en planillas que cada sucursal, silo o planta manda por su cuenta, y una persona las junta a mano cada semana.

Python con Pandas automatiza ese trabajo. Y como todavía hay relativamente pocos perfiles de negocio que lo dominan, aprenderlo te diferencia rápido: pasás de ser quien arma el reporte a ser quien lo explica y propone mejoras.

## Planillas, Python y Power BI: cuándo usar cada uno

| Tarea | Herramienta |
|---|---|
| Un cálculo rápido o una tabla dinámica | Excel |
| Juntar las planillas de 20 sucursales con formatos distintos | Python |
| Limpiar cédulas, teléfonos y nombres en miles de filas | Python |
| Tablero para la gerencia que se actualiza solo | Power BI |
| Proceso semanal completo, de las planillas al tablero | Python + Power BI |

No compiten: Python prepara y automatiza; Power BI presenta.

## ¿Y el sueldo?

No encontramos una fuente pública con muestra suficiente y metodología clara sobre sueldos de perfiles con Python en Paraguay, así que preferimos no publicar una cifra. Para una referencia real, revisá los avisos con remuneración visible en Computrabajo Paraguay y las bases de Paraguay Concursa, que publican el salario de cada puesto.

## Ejemplos con datos paraguayos

**Unir las planillas de todas las sucursales:**
```python
import pandas as pd
from pathlib import Path

ventas = pd.concat(
    [pd.read_excel(f, dtype={"ci": str}).assign(sucursal=f.stem)
     for f in Path("sucursales").glob("*.xlsx")],
    ignore_index=True)
```

**Limpiar cédulas con puntos («1.234.567»):**
```python
ventas["ci"] = ventas["ci"].str.replace(r"\D", "", regex=True)
```

**Montos en guaraníes escritos como texto («Gs. 1.500.000»):**
```python
ventas["monto"] = (ventas["monto"].astype(str)
                   .str.replace(r"[^0-9]", "", regex=True)
                   .astype("int64"))
```

**Ventas por zona y mes:**
```python
ventas["mes"] = pd.to_datetime(ventas["fecha"], dayfirst=True).dt.to_period("M")
resumen = ventas.pivot_table(index="zona", columns="mes", values="monto",
                             aggfunc="sum", fill_value=0)
resumen.to_excel("ventas_zona_mes.xlsx")
```

Usar `int64` para los montos en guaraníes evita problemas con cifras grandes, y leer la cédula como texto impide que se pierdan dígitos.

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas.

## Caso: la cartera de una cooperativa, al día

Una cooperativa con sucursales en Asunción, Ciudad del Este y Encarnación arma cada lunes el reporte de mora juntando las planillas de cada sucursal. Con Python:

```python
cartera = pd.concat([pd.read_excel(f) for f in Path("cartera").glob("*.xlsx")])
cartera["tramo"] = pd.cut(cartera["dias_atraso"], bins=[-1, 30, 60, 90, 10_000],
                          labels=["0-30", "31-60", "61-90", "+90"])
mora = cartera.pivot_table(index="sucursal", columns="tramo",
                           values="saldo", aggfunc="sum", fill_value=0)
```

`pd.cut` clasifica cada crédito por tramo de atraso en una línea. El consejo de administración recibe el reporte el lunes temprano y el analista dedica su tiempo a explicar qué sucursal necesita atención.

## Ruta de aprendizaje recomendada

1. **Planillas con soltura**: si te falta base, el [curso de Excel](https://www.programbi.com/py/cursos/excel).
2. **SQL** para extraer datos del sistema: [curso de SQL Server](https://www.programbi.com/py/cursos/sql-server).
3. **Python con Pandas** para limpiar y automatizar (este curso).
4. **Power BI** para presentar: [curso de Power BI](https://www.programbi.com/py/cursos/power-bi) y [guía de Power BI en Paraguay](/py/guias/como-aprender-power-bi-en-paraguay).

Si querés las tres herramientas técnicas juntas, está el [curso de Análisis de datos](https://www.programbi.com/py/cursos/analisis-de-datos).

## Plan de práctica de cuatro semanas

- **Semana 1:** abrí Google Colab (gratis, en el navegador) y practicá variables, listas, diccionarios y ciclos.
- **Semana 2:** leé con Pandas una planilla de tu trabajo (anonimizada), filtrá, ordená y creá columnas.
- **Semana 3:** juntá varias planillas con `concat`, cruzá con `merge` y resumí con `groupby` o `pivot_table`.
- **Semana 4:** automatizá un reporte real y compará el resultado con el que hacías a mano.

## Cinco procesos para automatizar en tu primer mes

- **El consolidado semanal de ventas** por sucursal o zona.
- **El reporte de mora** por tramo de atraso en bancos, financieras o cooperativas.
- **El acopio por silo y tipo de grano** en agroindustria.
- **El control de stock** en distribuidoras: productos sin movimiento y quiebres.
- **La depuración del padrón de clientes o socios**: cédulas duplicadas, teléfonos mal cargados, nombres inconsistentes.

Cada uno sigue el mismo patrón —leer, limpiar, unir y resumir— y cada uno es una historia concreta para contar en una entrevista: qué hacías antes, qué hace el script y cuánto tiempo ahorrás.

## Herramientas gratuitas para empezar

- **Google Colab**: Python en el navegador, sin instalar nada. Ideal si la computadora del trabajo tiene restricciones.
- **Anaconda**: instala Python, Pandas, Matplotlib y Jupyter en un solo paso.
- **Jupyter Notebook**: combina código, resultados y notas; sirve para documentar tu análisis y compartirlo.
- **VS Code**: un editor gratuito para cuando tus scripts crezcan.

Arrancá con Colab. Cuando automatices tu primer reporte real y quieras correrlo cada semana desde tu computadora, pasá a Anaconda.

## Un proyecto para tu portafolio

Tomá un reporte que hoy hagas a mano, anonimizá los datos (sin cédulas ni nombres reales), escribí el script que lo genera y documentá en un cuaderno de Jupyter el antes y el después: cuánto tardabas, cuánto tarda ahora y qué decisiones permite tomar. Es la mejor prueba de lo que sabés hacer, y lo podés mostrar en cualquier entrevista sin exponer información de tu empresa.

## Dónde se pide Python en Paraguay

En Computrabajo Paraguay, LinkedIn y Paraguay Concursa, Python aparece en avisos de «analista de datos», «analista de riesgo», «analista comercial» y en multinacionales y posiciones remotas. Muchas veces el aviso dice «automatización de reportes» o «manejo de grandes volúmenes de datos» sin nombrar Python: leé la descripción completa.

## Errores comunes al arrancar

- **Leer cédulas como número** y perder dígitos o formato.
- **Montos en guaraníes como texto** que no suman.
- **No verificar que llegaron todas las planillas** antes de calcular indicadores.
- **Uniones que duplican filas.** Revisá la cantidad de filas antes y después del `merge`.
- **Copiar código sin entenderlo.** Cuando cambie el formato de una planilla, no vas a poder arreglarlo.

## Cómo elegir un curso de Python online en Paraguay

- **Enfocado en análisis de datos**, con Pandas como eje.
- **En vivo y en hora paraguaya**.
- **Con casos de negocio**: cartera, ventas, stock, acopio.
- **Con grabaciones de por vida**.
- **Que conecte con SQL y Power BI**.

## El curso Python en vivo de ProgramBI (Paraguay)

Según la [ficha del curso para Paraguay](https://www.programbi.com/py/cursos/python), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30**, hora de Paraguay.
- **20 horas, 8 módulos**, nivel básico-intermedio, desde cero.
- Temario: variables, tipos de datos y operadores; control de flujo y funciones; listas, diccionarios y tuplas; módulos y librerías; DataFrames y Series con Pandas; limpieza y transformación; GroupBy, agregaciones y Merge; conexión a bases de datos y APIs; visualización con Matplotlib; IA aplicada a Python.
- **Nivel avanzado**: análisis avanzado con Pandas y ciencia de datos aplicada a negocios.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Inicio: **lunes 23 de noviembre de 2026**. Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**[CTA-END]** — {precio_local} · lunes y miércoles 19:30–21:30 hora de Paraguay · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Python en Paraguay?**
El valor del nivel básico-intermedio de 20 horas es {precio_local}; si aún no aparece, consultalo por WhatsApp.

**¿Es online?**
Sí, online y en vivo por Zoom, lunes y miércoles de 19:30 a 21:30, hora de Paraguay.

**¿Necesito saber programar?**
No. Se parte desde los fundamentos y se llega hasta análisis con Pandas.

**¿Sirve para juntar planillas de varias sucursales?**
Sí. Es uno de los usos más comunes: leer muchos archivos, estandarizarlos y resumirlos con un script.

**¿Cómo se usa con Power BI?**
Python limpia y prepara los datos; Power BI los presenta en tableros.

**¿Hay certificado?**
Sí, un certificado digital de ProgramBI al completar el curso.
