/**
 * Premium Quote Email Template — ProgramBI
 * Generates the full HTML for the quotation confirmation email.
 */

export function buildQuoteEmailHtml(nombre: string): string {
  const year = new Date().getFullYear();

  const courses = [
    { title: "Power BI Básico", date: "19 de Mayo · Mar y Jue · 19:30", orig: "$249.000", offer: "$199.200", color: "#eab308" },
    { title: "SQL Server Básico", date: "22 de Junio · Lun y Mié · 19:30", orig: "$249.000", offer: "$199.200", color: "#ef4444" },
    { title: "Python Básico", date: "25 de Mayo · Lun y Mié · 19:30", orig: "$249.000", offer: "$199.200", color: "#3b82f6" },
  ];

  const intermediate = [
    { title: "Power BI Intermedio", date: "25 de Mayo · Lun y Mié", price: "$199.200" },
    { title: "SQL Server Intermedio", date: "22 de Junio · Lun y Mié", price: "$199.200" },
    { title: "Python Intermedio", date: "27 de Julio · Lun y Mié", price: "$199.200" },
  ];

  const basicRows = courses.map(c => courseCard(c.title, c.date, c.orig, c.offer, c.color)).join("");
  const interRows = intermediate.map(c => simpleCard(c.title, c.date, c.price)).join("");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es"><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Tu Cotización — ProgramBI</title>
<style type="text/css">
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table,td{mso-table-lspace:0;mso-table-rspace:0}
img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none}
body{margin:0;padding:0;width:100%!important;background:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
h1,h2,h3,p{margin:0;padding:0}
@media screen and (max-width:620px){
.outer{padding:8px!important}
.card{border-radius:0!important}
.mp{padding-left:24px!important;padding-right:24px!important}
.ms{display:block!important;width:100%!important}
.mc{text-align:center!important}
}
</style></head>
<body>
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f1f5f9;">${nombre}, aquí tienes tu cotización personalizada con fechas y precios especiales.</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9">
<tr><td align="center" style="padding:32px 16px" class="outer">
<table width="600" cellpadding="0" cellspacing="0" border="0" class="card" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04)">

<!-- HEADER -->
<tr><td style="background:#ffffff;padding:36px 40px 20px;text-align:center;border-bottom:1px solid #f1f5f9" class="mp">
<a href="https://www.programbi.com" target="_blank" style="text-decoration:none">
<img src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974" width="150" alt="ProgramBI" style="display:inline-block;width:150px;max-width:100%"/>
</a>
</td></tr>

<!-- SALUDO -->
<tr><td style="padding:40px 40px 0" class="mp">
<h1 style="font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;margin-bottom:16px">Hola ${nombre},</h1>
<p style="font-size:15px;line-height:1.7;color:#475569;margin-bottom:24px">Gracias por tu interés en <strong style="color:#0f172a">ProgramBI</strong>. Diseñamos cursos de programación y análisis de datos <strong style="color:#0f172a">100% aplicados al mercado laboral</strong>. A continuación tu cotización:</p>
</td></tr>

<!-- PACK -->
<tr><td style="padding:0 40px 32px" class="mp">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;border-radius:12px;overflow:hidden">
<tr><td style="padding:32px 28px;text-align:center">
<div style="display:inline-block;background:#fbbf24;color:#78350f;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;padding:5px 14px;border-radius:99px;margin-bottom:18px">Recomendado</div>
<h2 style="font-size:22px;color:#fff;font-weight:800;margin-bottom:6px">Pack Análisis de Datos</h2>
<p style="font-size:13px;color:#94a3b8;margin-bottom:20px;line-height:1.5">Python + Power BI + SQL Server · 48 Hrs · 3 Meses</p>
<p style="font-size:13px;color:#64748b;text-decoration:line-through;margin-bottom:4px">$747.000</p>
<p style="font-size:32px;color:#38bdf8;font-weight:900;line-height:1;margin:0 0 4px">$448.200</p>
<p style="font-size:11px;color:#10b981;font-weight:700;letter-spacing:0.5px;margin-bottom:24px">AHORRA 40%</p>
<table align="center" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#2563eb" style="border-radius:8px">
<a href="https://www.programbi.com/cursos/analisis-de-datos" target="_blank" style="font-size:14px;font-weight:700;color:#fff;text-decoration:none;padding:14px 28px;display:inline-block;letter-spacing:0.5px">Ver Fechas Disponibles</a>
</td></tr></table>
</td></tr></table>
</td></tr>

