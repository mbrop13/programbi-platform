/**
 * Amazon SES Integration — ProgramBI
 * Módulo central para todos los correos transaccionales de la plataforma.
 * Usa SMTP vía nodemailer conectado a Amazon SES.
 *
 * Tipos de email soportados:
 *  1. Cotización individual (confirmación al lead)
 *  2. Notificación empresa (ventas recibe el lead de empresa)
 *  3. Notificación nuevo contacto (equipo interno)
 *  4. Avisar próxima fecha de curso (notify me)
 *  5. Confirmación de pago / inscripción
 *  6. Bienvenida a membresía
 */

import nodemailer from "nodemailer";
import { buildQuoteEmailHtml } from "./quote-template";
import { buildEnterpriseEmailHtml } from "./enterprise-template";
import { staticSchedules, formatScheduleDate, getNearestSchedule } from "../data/course-schedules";
import { createAdminClient } from "../supabase/server";
import { courses as masterCourses } from "../data/courses";

// ─── Config ────────────────────────────────────────────────────────────────────
const SMTP_HOST = process.env.SES_SMTP_HOST || "email-smtp.us-east-1.amazonaws.com";
const SMTP_PORT = parseInt(process.env.SES_SMTP_PORT || "465", 10);
const SMTP_USER = process.env.SES_SMTP_USER!;
const SMTP_PASS = process.env.SES_SMTP_PASS!;
const FROM_EMAIL = process.env.SES_FROM_EMAIL || "noreply@programbi.com";
const FROM_NAME = process.env.SES_FROM_NAME || "ProgramBI";
const ADMIN_EMAIL = process.env.SES_ADMIN_EMAIL || "contacto@programbi.cl";

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SES_SMTP_USER y SES_SMTP_PASS deben estar configuradas en las variables de entorno.");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price);
}

function fromAddress() {
  return `"${FROM_NAME}" <${FROM_EMAIL}>`;
}

async function sendEmail(params: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: fromAddress(),
    to: params.toName ? `"${params.toName}" <${params.to}>` : params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
    replyTo: params.replyTo,
  });
}

