/**
 * Premium B2B Enterprise Email Template — ProgramBI 2.0
 * Design System: Paper & Ink (Minimalist, modern, high-contrast, corporate).
 */

import { escapeHtml } from "@/lib/security/escape";

export function buildEnterpriseEmailHtml(nombre: string, empresa: string): string {
  // A-15 / V5.4.7 (OWASP ASVS L3): escape user-controlled fields before
  // interpolating into the HTML email body to prevent HTML/CSS injection.
  const safeNombre = escapeHtml(nombre);
  const safeEmpresa = escapeHtml(empresa);
  const year = new Date().getFullYear();

  const logos = [
    { name: "Deloitte", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-a53761b3-b596-4a00-bbe2-a09ac193d34e.png?v=1720127578" },
    { name: "Cencosud", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-cc9e718a-0ff7-4910-997b-16c522ad5f24.png?v=1720127509" },
    { name: "SQM", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Sociedad_Quimica_y_Minera_logo_svg.png?v=1750694554" },
    { name: "BCI", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Bci_Logotype_svg.png?v=1750694554" },
    { name: "Tottus", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-532dc851-5dac-4ef4-a6a0-7fb6b41a71f2.png?v=1720130366" },
    { name: "BASF", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-b42b5f15-4107-4fe3-bde0-4c088b7069e2.png?v=1720127388" },
    { name: "Fonasa", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-6252432d-05a7-4589-8b77-7feec2a82397.png?v=1720127456" },
    { name: "CGE", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-e02996d2-2ec9-4f2c-8ed7-fa510b5d49b5.png?v=1720127417" },
  ];

  const logoImgs = logos.map((l) =>
    `<img src="${l.url}" alt="${l.name}" style="height:24px;width:auto;margin:8px 14px;display:inline-block;vertical-align:middle;opacity:0.75;filter:grayscale(100%);"/>`
  ).join("");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Capacitación Corporativa — ProgramBI</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0; mso-table-rspace: 0; border-collapse: collapse; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #F3F3F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    h1, h2, h3, p { margin: 0; padding: 0; }
    @media screen and (max-width: 620px) {
      .outer { padding: 12px 8px !important; }
      .card { border-radius: 16px !important; }
      .mp { padding-left: 20px !important; padding-right: 20px !important; }
      .ms { display: block !important; width: 100% !important; margin-bottom: 12px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F3F0;">
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; color: #F3F3F0;">
    ${safeNombre}, hemos recibido tu solicitud de capacitación corporativa en ProgramBI. Pronto te contactaremos.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F3F3F0;">
    <tr>
      <td align="center" style="padding: 36px 16px 50px;" class="outer">
        <table width="600" cellpadding="0" cellspacing="0" border="0" class="card" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(23, 23, 22, 0.04); border: 1px solid #E5E5E0;">

          <!-- HEADER -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #EAEAE6;" class="mp">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">
                    <a href="https://www.programbi.com" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974" width="140" alt="ProgramBI" style="display: block; width: 140px;"/>
                    </a>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; background-color: #EBEBE6; color: #171716; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; padding: 5px 12px; border-radius: 9999px;">
                      División Empresas
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- SALUDO -->
          <tr>
            <td style="padding: 36px 40px 20px;" class="mp">
              <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 900; color: #171716; letter-spacing: -0.5px; margin-bottom: 12px;">
                Hola ${safeNombre},
              </h1>
              <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14.5px; line-height: 1.65; color: #5F5E59; margin: 0;">
                <strong style="color: #171716;">Hemos recibido exitosamente tu solicitud de capacitación${safeEmpresa ? ` desde ${safeEmpresa}` : ""}.</strong> Gracias por confiar en nosotros para liderar la formación y aceleración tecnológica de tu equipo.
              </p>
            </td>
          </tr>

          <!-- CALLOUT DESTACADO -->
          <tr>
            <td style="padding: 0 40px 28px;" class="mp">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left: 4px solid #171716; background-color: #F7F7F4; border-radius: 12px; border-top: 1px solid #E5E5E0; border-right: 1px solid #E5E5E0; border-bottom: 1px solid #E5E5E0;">
                <tr>
                  <td style="padding: 18px 22px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="28" valign="top" style="font-size: 18px; padding-right: 10px;">📞</td>
                        <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13.5px; color: #171716; line-height: 1.55;">
                          Uno de nuestros directores académicos analizará tus requerimientos y <strong>te contactará a la brevedad</strong> con una propuesta técnico-económica personalizada para tu operación.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- LOGOS CLIENTES CORPORATIVOS -->
          <tr>
            <td style="padding: 0 40px 28px; text-align: center;" class="mp">
              <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 800; color: #8C8B85; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;">
                Más de 5.000 profesionales capacitados
              </p>
              <div style="line-height: 2.8; text-align: center;">${logoImgs}</div>
              <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #8C8B85; line-height: 1.5; margin-top: 12px;">
                También: AngloAmerican · Copec · Chilevisión · Grupo CAP · Superintendencia de Pensiones · Pucobre · Midea
              </p>
            </td>
          </tr>

          <!-- SEPARADOR -->
          <tr>
            <td style="padding: 0 40px;"><div style="height: 1px; background-color: #EAEAE6;"></div></td>
          </tr>

          <!-- BENEFICIOS B2B -->
          <tr>
            <td style="padding: 32px 40px;" class="mp">
              <h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 800; color: #171716; margin-bottom: 20px; letter-spacing: -0.2px;">
                El Estándar B2B ProgramBI
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${b2bRow("Programas Cerrados a Medida", "Adaptamos el temario y los casos de estudio para resolver los desafíos específicos de tu industria.")}
                ${b2bRow("Flexibilidad de Ejecución", "Modalidad en vivo por Zoom o presencial en tus oficinas, en el horario que mejor se adapte a tu equipo.")}
                ${b2bRow("Evaluación & Reportes de Asistencia", "Entregamos métricas de progreso detalladas, informes de aprovechamiento y certificaciones validadas.")}
                ${b2bRow("Conexión a Datos Reales", "Entrenamos a tu equipo para conectarse a SAP, APIs, SQL Server y automatizar tareas repetitivas.", true)}
              </table>
            </td>
          </tr>

          <!-- SEPARADOR -->
          <tr>
            <td style="padding: 0 40px;"><div style="height: 1px; background-color: #EAEAE6;"></div></td>
          </tr>

          <!-- STACK TECNOLÓGICO -->
          <tr>
            <td style="padding: 32px 40px;" class="mp">
              <h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 800; color: #171716; margin-bottom: 20px; text-align: center; letter-spacing: -0.2px;">
                Áreas de Formación Corporativa
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${techCard("📊", "Power BI", "Dashboards ejecutivos e inteligencia de negocios.", "#D97706", "#FEF3C7")}
                  <td width="3%"></td>
                  ${techCard("🗄️", "SQL Server", "Extracción masiva, consultas y cruce seguro de bases de datos.", "#DC2626", "#FEE2E2")}
                  <td width="3%"></td>
                  ${techCard("🐍", "Python + IA", "Automatización de procesos, analítica predictiva e IA.", "#2563EB", "#EFF6FF")}
                </tr>
              </table>
            </td>
          </tr>

          <!-- SEPARADOR -->
          <tr>
            <td style="padding: 0 40px;"><div style="height: 1px; background-color: #EAEAE6;"></div></td>
          </tr>

          <!-- FIRMA & CONTACTO -->
          <tr>
            <td style="padding: 32px 40px;" class="mp">
              <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #5F5E59; line-height: 1.6; margin-bottom: 20px;">
                Si deseas agendar una reunión ejecutiva preliminar o coordinar por WhatsApp:
              </p>

              <!-- BOTÓN CTA WHATSAPP -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <a href="https://wa.me/56935409699?text=Hola%2C%20solicit%C3%A9%20informaci%C3%B3n%20de%20capacitaci%C3%B3n%20empresarial%20en%20ProgramBI" target="_blank" style="display: inline-block; background-color: #171716; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13.5px; font-weight: 700; text-decoration: none; padding: 14px 26px; border-radius: 9999px; letter-spacing: 0.2px;">
                      💬 Coordinar con Director Académico por WhatsApp →
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="48" valign="top" style="padding-right: 14px;">
                    <div style="width: 44px; height: 44px; border-radius: 12px; background-color: #171716; text-align: center; line-height: 44px; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 15px;">
                      MO
                    </div>
                  </td>
                  <td valign="top">
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 800; color: #171716;">Manuel Oliva</p>
                    <p style="margin: 2px 0 3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; color: #5F5E59;">Director Académico ProgramBI</p>
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #8C8B85;">Magíster Data Science UAI · Consultor de Empresas</p>
                    <p style="margin: 6px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #171716;">
                      <a href="tel:+56935409699" style="color: #5F5E59; text-decoration: none; font-weight: 600;">+56 9 3540 9699</a>
                      <span style="color: #D4D4D0; margin: 0 6px;">|</span>
                      <a href="https://www.programbi.com" style="color: #171716; text-decoration: none; font-weight: 700;">programbi.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #F7F7F4; padding: 24px 40px; border-top: 1px solid #EAEAE6;" class="mp">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #8C8B85; line-height: 1.6;">
                    © ${year} ProgramBI · División Empresas<br/>
                    Recibiste este correo porque solicitaste información corporativa en nuestro sitio web.
                  </td>
                  <td align="right" valign="top">
                    <a href="https://www.programbi.com/cursos" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #171716; text-decoration: none; font-weight: 700;">
                      Ver catálogo →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function b2bRow(title: string, desc: string, last = false) {
  return `<tr>
    <td width="26" valign="top" style="padding-bottom: ${last ? "0" : "14"}px; padding-right: 12px;">
      <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #DCFCE7; text-align: center; line-height: 20px; font-size: 11px; color: #166534; font-weight: 800;">✓</div>
    </td>
    <td style="padding-bottom: ${last ? "0" : "14"}px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #5F5E59; line-height: 1.55;">
      <strong style="color: #171716;">${title}:</strong> ${desc}
    </td>
  </tr>`;
}

function techCard(icon: string, title: string, desc: string, borderColor: string, badgeBg: string) {
  return `<td class="ms" width="31%" valign="top" align="center" style="background-color: #F7F7F4; border: 1px solid #E5E5E0; border-top: 3px solid ${borderColor}; border-radius: 12px; padding: 20px 12px;">
    <div style="font-size: 22px; margin-bottom: 8px;">${icon}</div>
    <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 800; color: #171716; margin-bottom: 4px;">${title}</h3>
    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #5F5E59; line-height: 1.45;">${desc}</p>
  </td>`;
}


