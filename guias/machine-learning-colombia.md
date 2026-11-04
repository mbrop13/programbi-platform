---
slug: curso-machine-learning-colombia
ruta_sugerida: /co/guias/curso-machine-learning-colombia
pais: co
hreflang: es-CO
curso: machine-learning
url_curso: https://www.programbi.com/co/cursos/machine-learning
title: "Curso de Machine Learning Colombia: guía 2026 | ProgramBI"
meta: "Curso de machine learning en Colombia en vivo: 20 h de modelos predictivos con Python (regresión, clasificación, clustering), 17:30 hora de Bogotá. Requisito: Python."
h1: "Curso de Machine Learning en Colombia: aprende a predecir con Python"
updated: 2026-11-04
sources:
  - https://www.programbi.com/co/cursos/machine-learning
nota_hermes: |
  ELEMENTO VISUAL: tabla comparativa «pregunta de negocio → técnica del curso» con ejemplos de cartera, tiendas y POS + bloque «En 30 segundos».
  Intención: "curso machine learning colombia", "curso machine learning bogotá online" → click_registro en /co/cursos/machine-learning. country=co, course=machine-learning.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave machine-learning × co. Manu aún no define el monto: NO escribas cifras. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: la ficha dice «Cupos abiertos — consulta fecha» y días/horario «Por confirmar»; el horario sale de sus preguntas frecuentes. No publicar fecha hasta que la ficha la confirme. La ficha menciona «redes neuronales» en el lema pero no en el temario: la guía no las promete.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Machine Learning para Colombia en programbi.com y quiero info del curso en vivo".
---

# Curso de Machine Learning en Colombia: aprende a predecir con Python

