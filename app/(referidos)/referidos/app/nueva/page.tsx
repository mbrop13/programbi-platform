import { IntroForm } from "@/components/referrals/app/intro-form";

export const metadata = { title: "Nueva intro" };

export default function NuevaIntroPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Nueva intro</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Controller / Control de Gestión / gerencia con dolor Excel. El equipo califica a mano.
      </p>
      <IntroForm />
    </div>
  );
}
