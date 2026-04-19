const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.SES_SMTP_HOST || "email-smtp.sa-east-1.amazonaws.com";
const SMTP_PORT = parseInt(process.env.SES_SMTP_PORT || "465", 10);
const SMTP_USER = process.env.SES_SMTP_USER;
const SMTP_PASS = process.env.SES_SMTP_PASS;
const FROM_EMAIL = process.env.SES_FROM_EMAIL || "noreply@programbi.com";
const FROM_NAME = process.env.SES_FROM_NAME || "ProgramBI";

async function testEmail() {
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("Faltan credenciales SMTP_USER o SMTP_PASS");
    return;
  }

  console.log("Configuración SMTP:");
  console.log(`- Host: ${SMTP_HOST}`);
  console.log(`- Port: ${SMTP_PORT}`);
  console.log(`- User: ${SMTP_USER}`);
  console.log(`- From: "${FROM_NAME}" <${FROM_EMAIL}>`);

  // Habilitamos 'logger' y 'debug' para ver todo lo que dice el servidor de Amazon
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    logger: true,
    debug: true
  });

  try {
    console.log("Intentando conectar con SES...");
    await transporter.verify();
    console.log("✅ Conexión con Amazon SES exitosa.");

    const TARGET_EMAIL = process.argv[2] || "contacto@programbi.com";
    console.log(`Enviando correo de prueba a: ${TARGET_EMAIL}...`);
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: TARGET_EMAIL,
      subject: "Test de conexión SES ProgramBI",
      text: "Si recibes este correo, la configuración de Amazon SES funciona correctamente.",
      html: "<p>Si recibes este correo, la configuración de <b>Amazon SES</b> funciona correctamente.</p>"
    });

    console.log("✅ Correo enviado con éxito!");
    console.log(`- Message ID: ${info.messageId}`);
    console.log(`- Respuesta de SES: ${info.response}`);

  } catch (error) {
    console.error("❌ Error en la prueba:");
    console.error(error);
  }
}

testEmail();
