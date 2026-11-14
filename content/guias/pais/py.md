---
title: Cómo aprender Power BI en Paraguay: guía 2026 | ProgramBI
description: Ruta de 8 semanas para aprender Power BI en Paraguay, dónde buscar empleo, DAX en guaraníes y clases en vivo en tu horario.
h1: Cómo aprender Power BI en Paraguay, desde cero hasta tu primer tablero
country: py
lang: es-PY
slug: como-aprender-power-bi-en-paraguay
path: /py/guias/como-aprender-power-bi-en-paraguay
updated: 2026-11-04
course: power-bi
url_curso: https://www.programbi.com/py/cursos/power-bi
sources:
  - https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/
  - https://www.programbi.com/py/cursos/power-bi
nota_hermes: |
  ELEMENTO VISUAL: ruta de aprendizaje de 8 semanas en Power BI para Paraguay.
---
En Paraguay pasa algo particular con los números: los montos en guaraníes son tan grandes que un reporte en Excel se vuelve ilegible enseguida, y muchas empresas manejan a la vez guaraníes y dólares. Si trabajás en una empresa de Asunción, en el comercio de Ciudad del Este o en el agro del Alto Paraná, Power BI te permite ordenar todo eso en un tablero claro. Esta guía te da la ruta para aprenderlo, dónde buscar empleo y los errores que conviene evitar.

<!-- CTA-TOP -->

##### Por qué Power BI en Paraguay

La economía paraguaya combina agroindustria (soja, carne, granos), comercio, energía, logística fluvial y una industria de maquila que crece. Son sectores con mucho movimiento y poca reportería automatizada: la información existe, pero vive en planillas. A eso se suma un sector financiero —bancos, cooperativas y financieras— que necesita seguir cartera y cobranza a diario. Power BI resuelve justo eso: conecta las planillas y sistemas que ya existen y entrega tableros que se actualizan solos.

##### Cuánto se paga (referencia)

No encontramos una fuente pública con muestra suficiente y metodología clara para el sueldo de analista de datos o BI en Paraguay, así que preferimos no publicar una cifra. Para tener una referencia real, revisá los avisos con sueldo visible en los portales de abajo y las bases de los concursos públicos, que publican la remuneración.

##### Dónde buscar empleo con Power BI en Paraguay

- **Computrabajo Paraguay**: el portal con más avisos locales.
- **LinkedIn Empleos**: bancos, multinacionales y posiciones remotas.
- **Paraguay Concursa** (paraguayconcursa.gov.py): concursos del sector público con remuneración publicada.
- **Bolsa de ProgramBI** (`/empleos`).

Tip: en Paraguay muchos puestos de «analista de crédito», «analista comercial» o «analista de costos» piden Power BI sin decirlo en el título. Buscá por la herramienta, no solo por el cargo.

##### Industrias donde más se usa

- **Agroindustria y ganadería**: acopio, exportaciones, faena.
- **Bancos, financieras y cooperativas**: cartera, mora, colocaciones por sucursal.
- **Comercio y distribución**: ventas por zona, stock, márgenes.
- **Maquila y manufactura**: producción, eficiencia, costos.
- **Energía y logística fluvial**: operación, despachos, tiempos.

##### Ruta de aprendizaje en 8 semanas

1. **Semanas 1–2 · Power Query.** Uní planillas de varias sucursales y separá columnas de guaraníes y dólares.
2. **Semana 3 · Modelo estrella** con calendario y tabla de **tipo de cambio** diario.
3. **Semanas 4–5 · DAX.** CALCULATE, FILTER, DIVIDE, SUMX.
4. **Semana 6 · Tiempo.** Mes contra mes, año contra año y acumulado.
5. **Semana 7 · Diseño para cifras grandes.** Formatos en millones y miles de millones, tarjetas legibles.
6. **Semana 8 · Proyecto.** Un tablero con datos abiertos paraguayos (datos.gov.py) para tu portafolio.

<!-- CTA-MID --> — Descargá la plantilla de dashboard de ventas en guaraníes.

##### Funciones clave, con ejemplos paraguayos

Una distribuidora con sucursales en Asunción, Ciudad del Este y Encarnación, que vende en guaraníes y en dólares:

- `Ventas PYG = SUM(Ventas[Importe_PYG])`
- `Ventas USD = SUM(Ventas[Importe_USD])`
- **Todo en guaraníes**, usando el tipo de cambio del día:
  `Ventas total PYG = SUMX(Ventas, Ventas[Importe_PYG] + Ventas[Importe_USD] * RELATED(TipoCambio[PYG_por_USD]))`
- `Ventas CDE = CALCULATE([Ventas total PYG], Sucursal[Ciudad] = "Ciudad del Este")`
- **Para leer cifras grandes**, mostrá en millones: `Ventas (M ₲) = DIVIDE([Ventas total PYG], 1000000)`
- `% Mora cooperativa = DIVIDE(CALCULATE(SUM(Cartera[Saldo]), Cartera[Dias_atraso] > 60), SUM(Cartera[Saldo]))`

El tipo de cambio de referencia lo publica el Banco Central del Paraguay; cargalo en Power Query y relacionalo con el calendario.

##### Errores comunes

- **Sumar guaraníes y dólares en la misma columna.** Siempre separados o convertidos.
- **Tarjetas con 12 dígitos.** Nadie lee «₲ 1.234.567.890»; usá millones.
- **Tipo de cambio fijo «a ojo».** Definí con finanzas cuál se usa (del día, promedio o de cierre).
- **Planillas distintas por sucursal**, cada una con su formato. Normalizalas en Power Query antes de modelar.
- **Columnas calculadas en lugar de medidas.**

##### Tres casos reales de uso en empresas paraguayas

