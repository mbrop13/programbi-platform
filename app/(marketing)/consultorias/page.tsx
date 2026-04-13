import type { Metadata } from "next";
import ConsultoriasClient from "./ConsultoriasClient";

export const metadata: Metadata = {
  title: "Consultorías",
  description: "Servicios de consultoría en análisis de datos, dashboards personalizados y automatización de procesos para empresas.",
};

export default function ConsultoriasPage() {
  return <ConsultoriasClient />;
}
