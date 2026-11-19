import type { ReactNode } from "react";
import "@/app/globals.css";

export default function GestionDatosLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CL">
      <body style={{
        minHeight: "100vh",
        padding: "clamp(1rem, 8vh, 5rem) 0",
        fontFamily: "system-ui, sans-serif",
        background: "#f7f7f4",
        color: "#171716",
      }}>{children}</body>
    </html>
  );
}
