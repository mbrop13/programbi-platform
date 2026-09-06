import type { Metadata } from "next";
import { ReferidosRegistro } from "@/components/referrals/auth-card";

export const metadata: Metadata = {
  title: "Crear cuenta · Referidos",
  description: "Únete al programa de referidos del Pack Adopción BI. 15% al cobro.",
};

export default function Page() {
  return <ReferidosRegistro />;
}
