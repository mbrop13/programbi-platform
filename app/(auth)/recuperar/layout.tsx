import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description:
    "¿Olvidaste tu contraseña de ProgramBI? Pide un enlace y vuelve a entrar a tu Campus Virtual.",
};

export default function RecuperarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
