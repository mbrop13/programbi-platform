import { NextResponse } from "next/server";
import { requireUser, type AuthResult } from "@/lib/auth-helpers";
import type { EmployerCompany } from "@/lib/jobs/types";

export interface EmployerAuthResult {
  user: AuthResult["user"];
  supabase: AuthResult["supabase"];
  company: EmployerCompany;
  memberRole: "owner" | "recruiter";
}

/**
 * Verifica que el usuario sea miembro de una empresa aprobada.
 * Retorna 401 si no hay sesión, 403 si no es miembro o la empresa no está aprobada.
 */
export async function requireEmployer(): Promise<
  { ok: true; data: EmployerAuthResult } | { ok: false; response: NextResponse }
> {
  const auth = await requireUser();
  if (!auth.ok) return auth;

  const { user, supabase } = auth.data;

  const { data: membership } = await supabase
    .from("employer_members")
    .select("role, company_id, employer_companies!inner(*)")
    .eq("user_id", user.id)
    .maybeSingle();

  // employer_companies es !inner: si la empresa no pasa su RLS, membership llega null.
  if (!membership || (membership.role !== "owner" && membership.role !== "recruiter")) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "No tienes acceso a un panel de empresa." },
        { status: 403 }
      ),
    };
  }

  const company = membership.employer_companies as unknown as EmployerCompany;
  if (company.status !== "approved") {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Tu empresa aún no está aprobada para publicar." },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    data: { user, supabase, company, memberRole: membership.role as "owner" | "recruiter" },
  };
}

/** Membresía sin exigir aprobación (para /api/employer/verify y registro). */
export async function getEmployerMembership(userId: string) {
  const { createServiceClient } = await import("@/lib/supabase");
  const service = createServiceClient();
  const { data } = await service
    .from("employer_members")
    .select("role, company_id, employer_companies(*)")
    .eq("user_id", userId)
    .maybeSingle();
  return data as
    | { role: string; company_id: string; employer_companies: EmployerCompany | null }
    | null;
}
