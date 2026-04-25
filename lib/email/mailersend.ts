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

function buildQuoteEmailHtml(nombre: string) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Tu Cotización en ProgramBI</title>
    <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #f3f4f6; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        h1, h2, h3, p { margin: 0; padding: 0; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-top: 30px; padding-bottom: 40px; }
        .main-container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02); }
        @media screen and (max-width: 600px) {
            .wrapper { padding-top: 0; padding-bottom: 0; }
            .main-container { border-radius: 0; border: none; width: 100% !important; }
            .pad-mobile { padding-left: 20px !important; padding-right: 20px !important; }
            .title-h1 { font-size: 24px !important; }
            .stack-table { width: 100% !important; display: block !important; }
            .course-price-box { text-align: left !important; padding-top: 10px !important; }
        }
    </style>
</head>
<body>
    <div style="display: none; font-size: 1px; color: #f3f4f6; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Descubre nuestros programas 100% aplicados al mercado laboral. Cotización y fechas disponibles para ti.
    </div>
    <div class="wrapper">
        <center>
            <table class="main-container" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="background-color: #ffffff;">
                <tr>
                    <td align="center" style="padding: 40px 40px 20px 40px;" class="pad-mobile">
                        <a href="https://www.programbi.com" target="_blank">
                            <img src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974" width="160" alt="ProgramBI" style="display: block; width: 160px; max-width: 100%; border: 0;" />
                        </a>
                    </td>
                </tr>
                <tr>
                    <td align="left" style="padding: 10px 40px 30px 40px;" class="pad-mobile">
                        <h1 class="title-h1" style="font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 15px; color: #0f172a;">
                            Hola ${nombre},
                        </h1>
                        <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
                            Gracias por tu interés en <strong>ProgramBI</strong>. Diseñamos cursos de programación y análisis de datos <strong>100% aplicados al mercado laboral actual</strong>.
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px;">
                            <tr>
                                <td style="padding: 15px 20px; font-size: 14px; line-height: 1.5; color: #334155;">
                                    <strong>Perfil de nuestros alumnos:</strong> Ingenieros, industriales, comerciales, administrativos, contadores, control de gestión, finanzas, operaciones y proyectos.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;" class="pad-mobile">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f172a; background-image: linear-gradient(to bottom right, #0f172a, #1e293b); border-radius: 16px;">
                            <tr>
                                <td align="center" style="padding: 40px 30px;">
                                    <span style="background-color: #fbbf24; color: #78350f; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 5px 12px; border-radius: 100px; display: inline-block; margin-bottom: 20px;">⭐ Recomendación para comenzar</span>
                                    <h2 style="font-size: 24px; color: #ffffff; font-weight: 900; margin-bottom: 10px; letter-spacing: -0.5px;">Pack Análisis de Datos (Nivel Básico)</h2>
                                    <p style="font-size: 15px; color: #94a3b8; margin-bottom: 25px; line-height: 1.5;">Python + Power BI + SQL Server<br><span style="font-size: 13px;">48 Horas • 3 Meses • Inicias con uno y continúas el resto.</span></p>
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                                        <tr><td align="center">
                                            <p style="font-size: 14px; color: #64748b; text-decoration: line-through; margin-bottom: 5px;">Valor Normal: $747.000</p>
                                            <p style="font-size: 36px; color: #38bdf8; font-weight: 900; line-height: 1; margin: 0;">$448.200 <span style="display:inline-block; font-size: 12px; background-color: #10b981; color: #ffffff; padding: 4px 8px; border-radius: 4px; vertical-align: middle; margin-left: 10px; font-weight: 800; letter-spacing: 0.5px;">-40% OFF</span></p>
                                        </td></tr>
                                    </table>
                                    <table align="center" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#2563eb" style="border-radius: 8px;">
                                        <a href="https://www.programbi.com/cursos/analisis-de-datos" target="_blank" style="font-size: 15px; font-weight: 800; color: #ffffff; text-decoration: none; padding: 16px 32px; display: inline-block; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">Ver Fechas del Pack</a>
                                    </td></tr></table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr><td align="center" style="padding: 0 40px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" style="background-color: #e2e8f0; font-size: 1px; line-height: 1px;">&nbsp;</td></tr></table></td></tr>
                <tr>
                    <td align="left" style="padding: 30px 40px 20px 40px;" class="pad-mobile">
                        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 5px;">Nivel Básico (16 Hrs c/u)</h2>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 25px;">Detalle si decides tomarlos de forma individual:</p>
                        ${buildCourseRow("Power BI Básico", "📅 Inicia: 19 de Mayo<br>⏰ Mar y Jue | 19:30 a 21:30", "$249.000", "Oferta: $199.200", "#eab308")}
                        ${buildCourseRow("SQL Server Básico", "📅 Inicia: 22 de Junio<br>⏰ Lun y Mié | 19:30 a 21:30", "$249.000", "Oferta: $199.200", "#ef4444")}
                        ${buildCourseRow("Python Básico", "📅 Inicia: 25 de Mayo<br>⏰ Lun y Mié | 19:30 a 21:30", "$249.000", "Oferta: $199.200", "#3b82f6")}
                    </td>
                </tr>
                <tr>
                    <td align="left" style="padding: 10px 40px 30px 40px;" class="pad-mobile">
                        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px;">Nivel Intermedio (16 Hrs c/u)</h2>
                        ${buildIntermediateRow("Power BI Intermedio", "📅 Inicia: 25 de Mayo | Lun y Mié")}
                        ${buildIntermediateRow("SQL Server Intermedio", "📅 Inicia: 22 de Junio | Lun y Mié")}
                        ${buildIntermediateRow("Python Intermedio", "📅 Inicia: 27 de Julio | Lun y Mié")}
                    </td>
                </tr>
                <tr>
                    <td align="left" style="background-color: #f8fafc; padding: 40px; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;" class="pad-mobile">
                        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 25px;">Metodología ProgramBI</h2>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            ${buildBenefitRow("Clases en vivo (Zoom):", "Acceso a las grabaciones en el campus virtual 24/7.")}
                            ${buildBenefitRow("Pagos Flexibles:", "Transferencia, Tarjeta de Crédito en cuotas o USD para extranjeros.")}
                            ${buildBenefitRow("Certificación:", "Aprobación mediante un proyecto 100% aplicable a tu trabajo real.")}
                            ${buildBenefitRow("Foco de valor:", "Automatizarás tus reportes diarios conectando SAP, SQL, Excel, APIs y Web.", true)}
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="left" style="padding: 40px;" class="pad-mobile">
                        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 5px;">Tu Equipo Docente</h2>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 25px;">Aprende directamente de líderes activos en la industria:</p>
                        ${buildDocenteRow("MO", "#eff6ff", "#2563eb", "Manuel Oliva", "Magíster Data Science UAI, docente universitario. Consultor Minero y Financiero.", "https://www.linkedin.com/in/manuelolivab/")}
                        ${buildDocenteRow("EB", "#f1f5f9", "#475569", "Emanuel Berrocal", "Ingeniero Civil Matemático U. de Chile. Portfolio Manager de Renta Fija en Banco Itaú.", "https://www.linkedin.com/in/emanuelberrocal/")}
                        ${buildDocenteRow("RV", "#f1f5f9", "#475569", "Rodrigo Vega", "Ingeniero Comercial U. de Chile. Analista de Business Intelligence en Infracommerce.", "https://www.linkedin.com/in/rodrigovega/", true)}
                    </td>
                </tr>
                <tr>
                    <td align="center" style="background-color: #1e293b; padding: 40px;" class="pad-mobile">
                        <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin-bottom: 15px;">Formación Corporativa (B2B)</h2>
                        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px; text-align: center;">Más de <strong>5.000 alumnos capacitados</strong> en 6 años. Cursos cerrados a empresas con malla adaptada y horarios a medida (Online o Presencial).</p>
                        <p style="font-size: 12px; color: #cbd5e1; line-height: 1.6; text-align: center; border-top: 1px solid #334155; padding-top: 20px;"><strong>Confían en nosotros:</strong> AngloAmerican, Copec, Deloitte, Banco de Chile, CMPC, AFP Cuprum, CENCOSUD, SQM, Superintendencia de Pensiones, Grupo CAP, entre otros.</p>
                    </td>
                </tr>
                <tr>
                    <td align="left" style="padding: 40px;" class="pad-mobile">
                        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 30px;">Cualquier duda respecto a temarios, postulación o medios de pago, estaré atento para ayudarte. Puedes responder directamente a este correo.</p>
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e2e8f0; padding-top: 30px;">
                            <tr>
                                <td width="70" valign="middle"><img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" width="55" alt="Manuel Oliva" style="border-radius: 50%; display: block;" /></td>
                                <td valign="middle">
                                    <p style="margin: 0 0 2px 0; font-size: 16px; font-weight: 800; color: #0f172a;">Manuel Oliva <a href="https://www.linkedin.com/in/manuelolivab/" style="font-size: 12px; font-weight: normal; margin-left: 5px; color: #2563eb; text-decoration: none;">[LinkedIn]</a></p>
                                    <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #2563eb;">Director ProgramBI Capacitaciones</p>
                                    <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; line-height: 1.4;">Magíster Data Science U. Adolfo Ibañez.<br>Docente Universitario de Postgrado.</p>
                                    <p style="margin: 0; font-size: 12px; font-weight: 600; color: #0f172a;"><a href="tel:+56935409699" style="color: #0f172a; text-decoration: none;">📞 +569 3540 9699</a> &nbsp;|&nbsp; <a href="https://www.programbi.com" style="color: #2563eb; text-decoration: none;">🌐 programbi.com</a></p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr><td align="center" style="padding: 20px 40px; font-size: 11px; color: #94a3b8; line-height: 1.5;">© ${new Date().getFullYear()} ProgramBI Capacitaciones. Todos los derechos reservados.<br>Has recibido este correo porque solicitaste información en nuestro sitio web.</td></tr>
            </table>
        </center>
    </div>
