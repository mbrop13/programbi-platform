---
slug: curso-python-chile
ruta_sugerida: /guias/curso-python-chile
pais: cl
hreflang: es-CL
curso: python
url_curso: https://www.programbi.com/cursos/python
title: "Curso de Python en Chile en vivo: guía 2026 | ProgramBI"
meta: "Curso de Python online en vivo en Chile: Python para datos desde cero en 20 h, lunes y miércoles 19:30, por $169.000 CLP. Pandas, ejemplos y cómo automatizar reportes."
h1: "Curso de Python en Chile: Python para datos, online y en vivo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/cursos/python
  - https://www.programbi.com/cursos/sql-server
  - https://www.programbi.com/cursos/power-bi
  - https://www.programbi.com/cursos/analisis-de-datos
  - https://www.chiletrabajos.cl/sueldos/analista/datos
nota_hermes: |
  Intención: "curso Python online en vivo Chile", "curso Python para análisis de datos Chile", "aprender Python desde cero" → click_registro en /cursos/python. country=cl, course=python.
  - PRECIO: 169.000 CLP confirmado por Manu (4 nov 2026) para cursos básico-intermedio. Léelo igual como {precio_local} desde config/pricing.ts para no desalinear guía, ficha, Offer y checkout. El JSON-LD actual dice 249.000: debe corregirlo WS1.
  - Horario de la ficha: lunes y miércoles 19:30–21:30 hora de Chile; inicio lunes 23 nov 2026.
  - ELEMENTO VISUAL: tabla comparativa «Excel vs. Python vs. Power BI: cuándo usar cada uno» (ya va en el texto como tabla; renderízala como componente destacado) + bloque «En 30 segundos» con los datos de la respuesta corta.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. CTAs §2.5 con course=python.
  - WhatsApp: "Hola, vengo de la guía de Python para Chile en programbi.com y quiero info del curso en vivo".
  - Sueldo: Chiletrabajos (misma fuente que las guías de Análisis de datos y SQL Server), citado con link.
---

# Curso de Python en Chile: Python para datos, online y en vivo