// ─── Base HTML template — ProgramBI 2.0 Paper & Ink ───────────────────────────
function wrapHtml(title: string, content: string) {
  return /* html */ `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0; mso-table-rspace: 0; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #F3F3F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    h1, h2, h3, p { margin: 0; padding: 0; }
    @media screen and (max-width: 620px) {
      .outer { padding: 12px 8px !important; }
      .card { border-radius: 16px !important; }
      .mp { padding-left: 20px !important; padding-right: 20px !important; }
      .ms { display: block !important; width: 100% !important; text-align: left !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F3F3F0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F3F3F0;">
    <tr><td align="center" style="padding:36px 16px 50px;" class="outer">
      <table width="600" cellpadding="0" cellspacing="0" border="0" class="card" style="background-color:#FFFFFF;border:1px solid #E5E5E0;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(23,23,22,0.04);max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background-color:#FFFFFF;padding:32px 40px 24px;text-align:center;border-bottom:1px solid #EAEAE6;" class="mp">
            <a href="https://www.programbi.com" target="_blank" style="text-decoration:none;display:inline-block;">
              <img src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974" width="150" alt="ProgramBI" style="display:inline-block;width:150px;max-width:100%;border:0;"/>
            </a>
            <div style="margin-top:10px;">
              <span style="display:inline-block;background-color:#EBEBE6;color:#5F5E59;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;padding:4px 12px;border-radius:9999px;">
                Formación en Datos
              </span>
            </div>
          </td>
        </tr>

        <!-- CONTENT -->
        <tr>
          <td style="padding:36px 40px 32px;" class="mp">
            ${content}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #EAEAE6;background-color:#F7F7F4;" class="mp">
            <p style="margin:0;font-size:11px;color:#8C8B85;text-align:center;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              © ${new Date().getFullYear()} ProgramBI — Todos los derechos reservados<br/>
              <a href="https://programbi.com" style="color:#171716;text-decoration:none;font-weight:700;">programbi.com</a> · 
              <a href="mailto:${ADMIN_EMAIL}" style="color:#171716;text-decoration:none;font-weight:700;">${ADMIN_EMAIL}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Helpers de Precios y Horarios para Cotizaciones ────────────────────────────

function calculateCoursePrice(
  slug: string,
  levelName: string,
  masterCoursesList: any[],
  priceOverridesList: any[],
  promotionsList: any[]
) {
  const masterCourse = masterCoursesList.find(c => c.slug === slug);
  if (!masterCourse) {
    return { finalPrice: 0, originalPrice: 0, hasDiscount: false };
  }
  
  let basePrice = 0;
  let originalPrice = 0;
  if (levelName) {
    const masterLevel = masterCourse.levels?.find((l: any) => 
      l.name.toLowerCase().includes(levelName.toLowerCase()) || 
      levelName.toLowerCase().includes(l.name.toLowerCase())
    );
    if (masterLevel) {
      basePrice = masterLevel.price || 0;
      originalPrice = masterLevel.originalPrice || basePrice;
    }
  } else if (masterCourse.levels && masterCourse.levels.length > 0) {
    basePrice = masterCourse.levels[0].price || 0;
    originalPrice = masterCourse.levels[0].originalPrice || basePrice;
  }

  // Si es analisis-de-datos y originalPrice es igual a basePrice o no está, forzar a 747000
  if (slug === "analisis-de-datos" && (originalPrice === basePrice || !originalPrice)) {
    originalPrice = 747000;
  }

  // Apply price override if exists
  const override = priceOverridesList.find(
    (o: any) => o.item_type === 'course' && o.item_id === slug && o.level_name === levelName
  );
  const effectiveBase = override ? override.price : basePrice;

  // Find promotions
  const promo = promotionsList.find(
    (pr: any) => pr.target_type === 'all' || pr.target_type === 'courses' || (pr.target_type === 'specific_course' && pr.target_id === slug)
  );

  if (promo) {
    if (promo.promo_price) {
      return { finalPrice: promo.promo_price, originalPrice: effectiveBase === basePrice ? originalPrice : effectiveBase, hasDiscount: true };
    }
    const ratio = (100 - promo.discount_percentage) / 100;
    const finalPrice = Math.round(effectiveBase * ratio);
    return { finalPrice, originalPrice: effectiveBase === basePrice ? originalPrice : effectiveBase, hasDiscount: true };
  }

  return { finalPrice: effectiveBase, originalPrice: effectiveBase === basePrice ? originalPrice : effectiveBase, hasDiscount: false };
}

function formatEmailDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const day = date.getDate();
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const month = months[date.getMonth()];
  return `${day} de ${month}`;
}

function formatEmailDays(daysStr: string): string {
  let res = daysStr.toLowerCase();
  res = res.replace("lunes y miércoles", "Lun y Mié");
  res = res.replace("lunes y miercoles", "Lun y Mié");
  res = res.replace("martes y jueves", "Mar y Jue");
  res = res.replace("sábado", "Sáb");
  res = res.replace("sabado", "Sáb");
  return res.charAt(0).toUpperCase() + res.slice(1);
}

function formatEmailTime(timeStr: string): string {
  const match = timeStr.match(/^(\d{1,2}:\d{2})/);
  return match ? match[1] : timeStr;
}

function hasAvailableSchedules(
  slug: string,
  levelName: string,
  schedulesList: any[],
  staticList: any[]
): boolean {
  const now = new Date();
  
  // 1. Check dynamic database schedules that are active and in the future
  const dbScheds = schedulesList.filter(
    s => s.course_slug === slug && 
         s.level_name === levelName && 
         s.is_active && 
         new Date(s.start_date + "T12:00:00") >= now
  );
  if (dbScheds.length > 0) return true;
  
  // 2. Check static schedules that are active and in the future
  const staticScheds = staticList.filter(
    s => s.course_slug === slug && 
         s.level_name === levelName && 
         s.is_active && 
         new Date(s.start_date + "T12:00:00") >= now
  );
  if (staticScheds.length > 0) return true;

  // 3. Check default schedules as legacy fallback (only if active and in the future)
  const defaultSchedules: Record<string, { start_date: string, is_active: boolean }> = {
    "power-bi-Básico": { start_date: "2026-05-19", is_active: true },
    "sql-server-Básico": { start_date: "2026-06-22", is_active: true },
    "python-Básico": { start_date: "2026-05-25", is_active: true },
    "power-bi-Intermedio": { start_date: "2026-05-25", is_active: true },
    "sql-server-Intermedio": { start_date: "2026-06-22", is_active: true },
    "python-Intermedio": { start_date: "2026-07-27", is_active: true },
  };
  const key = `${slug}-${levelName}`;
  const def = defaultSchedules[key];
  return !!(def && def.is_active && new Date(def.start_date + "T12:00:00") >= now);
}

function getCourseScheduleString(
  slug: string,
  levelName: string,
  schedulesList: any[],
  staticList: any[],
  type: "basic" | "intermediate"
): string {
  const now = new Date();
  
  // Get dynamic schedules
  let courseSchedules = schedulesList.filter(
    s => s.course_slug === slug && 
         s.level_name === levelName && 
         s.is_active && 
         new Date(s.start_date + "T12:00:00") >= now
  );
  
  // If none, use static schedules
  if (courseSchedules.length === 0) {
    courseSchedules = staticList.filter(
      s => s.course_slug === slug && 
           s.level_name === levelName && 
           s.is_active && 
           new Date(s.start_date + "T12:00:00") >= now
    ) as any[];
  }
  
  // If still none, use default legacy schedules
  if (courseSchedules.length === 0) {
    const defaultSchedules: Record<string, { start_date: string, schedule_days: string, schedule_time: string, is_active: boolean }> = {
      "power-bi-Básico": { start_date: "2026-05-19", schedule_days: "Martes y Jueves", schedule_time: "19:30 a 21:30", is_active: true },
      "sql-server-Básico": { start_date: "2026-06-22", schedule_days: "Lunes y Miércoles", schedule_time: "19:30 a 21:30", is_active: true },
      "python-Básico": { start_date: "2026-05-25", schedule_days: "Lunes y Miércoles", schedule_time: "19:30 a 21:30", is_active: true },
      "power-bi-Intermedio": { start_date: "2026-05-25", schedule_days: "Lunes y Miércoles", schedule_time: "19:30 a 21:30", is_active: true },
      "sql-server-Intermedio": { start_date: "2026-06-22", schedule_days: "Lunes y Miércoles", schedule_time: "19:30 a 21:30", is_active: true },
      "python-Intermedio": { start_date: "2026-07-27", schedule_days: "Lunes y Miércoles", schedule_time: "19:30 a 21:30", is_active: true },
    };
    const key = `${slug}-${levelName}`;
    const def = defaultSchedules[key];
    if (def && new Date(def.start_date + "T12:00:00") >= now) {
      courseSchedules = [def];
    }
  }
  
  if (courseSchedules.length === 0) {
    return type === "basic" ? "Próximamente · Consultar horarios" : "Próximamente";
  }

  // Sort schedules by start_date ascending
  courseSchedules.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  // Format all active future schedules
  return courseSchedules.map((sched, idx) => {
    const dateFormatted = formatEmailDate(sched.start_date);
    const daysFormatted = formatEmailDays(sched.schedule_days);
    
    let scheduleStr = "";
    if (type === "basic") {
      const timeFormatted = formatEmailTime(sched.schedule_time);
      scheduleStr = `${dateFormatted} · ${daysFormatted} · ${timeFormatted}`;
    } else {
      scheduleStr = `${dateFormatted} · ${daysFormatted}`;
    }

    if (courseSchedules.length > 1) {
      return `<div style="margin-top: ${idx > 0 ? '4px' : '0px'}; font-size: 13px;">Opción ${idx + 1}: ${scheduleStr}</div>`;
    }
    return scheduleStr;
  }).join("");
}

// ─── Email 1: Cotización Individual (al lead) — Template Premium ────────────
export async function sendQuoteConfirmationToLead(params: {
  name: string;
  email: string;
  courses: string[];
  message?: string;
}) {
  const { name, email, courses: leadSelectedCourses } = params;
  const firstName = name.split(" ")[0] || name;

  // Intentar cargar datos desde Supabase
  let schedules: any[] = [];
  let promotions: any[] = [];
  let priceOverrides: any[] = [];

  try {
    const supabase = createAdminClient();
    const [schRes, promoRes, overRes] = await Promise.all([
      supabase.from("course_schedules").select("*").eq("is_active", true),
      supabase.from("promotions").select("*").eq("is_active", true),
      supabase.from("price_overrides").select("*")
    ]);
    
    if (schRes.data) schedules = schRes.data;
    if (promoRes.data) {
      const now = new Date().toISOString();
      promotions = promoRes.data.filter((p: any) => !p.valid_until || p.valid_until > now);
    }
    if (overRes.data) priceOverrides = overRes.data;
  } catch (err) {
    console.error("Error al obtener datos dinámicos de Supabase para el email de cotización:", err);
  }

  // Normalizar los cursos cotizados recibidos de la web
  const normalizedItems: { slug: string; level: string; title: string; color: string; hours: number }[] = [];
  const processedSlugs = new Set<string>();

  for (const rawCourse of leadSelectedCourses) {
    const s = rawCourse.toLowerCase().trim();
    let slug = "";
    let level = "Básico";
    let title = "";
    let color = "#1890FF";
    let hours = 16;

    if (s.includes("analisis de datos") || s.includes("análisis de datos") || s.includes("analisis-de-datos")) {
      slug = "analisis-de-datos";
      level = "Especialización";
      title = "Pack de Análisis de Datos";
      color = "#1890FF";
      hours = 48; // Especialización son 48 horas
    } else if (s.includes("power bi") || s.includes("powerbi") || s.includes("power-bi")) {
      slug = "power-bi";
      level = s.includes("intermedio") ? "Intermedio" : "Básico";
      title = `Power BI ${level}`;
      color = "#eab308";
      hours = 16;
    } else if (s.includes("python")) {
      slug = "python";
      level = s.includes("intermedio") ? "Intermedio" : "Básico";
      title = `Python ${level}`;
      color = "#3b82f6";
      hours = 16;
    } else if (s.includes("sql")) {
      slug = "sql-server";
      level = s.includes("intermedio") ? "Intermedio" : "Básico";
      title = `SQL Server ${level}`;
      color = "#ef4444";
      hours = 16;
    } else if (s.includes("excel")) {
      slug = "excel";
      level = "Básico";
      title = "Excel para Negocios";
      color = "#217346";
      hours = 16;
    } else if (s.includes("miner") || s.includes("analitica-mineria")) {
      slug = "analitica-mineria";
      level = "Especialización";
      title = "Análisis de Datos para la Minería";
      color = "#B45309";
      hours = 144;
    } else if (s.includes("finan") || s.includes("analitica-financiera")) {
      slug = "analitica-financiera";
      level = "Especialización";
      title = "Analítica Financiera";
      color = "#1E3A8A";
      hours = 144;
    } else if (s.includes("automate") || s.includes("power-automate")) {
      slug = "power-automate";
      level = "Básico";
      title = "Power Automate & RPA";
      color = "#0078D4";
      hours = 16;
    } else if (s.includes("ia") || s.includes("inteligencia artificial") || s.includes("ia-productividad") || s.includes("machine learning")) {
      slug = "ia-productividad";
      level = "Básico";
      title = "IA en Productividad";
      color = "#7C3AED";
      hours = 16;
    }

    if (slug && !processedSlugs.has(`${slug}-${level}`)) {
      processedSlugs.add(`${slug}-${level}`);
      normalizedItems.push({ slug, level, title, color, hours });
    }
  }

  // Fallback por defecto si no se seleccionó nada válido
  if (normalizedItems.length === 0) {
    normalizedItems.push({
      slug: "analisis-de-datos",
      level: "Especialización",
      title: "Pack de Análisis de Datos",
      color: "#1890FF",
      hours: 48
    });
  }

  // Filtrar los cursos cotizados para mostrar solo los que tienen fecha disponible
  let filteredItems = normalizedItems.filter(item => {
    const isSpec = item.level === "Especialización";
    return hasAvailableSchedules(item.slug, isSpec ? "Básico" : item.level, schedules, staticSchedules);
  });

  // Si todos quedan filtrados, mostramos todos los originales como fallback de seguridad
  if (filteredItems.length === 0) {
    filteredItems = normalizedItems;
  }

  // Mapear a EmailCourseItem calculando precios y horarios
  const selectedCourses = filteredItems.map(item => {
    const isSpec = item.level === "Especialización";
    const pricing = calculateCoursePrice(item.slug, isSpec ? "Básico" : item.level, masterCourses, priceOverrides, promotions);
    const dateStr = getCourseScheduleString(item.slug, isSpec ? "Básico" : item.level, schedules, staticSchedules, item.hours > 48 ? "intermediate" : "basic");
    return {
      slug: item.slug,
      title: item.title,
      levelName: item.level.toUpperCase(),
      durationHours: item.hours,
      startDate: dateStr,
      originalPrice: formatCLP(pricing.originalPrice),
      finalPrice: formatCLP(pricing.finalPrice),
      hasDiscount: pricing.hasDiscount || pricing.originalPrice > pricing.finalPrice,
      color: item.color,
    };
  });

  // Determinar recomendación inteligente del Pack de Análisis de Datos
  const hasIndividualAnalisisCursos = normalizedItems.some(item => ["power-bi", "sql-server", "python"].includes(item.slug));
  const hasPackAnalisis = normalizedItems.some(item => item.slug === "analisis-de-datos");
  const showPackRecommendation = hasIndividualAnalisisCursos && !hasPackAnalisis;

  let packRecommendation = {
    showPackRecommendation,
    origPrice: "$0",
    offerPrice: "$0",
    savingPercent: 0,
    url: "https://www.programbi.com/cursos/analisis-de-datos",
  };

  if (showPackRecommendation) {
    const packPricing = calculateCoursePrice("analisis-de-datos", "Básico", masterCourses, priceOverrides, promotions);
    const savingPercent = Math.round(((packPricing.originalPrice - packPricing.finalPrice) / packPricing.originalPrice) * 100);
    packRecommendation = {
      showPackRecommendation: true,
      origPrice: formatCLP(packPricing.originalPrice),
      offerPrice: formatCLP(packPricing.finalPrice),
      savingPercent,
      url: "https://www.programbi.com/cursos/analisis-de-datos",
    };
  }

  // Cursos recomendados (hasta 3 cursos que el usuario NO cotizó y que tienen fecha disponible)
  const cotizedSlugs = new Set(normalizedItems.map(item => item.slug));
  const recommendedItems = masterCourses
    .filter(c => c.slug !== "analisis-de-datos" && !cotizedSlugs.has(c.slug))
    .filter(c => c.slug !== "analitica-mineria" && c.slug !== "analitica-financiera")
    .filter(c => {
      const levels = c.levels || [{ name: "Básico" }];
      return levels.some(l => hasAvailableSchedules(c.slug, l.name, schedules, staticSchedules));
    })
    .slice(0, 3);

  const recommendedCourses = recommendedItems.map(item => {
    const level = "Básico";
    const color = item.accentColor || "#1890FF";
    const hours = item.levels?.[0]?.durationHours || item.durationHours || 16;
    const pricing = calculateCoursePrice(item.slug, level, masterCourses, priceOverrides, promotions);
    const dateStr = getCourseScheduleString(item.slug, level, schedules, staticSchedules, hours > 48 ? "intermediate" : "basic");
    return {
      slug: item.slug,
      title: item.title,
      levelName: level.toUpperCase(),
      durationHours: hours,
      startDate: dateStr,
      originalPrice: formatCLP(pricing.originalPrice),
      finalPrice: formatCLP(pricing.finalPrice),
      hasDiscount: pricing.hasDiscount || pricing.originalPrice > pricing.finalPrice,
      color,
    };
  });

  const html = buildQuoteEmailHtml(firstName, selectedCourses, recommendedCourses, packRecommendation);

  await sendEmail({
    to: email,
    toName: name,
    subject: "Tu Cotización en ProgramBI — Cursos de Datos 100% Aplicados",
    html,
    text: `Hola ${firstName}, gracias por tu interés en ProgramBI. Diseñamos cursos de programación y análisis de datos 100% aplicados al mercado laboral actual. Revisa tu cotización completa en tu correo. Cursos: ${leadSelectedCourses.join(", ")}.`,
    replyTo: ADMIN_EMAIL,
  });
}



// ─── Email 2: Notificación interna — Nueva cotización ─────────────────────────
export async function sendNewLeadNotificationToAdmin(params: {
  name: string;
  email: string;
  phone?: string;
  courses: string[];
  message?: string;
  leadType?: string;
  company?: string;
  position?: string;
  employeeCount?: string;
}) {
  const { name, email, phone, courses, message, leadType, company, position, employeeCount } = params;

  const isEnterprise = leadType === "enterprise" || leadType === "empresa";
  const courseList = courses.map(c => `<li style="padding:4px 0;font-size:13.5px;color:#171716;">${c}</li>`).join("");
  const timestamp = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });

  const html = wrapHtml("🚨 Nuevo Contacto — ProgramBI", `
    <div style="display:inline-block;background:${isEnterprise ? "#FEF3C7" : "#EBEBE6"};color:${isEnterprise ? "#92400E" : "#171716"};font-size:10.5px;font-weight:800;padding:4px 12px;border-radius:9999px;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">
      ${isEnterprise ? "🏢 Lead Empresa" : "👤 Lead Individual"}
    </div>
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:900;color:#171716;letter-spacing:-0.5px;">Nuevo contacto: ${name}</h1>
    <p style="margin:0 0 20px;font-size:12px;color:#8C8B85;">Recibido el ${timestamp}</p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:13px;color:#5F5E59;width:130px;">Nombre</td><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:14px;font-weight:700;color:#171716;">${name}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:13px;color:#5F5E59;">Email</td><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:14px;font-weight:600;"><a href="mailto:${email}" style="color:#171716;text-decoration:underline;">${email}</a></td></tr>
      ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:13px;color:#5F5E59;">WhatsApp</td><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:14px;font-weight:700;"><a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" style="color:#166534;text-decoration:none;">${phone}</a></td></tr>` : ""}
      ${isEnterprise && company ? `<tr><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:13px;color:#5F5E59;">Empresa</td><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:14px;font-weight:700;color:#171716;">${company}</td></tr>` : ""}
      ${isEnterprise && position ? `<tr><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:13px;color:#5F5E59;">Cargo</td><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:14px;font-weight:700;color:#171716;">${position}</td></tr>` : ""}
      ${isEnterprise && employeeCount ? `<tr><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:13px;color:#5F5E59;">Colaboradores</td><td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:14px;font-weight:700;color:#171716;">${employeeCount}</td></tr>` : ""}
    </table>

    <div style="background-color:#F7F7F4;border:1px solid #E5E5E0;border-radius:12px;padding:16px 20px;margin-bottom:16px;">
      <div style="font-size:10px;font-weight:800;color:#8C8B85;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px;">Programas de Interés</div>
      <ul style="margin:0;padding-left:18px;">${courseList || "<li>No especificado</li>"}</ul>
    </div>

    ${message ? `<div style="background-color:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px 20px;margin-bottom:16px;"><div style="font-size:10px;font-weight:800;color:#92400E;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Mensaje del Usuario</div><p style="margin:0;font-size:13.5px;color:#78350F;line-height:1.5;">${message}</p></div>` : ""}

    <div style="margin-top:24px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-right:10px;">
            <a href="mailto:${email}?subject=Cotización ProgramBI — ${encodeURIComponent(name)}" 
               style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:9999px;">
              📧 Responder Email →
            </a>
          </td>
          ${phone ? `<td>
            <a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" 
               style="display:inline-block;background-color:#F7F7F4;border:1px solid #D4D4D0;color:#171716;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:9999px;">
              💬 WhatsApp →
            </a>
          </td>` : ""}
        </tr>
      </table>
    </div>
  `);

  const subject = `🚨 Nuevo contacto ${isEnterprise ? "empresarial" : ""}: ${name} — ${courses[0] || "General"}`;
  const text = `Nuevo contacto: ${name} | ${email}${phone ? ` | ${phone}` : ""} | Cursos: ${courses.join(", ")}${message ? ` | Msg: ${message}` : ""}`;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: fromAddress(),
    to: "moliva@programbi.cl",
    subject,
    html,
    text,
    replyTo: email,
  });
}

// ─── Email 2b: Notificación — Nuevo miembro registrado ────────────────────────
export async function sendNewMemberNotification(params: {
  name: string;
  email: string;
  phone?: string;
}) {
  const { name, email, phone } = params;
  const timestamp = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });

  const html = wrapHtml("🎉 Nuevo Miembro — ProgramBI", `
    <div style="text-align:center;padding:12px 0 20px;">
      <div style="display:inline-block;background-color:#DCFCE7;color:#166534;font-size:10.5px;font-weight:800;padding:4px 12px;border-radius:9999px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">
        Nuevo Registro en Campus
      </div>
      <h1 style="margin:4px 0;font-size:24px;font-weight:900;color:#171716;letter-spacing:-0.5px;">¡Se registró ${name}!</h1>
      <p style="margin:0;font-size:12px;color:#8C8B85;">${timestamp}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin:16px 0 24px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:13px;color:#5F5E59;width:120px;">Nombre</td>
        <td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:14px;font-weight:700;color:#171716;">${name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:13px;color:#5F5E59;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:14px;font-weight:600;">
          <a href="mailto:${email}" style="color:#171716;text-decoration:underline;">${email}</a>
        </td>
      </tr>
      ${phone ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:13px;color:#5F5E59;">WhatsApp</td>
        <td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:14px;font-weight:700;">
          <a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" style="color:#166534;text-decoration:none;">${phone}</a>
        </td>
      </tr>` : ""}
    </table>

    <div style="text-align:center;">
      <a href="mailto:${email}?subject=Bienvenido a ProgramBI — ${encodeURIComponent(name)}" 
         style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13.5px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:9999px;">
        📧 Enviar bienvenida personalizada →
      </a>
    </div>
  `);

  const transporter = getTransporter();
  await transporter.sendMail({
    from: fromAddress(),
    to: "moliva@programbi.cl",
    subject: `🎉 Nuevo miembro registrado: ${name}`,
    html,
    text: `Nuevo miembro: ${name} | ${email}${phone ? ` | ${phone}` : ""}`,
    replyTo: email,
  });
}

