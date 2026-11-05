# HERMES — Fix ficha curso: comprar + cotizar (CTA)

Fecha: 2026-11-05
Repo: platform (Programbi-web/platform)
Rama: crea `fix/ficha-cta-compra` desde `main` actualizado.
Modelo: DeepSeek V4.1 Flash / OpenCode Go. 1–2 agentes bastan (no hace falta 7).

## Problema (prod verificado)

En `app/(marketing)/cursos/[slug]/CourseDetailClient.tsx` (~líneas 711–731):

- Si `activeSchedulesList.length === 0` → solo `WhatsAppCta` **«Consultar fechas»**.
- Si hay fechas → botón **Inscribirse** → `handleCheckoutCTA` → `/pago?...` (logueado) o AuthModal (no logueado).
- Estar logueado **no** cambia el branch sin fechas: por eso Manu no ve comprar.
- El precio ya es público (`precioTarjeta`); el form `#cotizar` existe abajo («¿Necesitas ayuda?») pero no en la tarjeta sticky.

Cursos sin cohorte activa hoy (solo Consultar fechas): excel, access, machine-learning, power-automate, ia-productividad, analitica-mineria, mercado-financiero, copilot (y similares).
Con cohorte (Inscribirse): analisis-de-datos, power-bi, sql-server, python, claude.

## Objetivo de conversión

1. **Siempre** poder comprar / ir a pago desde la tarjeta (particular), aunque no haya fecha publicada.
2. Si no hay fecha: CTA secundario «Consultar fechas» (WhatsApp).
3. Logueado: etiqueta **«Comprar ahora»** (o «Ir a pagar»); mismo `handleCheckoutCTA` → `/pago`.
4. Formulario de **cotizar** visible en la tarjeta (lead), sin ocultar el precio público.

## Cambios (solo UI/CTA; no tocar CMS live a mano)

### A) Tarjeta particular — CTAs (`CourseDetailClient.tsx`)

Reemplazar el ternario `activeSchedulesList.length === 0 ? WhatsApp : Inscribirse` por:

1. Botón primario siempre: `handleCheckoutCTA`
   - Label: si `isLoggedIn` → `etiquetaBoton(pais, "Comprar ahora")` (o string local equivalente); si no → `etiquetaBoton(pais, "Inscribirse")` (comportamiento actual de auth → `/pago`).
2. Si `activeSchedulesList.length === 0`: debajo, secundario `WhatsAppCta` intent=`fechas`, estilo outline (como el WhatsApp de empresas), texto **Consultar fechas**.
3. Si hay fechas: opcional link texto «¿Dudas? Cotiza aquí» → `#cotizar` (no obligatorio si B está en la tarjeta).

No romper vista `empresas` (Cotizar para mi empresa + WhatsApp).

### B) Mini form cotizar en la tarjeta (particular)

Debajo de los CTAs (antes de `CourseCardDescription`):

- Título corto: «Cotiza o pide el detalle» (o «Te enviamos el detalle del precio»).
- Campos mínimos: nombre + email (reutilizar el mismo endpoint/payload que el form `#cotizar` / `handleSubmit` del mismo archivo — no inventar API nueva).
- Submit dispara el mismo lead que el form inferior; evento GA si ya existe para ese form (`generate_lead` / click_registro según haya en el código).
- Precio **sigue visible**; el form no «esconde» el monto (Manu quiere lead + compra, no volver a gatear el precio).

Si el form completo es demasiado largo para el aside: version compacta (nombre, email, botón «Enviar cotización») y link «Ver formulario completo» → `#cotizar`.

### C) `/pago` sin fecha

Verificar `PagoClient`: si el curso llega sin `schedule`/`fecha`, debe poder completar compra o elegir «próxima fecha por confirmar» sin romper. Si hoy bloquea, ajustar el mínimo necesario (mensaje claro + permitir pagar / lista de espera). No rediseñar checkout.

### D) Datos (opcional, fuera de código si Manu prefiere)

Cargar cohortes activas en `course_schedules` para los cursos que hoy no tienen fecha mejora el copy de la tarjeta, pero **no** es sustituto del CTA de compra.

## Fuera de alcance

- No merge a `main` sin OK de Manu.
- No tocar Maverlang / otros Hermes.
- No editar DNS, ads, ni guías de Pluma.
- No quitar precio público ni JSON-LD Offer.

## Verificación

1. Curso **sin** fechas (ej. `/cursos/excel`): precio visible + **Inscribirse/Comprar ahora** + secundario Consultar fechas + mini form.
2. Curso **con** fechas (ej. `/cursos/analisis-de-datos`): Inscribirse/Comprar → `/pago` logueado; AuthModal si no.
3. Logueado en curso sin fechas: aparece **Comprar ahora** y navega a `/pago?curso=...`.
4. Submit del mini form: mismo éxito que `#cotizar`.
5. Vista empresas intacta.
6. `npm run build` (con `--webpack` como en package.json) OK.

## Entrega

- Commit en `fix/ficha-cta-compra`.
- Archivo `HERMES_REPORTE_FICHA_CTA.md` con archivos tocados, URLs de prueba y capturas mentales (qué botón se ve).
- Push de la rama; **no** mergear.

Cuando termines, avisa en el reporte: listo para review de Radar/Manu.
