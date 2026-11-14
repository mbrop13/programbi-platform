---
slug: curso-analisis-de-datos-bolivia
ruta_sugerida: /bo/guias/curso-analisis-de-datos-bolivia
pais: bo
hreflang: es-BO
curso: analisis-de-datos
url_curso: https://www.programbi.com/bo/cursos/analisis-de-datos
title: "Curso de Análisis de datos en Bolivia | ProgramBI"
meta: "Curso de análisis de datos en Bolivia en vivo: SQL Server, Power BI y Python, 60 h por nivel. Clases 18:30 hora de Bolivia, con inicios mensuales."
h1: "Curso de Análisis de datos en Bolivia: aprende SQL, Power BI y Python en vivo"
updated: 2026-11-14
sources:
  - https://www.programbi.com/bo/cursos/analisis-de-datos
  - https://learn.microsoft.com/es-es/power-bi/fundamentals/desktop-get-the-desktop
nota_hermes: |
  ELEMENTO VISUAL: tabla de tres columnas del temario (SQL Server / Power BI / Python).
  Intención: "curso análisis de datos bolivia", "analista de datos santa cruz" (transaccional + informacional) → click_registro en /bo/cursos/analisis-de-datos. country=bo, course=analisis-de-datos.
  - PRECIO: {precio_local} = placeholder de config/pricing.ts (WS1), clave analisis-de-datos × bo. Manu aún no define el monto: NO escribas cifras. La ficha /bo/ hoy muestra un monto en USD «Se cobra en CLP» que no está aprobado: no copiarlo. Sin valor → "Consulta el valor por WhatsApp".
  - FECHA: ficha /bo/cursos/analisis-de-datos (4 nov 2026): inicio lunes 23 nov 2026, lunes y miércoles 18:30 a 20:30, hora de Bolivia (UTC-4). Si cambia, actualizar.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Análisis de datos para Bolivia en programbi.com y quiero info del curso en vivo".
---

# Curso de Análisis de datos en Bolivia: aprende SQL, Power BI y Python en vivo

