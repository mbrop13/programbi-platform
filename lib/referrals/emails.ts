import { SITE_URL } from "@/lib/seo";
import { formatClp } from "./format";
import { STATUS_LABELS } from "./status";
import type { ReferralStatus } from "./types";
import {
  renderCommissionPaidEmail,
  renderIntroReceivedEmail,
  renderStatusChangeEmail,
  renderWelcomeReferrerEmail,
} from "@/emails/referrals/render";

const ADMIN_EMAIL = process.env.SES_ADMIN_EMAIL || "contacto@programbi.cl";

async function sendHtml(params: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  try {
    const { default: nodemailer } = await import("nodemailer");
    const SMTP_HOST = process.env.SES_SMTP_HOST || "email-smtp.us-east-1.amazonaws.com";
    const SMTP_PORT = parseInt(process.env.SES_SMTP_PORT || "465", 10);
    const SMTP_USER = process.env.SES_SMTP_USER;
    const SMTP_PASS = process.env.SES_SMTP_PASS;
    const FROM_EMAIL = process.env.SES_FROM_EMAIL || "noreply@programbi.com";
    const FROM_NAME = process.env.SES_FROM_NAME || "ProgramBI";
    if (!SMTP_USER || !SMTP_PASS) {
      console.warn("[referrals/email] SMTP no configurado — skip", params.subject);
      return;
    }
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: params.toName ? `"${params.toName}" <${params.to}>` : params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    });
  } catch (err) {
    console.error("[referrals/email]", err);
  }
}

export async function notifyIntroReceived(params: {
  referrerName: string;
  referrerEmail: string;
  prospectName: string;
  prospectCompany: string;
}): Promise<void> {
  const html = await renderIntroReceivedEmail(params);
  await sendHtml({
    to: params.referrerEmail,
    toName: params.referrerName,
    subject: `Intro recibida: ${params.prospectName} · ${params.prospectCompany}`,
    html,
    text: `Hola ${params.referrerName}, recibimos tu intro de ${params.prospectName} (${params.prospectCompany}). El equipo la revisa antes de calificarla. Panel: ${SITE_URL}/referidos/app`,
  });
  await sendHtml({
    to: ADMIN_EMAIL,
    subject: `[Referidos] Nueva intro: ${params.prospectName} · ${params.prospectCompany}`,
    html,
    text: `Nueva intro de ${params.referrerName}: ${params.prospectName} (${params.prospectCompany}).`,
  });
}

export async function notifyStatusChange(params: {
  referrerName: string;
  referrerEmail: string;
  prospectName: string;
  prospectCompany: string;
  status: ReferralStatus;
}): Promise<void> {
  if (params.status !== "qualified" && params.status !== "won") return;
  const html = await renderStatusChangeEmail({
    ...params,
    statusLabel: STATUS_LABELS[params.status],
  });
  const subject =
    params.status === "won"
      ? `Pack cerrado: ${params.prospectCompany} — comisión 15% generada`
      : `Intro calificada: ${params.prospectName} · ${params.prospectCompany}`;
  await sendHtml({
    to: params.referrerEmail,
    toName: params.referrerName,
    subject,
    html,
    text: `Hola ${params.referrerName}, tu intro de ${params.prospectName} (${params.prospectCompany}) pasó a ${STATUS_LABELS[params.status]}. ${SITE_URL}/referidos/app`,
  });
}

export async function notifyCommissionPaid(params: {
  referrerName: string;
  referrerEmail: string;
  prospectCompany: string;
  amountClp: number;
  paymentRef: string;
}): Promise<void> {
  const html = await renderCommissionPaidEmail(params);
  await sendHtml({
    to: params.referrerEmail,
    toName: params.referrerName,
    subject: `Comisión pagada: ${formatClp(params.amountClp)}`,
    html,
    text: `Hola ${params.referrerName}, transferimos ${formatClp(params.amountClp)} por el Pack de ${params.prospectCompany}. Ref: ${params.paymentRef}.`,
  });
}

export async function notifyWelcomeReferrer(params: {
  name: string;
  email: string;
  code: string;
}): Promise<void> {
  const html = await renderWelcomeReferrerEmail(params);
  await sendHtml({
    to: params.email,
    toName: params.name,
    subject: "Bienvenido al programa de referidos ProgramBI",
    html,
    text: `Hola ${params.name}, tu cuenta de referidor está lista. Código: ${params.code}. ${SITE_URL}/referidos/app`,
  });
}
