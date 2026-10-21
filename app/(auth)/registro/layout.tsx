import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Crea tu cuenta gratis en ProgramBI y accede a las fechas, los cupos y el material de cada curso.",
};

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  return children;
}
