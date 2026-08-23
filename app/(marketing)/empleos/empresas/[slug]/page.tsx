import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ChevronRight, MapPin, Globe, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import JobCard, { CompanyAvatar } from "@/components/empleos/JobCard";
import { mapJobRow } from "@/lib/jobs/queries";
import { COMPANY_SIZE_LABELS } from "@/lib/jobs/types";
import { ogImageUrl } from "@/lib/og/url";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// cache() evita duplicar la query entre generateMetadata y el render
const getCompanyBySlug = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("employer_companies")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();
  return data ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return { title: "Empresa no encontrada" };
  const description = company.description?.slice(0, 160) ?? `Vacantes abiertas en ${company.name}.`;
  return {
    title: `${company.name} — Vacantes`,
    description,
    alternates: { canonical: `/empleos/empresas/${company.slug}` },
    openGraph: {
      title: `${company.name} | Bolsa de Trabajo ProgramBI`,
      description,
      url: `/empleos/empresas/${company.slug}`,
      images: [
        {
          url: ogImageUrl({
            kicker: "Empresa verificada",
            title: company.name,
            description:
              "Contrata talento certificado en la Bolsa de Trabajo de ProgramBI.",
            tags: company.industry ? [company.industry] : undefined,
            verified: true,
            path: `empleos/empresas/${company.slug}`,
          }),
          width: 1200,
          height: 630,
          alt: `${company.name} — Bolsa de Trabajo ProgramBI`,
        },
      ],
    },
  };
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  const supabase = await createClient();
  const { data: jobRows } = await supabase
    .from("jobs")
    .select(`
      id, title, slug, company_id, location_city, location_country, modality,
      employment_type, seniority, description, responsibilities, requirements,
      benefits, skills, salary_min_clp, salary_max_clp, salary_visible,
      apply_via, apply_url, status, published_at, expires_at, views_count,
      applications_count, employer_companies!inner(name, slug, logo_url)
    `)
    .eq("company_id", company.id)
    .eq("status", "published")
    .gt("expires_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  const jobs = (jobRows ?? []).map((row) => mapJobRow(row));

  return (
    <>
      <section className="px-4 pt-12 pb-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-[1400px]">
          <nav className="flex items-center gap-1.5 text-xs text-faint">
            <Link href="/" className="hover:text-mute">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/empleos/vacantes" className="hover:text-mute">Empleos</Link>
            <ChevronRight size={12} />
            <span className="text-mute">{company.name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-start gap-5">
            <CompanyAvatar logoUrl={company.logo_url} name={company.name} size={72} />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {company.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-mute">
                {company.industry && <span>{company.industry}</span>}
                {company.size && (
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={14} strokeWidth={1.8} />
                    {COMPANY_SIZE_LABELS[company.size] ?? company.size}
                  </span>
                )}
                {company.city && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} strokeWidth={1.8} />
                    {company.city}, {company.country}
                  </span>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-ink underline-offset-4 hover:underline"
                  >
                    <Globe size={14} strokeWidth={1.8} />
                    Sitio web
                  </a>
                )}
              </div>
            </div>
          </div>

          {company.description && (
            <p className="mt-6 max-w-[40rem] whitespace-pre-wrap text-base leading-relaxed text-mute">
              {company.description}
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-line px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Vacantes abiertas
            <span className="ml-3 font-mono text-base font-normal text-faint">
              {jobs.length}
            </span>
          </h2>

          {jobs.length === 0 ? (
            <p className="py-16 text-center text-mute">
              Esta empresa no tiene vacantes abiertas por ahora.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
