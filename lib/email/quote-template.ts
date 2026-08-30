/**
 * Premium Quote Email Template — ProgramBI 2.0
 * Generates the full HTML for the quotation confirmation email.
 * Design System: Paper & Ink (Minimalist, modern, high-contrast, responsive).
 */

import { escapeHtml } from "@/lib/security/escape";

export interface EmailCourseItem {
  slug: string;
  title: string;
  levelName: string;
  durationHours: number;
  startDate: string;
  originalPrice: string;
  finalPrice: string;
  hasDiscount: boolean;
  color: string;
}

export interface EmailPackInfo {
  showPackRecommendation: boolean;
  origPrice: string;
  offerPrice: string;
  savingPercent: number;
  url: string;
}

// Helpers para colores según el curso en el nuevo diseño
function getCourseTheme(slug: string, fallbackColor: string) {
  const s = slug.toLowerCase();
  if (s.includes("power-bi") || s.includes("powerbi")) {
    return { badgeBg: "#FEF3C7", badgeText: "#92400E", borderAccent: "#D97706" };
  }
  if (s.includes("sql")) {
    return { badgeBg: "#FEE2E2", badgeText: "#991B1B", borderAccent: "#DC2626" };
  }
  if (s.includes("python")) {
    return { badgeBg: "#EFF6FF", badgeText: "#1E40AF", borderAccent: "#2563EB" };
  }
  if (s.includes("excel")) {
    return { badgeBg: "#F0FDF4", badgeText: "#166534", borderAccent: "#16A34A" };
  }
  if (s.includes("miner")) {
    return { badgeBg: "#FEF3C7", badgeText: "#78350F", borderAccent: "#B45309" };
  }
  if (s.includes("finan")) {
    return { badgeBg: "#EFF6FF", badgeText: "#1E3A8A", borderAccent: "#1E3A8A" };
  }
  if (s.includes("ia") || s.includes("machine") || s.includes("copilot")) {
    return { badgeBg: "#EDE9FE", badgeText: "#5B21B6", borderAccent: "#7C3AED" };
  }
  if (s.includes("automate")) {
    return { badgeBg: "#E0F2FE", badgeText: "#075985", borderAccent: "#0284C7" };
  }
  return { badgeBg: "#EBEBE6", badgeText: "#171716", borderAccent: fallbackColor || "#171716" };
}

