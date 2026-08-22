import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireEmployer } from "@/lib/jobs/employer-guard";

const companyUpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  logo_url: z.string().max(500).optional().nullable(),
  website: z.string().url().max(300).optional().nullable().or(z.literal("")),
  industry: z.string().max(80).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  size: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  contact_email: z.string().email().optional(),
  contact_whatsapp: z.string().max(30).optional().nullable(),
});

export async function GET() {
  try {
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    return NextResponse.json({ company: auth.data.company });
  } catch (err: any) {
    console.error("API Error in employer/profile GET:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireEmployer();
    if (!auth.ok) return auth.response;
    const { company, supabase } = auth.data;

    const body = await req.json();
    const validation = companyUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }
    const d = validation.data;

    const payload: Record<string, any> = {};
    if (d.name !== undefined) payload.name = d.name.trim();
    if (d.logo_url !== undefined) payload.logo_url = d.logo_url || null;
    if (d.website !== undefined) payload.website = d.website || null;
    if (d.industry !== undefined) payload.industry = d.industry?.trim() || null;
    if (d.description !== undefined) payload.description = d.description?.trim() || null;
    if (d.size !== undefined) payload.size = d.size ?? null;
    if (d.city !== undefined) payload.city = d.city?.trim() || null;
    if (d.country !== undefined) payload.country = d.country?.trim() || null;
    if (d.contact_email !== undefined) payload.contact_email = d.contact_email;
    if (d.contact_whatsapp !== undefined) payload.contact_whatsapp = d.contact_whatsapp || null;

    if (!Object.keys(payload).length) {
      return NextResponse.json({ error: "Nada que actualizar." }, { status: 400 });
    }

    const { error } = await supabase
      .from("employer_companies")
      .update(payload)
      .eq("id", company.id);

    if (error) {
      console.error("employer/profile PATCH error:", error);
      return NextResponse.json({ error: "No pudimos actualizar tu empresa." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error in employer/profile PATCH:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
