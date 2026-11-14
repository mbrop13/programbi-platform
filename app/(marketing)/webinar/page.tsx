import type { Metadata } from "next";
import WebinarClient from "./WebinarClient";
import { absoluteUrl, pageOg, tituloSeo } from "@/lib/seo";

const PATH = "/webinar";
const TITLE = tituloSeo("Webinar: de Excel a analista de datos");
const DESCRIPTION =
  "Descubre el roadmap que usan los analistas mejor pagados. Aprende cómo SQL, Power BI, Python e IA pueden transformar tu carrera profesional. Evento en vivo y gratuito.";

const share = pageOg({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  kicker: "Webinar en vivo",
  tags: ["SQL", "Power BI", "Python"],
  alt: TITLE,
});

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(PATH),
    type: "website",
    siteName: "ProgramBI",
    images: share.images,
  },
  twitter: share.twitter,
};

export default function WebinarPage() {
  return <WebinarClient />;
}
