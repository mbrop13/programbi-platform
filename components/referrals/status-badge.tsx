import { cn } from "@/lib/utils";
import { STATUS_LABELS, STATUS_TONE } from "@/lib/referrals/status";
import type { ReferralStatus } from "@/lib/referrals/types";
import { COMMISSION_LABELS } from "@/lib/referrals/status";
import type { CommissionStatus } from "@/lib/referrals/types";

const toneClass: Record<string, string> = {
  neutral: "bg-muted text-muted-foreground ring-border",
  info: "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20",
  progress:
    "bg-indigo-50 text-indigo-800 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20",
  success:
    "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
  danger:
    "bg-red-50 text-red-800 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20",
  money:
    "bg-emerald-50 text-emerald-900 ring-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-400/25",
};

export function StatusBadge({ status }: { status: ReferralStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium ring-1 ring-inset",
        toneClass[STATUS_TONE[status]]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function CommissionBadge({ status }: { status: CommissionStatus }) {
  const tone =
    status === "paid"
      ? "money"
      : status === "clawed_back"
        ? "danger"
        : status === "payable"
          ? "success"
          : "info";
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium ring-1 ring-inset",
        toneClass[tone]
      )}
    >
      {COMMISSION_LABELS[status]}
    </span>
  );
}