**Respuesta corta:** el [curso de Python para datos de ProgramBI](https://www.programbi.com/cursos/python) es un curso **online y en vivo por Zoom** para Chile: **20 horas, 8 módulos, nivel básico-intermedio**, los **lunes y miércoles de 19:30 a 21:30, hora de Chile**. Parte el **lunes 23 de noviembre de 2026** y cuesta **$169.000 CLP**, con grabaciones de por vida y certificado.

**¿Qué aprendes?** Python desde cero enfocado en datos, no en desarrollo de software: variables, funciones, listas y diccionarios, y luego Pandas para limpiar, transformar, agrupar y cruzar tablas, gráficos con Matplotlib y conexión a bases de datos y APIs. En la pega se traduce en dejar de copiar y pegar planillas: un script hace en segundos lo que hoy te toma la mañana.

**[CTA-TOP]** — Próxima clase en vivo: lunes 23 de noviembre de 2026 · 19:30 hora de Chile · «Ver el curso».

## Para qué sirve Python si trabajas con Excel

Si eres de finanzas, control de gestión u operaciones, probablemente tu semana tiene una tarea repetida: bajar diez archivos (uno por sucursal, por banco o por proveedor), juntarlos, limpiar columnas, cruzar con un maestro y armar el resumen. Excel aguanta hasta cierto punto; cuando los archivos pasan el millón de filas o son cuarenta, se vuelve lento y frágil.

Python resuelve justo eso. Con la librería Pandas lees todos los archivos de una carpeta, los unes, corriges formatos y exportas el resultado en un par de líneas. La próxima semana corres el mismo script y listo. No necesitas ser programador: necesitas entender tus datos, y eso ya lo sabes.

## Excel, Python y Power BI: cuándo usar cada uno

| Necesidad | Mejor herramienta |
|---|---|
| Un cálculo rápido o un análisis puntual | Excel |
| Unir muchos archivos o limpiar datos desordenados | Python (Pandas) |
| Archivos de más de un millón de filas | Python o SQL |
| Tablero para gerencia que se actualiza solo | Power BI |
| Automatizar un proceso semanal de punta a punta | Python + Power BI |

No compiten: Python prepara, Power BI presenta. Por eso conviene mirarlos juntos (más abajo te dejamos la ruta).

## Lo que se pide en el mercado chileno (referencia)

En los avisos de «analista de datos» Python aparece cada vez más junto a SQL, Excel y Power BI, sobre todo en banca, retail y empresas de tecnología. Como referencia de sueldo, Chiletrabajos informa un sueldo **pretendido** promedio de **$979.205 al mes** para «analista datos» (noviembre de 2026; es lo que piden los postulantes, no lo que pagan las empresas). [chiletrabajos.cl/sueldos/analista/datos](https://www.chiletrabajos.cl/sueldos/analista/datos)

Python no es un cargo; es la herramienta que te permite hacer el trabajo de un analista más rápido y con menos errores.

## Ejemplos con datos chilenos

**Unir los reportes de todas las sucursales de una carpeta:**
```python
import pandas as pd
from pathlib import Path

archivos = Path("reportes_octubre").glob("*.xlsx")
ventas = pd.concat([pd.read_excel(f) for f in archivos], ignore_index=True)
```

**Limpiar montos que vienen como texto «$1.234.567»:**
```python
ventas["monto_clp"] = (ventas["monto"].astype(str)
                       .str.replace(r"[$.\s]", "", regex=True)
                       .astype(int))
```

**Normalizar el RUT para cruzar con el maestro de clientes:**
```python
ventas["rut"] = ventas["rut"].str.replace(r"[.\-]", "", regex=True).str.upper()
clientes["rut"] = clientes["rut"].str.replace(r"[.\-]", "", regex=True).str.upper()
base = ventas.merge(clientes, on="rut", how="left")
```

**Resumen por región y mes, listo para gerencia:**
```python
resumen = (base.groupby(["region", base["fecha"].dt.to_period("M")])["monto_clp"]
               .sum().reset_index())
resumen.to_excel("resumen_ventas.xlsx", index=False)
```

Con esas cuatro piezas automatizas un reporte que muchos equipos todavía arman a mano cada mes.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en pesos chilenos.

## Caso: la conciliación bancaria de los lunes

Un analista de tesorería en Santiago recibe cada lunes las cartolas de tres bancos en formatos distintos y las concilia contra el libro de pagos del ERP. En Excel, la mañana completa. En Python:

```python
cartolas = pd.concat([leer_banco_a(), leer_banco_b(), leer_banco_c()])
conciliado = cartolas.merge(pagos, on=["monto_clp", "fecha"], how="outer", indicator=True)
pendientes = conciliado[conciliado["_merge"] != "both"]
```

La variable `pendientes` contiene exactamente lo que no cuadra. El analista revisa diez filas en vez de mil.

## La ruta: Python dentro del oficio de datos

1. **Excel sólido**: tablas, tablas dinámicas y BUSCARX.
2. **SQL** para sacar datos de la base: mira el [curso de SQL Server](https://www.programbi.com/cursos/sql-server).
3. **Python con Pandas** para limpiar, unir y automatizar (este curso).
4. **Power BI** para presentar: [curso de Power BI](https://www.programbi.com/cursos/power-bi) y [guía de Power BI en Chile](/guias/como-aprender-power-bi-en-chile).

Si quieres las tres herramientas en un solo programa, está el [curso de Análisis de datos](https://www.programbi.com/cursos/analisis-de-datos).

## Plan de práctica de cuatro semanas

- **Semana 1 · Fundamentos.** Instala Python (Anaconda o la versión oficial) o usa Google Colab en el navegador, gratis. Practica variables, listas, diccionarios y un `for`.
- **Semana 2 · Pandas básico.** Lee un Excel de tu trabajo (anonimizado), filtra, ordena y crea columnas nuevas.
- **Semana 3 · Unir y agrupar.** `merge` para cruzar con un maestro y `groupby` para resumir por sucursal y mes.
- **Semana 4 · Automatiza.** Convierte tu reporte semanal en un script que lea la carpeta, limpie, resuma y exporte.

## Seis tareas que puedes automatizar en tu primer mes

- **Consolidar reportes de sucursales** que llegan por correo en Excel, cada uno con su propio formato.
- **Cuadrar ventas del ERP contra el libro de ventas** y listar solo las diferencias.
- **Actualizar el maestro de clientes**: quitar duplicados por RUT, unificar comunas escritas de distintas formas («Stgo», «Santiago», «SANTIAGO»).
- **Calcular indicadores de cobranza**: días de mora por cliente y tramo de antigüedad de la deuda.
- **Descargar datos públicos por API**, como indicadores económicos, y dejarlos listos para cruzar con tus ventas.
- **Generar el mismo gráfico cada semana** con Matplotlib y guardarlo como imagen para el informe.

Cada tarea es una pieza de portafolio: el problema, el script y el tiempo que ahorraste. Es exactamente lo que vale la pena contar en una entrevista.

## Errores típicos al aprender Python para datos

- **Empezar por cursos de programación general.** Para análisis, lo que más usas es Pandas; no necesitas crear aplicaciones.
- **Tipos de dato mal leídos.** Fechas como texto o RUT como número (pierde el dígito verificador «K»). Revisa siempre `df.dtypes`.
- **`merge` que duplica filas.** Igual que en SQL: si el maestro tiene claves repetidas, los totales se inflan.
- **Scripts sin comentarios.** En un mes no recordarás por qué filtraste algo.
- **Querer saltar a machine learning.** Primero domina limpiar y resumir; es el 80 % del trabajo real.

## Cómo elegir un curso de Python online en Chile

- **Enfocado en datos**, con Pandas como protagonista.
- **En vivo y en hora chilena**, para resolver el error del momento.
- **Con ejemplos de negocio**, no solo ejercicios matemáticos.
- **Con grabaciones**, para repasar cuando un cierre de mes te quite una clase.
- **Que conecte con SQL y Power BI**, porque así se usa en la pega.

## El curso Python en vivo de ProgramBI

Datos de la [ficha del curso](https://www.programbi.com/cursos/python), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30**, hora de Chile.
- **20 horas, 8 módulos**, nivel básico-intermedio, desde cero, para perfiles administrativos, financieros, comerciales, ingenieros y de analítica.
- Temario: variables, tipos de datos y operadores; control de flujo y funciones; listas, diccionarios y tuplas; módulos y librerías; DataFrames y Series con Pandas; limpieza y transformación; GroupBy, agregaciones y Merge; conexión a bases de datos y APIs; visualización con Matplotlib; e IA aplicada a Python.
- **Nivel avanzado**: análisis avanzado con Pandas y ciencia de datos aplicada a negocios.
- **Grabaciones de por vida**, **certificado** al completar y proyectos con datos reales.
- Próximo inicio: **lunes 23 de noviembre de 2026**. Valor: **$169.000 CLP**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI), con capacitaciones en Anglo American, CAP, Deloitte y SQM.
- Para equipos: cotización en `/cursos/python/empresas`.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · lunes y miércoles 19:30–21:30 hora de Chile · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Python en Chile?**
El nivel básico-intermedio cuesta $169.000 CLP e incluye 20 horas en vivo, grabaciones de por vida y certificado.

**¿El curso de Python es online?**
Sí, online y en vivo por Zoom, lunes y miércoles de 19:30 a 21:30, hora de Chile. Todas las clases quedan grabadas.

**¿Necesito saber programar?**
No. El curso parte desde los fundamentos de Python y sube hasta análisis con Pandas.

**¿Es Python para análisis de datos o para desarrollo?**
Para análisis de datos: Pandas, limpieza, visualización y automatización de reportes.

**¿Python reemplaza a Excel o a Power BI?**
No. Python prepara y automatiza los datos; Excel sigue siendo útil para análisis rápidos y Power BI para presentar tableros.

**¿Entregan certificado?**
Sí, un certificado digital de ProgramBI al completar el curso.