<!-- BÁSICOS HEADER -->
<tr><td style="padding:0 40px 10px" class="mp">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td><h2 style="font-size:16px;font-weight:800;color:#0f172a">Cursos Individuales — Básico</h2></td>
<td align="right"><span style="font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:1px">16 HRS C/U</span></td>
</tr></table>
</td></tr>
<tr><td style="padding:0 40px 28px" class="mp">${basicRows}</td></tr>

<!-- INTERMEDIOS HEADER -->
<tr><td style="padding:0 40px 10px" class="mp">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td><h2 style="font-size:16px;font-weight:800;color:#0f172a">Nivel Intermedio</h2></td>
<td align="right"><span style="font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:1px">16 HRS C/U</span></td>
</tr></table>
</td></tr>
<tr><td style="padding:0 40px 32px" class="mp">${interRows}</td></tr>

<!-- DIVIDER -->
<tr><td style="padding:0 40px"><div style="height:1px;background:#e2e8f0"></div></td></tr>

<!-- METODOLOGÍA -->
<tr><td style="padding:32px 40px" class="mp">
<h2 style="font-size:16px;font-weight:800;color:#0f172a;margin-bottom:20px">Metodología ProgramBI</h2>
<table width="100%" cellpadding="0" cellspacing="0" border="0">
${metaRow("Clases en vivo por Zoom", "Grabaciones disponibles 24/7 en el campus virtual.")}
${metaRow("Pagos flexibles", "Transferencia, tarjeta de crédito en cuotas o USD.")}
${metaRow("Certificación", "Proyecto final 100% aplicable a tu trabajo real.")}
${metaRow("Enfoque práctico", "Conecta SAP, SQL, Excel, APIs y Web.", true)}
</table>
</td></tr>

<!-- DIVIDER -->
<tr><td style="padding:0 40px"><div style="height:1px;background:#e2e8f0"></div></td></tr>

<!-- EQUIPO -->
<tr><td style="padding:32px 40px" class="mp">
<h2 style="font-size:16px;font-weight:800;color:#0f172a;margin-bottom:20px">Tu Equipo Docente</h2>
${profCard("M", "#1890FF", "Manuel Oliva", "Director ProgramBI", "Magíster Data Science UAI · Consultor Minero y Financiero")}
${profCard("E", "#6366f1", "Emanuel Berrocal", "Docente Power BI & SQL", "Ing. Civil Matemático U. de Chile · Portfolio Manager Banco Itaú")}
${profCard("R", "#0ea5e9", "Rodrigo Vega", "Docente Python & BI", "Ing. Comercial U. de Chile · Analista BI en Infracommerce")}
</td></tr>

<!-- B2B -->
<tr><td style="padding:0 40px 32px" class="mp">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px">
<tr><td style="padding:24px 28px">
<h3 style="font-size:14px;font-weight:800;color:#0f172a;margin-bottom:8px">Formación Corporativa</h3>
<p style="font-size:13px;color:#64748b;line-height:1.6;margin-bottom:12px">Más de 5.000 alumnos capacitados en 6 años. Cursos cerrados a empresas con malla y horarios a medida.</p>
<p style="font-size:11px;color:#94a3b8;line-height:1.5;border-top:1px solid #e2e8f0;padding-top:12px;margin:0"><strong>Confían en nosotros:</strong> AngloAmerican · Copec · Deloitte · Banco de Chile · CMPC · AFP Cuprum · CENCOSUD · SQM · Grupo CAP</p>
</td></tr></table>
</td></tr>

<!-- DIVIDER -->
<tr><td style="padding:0 40px"><div style="height:1px;background:#e2e8f0"></div></td></tr>

