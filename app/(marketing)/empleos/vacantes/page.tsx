import type { Metadata } from "next";
import EmpleosPageClient from "@/components/empleos/EmpleosPageClient";
import { getPublishedJobs } from "@/lib/jobs/queries";

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
