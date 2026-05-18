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
import { staticSchedules, formatScheduleDate } from "../data/course-schedules";
import { createAdminClient } from "../supabase/server";

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

// ─── Base HTML template ────────────────────────────────────────────────────────
function wrapHtml(title: string, content: string) {
  return /* html */ `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#1890FF 0%,#4338ca 100%);padding:32px 40px;text-align:center;">
            <div style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.5px;">ProgramBI</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px;letter-spacing:2px;text-transform:uppercase;">Formación en Datos</div>
          </td>
        </tr>

        <!-- CONTENT -->
        <tr>
          <td style="padding:40px 40px 32px;">
            ${content}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #F1F5F9;background:#FAFAFA;">
            <p style="margin:0;font-size:12px;color:#94A3B8;text-align:center;line-height:1.6;">
              © ${new Date().getFullYear()} ProgramBI — Todos los derechos reservados<br/>
              <a href="https://programbi.com" style="color:#1890FF;text-decoration:none;">programbi.com</a> · 
              <a href="mailto:${ADMIN_EMAIL}" style="color:#1890FF;text-decoration:none;">${ADMIN_EMAIL}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Email 1: Cotización Individual (al lead) — Template Premium ────────────
export async function sendQuoteConfirmationToLead(params: {
  name: string;
  email: string;
  courses: string[];
  message?: string;
}) {
  const { name, email, courses } = params;
  const firstName = name.split(" ")[0] || name;

  const html = buildQuoteEmailHtml(firstName);

  await sendEmail({
    to: email,
    toName: name,
    subject: "Tu Cotización en ProgramBI — Cursos de Datos 100% Aplicados",
    html,
    text: `Hola ${firstName}, gracias por tu interés en ProgramBI. Diseñamos cursos de programación y análisis de datos 100% aplicados al mercado laboral actual. Revisa tu cotización completa en tu correo. Cursos: ${courses.join(", ")}.`,
    replyTo: ADMIN_EMAIL,
  });
}



// ─── Email 2: Notificación interna — Nueva cotización ─────────────────────────
// Envía directamente usando transporter.sendMail (mismo método que las cotizaciones
// que SÍ llegan) para garantizar la entrega a moliva@programbi.cl
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

  const isEnterprise = leadType === "enterprise";
  const courseList = courses.map(c => `<li style="padding:4px 0;font-size:14px;color:#0F172A;">${c}</li>`).join("");
  const timestamp = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });

  const html = wrapHtml("🚨 Nuevo Contacto — ProgramBI", `
    <div style="display:inline-block;background:${isEnterprise ? "#FEF3C7" : "#DCFCE7"};color:${isEnterprise ? "#92400E" : "#166534"};font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">
      ${isEnterprise ? "🏢 Empresa" : "👤 Individual"}
    </div>
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#0F172A;">Nuevo contacto: ${name}</h1>
    <p style="margin:0 0 20px;font-size:12px;color:#94A3B8;">Recibido el ${timestamp}</p>

    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;width:140px;">Nombre</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;">${name}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">Email</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;"><a href="mailto:${email}" style="color:#1890FF;">${email}</a></td></tr>
      ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">WhatsApp</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;"><a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" style="color:#25D366;font-weight:700;">${phone}</a></td></tr>` : ""}
      ${isEnterprise && company ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">Empresa</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;">${company}</td></tr>` : ""}
      ${isEnterprise && position ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">Cargo</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;">${position}</td></tr>` : ""}
      ${isEnterprise && employeeCount ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">Empleados</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;">${employeeCount}</td></tr>` : ""}
    </table>

    <div style="background:#F8FAFC;border-radius:12px;padding:16px 20px;margin-top:20px;">
      <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Cursos de interés</div>
      <ul style="margin:0;padding-left:18px;">${courseList || "<li>No especificado</li>"}</ul>
    </div>

    ${message ? `<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px 20px;margin-top:16px;"><div style="font-size:11px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Mensaje</div><p style="margin:0;font-size:14px;color:#78350F;">${message}</p></div>` : ""}

    <div style="margin-top:28px;display:flex;gap:12px;">
      <a href="mailto:${email}?subject=Cotización ProgramBI — ${encodeURIComponent(name)}" 
         style="display:inline-block;background:linear-gradient(135deg,#1890FF,#4338ca);color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:13px 24px;border-radius:12px;">
        📧 Responder por Email →
      </a>
      ${phone ? `<a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" 
         style="display:inline-block;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:13px 24px;border-radius:12px;">
        💬 WhatsApp →
      </a>` : ""}
    </div>
  `);

  const subject = `🚨 Nuevo contacto ${isEnterprise ? "empresarial" : ""}: ${name} — ${courses[0] || "General"}`;
  const text = `Nuevo contacto: ${name} | ${email}${phone ? ` | ${phone}` : ""} | Cursos: ${courses.join(", ")}${message ? ` | Msg: ${message}` : ""}`;

  // Enviar directamente usando transporter.sendMail (sin wrapper)
  // Mismo patrón exacto que los emails de cotización que SÍ llegan
  const transporter = getTransporter();

  // Email a moliva@programbi.cl
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
// Mismo patrón directo que funciona para los leads
export async function sendNewMemberNotification(params: {
  name: string;
  email: string;
  phone?: string;
}) {
  const { name, email, phone } = params;
  const timestamp = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });

  const html = wrapHtml("🎉 Nuevo Miembro — ProgramBI", `
    <div style="text-align:center;padding:16px 0 24px;">
      <div style="font-size:48px;margin-bottom:12px;">🎉</div>
      <div style="display:inline-block;background:#DCFCE7;color:#166534;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">
        Nuevo Registro
      </div>
      <h1 style="margin:8px 0 4px;font-size:24px;font-weight:900;color:#0F172A;">¡Se registró ${name}!</h1>
      <p style="margin:0;font-size:13px;color:#94A3B8;">${timestamp}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-top:16px;">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;width:120px;">Nombre</td>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:15px;font-weight:700;color:#0F172A;">${name}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">Email</td>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:15px;font-weight:700;">
          <a href="mailto:${email}" style="color:#1890FF;text-decoration:none;">${email}</a>
        </td>
      </tr>
      ${phone ? `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">WhatsApp</td>
        <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:15px;font-weight:700;">
          <a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" style="color:#25D366;text-decoration:none;font-weight:700;">${phone}</a>
        </td>
      </tr>` : ""}
    </table>

    <div style="margin-top:28px;text-align:center;">
      <a href="mailto:${email}?subject=Bienvenido a ProgramBI — ${encodeURIComponent(name)}" 
         style="display:inline-block;background:linear-gradient(135deg,#1890FF,#4338ca);color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:12px;">
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
    <div style="text-align:center;padding:20px 0 28px;">
      <div style="font-size:48px;margin-bottom:12px;">🔔</div>
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#0F172A;">¡Ya estás en lista!</h1>
      <p style="margin:0;font-size:15px;color:#475569;">Te notificaremos cuando se abra la próxima fecha.</p>
    </div>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px 24px;margin-bottom:28px;text-align:center;">
      <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px;">Esperando apertura de</div>
      <div style="font-size:20px;font-weight:900;color:#0F172A;">${courseName}</div>
      ${levelName ? `<div style="font-size:13px;color:#64748B;margin-top:4px;">Nivel: ${levelName}</div>` : ""}
    </div>

    <p style="font-size:14px;color:#475569;line-height:1.6;text-align:center;">
      Mientras tanto, puedes explorar los demás cursos disponibles en nuestra plataforma.
    </p>

    <div style="text-align:center;margin-top:24px;">
      <a href="https://programbi.com/cursos" style="display:inline-block;background:linear-gradient(135deg,#1890FF,#4338ca);color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:12px;">
        Explorar otros cursos →
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
  courses: Array<{ slug?: string; title: string; levelName: string; price: number }>;
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
    let sched = activeSchedules.find(s => s.course_slug === c.slug && s.level_name === c.levelName);
    if (!sched && c.slug) {
      sched = staticSchedules.find(s => s.course_slug === c.slug && s.level_name === c.levelName);
    }

    const hasSchedule = !!sched;
    const startDateFormatted = hasSchedule && sched.start_date ? formatScheduleDate(sched.start_date) : "Por confirmar";
    const days = hasSchedule ? sched.schedule_days : "Por confirmar";
    const time = hasSchedule ? sched.schedule_time : "Por confirmar";

    return `
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 14px; margin-bottom: 16px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #0F172A; text-align: left;">
            ${c.title} - <span style="color: #1890FF; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${c.levelName}</span>
          </h3>
        </div>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #64748B; width: 140px; text-align: left;"><strong>📅 Fecha de Inicio:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #0F172A; text-align: left;">${startDateFormatted}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #64748B; text-align: left;"><strong>🗓️ Días de Clases:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #0F172A; text-align: left;">${days}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-size: 14px; color: #64748B; text-align: left;"><strong>⏰ Horario:</strong></td>
            <td style="padding: 6px 0; font-size: 14px; font-weight: 700; color: #0F172A; text-align: left;">${time} (Vía Zoom en Vivo)</td>
          </tr>
        </table>
        
        <div style="background: #F8FAFC; border-left: 4px solid #1890FF; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #475569; line-height: 1.5; text-align: left;">
          <strong>💡 Información Importante:</strong> El curso se dicta en vivo vía Zoom. Las clases quedan grabadas y tendrás acceso ilimitado a ellas para repasarlas en cualquier momento. Te enviaremos las instrucciones y enlace de conexión antes del inicio de clases.
        </div>
      </div>
    `;
  }).join("");

  // Limpiar método de pago: eliminar paréntesis como (webpay - tarjeta de crédito)
  const cleanPaymentMethod = paymentMethod ? paymentMethod.replace(/\s*\(.*\)/gi, "").trim() : "Flow";

  // Detalle financiero / Recibo
  const courseRows = courses.map(c => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:#0F172A;text-align:left;">${c.title} (${c.levelName})</td>
      <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;text-align:right;">${formatCLP(c.price)}</td>
    </tr>
  `).join("");

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>¡Felicidades por tu inscripción! — ProgramBI</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.04);max-width:600px;width:100%;">

        <!-- HEADER BANNER - CLEAR BACKGROUND WITH LOGO -->
        <tr>
          <td style="background:#FFFFFF;padding:40px 40px 20px;text-align:center;border-bottom:1px solid #F1F5F9;">
            <div style="margin-bottom: 20px;">
              <img src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974" width="150" alt="ProgramBI" style="display:inline-block;width:150px;max-width:100%"/>
            </div>
            <div style="background: #E6F4EA; color: #137333; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 99px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
              🎉 ¡INSCRIPCIÓN CONFIRMADA!
            </div>
          </td>
        </tr>

        <!-- MAIN BODY -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <h1 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#0F172A;text-align:left;letter-spacing:-0.5px;">¡Felicidades por dar el siguiente paso, ${name.split(" ")[0]}!</h1>
            <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;text-align:left;">
              Hemos recibido y procesado tu pago de forma exitosa. Oficialmente ya eres parte de ProgramBI y tienes asegurado tu cupo para comenzar tu formación. A continuación encontrarás todos los detalles clave de tus clases e inicio del curso:
            </p>

            <!-- CURSOS DETALLE -->
            <div style="margin-bottom: 32px;">
              <h2 style="font-size:14px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:16px;text-align:left;">📅 Horarios e Información de Clases</h2>
              ${courseDetailCards}
            </div>

            <!-- RESUMEN DE PAGO (BOLETA / DETALLE) -->
            <div style="background:#F8FAFC;border: 1px solid #E2E8F0;border-radius:16px;padding:24px;margin-bottom:32px;">
              <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #E2E8F0;padding-bottom:12px;margin-bottom:14px;">
                <span style="font-size:12px;font-weight:800;color:#64748B;text-transform:uppercase;letter-spacing:1px;text-align:left;">Comprobante de Pago</span>
                <span style="font-size:12px;font-weight:800;color:#1890FF;font-family:monospace;">ID Orden: ${orderId}</span>
              </div>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tbody>${courseRows}</tbody>
                <tfoot>
                  <tr>
                    <td style="padding-top:14px;font-size:15px;font-weight:800;color:#0F172A;text-align:left;">Total Pagado</td>
                    <td style="padding-top:14px;font-size:18px;font-weight:900;color:#10B981;text-align:right;">${formatCLP(totalPaid)}</td>
                  </tr>
                </tfoot>
              </table>
              ${cleanPaymentMethod ? `<p style="margin:12px 0 0;font-size:12px;color:#94A3B8;text-align:right;font-style:italic;">Método de Pago: ${cleanPaymentMethod}</p>` : ""}
            </div>

            <!-- ONBOARDING PASOS -->
            <div style="border-top:1px solid #F1F5F9;padding-top:32px;margin-bottom:36px;">
              <h2 style="font-size:14px;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:20px;text-align:left;">🚀 Siguientes Pasos</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td valign="top" style="width:32px;padding-right:12px;">
                    <div style="width:24px;height:24px;background:#EFF6FF;border-radius:50%;color:#1890FF;text-align:center;line-height:24px;font-size:12px;font-weight:800;">1</div>
                  </td>
                  <td style="padding-bottom:16px;text-align:left;">
                    <h4 style="margin:0 0 4px;font-size:14px;font-weight:800;color:#0F172A;">Espera la fecha de inicio del curso</h4>
                    <p style="margin:0;font-size:13px;color:#64748B;line-height:1.5;">Te enviaremos los detalles finales y las instrucciones de conexión por correo electrónico y WhatsApp antes de comenzar.</p>
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="width:32px;padding-right:12px;">
                    <div style="width:24px;height:24px;background:#EFF6FF;border-radius:50%;color:#1890FF;text-align:center;line-height:24px;font-size:12px;font-weight:800;">2</div>
                  </td>
                  <td style="padding-bottom:16px;text-align:left;">
                    <h4 style="margin:0 0 4px;font-size:14px;font-weight:800;color:#0F172A;">Participa en las clases en vivo</h4>
                    <p style="margin:0;font-size:13px;color:#64748B;line-height:1.5;">Conéctate y participa activamente en las sesiones en vivo vía Zoom. Es la mejor oportunidad para interactuar con el docente y resolver tus dudas en el acto.</p>
                  </td>
                </tr>
                <tr>
                  <td valign="top" style="width:32px;padding-right:12px;">
                    <div style="width:24px;height:24px;background:#EFF6FF;border-radius:50%;color:#1890FF;text-align:center;line-height:24px;font-size:12px;font-weight:800;">3</div>
                  </td>
                  <td style="padding-bottom:0;text-align:left;">
                    <h4 style="margin:0 0 4px;font-size:14px;font-weight:800;color:#0F172A;">Acceso ilimitado a grabaciones</h4>
                    <p style="margin:0;font-size:13px;color:#64748B;line-height:1.5;">Si no puedes asistir en vivo un día, ¡no te preocupes! Todas las sesiones quedan grabadas y tendrás acceso completo para repasarlas cuando quieras.</p>
                  </td>
                </tr>
              </table>
            </div>

            <!-- BOTON CTA - WHATSAPP DIRECTO -->
            <div style="text-align:center;margin-top:36px;margin-bottom:20px;">
              <a href="https://wa.me/56935409699" 
                 style="display:inline-block;background:linear-gradient(135deg,#25D366 0%,#128C7E 100%);color:#fff;font-size:15px;font-weight:800;text-decoration:none;padding:16px 36px;border-radius:14px;box-shadow:0 8px 16px rgba(37,211,102,0.25);letter-spacing:0.3px;">
                💬 ¿Tienes dudas? Escríbenos por WhatsApp →
              </a>
            </div>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:32px 40px;border-top:1px solid #F1F5F9;background:#FAFAFA;">
            <p style="margin:0 0 12px;font-size:13px;color:#64748B;text-align:center;line-height:1.6;">
              ¿Tienes dudas o necesitas ayuda técnica?<br/>
              Escríbenos directamente respondiendo a este correo o vía WhatsApp a nuestro soporte.
            </p>
            <p style="margin:0;font-size:12px;color:#94A3B8;text-align:center;line-height:1.6;">
              © ${new Date().getFullYear()} ProgramBI — Todos los derechos reservados<br/>
              <a href="https://programbi.com" style="color:#1890FF;text-decoration:none;font-weight:600;">programbi.com</a> · 
              <a href="mailto:${ADMIN_EMAIL}" style="color:#1890FF;text-decoration:none;font-weight:600;">${ADMIN_EMAIL}</a>
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