**Respuesta corta:** el [curso de Machine Learning de ProgramBI en Colombia](https://www.programbi.com/co/cursos/machine-learning) es un programa **en vivo de 20 horas por Zoom**, de **17:30 a 19:30, hora de Colombia**, para quienes ya saben Python y quieren crear modelos predictivos aplicados a negocios. Cubre aprendizaje supervisado (regresión, clasificación, árboles, ensembles y validación) y no supervisado (K-Means, PCA, t-SNE, anomalías y reglas de asociación). El valor es **{precio_local}** e incluye grabaciones de por vida y certificado.

Según la ficha consultada el 4 de noviembre de 2026, la próxima cohorte tiene **cupos abiertos y fecha por confirmar**. Se paga en pesos colombianos con Mercado Pago Colombia, PSE o Nequi.

**[CTA-TOP]** — Cupos abiertos · 17:30 a 19:30 (Colombia) · «Ver el curso».

## El punto de partida en una empresa colombiana

La ficha del curso para Colombia lo resume bien: el dato suele estar repartido entre el POS, la facturación electrónica de la DIAN y las bases de recaudo. Eso es una ventaja para machine learning. La facturación electrónica deja un registro estructurado de cada venta, y las bases de recaudo dicen quién pagó, cuánto y cuándo. Con esa materia prima se pueden responder preguntas que hoy se contestan a ojo:

- ¿Qué clientes de cartera tienen más probabilidad de pagar tarde este mes?
- ¿Cuánto venderá cada tienda en la próxima temporada?
- ¿Qué tiendas se parecen entre sí y deberían gestionarse igual?
- ¿Qué transacciones del POS se salen de lo normal y merecen revisión?

Este curso te da las técnicas para responderlas con modelos que se pueden validar y explicar.

## Contenido del programa

**Primer módulo, supervisado.** Partes de datos con la respuesta conocida. Aprendes regresión lineal y polinómica para estimar valores, regresión logística y máquinas de soporte vectorial (SVM) para clasificar, y árboles de decisión con métodos ensemble para capturar relaciones más complejas. Cierras con validación cruzada y métricas, que es donde se decide si el modelo sirve.

**Segundo módulo, no supervisado.** Sin etiqueta previa, buscas estructura. Segmentas con K-Means, reduces dimensiones con PCA y visualizas con t-SNE, detectas anomalías y encuentras reglas de asociación entre productos.

## Ejemplo práctico: probabilidad de pago tardío

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

X = cartera[["dias_mora_hist", "monto_factura", "num_facturas_12m", "plazo_dias"]]
y = cartera["pago_tarde"]

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=1)
modelo = LogisticRegression(max_iter=1000).fit(X_tr, y_tr)
print(classification_report(y_te, modelo.predict(X_te)))
```

La regresión logística es un excelente primer modelo: es rápida, se puede explicar variable por variable y da una probabilidad, no solo un sí o un no. Con esa probabilidad, el área de cartera ordena su gestión del mes. En clase se compara contra un árbol y un ensemble para ver si la ganancia en precisión justifica la pérdida de interpretabilidad.

## Tres aplicaciones con sabor local

**Cartera y recaudo.** Es quizá el uso más inmediato. Las empresas que venden a crédito —distribuidoras, mayoristas, servicios— pueden priorizar llamadas y acuerdos de pago con un modelo de riesgo de atraso entrenado con su propia historia de recaudo.

**Retail con muchas tiendas.** Con ventas por tienda, canal y categoría, un modelo de regresión o de árboles anticipa la demanda y ayuda a planear compras y personal. Segmentar tiendas con K-Means permite fijar metas comparables entre puntos de venta parecidos.

**Revisión de transacciones.** La detección de anomalías marca ventas, devoluciones o descuentos atípicos en el POS. No acusa a nadie; simplemente le dice a auditoría dónde mirar primero.

## ¿Cumples el requisito?

El curso es para quienes ya manejan Python. Antes de inscribirte, prueba este mini reto: carga un CSV con pandas, calcula el promedio de ventas por tienda y grafica el resultado. Si lo haces en menos de 15 minutos, estás listo. Si no, empieza por el [curso de Python para datos en Colombia](https://www.programbi.com/co/cursos/python).

También ayuda —aunque no es obligatorio— tener nociones básicas de estadística: promedio, desviación estándar y correlación. El curso explica cada técnica desde la intuición, pero llegar con esa base hace que todo fluya mejor.

## Errores comunes y cómo evitarlos

1. **Dividir mal los datos.** Si el problema es temporal, como pronosticar ventas, no se mezclan meses al azar: se entrena con el pasado y se prueba con lo más reciente.
2. **Olvidar estandarizar.** K-Means y SVM son sensibles a la escala; una variable en millones de pesos aplasta a otra en días.
3. **Confundir correlación con causalidad.** Que un modelo use una variable no significa que esa variable cause el resultado.
4. **No pensar en el uso.** Un modelo de cartera que se actualiza una vez al año pierde vigencia; hay que definir cada cuánto se reentrena.

## Glosario rápido para no perderte en clase

- **Variable objetivo:** lo que quieres predecir, por ejemplo "pagó tarde: sí o no".
- **Variables predictoras:** la información que usas para predecir, como monto, plazo o historial.
- **Entrenamiento y prueba:** separas los datos para aprender con una parte y evaluar con otra que el modelo no ha visto.
- **Sobreajuste:** cuando el modelo memoriza en lugar de aprender, y falla con datos nuevos.
- **Validación cruzada:** repetir la separación varias veces para obtener una evaluación más confiable.
- **Ensemble:** combinar muchos modelos sencillos, como cientos de árboles, para obtener uno más robusto.
- **Clúster:** grupo de registros parecidos entre sí, encontrado sin etiqueta previa.
- **Componente principal:** una variable nueva que resume a varias originales, producto de PCA.

## Cómo plantear tu primer proyecto en 5 pasos

1. **Define la decisión.** Por ejemplo: "cada lunes, cartera decide a qué 200 clientes llamar".
2. **Reúne la historia.** Al menos doce meses de facturas y pagos, con una fila por factura.
3. **Construye un modelo base.** Una regresión logística sencilla, para tener un punto de comparación.
4. **Mejora y valida.** Prueba árboles y ensembles con validación cruzada, y quédate con el que mejore la métrica que importa.
5. **Mide el impacto.** Compara un mes gestionado con el modelo contra uno gestionado como siempre.

Este esquema sirve igual para pronóstico de ventas o segmentación de tiendas, y es una buena guía para el proyecto con datos reales del curso.

## Machine learning y tu carrera en Colombia

En LinkedIn, Computrabajo y elempleo.com, las vacantes de científico de datos, analista de datos senior, analista de riesgo de crédito o analista de inteligencia de negocios suelen pedir Python, y muchas mencionan modelos predictivos o machine learning. Más que un certificado, lo que pesa en una entrevista es mostrar un proyecto: el problema de negocio, cómo limpiaste los datos, qué modelos probaste, qué métrica elegiste y por qué.

## Cerrar el ciclo con Power BI

Las predicciones tienen que llegar a quien decide. Un flujo muy usado es guardar los resultados del modelo en una tabla y conectarla a Power BI: el ranking de cartera por riesgo, el pronóstico por tienda o el mapa de segmentos. Para esa parte puedes revisar el [curso de Power BI en Colombia](https://www.programbi.com/co/cursos/power-bi) o la [guía para aprender Power BI en Colombia](/co/guias/como-aprender-power-bi-en-colombia).

**[CTA-MID]** — Descarga gratis la plantilla de dashboard de ventas.

## Sobre el horario

La ficha indica clases de 17:30 a 19:30 en Bogotá. Como Colombia se mantiene en UTC-5 todo el año y Chile cambia con el horario de verano, la clase puede verse a las 17:30 o a las 18:30 según la época; la ficha de la cohorte muestra la equivalencia exacta. Si trabajas hasta las 6, conviene confirmar la hora antes de inscribirte, y recordar que todas las sesiones quedan grabadas.

## En resumen

- 20 horas, 2 módulos: supervisado y no supervisado.
- En vivo por Zoom, 17:30 a 19:30 hora de Colombia; cupos abiertos, fecha por confirmar.
- Grabaciones de por vida, certificado digital y proyectos con datos reales.
- Instructor: Manuel Oliva, Magíster en Data Science (UAI).
- Valor: {precio_local}, en pesos colombianos.

**Formas de pago:** los cursos de ProgramBI se pueden pagar en 3 cuotas sin interés, en todos los países.

**[CTA-END]** — {precio_local} · 17:30 a 19:30 · «Inscribirme» · «Hablar por WhatsApp».

## Preguntas frecuentes

**¿Cuánto vale el curso de Machine Learning en Colombia?**
{precio_local}. Se paga en pesos colombianos con Mercado Pago Colombia, PSE, Nequi o transferencia.

**¿Qué necesito saber antes?**
Python. El curso es para quienes ya lo manejan; si no, conviene empezar por el curso de Python para datos.

**¿Cuándo es la próxima cohorte?**
La ficha muestra cupos abiertos con fecha por confirmar; se puede consultar por WhatsApp.

**¿Hay certificado?**
Sí, certificado digital de ProgramBI al completar el curso.

**¿Puedo ver las clases después?**
Sí, todas quedan grabadas con acceso de por vida en el campus virtual.

**¿Me sirve si trabajo en cartera o en riesgo de crédito?**
Sí. La clasificación del módulo 1 —regresión logística, árboles y ensembles— es la base de los modelos de probabilidad de atraso, y el curso enseña a validarlos y explicarlos.
