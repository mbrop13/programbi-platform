import Link from "next/link";
import { PACK } from "@/lib/data/pack-adopcion";
import { LINKEDIN_TEMPLATE, REFERRAL_FAQS, WHATSAPP_TEMPLATE } from "@/lib/referrals/copy";
import { CopyBlock } from "@/components/referrals/app/copy-block";

export const metadata = { title: "Recursos" };

export default function RecursosPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Recursos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One-pager del Pack y mensajes modelo. No prometas precios a nombre de ProgramBI.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">Pack Adopción BI</h2>
        <p className="mt-2 text-sm text-muted-foreground">{PACK.headline}</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          <li>1–3 dashboards con datos del área + capacitación {PACK.trainingWeeks} semanas</li>
          <li>{PACK.priceLabel} ({PACK.priceFromLabel})</li>
          <li>Factura directa · diagnóstico {PACK.diagnosisMinutes} min</li>
          <li>ICP: Controller / Control de Gestión / gerencia con dolor Excel</li>
        </ul>
        <Link href="/empresas" className="mt-4 inline-block text-sm underline-offset-4 hover:underline">
          Ver landing del Pack
        </Link>
      </section>

      <CopyBlock title="WhatsApp" text={WHATSAPP_TEMPLATE} />
      <CopyBlock title="LinkedIn" text={LINKEDIN_TEMPLATE} />

      <section>
        <h2 className="font-semibold">FAQ para ti</h2>
        <div className="mt-4 space-y-4">
          {REFERRAL_FAQS.map((f) => (
            <div key={f.q}>
              <p className="text-sm font-medium">{f.q}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
