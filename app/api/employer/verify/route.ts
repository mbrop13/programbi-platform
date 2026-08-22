import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { getEmployerMembership } from "@/lib/jobs/employer-guard";

/**
 * Verifica si el usuario actual pertenece a una empresa de la bolsa de trabajo.
 * Usado por el portal para mostrar/ocultar el panel de empresa.
 */
export async function GET() {
  try {
    const auth = await requireUser();
    if (!auth.ok) return NextResponse.json({ membership: null });

    const membership = await getEmployerMembership(auth.data.user.id);
    if (!membership) return NextResponse.json({ membership: null });

    return NextResponse.json({
      membership: {
        role: membership.role,
        company: membership.employer_companies,
      },
    });
  } catch (err: any) {
    console.error("API Error in employer/verify:", err);
    return NextResponse.json({ membership: null });
  }
}
