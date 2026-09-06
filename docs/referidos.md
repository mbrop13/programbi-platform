# Programa de referidos — ProgramBI

Plataforma v1 integrada en www.programbi.com. Comisión: **15% del neto cobrado** de un **curso abierto** o de una **capacitación a empresas** atribuida. El referidor comparte un **link**. Si la persona se registra, aparece en el panel. Pago al cobro. Clawback 60 días.

No toca capacitaciones.programbi.cl.

## Para que el panel funcione en producción

Hay que hacer **dos cosas** en Supabase / Vercel. El código ya está en `main`.

### 1. SQL (obligatorio)

En [Supabase](https://supabase.com/dashboard) → proyecto de ProgramBI → **SQL Editor** → New query.

Pega y ejecuta, en este orden:

1. `supabase/migrations/20260906000000_referrals.sql`
2. `supabase/migrations/20260907000000_referrals_signup.sql`

El primero crea las tablas. El segundo liga el registro (`prospect_user_id`) al referidor.

El seed `supabase/seeds/referrals_seed.sql` es **opcional** (solo usuarios de prueba). No lo corras en producción.

### 2. Variable de entorno (recomendado)

En Vercel → Project → Settings → Environment Variables:

```
REFERRAL_BANK_KEY=<secreto de 32+ caracteres>
```

Sirve para cifrar datos bancarios del referidor. Si no está, el panel igual arranca (cae al service role / plaintext wrap).

Confirma que ya existen `SUPABASE_SECRET_KEY` o `SUPABASE_SERVICE_ROLE_KEY`.

Después: hard-refresh de `/referidos/app` con una cuenta normal de ProgramBI. El perfil de referidor se crea solo.

## Cómo correr

1. Variables de entorno (además de las de Supabase / SES ya usadas):

```
REFERRAL_BANK_KEY=   # secreto ≥16 chars para cifrar datos bancarios (AES-256-GCM)
REFERRAL_AUTO_ACTIVE_DOMAINS=   # opcional; vacío = auto-activar a todos
```

El resto reutiliza `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SECRET_KEY`, `SES_SMTP_*`, `UPSTASH_REDIS_*`.

2. Migración + seed (Supabase SQL editor o CLI):

```
supabase/migrations/20260906000000_referrals.sql
supabase/seeds/referrals_seed.sql
```

El seed espera usuarios auth:

- `leo.a@example.org` (admin: `profiles.role = admin`)
- `tom.h@example.org`
- `paula.r@example.org`

3. `npm run dev` → [http://localhost:3000/referidos](http://localhost:3000/referidos)

## Flujo

1. El referidor copia su link (`/registro?ref=CODIGO`) desde `/referidos/app`.
2. La persona entra, se registra (cookie `pb_ref` 90 días). Queda en el panel como **Registrado**.
3. Si compra un curso o se cobra una capacitación, el admin marca **won** con el monto neto. Comisión = `floor(monto * 15 / 100)`.
4. Admin marca **pagada**. El referidor la ve en `/referidos/app/comisiones`.
5. Si hay NC/devolución ≤ 60 días: **clawback**.

Una venta atribuida = una comisión. El link también funciona en `/cursos` y `/empresas`.

## Rutas

| Ruta | Quién |
| --- | --- |
| `/referidos` | Landing pública (navbar/footer del sitio; no está en el menú público) |
| `/referidos/terminos` | Público |
| `/login?next=/referidos/app` `/registro?from=/referidos` | Misma cuenta de la plataforma |
| `/referidos/app/*` | App exclusiva del referidor (sesión ProgramBI; sin navbar del sitio) |
| `/referidos/admin/*` | App exclusiva de admin (sin navbar del sitio) |

`/referidos/login` y `/referidos/registro` redirigen al login/registro normal.

## QA checklist

### Desktop
- [ ] `/referidos` hero de puntos, cursos + empresas, calculadora 15%, FAQ
- [ ] Login/registro de la plataforma → panel (sin cuenta aparte)
- [ ] Registro con `?ref=CODIGO` aparece en la lista del referidor
- [ ] Admin won + monto → comisión 15%
- [ ] Admin pagada → referidor ve “Pagada”
- [ ] Export CSV
- [ ] Focus rings / labels en forms

### Mobile
- [ ] Landing apilada, CTAs táctiles
- [ ] Calculadora usable
- [ ] Panel: menú hamburguesa + copiar link visible
- [ ] Admin: tabla scrollea / kanban horizontal

### Seguridad
- [ ] Sin sesión, `/referidos/app` redirige a `/login?next=/referidos/app`
- [ ] No-admin no entra a `/referidos/admin`
- [ ] Datos bancarios no salen en logs
- [ ] Rate limit 5 intros/día