</body>
</html>`;
}

function buildCourseRow(title: string, schedule: string, originalPrice: string, offerPrice: string, color: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 15px;"><tr>
    <td width="3" style="background-color: ${color}; border-radius: 3px 0 0 3px;"></td>
    <td style="background-color: #fafaf9; border: 1px solid #f5f5f4; border-left: none; padding: 15px 20px; border-radius: 0 8px 8px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="stack-table" width="60%" valign="top">
          <h3 style="font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 4px;">${title}</h3>
          <p style="font-size: 13px; color: #475569;">${schedule}</p>
        </td>
        <td class="stack-table course-price-box" width="40%" valign="top" align="right">
          <p style="font-size: 12px; color: #94a3b8; text-decoration: line-through; margin-bottom: 2px;">${originalPrice}</p>
          <p style="font-size: 16px; font-weight: 800; color: #10b981;">${offerPrice}</p>
        </td>
      </tr></table>
    </td>
  </tr></table>`;
}

function buildIntermediateRow(title: string, schedule: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 15px;"><tr>
    <td width="3" style="background-color: #cbd5e1; border-radius: 3px 0 0 3px;"></td>
    <td style="background-color: #ffffff; border: 1px solid #e2e8f0; border-left: none; padding: 15px 20px; border-radius: 0 8px 8px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="stack-table" width="60%" valign="top">
          <h3 style="font-size: 15px; font-weight: 800; color: #334155; margin-bottom: 4px;">${title}</h3>
          <p style="font-size: 13px; color: #64748b;">${schedule}</p>
        </td>
        <td class="stack-table course-price-box" width="40%" valign="top" align="right">
          <p style="font-size: 15px; font-weight: 800; color: #2563eb;">Oferta: $199.200</p>
        </td>
      </tr></table>
    </td>
  </tr></table>`;
}

function buildBenefitRow(title: string, desc: string, isLast = false) {
  return `<tr>
    <td width="30" valign="top" ${!isLast ? 'style="padding-bottom: 15px;"' : ''}><img src="https://cdn-icons-png.flaticon.com/512/5610/5610944.png" width="20" style="display:block; opacity: 0.8;" alt="Check" /></td>
    <td ${!isLast ? 'style="padding-bottom: 15px; font-size: 14px; color: #475569; line-height: 1.5;"' : 'style="font-size: 14px; color: #475569; line-height: 1.5;"'}><strong>${title}</strong> ${desc}</td>
  </tr>`;
}

function buildDocenteRow(initials: string, bgColor: string, textColor: string, name: string, desc: string, linkedin: string, isLast = false) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" ${!isLast ? 'style="margin-bottom: 20px;"' : ''}>
    <tr>
      <td width="40" valign="top"><div style="background-color: ${bgColor}; color: ${textColor}; width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 800; font-size: 14px;">${initials}</div></td>
      <td valign="top">
        <p style="margin: 0 0 2px 0; font-size: 15px; font-weight: 800; color: #0f172a;">${name} <a href="${linkedin}" style="font-size: 12px; font-weight: 600; color: #2563eb; margin-left: 5px; text-decoration: none;">[LinkedIn]</a></p>
        <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.5;">${desc}</p>
      </td>
    </tr>
  </table>`;
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
  const { name, email, company, courses, employeeCount } = params;

  const courseList = courses.map(c => `<li style="margin:4px 0;color:#334155;">${c}</li>`).join("");

  const html = wrapHtml("Cotización Empresarial — ProgramBI", `
    <div style="display:inline-block;background:#FEF3C7;color:#92400E;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;">
      🏢 Cotización Empresarial
    </div>
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#0F172A;">¡Hola, ${name}!</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
      Gracias por contactarnos desde <strong>${company}</strong>. Estamos preparando una propuesta personalizada para tu equipo. En breve un ejecutivo de cuenta se pondrá en contacto contigo.
    </p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;">Resumen de tu solicitud</div>
      <table style="width:100%;font-size:14px;">
        <tr><td style="color:#64748B;padding:4px 0;width:140px;">Empresa</td><td style="font-weight:600;color:#0F172A;">${company}</td></tr>
        ${employeeCount ? `<tr><td style="color:#64748B;padding:4px 0;">Personas a capacitar</td><td style="font-weight:600;color:#0F172A;">${employeeCount}</td></tr>` : ""}
      </table>
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid #E2E8F0;">
        <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Programas de interés</div>
        <ul style="margin:0;padding-left:18px;">${courseList}</ul>
      </div>
    </div>

    <div style="background:linear-gradient(135deg,#EFF6FF,#EEF2FF);border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <div style="font-size:13px;font-weight:700;color:#1D4ED8;margin-bottom:8px;">🎯 Lo que incluye tu propuesta</div>
      <ul style="margin:0;padding-left:18px;font-size:13px;color:#3730A3;line-height:1.8;">
        <li>Propuesta económica a medida</li>
        <li>Modalidad de clases (online / presencial / híbrida)</li>
        <li>Calendario flexible para tu equipo</li>
        <li>Descuentos por volumen de participantes</li>
      </ul>
    </div>

    <a href="mailto:${ADMIN_EMAIL}" style="display:inline-block;background:linear-gradient(135deg,#1890FF,#4338ca);color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:12px;">
      Contactar directamente →
    </a>
  `);

  await sendEmail({
    to: email,
    toName: name,
    subject: "✅ Cotización empresarial recibida — ProgramBI",
    html,
    text: `Hola ${name}, gracias por contactarnos desde ${company}. Te contactaremos pronto con una propuesta personalizada.`,
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
