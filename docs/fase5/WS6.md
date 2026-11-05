# WS6 — llms.txt y llms-full.txt

Rama: `feat/f5-llms` · Worktree: `C:/dev/pbi-f5-6` · Base: `mejora/fase5` (`0b14f1f`).

## Estado

- [x] Hecho (código, contenido y verificación local)
- [ ] Verificación pesada del orquestador (`next build`, HTTP real)
- [ ] Depende de ramas hermanas para las 4 landings y `/profesores` (ver TODO_MANU)

## Qué se hizo

- **`lib/llms/contenido.ts`**: fuente única de los dos archivos. Ningún monto,
  hora, cuota ni cantidad está escrito a mano: todo sale de `config/pricing.ts`,
  `config/paises.ts`, `config/cuotas.ts`, `lib/data/courses.ts`,
  `lib/data/course-views.ts`, `lib/data/academias.ts`, `lib/data/comparisons.ts`,
  `lib/guias/generado.ts` y `lib/faq/contenido.ts`.
  - `construirLlmsTxt()`: resumen navegable de **97 líneas** (tope pedido: <120).
    Índice, 13 cursos, landings, datos clave, precios por país agrupados por
    monto, políticas, institucional, otras páginas y contacto.
  - `construirLlmsFullTxt()`: versión extendida de **594 líneas**: datos clave,
    ficha de cada curso, landings, tabla completa país/curso, las 100 guías
    publicadas, comparativas, selección de FAQ y políticas.
  - `cabecerasLlms()`: `text/plain; charset=utf-8` + caché de una hora
    (`s-maxage=3600`, `stale-while-revalidate=86400`).
- **`app/llms.txt/route.ts`**: reescrito. Ya no arma el texto ni tiene cursos o
  precios hardcodeados; solo llama a `construirLlmsTxt()`. Mantiene
  `export const revalidate = 3600`.
- **`app/llms-full.txt/route.ts`**: nuevo, mismo tratamiento con
  `construirLlmsFullTxt()` y el mismo `revalidate`.
- **Contenido obligatorio añadido**:
  - Landings de nicho: `/power-bi-para-finanzas`,
    `/power-bi-sql-server-python`, `/analisis-de-datos-mineria` y
    `/capacitacion-empresas` (ver dependencia en TODO_MANU).
  - `/nosotros` en el bloque institucional.
  - Políticas: cuotas sin interés y medios, horario de clases, grabaciones,
    certificado y su verificación, PL-300 aparte y Mac → Power BI web.
  - Bloque **Datos clave**: cantidad de cursos, duración mínima/máxima, modalidad,
    certificado, cuotas, grabaciones, precio por curso en Chile y enlace a la
    tabla por país.
  - Precios: Paraguay aparece siempre como «consulta por WhatsApp», nunca con un
    monto inventado. La tabla completa se genera con `precioPublico()`.

## Archivos tocados

- `app/llms.txt/route.ts` (reescrito)
- `app/llms-full.txt/route.ts` (nuevo)
- `lib/llms/contenido.ts` (completado sobre el trabajo previo sin commitear)
- `docs/fase5/WS6.md` (este archivo)

No se tocaron `app/sitemap.ts`, `app/robots.ts`, `next.config.ts`, páginas ni
`config/**`.

## Decisiones

1. **Un solo generador para los dos endpoints.** El route handler no conoce
   cursos, precios ni guías; así el archivo corto y el largo no se desincronizan.
2. **El corto queda corto.** No lista las 100 guías ni la tabla curso-por-curso;
   esas viven en `llms-full.txt` y se enlazan desde el índice y desde precios.
   Los precios por país del corto van agrupados por monto para no repetir el
   mismo valor diez veces.
3. **Mercados publicados** = países con `indexable: true` más los que todavía no
   tienen precio público (hoy Paraguay). Es el mismo criterio que usaba el
   `llms.txt` anterior: 14 mercados. Los países con precio pero `noindex`
   (Honduras, Nicaragua, Panamá) quedan fuera.
4. **FAQ filtrada por id.** Se excluyeron `desde-que-paises`, `que-cursos` y
   `moneda-local` porque enumeran países o cursos con listas fijas que ya no
   coinciden con `config/paises.ts` ni con el catálogo; incluirlas contradecía
   las tablas generadas. El resto de las respuestas se copia tal cual de
   `lib/faq/contenido.ts`.
5. **Slugs en las líneas de precio.** Para no repetir títulos largos, los montos
   agrupados nombran el slug del curso; el lector lo resuelve en la sección de
   cursos. En `llms-full.txt` la tabla sí usa el título completo.
6. **Formato del certificado.** `PBI-XXX-XXXXXX` coincide con lo que muestra
   `/verificar-certificado`; la ruta dinámica se cita como código inline
   `` `/certificado/<codigo>` `` para no publicar una URL con placeholder como si
   existiera.
7. **Landings declaradas como dato local.** El archivo de `feat/f5-landings`
   (`lib/data/landings-nicho.ts`) todavía no está en esta rama, así que no se
   puede importar. Se dejan las cuatro rutas en una constante con su TODO.
