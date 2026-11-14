---
slug: curso-access-chile
ruta_sugerida: /guias/curso-access-chile
pais: cl
hreflang: es-CL
curso: access
url_curso: https://www.programbi.com/cursos/access
title: "Curso de Access en Chile para administrativos | ProgramBI"
meta: "Curso de Microsoft Access en Chile: 20 h en vivo por Zoom, 7 módulos de tablas, SQL, formularios, informes y macros para administración."
h1: "Curso de Access en Chile: bases de datos para administrativos, en vivo"
updated: 2026-11-04
sources:
  - https://www.programbi.com/cursos/access
nota_hermes: |
  ELEMENTO VISUAL: tabla comparativa «Excel o Access» (para qué brilla, ingreso, relaciones, consultas, reportes).
  Intención: "curso access chile", "curso microsoft access" (transaccional) → click_registro en /cursos/access. country=cl, course=access.
  - PRECIO: 169.000 CLP confirmado por Manu (4 nov 2026). Léelo igual como {precio_local} desde config/pricing.ts (clave access × cl) para no desalinear guía, ficha, Offer y checkout.
  - FECHA: la ficha indica «Cupos abiertos — consulta fecha»; días y horario «Por confirmar» en la cabecera, aunque la FAQ de la misma ficha dice 19:30–21:30 Chile (cadena 16:30 MX, 17:30 PE/CO, 19:30 AR/UY). No publicar fecha; usar «cupos abiertos». Si se fija cohorte, actualizar.
  - Primeros dos párrafos = respuesta citable (GEO). Schema Article + FAQPage + BreadcrumbList, sin Course/Offer.
  - WhatsApp: "Hola, vengo de la guía de Access para Chile en programbi.com y quiero info del curso en vivo".
---

# Curso de Access en Chile: bases de datos para administrativos, en vivo

