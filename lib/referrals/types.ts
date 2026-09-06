import type {
  COMMISSION_STATUSES,
  INTRO_SOURCES,
  REFERRAL_STATUSES,
  REFERRER_STATUSES,
  REFERRER_TYPES,
} from "./constants";

export type ReferrerType = (typeof REFERRER_TYPES)[number];
export type ReferrerStatus = (typeof REFERRER_STATUSES)[number];
export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];
export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];
export type IntroSource = (typeof INTRO_SOURCES)[number];

export type Referrer = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  type: ReferrerType;
  status: ReferrerStatus;
  referral_code: string;
  has_bank: boolean;
  created_at: string;
  updated_at: string;
};

export type BankDetails = {
  bank: string;
  accountType: string;
  accountNumber: string;
  rut: string;
  accountHolder: string;
};

export type Referral = {
  id: string;
  referrer_id: string;
  prospect_name: string;
  prospect_company: string;
  prospect_role: string;
  prospect_email: string | null;
  prospect_phone: string | null;
  prospect_linkedin: string | null;
  notes: string | null;
  source: IntroSource | string;
  status: ReferralStatus;
  lost_reason: string | null;
  suggested_from_cookie: boolean;
  prospect_user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Commission = {
  id: string;
  referral_id: string;
  deal_amount_clp: number;
  percent: number;
  commission_amount_clp: number;
  status: CommissionStatus;
  paid_at: string | null;
  payment_ref: string | null;
  clawback_at: string | null;
  clawback_reason: string | null;
  created_at: string;
  updated_at: string;
};

export type AuditLog = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  meta: Record<string, unknown>;
  at: string;
};

export type ReferralWithCommission = Referral & {
  commission: Commission | null;
  referrer?: Pick<Referrer, "id" | "name" | "email" | "referral_code" | "type" | "status">;
};

export type ReferrerStats = {
  introsSent: number;
  inPipeline: number;
  won: number;
  lost: number;
  conversionRate: number;
  commissionEarnedClp: number;
  commissionPaidClp: number;
  commissionPayableClp: number;
};

export type LeadHint = {
  id: string;
  referral_code: string;
  lead_name: string | null;
  lead_email: string | null;
  lead_company: string | null;
  lead_phone: string | null;
  landing_path: string | null;
  status: "suggested" | "confirmed" | "dismissed";
  created_at: string;
};