8. **`/profesores` no se anuncia.** En `feat/f5-equipo` el directorio existe pero
   está detrás de `EQUIPO_PUBLICADO` (`NEXT_PUBLIC_EQUIPO_PUBLICADO=1`), que por
   defecto es `false`. Como `lib/data/equipo.ts` no está en esta rama, se dejó la
   línea comentada con su TODO en `bloqueInstitucional()`.

## Verificación local

Reglas del worktree: sin `npm install`, sin `next build`, sin `next dev`, sin
`npx tsc`. Sí se usó `npx eslint` puntual y un runner de Node con type-stripping
para ejecutar el generador.

- [x] `npx eslint app/llms.txt/route.ts app/llms-full.txt/route.ts lib/llms/contenido.ts`
      → sin errores ni warnings.
- [x] Generador ejecutado: `llms.txt` = 97 líneas / ~10,8 KB;
      `llms-full.txt` = 594 líneas / ~57,9 KB.
- [x] 155 URLs únicas en los dos archivos. 151 resuelven contra un `page.tsx`
      real (estáticas o dinámicas con slug validado contra `courses`,
      `GUIAS` y `comparisons`). Las 4 restantes son las landings de
      `feat/f5-landings`, que todavía no tienen `page.tsx` en esta rama.
- [x] Cursos, guías y comparativas se validaron contra sus fuentes: 13 cursos,
      100 guías publicadas, 3 comparativas de herramientas + 4 de academias.
- [x] `grep` sobre los tres archivos: no hay montos (`169.000`, `338.000`,
      `349.000`) ni horas (`19:30`, `21:30`) escritos a mano.
- [x] Revisado `node_modules/next/dist/docs/.../route.md`: `revalidate = 3600`
      es la configuración válida para cachear un Route Handler con ISR.
- [ ] `next build` y curl HTTP real: los corre el orquestador.

Comandos útiles para repetir la verificación:

```bash
npx eslint app/llms.txt/route.ts app/llms-full.txt/route.ts lib/llms/contenido.ts
grep -nE "169\.000|338\.000|349\.000|19:30|21:30" lib/llms/contenido.ts   # debe salir vacío
# Con el server levantado:
curl -sI http://localhost:3000/llms.txt | grep -i content-type
curl -s http://localhost:3000/llms.txt | wc -l
curl -s http://localhost:3000/llms-full.txt | wc -l
```

## TODO_MANU

1. **Landings (bloqueante para publicar).** Al fusionar `feat/f5-landings`,
   confirmar que existan
   `app/(marketing)/power-bi-para-finanzas/page.tsx`,
   `app/(marketing)/power-bi-sql-server-python/page.tsx`,
   `app/(marketing)/analisis-de-datos-mineria/page.tsx` y
   `app/(marketing)/capacitacion-empresas/page.tsx`. Si alguna ruta cambia o no
   se publica, quitarla de `LANDINGS_NICHO` en `lib/llms/contenido.ts`. Hoy las
   cuatro darían 404 en esta rama.
2. **Profesores.** Al fusionar `feat/f5-equipo`, importar `EQUIPO_PUBLICADO`
   desde `@/lib/data/equipo` y descomentar la línea de `/profesores` en
   `bloqueInstitucional()`; solo debe aparecer con el flag en `true`.
3. **Confirmar mercados indexables.** El comentario de `config/paises.ts` dice
   «Chile, Argentina, México, Perú, Colombia y Uruguay», pero los flags
   `indexable: true` cubren además Bolivia, Costa Rica, Ecuador, El Salvador,
   Guatemala, República Dominicana y Venezuela. El `llms.txt` sigue los flags
   (14 mercados con Paraguay), no el comentario. Si esos siete mercados no
   debían publicarse, hay que corregir `config/paises.ts` (fuera de este WS).
4. **Revisar `cuanto-cuestan` del FAQ.** La respuesta dice «el resto del catálogo
   vale $169.000 CLP, salvo Mercado financiero», pero Análisis de datos y su
   versión de minería valen $338.000. Se mantuvo porque el bloque de precios
   generado es el que manda, pero conviene corregir la fuente en `lib/faq`.
5. **Invalidación al desplegar.** El contenido se regenera cada 3600 s. Si se
   cambia un precio y se necesita inmediato, hacer redeploy o revalidar la ruta.

## Riesgos de merge

- **Bajo en código:** este WS solo reescribe `app/llms.txt/route.ts` y agrega
  `app/llms-full.txt/route.ts` + `lib/llms/contenido.ts`. Ningún otro frente de
  F5 toca esos archivos; `sitemap`, `robots` y `next.config` quedan intactos.
- **Medio en contenido:** las 4 landings y `/profesores` dependen de ramas
  hermanas. Si se mergea este WS solo, `llms.txt` anuncia cuatro 404. Mergear
  después de `feat/f5-landings` (o quitar la constante) y de `feat/f5-equipo`.
- **Bajo en tamaño:** 58 KB de texto plano en `llms-full.txt`; no llega a los
  límites de respuesta de Next ni de los asistentes que lo consumen.
- **Datos:** cualquier cambio futuro de precios, cuotas u horarios se propaga
  solo; no hay que editar este WS.

## Commit

`feat(f5-llms): publica llms-full.txt y alinea llms.txt con las fuentes`
