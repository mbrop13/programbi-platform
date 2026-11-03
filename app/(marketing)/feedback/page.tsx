import type { Metadata } from "next";
import FeedbackForm from "./FeedbackForm";
import { tituloSeo } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: tituloSeo("Tu opinión nos ayuda a mejorar") },
  description:
    "Cuéntanos cómo fue tu experiencia con nuestros cursos de Power BI, Python y SQL. Tu opinión define los próximos cursos que lanzaremos.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/feedback" },
};

export default function FeedbackPage() {
  return <FeedbackForm />;
}
