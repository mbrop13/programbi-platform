import { SITE_URL } from "@/lib/seo";
import { formatClp } from "@/lib/referrals/format";

function wrap(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f3f3f0;font-family:Inter,Segoe UI,Arial,sans-serif;color:#171716;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f0;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:560px;width:100%;border:1px solid rgba(23,23,22,0.08);">
        <tr>
          <td style="padding:28px 36px 12px;border-bottom:1px solid rgba(23,23,22,0.08);">
            <div style="font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:#8c8b85;font-weight:600;">ProgramBI · Referidos</div>
            <div style="font-size:22px;font-weight:700;margin-top:8px;letter-spacing:-0.03em;">${escapeHtml(title)}</div>
          </td>
        </tr>
        <tr><td style="padding:28px 36px 32px;font-size:15px;line-height:1.65;color:#5f5e59;">${body}</td></tr>
        <tr>
          <td style="padding:18px 36px;background:#f7f7f4;font-size:12px;color:#8c8b85;text-align:center;">
            Comisión 15% de cursos y capacitaciones a empresas, pagada al cobro. Clawback 60 días.<br/>
            <a href="${SITE_URL}/referidos/app" style="color:#0f7a4d;text-decoration:none;">Abrir panel</a>
            · <a href="${SITE_URL}/referidos/terminos" style="color:#0f7a4d;text-decoration:none;">Reglas</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cta(href: string, label: string): string {
  return `<p style="margin:28px 0 0;">
    <a href="${href}" style="display:inline-block;background:#171716;color:#f7f7f4;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;font-size:14px;">${escapeHtml(label)}</a>
  </p>`;
}

export async function renderIntroReceivedEmail(params: {
  referrerName: string;
  prospectName: string;
  prospectCompany: string;
}): Promise<string> {
  try {
    const { render } = await import("@react-email/render");
    const { IntroReceivedEmail } = await import("./intro-received");
    return await render(
      IntroReceivedEmail({
        referrerName: params.referrerName,
        prospectName: params.prospectName,
        prospectCompany: params.prospectCompany,
        panelUrl: `${SITE_URL}/referidos/app`,
      })
    );
  } catch {
    return wrap(
      "Intro recibida",
      `<p>Hola ${escapeHtml(params.referrerName)},</p>
       <p>Recibimos tu intro de <strong style="color:#171716;">${escapeHtml(params.prospectName)}</strong> en ${escapeHtml(params.prospectCompany)}.</p>
       <p>El equipo la revisa antes de calificarla. Las intros no califican solas: no es un programa de links para spamear.</p>
       ${cta(`${SITE_URL}/referidos/app`, "Ver en el panel")}`
    );
  }
}

export async function renderStatusChangeEmail(params: {
  referrerName: string;
  prospectName: string;
  prospectCompany: string;
  statusLabel: string;
}): Promise<string> {
  try {
    const { render } = await import("@react-email/render");
    const { StatusChangeEmail } = await import("./status-change");
    return await render(
      StatusChangeEmail({
        ...params,
        panelUrl: `${SITE_URL}/referidos/app`,
      })
    );
  } catch {
    return wrap(
      params.statusLabel,
      `<p>Hola ${escapeHtml(params.referrerName)},</p>
       <p>Tu intro de <strong style="color:#171716;">${escapeHtml(params.prospectName)}</strong> (${escapeHtml(params.prospectCompany)}) ahora está en <strong>${escapeHtml(params.statusLabel)}</strong>.</p>
       ${cta(`${SITE_URL}/referidos/app`, "Ver detalle")}`
    );
  }
}

export async function renderCommissionPaidEmail(params: {
  referrerName: string;
  prospectCompany: string;
  amountClp: number;
  paymentRef: string;
}): Promise<string> {
  try {
    const { render } = await import("@react-email/render");
    const { CommissionPaidEmail } = await import("./commission-paid");
    return await render(
      CommissionPaidEmail({
        ...params,
        amountLabel: formatClp(params.amountClp),
        panelUrl: `${SITE_URL}/referidos/app/comisiones`,
      })
    );
  } catch {
    return wrap(
      "Comisión pagada",
      `<p>Hola ${escapeHtml(params.referrerName)},</p>
       <p>Transferimos <strong style="color:#0f7a4d;font-size:20px;">${formatClp(params.amountClp)}</strong> por la venta de ${escapeHtml(params.prospectCompany)}.</p>
       <p>Referencia: ${escapeHtml(params.paymentRef)}. Clawback 60 días si hay nota de crédito.</p>
       ${cta(`${SITE_URL}/referidos/app/comisiones`, "Ver comisiones")}`
    );
  }
}

export async function renderWelcomeReferrerEmail(params: {
  name: string;
  code: string;
}): Promise<string> {
  try {
    const { render } = await import("@react-email/render");
    const { WelcomeReferrerEmail } = await import("./welcome");
    return await render(
      WelcomeReferrerEmail({
        name: params.name,
        code: params.code,
        panelUrl: `${SITE_URL}/referidos/app`,
        trackUrl: `${SITE_URL}/cursos?ref=${encodeURIComponent(params.code)}`,
      })
    );
  } catch {
    return wrap(
      "Tu cuenta de referidor está lista",
      `<p>Hola ${escapeHtml(params.name)},</p>
       <p>Ya puedes invitar a un amigo a un curso o a una empresa a una capacitación. Nosotros cerramos; tú cobras 15% al cobro.</p>
       <p>Tu código (opcional, 90 días en cookie): <strong>${escapeHtml(params.code)}</strong></p>
       ${cta(`${SITE_URL}/referidos/app/nueva`, "Enviar primera intro")}`
    );
  }
}