export function buildQuoteEmailHtml(
  nombre: string,
  selectedCourses: EmailCourseItem[],
  recommendedCourses: EmailCourseItem[],
  packRecommendation: EmailPackInfo
): string {
  // A-15 / V5.4.7 (OWASP ASVS L3): escape user-controlled string before
  // interpolating into the HTML email body to prevent HTML/CSS injection.
  const safeNombre = escapeHtml(nombre);
  const year = new Date().getFullYear();

  // Renderizar las tarjetas de cursos seleccionados por el usuario
  const courseCardsHtml = selectedCourses.map((c) => {
    const theme = getCourseTheme(c.slug, c.color);
    return `
      <!-- Curso Card: ${c.title} -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px; border-collapse: separate;">
        <tr>
          <td style="background-color: #FFFFFF; border: 1px solid #E5E5E0; border-left: 4px solid ${theme.borderAccent}; border-radius: 14px; padding: 20px 22px; box-shadow: 0 2px 8px rgba(23, 23, 22, 0.03);">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="top" class="ms" style="padding-bottom: 8px;">
                  <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; background-color: ${theme.badgeBg}; color: ${theme.badgeText}; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; padding: 4px 10px; border-radius: 9999px;">
                      ${c.levelName} · ${c.durationHours} HRS
                    </span>
                  </div>
                  <h3 style="margin: 0 0 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 800; color: #171716; line-height: 1.3;">
                    ${c.title}
                  </h3>
                  <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #5F5E59; line-height: 1.5;">
                    <strong style="color: #171716;">📅 Horario & Clases:</strong> ${c.startDate}
                  </p>
                </td>
                <td valign="top" align="right" class="ms" style="width: 140px; min-width: 140px; text-align: right;">
                  ${c.hasDiscount ? `<p style="margin: 0 0 2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #8C8B85; text-decoration: line-through; font-weight: 500;">${c.originalPrice}</p>` : ""}
                  <p style="margin: 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 21px; font-weight: 900; color: #171716; line-height: 1;">
                    ${c.finalPrice}
                  </p>
                  <span style="display: inline-block; background-color: #DCFCE7; color: #166534; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 8px; border-radius: 9999px;">
                    Matrícula Gratis
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  }).join("");

  // Renderizar la sección inteligente del Pack Recomendado
  let packRecommendationHtml = "";
  if (packRecommendation.showPackRecommendation) {
    packRecommendationHtml = `
      <!-- Banner Pack Recomendado (Especialización) -->
      <tr>
        <td style="padding: 8px 40px 28px;" class="mp">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #171716; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 32px rgba(23, 23, 22, 0.18);">
            <tr>
              <td style="padding: 34px 28px; text-align: center;">
                <div style="display: inline-block; background-color: #F59E0B; color: #78350F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; padding: 5px 14px; border-radius: 9999px; margin-bottom: 16px;">
                  ⚡ Oportunidad Especial de Ahorro
                </div>
                <h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 23px; color: #FFFFFF; font-weight: 900; margin: 0 0 8px; letter-spacing: -0.5px;">
                  Pack Especialización en Análisis de Datos
                </h2>
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #A1A1AA; margin: 0 0 20px; line-height: 1.5;">
                  SQL Server + Power BI + Python <br/>
                  <span style="color: #FCD34D; font-weight: 700;">48 Horas de formación completa · Clases en vivo vía Zoom</span>
                </p>
                
                <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 22px;">
                  <tr>
                    <td align="center">
                      <p style="margin: 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #71717A; text-decoration: line-through;">
                        Precio regular individual: ${packRecommendation.origPrice}
                      </p>
                      <p style="margin: 0 0 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 34px; color: #FFFFFF; font-weight: 900; line-height: 1;">
                        ${packRecommendation.offerPrice}
                      </p>
                      <span style="display: inline-block; background-color: #064E3B; color: #34D399; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; padding: 4px 12px; border-radius: 9999px;">
                        ¡AHORRAS UN ${packRecommendation.savingPercent}% INSCRIPCIÓN COMPLETA!
                      </span>
                    </td>
                  </tr>
                </table>

                <table align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="background-color: #FFFFFF; border-radius: 9999px;">
                      <a href="${packRecommendation.url}" target="_blank" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; color: #171716; text-decoration: none; padding: 14px 28px; display: inline-block; letter-spacing: 0.3px;">
                        Ver Fechas y Descuentos del Pack →
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }

  // Renderizar la sección inteligente de Cursos Recomendados
  let recommendedCoursesHtml = "";
  if (recommendedCourses && recommendedCourses.length > 0) {
    const recommendedCardsHtml = recommendedCourses.map((c) => {
      const theme = getCourseTheme(c.slug, c.color);
      return `
        <!-- Curso Recomendado: ${c.title} -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px; border-collapse: separate;">
          <tr>
            <td style="background-color: #F7F7F4; border: 1px solid #E5E5E0; border-radius: 12px; padding: 16px 18px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="top" class="ms" style="padding-bottom: 6px;">
                    <div style="margin-bottom: 6px;">
                      <span style="display: inline-block; background-color: ${theme.badgeBg}; color: ${theme.badgeText}; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 8px; border-radius: 9999px;">
                        ${c.levelName} · ${c.durationHours} HRS
                      </span>
                    </div>
                    <h4 style="margin: 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 800; color: #171716; line-height: 1.2;">
                      ${c.title}
                    </h4>
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #5F5E59;">
                      📅 Inicio: <strong style="color: #171716;">${c.startDate}</strong>
                    </p>
                  </td>
                  <td valign="middle" align="right" class="ms" style="width: 130px; min-width: 130px; text-align: right;">
                    ${c.hasDiscount ? `<span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #8C8B85; text-decoration: line-through; font-weight: 500; margin-right: 6px;">${c.originalPrice}</span>` : ""}
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 900; color: #171716;">
                      ${c.finalPrice}
                    </span>
                    <div style="margin-top: 6px;">
                      <a href="https://www.programbi.com/cursos/${c.slug}" target="_blank" style="display: inline-block; background-color: #FFFFFF; border: 1px solid #D4D4D0; color: #171716; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 700; text-decoration: none; padding: 5px 12px; border-radius: 9999px;">
                        Ver Temario →
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
    }).join("");

    recommendedCoursesHtml = `
      <!-- SECCIÓN RECOMENDADOS -->
      <tr>
        <td style="padding: 12px 40px 24px;" class="mp">
          <div style="height: 1px; background-color: #E5E5E0; margin-bottom: 20px;"></div>
          <h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 800; color: #8C8B85; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px;">
            Próximos Inicios Recomendados
          </h2>
          ${recommendedCardsHtml}
        </td>
      </tr>
    `;
  }

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Tu Cotización — ProgramBI</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0; mso-table-rspace: 0; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #F3F3F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    h1, h2, h3, h4, p { margin: 0; padding: 0; }
    @media screen and (max-width: 620px) {
      .outer { padding: 12px 8px !important; }
      .card { border-radius: 16px !important; }
      .mp { padding-left: 20px !important; padding-right: 20px !important; }
      .ms { display: block !important; width: 100% !important; text-align: left !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F3F0;">
  <!-- PREHEADER OCULTO -->
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; color: #F3F3F0;">
    ${safeNombre}, aquí tienes tu cotización personalizada de ProgramBI con los horarios confirmados y aranceles vigentes.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F3F3F0;">
    <tr>
      <td align="center" style="padding: 36px 16px 50px;" class="outer">
        <table width="600" cellpadding="0" cellspacing="0" border="0" class="card" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(23, 23, 22, 0.04); border: 1px solid #E5E5E0;">
          
          <!-- HEADER CON LOGO -->
          <tr>
            <td style="background-color: #FFFFFF; padding: 32px 40px 24px; text-align: center; border-bottom: 1px solid #EAEAE6;" class="mp">
              <a href="https://www.programbi.com" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974" width="150" alt="ProgramBI" style="display: inline-block; width: 150px; max-width: 100%; border: 0;"/>
              </a>
              <div style="margin-top: 10px;">
                <span style="display: inline-block; background-color: #EBEBE6; color: #5F5E59; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; padding: 4px 12px; border-radius: 9999px;">
                  Formación Práctica en Datos
                </span>
              </div>
            </td>
          </tr>
          
          <!-- SALUDO E INTRODUCCIÓN -->
          <tr>
            <td style="padding: 36px 40px 20px;" class="mp">
              <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 900; color: #171716; letter-spacing: -0.5px; margin-bottom: 12px;">
                Hola ${safeNombre},
              </h1>
              <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14.5px; line-height: 1.65; color: #5F5E59; margin: 0;">
                Gracias por tu interés en <strong style="color: #171716;">ProgramBI</strong>. Hemos preparado el detalle de los cursos que cotizaste con sus fechas de inicio, horarios y valores oficiales:
              </p>
            </td>
          </tr>

          <!-- CURSOS COTIZADOS -->
          <tr>
            <td style="padding: 0 40px 20px;" class="mp">
              <h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 800; color: #8C8B85; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px;">
                Tu Cotización Personalizada
              </h2>
              ${courseCardsHtml}
            </td>
          </tr>

          <!-- PACK RECOMENDADO SECTION -->
          ${packRecommendationHtml}

          <!-- SECCIÓN RECOMENDADOS (OTROS CURSOS CON FECHA PRÓXIMA) -->
          ${recommendedCoursesHtml}
          
          <!-- SEPARADOR -->
          <tr>
            <td style="padding: 0 40px;"><div style="height: 1px; background-color: #EAEAE6;"></div></td>
          </tr>
          
          <!-- METODOLOGÍA -->
          <tr>
            <td style="padding: 32px 40px;" class="mp">
              <h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 800; color: #171716; margin-bottom: 20px; letter-spacing: -0.2px;">
                Metodología de Formación ProgramBI
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${metaRow("Clases en vivo por Zoom", "Aprende en tiempo real con el docente, resuelve dudas al instante y participa activamente.")}
                ${metaRow("Grabaciones de por vida", "Acceso permanente a las grabaciones en tu campus virtual para repasar cuando quieras.")}
                ${metaRow("100% Casos Reales", "Aprende con problemas reales del mercado laboral, sin teoría innecesaria.")}
                ${metaRow("Flexibilidad de Pago", "Paga en hasta 12 cuotas sin interés con tarjeta de crédito, débito o transferencia.", true)}
              </table>
            </td>
          </tr>
          
          <!-- SEPARADOR -->
          <tr>
            <td style="padding: 0 40px;"><div style="height: 1px; background-color: #EAEAE6;"></div></td>
          </tr>
          
          <!-- EQUIPO DOCENTE -->
          <tr>
            <td style="padding: 32px 40px;" class="mp">
              <h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 800; color: #171716; margin-bottom: 20px; letter-spacing: -0.2px;">
                Equipo de Docentes
              </h2>
              ${profCard("MO", "Manuel Oliva", "Director Académico", "Magíster Data Science UAI · Consultor en Minería, Finanzas e IA")}
              ${profCard("EB", "Emanuel Berrocal", "Docente Power BI & SQL", "Ing. Civil Matemático U. de Chile · Portfolio Manager Banco Itaú")}
              ${profCard("RV", "Rodrigo Vega", "Docente Python & BI", "Ing. Comercial U. de Chile · Analista BI en Infracommerce")}
            </td>
          </tr>

          <!-- B2B EMPRESAS -->
          <tr>
            <td style="padding: 0 40px 32px;" class="mp">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F7F7F4; border: 1px solid #E5E5E0; border-radius: 14px;">
                <tr>
                  <td style="padding: 22px 24px;">
                    <div style="margin-bottom: 6px;">
                      <span style="display: inline-block; background-color: #EBEBE6; color: #171716; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 3px 8px; border-radius: 9999px;">
                        División Empresas
                      </span>
                    </div>
                    <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 800; color: #171716; margin-bottom: 6px;">
                      ¿Buscas capacitar a tu equipo o empresa?
                    </h3>
                    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12.5px; color: #5F5E59; line-height: 1.55; margin-bottom: 12px;">
                      Diseñamos programas cerrados a la medida de tu operación. Más de 5.000 profesionales capacitados.
                    </p>
                    <p style="margin: 0; padding-top: 10px; border-top: 1px solid #EAEAE6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #8C8B85; line-height: 1.5;">
                      <strong>Confían en nosotros:</strong> AngloAmerican · Copec · Deloitte · Banco de Chile · CMPC · AFP Cuprum · Cencosud · SQM.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- SEPARADOR -->
          <tr>
            <td style="padding: 0 40px;"><div style="height: 1px; background-color: #EAEAE6;"></div></td>
          </tr>
          
          <!-- BOTONES DE CONTACTO DIRECTO & FIRMA -->
          <tr>
            <td style="padding: 32px 40px;" class="mp">
              <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #5F5E59; line-height: 1.6; margin-bottom: 22px;">
                ¿Tienes dudas sobre los contenidos o necesitas financiamiento? Puedes responder a este correo o escribirnos directamente a nuestro canal prioritario:
              </p>

              <!-- BOTÓN CTA WHATSAPP -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                <tr>
                  <td>
                    <a href="https://wa.me/56935409699?text=Hola%2C%20recib%C3%AD%20mi%20cotizaci%C3%B3n%20en%20ProgramBI%20y%20tengo%20una%20consulta" target="_blank" style="display: inline-block; background-color: #171716; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13.5px; font-weight: 700; text-decoration: none; padding: 14px 26px; border-radius: 9999px; letter-spacing: 0.2px;">
                      💬 Hablar con un Asesor por WhatsApp →
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- FIRMA DIRECTIVO -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                <tr>
                  <td width="48" valign="top" style="padding-right: 14px;">
                    <div style="width: 44px; height: 44px; border-radius: 12px; background-color: #171716; text-align: center; line-height: 44px; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 15px;">
                      MO
                    </div>
                  </td>
                  <td valign="middle">
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 800; color: #171716;">Manuel Oliva</p>
                    <p style="margin: 2px 0 3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; color: #5F5E59;">Director Académico ProgramBI</p>
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #8C8B85;">
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
                  <td class="ms" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #8C8B85; line-height: 1.6;">
                    © ${year} ProgramBI Capacitaciones.<br/>
                    Recibiste este correo porque solicitaste información de cursos en nuestro sitio web.
                  </td>
                  <td class="ms" align="right" valign="top" style="padding-top: 4px; text-align: right;">
                    <a href="https://www.programbi.com/cursos" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #171716; text-decoration: none; font-weight: 700;">
                      Ver todos los cursos →
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

// ─── Helpers ────────────────────────────────────────────────────────────────────

function metaRow(title: string, desc: string, last = false) {
  return `
    <tr>
      <td width="26" valign="top" style="padding-bottom: ${last ? "0" : "14"}px; padding-right: 12px;">
        <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #DCFCE7; text-align: center; line-height: 20px; font-size: 11px; color: #166534; font-weight: 800;">
          ✓
        </div>
      </td>
      <td style="padding-bottom: ${last ? "0" : "14"}px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13.5px; color: #5F5E59; line-height: 1.5;">
        <strong style="color: #171716;">${title}:</strong> ${desc}
      </td>
    </tr>
  `;
}

function profCard(initials: string, name: string, role: string, desc: string) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 14px; border-collapse: collapse;">
      <tr>
        <td width="40" valign="top" style="padding-right: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 10px; background-color: #EBEBE6; text-align: center; line-height: 36px; color: #171716; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight: 800; font-size: 13px;">
            ${initials}
          </div>
        </td>
        <td valign="top">
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13.5px; font-weight: 800; color: #171716;">
            ${name} <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; color: #8C8B85; margin-left: 6px;">· ${role}</span>
          </p>
          <p style="margin: 2px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #5F5E59; line-height: 1.4; font-weight: 500;">
            ${desc}
          </p>
        </td>
      </tr>
    </table>
  `;
}


