import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | ProgramBI",
  description: "Conoce cómo ProgramBI recopila, usa y protege tu información personal conforme a la Ley N° 19.628 de Chile.",
};

export default function PrivacidadPage() {
  const lastUpdated = "14 de abril de 2026";

  return (
    <section className="min-h-screen bg-white py-20 lg:py-32">
      <div className="max-w-[800px] mx-auto px-5 lg:px-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-[#1890FF] font-bold tracking-widest uppercase text-xs block mb-4">Legal</span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-[#0F172A] mb-4">Política de Privacidad</h1>
          <p className="text-gray-400 text-sm">Última actualización: {lastUpdated}</p>
        </div>

        {/* Content */}
        <article className="prose prose-slate max-w-none space-y-10 text-[15px] leading-relaxed text-gray-600">

          {/* 1. Responsable */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">1. Responsable del Tratamiento</h2>
            <p>
              El responsable de la recopilación y tratamiento de los datos personales es <strong>ProgramBI SpA</strong>, con domicilio en
              Alonso de Córdova 5870, Oficina 724, Las Condes, Santiago, Chile, correo electrónico{" "}
              <a href="mailto:contacto@programbi.cl" className="text-[#1890FF] no-underline hover:underline font-medium">contacto@programbi.cl</a> y
              teléfono <a href="tel:+56935409699" className="text-[#1890FF] no-underline hover:underline font-medium">+56 9 3540 9699</a>.
            </p>
          </section>

          {/* 2. Datos que recopilamos */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">2. Datos Personales que Recopilamos</h2>
            <p>Dependiendo de tu interacción con nuestra plataforma, podemos recopilar:</p>
            <ul className="list-none space-y-2 mt-4 pl-0">
              {[
                ["Datos de identificación", "nombre completo, correo electrónico, número de teléfono/WhatsApp."],
                ["Datos profesionales", "empresa, cargo, número de empleados (formularios corporativos)."],
                ["Datos de cuenta", "contraseña (almacenada de forma encriptada), preferencias de usuario."],
                ["Datos de navegación", "dirección IP, tipo de navegador, páginas visitadas, cookies funcionales."],
                ["Datos de pago", "procesados íntegramente por Flow.cl; ProgramBI no almacena datos de tarjeta."],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1890FF] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#0F172A]">{title}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Finalidad */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">3. Finalidad del Tratamiento</h2>
            <p>Utilizamos tus datos personales para:</p>
            <ul className="list-none space-y-2 mt-4 pl-0">
              {[
                "Gestionar tu registro, autenticación y acceso a la plataforma.",
                "Procesar inscripciones, pagos y emisión de certificados.",
                "Responder solicitudes de información, cotizaciones y consultas.",
                "Enviar comunicaciones comerciales sobre cursos, promociones y novedades (solo con tu consentimiento).",
                "Mejorar nuestros servicios mediante análisis estadísticos anonimizados.",
                "Cumplir obligaciones legales, tributarias y contractuales.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1890FF] mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Base legal */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">4. Base Legal</h2>
            <p>
              El tratamiento de tus datos se fundamenta en tu <strong>consentimiento expreso</strong> otorgado
              al completar nuestros formularios, la <strong>ejecución de un contrato</strong> (inscripción a cursos),
              y el cumplimiento de la <strong>Ley N° 19.628</strong> sobre protección de la vida privada y demás
              normativa chilena aplicable.
            </p>
          </section>

          {/* 5. Compartir datos */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">5. Cesión y Comunicación de Datos</h2>
            <p>
              ProgramBI <strong>no vende, alquila ni cede</strong> tus datos personales a terceros con fines comerciales.
              Únicamente compartimos información con:
            </p>
            <ul className="list-none space-y-2 mt-4 pl-0">
              {[
                ["Flow.cl", "procesamiento seguro de pagos (PCI DSS)."],
                ["Supabase", "alojamiento seguro de base de datos con encriptación en reposo."],
                ["Amazon SES", "envío de correos transaccionales."],
                ["Vercel", "hosting de la aplicación web."],
              ].map(([provider, desc]) => (
                <li key={provider} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1890FF] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#0F172A]">{provider}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 6. Retención */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">6. Período de Conservación</h2>
            <p>
              Conservamos tus datos personales mientras mantengas una cuenta activa en nuestra plataforma
              o mientras sea necesario para cumplir con las finalidades descritas. Los datos vinculados
              a transacciones comerciales se conservan por un período mínimo de <strong>5 años</strong> conforme
              a la legislación tributaria chilena.
            </p>
          </section>

          {/* 7. Derechos */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">7. Tus Derechos</h2>
            <p>De acuerdo con la Ley N° 19.628, tienes derecho a:</p>
            <ul className="list-none space-y-2 mt-4 pl-0">
              {[
                ["Acceso", "solicitar una copia de tus datos personales almacenados."],
                ["Rectificación", "corregir datos inexactos o desactualizados."],
                ["Cancelación", "solicitar la eliminación de tus datos cuando ya no sean necesarios."],
                ["Oposición", "oponerte al tratamiento de tus datos para ciertos fines."],
              ].map(([right, desc]) => (
                <li key={right} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1890FF] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#0F172A]">{right}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Para ejercer tus derechos, escríbenos a{" "}
              <a href="mailto:contacto@programbi.cl" className="text-[#1890FF] no-underline hover:underline font-medium">contacto@programbi.cl</a>{" "}
              indicando tu nombre, RUT y derecho que deseas ejercer. Responderemos en un plazo máximo de 15 días hábiles.
            </p>
          </section>

          {/* 8. Cookies */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">8. Cookies</h2>
            <p>
              Nuestra plataforma utiliza cookies estrictamente necesarias para el funcionamiento del sitio
              (autenticación, sesión) y cookies analíticas para mejorar tu experiencia. Puedes gestionar
              las preferencias de cookies desde la configuración de tu navegador.
            </p>
          </section>

          {/* 9. Seguridad */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">9. Seguridad</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas adecuadas para proteger tus datos,
              incluyendo: encriptación SSL/TLS en todas las comunicaciones, almacenamiento de contraseñas
              con hash bcrypt, control de acceso basado en roles (RLS en Supabase), y auditorías periódicas.
            </p>
          </section>

          {/* 10. Menores */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">10. Menores de Edad</h2>
            <p>
              Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos
              conscientemente datos de menores de edad. Si detectamos que un menor ha proporcionado
              datos personales, procederemos a eliminarlos de inmediato.
            </p>
          </section>

          {/* 11. Modificaciones */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">11. Modificaciones a esta Política</h2>
            <p>
              ProgramBI se reserva el derecho de actualizar esta Política de Privacidad. Cualquier
              cambio significativo será notificado a través de nuestra plataforma o por correo electrónico.
              La fecha de última actualización se indica al inicio de este documento.
            </p>
          </section>

          {/* 12. Contacto */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">12. Contacto</h2>
            <p>
              Si tienes preguntas sobre esta política o sobre el tratamiento de tus datos, contáctanos:
            </p>
            <div className="bg-slate-50 rounded-2xl p-6 mt-4 border border-slate-100">
              <p className="font-bold text-[#0F172A] mb-1">ProgramBI SpA</p>
              <p className="text-sm text-gray-500">Alonso de Córdova 5870, Oficina 724, Las Condes, Santiago, Chile</p>
              <p className="text-sm text-gray-500 mt-1">
                <a href="mailto:contacto@programbi.cl" className="text-[#1890FF] no-underline hover:underline">contacto@programbi.cl</a>
                {" • "}
                <a href="tel:+56935409699" className="text-[#1890FF] no-underline hover:underline">+56 9 3540 9699</a>
              </p>
            </div>
          </section>

        </article>
      </div>
    </section>
  );
}
