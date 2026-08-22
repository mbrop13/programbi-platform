import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, getClientIp } from "@/lib/auth-helpers";
import { createServiceClient } from "@/lib/supabase";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { generateUniqueSlug, notifyUsers } from "@/lib/jobs/queries";
import { getEmployerMembership } from "@/lib/jobs/employer-guard";

const companySchema = z.object({
  name: z.string().min(2).max(120),
  website: z.string().url().max(300).optional().nullable().or(z.literal("")),
  industry: z.string().max(80).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  size: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  contact_email: z.string().email(),
  contact_whatsapp: z.string().max(30).optional().nullable(),
});

/** Registro de empresa: queda pendiente de aprobación por el equipo ProgramBI. */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limitRes = isRateLimited(ip, "employer-register", 3, 60 * 60 * 1000);
    if (limitRes.limited) {
      return NextResponse.json({ error: "Demasiados intentos de registro." }, { status: 429 });
    }

    const auth = await requireUser();
    if (!auth.ok) return auth.response;
    const { user } = auth.data;

    const body = await req.json();
    const validation = companySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos de la empresa inválidos." }, { status: 400 });
    }
    const d = validation.data;

    // Un usuario solo puede tener una empresa registrada
    const existing = await getEmployerMembership(user.id);
    if (existing) {
      return NextResponse.json(
        { error: "Ya perteneces a una empresa registrada en la bolsa de trabajo." },
        { status: 409 }
      );
    }

    const service = createServiceClient();
    const slug = await generateUniqueSlug("employer_companies", d.name);

    const { data: company, error } = await service
      .from("employer_companies")
      .insert({
        name: d.name.trim(),
        slug,
        website: d.website || null,
        industry: d.industry?.trim() || null,
        description: d.description?.trim() || null,
        size: d.size ?? null,
        city: d.city?.trim() || null,
        country: d.country?.trim() || "Chile",
        contact_email: d.contact_email,
        contact_whatsapp: d.contact_whatsapp || null,
        status: "pending",
        owner_user_id: user.id,
      })
      .select("id, slug, status")
      .single();

    if (error || !company) {
      console.error("employer register error:", error);
      return NextResponse.json({ error: "No pudimos registrar tu empresa." }, { status: 500 });
    }

    await service.from("employer_members").insert({
      company_id: company.id,
      user_id: user.id,
      role: "owner",
    });

    // Notificar a los admins del portal
    const { data: admins } = await service.from("admin_users").select("user_id");
    await notifyUsers((admins ?? []).map((a: any) => a.user_id), {
      type: "system",
      title: "Empresa pendiente de aprobación",
      message: `«${d.name}» solicitó publicar en la bolsa de trabajo.`,
      link: "/admin",
    });

    return NextResponse.json({ success: true, company });
  } catch (err: any) {
    console.error("API Error in employer/companies:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
