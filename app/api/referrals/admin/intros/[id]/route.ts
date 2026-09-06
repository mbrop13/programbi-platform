import { NextResponse } from "next/server";
import { requireReferralAdmin } from "@/lib/referrals/auth";
import { calculateCommissionClp, isWithinClawbackWindow } from "@/lib/referrals/commission";
import { REFERRAL_COMMISSION_PERCENT } from "@/lib/referrals/constants";
import { canTransition } from "@/lib/referrals/status";
import { clawbackSchema, lostSchema, statusPatchSchema, wonSchema } from "@/lib/referrals/schemas";
import { writeAudit } from "@/lib/referrals/queries";
import { notifyCommissionPaid, notifyStatusChange } from "@/lib/referrals/emails";
import type { ReferralStatus } from "@/lib/referrals/types";
import { createAdminClient } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id: string }> };

async function loadBundle(admin: ReturnType<typeof createAdminClient>, id: string) {
  const { data: referral, error } = await admin
    .from("referrals")
    .select("*, referral_commissions(*), referrers(id, name, email, referral_code, user_id)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return referral;
}

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireReferralAdmin();
  if (!auth.ok) return auth.response;
  const { id } = await ctx.params;
  const json = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!json || typeof json.action !== "string") {
    return NextResponse.json({ error: "Acción requerida." }, { status: 400 });
  }

  const row = await loadBundle(auth.data.admin, id);
  if (!row) return NextResponse.json({ error: "Intro no encontrada." }, { status: 404 });

  const current = row.status as ReferralStatus;
  const referrer = row.referrers as { name: string; email: string } | null;

  const action = json.action;

  if (action === "status") {
    const parsed = statusPatchSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
    }
    if (!canTransition(current, parsed.data.status)) {
      return NextResponse.json(
        { error: `No se puede pasar de ${current} a ${parsed.data.status}.` },
        { status: 400 }
      );
    }
    const { error } = await auth.data.admin
      .from("referrals")
      .update({ status: parsed.data.status })
      .eq("id", id);
    if (error) return NextResponse.json({ error: "No se pudo actualizar." }, { status: 500 });
    await writeAudit({
      actorId: auth.data.user.id,
      actorEmail: auth.data.user.email,
      action: "referral.status",
      entityType: "referral",
      entityId: id,
      meta: { from: current, to: parsed.data.status, note: parsed.data.note },
    });
    if (referrer) {
      void notifyStatusChange({
        referrerName: referrer.name,
        referrerEmail: referrer.email,
        prospectName: row.prospect_name,
        prospectCompany: row.prospect_company,
        status: parsed.data.status,
      });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "lost") {
    const parsed = lostSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Indica la razón." }, { status: 400 });
    }
    if (!canTransition(current, "lost") && current !== "lost") {
      return NextResponse.json({ error: "No se puede marcar perdida desde este estado." }, { status: 400 });
    }
    const { error } = await auth.data.admin
      .from("referrals")
      .update({ status: "lost", lost_reason: parsed.data.reason })
      .eq("id", id);
    if (error) return NextResponse.json({ error: "No se pudo actualizar." }, { status: 500 });
    await writeAudit({
      actorId: auth.data.user.id,
      actorEmail: auth.data.user.email,
      action: "referral.lost",
      entityType: "referral",
      entityId: id,
      meta: { reason: parsed.data.reason, from: current },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "won") {
    const parsed = wonSchema.safeParse({
      dealAmountClp: Number(json.dealAmountClp),
      note: json.note,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "El monto cobrado (CLP) es obligatorio." },
        { status: 400 }
      );
    }
    if (current !== "proposal_sent" && current !== "won") {
      return NextResponse.json(
        { error: "Marca won solo desde propuesta enviada (Pack cerrado y cobrado)." },
        { status: 400 }
      );
    }

    const existing = Array.isArray(row.referral_commissions)
      ? row.referral_commissions[0]
      : row.referral_commissions;
    if (existing) {
      return NextResponse.json({ error: "Esta intro ya tiene comisión (un Pack = una comisión)." }, { status: 409 });
    }

    const amount = calculateCommissionClp(parsed.data.dealAmountClp);
    const { error: cErr } = await auth.data.admin.from("referral_commissions").insert({
      referral_id: id,
      deal_amount_clp: parsed.data.dealAmountClp,
      percent: REFERRAL_COMMISSION_PERCENT,
      commission_amount_clp: amount,
      status: "payable",
    });
    if (cErr) {
      console.error("[referrals] commission insert", cErr.message);
      return NextResponse.json({ error: "No se pudo crear la comisión." }, { status: 500 });
    }
    await auth.data.admin.from("referrals").update({ status: "won" }).eq("id", id);
    await writeAudit({
      actorId: auth.data.user.id,
      actorEmail: auth.data.user.email,
      action: "referral.won",
      entityType: "referral",
      entityId: id,
      meta: {
        dealAmountClp: parsed.data.dealAmountClp,
        commissionAmountClp: amount,
        note: parsed.data.note,
      },
    });
    if (referrer) {
      void notifyStatusChange({
        referrerName: referrer.name,
        referrerEmail: referrer.email,
        prospectName: row.prospect_name,
        prospectCompany: row.prospect_company,
        status: "won",
      });
    }
    return NextResponse.json({ ok: true, commissionAmountClp: amount });
  }

  if (action === "pay") {
    const comm = Array.isArray(row.referral_commissions)
      ? row.referral_commissions[0]
      : row.referral_commissions;
    if (!comm) return NextResponse.json({ error: "No hay comisión." }, { status: 400 });
    const paymentRef = String(json.paymentRef || "").trim();
    if (paymentRef.length < 2) {
      return NextResponse.json({ error: "Referencia de pago requerida." }, { status: 400 });
    }
    const { error } = await auth.data.admin
      .from("referral_commissions")
      .update({ status: "paid", paid_at: new Date().toISOString(), payment_ref: paymentRef })
      .eq("id", comm.id);
    if (error) return NextResponse.json({ error: "No se pudo marcar pagada." }, { status: 500 });
    await auth.data.admin.from("referrals").update({ status: "paid" }).eq("id", id);
    await writeAudit({
      actorId: auth.data.user.id,
      actorEmail: auth.data.user.email,
      action: "commission.paid",
      entityType: "commission",
      entityId: comm.id,
      meta: { paymentRef, referralId: id },
    });
    if (referrer) {
      void notifyCommissionPaid({
        referrerName: referrer.name,
        referrerEmail: referrer.email,
        prospectCompany: row.prospect_company,
        amountClp: Number(comm.commission_amount_clp),
        paymentRef,
      });
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "clawback") {
    const parsed = clawbackSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Indica la razón del clawback." }, { status: 400 });
    }
    const comm = Array.isArray(row.referral_commissions)
      ? row.referral_commissions[0]
      : row.referral_commissions;
    if (!comm) return NextResponse.json({ error: "No hay comisión." }, { status: 400 });
    if (comm.paid_at && !isWithinClawbackWindow(comm.paid_at) && !parsed.data.force) {
      return NextResponse.json(
        { error: "Fuera de la ventana de 60 días. Usa force=true para override." },
        { status: 400 }
      );
    }
    await auth.data.admin
      .from("referral_commissions")
      .update({
        status: "clawed_back",
        clawback_at: new Date().toISOString(),
        clawback_reason: parsed.data.reason,
      })
      .eq("id", comm.id);
    await auth.data.admin.from("referrals").update({ status: "clawback" }).eq("id", id);
    await writeAudit({
      actorId: auth.data.user.id,
      actorEmail: auth.data.user.email,
      action: "commission.clawback",
      entityType: "commission",
      entityId: comm.id,
      meta: { reason: parsed.data.reason, force: Boolean(parsed.data.force) },
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Acción desconocida." }, { status: 400 });
}
