import type { Metadata } from "next";
import { unstable_rethrow } from "next/navigation";
import VacantesBoard from "@/components/empleos/VacantesBoard";
import { getPublishedJobs } from "@/lib/jobs/queries";
import { ogImageUrl } from "@/lib/og/url";
import { absoluteUrl, breadcrumbJsonLd, jsonLdString, twitterShare } from "@/lib/seo";


const TITLE = "Vacantes";
const DESCRIPTION =
  "Encuentra vacantes de datos y programación (Python, Power BI, SQL Server) publicadas por empresas verificadas. Los egresados ProgramBI postulan con certificados verificados.";

const ogImage = ogImageUrl({
  kicker: "Vacantes verificadas",
  title: "Vacantes de datos y tecnología",
  description:
    "Publicadas por empresas verificadas. Postula con certificados que respaldan lo que sabes hacer.",
  tags: ["Python", "Power BI", "SQL Server"],
  verified: true,
  path: "empleos/vacantes",
});

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/empleos/vacantes" },
  openGraph: {
    title: "Vacantes | Bolsa de Trabajo ProgramBI",
    description:
      "Vacantes de datos y programación publicadas por empresas verificadas. Talento con certificados reales.",
    url: "/empleos/vacantes",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Vacantes de la Bolsa de Trabajo ProgramBI",
      },
    ],
  },
  twitter: twitterShare(
    "Vacantes | Bolsa de Trabajo ProgramBI",
    "Vacantes de datos y programación publicadas por empresas verificadas. Talento con certificados reales.",
    ogImage
  ),
};

export const revalidate = 60;

/** Listado público de vacantes (board). Durante el pre-lanzamiento vive en /empleos/vacantes. */
export default async function VacantesPage() {
  let initialJobs: Awaited<ReturnType<typeof getPublishedJobs>>["jobs"] = [];
  let initialTotal = 0;
  try {
    const result = await getPublishedJobs({ perPage: 12 });
    initialJobs = result.jobs;
    initialTotal = result.total;
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error loading initial jobs:", err);
  }

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bolsa de Trabajo ProgramBI",
    description: "Vacantes de datos y programación en Chile",
    numberOfItems: initialTotal,
    itemListElement: initialJobs.slice(0, 10).map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/empleos/${job.slug}`),
      name: `${job.title} — ${job.company_name}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(listJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Inicio", path: "/" },
              { name: "Empleos", path: "/empleos" },
              { name: "Vacantes", path: "/empleos/vacantes" },
            ])
          ),
        }}
      />
      <VacantesBoard jobs={initialJobs} total={initialTotal} />
    </>
  );
}
