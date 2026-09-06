import { NextResponse } from "next/server";
import { requireReferralAdmin } from "@/lib/referrals/auth";
import { referrerAdminPatchSchema } from "@/lib/referrals/schemas";
import { writeAudit } from "@/lib/referrals/queries";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireReferralAdmin();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = referrerAdminPatchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }
  const { data, error } = await auth.data.admin
    .from("referrers")
    .update(parsed.data)
    .eq("id", id)
    .select("id, status, type, name")
    .maybeSingle();
  if (error || !data) {
    return NextResponse.json({ error: "No se pudo actualizar." }, { status: 500 });
  }
  await writeAudit({
    actorId: auth.data.user.id,
    actorEmail: auth.data.user.email,
    action: "referrer.admin_patch",
    entityType: "referrer",
    entityId: id,
    meta: parsed.data,
  });
  return NextResponse.json({ referrer: data });
}
