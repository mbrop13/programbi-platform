import type { ReferralStatus } from "./types";

export const STATUS_LABELS: Record<ReferralStatus, string> = {
  submitted: "Por confirmar",
  in_review: "En revisión",
  qualified: "En revisión",
  diagnosis_scheduled: "En revisión",
  proposal_sent: "En revisión",
  won: "Cobro confirmado",
  lost: "No avanzó",
  paid: "Comisión pagada",
  clawback: "Clawback",
};

export const STATUS_HELP: Record<ReferralStatus, string> = {
  submitted:
    "Llegó con tu link. ProgramBI confirma en el panel si el curso o la capacitación se cobró. Esa confirmación puede demorar hasta 24 horas.",
  in_review: "ProgramBI está revisando el caso.",
  qualified: "ProgramBI está revisando el caso.",
  diagnosis_scheduled: "ProgramBI está revisando el caso.",
  proposal_sent: "ProgramBI está revisando el caso.",
  won: "Confirmamos que se cobró. Tu comisión del 15% quedó generada.",
  lost: "No avanzó.",
  paid: "Transferimos tu comisión.",
  clawback: "Nota de crédito o devolución dentro de 60 días.",
};

/** El admin confirma el cobro desde estos estados. No hace falta recorrer un embudo previo. */
export const CONFIRMABLE_STATUSES: ReferralStatus[] = [
  "submitted",
  "in_review",
  "qualified",
  "diagnosis_scheduled",
  "proposal_sent",
];

export function referralSignedUp(userId: string | null | undefined): boolean {
  return Boolean(userId);
}

export function referralSignedUpLabel(userId: string | null | undefined): string {
  return referralSignedUp(userId) ? "Se inscribió" : "No se ha inscrito";
}

export const STATUS_TONE: Record<
  ReferralStatus,
  "neutral" | "info" | "progress" | "success" | "danger" | "money"
> = {
  submitted: "neutral",
  in_review: "info",
  qualified: "progress",
  diagnosis_scheduled: "progress",
  proposal_sent: "progress",
  won: "success",
  lost: "danger",
  paid: "money",
  clawback: "danger",
};

export const COMMISSION_LABELS = {
  accrued: "Devengada",
  payable: "Por pagar",
  paid: "Pagada",
  clawed_back: "Clawback",
} as const;

export const REFERRER_TYPE_LABELS = {
  alumni: "Alumni",
  client: "Cliente",
  partner: "Partner",
  other: "Otro",
} as const;

export const REFERRER_STATUS_LABELS = {
  pending: "Pendiente",
  active: "Activa",
  suspended: "Suspendida",
} as const;

export const SOURCE_LABELS = {
  whatsapp: "WhatsApp",
  linkedin: "LinkedIn",
  email: "Email",
  in_person: "Presencial",
  signup: "Link",
  form: "Formulario",
  other: "Otro",
} as const;

/** Transiciones que el admin puede disparar desde la UI. */
export const ADMIN_TRANSITIONS: Record<ReferralStatus, ReferralStatus[]> = {
  submitted: ["in_review", "qualified", "won", "lost"],
  in_review: ["qualified", "lost", "submitted"],
  qualified: ["diagnosis_scheduled", "lost"],
  diagnosis_scheduled: ["proposal_sent", "lost"],
  proposal_sent: ["won", "lost"],
  won: [],
  lost: ["in_review"],
  paid: [],
  clawback: [],
};

export function canTransition(from: ReferralStatus, to: ReferralStatus): boolean {
  if (from === to) return true;
  return ADMIN_TRANSITIONS[from]?.includes(to) ?? false;
}

export const KANBAN_COLUMNS: { id: ReferralStatus; label: string }[] = [
  { id: "submitted", label: "Registrados" },
  { id: "in_review", label: "En revisión" },
  { id: "qualified", label: "Calificadas" },
  { id: "diagnosis_scheduled", label: "Diagnóstico" },
  { id: "proposal_sent", label: "Propuesta" },
  { id: "won", label: "Ganadas" },
  { id: "lost", label: "Perdidas" },
  { id: "paid", label: "Pagadas" },
  { id: "clawback", label: "Clawback" },
];
