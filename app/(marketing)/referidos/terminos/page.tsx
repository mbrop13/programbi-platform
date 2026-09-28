import type { Metadata } from "next";
import Link from "next/link";
import { REFERRAL_CLAWBACK_DAYS, REFERRAL_COMMISSION_PERCENT } from "@/lib/referrals/constants";

export const metadata: Metadata = {
  title: "Términos del programa de referidos",
  description:
    "Reglas del 15% en cursos y capacitaciones a empresas: link de referido, pago al cobro, clawback 60 días.",
  alternates: { canonical: "/referidos/terminos" },
};

export default function TerminosReferidosPage() {
  return (
    <div className="bg-canvas">
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Programa de referidos
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Términos del programa</h1>
        <p className="mt-3 text-muted-foreground">
          Español Chile. Vigentes para referidos de cursos abiertos y de capacitaciones a empresas en
          www.programbi.com. No aplican a capacitaciones.programbi.cl.
        </p>

        <Section title="1. Qué pagamos">
          <p>
            Comisión del <strong>{REFERRAL_COMMISSION_PERCENT}%</strong> sobre el valor neto cobrado
            de un curso o de una capacitación a empresas atribuida al referidor. Fórmula: entero
            inferior de (monto CLP × 0.15).
          </p>
        </Section>
        <Section title="2. Cuándo pagamos">
          <p>
            Solo al cobro: transferencia u orden de compra liquidada. ProgramBI confirma ese cobro en
            el panel de admin. La confirmación puede demorar hasta 24 horas desde el pago. Después
            transferimos el 15% a la cuenta chilena registrada (banco, tipo, número, RUT).
          </p>
        </Section>
        <Section title="3. Clawback">
          <p>
            Si hay nota de crédito o devolución dentro de {REFERRAL_CLAWBACK_DAYS} días desde el pago
            de la comisión, revertimos el 15%.
          </p>
        </Section>
        <Section title="4. Una venta = una comisión">
          <p>
            La comisión corresponde a la venta atribuida (un curso o una capacitación). Upsells
            posteriores no generan comisión extra en v1, salvo acuerdo escrito distinto.
          </p>
        </Section>
        <Section title="5. Cómo se atribuye">
          <p>
            El referidor comparte un link con <code>?ref=CODIGO</code>. Si esa persona crea una
            cuenta ProgramBI (cookie 90 días), queda atribuida. La comisión se paga solo cuando se
            cobra un curso o una capacitación de esa persona o de su empresa. ProgramBI puede
            rechazar spam, auto-referidos o abuso.
          </p>
        </Section>
        <Section title="6. Tracking">
          <p>
            El parámetro <code>?ref=CODIGO</code> en /registro, /cursos o /empresas guarda una cookie
            de 90 días. Si la persona crea una cuenta o deja sus datos, queda atribuida. El equipo
            confirma el cobro en el panel. Esa confirmación puede demorar hasta 24 horas.
          </p>
        </Section>
        <Section title="7. Cuenta">
          <p>
            Se usa la misma cuenta de ProgramBI (login / registro del sitio). Al entrar al panel se
            activa el perfil de referidor. ProgramBI puede suspender abuso o conflicto de interés.
          </p>
        </Section>
        <Section title="8. Independencia">
          <p>
            El referidor no es trabajador ni agente con poder de cierre. No promete precios ni plazos a
            nombre de ProgramBI. El contrato del curso o de la capacitación es entre ProgramBI y el
            alumno o la empresa.
          </p>
        </Section>
        <Section title="9. Datos">
          <p>
            Tratamos nombre, email, teléfono y datos bancarios para operar el programa. Los datos
            bancarios se cifran en reposo (best effort). Contacto: WhatsApp +56 9 3540 9699.
          </p>
        </Section>

        <div className="mt-12 flex gap-3 text-sm">
          <Link href="/login?next=/referidos/app" className="underline-offset-4 hover:underline">
            Entrar con mi cuenta
          </Link>
          <Link href="/referidos" className="text-muted-foreground underline-offset-4 hover:underline">
            Volver
          </Link>
        </div>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