<!-- FIRMA -->
<tr><td style="padding:32px 40px" class="mp">
<p style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:24px">Si tienes dudas sobre temarios, postulación o medios de pago, puedes escribirnos a <a href="mailto:contacto@programbi.com" style="color:#1890FF;font-weight:600;text-decoration:none">contacto@programbi.com</a></p>
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="48" valign="top" style="padding-right:14px">
<div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#1890FF,#4338ca);text-align:center;line-height:44px;color:#fff;font-weight:800;font-size:18px">M</div>
</td>
<td valign="top">
<p style="margin:0;font-size:15px;font-weight:800;color:#0f172a">Manuel Oliva</p>
<p style="margin:2px 0 6px;font-size:12px;font-weight:600;color:#1890FF">Director ProgramBI Capacitaciones</p>
<p style="margin:0;font-size:12px;color:#64748b;line-height:1.5">Magíster Data Science UAI · Docente Universitario</p>
<p style="margin:6px 0 0;font-size:12px;color:#0f172a">
<a href="tel:+56935409699" style="color:#0f172a;text-decoration:none;font-weight:600">+569 3540 9699</a>
<span style="color:#cbd5e1;margin:0 6px">|</span>
<a href="https://www.programbi.com" style="color:#1890FF;text-decoration:none;font-weight:600">programbi.com</a>
</p>
</td>
</tr></table>
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #f1f5f9" class="mp">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="font-size:11px;color:#94a3b8;line-height:1.6">© ${year} ProgramBI Capacitaciones<br>Recibiste este correo porque solicitaste información en nuestro sitio.</td>
<td align="right" valign="top"><a href="https://www.programbi.com/cursos" style="font-size:11px;color:#1890FF;text-decoration:none;font-weight:600">Ver cursos</a></td>
</tr></table>
</td></tr>

</table></td></tr></table>
</body></html>`;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function courseCard(t: string, d: string, o: string, p: string, c: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px"><tr>
<td style="border-left:3px solid ${c};background:#fafafa;border-radius:8px;padding:14px 18px">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="ms" width="60%" valign="middle"><p style="margin:0;font-size:14px;font-weight:700;color:#1e293b">${t}</p><p style="margin:3px 0 0;font-size:12px;color:#64748b">${d}</p></td>
<td class="ms" width="40%" valign="middle" align="right"><p style="margin:0;font-size:11px;color:#94a3b8;text-decoration:line-through">${o}</p><p style="margin:2px 0 0;font-size:15px;font-weight:800;color:#10b981">${p}</p></td>
</tr></table></td></tr></table>`;
}

function simpleCard(t: string, d: string, p: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px"><tr>
<td style="border-left:3px solid #cbd5e1;background:#fff;border:1px solid #f1f5f9;border-radius:8px;padding:14px 18px">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="ms" width="60%" valign="middle"><p style="margin:0;font-size:14px;font-weight:700;color:#334155">${t}</p><p style="margin:3px 0 0;font-size:12px;color:#64748b">${d}</p></td>
<td class="ms" width="40%" valign="middle" align="right"><p style="margin:0;font-size:15px;font-weight:800;color:#2563eb">${p}</p></td>
</tr></table></td></tr></table>`;
}

function metaRow(t: string, d: string, last = false) {
  return `<tr><td width="24" valign="top" style="padding-bottom:${last?'0':'14'}px;padding-right:12px"><div style="width:20px;height:20px;border-radius:50%;background:#eff6ff;text-align:center;line-height:20px;font-size:11px;color:#2563eb">✓</div></td>
<td style="padding-bottom:${last?'0':'14'}px;font-size:13px;color:#475569;line-height:1.5"><strong style="color:#1e293b">${t}:</strong> ${d}</td></tr>`;
}

function profCard(i: string, c: string, n: string, r: string, d: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px"><tr>
<td width="38" valign="top" style="padding-right:12px"><div style="width:34px;height:34px;border-radius:8px;background:${c};text-align:center;line-height:34px;color:#fff;font-weight:800;font-size:15px">${i}</div></td>
<td valign="top"><p style="margin:0;font-size:14px;font-weight:700;color:#0f172a">${n} <span style="font-size:11px;font-weight:600;color:#94a3b8;margin-left:4px">· ${r}</span></p>
<p style="margin:2px 0 0;font-size:12px;color:#64748b;line-height:1.4">${d}</p></td>
</tr></table>`;
}
