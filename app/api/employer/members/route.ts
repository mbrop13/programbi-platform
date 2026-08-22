import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase";
import { requireEmployer } from "@/lib/jobs/employer-guard";
import { notifyUsers } from "@/lib/jobs/queries";

const inviteSchema = z.object({
  email: z.string().email().max(200),
  role: z.enum(["owner", "recruiter"]).optional(),
});

/** Miembros de la empresa con datos de perfil. */
export async function GET() {
  try {
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { company } = auth.data;

    const service = createServiceClient();
    const { data, error } = await service
      .from("employer_members")
      .select(`
        id, user_id, role, created_at,
        profiles!employer_members_user_id_fkey (full_name, email)
      `)
      .eq("company_id", company.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("employer/members GET error:", error);
      return NextResponse.json({ error: "Error al cargar el equipo." }, { status: 500 });
    }

    return NextResponse.json({
      members: (data ?? []).map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        role: m.role,
        created_at: m.created_at,
        full_name: m.profiles?.full_name ?? null,
        email: m.profiles?.email ?? null,
      })),
    });
  } catch (err: any) {
    console.error("API Error in employer/members GET:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

/**
 * Invitar reclutador por email. La persona debe tener cuenta ProgramBI;
 * si no existe, se le indica que se registre primero.
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { user, company, memberRole } = auth.data;

    if (memberRole !== "owner") {
      return NextResponse.json(
        { error: "Solo el dueño de la empresa puede invitar reclutadores." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = inviteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }
    const email = validation.data.email.toLowerCase().trim();

    const service = createServiceClient();
    const { data: profile } = await service
      .from("profiles")
      .select("id, full_name")
      .ilike("email", email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json(
        {
          error:
            "Esa persona aún no tiene cuenta en ProgramBI. Pídele registrarse en programbi.com/registro con ese email y volver a intentarlo.",
        },
        { status: 404 }
      );
    }

    const { data: existing } = await service
      .from("employer_members")
      .select("id")
      .eq("company_id", company.id)
      .eq("user_id", profile.id)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: "Esa persona ya pertenece a tu empresa." }, { status: 409 });
    }

    const { error } = await service.from("employer_members").insert({
      company_id: company.id,
      user_id: profile.id,
      role: validation.data.role === "owner" ? "owner" : "recruiter",
      invited_by: user.id,
    });
    if (error) {
      console.error("employer/members POST error:", error);
      return NextResponse.json({ error: "No pudimos agregar al reclutador." }, { status: 500 });
    }

    await notifyUsers([profile.id], {
      type: "system",
      title: "Ahora gestionas vacantes de una empresa",
      message: `Fuiste agregado al equipo de «${company.name}» en la Bolsa de Trabajo.`,
      link: "/comunidad/empleos",
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in employer/members POST:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

/** Quitar un reclutador (solo el dueño; no puede quitarse a sí mismo). */
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { user, company, memberRole } = auth.data;

    if (memberRole !== "owner") {
      return NextResponse.json({ error: "Solo el dueño puede quitar reclutadores." }, { status: 403 });
    }

    const memberId = req.nextUrl.searchParams.get("id");
    if (!memberId) {
      return NextResponse.json({ error: "Falta el id del miembro." }, { status: 400 });
    }

    const service = createServiceClient();
    const { data: member } = await service
      .from("employer_members")
      .select("id, user_id, role")
      .eq("id", memberId)
      .eq("company_id", company.id)
      .maybeSingle();

    if (!member) {
      return NextResponse.json({ error: "Miembro no encontrado." }, { status: 404 });
    }
    if (member.user_id === user.id) {
      return NextResponse.json({ error: "No puedes quitarte a ti mismo." }, { status: 400 });
    }

    const { error } = await service
      .from("employer_members")
      .delete()
      .eq("id", memberId)
      .eq("company_id", company.id);
    if (error) {
      return NextResponse.json({ error: "No pudimos quitar al reclutador." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in employer/members DELETE:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
