import Link from "next/link";
import { LINKEDIN_TEMPLATE, REFERRAL_FAQS, WHATSAPP_TEMPLATE } from "@/lib/referrals/copy";
import { CopyBlock } from "@/components/referrals/app/copy-block";

export const metadata = { title: "Recursos" };

export default function RecursosPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Recursos</h1>
        <p className="mt-1 text-sm text-mute">
          Mensajes modelo. Pega tu link del panel. No prometas precios a nombre de ProgramBI.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold">Qué puedes recomendar</h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          <li>Cursos abiertos: Power BI, SQL, Python, Excel y más</li>
          <li>Capacitación corporativa para un equipo o empresa</li>
          <li>15% sobre el neto cobrado de esa venta atribuida</li>
        </ul>
        <div className="mt-4 flex gap-4 text-sm">
          <Link href="/cursos" className="underline-offset-4 hover:underline">
            Ver cursos
          </Link>
          <Link href="/empresas" className="underline-offset-4 hover:underline">
            Ver empresas
          </Link>
        </div>
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
