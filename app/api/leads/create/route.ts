import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";
import { courses as courseCatalog, type Course } from "@/lib/data/courses";
import { isRateLimited } from "@/lib/security/rate-limiter";
import { normalizeReferralCode } from "@/lib/referrals/cookie";
import { REFERRAL_COOKIE_NAME } from "@/lib/referrals/constants";
import { recordOpenReferral } from "@/lib/referrals/open-lead";
import {
  sendQuoteConfirmationToLead,
  sendEnterpriseQuoteToLead,
  sendNewLeadNotificationToAdmin,
} from "@/lib/email/mailersend";
import { paisDeCotizacion } from "@/lib/email/quote-data";
import { getPais } from "@/config/paises";

// ─── Input Validation Schema ───
const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  whatsapp: z.string().max(30).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  selectedCourses: z.array(z.string()).optional().nullable(),
  sourceCourse: z.string().max(100).optional().nullable(),
  leadType: z.string().max(50).optional().nullable(),
  company: z.string().max(120).optional().nullable(),
  position: z.string().max(120).optional().nullable(),
  employeeCount: z.string().max(50).optional().nullable(),
  area: z.string().max(120).optional().nullable(),
  landing_path: z.string().max(256).optional().nullable(),
  pais: z.string().max(8).optional().nullable(),
  utm_source: z.string().max(120).optional().nullable(),
  utm_medium: z.string().max(120).optional().nullable(),
  utm_campaign: z.string().max(120).optional().nullable(),
  utm_content: z.string().max(120).optional().nullable(),
  utm_term: z.string().max(120).optional().nullable(),
  referral_code: z.string().max(16).optional().nullable(),
  // Variante de precio del gate (gate/direct). La columna puede no existir aún
  // en algunos entornos: el insert reintenta sin ella si Supabase la rechaza.
  pricingVariant: z.string().max(40).optional().nullable(),
  _website: z.string().optional().nullable(),
  _company_url: z.string().optional().nullable(),
  _fax: z.string().optional().nullable(),
  _t: z.any().optional(),
});

// ─── Tipos de lead ───
// Tipos aceptados por la web. contact, personal y brochure_pdf se guardan
// unificados como "contact" para que /admin/formularios los muestre juntos.
const LEAD_TYPES = [
  "contact",
  "personal",
  "brochure_pdf",
  "enterprise",
  "empresa",
  "asesoria_b2b",
  "webinar",
] as const;

const UNIFIED_CONTACT_TYPES: readonly string[] = ["contact", "personal", "brochure_pdf"];

/** Normaliza el tipo recibido; los tipos heredados (abandoned_cart, clase-gratis...) se conservan. */
function normalizeLeadType(value?: string | null): string {
  const raw = (value || "").trim();
  const lower = raw.toLowerCase();
  if ((LEAD_TYPES as readonly string[]).includes(lower)) return lower;
  return raw || "contact";
}

/** lead_type que se persiste en `course_leads`. */
function storedLeadType(value?: string | null): string {
  const normalized = normalizeLeadType(value);
  return UNIFIED_CONTACT_TYPES.includes(normalized) ? "contact" : normalized;
}

// ─── Resolución del curso cotizado ───
function normalizeCourseKey(value: string): string {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Slug del curso a partir de un slug exacto o de su título normalizado. */
function resolveCourseSlug(valor: string): string | null {
  const raw = (valor || "").trim();
  if (!raw) return null;

  const bySlug = courseCatalog.find((course) => course.slug === raw);
  if (bySlug) return bySlug.slug;

  const key = normalizeCourseKey(raw);
  if (!key) return null;

  const byTitle = courseCatalog.find((course) => {
    const shortTitle = (course as Course & { shortTitle?: string }).shortTitle;
    return [course.title, shortTitle].some((title) => !!title && normalizeCourseKey(title) === key);
  });
  return byTitle?.slug ?? null;
}

/** Detecta el error de PostgREST cuando la columna `pricing_variant` no existe. */
function isMissingPricingVariantError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const message = (error.message || "").toLowerCase();
  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    message.includes("pricing_variant") ||
    message.includes("schema cache")
  );
}

