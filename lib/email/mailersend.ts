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

// ─── Config ────────────────────────────────────────────────────────────────────
const SMTP_HOST = process.env.SES_SMTP_HOST || "email-smtp.us-east-1.amazonaws.com";
const SMTP_PORT = parseInt(process.env.SES_SMTP_PORT || "465", 10);
const SMTP_USER = process.env.SES_SMTP_USER!;
const SMTP_PASS = process.env.SES_SMTP_PASS!;
const FROM_EMAIL = process.env.SES_FROM_EMAIL || "noreply@programbi.com";
const FROM_NAME = process.env.SES_FROM_NAME || "ProgramBI";
const ADMIN_EMAIL = process.env.SES_ADMIN_EMAIL || "contacto@programbi.com";

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
  const courseList = courses.map(c => `<li>${c}</li>`).join("");

  const html = wrapHtml("Nuevo lead — ProgramBI", `
    <div style="display:inline-block;background:${isEnterprise ? "#FEF3C7" : "#DCFCE7"};color:${isEnterprise ? "#92400E" : "#166534"};font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">
      ${isEnterprise ? "🏢 Empresa" : "👤 Individual"}
    </div>
    <h1 style="margin:0 0 20px;font-size:22px;font-weight:900;color:#0F172A;">Nuevo lead: ${name}</h1>

    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;width:140px;">Nombre</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;">${name}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">Email</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;"><a href="mailto:${email}" style="color:#1890FF;">${email}</a></td></tr>
      ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">Teléfono</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;">${phone}</td></tr>` : ""}
      ${isEnterprise && company ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">Empresa</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;">${company}</td></tr>` : ""}
      ${isEnterprise && position ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">Cargo</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;">${position}</td></tr>` : ""}
      ${isEnterprise && employeeCount ? `<tr><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">Empleados</td><td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;">${employeeCount}</td></tr>` : ""}
    </table>

    <div style="background:#F8FAFC;border-radius:12px;padding:16px 20px;margin-top:20px;">
      <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Cursos de interés</div>
      <ul style="margin:0;padding-left:18px;">${courseList || "<li>No especificado</li>"}</ul>
    </div>

    ${message ? `<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px 20px;margin-top:16px;"><div style="font-size:11px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Mensaje</div><p style="margin:0;font-size:14px;color:#78350F;">${message}</p></div>` : ""}

    <div style="margin-top:28px;">
      <a href="mailto:${email}?subject=Cotización ProgramBI — ${encodeURIComponent(name)}" 
         style="display:inline-block;background:linear-gradient(135deg,#1890FF,#4338ca);color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:13px 24px;border-radius:12px;">
        Responder a ${name} →
      </a>
    </div>
  `);

  await sendEmail({
    to: ADMIN_EMAIL,
    toName: "Equipo ProgramBI",
    subject: `🔔 Nuevo lead ${isEnterprise ? "empresarial" : "individual"}: ${name}`,
    html,
    text: `Nuevo lead: ${name} | ${email} | Cursos: ${courses.join(", ")}`,
    replyTo: email,
  });
}

// ─── Email 3: Cotización Empresa (al cliente empresa) ──────────────────────────
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
  courses: Array<{ title: string; levelName: string; price: number }>;
  orderId: string;
  totalPaid: number;
  paymentMethod?: string;
}) {
  const { name, email, courses, orderId, totalPaid, paymentMethod } = params;

  const courseRows = courses.map(c => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:#0F172A;">${c.title}</td>
      <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;">${c.levelName}</td>
      <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;text-align:right;">${formatCLP(c.price)}</td>
    </tr>
  `).join("");

  const html = wrapHtml("Pago confirmado — ProgramBI", `
    <div style="text-align:center;padding:10px 0 28px;">
      <div style="width:64px;height:64px;background:linear-gradient(135deg,#10B981,#059669);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="font-size:30px;line-height:1;">✓</span>
      </div>
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#0F172A;">¡Pago confirmado!</h1>
      <p style="margin:0;font-size:15px;color:#475569;">Tu inscripción ha sido procesada exitosamente.</p>
    </div>

    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:16px 20px;margin-bottom:24px;text-align:center;">
      <div style="font-size:11px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Orden N°</div>
      <div style="font-size:18px;font-weight:900;color:#166534;font-family:monospace;">${orderId}</div>
    </div>

    <table style="width:100%;">
      <thead>
        <tr>
          <th style="text-align:left;font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;">Curso</th>
          <th style="text-align:left;font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;">Nivel</th>
          <th style="text-align:right;font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;">Precio</th>
        </tr>
      </thead>
      <tbody>${courseRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding-top:12px;font-size:15px;font-weight:700;color:#0F172A;">Total pagado</td>
          <td style="padding-top:12px;font-size:18px;font-weight:900;color:#1890FF;text-align:right;">${formatCLP(totalPaid)}</td>
        </tr>
      </tfoot>
    </table>

    ${paymentMethod ? `<p style="font-size:13px;color:#94A3B8;margin-top:8px;text-align:right;">Pagado con ${paymentMethod}</p>` : ""}

    <div style="background:linear-gradient(135deg,#EFF6FF,#EEF2FF);border-radius:12px;padding:20px 24px;margin-top:28px;">
      <div style="font-size:13px;font-weight:700;color:#1D4ED8;margin-bottom:8px;">📌 Próximos pasos</div>
      <ol style="margin:0;padding-left:18px;font-size:13px;color:#3730A3;line-height:1.8;">
        <li>Recibirás un correo con el acceso y la fecha de inicio de clases.</li>
        <li>Únete a la comunidad ProgramBI para conectar con otros estudiantes.</li>
        <li>Prepara tu ambiente de trabajo siguiendo nuestra guía de instalación.</li>
      </ol>
    </div>

    <div style="text-align:center;margin-top:28px;">
      <a href="https://programbi.com/comunidad" style="display:inline-block;background:linear-gradient(135deg,#1890FF,#4338ca);color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:12px;">
        Ir a mi área de estudiante →
      </a>
    </div>
  `);

  await sendEmail({
    to: email,
    toName: name,
    subject: "🎉 ¡Pago confirmado! Tu inscripción en ProgramBI",
    html,
    text: `¡Hola ${name}! Tu pago fue confirmado. Total: ${formatCLP(totalPaid)}. Orden: ${orderId}. Cursos: ${courses.map(c => c.title).join(", ")}.`,
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
