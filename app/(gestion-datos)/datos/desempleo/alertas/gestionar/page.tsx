import type { Metadata } from "next";
import Link from "next/link";
import { GestionAlertasDesempleo } from "@/components/datos/GestionAlertasDesempleo";
import estilos from "@/components/datos/AlertasDesempleo.module.css";

export const dynamic = "force-static";
export const metadata: Metadata = {
  title: "Gestionar avisos del Observatorio de Desempleo",
  robots: { index: false, follow: true },
  referrer: "no-referrer",
};

export default function GestionAlertasPage() {
  return (
    <main className={estilos.gestion}>
      <p>ProgramBI</p>
      <h1>Alertas de desempleo en Chile</h1>
      <GestionAlertasDesempleo />
      <Link href="/datos/desempleo">Volver al Observatorio de Desempleo</Link>
    </main>
  );
}
