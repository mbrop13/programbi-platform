import type { ReferralStatus } from "./types";

export const STATUS_LABELS: Record<ReferralStatus, string> = {
  submitted: "Enviada",
  in_review: "En revisión",
  qualified: "Calificada",
  diagnosis_scheduled: "Diagnóstico agendado",
  proposal_sent: "Propuesta enviada",
  won: "Ganada",
  lost: "Perdida",
  paid: "Comisión pagada",
  clawback: "Clawback",
};

export const STATUS_HELP: Record<ReferralStatus, string> = {
  submitted: "Recibimos tu intro. El equipo la revisa antes de calificarla.",
  in_review: "ProgramBI está validando que el contacto encaje con el Pack.",
  qualified: "Intro calificada: el prospecto entra al proceso comercial.",
  diagnosis_scheduled: "Agendamos el diagnóstico de 30 min.",
  proposal_sent: "Enviamos propuesta del Pack Adopción.",
  won: "Pack cerrado y cobrado. Tu comisión 15% quedó generada.",
  lost: "No avanzó. Puedes enviar otra intro cuando tengas un mejor fit.",
  paid: "Transferimos tu comisión.",
  clawback: "Nota de crédito / devolución dentro de 60 días.",
};

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
  other: "Otro",
} as const;

/** Transiciones que el admin puede disparar desde la UI. */
export const ADMIN_TRANSITIONS: Record<ReferralStatus, ReferralStatus[]> = {
  submitted: ["in_review", "qualified", "lost"],
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
  { id: "submitted", label: "Enviadas" },
  { id: "in_review", label: "En revisión" },
  { id: "qualified", label: "Calificadas" },
  { id: "diagnosis_scheduled", label: "Diagnóstico" },
  { id: "proposal_sent", label: "Propuesta" },
  { id: "won", label: "Ganadas" },
  { id: "lost", label: "Perdidas" },
  { id: "paid", label: "Pagadas" },
  { id: "clawback", label: "Clawback" },
];
