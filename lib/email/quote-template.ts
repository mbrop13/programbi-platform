/**
 * Premium Quote Email Template — ProgramBI
 * Generates the full HTML for the quotation confirmation email.
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

export function buildQuoteEmailHtml(
  nombre: string,
  selectedCourses: EmailCourseItem[],
  recommendedCourses: EmailCourseItem[],
  packRecommendation: EmailPackInfo
): string {
  // A-15 / V5.4.7 (OWASP ASVS L3): escape any user-controlled string before
  // interpolating into the HTML email body to prevent HTML/CSS injection.
  const safeNombre = escapeHtml(nombre);
  const year = new Date().getFullYear();

  // Renderizar las tarjetas de cursos seleccionados por el usuario
  const courseCardsHtml = selectedCourses.map(c => {
    return `
      <!-- Curso Card: ${c.title} -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 18px; border-collapse: collapse;">
        <tr>
          <td style="border-left: 5px solid ${c.color}; background-color: #ffffff; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; border-top-right-radius: 16px; border-bottom-right-radius: 16px; padding: 22px 24px; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.025);">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td valign="top" class="ms" style="padding-bottom: 8px;">
                  <span style="display: inline-block; background-color: ${c.color}15; color: ${c.color}; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 6px; margin-bottom: 8px;">
                    ${c.levelName} · ${c.durationHours} HRS
                  </span>
                  <h3 style="margin: 0 0 6px; font-family: 'Outfit', 'Inter', sans-serif; font-size: 18px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                    ${c.title}
                  </h3>
                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #64748b; font-weight: 500;">
                    <span style="color: #475569; font-weight: 700;">📅 Clases:</span> ${c.startDate}
                  </p>
                </td>
                <td valign="top" align="right" class="ms" style="width: 140px; min-width: 140px; text-align: right;">
                  ${c.hasDiscount ? `<p style="margin: 0 0 2px; font-family: 'Inter', sans-serif; font-size: 12px; color: #94a3b8; text-decoration: line-through; font-weight: 500;">${c.originalPrice}</p>` : ''}
                  <p style="margin: 0 0 4px; font-family: 'Outfit', 'Inter', sans-serif; font-size: 20px; font-weight: 900; color: #10b981; line-height: 1;">
                    ${c.finalPrice}
                  </p>
                  <span style="display: inline-block; background-color: #dcfce7; color: #15803d; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 8px; border-radius: 99px;">
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
      <!-- Banner Pack Recomendado -->
      <tr>
        <td style="padding: 12px 40px 32px" class="mp">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f172a; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);">
            <tr>
              <td style="padding: 36px 32px; text-align: center; background-image: radial-gradient(circle at top right, #1e293b, #0f172a);">
                <div style="display: inline-block; background-color: #fbbf24; color: #78350f; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 16px; border-radius: 99px; margin-bottom: 18px; box-shadow: 0 4px 10px rgba(251, 191, 36, 0.2);">
                  Recomendación Inteligente
                </div>
                <h2 style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 24px; color: #ffffff; font-weight: 900; margin: 0 0 8px; letter-spacing: -0.5px;">
                  Pack de Análisis de Datos
                </h2>
                <p style="font-family: 'Inter', sans-serif; font-size: 13px; color: #94a3b8; margin: 0 0 24px; line-height: 1.5; font-weight: 500;">
                  SQL Server + Power BI + Python <br>
                  <span style="color: #38bdf8; font-weight: 700;">Especialización 48 horas · Clases en vivo</span>
                </p>
                
                <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center">
                      <p style="margin: 0 0 4px; font-family: 'Inter', sans-serif; font-size: 13px; color: #64748b; text-decoration: line-through;">
                        Precio regular: ${packRecommendation.origPrice}
                      </p>
                      <p style="margin: 0 0 4px; font-family: 'Outfit', 'Inter', sans-serif; font-size: 34px; color: #38bdf8; font-weight: 900; line-height: 1;">
                        ${packRecommendation.offerPrice}
                      </p>
                      <span style="display: inline-block; background-color: #064e3b; color: #34d399; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; padding: 4px 12px; border-radius: 99px;">
                        ¡AHORRA UN ${packRecommendation.savingPercent}% COMPRANDO EL PACK!
                      </span>
                    </td>
                  </tr>
                </table>

                <table align="center" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td bgcolor="#1890FF" style="border-radius: 12px; box-shadow: 0 6px 20px rgba(24, 144, 255, 0.3);">
                      <a href="${packRecommendation.url}" target="_blank" style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 16px 32px; display: inline-block; letter-spacing: 0.5px;">
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
    const recommendedCardsHtml = recommendedCourses.map(c => {
      return `
        <!-- Curso Recomendado: ${c.title} -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 14px; border-collapse: collapse;">
          <tr>
            <td style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.01);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="top" class="ms" style="padding-bottom: 6px;">
                    <span style="display: inline-block; background-color: ${c.color}10; color: ${c.color}; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 3px 8px; border-radius: 4px; margin-bottom: 6px;">
                      ${c.levelName} · ${c.durationHours} HRS
                    </span>
                    <h4 style="margin: 0 0 4px; font-family: 'Outfit', 'Inter', sans-serif; font-size: 15px; font-weight: 800; color: #0f172a; line-height: 1.2;">
                      ${c.title}
                    </h4>
                    <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #64748b;">
                      📅 Próximo inicio: <span style="color: #334155; font-weight: 600;">${c.startDate}</span>
                    </p>
                  </td>
                  <td valign="middle" align="right" class="ms" style="width: 140px; min-width: 140px; text-align: right;">
                    ${c.hasDiscount ? `<span style="font-family: 'Inter', sans-serif; font-size: 11px; color: #94a3b8; text-decoration: line-through; font-weight: 500; margin-right: 6px;">${c.originalPrice}</span>` : ''}
                    <span style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 16px; font-weight: 950; color: #0f172a;">
                      ${c.finalPrice}
                    </span>
                    <div style="margin-top: 6px;">
                      <a href="https://www.programbi.com/cursos/${c.slug}" target="_blank" style="display: inline-block; background-color: #ffffff; border: 1px solid #cbd5e1; color: #334155; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; text-decoration: none; padding: 5px 12px; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
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
        <td style="padding: 16px 40px 24px" class="mp">
          <div style="height: 1px; background-color: #f1f5f9; margin-bottom: 24px;"></div>
          <h2 style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 14px; font-weight: 850; color: #475569; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;">
            Próximos Inicios Recomendados para Ti
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
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;700;800;900&display=swap" rel="stylesheet">
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0; mso-table-rspace: 0; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    h1, h2, h3, p { margin: 0; padding: 0; }
    @media screen and (max-width: 620px) {
      .outer { padding: 12px 6px !important; }
      .card { border-radius: 16px !important; }
      .mp { padding-left: 20px !important; padding-right: 20px !important; }
      .ms { display: block !important; width: 100% !important; text-align: left !important; }
      .mc { text-align: center !important; }
    }
  </style>
</head>
<body>
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; color: #f8fafc;">
    ${safeNombre}, aquí tienes tu cotización personalizada con las fechas más próximas y precios actualizados.
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 16px 60px;" class="outer">
        <table width="600" cellpadding="0" cellspacing="0" border="0" class="card" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02); border: 1px solid #e2e8f0;">
          
          <!-- HEADER (NO TOP GRADIENT BLUE LINE) -->
          <tr>
            <td style="background-color: #ffffff; padding: 36px 40px 24px; text-align: center; border-bottom: 1px solid #f1f5f9" class="mp">
              <a href="https://www.programbi.com" target="_blank" style="text-decoration: none">
                <img src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974" width="160" alt="ProgramBI" style="display: inline-block; width: 160px; max-width: 100%; border: 0;"/>
              </a>
            </td>
          </tr>
          
          <!-- SALUDO -->
          <tr>
            <td style="padding: 40px 40px 24px" class="mp">
              <h1 style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 26px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 16px;">
                Hola ${safeNombre},
              </h1>
              <p style="font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7; color: #475569; margin: 0;">
                Gracias por tu interés en <strong style="color: #0f172a;">ProgramBI</strong>. A continuación, te presentamos el detalle de los cursos que has cotizado con la información de horarios, fechas y valores 100% actualizados:
              </p>
            </td>
          </tr>

          <!-- CURSOS COTIZADOS -->
          <tr>
            <td style="padding: 0 40px 24px" class="mp">
              <h2 style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 14px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;">
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
            <td style="padding: 0 40px;"><div style="height: 1px; background-color: #f1f5f9;"></div></td>
          </tr>
          
          <!-- METODOLOGÍA -->
          <tr>
            <td style="padding: 40px 40px" class="mp">
              <h2 style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 24px;">
                Metodología de Aprendizaje ProgramBI
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${metaRow("Clases en vivo por Zoom", "Aprende e interactúa en tiempo real con el docente y compañeros de grupo.")}
                ${metaRow("Grabaciones 24/7", "Todas las clases quedan grabadas para que repases a tu propio ritmo en la plataforma.")}
                ${metaRow("Enfoque 100% Práctico", "Ejercicios basados en casos reales del mercado laboral actual.")}
                ${metaRow("Pagos Flexibles", "Paga en cuotas sin interés mediante tarjeta de crédito, transferencia o cuotas mensuales.", true)}
              </table>
            </td>
          </tr>
          
          <!-- SEPARADOR -->
          <tr>
            <td style="padding: 0 40px;"><div style="height: 1px; background-color: #f1f5f9;"></div></td>
          </tr>
          
          <!-- EQUIPO -->
          <tr>
            <td style="padding: 40px 40px" class="mp">
              <h2 style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 24px;">
                Tu Equipo de Profesores
              </h2>
              ${profCard("MO", "linear-gradient(135deg, #1890FF, #4338ca)", "Manuel Oliva", "Director ProgramBI", "Magíster Data Science UAI · Consultor en Minería, Finanzas e IA")}
              ${profCard("EB", "linear-gradient(135deg, #6366f1, #a855f7)", "Emanuel Berrocal", "Docente Power BI & SQL", "Ing. Civil Matemático U. de Chile · Portfolio Manager Banco Itaú")}
              ${profCard("RV", "linear-gradient(135deg, #0ea5e9, #06b6d4)", "Rodrigo Vega", "Docente Python & BI", "Ing. Comercial U. de Chile · Analista BI en Infracommerce")}
            </td>
          </tr>

          <!-- B2B EMPRESAS -->
          <tr>
            <td style="padding: 0 40px 36px" class="mp">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;">
                <tr>
                  <td style="padding: 24px 28px;">
                    <h3 style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
                      ¿Buscas capacitación corporativa?
                    </h3>
                    <p style="font-family: 'Inter', sans-serif; font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 14px;">
                      Diseñamos programas de formación cerrados y a la medida de tu empresa. Más de 5.000 profesionales capacitados.
                    </p>
                    <p style="margin: 0; padding-top: 12px; border-top: 1px solid #e2e8f0; font-family: 'Inter', sans-serif; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                      <strong>Empresas que confían en nosotros:</strong> AngloAmerican · Copec · Deloitte · Banco de Chile · CMPC · AFP Cuprum · Cencosud · SQM · Grupo CAP.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- SEPARADOR -->
          <tr>
            <td style="padding: 0 40px;"><div style="height: 1px; background-color: #f1f5f9;"></div></td>
          </tr>
          
          <!-- FIRMA -->
          <tr>
            <td style="padding: 40px 40px" class="mp">
              <p style="font-family: 'Inter', sans-serif; font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 30px;">
                Si tienes dudas sobre los contenidos, opciones de financiamiento o medios de pago, puedes responder directamente a este correo o escribirnos a <a href="mailto:contacto@programbi.cl" style="color: #1890FF; font-weight: 700; text-decoration: none;">contacto@programbi.cl</a>.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                <tr>
                  <td width="56" valign="top" style="padding-right: 16px;">
                    <div style="width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, #1890FF, #4338ca); text-align: center; line-height: 50px; color: #ffffff; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 20px; box-shadow: 0 4px 10px rgba(24, 144, 255, 0.2);">
                      MO
                    </div>
                  </td>
                  <td valign="middle">
                    <p style="margin: 0; font-family: 'Outfit', 'Inter', sans-serif; font-size: 16px; font-weight: 800; color: #0f172a;">Manuel Oliva</p>
                    <p style="margin: 2px 0 4px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; color: #1890FF;">Director ProgramBI Capacitaciones</p>
                    <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #64748b;">
                      <a href="tel:+56935409699" style="color: #475569; text-decoration: none; font-weight: 600;">+569 3540 9699</a>
                      <span style="color: #cbd5e1; margin: 0 8px;">|</span>
                      <a href="https://www.programbi.com" style="color: #1890FF; text-decoration: none; font-weight: 700;">programbi.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td style="background-color: #f8fafc; padding: 28px 40px; border-top: 1px solid #f1f5f9; border-bottom-left-radius: 24px; border-bottom-right-radius: 24px;" class="mp">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="ms" style="font-family: 'Inter', sans-serif; font-size: 11px; color: #94a3b8; line-height: 1.6;">
                    © ${year} ProgramBI Capacitaciones.<br>
                    Recibiste este correo porque solicitaste información de cursos en nuestro sitio web.
                  </td>
                  <td class="ms" align="right" valign="top" style="padding-top: 4px; text-align: right;">
                    <a href="https://www.programbi.com/cursos" style="font-family: 'Inter', sans-serif; font-size: 11px; color: #1890FF; text-decoration: none; font-weight: 700;">
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

function metaRow(t: string, d: string, last = false) {
  return `
    <tr>
      <td width="28" valign="top" style="padding-bottom: ${last ? '0' : '16'}px; padding-right: 12px;">
        <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #e6f4ea; text-align: center; line-height: 22px; font-size: 12px; color: #137333; font-weight: 700;">
          ✓
        </div>
      </td>
      <td style="padding-bottom: ${last ? '0' : '16'}px; font-family: 'Inter', sans-serif; font-size: 14px; color: #475569; line-height: 1.5;">
        <strong style="color: #0f172a;">${t}:</strong> ${d}
      </td>
    </tr>
  `;
}

function profCard(i: string, bg: string, n: string, r: string, d: string) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px; border-collapse: collapse;">
      <tr>
        <td width="44" valign="top" style="padding-right: 14px;">
          <div style="width: 40px; height: 40px; border-radius: 10px; background: ${bg}; text-align: center; line-height: 40px; color: #ffffff; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 14px; box-shadow: 0 4px 8px rgba(15, 23, 42, 0.05);">
            ${i}
          </div>
        </td>
        <td valign="top">
          <p style="margin: 0; font-family: 'Outfit', 'Inter', sans-serif; font-size: 14px; font-weight: 800; color: #0f172a;">
            ${n} <span style="font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; color: #94a3b8; margin-left: 6px;">· ${r}</span>
          </p>
          <p style="margin: 2px 0 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #64748b; line-height: 1.4; font-weight: 500;">
            ${d}
          </p>
        </td>
      </tr>
    </table>
  `;
}
