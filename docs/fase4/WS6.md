# WS6 — Certificado verificable

Rama: `feat/f4-certificado` · Worktree: `C:/dev/pbi-f4-6` · Base: `mejora/fase4`.

## Estado

- [ ] En curso
- [x] Hecho (código y docs; falta la verificación pesada del orquestador)
- [ ] Bloqueado

Sin migración nueva: `public.certificates` ya tiene `student_name`, `course_title`,
`certificate_code` (UNIQUE) e `issued_at` según
`supabase/migrations/20260708000000_update_certificates.sql`.

## Qué se hizo

- **Ficha pública** `app/(marketing)/certificado/[codigo]/page.tsx`
  - Valida el formato del código antes de consultar. Si no calza, `notFound()` sin
    tocar la base.
  - Consulta con `createAdminClient()` (service_role, solo servidor) y selecciona
    únicamente `student_name, course_title, certificate_code, issued_at`. El email
    nunca se pide ni se renderiza.
  - Si el código no existe, `notFound()` → 404 del grupo `(marketing)`.
  - Render dinámico (`dynamic = "force-dynamic"`): un certificado recién emitido se
    verifica al instante y los códigos basura no generan páginas cacheadas.
  - `robots: { index: false, follow: true }` en la ficha. **Justificación:** la
    página contiene el nombre de una persona real y el espacio de URLs es
    ilimitado (cualquier código); indexarla expone datos personales y crea miles de
    URLs finas. El punto de entrada indexable es `/verificar-certificado`.
- **Formato real del código:** el panel genera `PBI-<3 letras del curso>-<6 base36>`
  (p. ej. `PBI-DATA-93K29`) y el CSV permite uno propio. Por eso la validación es
  laxa: 4–48 caracteres, solo `A-Z`, `0-9` y guiones internos, sin prefijo
  obligatorio para no rechazar certificados ya emitidos.
  - Búsqueda exacta y, si no hay match, un segundo intento case-insensitive
    (`ilike` sin comodines), porque un código cargado a mano puede estar en
    minúsculas.
