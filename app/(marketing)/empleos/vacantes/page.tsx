import type { Metadata } from "next";
import { unstable_rethrow } from "next/navigation";
import EmpleosPageClient from "@/components/empleos/EmpleosPageClient";
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

export const dynamic = "force-dynamic";

type Search = Promise<{
  q?: string | string[];
  modality?: string | string[];
  seniority?: string | string[];
  employment_type?: string | string[];
  skills?: string | string[];
  sort?: string | string[];
}>;

function one(v?: string | string[]) {
  return Array.isArray(v) ? v[0] ?? "" : v ?? "";
}

function csv(v?: string | string[]) {
  return one(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Listado público de vacantes (board). Durante el pre-lanzamiento vive en /empleos/vacantes. */
export default async function VacantesPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const initialFilters = {
    q: one(sp.q),
    modality: csv(sp.modality),
    seniority: csv(sp.seniority),
    employmentType: csv(sp.employment_type),
    skills: csv(sp.skills),
    sort: (one(sp.sort) === "salary" ? "salary" : "recent") as "recent" | "salary",
  };

  let initialJobs: Awaited<ReturnType<typeof getPublishedJobs>>["jobs"] = [];
  let initialTotal = 0;
  try {
    const result = await getPublishedJobs({
      q: initialFilters.q || undefined,
      modality: initialFilters.modality,
      seniority: initialFilters.seniority,
      employment_type: initialFilters.employmentType,
      skills: initialFilters.skills,
      sort: initialFilters.sort,
      perPage: 12,
    });
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
      <EmpleosPageClient
        initialJobs={initialJobs}
        initialTotal={initialTotal}
        initialFilters={initialFilters}
      />
    </>
  );
}
