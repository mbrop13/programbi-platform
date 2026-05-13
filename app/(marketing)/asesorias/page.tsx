import type { Metadata } from "next";
import AsesoriasClient from "./AsesoriasClient";

export const metadata: Metadata = {
  title: "Asesorías",
  description: "Servicios de asesoría en análisis de datos, dashboards personalizados y automatización de procesos para empresas y particulares.",
};

export default function AsesoriasPage() {
  return <AsesoriasClient />;
}
