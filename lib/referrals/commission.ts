import { REFERRAL_CLAWBACK_DAYS, REFERRAL_COMMISSION_PERCENT } from "./constants";

/** Comisión v1: floor(neto cobrado × 15%). Enteros CLP, sin float. */
export function calculateCommissionClp(
  dealAmountClp: number,
  percent = REFERRAL_COMMISSION_PERCENT
): number {
  if (!Number.isFinite(dealAmountClp) || dealAmountClp <= 0) return 0;
  const amount = Math.trunc(dealAmountClp);
  const p = Math.trunc(percent);
  return Math.floor((amount * p) / 100);
}

export function isWithinClawbackWindow(paidAt: string | Date, now = new Date()): boolean {
  const paid = typeof paidAt === "string" ? new Date(paidAt) : paidAt;
  if (Number.isNaN(paid.getTime())) return false;
  const deadline = new Date(paid.getTime() + REFERRAL_CLAWBACK_DAYS * 24 * 60 * 60 * 1000);
  return now.getTime() <= deadline.getTime();
}

export function clawbackDeadline(paidAt: string | Date): Date {
  const paid = typeof paidAt === "string" ? new Date(paidAt) : paidAt;
  return new Date(paid.getTime() + REFERRAL_CLAWBACK_DAYS * 24 * 60 * 60 * 1000);
}
