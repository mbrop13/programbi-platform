import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso | ProgramBI",
  description: "Conoce los términos y condiciones de uso de la plataforma de educación y comunidad de ProgramBI.",
};

export default function TerminosPage() {
  const lastUpdated = "15 de julio de 2026";

  return (
    <section className="min-h-screen bg-canvas py-20 lg:py-32">
      <div className="max-w-[800px] mx-auto px-5 lg:px-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-[#171716] font-bold tracking-widest uppercase text-xs block mb-4">Legal</span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-[#0F172A] mb-4">Términos y Condiciones de Uso</h1>
          <p className="text-gray-400 text-sm">Última actualización: {lastUpdated}</p>
        </div>

        {/* Content */}
        <article className="prose prose-slate max-w-none space-y-10 text-[15px] leading-relaxed text-gray-600">

          {/* 1. Introducción */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">1. Introducción y Aceptación</h2>
            <p>
              Bienvenido a <strong>ProgramBI</strong>. Al acceder, registrarse o utilizar nuestra plataforma web, cursos, herramientas de inteligencia artificial y comunidad, aceptas de manera expresa y sin reservas los presentes Términos y Condiciones de Uso. Si no estás de acuerdo con alguna de estas disposiciones, te solicitamos no utilizar nuestros servicios.
            </p>
            <p>
              Los servicios son prestados por <strong>ProgramBI SpA</strong>, sociedad constituida en Chile, con domicilio en Alonso de Córdova 5870, Oficina 724, Las Condes, Santiago.
            </p>
          </section>

          {/* 2. Registro y Cuentas */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">2. Registro y Seguridad de la Cuenta</h2>
            <p>
              Para acceder a ciertas funcionalidades de la plataforma, deberás crear una cuenta de usuario. Al registrarte (ya sea directamente o a través de proveedores externos de autenticación como Google OAuth), te comprometes a:
            </p>
            <ul className="list-none space-y-2 mt-4 pl-0">
              {[
                ["Veracidad", "Proporcionar información exacta, actualizada y completa durante el registro."],
                ["Confidencialidad", "Mantener la seguridad de tu contraseña y no compartir tus credenciales de acceso con terceros."],
                ["Responsabilidad", "Asumir la responsabilidad de toda actividad que ocurra bajo tu cuenta."],
                ["Notificación", "Informarnos de inmediato a contacto@programbi.cl sobre cualquier uso no autorizado de tu cuenta."],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171716] mt-2 flex-shrink-0" />
                  <span><strong className="text-[#0F172A]">{title}:</strong> {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Servicios y Acceso */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">3. Servicios, Cursos y Suscripciones</h2>
            <p>
              ProgramBI ofrece cursos educativos, talleres, comunidad interactiva y herramientas avanzadas de inteligencia artificial (chatbots, canvas interactivos, etc.).
            </p>
            <p>
              El acceso a ciertos contenidos puede estar sujeto a la compra individual de un curso o a la suscripción activa a uno de nuestros planes (Pro, Max, Ultra). Las licencias de acceso a los cursos y materiales son **personales, intransferibles y temporales**, limitadas a la vigencia establecida en cada modalidad de compra.
            </p>
          </section>

          {/* 4. Propiedad Intelectual */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">4. Propiedad Intelectual</h2>
            <p>
              Todo el contenido disponible en ProgramBI, incluyendo a modo enunciativo pero no limitativo: videos de clases, códigos fuente, materiales didácticos, textos, gráficos, logotipos, interfaces, software y algoritmos de inteligencia artificial, son de propiedad exclusiva de <strong>ProgramBI SpA</strong> o de sus licenciantes y están protegidos por las leyes de propiedad intelectual e industrial chilenas e internacionales.
            </p>
            <p>
              Queda estrictamente prohibida la copia, reproducción, distribución, transmisión, alquiler o cualquier explotación comercial de los contenidos sin la autorización previa y por escrito de ProgramBI.
            </p>
          </section>

          {/* 5. Precios y Métodos de Pago */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">5. Precios y Condiciones de Pago</h2>
            <p>
              Los precios de los cursos y membresías están expresados en pesos chilenos (CLP) o dólares estadounidenses (USD) según corresponda. Nos reservamos el derecho de modificar las tarifas en cualquier momento, lo cual no afectará a los servicios ya contratados y pagados.
            </p>
            <p>
              Los pagos se procesan de forma segura a través de la pasarela de pagos integrada <strong>Flow.cl</strong> o <strong>Mercado Pago</strong>. ProgramBI no almacena ni tiene acceso a los datos de tus tarjetas de crédito o débito.
            </p>
            <p>
              <strong>Derecho de Retracto:</strong> De conformidad con el artículo 3 bis letra b) de la Ley N° 19.496 de Chile, por tratarse de un servicio de suministro de contenido digital que comienza inmediatamente con la compra, el usuario acepta expresamente que no procederá el derecho de retracto una vez iniciado el acceso al material o curso contratado.
            </p>
          </section>

          {/* 6. Código de Conducta de la Comunidad */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">6. Uso Aceptable y Código de Conducta</h2>
            <p>
              Al utilizar la sección de comunidad, foros o herramientas interactivas de IA de ProgramBI, te comprometes a no publicar ni transmitir contenido que:
            </p>
            <ul className="list-none space-y-2 mt-4 pl-0">
              {[
                "Sea ilegal, abusivo, difamatorio, obsceno o discriminatorio.",
                "Infrinja derechos de propiedad intelectual de terceros.",
                "Contenga virus informáticos o cualquier código de carácter dañino.",
                "Tenga propósitos de spam, publicidad no autorizada o captación de clientes para servicios ajenos a ProgramBI.",
                "Abuse o intente corromper el funcionamiento de nuestras herramientas de IA (mediante inyección de prompts u otras prácticas maliciosas).",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171716] mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 7. Exclusión de Garantías y Limitación de Responsabilidad */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">7. Limitación de Responsabilidad</h2>
            <p>
              ProgramBI se esfuerza por mantener la plataforma operativa y libre de errores. No obstante, no garantizamos que el servicio sea ininterrumpido o esté completamente libre de fallas técnicas menores.
            </p>
            <p>
              <strong>Resultados Profesionales:</strong> Si bien entregamos herramientas y formación de alta calidad en Business Intelligence y Análisis de Datos, ProgramBI no garantiza resultados de empleabilidad, ascensos o incrementos salariales específicos tras completar los cursos. El éxito depende del esfuerzo individual y del perfil de cada estudiante.
            </p>
          </section>

          {/* 8. Suspensión y Cancelación de Cuenta */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">8. Suspensión y Terminación</h2>
            <p>
              Nos reservamos el derecho de suspender o cancelar de forma inmediata tu acceso a la plataforma, sin previo aviso ni derecho a reembolso, ante cualquier incumplimiento grave de los presentes Términos y Condiciones de Uso, conducta inapropiada en la comunidad o sospecha de fraude en los pagos.
            </p>
          </section>

          {/* 9. Modificaciones a los Términos */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">9. Modificaciones a los Términos</h2>
            <p>
              ProgramBI podrá actualizar estos Términos y Condiciones de Uso en cualquier momento para adaptarlos a cambios legales o mejoras operativas en la plataforma. Los cambios serán publicados en esta misma página con su correspondiente fecha de actualización. El uso continuo de la plataforma después de dicha publicación constituye la aceptación de los nuevos términos.
            </p>
          </section>

          {/* 10. Jurisdicción y Ley Aplicable */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">10. Ley Aplicable y Jurisdicción</h2>
            <p>
              Estos Términos y Condiciones se rigen en su totalidad por la legislación de la República de Chile. Cualquier discrepancia o conflicto derivado de la interpretación o ejecución de las presentes condiciones será sometido a la competencia de los tribunales ordinarios de justicia de la ciudad de Santiago de Chile.
            </p>
          </section>

          {/* 11. Contacto */}
          <section>
            <h2 className="text-xl font-bold text-[#0F172A] mb-3 font-display">11. Contacto</h2>
            <p>
              Si tienes dudas sobre estos Términos y Condiciones, o deseas realizar alguna consulta legal, puedes contactarnos en:
            </p>
            <div className="bg-slate-50 rounded-2xl p-6 mt-4 border border-slate-100">
              <p className="font-bold text-[#0F172A] mb-1">ProgramBI SpA</p>
              <p className="text-sm text-gray-500">Alonso de Córdova 5870, Oficina 724, Las Condes, Santiago, Chile</p>
              <p className="text-sm text-gray-500 mt-1">
                <a href="mailto:contacto@programbi.cl" className="text-[#171716] no-underline hover:underline">contacto@programbi.cl</a>
                {" • "}
                <a href="tel:+56935409699" className="text-[#171716] no-underline hover:underline">+56 9 3540 9699</a>
              </p>
            </div>
          </section>

        </article>
      </div>
    </section>
  );
}