**Respuesta corta:** el [curso de Microsoft Access de ProgramBI](https://www.programbi.com/cursos/access) son **20 horas en vivo por Zoom**, en **7 módulos**, para que el personal administrativo aprenda a diseñar, construir y administrar bases de datos relacionales: tablas y relaciones, consultas con SQL básico, formularios de ingreso, informes de gestión exportables a PDF y Excel, y macros. Cuesta **$169.000 CLP**, y la ficha muestra **cupos abiertos · próxima edición disponible**.

Incluye grabaciones de por vida en el campus, certificado al completar y un proyecto integrador con un proceso real de empresa. Según las preguntas frecuentes de la ficha, las clases son de 19:30 a 21:30, hora de Chile. Datos revisados en la ficha el 4 de noviembre de 2026.

**[CTA-TOP]** — Cupos abiertos · $169.000 CLP · «Consultar fecha».

## Cuando la planilla ya no da más

Casi todas las áreas administrativas en Chile tienen una planilla que empezó chica y creció sin control: el registro de contratos, el inventario de activos, la base de proveedores, el control de solicitudes. Se duplican filas, cada persona escribe el RUT o el nombre del área de forma distinta, alguien borra una fórmula sin querer y nadie sabe cuál es la versión buena. Ese es el momento en que conviene pasar a una base de datos.

El primer módulo del curso parte justamente con esa pregunta: **cuándo usar Access y cuándo alcanza con Excel**. No se trata de abandonar Excel, que sigue siendo ideal para cálculos y análisis puntuales, sino de guardar la información en un lugar ordenado, con reglas, y consultarla sin miedo a romperla.

## Excel o Access: la diferencia en una tabla

| | Excel | Access |
|---|---|---|
| Para qué brilla | Cálculos, análisis puntual, gráficos rápidos | Guardar y relacionar información que crece y se ingresa todos los días |
| Ingreso de datos | Directo en celdas, fácil de desordenar | Formularios con listas desplegables y validaciones |
| Relaciones | BUSCARV y copias de datos entre hojas | Tablas relacionadas con claves e integridad referencial |
| Consultas | Filtros y tablas dinámicas | Consultas guardadas con criterios, parámetros y SQL |
| Reportes | Se arman a mano cada vez | Informes que se regeneran con un clic y se exportan a PDF o Excel |

## Temario: los 7 módulos

1. **Introducción a Microsoft Access.** Conceptos de bases de datos, diferencias con Excel, interfaz, creación de una base, tipos de datos y propiedades de campos, e importación desde Excel y archivos externos.
2. **Diseño y construcción.** Modelo relacional, diseño de tablas, claves primarias y foráneas, relaciones, integridad referencial, normalización básica y un ejercicio de diseño de una base de gestión empresarial.
3. **Consultas.** Asistente y vista diseño, consultas de selección, criterios y filtros avanzados, varias tablas, agrupación, campos calculados, SUMA, PROMEDIO, CONTAR, MÁXIMO y MÍNIMO, consultas de parámetros y SQL básico: SELECT, WHERE, ORDER BY, GROUP BY y JOIN.
4. **Formularios.** Diseño y personalización, controles, listas desplegables y cuadros combinados, formularios vinculados a tablas y consultas, subformularios y validación de ingreso.
5. **Informes.** Diseño y formato, agrupación, totales y subtotales, informes basados en consultas, exportación a PDF y Excel y reportes de gestión.
6. **Automatización.** Macros, botones de navegación, macros para abrir formularios e informes, SQL en Access, consultas de acción para actualizar, eliminar y crear registros, y buenas prácticas.
7. **Proyecto integrador.** Una base aplicada a un proceso de empresa: tablas, relaciones, consultas de indicadores, formularios, informes y presentación final.

## Ejemplos que calzan con la pega administrativa

**Control de contratos.** Una tabla de contratos, otra de proveedores y otra de áreas, relacionadas entre sí. Un formulario para registrar cada contrato nuevo con su fecha de término, y una consulta de parámetros que te pregunta "¿qué vence en los próximos 60 días?" y te devuelve la lista.

**Inventario de activos.** Cada notebook, impresora o mueble con su código, ubicación, responsable y fecha de compra. Cuando alguien cambia de oficina, se actualiza una sola fila y todos los informes quedan al día.

**Solicitudes internas.** Las solicitudes de compra o de mantención se ingresan por un formulario con listas desplegables, para que nadie escriba "Finanzas", "finanzas" y "Fin." como si fueran tres áreas distintas. Un informe semanal agrupa por estado y por área.

**Registro de capacitaciones.** Personas, cursos y asistencias en tablas separadas, con una consulta que cuenta horas por persona y un informe que exportas a PDF para la jefatura.

## Un vistazo al SQL que vas a escribir

En el módulo 3 dejas de depender solo del asistente y escribes consultas simples, como esta, que suma montos de contratos vigentes por área:

```sql
SELECT Areas.Nombre, SUM(Contratos.Monto) AS Total
FROM Contratos INNER JOIN Areas ON Contratos.IdArea = Areas.IdArea
WHERE Contratos.FechaTermino >= Date()
GROUP BY Areas.Nombre
ORDER BY SUM(Contratos.Monto) DESC;
```

No necesitas saber programar: el curso parte desde cero, y estas cinco palabras —SELECT, WHERE, ORDER BY, GROUP BY y JOIN— son la misma base que después sirve para SQL Server o para conectar datos a Power BI.

## Cómo puede verse tu proyecto integrador

El módulo 7 junta todo en una base aplicada a un proceso de empresa. Un ejemplo posible para alguien de administración en una constructora de Santiago: el control de arriendo de maquinaria. Una tabla de equipos, otra de obras, otra de proveedores y una de arriendos que las conecta. Un formulario para registrar cada arriendo con listas desplegables de obra y equipo, que no deja grabar si falta la fecha de devolución estimada. Consultas que entregan indicadores: días de arriendo por obra, costo acumulado por proveedor, equipos con devolución atrasada. Un informe mensual agrupado por obra, con subtotales, que se exporta a PDF para la gerencia. Y un menú con botones y macros para que cualquier persona del equipo abra el formulario o el informe sin tocar las tablas.

Lo valioso es que sales con algo que funciona en tu pega y que puedes explicar a tu jefatura: qué problema resolvía la planilla anterior, qué resuelve ahora la base y cómo se mantiene.

## ¿Para quién es?

La ficha lo define para el **personal administrativo que necesita almacenar, organizar, consultar y analizar información de distintas áreas de una organización**. En la práctica: asistentes y analistas administrativos, encargados de bodega o de activos, personas de recursos humanos que llevan registros, coordinadores de compras y cualquiera que hoy sostiene un proceso con una planilla que se volvió frágil.

## Después de Access, ¿qué sigue?

- Si quieres bases más grandes y compartidas, el siguiente paso natural es el [curso de SQL Server](https://www.programbi.com/cursos/sql-server).
- Si lo que necesitas es visualizar tus datos en tableros que se actualizan, revisa el [curso de Power BI](https://www.programbi.com/cursos/power-bi) y la [guía para aprender Power BI en Chile](/guias/como-aprender-power-bi-en-chile). Access puede ser una de las fuentes que Power BI lee.

## Errores típicos al armar una base por primera vez

- **Copiar la planilla tal cual.** Una tabla con 40 columnas no es una base de datos; el módulo 2 enseña a separarla en tablas relacionadas.
- **No definir claves.** Sin clave primaria aparecen registros duplicados.
- **Ingresar directo en las tablas.** Para eso están los formularios con validaciones.
- **Rehacer el informe cada mes.** Un informe basado en una consulta se regenera solo.
- **Borrar con consultas de acción sin respaldo.** Antes de una consulta de eliminación, siempre una copia.

## Datos del curso

- **Duración:** 20 horas en 7 módulos.
- **Modalidad:** en vivo por Zoom; grabaciones de por vida en el campus.
- **Fecha:** cupos abiertos, consulta la próxima fecha.
- **Horario:** según la FAQ de la ficha, 19:30 a 21:30, hora de Chile.
- **Certificado:** al completar.
- **Instructor:** Manuel Oliva, Magíster en Data Science (UAI).
- **Precio:** $169.000 CLP. Puedes pagar en 3 cuotas sin interés.

**[CTA-MID]** — Descarga el temario completo del curso de Access.

**[CTA-END]** — $169.000 CLP · Cupos abiertos · «Inscribirme» · «Escribir por WhatsApp».

## Preguntas frecuentes

**¿Cuánto cuesta el curso de Access en Chile?**
$169.000 CLP.

**¿Cuándo empieza?**
La ficha muestra cupos abiertos para la próxima edición; escribe por WhatsApp para conocer la próxima cohorte.

**¿Necesito saber programar o SQL?**
No. El curso parte de los conceptos básicos de bases de datos; el SQL se ve desde cero en el módulo 3.

**¿Necesito tener Access instalado?**
Confirma con tu área de TI que tienes Access disponible en tu equipo antes de la primera clase.

**¿Qué diferencia hay con el curso de SQL Server?**
Access es ideal para bases de un área o un proceso; SQL Server, para bases más grandes y compartidas.

**¿Sirve para trabajar con datos que ya tengo en Excel?**
Sí. El módulo 1 enseña a importar datos desde Excel y archivos externos, y el módulo 5 a exportar informes de vuelta a Excel o PDF, así que ambas herramientas conviven sin problema en tu día a día.

**¿Qué recibo al terminar?**
Certificado digital de ProgramBI y acceso de por vida a las grabaciones.
