import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendNewMemberNotification } from '@/lib/email/mailersend'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const regSource = searchParams.get('reg_source')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if this is a NEW user (created within the last 60 seconds)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: managerRecord } = await supabase
            .from("organization_managers")
            .select("organization_id")
            .eq("profile_id", user.id)
            .maybeSingle();

          if (managerRecord) {
            return NextResponse.redirect(`${origin}/comunidad/business`)
          }

          const createdAt = new Date(user.created_at).getTime()
          const now = Date.now()
          const isNewUser = (now - createdAt) < 60_000 // within 60 seconds

          if (isNewUser) {
            // Guardar origen de registro solo en usuarios nuevos (OAuth o confirmación de email)
            const sourceFromMeta = user.user_metadata?.registration_source as string | undefined
            const finalSource = (regSource || sourceFromMeta || "").slice(0, 500)
            if (finalSource) {
              const { error: srcErr } = await supabase
                .from("profiles")
                .update({ registration_source: finalSource })
                .eq("id", user.id)
                .is("registration_source", null)
              if (srcErr) console.error("❌ registration_source update:", srcErr.message)
            }

            const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Usuario"
            await sendNewMemberNotification({
              name,
              email: user.email || "",
              phone: user.user_metadata?.whatsapp || undefined,
            }).catch((err) => console.error("❌ New member notification (OAuth):", err?.message))
            console.log("✅ New OAuth member notification sent for:", name)
          }
        }
      } catch (err) {
        // Don't block the redirect if notification fails
        console.error("❌ OAuth member check error:", err)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If there's an error, redirect to the homepage
  return NextResponse.redirect(`${origin}/?auth_error=true`)
}
