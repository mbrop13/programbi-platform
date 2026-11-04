---
slug: curso-python-mexico
ruta_sugerida: /mx/guias/curso-python-mexico
pais: mx
hreflang: es-MX
curso: python
url_curso: https://www.programbi.com/mx/cursos/python
title: "Curso de Python en México en vivo: guía 2026 | ProgramBI"
meta: "Curso de Python online en vivo en México: Python para datos desde cero en 20 h, lunes y miércoles 16:30 CDMX. Pandas, ejemplos con CFDI y automatización."
h1: "Curso de Python en México: aprende Python para datos en vivo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/mx/cursos/python
  - https://www.programbi.com/mx/cursos/sql-server
  - https://www.programbi.com/mx/cursos/power-bi
  - https://www.programbi.com/mx/cursos/analisis-de-datos
  - https://www.occ.com.mx/empleos/de-data-analyst/
nota_hermes: |
  Intención: "curso Python online en vivo México", "curso Python para análisis de datos México" → click_registro en /mx/cursos/python. country=mx, course=python.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave python × mx. Monto aún no definido por Manu: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - Horario ficha: lunes y miércoles 16:30–18:30 hora del centro de México; inicio lunes 23 nov 2026.
  - ELEMENTO VISUAL: diagrama de la ruta de aprendizaje (Excel → SQL → Python → Power BI) como componente horizontal, + bloque «En 30 segundos» con la respuesta corta.
  - Referencia salarial: rangos OCC ya citados en las guías de Análisis de datos y SQL Server MX (dato de Radar 4 nov 2026; OCC bloquea bots, revalidar). Citados con link.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de Python para México en programbi.com y quiero info del curso en vivo".
---

# Curso de Python en México: aprende Python para datos en vivo

