import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const { sendQuoteConfirmationToLead } = await import("../lib/email/mailersend");
  const recipient = "manuelolivaplaza3@gmail.com";

  console.log(`Enviando cotización de Análisis de Datos a ${recipient}...`);
  await sendQuoteConfirmationToLead({
    name: "Manuel Oliva",
    email: recipient,
    courses: ["Análisis de Datos"],
  });
  console.log("Enviado.");
}

main().catch((err) => {
  console.error("Error al enviar:", err);
  process.exit(1);
});