// ─── Anti-Bot Helpers ───

/** Honeypot: if a hidden field is filled, it's a bot */
function isHoneypotFilled(body: any): boolean {
  return !!(body._website || body._company_url || body._fax);
}

/** Heuristic: detect gibberish names/emails */
function looksLikeSpam(name: string, email: string, message?: string): boolean {
  // 1. Excessive non-latin / non-space characters in name (allow accented chars)
  const nonLatinRatio = (name.replace(/[\p{L}\p{M}\s.'-]/gu, "").length) / Math.max(name.length, 1);
  if (nonLatinRatio > 0.3) return true;

  // 2. Name is too short or too long
  if (name.length < 2 || name.length > 120) return true;

  // 3. Email domain has no dot (e.g. user@localhost)
  const domain = email.split("@")[1] || "";
  if (!domain.includes(".")) return true;

  // 4. Excessive URLs in message (spam)
  if (message) {
    const urlCount = (message.match(/https?:\/\//gi) || []).length;
    if (urlCount >= 3) return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    // ─── Rate Limiting ───
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const limitRes = isRateLimited(ip, "leads-create", 5, 60 * 1000); // Max 5 requests per minute
    if (limitRes.limited) {
      return NextResponse.json({ error: "Demasiados intentos. Por favor intente más tarde." }, { status: 429 });
    }

    const body = await req.json();

    // ─── Input Validation ───
    const validation = leadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Datos de entrada inválidos" }, { status: 400 });
    }

    const data = validation.data;

    // Curso cotizado y país: se resuelven antes de los chequeos anti-bot para
    // devolver siempre el brochure del curso en la respuesta de éxito.
    const pais = paisDeCotizacion(data.pais, data.landing_path);
    const brochureSlug =
      resolveCourseSlug(data.sourceCourse || data.selectedCourses?.[0] || "") || "power-bi";
    const successBody = {
      success: true,
      brochureUrl: `/cursos/${brochureSlug}/brochure?pais=${pais}`,
    };

    // ─── Anti-Bot Checks (silent reject → 200 to avoid bot retries) ───
    if (isHoneypotFilled(data)) {
      return NextResponse.json(successBody); // fake success
    }

    // Timing: el _t llega como timestamp de carga del form (o elapsed en ms).
    // Un humano tarda >1,5 s en llenar; envíos instantáneos son bots.
    const t = data._t;
    if (typeof t === "number" && Number.isFinite(t)) {
      const elapsed = t > 1e11 ? Date.now() - t : t;
      if (elapsed >= 0 && elapsed < 1500) {
        return NextResponse.json(successBody);
      }
    }

    const whatsappClean = data.whatsapp || data.phone;
    const {
      name, email, message, selectedCourses, sourceCourse, leadType: leadTypeRaw, company, position,
      employeeCount, area, landing_path, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      referral_code, pricingVariant,
    } = data;
    const leadType = normalizeLeadType(leadTypeRaw);
    const paisNombre = getPais(pais).nombre;
    const whatsapp = whatsappClean;

    if (looksLikeSpam(name, email, message || undefined)) {
      return NextResponse.json(successBody);
    }

    const adminDb = createAdminClient();

    const insertData: Record<string, any> = {
      name,
      email,
      whatsapp: whatsapp || null,
      message: message || null,
      selected_courses: selectedCourses || [],
      source_course: sourceCourse || null,
      lead_type: storedLeadType(leadType),
    };

    const isEnterprise =
      leadType === "enterprise" || leadType === "empresa" || leadType === "asesoria_b2b";
    const cookieHeader = req.headers.get("cookie") || "";
    const cookieMatch = cookieHeader.match(new RegExp(`(?:^|; )${REFERRAL_COOKIE_NAME}=([^;]*)`));
    const suggestedCode = normalizeReferralCode(
      referral_code || (cookieMatch ? decodeURIComponent(cookieMatch[1]) : null)
    );

    const extraInfo = [
      isEnterprise && company ? `Empresa: ${company}` : null,
      isEnterprise && position ? `Cargo: ${position}` : null,
      isEnterprise && area ? `Área: ${area}` : null,
      isEnterprise && employeeCount ? `Empleados a capacitar: ${employeeCount}` : null,
      `pais=${paisNombre}`,
      landing_path ? `page=${landing_path}` : null,
      utm_source ? `utm_source=${utm_source}` : null,
      utm_medium ? `utm_medium=${utm_medium}` : null,
      utm_campaign ? `utm_campaign=${utm_campaign}` : null,
      utm_content ? `utm_content=${utm_content}` : null,
      utm_term ? `utm_term=${utm_term}` : null,
      suggestedCode ? `ref=${suggestedCode} (sugerido, confirmar)` : null,
    ].filter(Boolean).join(" | ");
    if (extraInfo) {
      insertData.message = extraInfo + (message ? ` — ${message}` : "");
    }

    // `pricing_variant` solo viaja si el formulario lo envía. Si la columna aún
    // no existe en este entorno, Supabase rechaza el insert y se reintenta sin ella.
    const insertPayload: Record<string, any> = { ...insertData };
    if (pricingVariant) insertPayload.pricing_variant = pricingVariant;

    let { error } = await adminDb.from("course_leads").insert(insertPayload);

    if (error && pricingVariant && isMissingPricingVariantError(error)) {
      console.warn("[leads] pricing_variant no disponible en course_leads; se guarda sin la columna.");
      ({ error } = await adminDb.from("course_leads").insert(insertData));
    }

    if (error) {
      console.error("Error inserting lead:", error);
      return NextResponse.json({ error: "Error al guardar el contacto" }, { status: 500 });
    }

    if (suggestedCode) {
      await recordOpenReferral({
        code: suggestedCode,
        name,
        email,
        phone: whatsapp || null,
        company: company || null,
        role: position || null,
      }).catch((err) => console.warn("[referrals] open lead:", err));

      const { error: hintErr } = await adminDb.from("referral_lead_hints").insert({
        referral_code: suggestedCode,
        lead_name: name,
        lead_email: email,
        lead_company: company || null,
        lead_phone: whatsapp || null,
        landing_path: landing_path || null,
        status: "suggested",
      });
      if (hintErr) {
        console.warn("[referrals] lead hint skip:", hintErr.message);
      }
    }

    // ─── Disparar emails ───
    const courses = selectedCourses || (sourceCourse ? [sourceCourse] : []);

    // 1. Notificación interna al equipo de ventas
    try {
      await sendNewLeadNotificationToAdmin({
        name, email, phone: whatsapp ?? undefined, courses, message: insertData.message ?? message ?? undefined,
        leadType: leadType ?? undefined, company: company ?? undefined, position: position ?? undefined, employeeCount: employeeCount ?? undefined,
        pais,
        sourceCourse: sourceCourse || null,
      });
    } catch (err: any) {
      console.error("❌ Admin email error:", err?.message, err?.stack);
    }

    // 2. Confirmación al lead (diferente para empresa vs. individual, se omite para webinar)
    if (leadType !== "webinar") {
      try {
        if (isEnterprise && company) {
          await sendEnterpriseQuoteToLead({ name, email, company, courses, employeeCount: employeeCount ?? undefined });
        } else {
          await sendQuoteConfirmationToLead({ name, email, courses, message: message ?? undefined, pais });
        }
      } catch (err: any) {
        console.error("❌ Quote email error:", err?.message, err?.stack);
      }
    }

    return NextResponse.json(successBody);

  } catch (err: any) {
    console.error("API Error in leads/create:", err);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
