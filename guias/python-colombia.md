---
slug: curso-python-colombia
ruta_sugerida: /co/guias/curso-python-colombia
pais: co
hreflang: es-CO
curso: python
url_curso: https://www.programbi.com/co/cursos/python
title: "Curso de Python en Colombia en vivo: guía 2026 | ProgramBI"
meta: "Curso de Python online en vivo en Colombia: Python para datos desde cero en 20 h, lunes y miércoles 17:30. Pandas, ejemplos locales y automatización de informes."
h1: "Curso de Python en Colombia: Python para análisis de datos, en vivo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/co/cursos/python
  - https://www.programbi.com/co/cursos/sql-server
  - https://www.programbi.com/co/cursos/power-bi
  - https://www.programbi.com/co/cursos/analisis-de-datos
  - https://co.computrabajo.com/salarios/analista-de-datos
nota_hermes: |
  Intención: "curso Python online en vivo Colombia", "curso Python para análisis de datos Colombia" → click_registro en /co/cursos/python. country=co, course=python.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave python × co. Monto sin definir por Manu: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - Horario ficha: lunes y miércoles 17:30–19:30 hora de Colombia; inicio lunes 23 nov 2026.
  - ELEMENTO VISUAL: bloque «En 30 segundos» (respuesta corta) arriba + tabla comparativa «Excel vs. Python» renderizada como componente.
  - Sueldo: Computrabajo CO ya citado en las guías de Análisis de datos y SQL CO (dato de Radar 4 nov 2026; 403 a bots, revalidar). Citado con link.
  - Schema Article + FAQPage + BreadcrumbList, sin Course/Offer. WhatsApp: "Hola, vengo de la guía de Python para Colombia en programbi.com y quiero info del curso en vivo".
---

# Curso de Python en Colombia: Python para análisis de datos, en vivo

