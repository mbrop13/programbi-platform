import { z } from "zod";
import {
  CHILE_ACCOUNT_TYPES,
  CHILE_BANKS,
  INTRO_SOURCES,
  REFERRAL_STATUSES,
  REFERRER_STATUSES,
  REFERRER_TYPES,
} from "./constants";
import { isValidRut } from "./format";

export const introSchema = z.object({
  prospectName: z.string().trim().min(2).max(120),
  prospectCompany: z.string().trim().min(2).max(160),
  prospectRole: z.string().trim().min(2).max(120),
  prospectEmail: z
    .string()
    .trim()
    .email()
    .max(160)
    .optional()
    .or(z.literal("")),
  prospectPhone: z.string().trim().max(30).optional().or(z.literal("")),
  prospectLinkedIn: z
    .string()
    .trim()
    .url()
    .max(240)
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.enum(INTRO_SOURCES).default("other"),
});

export const registerReferrerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  type: z.enum(REFERRER_TYPES).default("other"),
  acceptsTerms: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar las reglas del programa." }),
  }),
});

export const bankSchema = z.object({
  bank: z.string().min(2).max(80),
  accountType: z.enum(CHILE_ACCOUNT_TYPES),
  accountNumber: z.string().trim().min(4).max(32).regex(/^[\d\s-]+$/),
  rut: z
    .string()
    .trim()
    .refine(isValidRut, "RUT inválido"),
  accountHolder: z.string().trim().min(2).max(120),
});

export const wonSchema = z.object({
  dealAmountClp: z.number().int().positive().max(100_000_000_000),
  note: z.string().trim().max(1000).optional(),
});

export const lostSchema = z.object({
  reason: z.string().trim().min(3).max(500),
});

export const statusPatchSchema = z.object({
  status: z.enum(REFERRAL_STATUSES),
  note: z.string().trim().max(1000).optional(),
});

export const payCommissionSchema = z.object({
  paymentRef: z.string().trim().min(2).max(80),
});

export const clawbackSchema = z.object({
  reason: z.string().trim().min(3).max(500),
  force: z.boolean().optional(),
});

export const referrerAdminPatchSchema = z.object({
  status: z.enum(REFERRER_STATUSES).optional(),
  type: z.enum(REFERRER_TYPES).optional(),
  name: z.string().trim().min(2).max(120).optional(),
});

export const profilePatchSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().max(30).optional(),
  type: z.enum(REFERRER_TYPES).optional(),
  bank: bankSchema.optional(),
});

export { CHILE_BANKS };
