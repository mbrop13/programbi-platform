import dotenv from "dotenv";
import path from "path";

// Cargar variables de entorno ANTES de importar módulos
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const {
    sendQuoteConfirmationToLead,
    sendEnterpriseQuoteToLead,
    sendNotifyMeConfirmation,
  } = await import("../lib/email/mailersend");

  const recipient = "manuelolivaplaza3@gmail.com";
  console.log(`[TEST EMAIL] Iniciando envío de correos de prueba con diseño ProgramBI 2.0 a: ${recipient}\n`);

  // 1. Enviar Cotización Individual (Cursos: Power BI + SQL)
  console.log(`1. Enviando Cotización Individual de Cursos a ${recipient}...`);
  await sendQuoteConfirmationToLead({
    name: "Manuel Oliva",
    email: recipient,
    courses: ["power-bi", "sql"],
    message: "Hola, me interesa aprender Power BI y SQL para aplicarlo en finanzas.",
  });
  console.log(`✅ [1/3] Cotización individual enviada con éxito.`);

  // 2. Enviar Cotización Corporativa B2B
  console.log(`\n2. Enviando Cotización Corporativa B2B a ${recipient}...`);
  await sendEnterpriseQuoteToLead({
    name: "Manuel Oliva",
    email: recipient,
    company: "Anglo American Chile",
    courses: ["power-bi", "python", "sql"],
    employeeCount: "25-50",
  });
  console.log(`✅ [2/3] Cotización corporativa B2B enviada con éxito.`);

  // 3. Enviar Notificación de Lista de Espera
  console.log(`\n3. Enviando Notificación de Lista de Espera a ${recipient}...`);
  await sendNotifyMeConfirmation({
    name: "Manuel Oliva",
    email: recipient,
    courseName: "Especialización en Análisis de Datos",
    levelName: "Completo (Power BI + SQL + Python + Excel)",
  });
  console.log(`✅ [3/3] Notificación de lista de espera enviada con éxito.`);

  console.log(`\n🎉 ¡Todos los correos de prueba han sido enviados exitosamente a ${recipient}! Revisa tu bandeja de entrada.`);
}

main().catch((err) => {
  console.error("❌ Error en la prueba de envío:", err);
  process.exit(1);
});