export async function sendEnterpriseQuoteToLead(params: {
  name: string;
  email: string;
  company: string;
  courses: string[];
  employeeCount?: string;
}) {
  const { name, email, company } = params;
  const firstName = name.split(" ")[0] || name;

  const html = buildEnterpriseEmailHtml(firstName, company);

  await sendEmail({
    to: email,
    toName: name,
    subject: `Capacitación Corporativa — ProgramBI`,
    html,
    text: `Hola ${firstName}, hemos recibido tu solicitud de capacitación corporativa desde ${company}. Te contactaremos a la brevedad con una propuesta a medida.`,
    replyTo: ADMIN_EMAIL,
  });
}

// ─── Email 4: Avísame cuando haya fecha disponible ────────────────────────────
export async function sendNotifyMeConfirmation(params: {
  name: string;
  email: string;
  courseName: string;
  levelName?: string;
}) {
  const { name, email, courseName, levelName } = params;

  const html = wrapHtml("Te avisamos cuando haya fecha — ProgramBI", `
    <div style="text-align:center;padding:12px 0 20px;">
      <div style="display:inline-block;background-color:#EBEBE6;color:#171716;font-size:10.5px;font-weight:800;padding:4px 12px;border-radius:9999px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">
        🔔 Lista de Espera Confirmada
      </div>
      <h1 style="margin:4px 0;font-size:24px;font-weight:900;color:#171716;letter-spacing:-0.5px;">¡Ya estás en lista!</h1>
      <p style="margin:0;font-size:14px;color:#5F5E59;">Te avisaremos a este correo de inmediato en cuanto abramos cupos.</p>
    </div>

    <div style="background-color:#F7F7F4;border:1px solid #E5E5E0;border-radius:14px;padding:20px 24px;margin:20px 0 24px;text-align:center;">
      <div style="font-size:10.5px;font-weight:800;color:#8C8B85;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px;">Esperando apertura de</div>
      <div style="font-size:19px;font-weight:900;color:#171716;">${courseName}</div>
      ${levelName ? `<div style="font-size:12.5px;color:#5F5E59;margin-top:4px;font-weight:600;">Nivel: ${levelName}</div>` : ""}
    </div>

    <p style="font-size:13.5px;color:#5F5E59;line-height:1.6;text-align:center;margin:0 0 24px;">
      Mientras tanto, puedes explorar todos los programas y cursos con fechas activas en nuestra plataforma.
    </p>

    <div style="text-align:center;">
      <a href="https://programbi.com/cursos" style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13.5px;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:9999px;letter-spacing:0.2px;">
        Explorar catálogo de cursos →
      </a>
    </div>
  `);

  await sendEmail({
    to: email,
    toName: name || "Estudiante",
    subject: `🔔 Te avisaremos cuando se abra ${courseName} — ProgramBI`,
    html,
    text: `Hola${name ? ` ${name}` : ""}, ya te registramos para recibir aviso cuando se abra ${courseName}${levelName ? ` (${levelName})` : ""}.`,
  });
}

