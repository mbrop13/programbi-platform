import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Entra a tu Campus Virtual de ProgramBI para ver fechas, cupos y el valor de la próxima cohorte.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
