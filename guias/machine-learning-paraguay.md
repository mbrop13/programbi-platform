---
slug: curso-machine-learning-paraguay
ruta_sugerida: /py/guias/curso-machine-learning-paraguay
pais: py
hreflang: es-PY
curso: machine-learning
url_curso: https://www.programbi.com/py/cursos/machine-learning
title: "Curso de Machine Learning Paraguay: guía 2026 | ProgramBI"
meta: "Curso de machine learning en Paraguay en vivo por Zoom: 20 h de modelos predictivos, segmentación y anomalías con Python, de 19:30 a 21:30. Requisito: Python."
h1: "Curso de Machine Learning en Paraguay: tus primeros modelos en serio"
updated: 2026-11-04
sources:
  - https://www.programbi.com/py/cursos/machine-learning
  - https://www.dnit.gov.py/
nota_hermes: |
  ELEMENTO VISUAL: bloque «En 30 segundos» + diagrama de ruta «ventas en guaraníes → RFM → K-Means → segmentos → acción comercial».
  Intención: "curso machine learning paraguay", "curso machine learning asunción online" → click_registro en /py/cursos/machine-learning. country=py, course=machine-learning.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave machine-learning × py. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp". La ficha /py/ puede publicar un Offer en USD no aprobado: WS1 debe quitarlo o alinearlo.
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La ficha menciona «redes neuronales» en el lema pero no en el temario: la guía no las promete.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Machine Learning para Paraguay en programbi.com y quiero info del curso en vivo".
---

# Curso de Machine Learning en Paraguay: tus primeros modelos en serio