**1. Cooperativa en Asunción o Central: cartera y morosidad por sucursal.** Las cooperativas manejan miles de socios y créditos pequeños. Un tablero diario de mora evita sorpresas al cierre.

`Socios con atraso = CALCULATE(DISTINCTCOUNT(Creditos[ID_Socio]), Creditos[Dias_atraso] > 30)`
`Mora % = DIVIDE(CALCULATE(SUM(Creditos[Saldo_PYG]), Creditos[Dias_atraso] > 60), SUM(Creditos[Saldo_PYG]))`

Con seguridad por filas, cada jefe de sucursal ve solo la suya.

**2. Acopio de granos en Alto Paraná o Itapúa: recepción por zafra.** En plena cosecha de soja, el acopio necesita saber cuántas toneladas entraron por silo, productor y día, y cuánto descuento por humedad se aplicó.
`Toneladas netas = DIVIDE(SUMX(Recepcion, Recepcion[Kg_bruto] * (1 - Recepcion[Desc_humedad])), 1000)`
`Avance zafra % = DIVIDE([Toneladas netas], SUM(Plan[Toneladas_plan]))`

**3. Comercio en Ciudad del Este: ventas en dos monedas.** Con la medida `Ventas total PYG` de arriba, más una tabla de vendedores, el tablero muestra ventas por turno y vendedor en guaraníes o en dólares, según elija el usuario con un selector (`SWITCH`).

##### Certificación PL-300 desde Paraguay

La certificación oficial es **Power BI Data Analyst Associate** (examen **PL-300**). Microsoft fija el precio según el país; el valor para Paraguay aparece al registrarte en la [página oficial](https://learn.microsoft.com/es-es/credentials/certifications/data-analyst-associate/). Es un diferencial claro en un mercado donde pocos perfiles la tienen, pero rinde más con proyectos que la respalden.

##### Comunidad para seguir aprendiendo

El foro oficial de Microsoft Fabric y Power BI (community.fabric.microsoft.com) tiene sección en español. Buscá en LinkedIn y Meetup grupos de datos o de Power BI en Asunción con actividad reciente; también las universidades suelen organizar charlas abiertas de analítica.

##### Un portafolio con datos paraguayos

El portal de datos abiertos (datos.gov.py) y los datos de contrataciones públicas permiten armar un tablero de **compras públicas por entidad** o de **indicadores por departamento**. Mostrá qué pregunta respondés y qué medidas usaste: eso es lo que un reclutador quiere ver.

##### Qué estudiar después de Power BI

Cuando ya domines el tablero, el siguiente paso con más retorno en Paraguay es **SQL**: muchos bancos, financieras y cooperativas guardan su información en bases de datos, y poder consultar directamente sin pedir exportaciones a sistemas te hace independiente. Después, según tu rol, **Excel avanzado con Power Pivot** (para quienes siguen trabajando mucho con planillas) o **Python** (si te interesa ir hacia modelos de riesgo o proyecciones). Un orden razonable: Power BI → SQL → automatización. Así cada paso construye sobre el anterior y lo podés aplicar en tu trabajo actual desde la primera semana.

Un detalle que suma en entrevistas: mostrá que sabés explicar cifras grandes. Presentá tus resultados en millones de guaraníes y, cuando corresponda, en dólares, y aclará qué tipo de cambio usaste. Ese cuidado transmite criterio.

##### ¿Aprender solo o en un curso en vivo?

Podés empezar solo con la documentación de Microsoft. Pero la parte que da trabajo —modelo y DAX— se aprende mucho más rápido con alguien que corrige en el momento y con un calendario que te obliga a avanzar. Además, el horario del curso es el mismo de Paraguay, así que no tenés que hacer cuentas.

##### El curso Power BI en vivo de ProgramBI (para Paraguay)

- **En vivo por Zoom**, lunes y miércoles de **19:30 a 21:30, hora de Paraguay** (misma hora que Chile en esta temporada; verificar cuando Chile cambie de horario).
- **20 horas, 8 módulos**, básico-intermedio. Próximo inicio: **lunes 23 de noviembre de 2026**.
- Consultá la inversión en el PDF del [curso de Power BI en Paraguay](/py/cursos/power-bi).
- Temario: Power Query y M, modelo estrella, CALCULATE y FILTER, Time Intelligence, RANKX e iteradores, tabla de métricas con SWITCH e IA en Power BI.
- **Grabaciones de por vida** y **certificado**.
- Instructor: **Manuel Oliva**, Magíster en Data Science (UAI).
- Lectura complementaria: [guía de funciones DAX](/guias/funciones-dax-mas-importantes) y la comparativa [Power BI vs Excel](/guias/power-bi-vs-excel).

<!-- CTA-END -->

##### Preguntas frecuentes

**¿A qué hora son las clases en Paraguay?**
Lunes y miércoles de 19:30 a 21:30, hora de Paraguay. Si no podés, quedan grabadas.

**¿Puedo pagar desde Paraguay?**
Sí, con tarjeta internacional. El cargo final lo define tu banco. Escribinos por WhatsApp y te confirmamos el valor.

**¿Cómo manejo guaraníes y dólares en el mismo tablero?**
Con una tabla de tipo de cambio diario y una medida con SUMX que convierta cada venta. Así podés ver todo en guaraníes o todo en dólares.

**¿Power BI sirve en cooperativas?**
Sí: cartera, mora, socios activos y colocaciones por sucursal son casos típicos.

**¿Necesito saber programar?**
No. Power Query y DAX se aprenden sin experiencia previa.

**¿El certificado sirve para concursos públicos?**
Acredita horas y temario. Cada concurso de Paraguay Concursa define qué méritos valora; revisá las bases.
