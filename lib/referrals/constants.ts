import { PACK } from "@/lib/data/pack-adopcion";

export const REFERRAL_COMMISSION_PERCENT = 15;
export const REFERRAL_CLAWBACK_DAYS = 60;
export const REFERRAL_INTRO_DAILY_LIMIT = 5;
export const REFERRAL_COOKIE_NAME = "pb_ref";
export const REFERRAL_COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;
export const REFERRAL_CODE_PREFIX = "PB";

export const REFERRAL_TICKET_MIN_CLP = PACK.priceMinClp;
export const REFERRAL_TICKET_MAX_CLP = PACK.priceMaxClp;
export const REFERRAL_TICKET_DEFAULT_CLP = PACK.priceFromClp;

export const REFERRER_TYPES = ["alumni", "client", "partner", "other"] as const;
export const REFERRER_STATUSES = ["pending", "active", "suspended"] as const;

export const REFERRAL_STATUSES = [
  "submitted",
  "in_review",
  "qualified",
  "diagnosis_scheduled",
  "proposal_sent",
  "won",
  "lost",
  "paid",
  "clawback",
] as const;

export const COMMISSION_STATUSES = ["accrued", "payable", "paid", "clawed_back"] as const;

export const PIPELINE_STATUSES = [
  "submitted",
  "in_review",
  "qualified",
  "diagnosis_scheduled",
  "proposal_sent",
] as const;

export const WON_STATUSES = ["won", "paid"] as const;

export const CHILE_BANKS = [
  "Banco de Chile",
  "BancoEstado",
  "BCI",
  "Santander",
  "Scotiabank",
  "Itaú",
  "Security",
  "BICE",
  "Falabella",
  "Ripley",
  "Consorcio",
  "Internacional",
  "BTG Pactual",
  "HSBC",
  "Otro",
] as const;

export const CHILE_ACCOUNT_TYPES = ["Corriente", "Vista", "Ahorro", "RUT"] as const;

export const INTRO_SOURCES = [
  "whatsapp",
  "linkedin",
  "email",
  "in_person",
  "other",
] as const;
