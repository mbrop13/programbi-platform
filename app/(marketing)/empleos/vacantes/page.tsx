import type { Metadata } from "next";
import EmpleosPageClient from "@/components/empleos/EmpleosPageClient";
import { getPublishedJobs } from "@/lib/jobs/queries";
import { ogImageUrl } from "@/lib/og/url";

export const metadata: Metadata = {
  title: "Vacantes",
  description:
    "Encuentra vacantes de datos y programación (Python, Power BI, SQL Server) publicadas por empresas verificadas. Los egresados ProgramBI postulan con certificados verificados.",
  alternates: { canonical: "/empleos/vacantes" },
  openGraph: {
    title: "Vacantes | Bolsa de Trabajo ProgramBI",
    description:
      "Vacantes de datos y programación publicadas por empresas verificadas. Talento con certificados reales.",
    url: "/empleos/vacantes",
    images: [
      {
        url: ogImageUrl({
          kicker: "Vacantes verificadas",
          title: "Vacantes de datos y tecnología",
          description:
            "Publicadas por empresas verificadas. Postula con certificados que respaldan lo que sabes hacer.",
          tags: ["Python", "Power BI", "SQL Server"],
          verified: true,
          path: "empleos/vacantes",
        }),
        width: 1200,
        height: 630,
        alt: "Vacantes de la Bolsa de Trabajo ProgramBI",
      },
    ],
  },
};

export const dynamic = "force-dynamic";

/** Listado público de vacantes (board). Durante el pre-lanzamiento vive en /empleos/vacantes. */
export default async function VacantesPage() {
  let initialJobs: Awaited<ReturnType<typeof getPublishedJobs>>["jobs"] = [];
  let initialTotal = 0;
  try {
    const result = await getPublishedJobs({ perPage: 12 });
    initialJobs = result.jobs;
    initialTotal = result.total;
  } catch (err) {
    console.error("Error loading initial jobs:", err);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bolsa de Trabajo ProgramBI",
    description: "Vacantes de datos y programación en Chile",
    numberOfItems: initialTotal,
    itemListElement: initialJobs.slice(0, 10).map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://programbi.com/empleos/${job.slug}`,
      name: `${job.title} — ${job.company_name}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EmpleosPageClient initialJobs={initialJobs} initialTotal={initialTotal} />
    </>
  );
}