**Respuesta corta:** el [curso de Python para datos de ProgramBI en México](https://www.programbi.com/mx/cursos/python) es **online y en vivo por Zoom**, con **20 horas en 8 módulos** de nivel básico-intermedio. Las clases son **lunes y miércoles de 16:30 a 18:30, hora del centro de México**, inicia el **lunes 23 de noviembre de 2026** y la inversión es **{precio_local}**. Incluye grabaciones de por vida y certificado.

**¿Qué vas a aprender?** Python desde cero con enfoque en análisis: fundamentos del lenguaje, estructuras de datos y, sobre todo, Pandas para limpiar, transformar, agrupar y unir tablas; gráficos con Matplotlib y conexión a bases de datos y APIs. El objetivo práctico es que el reporte que hoy armas a mano cada semana se genere con un script.

**[CTA-TOP]** — Próxima clase en vivo: lunes 23 de noviembre de 2026 · 16:30 CDMX · «Ver el curso».

## Por qué Python le sirve a quien trabaja con datos en México

En una empresa mexicana típica, la información llega por muchas puertas: el ERP, el portal del SAT con los CFDI, los reportes de cada CEDIS, las plataformas de e-commerce, el sistema de nómina. Cada fuente exporta en su propio formato, y alguien tiene que juntarlo todo. Cuando son tres archivos, Excel basta. Cuando son treinta, o cada uno pesa cientos de miles de filas, el trabajo se vuelve lento, propenso a errores y depende de una sola persona.

Python con Pandas automatiza ese trabajo. Lee una carpeta entera de archivos, los une, corrige formatos de fecha y montos, cruza con catálogos y exporta un resumen limpio. El mismo script sirve la semana siguiente. En corporativos que reportan a matrices en Estados Unidos, además, Python es una herramienta habitual en los equipos de analítica, así que dominarlo te pone en el mismo idioma que ellos.

## Python frente a Excel y Power BI

| Situación | Herramienta recomendada |
|---|---|
| Revisar un dato rápido o hacer una tabla dinámica | Excel |
| Juntar decenas de archivos con formatos distintos | Python |
| Procesar archivos XML o JSON (por ejemplo, CFDI) | Python |
| Presentar KPIs a dirección con actualización automática | Power BI |
| Automatizar el reporte semanal completo | Python + Power BI |

Python no reemplaza a Excel ni a Power BI: los complementa. La combinación más común en vacantes de analista es SQL + Python + Power BI.

## Qué piden las vacantes (referencia)

En OCC Mundial, las vacantes de «data analyst» con sueldo visible mostraban el 4 de noviembre de 2026 rangos mensuales de **$13,000 a $30,000 MXN**, según el puesto. [occ.com.mx/empleos/de-data-analyst](https://www.occ.com.mx/empleos/de-data-analyst/) En la parte alta del rango es frecuente que pidan Python además de SQL y Power BI. Revisa el portal antes de negociar: es una foto de un día.

## Ejemplos con datos mexicanos

**Unir los reportes de venta de todos los CEDIS:**
```python
import pandas as pd
from pathlib import Path

ventas = pd.concat(
    [pd.read_csv(f, encoding="latin-1") for f in Path("cedis").glob("*.csv")],
    ignore_index=True)
```

**Normalizar el RFC antes de cruzar con el catálogo de clientes:**
```python
ventas["rfc"] = ventas["rfc"].str.strip().str.upper()
clientes["rfc"] = clientes["rfc"].str.strip().str.upper()
base = ventas.merge(clientes, on="rfc", how="left")
sin_cliente = base[base["razon_social"].isna()]
```

**Venta por estado y canal, lista para el comité:**
```python
resumen = (base.groupby(["estado", "canal"])["importe_mxn"]
               .sum().unstack(fill_value=0))
resumen.to_excel("venta_estado_canal.xlsx")
```

**Gráfico de tendencia mensual con Matplotlib:**
```python
import matplotlib.pyplot as plt
mensual = base.set_index("fecha").resample("M")["importe_mxn"].sum()
mensual.plot(title="Venta mensual (MXN)")
plt.savefig("tendencia.png", dpi=150)
```

Un detalle útil: muchos archivos exportados en México vienen con codificación latin-1 y acentos rotos. Leerlos con `encoding="latin-1"` evita los famosos «Ã©» en los nombres de estado.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en pesos mexicanos.

## Caso: leer facturas CFDI en lote

Un analista de cuentas por pagar descarga cada mes cientos de CFDI en XML y necesita un listado con emisor, fecha y total. Abrirlos uno por uno es imposible. Con Python:

```python
import xml.etree.ElementTree as ET
filas = []
for f in Path("cfdi").glob("*.xml"):
    raiz = ET.parse(f).getroot()
    emisor = raiz.find("{*}Emisor")
    filas.append({"rfc_emisor": emisor.get("Rfc"),
                  "fecha": raiz.get("Fecha"),
                  "total": float(raiz.get("Total"))})
facturas = pd.DataFrame(filas)
```

En segundos tiene una tabla que puede cruzar contra las órdenes de compra. Lo que antes era una semana de captura se vuelve un proceso de minutos.

## Ruta de aprendizaje recomendada

1. **Excel con soltura**: tablas, filtros, tablas dinámicas. Si te falta, el [curso de Excel](https://www.programbi.com/mx/cursos/excel).
2. **SQL** para extraer datos de la base: [curso de SQL Server](https://www.programbi.com/mx/cursos/sql-server).
3. **Python con Pandas** para limpiar y automatizar (este curso).
4. **Power BI** para presentar: [curso de Power BI](https://www.programbi.com/mx/cursos/power-bi) y [guía de Power BI en México](/mx/guias/como-aprender-power-bi-en-mexico).

¿Prefieres las tres herramientas técnicas en un solo programa? Está el [curso de Análisis de datos](https://www.programbi.com/mx/cursos/analisis-de-datos).

## Plan de práctica de cuatro semanas

- **Semana 1:** usa Google Colab (gratis, en el navegador) o instala Anaconda. Practica variables, listas, diccionarios, `if` y `for`.
- **Semana 2:** lee con Pandas un archivo de tu trabajo (anonimizado), filtra, ordena y crea columnas calculadas.
- **Semana 3:** `merge` con un catálogo y `groupby` por estado, canal y mes.
- **Semana 4:** automatiza un reporte real de principio a fin y mide cuánto tiempo te ahorra.

## Herramientas gratuitas para practicar

- **Google Colab**: Python en el navegador, sin instalar nada; ideal si tu computadora de la oficina tiene restricciones.
- **Anaconda**: instala Python, Pandas, Matplotlib y Jupyter de una sola vez.
- **Jupyter Notebook**: mezcla código, resultados y notas; perfecto para documentar tu análisis paso a paso.
- **VS Code**: editor gratuito para cuando tus scripts crezcan y quieras ordenarlos en archivos.
- **Datos abiertos**: portales públicos con información de comercio, empleo o movilidad sirven para practicar sin usar datos confidenciales de tu empresa.

Empieza con Colab, porque te permite compartir un cuaderno con tu jefe o tu equipo con solo un enlace; cuando ya automatices reportes reales, pasa a Anaconda y VS Code.

## Cargos que piden Python en México

Además de «data analyst», busca en OCC, Computrabajo, Indeed y LinkedIn: «analista de inteligencia de negocios», «analista de planeación de demanda», «analista de pricing» y «analista de riesgos». En empresas que atienden a Estados Unidos, Python e inglés suelen aparecer juntos como requisito.

## Errores comunes al empezar

- **Aprender Python «general» antes que Pandas.** Para análisis, Pandas es el 80 % de lo que vas a usar.
- **No revisar tipos de dato.** Fechas leídas como texto o códigos postales que pierden el cero inicial.
- **Uniones que duplican filas.** Valida el número de filas antes y después de cada `merge`.
- **Scripts que solo funcionan en tu computadora.** Usa rutas relativas y documenta qué archivos necesita.
- **Saltar a machine learning sin dominar la limpieza.** La mayor parte del trabajo real es preparar datos.

## Cómo elegir un curso de Python online en México

- **Enfoque en datos**, no en desarrollo web.
- **En vivo y en hora del centro**, para resolver errores en el momento.
- **Casos de negocio**: ventas, inventario, facturación.
- **Grabaciones** para repasar.
- **Conexión con SQL y Power BI**.

## El curso Python en vivo de ProgramBI (México)

Datos de la [ficha del curso para México](https://www.programbi.com/mx/cursos/python), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, lunes y miércoles de **16:30 a 18:30**, hora del centro de México.
- **20 horas, 8 módulos**, nivel básico-intermedio, desde cero.
- Temario: variables, tipos de datos y operadores; control de flujo y funciones; listas, diccionarios y tuplas; módulos y librerías; DataFrames y Series con Pandas; limpieza y transformación; GroupBy, agregaciones y Merge; conexión a bases de datos y APIs; visualización con Matplotlib; IA aplicada a Python.
- **Nivel avanzado**: análisis avanzado con Pandas y ciencia de datos aplicada a negocios.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Inicio: **lunes 23 de noviembre de 2026**. Inversión: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**[CTA-END]** — {precio_local} · lunes y miércoles 16:30–18:30 CDMX · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Python en México?**
La inversión del nivel básico-intermedio de 20 horas es {precio_local}, con grabaciones de por vida y certificado.

**¿Es un curso de Python online?**
Sí, online y en vivo por Zoom, lunes y miércoles de 16:30 a 18:30, hora del centro de México.

**¿Puedo tomarlo si nunca he programado?**
Sí. Se parte desde los fundamentos y se llega hasta análisis con Pandas.

**¿Sirve para automatizar reportes?**
Sí. Es uno de los objetivos del curso: limpiar, unir y resumir datos con scripts reutilizables.

**¿Qué diferencia hay con el curso de Power BI?**
Python prepara y automatiza los datos; Power BI los presenta en tableros. Se complementan.

**¿Recibo constancia al terminar?**
Sí, un certificado digital de ProgramBI.
