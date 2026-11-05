import { Check } from "lucide-react";
import { EmpresasContactForm } from "@/components/empresas/empresas-contact-form";

/**
 * Bloque de cotización B2B. Reutiliza el formulario real de /empresas, que ya
 * envía `leadType: asesoria_b2b` y dispara `generate_lead` al confirmar.
 */
export function LandingContactSection() {
  return (
    <section id="contacto" className="mt-16 scroll-mt-24 border-t border-line pt-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mute">Contacto</p>
          <h2 className="mt-2 max-w-[16ch] text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Cuéntanos del equipo. Te armamos una propuesta.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-mute">
            Respondemos con temas, formato y valor para el grupo. Primero entendemos el caso y
            después enviamos la propuesta.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-mute">
            {[
              "Propuesta para capacitación in-company",
              "Factura a la empresa y orden de compra si hace falta",
              "Reporte de asistencia para el área de capacitación",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-ink" strokeWidth={2.4} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <EmpresasContactForm />
      </div>
    </section>
  );
}