**Respuesta corta:** el [curso de Machine Learning de ProgramBI para Paraguay](https://www.programbi.com/py/cursos/machine-learning) es un programa **en vivo por Zoom de 20 horas**, de **19:30 a 21:30, hora de Paraguay**, para quienes ya saben Python y quieren crear modelos predictivos que resuelvan problemas de negocio. Tiene dos módulos: supervisado (regresión lineal y polinómica, logística, SVM, árboles, ensembles, validación cruzada y métricas) y no supervisado (K-Means, PCA, t-SNE, detección de anomalías y reglas de asociación). El precio es **{precio_local}**; incluye grabaciones de por vida y certificado digital.

La ficha, revisada el 4 de noviembre de 2026, indica **cupos abiertos con fecha por confirmar**. Para conocer la fecha y la forma de pago desde Paraguay, lo más rápido es escribir por WhatsApp.

**[CTA-TOP]** — Cupos abiertos · 19:30 a 21:30 (Asunción) · «Ver el curso».

## Por qué aprender machine learning desde Paraguay

En muchas empresas paraguayas, el análisis de datos todavía se hace en planillas: reportes de ventas por sucursal, listados de cobranza, controles de stock. Eso no es un problema; es el punto de partida. La diferencia está en lo que viene después. Quien domina machine learning puede tomar esa misma historia y convertirla en anticipación: qué cliente va a atrasarse, qué sucursal va a quedarse sin stock, qué registro tiene algo raro.

Saber aplicarlas suma mucho a un perfil de análisis. Y como el curso es en vivo y en línea, no necesitás mudarte ni viajar para aprenderlas con un instructor.

Si tu empresa emite comprobantes electrónicos, además, ya tenés una fuente ordenada de transacciones. La [DNIT](https://www.dnit.gov.py/) es la administración tributaria que gestiona ese sistema; para un modelo de ventas o de clientes, esos registros con fecha, monto y cliente son materia prima de primera.

## Qué incluye el temario

**Primer módulo: aprendizaje supervisado.** Entrenás modelos con datos que ya traen la respuesta:

- **Regresión lineal y polinómica**, para estimar cantidades como ventas, kilos o montos.
- **Regresión logística y SVM**, para clasificar: paga o no paga, compra o no compra.
- **Árboles de decisión y ensembles**, que combinan muchos modelos simples en uno más preciso.
- **Validación cruzada y métricas**, para comprobar que el modelo funciona con datos nuevos.

**Segundo módulo: aprendizaje no supervisado.** Sin etiqueta, buscás patrones:

- **K-Means**, para agrupar clientes, productos o sucursales.
- **PCA y t-SNE**, para reducir muchas variables y verlas en un gráfico.
- **Detección de anomalías**, para encontrar lo fuera de lo común.
- **Reglas de asociación**, para descubrir qué se compra junto.

## Ejemplo: segmentar clientes por comportamiento de compra

```python
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

rfm = ventas.groupby("cliente").agg(
    recencia=("dias_desde_ultima", "min"),
    frecuencia=("factura", "nunique"),
    monto=("total_gs", "sum"),
)
X = StandardScaler().fit_transform(rfm)
rfm["segmento"] = KMeans(n_clusters=4, n_init=10, random_state=0).fit_predict(X)
print(rfm.groupby("segmento").mean().round(0))
```

Este es el clásico análisis RFM —recencia, frecuencia y monto— con K-Means. Con montos en guaraníes, que suelen ser números grandes, el paso de estandarizar es clave: sin él, la variable de monto aplastaría a las demás y los grupos saldrían sesgados. El resultado típico son segmentos como "clientes frecuentes de ticket alto", "clientes que dejaron de comprar" o "clientes nuevos". Con eso, el área comercial puede diseñar una acción distinta para cada grupo.

## Aplicaciones que tienen sentido en Paraguay

**Comercio y distribución.** Pronóstico de ventas por sucursal o por cliente mayorista para planificar compras y evitar quiebres de stock.

**Financieras, cooperativas y ventas a crédito.** Clasificación del riesgo de atraso con el historial de pagos, para ordenar la gestión de cobranza y decidir a quién llamar primero.

**Agronegocios y logística.** Detección de anomalías en registros de acopio, despachos o tiempos de entrega, y segmentación de clientes o zonas.

**Supermercados y tiendas.** Reglas de asociación para entender qué productos se llevan juntos y armar promociones con sentido.

## ¿Llegás con lo necesario?

El curso está pensado para quienes ya manejan Python. Fijate si podés hacer esto:

1. Leer un archivo de Excel o CSV con pandas.
2. Cambiar el tipo de una columna, por ejemplo de texto a fecha.
3. Agrupar y sumar con `groupby`.
4. Hacer un gráfico de barras o de líneas.

Si te sale sin problemas y en poco tiempo, estás listo para arrancar. Si no, conviene empezar por el [curso de Python para datos en Paraguay](https://www.programbi.com/py/cursos/python) y volver después.

## Errores comunes al empezar

- **Mezclar escalas sin estandarizar.** Montos en guaraníes al lado de cantidades en unidades distorsionan K-Means y SVM.
- **Evaluar con los datos de entrenamiento.** El modelo parece perfecto y falla con casos nuevos; la validación cruzada lo evita.
- **Variables que no vas a tener al predecir.** Si usás información que se conoce después del hecho, el modelo hace trampa.
- **Fijarte solo en la exactitud.** Con eventos poco frecuentes, mirá precisión y sensibilidad.
- **No explicar los resultados.** Un segmento o una probabilidad sin interpretación no cambia ninguna decisión.

## Pequeño glosario

- **Etiqueta:** lo que querés predecir.
- **Atributos:** las columnas que usás para predecir.
- **Sobreajuste:** el modelo memoriza en vez de aprender.
- **Validación cruzada:** evaluar varias veces con particiones distintas.
- **Ensemble:** combinación de muchos modelos simples.
- **Clúster:** grupo de casos parecidos.

## Un primer proyecto en cuatro semanas

**Semana 1.** Elegí una decisión que hoy se tome a ojo: a quién cobrar primero, cuánto pedir, qué clientes reactivar.

**Semana 2.** Juntá la historia en una tabla limpia, con una fila por cliente, factura o día.

**Semana 3.** Probá un modelo simple, medí el error y después compará con un árbol o un ensemble.

**Semana 4.** Presentá el resultado en guaraníes, horas o clientes recuperados, no en métricas técnicas.

## Cómo aprovechar las clases en vivo

Lo que más rinde es llegar con un problema propio. Elegí desde el inicio un conjunto de datos que conozcas bien —ventas, cobranza, stock— y aplicale cada técnica a medida que avanza el curso. Cuando algo no te cierre con tus datos, preguntalo en vivo: esas dudas suelen ser las más útiles para todo el grupo. Y reservá un rato el fin de semana para repasar con la grabación el código de la semana, con calma y sin apuro.

## El mercado laboral

En LinkedIn y Computrabajo Paraguay aparecen búsquedas de analista de datos, analista de inteligencia de negocios y analista de riesgo que piden Python y herramientas de datos. Mostrar un proyecto propio de machine learning, bien explicado, te diferencia.

## Del modelo a Power BI

Las predicciones tienen que llegar a quien decide. Un camino habitual es guardar los resultados en una tabla y mostrarlos en Power BI: segmentos de clientes, ranking de riesgo o pronóstico por sucursal. Para esa parte tenés el [curso de Power BI en Paraguay](https://www.programbi.com/py/cursos/power-bi) y la [guía para aprender Power BI en Paraguay](/py/guias/como-aprender-power-bi-en-paraguay).

**[CTA-MID]** — Descargá gratis la plantilla de dashboard de ventas.

## Qué métrica mirar, según el problema

- **Si estimás un número** (ventas, kilos, montos): el error absoluto medio, en las mismas unidades del negocio. "El pronóstico se equivoca por 40 unidades por sucursal" es fácil de entender.
- **Si clasificás casos parecidos en cantidad**: la exactitud puede alcanzar.
- **Si buscás algo raro** (atrasos, fraude, bajas): precisión y sensibilidad. La pregunta es qué cuesta más, una falsa alarma o un caso que se escapa.
- **Si segmentás**: indicadores como la silueta ayudan, pero la prueba real es si el área comercial puede actuar con los grupos.

## Horario desde Paraguay

Según la ficha, las clases son de 19:30 a 21:30, hora de Paraguay (UTC-3), el mismo horario que en Chile. Es una franja pensada para quienes trabajan durante el día. Si algún día no llegás, la sesión queda grabada y la podés ver después.

## Resumen del curso

- 20 horas en 2 módulos, supervisado y no supervisado.
- En vivo por Zoom, 19:30 a 21:30 hora de Paraguay; cupos abiertos, fecha por confirmar.
- Grabaciones de por vida y certificado digital.
- Proyectos con datos reales.
- Instructor: Manuel Oliva, Magíster en Data Science (UAI).
- Precio: {precio_local}.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 19:30 a 21:30 · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Machine Learning en Paraguay?**
{precio_local}. Para confirmar el monto y la forma de pago desde Paraguay, escribí por WhatsApp.

**¿Necesito saber Python?**
Sí. El curso es para quienes ya lo manejan; si estás empezando, conviene tomar antes el curso de Python para datos.

**¿Cuándo empieza la próxima cohorte?**
La ficha muestra cupos abiertos con fecha por confirmar.

**¿Las clases quedan grabadas?**
Sí, con acceso de por vida en el campus virtual.

**¿Recibo certificado?**
Sí, un certificado digital de ProgramBI al completar el curso.

**¿Puedo trabajar con datos de mi empresa?**
Sí, anonimizados. Es la mejor forma de que el proyecto tenga uso real desde el primer día.
