# Test de nivel SQL/Excel (P12)

## Rutas

- Chile: `/test-nivel/sql` y `/test-nivel/excel`
- Por país: `/{pais}/test-nivel/sql` y `/{pais}/test-nivel/excel`
- Se reexportan desde `app/(pais)/[pais]/test-nivel/[tema]/page.tsx`.
- Entran en `sitemap.xml` y en hreflang mediante `rutaLocal()`.

## Contenido

- `lib/data/test-nivel/sql.ts`: 10 preguntas de SQL Server.
- `lib/data/test-nivel/excel.ts`: 10 preguntas de Excel.
- `lib/data/test-nivel/tipos.ts`: cálculo de nivel (`inicial`, `basico`, `intermedio`, `avanzado`).
- La recomendación apunta a un curso existente:
  - SQL: `/cursos/sql-server`
  - Excel: `/cursos/excel`

## Evento GA4

`quiz_complete` se dispara al mostrar el resultado, una vez por intento:

```json
{
  "tema": "sql",
  "nivel": "intermedio",
  "pais": "cl",
  "aciertos": 7,
  "total": 10
}
```

El parámetro `pais` se toma de la ruta (`/{pais}/...`); en la ruta de Chile es `cl`.

## Email opcional: pendiente de P9

No se implementó captura ni envío de email en esta rama. La base es `a921e4d`, donde P9 todavía no está mergeado.

P9 define:

- Tabla `leads_magnet` (`email`, `pais`, `recurso`, `created_at`).
- Endpoint `app/api/leads-magnet/route.ts` con validación, honeypot y RLS de inserción anónima.
- Recurso esperado para este imán: `test-sql` / `test-excel`.

El endpoint existente `app/api/leads/create/route.ts` no es compatible: escribe en `course_leads`, exige nombre y envía una cotización al lead. Por eso no se reutilizó ni se muestra un formulario de email que simule un envío.

Cuando P9 esté mergeado:

1. Añadir un campo de email opcional en el resultado.
2. Enviar `{ email, pais, recurso: "test-sql" | "test-excel" }` a `/api/leads-magnet`.
3. Mostrar confirmación solo si la respuesta HTTP es exitosa.
4. Mantener el resultado visible aunque el envío falle o el usuario omita el email.

## Verificación pendiente

Ejecutar al final, junto con la verificación de la rama:

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`
4. Comprobar `/test-nivel/sql`, `/test-nivel/excel`, `/mx/test-nivel/sql` y `/ar/test-nivel/excel`.
5. Completar un test en DebugView y confirmar `quiz_complete` con `tema`, `nivel` y `pais`.