- **Certificado visual** `components/certificado/CertificadoPublico.tsx`
  - Alumno, curso, fecha de emisión y código; sello de verificación y aviso de
    privacidad (no se publica el correo).
  - Botón **Agregar a LinkedIn** con la URL oficial
    `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
    `name`, `organizationName=ProgramBI`, `issueYear`, `issueMonth`, `certUrl`,
    `certId`. No se inventa `organizationId` porque el ID numérico de la página de
    empresa no está verificado en el repo.
  - Botón **Imprimir certificado** (`BotonImprimir`, client) apoyado en la regla
    `.print-diploma` que ya existía en `app/globals.css`; en impresión solo se ve
    el diploma, en horizontal.
  - Fecha formateada en `es-CL` con `timeZone: "UTC"` para que las fechas sin hora
    del CSV (`2026-07-08`) no se muestren un día antes en Chile.
- **Página indexable** `app/(marketing)/verificar-certificado/page.tsx`
  - Título, description y canonical propios; formulario con validación en cliente
    que navega a `/certificado/<codigo>`; acepta también una URL completa pegada.
  - Ayuda: dónde está el código, qué muestra la ficha y qué no se publica.
  - Enlace de contacto real (`contacto@programbi.cl`).

## Archivos tocados

- `app/(marketing)/certificado/[codigo]/page.tsx`
- `app/(marketing)/certificado/[codigo]/not-found.tsx`
- `app/(marketing)/verificar-certificado/page.tsx`
- `components/certificado/CertificadoPublico.tsx`
- `components/certificado/BotonImprimir.tsx`
- `components/certificado/FormularioVerificacion.tsx`
- `lib/certificados/codigo.ts`
- `lib/certificados/consulta.ts`
- `lib/certificados/fecha.ts`
- `lib/certificados/linkedin.ts`
- `docs/fase4/WS6.md`

No se tocaron `app/sitemap.ts`, `lib/paises/rutas.ts`, `lib/analytics/**`,
`config/**`, `next.config.ts` ni `package.json`.

## Comportamiento con códigos inválidos

| Entrada | Resultado |
|---|---|
| `/certificado/foo` (formato inválido: <4) | 404 inmediato, sin consulta a Supabase; muestra el 404 propio "Certificado no encontrado" |
| `/certificado/PBI--X` (guion doble) | 404 inmediato, sin consulta |
| `/certificado/PBI-DATA-00000` (formato válido, no existe) | consulta exacta + fallback case-insensitive, luego 404 propio |
| `/certificado/pbi-data-93k29` (existe en mayúsculas) | encuentra por fallback y muestra la ficha |
| Código válido existente | 200 con la ficha; `<meta name="robots" content="noindex, follow">` |
| Supabase caído o error de consulta | excepción → 500; **no** se disfraza de 404 |
| Falta `SUPABASE_SECRET_KEY` en el entorno | `createAdminClient` cae al key público, RLS no devuelve filas y el certificado da 404 (ver TODO 2) |

## Verificación local (sin build)

Reglas del worktree: no se ejecutó `npm`, `npx`, `node`, `tsc`, `eslint` ni
`next build`. Verificación hecha por lectura y `git diff`:

- [x] La consulta pública solo pide las 4 columnas permitidas (sin `email`,
      `user_id`, `id` ni `pdf_url`).
- [x] El email no aparece en ningún componente de la ficha ni en metadata/OG.
- [x] `params` se resuelve como `Promise` (Next 16).
- [x] `notFound()` en los dos caminos (formato inválido y código inexistente).
- [x] `dynamic = "force-dynamic"` y `robots.index = false` solo en la ficha;
      `/verificar-certificado` queda indexable con canonical.
- [x] Ejemplos reales de códigos (`PBI-PBB-883K1`, `PBI-SQL-321L9`,
      `PBI-DATA-93K29`) pasan el regex; `%`, `_`, espacios y `/` se rechazan.
- [ ] `npx tsc --noEmit` / `next build` — los corre el orquestador.

## Pendientes / TODO_MANU

1. **Probar un código real** de `public.certificates` en preview:
   `/certificado/<código>` debe mostrar alumno, curso, fecha y código; y un código
   inexistente debe dar 404 (no 200 vacío).
2. Confirmar que el entorno de preview/producción tiene `SUPABASE_SECRET_KEY`
   (o `SUPABASE_SERVICE_ROLE_KEY`). Sin esa clave `createAdminClient` cae al key
   público, RLS bloquea y **todos** los certificados darían 404.
3. Añadir `/verificar-certificado` al `app/sitemap.ts` y un enlace en el Footer
   (archivos compartidos: los toca el orquestador).
4. Revisar si existen códigos con caracteres fuera de `[A-Z0-9-]` (espacios,
   `_`, acentos) creados por el panel/CSV; hoy darían 404 por formato. Consulta:
   `select certificate_code from public.certificates where certificate_code !~ '^[A-Za-z0-9-]+$';`
   Si aparecen, normalizarlos en la base (no se aplicó ningún SQL).
5. Opcional: agregar el `organizationId` numérico de LinkedIn si se confirma; hoy
   se usa `organizationName=ProgramBI`.
6. Opcional: enlazar la ficha desde el correo de emisión o desde
   `/comunidad/certificados` (fuera del alcance de este WS).
7. El P17 completo también pide 3 casos de alumnos en `app/(marketing)/casos`;
   este WS solo cubre el certificado. Los casos quedan para otro WS.

## Commits

- `a4ccb25` — `feat(f4-certificado): ficha pública de certificado con verificación por código`
- `919df21` — `fix(f4-certificado): declara index,follow explícito en la página de verificación`
- `3171be6` — `fix(f4-certificado): evita main anidado dentro del layout de marketing`
- `59fd4c8` — `docs(f4-certificado): estado del WS6, comportamiento 404 y pendientes`
- `64200b2` — `fix(f4-certificado): compacta el diploma para que quepa en impresión horizontal`
- `923bfd6` — `feat(f4-certificado): 404 propio para códigos inexistentes`
- Commit final de docs: cierre de este archivo.
