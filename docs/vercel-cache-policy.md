# Política de caché pública

Esta política reduce el trabajo de Vercel sin retirar contenido del HTML que leen los buscadores.

## Qué se regenera

- Guías, índices de guías, comparativas y `llms*.txt`: contenido generado desde archivos; se actualiza al desplegar. No lleva regeneración horaria.
- Home, catálogos, fichas y brochures de cursos, precios, empresas y las landings con horarios: respaldo de 86400 segundos. Las escrituras del administrador invalidan antes las URLs afectadas.
- El layout compartido de países no impone un intervalo: el menor intervalo de cualquier layout también se aplica a sus páginas hijas.
- Blog/newsletter conservan una hora; las vacantes conservan su política anterior. Los datos personales, sesiones y pagos no se convierten en caché pública.

## Cambios del administrador

`lib/cache/public-course-paths.ts` enumera URLs concretas para Chile y todos los países con carpeta. Editar una descripción, precio o brochure no invalida otras fichas ni guías. Un cambio de horario refresca también home, catálogos, la landing correspondiente y el pack Análisis de Datos cuando depende del curso modificado.

Las invalidaciones se ejecutan después de una escritura correcta y conservan la validación de administrador existente. No usar `revalidatePath('/cursos/[slug]', 'page')` para una edición de un único curso: hace caducar todo el catálogo. Al añadir otra superficie con datos del administrador, incluir su URL en el planificador correspondiente.

## Fallos de Supabase

Las lecturas críticas de artículos tienen un plazo acotado y un solo reintento con una consulta/señal nueva. Un fallo persistente interrumpe la regeneración, para que ISR conserve la última página válida. No guardar una página temporal `noindex` como sustituto del artículo. Solo una lectura correcta sin fila puede producir un 404.

Una caída durante el build impide publicar un artefacto incompleto. Una primera visita a una página sin copia previa puede responder con error temporal si la base de datos está caída; no se presenta como artículo inexistente. Los artículos relacionados y las categorías son opcionales y pueden degradar sin retirar el artículo principal.

## CPU de horarios

Se reutilizan formateadores `Intl.DateTimeFormat`, con mapas de tamaño acotado. No se cachean desfases ni fechas: cada conversión sigue calculando el horario de verano para la fecha solicitada. La descripción de un curso se deduplica entre metadata y render dentro de la misma petición mediante `React.cache`.

## Verificación

```powershell
node scripts/check-isr-policy.cjs
npm run build
node scripts/verify-cache-build.mjs C:/ruta/al/build-anterior/.next .next
npm run start -- -p 3113
node scripts/check-sitemap.mjs http://localhost:3113
```

El primer verificador ejecuta las acciones de administrador con una base simulada, comprueba invalidación concreta y cubre 119 conversiones por país/fecha, incluidos cambios de horario de verano. No escribe en producción.

El segundo verifica las políticas efectivas del manifiesto, compara el SEO de las páginas prerenderizadas y exige que no desaparezcan URLs del sitemap. Si el artefacto anterior contenía una respuesta de caída `noindex`, solo acepta su sustitución por un artículo real con H1 y canonical propio; informa esas recuperaciones por separado.

## Medición del resultado

La retirada de intervalos horarios y los HIT de caché prueban menos trabajo programado. El ahorro facturado depende del tráfico y de cuántas regeneraciones modificaban el resultado. Comparar días completos posteriores al despliegue y consumo por solicitud; el total acumulado del ciclo no disminuye al optimizar código. No interpretar falta de acceso a métricas de Observability Plus como consumo cero.
