/**
 * Premium B2B Enterprise Email Template — ProgramBI
 */

export function buildEnterpriseEmailHtml(nombre: string, empresa: string): string {
  const year = new Date().getFullYear();

  const logos = [
    { name: "Tottus", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-532dc851-5dac-4ef4-a6a0-7fb6b41a71f2.png?v=1720130366" },
    { name: "Deloitte", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-a53761b3-b596-4a00-bbe2-a09ac193d34e.png?v=1720127578" },
    { name: "Cencosud", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-cc9e718a-0ff7-4910-997b-16c522ad5f24.png?v=1720127509" },
    { name: "SQM", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Sociedad_Quimica_y_Minera_logo_svg.png?v=1750694554" },
    { name: "BCI", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/Bci_Logotype_svg.png?v=1750694554" },
    { name: "BASF", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-b42b5f15-4107-4fe3-bde0-4c088b7069e2.png?v=1720127388" },
    { name: "Fonasa", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-6252432d-05a7-4589-8b77-7feec2a82397.png?v=1720127456" },
    { name: "CGE", url: "https://cdn.shopify.com/s/files/1/0564/3812/8712/files/gempages_519842279402243040-e02996d2-2ec9-4f2c-8ed7-fa510b5d49b5.png?v=1720127417" },
  ];

  const logoImgs = logos.map(l =>
    `<img src="${l.url}" alt="${l.name}" style="height:28px;width:auto;margin:10px 16px;display:inline-block;vertical-align:middle;opacity:0.7"/>`
  ).join("");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="es"><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Capacitación Corporativa — ProgramBI</title>
<style type="text/css">
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table,td{mso-table-lspace:0;mso-table-rspace:0;border-collapse:collapse}
img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none}
body{margin:0;padding:0;width:100%!important;background:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
h1,h2,h3,p{margin:0;padding:0}
@media screen and (max-width:620px){
.outer{padding:8px!important}
.card{border-radius:0!important}
.mp{padding-left:24px!important;padding-right:24px!important}
.ms{display:block!important;width:100%!important;margin-bottom:12px!important}
}
</style></head>
<body>
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f1f5f9;">${nombre}, hemos recibido tu solicitud de capacitación corporativa. Pronto te contactaremos.</div>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9">
<tr><td align="center" style="padding:32px 16px" class="outer">
<table width="600" cellpadding="0" cellspacing="0" border="0" class="card" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04)">

<!-- HEADER -->
<tr><td style="padding:32px 40px 20px;border-bottom:1px solid #f1f5f9" class="mp">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td align="left" valign="middle">
<a href="https://www.programbi.com" target="_blank" style="text-decoration:none">
<img src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974" width="140" alt="ProgramBI" style="display:block;width:140px"/>
</a>
</td>
<td align="right" valign="middle">
<span style="display:inline-block;background:#eff6ff;color:#1890FF;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;padding:6px 14px;border-radius:6px">División B2B</span>
</td>
</tr></table>
</td></tr>

<!-- SALUDO -->
<tr><td style="padding:40px 40px 0" class="mp">
<h1 style="font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;margin-bottom:16px">Hola ${nombre},</h1>
<p style="font-size:15px;line-height:1.7;color:#475569;margin-bottom:24px"><strong style="color:#0f172a">Hemos recibido exitosamente tu solicitud${empresa ? ` desde ${empresa}` : ""}.</strong> Gracias por confiar en nosotros para liderar la capacitación y transformación tecnológica de tu equipo.</p>
</td></tr>

<!-- CALLOUT -->
<tr><td style="padding:0 40px 32px" class="mp">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:4px solid #1890FF;background:#fafafa;border-radius:8px">
<tr><td style="padding:20px 24px">
<table cellpadding="0" cellspacing="0" border="0"><tr>
<td width="28" valign="top" style="font-size:18px;padding-right:12px">📞</td>
<td style="font-size:14px;color:#334155;line-height:1.6">Uno de nuestros directores académicos analizará tu solicitud y <strong>te contactará a la brevedad</strong> para estructurar una propuesta 100% a la medida de tu operación.</td>
</tr></table>
</td></tr></table>
</td></tr>

<!-- LOGOS -->
<tr><td style="padding:0 40px 32px;text-align:center" class="mp">
<p style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;margin-bottom:20px">Más de 5.000 profesionales capacitados</p>
<div style="line-height:3;text-align:center">${logoImgs}</div>
<p style="font-size:12px;color:#94a3b8;line-height:1.5;margin-top:16px">También: AngloAmerican · Copec · Chilevisión · Grupo CAP · Superintendencia de Pensiones · Pucobre · Midea</p>
</td></tr>

<!-- DIVIDER -->
<tr><td style="padding:0 40px"><div style="height:1px;background:#e2e8f0"></div></td></tr>

<!-- BENEFICIOS B2B -->
<tr><td style="padding:32px 40px" class="mp">
<h2 style="font-size:17px;font-weight:800;color:#0f172a;margin-bottom:22px">El Estándar B2B ProgramBI</h2>
<table width="100%" cellpadding="0" cellspacing="0" border="0">
${b2bRow("Cursos Cerrados a la Medida", "Adaptamos la malla y los ejercicios para resolver los problemas reales de tu operación.")}
${b2bRow("Flexibilidad Total", "Modalidad en vivo por Zoom o presencial en tus instalaciones, en el horario que elijas.")}
${b2bRow("Evaluación y Certificación", "Informes de rendimiento detallados y certificados validados por evaluación técnica.")}
${b2bRow("Automatización Real", "Entrenamos a tu equipo para conectar SAP, APIs, bases de datos y reducir tiempos muertos.", true)}
</table>
</td></tr>

<!-- DIVIDER -->
<tr><td style="padding:0 40px"><div style="height:1px;background:#e2e8f0"></div></td></tr>

<!-- STACK TECNOLÓGICO -->
<tr><td style="padding:32px 40px" class="mp">
<h2 style="font-size:17px;font-weight:800;color:#0f172a;margin-bottom:22px;text-align:center">Aceleramos tus procesos con</h2>
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
${techCard("📊", "Power BI", "Dashboards interactivos para la gerencia.", "#eab308")}
<td width="3%"></td>
${techCard("🗄️", "SQL Server", "Extracción y cruce seguro de datos.", "#ef4444")}
<td width="3%"></td>
${techCard("🐍", "Python + IA", "Automatización y análisis predictivo.", "#3b82f6")}
</tr></table>
</td></tr>

<!-- DIVIDER -->
<tr><td style="padding:0 40px"><div style="height:1px;background:#e2e8f0"></div></td></tr>

<!-- FIRMA -->
<tr><td style="padding:32px 40px" class="mp">
<p style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:24px">Si deseas enviarnos detalles sobre la cantidad de alumnos o los objetivos de tu empresa, escríbenos a <a href="mailto:contacto@programbi.com" style="color:#1890FF;font-weight:600;text-decoration:none">contacto@programbi.com</a></p>
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="48" valign="top" style="padding-right:14px">
<div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#1890FF,#4338ca);text-align:center;line-height:44px;color:#fff;font-weight:800;font-size:18px">M</div>
</td>
<td valign="top">
<p style="margin:0;font-size:15px;font-weight:800;color:#0f172a">Manuel Oliva</p>
<p style="margin:2px 0 6px;font-size:12px;font-weight:600;color:#1890FF">Director ProgramBI Capacitaciones</p>
<p style="margin:0;font-size:12px;color:#64748b;line-height:1.5">Magíster Data Science UAI · Consultor Empresarial</p>
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
<td style="font-size:11px;color:#94a3b8;line-height:1.6">© ${year} ProgramBI · División Empresas<br>Recibiste este correo porque solicitaste información corporativa.</td>
<td align="right" valign="top"><a href="https://www.programbi.com/cursos" style="font-size:11px;color:#1890FF;text-decoration:none;font-weight:600">Ver cursos</a></td>
</tr></table>
</td></tr>

</table></td></tr></table>
</body></html>`;
}

function b2bRow(title: string, desc: string, last = false) {
  return `<tr>
<td width="28" valign="top" style="padding-bottom:${last?'0':'18'}px;padding-right:12px">
<div style="width:22px;height:22px;border-radius:50%;background:#eff6ff;text-align:center;line-height:22px;font-size:11px;color:#1890FF;font-weight:800">✓</div>
</td>
<td style="padding-bottom:${last?'0':'18'}px;font-size:13px;color:#475569;line-height:1.6"><strong style="color:#1e293b">${title}:</strong> ${desc}</td>
</tr>`;
}

function techCard(icon: string, title: string, desc: string, color: string) {
  return `<td class="ms" width="31%" valign="top" align="center" style="background:#fafafa;border:1px solid #f1f5f9;border-top:3px solid ${color};border-radius:8px;padding:22px 14px">
<div style="font-size:24px;margin-bottom:10px">${icon}</div>
<h3 style="font-size:13px;font-weight:800;color:#0f172a;margin-bottom:6px">${title}</h3>
<p style="font-size:11px;color:#64748b;line-height:1.5">${desc}</p>
</td>`;
}