// ─── Email 5: Confirmación de pago / inscripción ──────────────────────────────
export async function sendPaymentConfirmation(params: {
  name: string;
  email: string;
  courses: Array<{ slug?: string; title: string; levelName: string; price: number; selectedStartDate?: string | null }>;
  orderId: string;
  totalPaid: number;
  paymentMethod?: string;
}) {
  const { name, email, courses, orderId, totalPaid, paymentMethod } = params;

  // Intentar obtener las fechas reales desde Supabase
  let activeSchedules: any[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("course_schedules")
      .select("*")
      .eq("is_active", true);
    if (data) activeSchedules = data;
  } catch (err) {
    console.warn("No se pudieron cargar los horarios dinámicos para el email de confirmación, usando fallbacks.", err);
  }

  // Generar tarjetas para cada curso comprado con información detallada de fechas e inicio
  const courseDetailCards = courses.map(c => {
    // Buscar horario
    let sched = null;
    if (c.selectedStartDate) {
      sched = activeSchedules.find(s => s.course_slug === c.slug && s.level_name === c.levelName && s.start_date === c.selectedStartDate);
      if (!sched && c.slug) {
        sched = staticSchedules.find(s => s.course_slug === c.slug && s.level_name === c.levelName && s.start_date === c.selectedStartDate);
      }
    }
    if (!sched) {
      sched = activeSchedules.find(s => s.course_slug === c.slug && s.level_name === c.levelName);
      if (!sched && c.slug) {
        sched = staticSchedules.find(s => s.course_slug === c.slug && s.level_name === c.levelName);
      }
    }

    const hasSchedule = !!sched;
    const startDateFormatted = hasSchedule && sched.start_date ? formatScheduleDate(sched.start_date) : (c.selectedStartDate ? formatScheduleDate(c.selectedStartDate) : "Por confirmar");
    const days = hasSchedule ? sched.schedule_days : "Por confirmar";
    const time = hasSchedule ? sched.schedule_time : "Por confirmar";

    return `
      <div style="background-color: #FFFFFF; border: 1px solid #E5E5E0; border-radius: 14px; padding: 20px 22px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(23,23,22,0.03);">
        <div style="border-bottom: 1px solid #EAEAE6; padding-bottom: 12px; margin-bottom: 14px;">
          <h3 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 800; color: #171716;">
            ${c.title} <span style="display: inline-block; background-color: #EBEBE6; color: #171716; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 3px 8px; border-radius: 9999px; margin-left: 6px;">${c.levelName}</span>
          </h3>
        </div>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
          <tr>
            <td style="padding: 5px 0; font-size: 13px; color: #5F5E59; width: 130px; text-align: left;"><strong>📅 Fecha de Inicio:</strong></td>
            <td style="padding: 5px 0; font-size: 13.5px; font-weight: 700; color: #171716; text-align: left;">${startDateFormatted}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 13px; color: #5F5E59; text-align: left;"><strong>🗓️ Días de Clases:</strong></td>
            <td style="padding: 5px 0; font-size: 13.5px; font-weight: 700; color: #171716; text-align: left;">${days}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; font-size: 13px; color: #5F5E59; text-align: left;"><strong>⏰ Horario:</strong></td>
            <td style="padding: 5px 0; font-size: 13.5px; font-weight: 700; color: #171716; text-align: left;">${time} (Vía Zoom en Vivo)</td>
          </tr>
        </table>
        
        <div style="background-color: #F7F7F4; border-left: 3px solid #171716; border-radius: 8px; padding: 10px 14px; font-size: 11.5px; color: #5F5E59; line-height: 1.5; text-align: left;">
          <strong style="color: #171716;">💡 Modalidad:</strong> Clases en vivo vía Zoom con acceso permanente a grabaciones en tu campus virtual. Te enviaremos el enlace y credenciales antes de iniciar.
        </div>
      </div>
    `;
  }).join("");

  // Limpiar método de pago: eliminar paréntesis como (webpay - tarjeta de crédito)
  const cleanPaymentMethod = paymentMethod ? paymentMethod.replace(/\s*\(.*\)/gi, "").trim() : "Flow";

  // Detalle financiero / Recibo
  const courseRows = courses.map(c => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:13.5px;color:#171716;text-align:left;">${c.title} (${c.levelName})</td>
      <td style="padding:10px 0;border-bottom:1px solid #EAEAE6;font-size:13.5px;font-weight:700;color:#171716;text-align:right;">${formatCLP(c.price)}</td>
    </tr>
  `).join("");

  const html = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>¡Felicidades por tu inscripción! — ProgramBI</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0; mso-table-rspace: 0; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #F3F3F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    h1, h2, h3, p { margin: 0; padding: 0; }
    @media screen and (max-width: 620px) {
      .outer { padding: 12px 8px !important; }
      .card { border-radius: 16px !important; }
      .mp { padding-left: 20px !important; padding-right: 20px !important; }
      .ms { display: block !important; width: 100% !important; text-align: left !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F3F3F0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F3F3F0;">
    <tr><td align="center" style="padding:36px 16px 50px;" class="outer">
      <table width="600" cellpadding="0" cellspacing="0" border="0" class="card" style="background-color:#FFFFFF;border:1px solid #E5E5E0;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(23,23,22,0.04);max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background-color:#FFFFFF;padding:32px 40px 20px;text-align:center;border-bottom:1px solid #EAEAE6;" class="mp">
            <div style="margin-bottom: 14px;">
              <a href="https://www.programbi.com" target="_blank" style="text-decoration:none;display:inline-block;">
                <img src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974" width="150" alt="ProgramBI" style="display:inline-block;width:150px;max-width:100%;border:0;"/>
              </a>
            </div>
            <div style="background-color: #DCFCE7; color: #166534; font-size: 10.5px; font-weight: 800; padding: 5px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
              🎉 ¡Inscripción Confirmada!
            </div>
          </td>
        </tr>

        <!-- MAIN BODY -->
        <tr>
          <td style="padding:36px 40px 28px;" class="mp">
            <h1 style="margin:0 0 12px;font-size:23px;font-weight:900;color:#171716;letter-spacing:-0.5px;">¡Felicidades por dar el siguiente paso, ${name.split(" ")[0]}!</h1>
            <p style="margin:0 0 24px;font-size:14px;color:#5F5E59;line-height:1.6;">
              Hemos recibido y procesado tu pago con éxito. Oficialmente ya eres parte de ProgramBI y tienes asegurado tu cupo para comenzar tu formación. A continuación encontrarás todos los detalles clave de tus clases:
            </p>

            <!-- CURSOS DETALLE -->
            <div style="margin-bottom: 28px;">
              <h2 style="font-size:12px;font-weight:800;color:#8C8B85;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px;">📅 Horarios e Información de Clases</h2>
              ${courseDetailCards}
            </div>

            <!-- RESUMEN DE PAGO -->
            <div style="background-color:#F7F7F4;border: 1px solid #E5E5E0;border-radius:14px;padding:22px 24px;margin-bottom:28px;">
              <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #EAEAE6;padding-bottom:10px;margin-bottom:12px;">
                <span style="font-size:11px;font-weight:800;color:#8C8B85;text-transform:uppercase;letter-spacing:1px;">Comprobante de Pago</span>
                <span style="font-size:11px;font-weight:800;color:#171716;font-family:monospace;">ID: ${orderId}</span>
              </div>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tbody>${courseRows}</tbody>
                <tfoot>
                  <tr>
                    <td style="padding-top:12px;font-size:14px;font-weight:800;color:#171716;">Total Pagado</td>
                    <td style="padding-top:12px;font-size:18px;font-weight:900;color:#16A34A;text-align:right;">${formatCLP(totalPaid)}</td>
                  </tr>
                </tfoot>
              </table>
              ${cleanPaymentMethod ? `<p style="margin:10px 0 0;font-size:11px;color:#8C8B85;text-align:right;">Método: ${cleanPaymentMethod}</p>` : ""}
            </div>

            <!-- ONBOARDING PASOS -->
            <div style="border-top:1px solid #EAEAE6;padding-top:28px;margin-bottom:28px;">
              <h2 style="font-size:12px;font-weight:800;color:#8C8B85;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:18px;">🚀 Siguientes Pasos</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td valign="top" style="width:28px;padding-right:12px;">
                    <div style="width:22px;height:22px;background-color:#EBEBE6;border-radius:50%;color:#171716;text-align:center;line-height:22px;font-size:11px;font-weight:800;">1</div>
                  </td>
                  <td style="padding-bottom:14px;">
                    <h4 style="margin:0 0 2px;font-size:13.5px;font-weight:800;color:#171716;">Espera la fecha de inicio</h4>
                    <p style="margin:0;font-size:12.5px;color:#5F5E59;line-height:1.5;">Te enviaremos los accesos directos de Zoom e instrucciones antes de la primera sesión.</p>
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="width:28px;padding-right:12px;">
                    <div style="width:22px;height:22px;background-color:#EBEBE6;border-radius:50%;color:#171716;text-align:center;line-height:22px;font-size:11px;font-weight:800;">2</div>
                  </td>
                  <td style="padding-bottom:14px;">
                    <h4 style="margin:0 0 2px;font-size:13.5px;font-weight:800;color:#171716;">Participa en vivo</h4>
                    <p style="margin:0;font-size:12.5px;color:#5F5E59;line-height:1.5;">Interactúa en vivo con el docente, resuelve preguntas y trabaja sobre los casos prácticos.</p>
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="width:28px;padding-right:12px;">
                    <div style="width:22px;height:22px;background-color:#EBEBE6;border-radius:50%;color:#171716;text-align:center;line-height:22px;font-size:11px;font-weight:800;">3</div>
                  </td>
                  <td>
                    <h4 style="margin:0 0 2px;font-size:13.5px;font-weight:800;color:#171716;">Acceso a grabaciones</h4>
                    <p style="margin:0;font-size:12.5px;color:#5F5E59;line-height:1.5;">Todas las clases quedan grabadas para que las repases a tu propio ritmo en cualquier momento.</p>
                  </td>
                </tr>
              </table>
            </div>

            <!-- BOTON CTA WHATSAPP DIRECTO -->
            <div style="text-align:center;margin-top:28px;margin-bottom:12px;">
              <a href="https://wa.me/56935409699?text=Hola%2C%20tengo%20una%20consulta%20sobre%20mi%20inscripci%C3%B3n%20en%20ProgramBI" 
                 style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13.5px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:9999px;letter-spacing:0.2px;">
                💬 ¿Tienes dudas? Escríbenos por WhatsApp →
              </a>
            </div>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #EAEAE6;background-color:#F7F7F4;" class="mp">
            <p style="margin:0 0 8px;font-size:11.5px;color:#5F5E59;text-align:center;line-height:1.5;">
              ¿Necesitas soporte técnico? Escríbenos respondiendo directamente a este correo o vía WhatsApp.
            </p>
            <p style="margin:0;font-size:11px;color:#8C8B85;text-align:center;line-height:1.5;">
              © ${new Date().getFullYear()} ProgramBI — Todos los derechos reservados<br/>
              <a href="https://programbi.com" style="color:#171716;text-decoration:none;font-weight:700;">programbi.com</a> · 
              <a href="mailto:${ADMIN_EMAIL}" style="color:#171716;text-decoration:none;font-weight:700;">${ADMIN_EMAIL}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail({
    to: email,
    toName: name,
    subject: "🎉 ¡Inscripción exitosa! Tu lugar en ProgramBI está confirmado",
    html,
    text: `¡Hola ${name}! Tu pago fue confirmado con éxito. ID Orden: ${orderId}. Cursos inscritos: ${courses.map(c => `${c.title} (${c.levelName})`).join(", ")}. Si tienes dudas escríbenos por WhatsApp al +56935409699`,
  });
}

// ─── Email 5b: Notificación de compra exitosa al administrador ──────────────────
export async function sendNewPurchaseNotificationToAdmin(params: {
  name: string;
  email: string;
  phone?: string;
  courses: Array<{ slug?: string; title: string; levelName: string; price: number; selectedStartDate?: string | null }>;
  orderId: string;
  totalPaid: number;
  paymentMethod?: string;
  adminEmail?: string;
}) {
  const { name, email, phone, courses, orderId, totalPaid, paymentMethod, adminEmail } = params;

  // Intentar obtener las fechas reales desde Supabase
  let activeSchedules: any[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("course_schedules")
      .select("*")
      .eq("is_active", true);
    if (data) activeSchedules = data;
  } catch (err) {
    console.warn("Could not load schedules for admin notification:", err);
  }

  const courseRows = courses.map(c => {
    // Buscar horario
    let sched = null;
    if (c.selectedStartDate) {
      sched = activeSchedules.find(s => s.course_slug === c.slug && s.level_name === c.levelName && s.start_date === c.selectedStartDate);
      if (!sched && c.slug) {
        sched = staticSchedules.find(s => s.course_slug === c.slug && s.level_name === c.levelName && s.start_date === c.selectedStartDate);
      }
    }
    if (!sched) {
      sched = activeSchedules.find(s => s.course_slug === c.slug && s.level_name === c.levelName);
      if (!sched && c.slug) {
        sched = staticSchedules.find(s => s.course_slug === c.slug && s.level_name === c.levelName);
      }
    }

    const hasSchedule = !!sched;
    const dateFormatted = hasSchedule ? formatScheduleDate(sched.start_date) : (c.selectedStartDate ? formatScheduleDate(c.selectedStartDate) : "Por confirmar");
    const days = hasSchedule ? sched.schedule_days : "Por confirmar";
    const time = hasSchedule ? sched.schedule_time : "Por confirmar";

    return `
      <tr style="border-bottom:1px solid #F1F5F9;">
        <td style="padding:12px 0;font-size:14px;color:#0F172A;text-align:left;font-weight:bold;">
          ${c.title} (${c.levelName})
          <div style="font-size:11px;color:#1890FF;font-weight:normal;margin-top:4px;">
            📅 Inicio: ${dateFormatted} <br/>
            ⏰ Horario: ${days} ${time}
          </div>
        </td>
        <td style="padding:12px 0;font-size:14px;font-weight:bold;color:#0F172A;text-align:right;vertical-align:top;">${formatCLP(c.price)}</td>
      </tr>
    `;
  }).join("");

  const timestamp = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });

  const html = wrapHtml("💰 ¡Nueva venta procesada! — ProgramBI", `
    <div style="display:inline-block;background-color:#DCFCE7;color:#166534;font-size:10.5px;font-weight:800;padding:4px 12px;border-radius:9999px;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">
      🛒 Nueva Venta Confirmada
    </div>
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:900;color:#171716;letter-spacing:-0.5px;">¡Venta de ${name}!</h1>
    <p style="margin:0 0 20px;font-size:12px;color:#8C8B85;">Confirmada el ${timestamp}</p>

    <h2 style="font-size:11px;font-weight:800;color:#8C8B85;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px;text-align:left;border-bottom:1px solid #EAEAE6;padding-bottom:6px;">👤 Datos del Alumno</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:8px 0;font-size:13px;color:#5F5E59;width:120px;">Nombre</td><td style="padding:8px 0;font-size:14px;font-weight:700;color:#171716;">${name}</td></tr>
      <tr><td style="padding:8px 0;font-size:13px;color:#5F5E59;">Email</td><td style="padding:8px 0;font-size:14px;font-weight:600;"><a href="mailto:${email}" style="color:#171716;text-decoration:underline;">${email}</a></td></tr>
      ${phone ? `<tr><td style="padding:8px 0;font-size:13px;color:#5F5E59;">WhatsApp</td><td style="padding:8px 0;font-size:14px;font-weight:700;"><a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" style="color:#166534;text-decoration:none;">${phone}</a></td></tr>` : ""}
    </table>

    <h2 style="font-size:11px;font-weight:800;color:#8C8B85;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px;text-align:left;border-bottom:1px solid #EAEAE6;padding-bottom:6px;">📚 Detalle de la Compra</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
      <tbody>${courseRows}</tbody>
      <tfoot>
        <tr>
          <td style="padding-top:12px;font-size:14px;font-weight:800;color:#171716;text-align:left;">Total Recaudado</td>
          <td style="padding-top:12px;font-size:18px;font-weight:900;color:#16A34A;text-align:right;">${formatCLP(totalPaid)}</td>
        </tr>
      </tfoot>
    </table>

    <div style="background-color:#F7F7F4;border: 1px solid #E5E5E0;border-radius:12px;padding:14px 16px;font-size:12px;color:#5F5E59;margin-top:10px;">
      <strong style="color:#171716;">Método de Pago:</strong> ${paymentMethod || "Flow"} <br/>
      <strong style="color:#171716;">ID Orden:</strong> <span style="font-family:monospace;color:#171716;font-weight:700;">${orderId}</span>
    </div>

    <div style="margin-top:24px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-right:10px;">
            <a href="mailto:${email}?subject=Bienvenido a ProgramBI — ${encodeURIComponent(name)}" 
               style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:9999px;">
              📧 Escribir Email →
            </a>
          </td>
          ${phone ? `<td>
            <a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" 
               style="display:inline-block;background-color:#F7F7F4;border:1px solid #D4D4D0;color:#171716;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:9999px;">
              💬 Chatear WhatsApp →
            </a>
          </td>` : ""}
        </tr>
      </table>
    </div>
  `);

  const transporter = getTransporter();

  // Email to moliva@programbi.cl
  await transporter.sendMail({
    from: fromAddress(),
    to: adminEmail || "moliva@programbi.cl",
    subject: `💰 ¡Nueva Venta! ${name} — ${courses.map(c => c.title).join(", ")}`,
    html,
    text: `¡Nueva Venta! Alumno: ${name} | Email: ${email}${phone ? ` | WhatsApp: ${phone}` : ""} | Cursos: ${courses.map(c => `${c.title} (${c.levelName})`).join(", ")} | Total: ${formatCLP(totalPaid)} | Orden: ${orderId}`,
    replyTo: email,
  });
}

// ─── Email 6: Bienvenida membresía ────────────────────────────────────────────
export async function sendMembershipWelcome(params: {
  name: string;
  email: string;
  planName: string;
  price: number;
}) {
  const { name, email, planName, price } = params;

  const html = wrapHtml("¡Bienvenido a la Comunidad! — ProgramBI", `
    <div style="text-align:center;padding:14px 0 24px;">
      <div style="display:inline-block;background-color:#DCFCE7;color:#166534;font-size:10.5px;font-weight:800;padding:4px 12px;border-radius:9999px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">
        🚀 Membresía Activa
      </div>
      <h1 style="margin:4px 0 6px;font-size:24px;font-weight:900;color:#171716;letter-spacing:-0.5px;">¡Bienvenido, ${name}!</h1>
      <p style="margin:0;font-size:14px;color:#5F5E59;max-width:380px;margin:6px auto 0;">Ahora eres parte oficial de la comunidad ProgramBI. Tu suscripción a <strong>${planName}</strong> ya está habilitada.</p>
    </div>

    <!-- TARJETA PLAN DARK -->
    <div style="background-color:#171716;border-radius:16px;padding:24px;margin-bottom:24px;text-align:center;color:#FFFFFF;border:1px solid #2B2A27;">
      <div style="font-size:10.5px;font-weight:800;color:#8C8B85;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">Plan Activo</div>
      <div style="font-size:26px;font-weight:900;color:#FFFFFF;letter-spacing:-0.5px;">${planName}</div>
      <div style="font-size:15px;color:#EBEBE6;margin-top:4px;font-weight:600;">${formatCLP(price)} / mes</div>
    </div>

    <div style="margin-bottom:24px;">
      ${[
      ["💬", "Comunidad privada", "Conecta con cientos de profesionales y analistas de datos."],
      ["🤖", "Asistente IA ProgramBI", "Soporte interactivo y resolución de dudas sobre código."],
      ["📚", "Biblioteca de recursos", "Plantillas de Power BI, scripts SQL y proyectos reales."],
      ["🎓", "Descuentos en cursos", "Beneficios y tarifas preferenciales en todos nuestros programas."],
    ].map(([icon, title, desc]) => `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F7F7F4;border:1px solid #E5E5E0;border-radius:12px;padding:14px 16px;margin-bottom:10px;">
          <tr>
            <td width="36" valign="top" style="font-size:20px;padding-right:10px;">${icon}</td>
            <td valign="top">
              <div style="font-size:13.5px;font-weight:800;color:#171716;">${title}</div>
              <div style="font-size:12px;color:#5F5E59;margin-top:2px;">${desc}</div>
            </td>
          </tr>
        </table>
      `).join("")}
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="https://programbi.com/comunidad" style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:9999px;letter-spacing:0.2px;">
        Acceder al Campus de la Comunidad →
      </a>
    </div>
  `);

  await sendEmail({
    to: email,
    toName: name,
    subject: `🚀 ¡Bienvenido a ProgramBI ${planName}!`,
    html,
    text: `¡Bienvenido ${name}! Tu membresía ${planName} está activa. Accede a la comunidad en programbi.com/comunidad`,
  });
}

// ─── Bolsa de Trabajo ────────────────────────────────────────────────────────

export async function sendCompanyApprovalEmail(params: {
  to: string;
  companyName: string;
  approved: boolean;
  reason?: string;
}) {
  const { to, companyName, approved, reason } = params;
  const html = wrapHtml(
    approved ? "Empresa aprobada" : "Registro rechazado",
    `
    <p style="margin:0;font-size:15px;color:#171716;font-weight:700;">Hola,</p>
    ${
      approved
        ? `
      <p style="margin:14px 0 0;font-size:14px;line-height:1.65;color:#5F5E59;">
        <strong style="color:#171716;">«${companyName}» fue aprobada</strong> para publicar vacantes en la
        Bolsa de Trabajo de ProgramBI. Ya puedes crear tu primera vacante desde tu panel.
      </p>
      <div style="text-align:center;margin-top:24px;">
        <a href="https://programbi.com/comunidad/empleos" style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13.5px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:9999px;">
          Publicar mi primera vacante →
        </a>
      </div>`
        : `
      <p style="margin:14px 0 0;font-size:14px;line-height:1.65;color:#5F5E59;">
        Tu solicitud para registrar a <strong style="color:#171716;">«${companyName}»</strong> en la Bolsa de
        Trabajo de ProgramBI no fue aprobada${reason ? `: <em>${reason}</em>` : ""}.
      </p>
      <p style="margin:12px 0 0;font-size:13px;color:#8C8B85;">
        Si crees que fue un error, escríbenos a ${ADMIN_EMAIL}.
      </p>`
    }
  `
  );

  await sendEmail({
    to,
    subject: approved
      ? `✅ ${companyName} aprobada en la Bolsa de Trabajo ProgramBI`
      : `Registro de ${companyName} en la Bolsa de Trabajo`,
    html,
    text: approved
      ? `${companyName} fue aprobada para publicar vacantes. Entra a programbi.com/comunidad/empleos`
      : `Tu solicitud para ${companyName} no fue aprobada${reason ? `: ${reason}` : ""}.`,
  });
}

export async function sendNewApplicationEmail(params: {
  to: string;
  companyName: string;
  jobTitle: string;
  candidateName: string;
  verifiedSkills: string[];
  hasCv: boolean;
}) {
  const { to, companyName, jobTitle, candidateName, verifiedSkills, hasCv } = params;
  const html = wrapHtml(
    "Nueva postulación",
    `
    <p style="margin:0;font-size:15px;color:#171716;font-weight:700;">Hola equipo ${companyName},</p>
    <p style="margin:14px 0 0;font-size:14px;line-height:1.65;color:#5F5E59;">
      <strong style="color:#171716;">${candidateName}</strong> postuló a tu vacante <strong style="color:#171716;">«${jobTitle}»</strong>.
    </p>
    ${
      verifiedSkills.length
        ? `<p style="margin:14px 0 0;font-size:12.5px;color:#5F5E59;font-weight:700;">
             Certificados ProgramBI verificados del candidato:
           </p>
           <div style="margin-top:8px;">
             ${verifiedSkills
               .map(
                 (s) =>
                   `<span style="display:inline-block;background-color:#DCFCE7;color:#166534;border:1px solid #BBF7D0;border-radius:9999px;padding:3px 10px;font-size:11.5px;font-weight:700;margin:0 4px 4px 0;">✓ ${s}</span>`
               )
               .join("")}
           </div>`
        : ""
    }
    ${hasCv ? `<p style="margin:12px 0 0;font-size:12.5px;color:#8C8B85;">El candidato adjuntó su CV (descargable desde el panel).</p>` : ""}
    <div style="text-align:center;margin-top:24px;">
      <a href="https://programbi.com/comunidad/empleos" style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13.5px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:9999px;">
        Revisar postulación →
      </a>
    </div>
  `
  );

  await sendEmail({
    to,
    subject: `📌 Nueva postulación: ${candidateName} → ${jobTitle}`,
    html,
    text: `${candidateName} postuló a «${jobTitle}». Revisa la postulación en programbi.com/comunidad/empleos`,
  });
}

export async function sendCandidateStatusEmail(params: {
  to: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  statusLabel: string;
}) {
  const { to, candidateName, jobTitle, companyName, statusLabel } = params;
  const html = wrapHtml(
    "Actualización de tu postulación",
    `
    <p style="margin:0;font-size:15px;color:#171716;font-weight:700;">Hola ${candidateName},</p>
    <p style="margin:14px 0 0;font-size:14px;line-height:1.65;color:#5F5E59;">
      Tu postulación a <strong style="color:#171716;">«${jobTitle}»</strong> (${companyName}) avanzó de etapa:
    </p>
    <div style="background-color:#F7F7F4;border:1px solid #E5E5E0;border-radius:12px;padding:18px;text-align:center;margin-top:16px;">
      <div style="font-size:10.5px;font-weight:800;color:#8C8B85;text-transform:uppercase;letter-spacing:1.2px;">Nuevo estado</div>
      <div style="font-size:20px;font-weight:900;color:#171716;margin-top:4px;">${statusLabel}</div>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <a href="https://programbi.com/comunidad/empleos" style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13.5px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:9999px;">
        Ver mis postulaciones →
      </a>
    </div>
  `
  );

  await sendEmail({
    to,
    toName: candidateName,
    subject: `🔄 Tu postulación a «${jobTitle}»: ${statusLabel}`,
    html,
    text: `Tu postulación a «${jobTitle}» (${companyName}) ahora está en estado: ${statusLabel}.`,
  });
}

export async function sendJobExpiringEmail(params: {
  to: string;
  companyName: string;
  jobTitle: string;
  daysLeft: number;
}) {
  const { to, companyName, jobTitle, daysLeft } = params;
  const html = wrapHtml(
    "Tu vacante está por expirar",
    `
    <p style="margin:0;font-size:15px;color:#171716;font-weight:700;">Hola equipo ${companyName},</p>
    <p style="margin:14px 0 0;font-size:14px;line-height:1.65;color:#5F5E59;">
      Tu vacante <strong style="color:#171716;">«${jobTitle}»</strong> ${
        daysLeft <= 0
          ? "ya expiró y dejó de aparecer en la bolsa de trabajo."
          : `expira en <strong style="color:#171716;">${daysLeft} ${daysLeft === 1 ? "día" : "días"}</strong>.`
      }
    </p>
    <p style="margin:12px 0 0;font-size:13px;color:#8C8B85;">
      Extiende su vigencia 30 días más con un clic desde tu panel si el cargo sigue abierto.
    </p>
    <div style="text-align:center;margin-top:24px;">
      <a href="https://programbi.com/comunidad/empleos" style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13.5px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:9999px;">
        Gestionar mis vacantes →
      </a>
    </div>
  `
  );

  await sendEmail({
    to,
    subject: `⏳ «${jobTitle}» ${daysLeft <= 0 ? "expiró" : `expira en ${daysLeft} ${daysLeft === 1 ? "día" : "días"}`}`,
    html,
    text: `Tu vacante «${jobTitle}» ${daysLeft <= 0 ? "expiró" : `expira en ${daysLeft} días`}. Extiéndela desde programbi.com/comunidad/empleos`,
  });
}

export async function sendFeatureConfirmationEmail(params: {
  to: string;
  companyName: string;
  jobTitle: string;
  days: number;
  featuredUntil: string;
  amountClp: number | null;
}) {
  const { to, companyName, jobTitle, days, featuredUntil, amountClp } = params;
  const until = new Date(featuredUntil).toLocaleDateString("es-CL", { day: "numeric", month: "long" });
  const html = wrapHtml(
    "Tu vacante está destacada",
    `
    <p style="margin:0;font-size:15px;color:#171716;font-weight:700;">Hola equipo ${companyName},</p>
    <div style="background-color:#DCFCE7;border:1px solid #BBF7D0;border-radius:14px;padding:20px;margin:20px 0;text-align:center;">
      <div style="font-size:10.5px;font-weight:800;color:#166534;text-transform:uppercase;letter-spacing:1.2px;">Vacante Destacada Activa</div>
      <div style="font-size:20px;font-weight:900;color:#171716;margin-top:4px;">${jobTitle}</div>
      <div style="font-size:13.5px;color:#166534;margin-top:6px;font-weight:600;">
        ${days} días · visible arriba del listado hasta el <strong>${until}</strong>
      </div>
      ${amountClp ? `<div style="font-size:12px;color:#5F5E59;margin-top:4px;">Pagado: ${formatCLP(amountClp)}</div>` : ""}
    </div>
    <p style="margin:0;font-size:13.5px;line-height:1.65;color:#5F5E59;">
      Tu vacante aparecerá en primer lugar en la Bolsa de Trabajo y con la etiqueta
      «Destacada», recibiendo en promedio mucha más visibilidad.
    </p>
    <div style="text-align:center;margin-top:24px;">
      <a href="https://programbi.com/comunidad/empleos" style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13.5px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:9999px;">
        Ver mis vacantes →
      </a>
    </div>
  `
  );

  await sendEmail({
    to,
    subject: `⭐ «${jobTitle}» ahora está destacada por ${days} días`,
    html,
    text: `Tu vacante «${jobTitle}» está destacada hasta el ${until}.`,
  });
}

export async function sendJobAlertsDigestEmail(params: {
  to: string;
  candidateName: string;
  alertName: string;
  jobs: Array<{ title: string; company: string; location: string; url: string; salary?: string | null }>;
}) {
  const { to, candidateName, alertName, jobs } = params;
  const rows = jobs
    .map(
      (j) => `
      <a href="${j.url}" style="display:block;background-color:#F7F7F4;border:1px solid #E5E5E0;border-radius:12px;padding:14px 16px;margin-bottom:10px;text-decoration:none;">
        <div style="font-size:14.5px;font-weight:700;color:#171716;">${j.title}</div>
        <div style="font-size:12.5px;color:#5F5E59;margin-top:2px;">${j.company} · ${j.location}${j.salary ? ` · <strong style="color:#171716;">${j.salary}</strong>` : ""}</div>
      </a>`
    )
    .join("");

  const html = wrapHtml(
    "Nuevas vacantes para ti",
    `
    <p style="margin:0;font-size:15px;color:#171716;font-weight:700;">Hola ${candidateName},</p>
    <p style="margin:14px 0 0;font-size:14px;line-height:1.65;color:#5F5E59;">
      Tu alerta <strong style="color:#171716;">«${alertName}»</strong> encontró ${jobs.length} ${
        jobs.length === 1 ? "vacante nueva" : "vacantes nuevas"
      } en la Bolsa de Trabajo de ProgramBI:
    </p>
    <div style="margin-top:16px;">${rows}</div>
    <div style="text-align:center;margin-top:24px;">
      <a href="https://programbi.com/empleos" style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13.5px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:9999px;">
        Ver todas las vacantes →
      </a>
    </div>
  `
  );

  await sendEmail({
    to,
    toName: candidateName,
    subject: `🔔 ${jobs.length} ${jobs.length === 1 ? "vacante nueva" : "vacantes nuevas"} para tu alerta «${alertName}»`,
    html,
    text: `Tu alerta «${alertName}» encontró ${jobs.length} vacantes nuevas: ${jobs.map((j) => j.title).join(", ")}.`,
  });
}

export async function sendTalentContactEmail(params: {
  to: string;
  candidateName: string;
  companyName: string;
  jobContext?: string | null;
  message?: string | null;
}) {
  const { to, candidateName, companyName, jobContext, message } = params;
  const html = wrapHtml(
    "Una empresa quiere contactarte",
    `
    <p style="margin:0;font-size:15px;color:#171716;font-weight:700;">Hola ${candidateName},</p>
    <div style="background-color:#F7F7F4;border:1px solid #E5E5E0;border-radius:12px;padding:18px;margin:18px 0;">
      <p style="margin:0;font-size:14px;line-height:1.65;color:#5F5E59;">
        La empresa <strong style="color:#171716;">${companyName}</strong> vio tu perfil en el directorio de talento
        de ProgramBI${jobContext ? ` y quiere conversar por <strong style="color:#171716;">${jobContext}</strong>` : ""}.
      </p>
      ${message ? `<p style="margin:10px 0 0;font-size:13px;line-height:1.6;color:#8C8B85;font-style:italic;">"${message}"</p>` : ""}
    </div>
    <p style="margin:0;font-size:13px;color:#5F5E59;">
      Si te interesa, responde directamente al email de contacto de la empresa que
      aparece en la notificación dentro de tu portal ProgramBI.
    </p>
    <div style="text-align:center;margin-top:24px;">
      <a href="https://programbi.com/comunidad" style="display:inline-block;background-color:#171716;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13.5px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:9999px;">
        Ir a mi portal →
      </a>
    </div>
  `
  );

  await sendEmail({
    to,
    toName: candidateName,
    subject: `💼 ${companyName} quiere contactarte`,
    html,
    text: `La empresa ${companyName} vio tu perfil en el directorio de talento de ProgramBI y quiere contactarte.`,
  });
}
