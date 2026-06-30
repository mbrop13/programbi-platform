import type { Metadata } from "next";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "Tu opinión nos ayuda a mejorar | ProgramBI",
  description:
    "Cuéntanos cómo fue tu experiencia con nuestros cursos de Power BI, Python y SQL. Tu opinión define los próximos cursos que lanzaremos.",
  robots: { index: true, follow: true },
};

export default function FeedbackPage() {
  return <FeedbackForm />;
}