**En pocas palabras:** el [curso de Análisis de datos de ProgramBI para Bolivia](https://www.programbi.com/bo/cursos/analisis-de-datos) es un programa **en vivo por Zoom de 60 horas por nivel**: **20 horas de SQL Server, 20 de Power BI y 20 de Python**, pensado para que puedas extraer datos, modelarlos en tableros y analizarlos con código como lo hace un analista profesional. El nivel básico-intermedio abre **cohortes todos los meses** (próxima fecha en la ficha), con clases **lunes y miércoles de 18:30 a 20:30, hora de Bolivia**. Precio: **{precio_local}**.

La ficha presenta dos niveles de 60 horas —básico-intermedio y avanzado—, con grabaciones de por vida en el campus, certificado digital, proyecto final con datos reales y apoyo de inteligencia artificial en cada módulo. Información revisada el 4 de noviembre de 2026.

**[CTA-TOP]** — Inicios mensuales · 18:30 hora de Bolivia · «Ver el curso».

## ¿Qué significa "analizar datos" en una empresa?

Significa responder preguntas con evidencia en lugar de intuición. ¿Qué productos dejan más margen? ¿Qué clientes pagan tarde? ¿En qué sucursal crecen los gastos? Para responder bien se necesitan tres capacidades que el curso trabaja por separado y luego integra:

1. **Saber pedir los datos** a la base de datos, con SQL.
2. **Saber organizarlos y mostrarlos**, con Power BI.
3. **Saber explorarlos a fondo** cuando Excel no alcanza, con Python.

La ficha recomienda el programa para **perfiles administrativos, financieros, comerciales, ingenieros y analistas que buscan dominar el ciclo completo del dato**, desde principiantes hasta quienes buscan análisis predictivo y automatización avanzada.

## Temario del nivel básico-intermedio

| SQL Server (20 h) | Power BI (20 h) | Python (20 h) |
|---|---|---|
| SELECT, TOP y WHERE | Entorno, instalaciones y cuentas | Variables, tipos y control de flujo |
| AND/OR y funciones de fecha (MONTH, YEAR) | Power Query desde Excel, SQL y APIs | Listas, tuplas y diccionarios |
| INNER, LEFT, RIGHT y FULL JOIN | Limpieza, cálculos y columnas a medida | DataFrames desde Excel |
| GROUP BY, HAVING, SUM, COUNT, ORDER BY | Barras, líneas, mapas y KPIs | Groupby y agregaciones múltiples |
| Vistas de valorización y consolidados | Unpivot y SELECTEDVALUE | Limpieza de columnas, tipos y fechas |
| IA para generar y revisar consultas | Publicación con roles y seguridad; Q&A y Smart Narratives | Matplotlib, Seaborn e IA para scripts |

## Un proyecto que une todo

Supongamos una empresa importadora con sucursales en Santa Cruz, La Paz y Cochabamba que quiere controlar mejor su inventario.

**Primero, SQL.** El analista escribe una consulta que une movimientos de inventario, productos y sucursales, y calcula entradas, salidas y saldo por producto y mes. Con HAVING se queda solo con los productos con movimiento.

**Después, Power BI.** Conecta esa consulta, crea una tabla de fechas y medidas de rotación y días de inventario, y diseña un tablero con un filtro por sucursal. Con roles, cada jefe de sucursal ve solo la suya.

**Luego, Python.** Carga el historial completo con Pandas, detecta productos sin movimiento en los últimos meses y grafica la evolución del stock de los más críticos con Seaborn.

**Finalmente, la conclusión.** Presenta una lista de productos para liquidar y otra de productos para reponer, respaldada por datos.

Este es el tipo de proyecto con datos reales con el que cierra el curso.

## Mini ejemplo en Python

```python
import pandas as pd
mov = pd.read_excel("movimientos.xlsx", parse_dates=["fecha"])
ultimo = mov.groupby("producto")["fecha"].max()
sin_mov = ultimo[ultimo < pd.Timestamp("2026-08-01")]
print(sin_mov.sort_values())
```

En pocas líneas obtienes la lista de productos que no se mueven desde una fecha dada, algo que en Excel requeriría varios pasos manuales.

## Del Excel eterno al análisis en minutos

Piensa en el cierre mensual de un área comercial. Sin estas herramientas, el proceso suele verse así: descargar reportes del sistema, abrirlos uno por uno, borrar filas vacías, unir con BUSCARV la información de clientes, armar tablas dinámicas, copiar los resultados a una presentación y revisar que nada se haya movido. Si alguien pide un cambio, toca empezar de nuevo.

Con SQL, Power BI y Python, el mismo cierre se transforma:

- La consulta SQL ya devuelve los datos unidos y agrupados.
- El modelo de Power BI se actualiza con un clic y las medidas se recalculan solas.
- Un script de Python revisa si hay datos raros —fechas imposibles, montos negativos, clientes duplicados— antes de que lleguen al tablero.
- La presentación se reemplaza por un enlace al tablero, con filtros para que cada jefe vea lo suyo.

El tiempo que antes se iba en armar se usa para entender: por qué cambió un indicador, qué cliente explica una caída, qué conviene hacer el próximo mes. Ese cambio de rol, de quien prepara reportes a quien explica resultados, es el verdadero objetivo del curso.

## Por qué aprender las tres juntas

Se puede aprender cada herramienta por separado, y existen cursos individuales para eso. La ventaja de hacerlo en un mismo programa es que ves cómo se conectan: la consulta SQL alimenta el modelo de Power BI, y el análisis en Python profundiza en lo que el tablero muestra. Además, los conceptos se refuerzan: un JOIN en SQL es la misma idea que una relación en Power BI o un merge en Pandas. Cuando lo entiendes una vez, lo reconoces en todas partes.

## ¿Con qué nivel empezar?

El **básico-intermedio** instala las bases en las tres herramientas: consultas, primeros tableros y análisis tabular con Python. El **avanzado**, de otras 60 horas, es para quienes ya dominan esos fundamentos. Si no has escrito consultas SQL antes, empieza por el básico-intermedio.

## Cómo prepararte antes de la primera clase

- **Refuerza Excel:** filtros, tablas dinámicas y BUSCARV te van a ayudar a entender más rápido los conceptos.
- **Elige un tema** que conozcas para tu proyecto final: ventas, inventario, cobranzas, recursos humanos.
- **Reúne datos de práctica,** quitando nombres, montos sensibles y datos personales.
- **Organiza tu horario** para practicar al menos media hora después de cada clase.
- **Instala Power BI Desktop** con tiempo; Microsoft indica que se instala en Windows. Si usas Mac, trabajarás con Power BI web, directamente en el navegador.

## Errores frecuentes

- Querer empezar por Python sin entender cómo se relacionan las tablas.
- Copiar consultas o código de internet sin comprenderlo.
- Presentar resultados sin validarlos contra la fuente.
- Diseñar tableros recargados de gráficos.
- Aceptar sin revisar lo que propone la IA.

## Habilidades que vas a poder mostrar

Al terminar el nivel básico-intermedio deberías poder:

- Escribir consultas SQL con filtros, uniones y agrupaciones.
- Construir un modelo en Power BI con relaciones y medidas, y publicarlo con roles.
- Cargar, limpiar y resumir datos con Pandas, y graficarlos con Matplotlib o Seaborn.
- Usar IA como apoyo para escribir consultas, medidas y scripts, revisándolos con criterio.
- Presentar un proyecto completo con una pregunta de negocio, un método y una conclusión.

## Rutas relacionadas

- Solo tableros: [guía para aprender Power BI en Bolivia](/bo/guias/como-aprender-power-bi-en-bolivia) y [curso de Power BI](https://www.programbi.com/bo/cursos/power-bi).
- Bases de datos: [curso de SQL Server](https://www.programbi.com/bo/cursos/sql-server).
- Programación: [curso de Python](https://www.programbi.com/bo/cursos/python).

## Datos del curso

- **Inicio:** cada mes abre un nuevo grupo (revisa la próxima fecha en la ficha).
- **Días y horario:** lunes y miércoles, 18:30 a 20:30, hora de Bolivia.
- **Duración:** 60 horas por nivel (20 por herramienta).
- **Modalidad:** en vivo por Zoom; grabaciones de por vida.
- **Certificado:** digital, al finalizar.
- **Instructor:** Manuel Oliva, Magíster en Data Science (UAI); según la ficha, ha liderado capacitaciones en AngloAmerican, CAP, Deloitte y SQM.
- **Precio:** {precio_local}. Puedes pagar en 3 cuotas sin interés.

**[CTA-MID]** — Descarga el temario completo.

**[CTA-END]** — {precio_local} · Cupos abiertos · «Inscribirme» · «Escribir por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Análisis de datos en Bolivia?**
{precio_local}. Escríbenos por WhatsApp para confirmar monto y forma de pago.

**¿Cuánto dura?**
60 horas por nivel: 20 de SQL Server, 20 de Power BI y 20 de Python.

**¿Cuándo empieza?**
Hay inicios nuevos todos los meses; las clases son lunes y miércoles de 18:30 a 20:30, hora de Bolivia (ver fecha vigente en la ficha).

**¿Necesito saber programar?**
No. El nivel básico-intermedio parte desde cero en cada herramienta.

**¿Qué pasa si falto a una clase?**
Queda grabada en el campus con acceso de por vida, para que te pongas al día antes de la siguiente.

**¿Puedo tomar solo una herramienta?**
Sí. Los cursos de SQL Server, Power BI y Python existen por separado, cada uno con su propia ficha.

**¿Sirve si trabajo en finanzas, comercio o en el sector público?**
Sí. En todos esos ámbitos hay bases de datos, reportes que se repiten cada mes y decisiones que mejoran con análisis. El curso se enfoca en el método, que se adapta a cualquier rubro.

**¿Necesito una computadora especial?**
Una computadora con Windows para instalar Power BI Desktop y una conexión estable para las clases en vivo. Revisa los requisitos técnicos publicados por Microsoft antes de empezar. Si usas Mac, trabajarás con Power BI web, directamente en el navegador.

**¿Qué recibo al terminar?**
Certificado digital de ProgramBI y acceso de por vida a las grabaciones.