// ─── Email 6: Bienvenida membresía ────────────────────────────────────────────
export async function sendMembershipWelcome(params: {
  name: string;
  email: string;
  planName: string;
  price: number;
}) {
  const { name, email, planName, price } = params;

  const html = wrapHtml("¡Bienvenido a la Comunidad! — ProgramBI", `
    <div style="text-align:center;padding:20px 0 32px;">
      <div style="font-size:48px;margin-bottom:16px;">🚀</div>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:#0F172A;">¡Bienvenido, ${name}!</h1>
      <p style="margin:0;font-size:15px;color:#475569;max-width:380px;margin:8px auto 0;">Ahora eres parte de la comunidad ProgramBI. Tu plan <strong>${planName}</strong> está activo.</p>
    </div>

    <div style="background:linear-gradient(135deg,#1890FF,#4338ca);border-radius:16px;padding:24px;margin-bottom:28px;text-align:center;color:#fff;">
      <div style="font-size:12px;font-weight:700;opacity:0.8;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Plan activo</div>
      <div style="font-size:28px;font-weight:900;">${planName}</div>
      <div style="font-size:16px;opacity:0.9;margin-top:4px;">${formatCLP(price)} / mes</div>
    </div>

    <div style="display:grid;gap:12px;">
      ${[
      ["💬", "Comunidad privada", "Conecta con cientos de data practitioners en nuestro foro."],
      ["🤖", "Asistente IA ProgramBI", "Soporte 24/7 con IA especializada en datos."],
      ["📚", "Biblioteca de recursos", "Acceso a plantillas, datasets y proyectos reales."],
      ["🎓", "Descuentos en cursos", "Beneficios exclusivos en todos los programas."],
    ].map(([icon, title, desc]) => `
        <div style="display:flex;gap:16px;align-items:flex-start;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
          <span style="font-size:22px;line-height:1;margin-top:2px;">${icon}</span>
          <div>
            <div style="font-size:14px;font-weight:700;color:#0F172A;">${title}</div>
            <div style="font-size:13px;color:#64748B;margin-top:2px;">${desc}</div>
          </div>
        </div>
      `).join("")}
    </div>

    <div style="text-align:center;margin-top:32px;">
      <a href="https://programbi.com/comunidad" style="display:inline-block;background:linear-gradient(135deg,#1890FF,#4338ca);color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 32px;border-radius:14px;letter-spacing:0.3px;">
        Acceder a la Comunidad →
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
