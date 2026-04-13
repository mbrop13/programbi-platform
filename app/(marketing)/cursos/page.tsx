import type { Metadata } from "next";
import CursosPageClient from "./CursosPageClient";

export const metadata: Metadata = {
  title: "Cursos",
  description: "Explora todos nuestros programas de capacitación en Power BI, Python, SQL, Excel y más. Encuentra el curso perfecto para tu carrera profesional.",
};

export default function CursosPage() {
  return <CursosPageClient />;
}