**Respuesta corta:** el [curso de Python para datos de ProgramBI en Colombia](https://www.programbi.com/co/cursos/python) es **online y en vivo por Zoom**: **20 horas, 8 módulos**, nivel básico-intermedio, los **lunes y miércoles de 17:30 a 19:30, hora de Colombia**. Arranca el **lunes 23 de noviembre de 2026** y su valor es **{precio_local}**. Trae grabaciones de por vida y certificado.

**¿Qué aprendes?** Python desde cero orientado a datos: lo básico del lenguaje (variables, funciones, listas y diccionarios) y luego Pandas para depurar, transformar, agrupar y cruzar bases; gráficos con Matplotlib y conexión a bases de datos y APIs. En el trabajo diario significa que la base de 500.000 filas que hoy bloquea tu Excel se procesa en segundos.

**[CTA-TOP]** — Próxima clase en vivo: lunes 23 de noviembre de 2026 · 17:30 hora de Colombia · «Ver el curso».

## El problema que Python resuelve en empresas colombianas

En Colombia hay sectores que generan volúmenes enormes de registros: una EPS procesa autorizaciones y facturación de miles de IPS; un banco registra millones de transacciones; un BPO guarda cada interacción de cada agente; un operador logístico en Barranquilla o Buenaventura rastrea cada contenedor. El área de negocio suele recibir esos datos en planos o en archivos de Excel gigantes que se cuelgan al abrirlos.

Python con Pandas fue pensado para eso. Lee archivos que Excel no soporta, los depura, los cruza con otras fuentes y entrega solo lo que importa. Y lo hace igual cada vez, sin depender de que alguien recuerde qué fórmula iba en qué columna.

## ¿Excel o Python? Una comparación honesta

| Criterio | Excel | Python con Pandas |
|---|---|---|
| Límite de filas por hoja | Algo más de un millón | El que permita la memoria del equipo |
| Repetir el mismo proceso cada semana | Manual o con macros | Un script reutilizable |
| Unir muchos archivos | Copiar y pegar o Power Query | Una línea con `concat` |
| Revisar qué se hizo | Difícil de rastrear | El código documenta cada paso |
| Curva de aprendizaje | Baja | Media, pero se recupera rápido |

Excel sigue siendo excelente para análisis rápidos. Python gana cuando el proceso es grande, repetitivo o necesita quedar documentado.

## Lo que pide el mercado (referencia)

En las vacantes de analista de datos en Colombia, Python aparece cada vez más junto a SQL, Excel y Power BI. Como referencia, Computrabajo Colombia informa un sueldo medio de **$2.416.855 COP al mes** para «analista de datos», con 7.156 salarios de los últimos 12 meses (consultado el 4 de noviembre de 2026). [co.computrabajo.com/salarios/analista-de-datos](https://co.computrabajo.com/salarios/analista-de-datos) La media mezcla cargos muy distintos; los que piden Python y SQL suelen ubicarse arriba.

## Ejemplos con datos colombianos

**Leer un plano de texto separado por punto y coma (muy común en salud y banca):**
```python
import pandas as pd
facturas = pd.read_csv("facturacion_ips.txt", sep=";", encoding="latin-1",
                       dtype={"nit": str, "cedula": str})
```

**Depurar cédulas y NIT con puntos, espacios o dígito de verificación pegado:**
```python
facturas["cedula"] = facturas["cedula"].str.replace(r"\D", "", regex=True)
facturas["nit"] = facturas["nit"].str.split("-").str[0].str.replace(".", "", regex=False)
```

**Valor facturado por departamento y mes:**
```python
facturas["fecha"] = pd.to_datetime(facturas["fecha"], dayfirst=True)
resumen = (facturas.groupby(["departamento", facturas["fecha"].dt.to_period("M")])
                   ["valor_cop"].sum().reset_index())
```

**Detectar facturas duplicadas antes de pagar:**
```python
dup = facturas[facturas.duplicated(subset=["nit", "numero_factura"], keep=False)]
```

Leer cédulas y NIT como texto (`dtype=str`) evita que Pandas los convierta en número y les quite ceros o los muestre en notación científica.

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas en pesos colombianos.

## Caso: el informe diario de un call center

Un analista de WFM en un BPO de Medellín recibe cada mañana el detalle de llamadas del día anterior: más de 200.000 registros. Necesita nivel de servicio, tiempo medio de atención y ausentismo por campaña. Con Python:

```python
llamadas = pd.read_csv("llamadas_ayer.csv", parse_dates=["inicio"])
kpis = llamadas.groupby("campania").agg(
    llamadas=("id", "count"),
    tma_seg=("duracion_seg", "mean"),
    nivel_servicio=("espera_seg", lambda s: (s <= 20).mean()))
kpis.to_excel("kpis_diarios.xlsx")
```

El script corre en segundos. El analista llega, revisa el resultado y dedica la mañana a explicar por qué una campaña cayó, no a calcularlo.

## Ruta de aprendizaje recomendada

1. **Excel bien dominado**: si te falta base, el [curso de Excel](https://www.programbi.com/co/cursos/excel).
2. **SQL** para extraer: [curso de SQL Server](https://www.programbi.com/co/cursos/sql-server).
3. **Python con Pandas** para depurar y automatizar (este curso).
4. **Power BI** para presentar: [curso de Power BI](https://www.programbi.com/co/cursos/power-bi) y [guía de Power BI para Colombia](/co/guias/como-aprender-power-bi-en-colombia).

Si quieres SQL, Power BI y Python en un programa, está el [curso de Análisis de datos](https://www.programbi.com/co/cursos/analisis-de-datos).

## Plan de práctica de cuatro semanas

- **Semana 1:** abre Google Colab (gratis) y practica tipos de datos, listas, diccionarios y ciclos.
- **Semana 2:** carga con Pandas un archivo de tu trabajo (anonimizado). Filtra, ordena y crea columnas.
- **Semana 3:** cruza con `merge` y resume con `groupby` por ciudad, oficina o campaña.
- **Semana 4:** automatiza un informe que hoy haces a mano y compáralo con el resultado manual.

## Cargos que piden Python en Colombia

En Computrabajo, elempleo.com, Magneto y LinkedIn, Python aparece en avisos de «analista de datos», «analista de riesgo», «analista de información en salud», «analista de WFM» e «inteligencia de negocios». En empresas multinacionales y en trabajos remotos para el exterior, suele ir acompañado de SQL e inglés.

## Datos personales: cuidado al practicar

Si practicas con bases de tu empresa, recuerda que en Colombia el tratamiento de datos personales está regulado. Trabaja con datos anonimizados (quita nombres, cédulas y teléfonos) y nunca subas bases reales a servicios en la nube sin autorización de tu empresa. Para tu portafolio, usa datos sintéticos o públicos.

## Tu primer portafolio con Python

Un reclutador en Bogotá o Medellín revisa muchos perfiles en poco tiempo. Un proyecto corto y claro te diferencia:

1. **Elige un problema de tu sector**: glosas en salud, mora en una cooperativa, SLA en un call center o rotación de inventario en retail.
2. **Usa datos sintéticos o públicos**: genera una base de ejemplo con Pandas o descarga un conjunto de datos abiertos del Estado.
3. **Muestra el antes y el después**: cuánto tomaba el proceso manual y cuánto toma el script.
4. **Publica un cuaderno de Jupyter** con código, gráficos y conclusiones en lenguaje de negocio.
5. **Cuéntalo en LinkedIn** en cinco líneas, con una imagen del resultado.

Ese proyecto te sirve en la entrevista: te van a preguntar cómo resolviste un problema, y tendrás uno concreto para contar.

## Errores comunes al empezar

- **Leer identificadores como número.** Cédulas y NIT pierden ceros o se ven en notación científica.
- **Fechas en formato día/mes.** Usa `dayfirst=True` o el formato explícito al convertir.
- **Uniones que duplican filas.** Revisa `len(df)` antes y después del `merge`.
- **Copiar código sin entenderlo.** Cuando falle, no sabrás corregirlo.
- **Saltar a modelos predictivos** antes de dominar la limpieza.

## Cómo elegir un curso de Python online en Colombia

- **Enfocado en análisis de datos**, con Pandas como eje.
- **En vivo y en hora colombiana**.
- **Casos de negocio reales**: facturación, cartera, operaciones.
- **Grabaciones de por vida**.
- **Integración con SQL y Power BI**.

## El curso Python en vivo de ProgramBI (Colombia)

Según la [ficha del curso para Colombia](https://www.programbi.com/co/cursos/python), revisada el 4 de noviembre de 2026:

- **En vivo por Zoom**, lunes y miércoles de **17:30 a 19:30**, hora de Colombia.
- **20 horas, 8 módulos**, nivel básico-intermedio, desde cero.
- Temario: variables, tipos de datos y operadores; control de flujo y funciones; listas, diccionarios y tuplas; módulos y librerías; DataFrames y Series con Pandas; limpieza y transformación; GroupBy, agregaciones y Merge; conexión a bases de datos y APIs; visualización con Matplotlib; IA aplicada a Python.
- **Nivel avanzado**: análisis avanzado con Pandas y ciencia de datos aplicada a negocios.
- **Grabaciones de por vida**, **certificado** y proyectos con datos reales.
- Inicio: **lunes 23 de noviembre de 2026**. Valor: **{precio_local}**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · lunes y miércoles 17:30–19:30 hora de Colombia · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto vale el curso de Python en Colombia?**
El nivel básico-intermedio de 20 horas tiene un valor de {precio_local}, con grabaciones de por vida y certificado.

**¿El curso es online?**
Sí, online y en vivo por Zoom, lunes y miércoles de 17:30 a 19:30, hora de Colombia.

**¿Necesito experiencia en programación?**
No. Se parte desde cero y se llega hasta análisis con Pandas.

**¿Python sirve para archivos que Excel no puede abrir?**
Sí. Pandas procesa archivos mucho más grandes que el límite de filas de Excel, según la memoria de tu equipo.

**¿Cómo se relaciona con Power BI?**
Python limpia y prepara los datos; Power BI los presenta en tableros.

**¿Dan certificado?**
Sí, un certificado digital de ProgramBI al finalizar.
