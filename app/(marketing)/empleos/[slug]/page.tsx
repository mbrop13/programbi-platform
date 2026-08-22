import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Briefcase,
  Banknote,
  Building2,
  Calendar,
  Eye,
  Check,
  ChevronRight,
  ListChecks,
  Gift,
  Globe,
} from "lucide-react";
import ApplyPanel from "@/components/empleos/ApplyPanel";
import JobCard, { CompanyAvatar } from "@/components/empleos/JobCard";
import JobMarkdown from "@/components/empleos/JobMarkdown";
import ShareBox from "@/components/empleos/ShareBox";
import { getPublishedJobBySlug, getSimilarJobs, incrementJobViews } from "@/lib/jobs/queries";
import { getSkillLabel } from "@/lib/data/job-skills";
import {
  formatSalaryCLP,
  jobLocation,
  timeAgo,
  EMPLOYMENT_TYPE_LABELS,
  MODALITY_LABELS,
  SENIORITY_LABELS,
} from "@/lib/jobs/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) return { title: "Vacante no encontrada" };
  return {
    title: `${job.title} — ${job.company_name}`,
    description: job.description.slice(0, 160).replace(/\n/g, " "),
    alternates: { canonical: `/empleos/${job.slug}` },
    openGraph: {
      title: `${job.title} — ${job.company_name}`,
      description: job.description.slice(0, 160).replace(/\n/g, " "),
      url: `/empleos/${job.slug}`,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) notFound();

  await incrementJobViews(job.id);
  const similar = await getSimilarJobs(job, 3);
  const salary = job.salary_visible ? formatSalaryCLP(job.salary_min_clp, job.salary_max_clp) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.published_at,
    validThrough: job.expires_at,
    employmentType: job.employment_type.toUpperCase(),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company_name,
      logo: job.company_logo_url ?? undefined,
    },
    jobLocationType: job.modality === "remoto" ? "TELECOMMUTE" : undefined,
    jobLocation:
      job.modality === "remoto"
        ? undefined
        : {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: job.location_city ?? "Chile",
              addressCountry: "CL",
            },
          },
    baseSalary: job.salary_visible
      ? {
          "@type": "MonetaryAmount",
          currency: "CLP",
          value: {
            "@type": "QuantitativeValue",
            minValue: job.salary_min_clp ?? undefined,
            maxValue: job.salary_max_clp ?? undefined,
            unitText: "MONTH",
          },
        }
      : undefined,
    skills: job.skills.map(getSkillLabel).join(", "),
    experienceRequirements: SENIORITY_LABELS[job.seniority] ?? job.seniority,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="px-4 pt-12 pb-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="mx-auto max-w-[1400px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-faint">
            <Link href="/" className="hover:text-mute">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/empleos/vacantes" className="hover:text-mute">Empleos</Link>
            <ChevronRight size={12} />
            <span className="text-mute">{job.company_name}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div className="flex min-w-0 items-start gap-4">
              <CompanyAvatar logoUrl={job.company_logo_url} name={job.company_name} size={64} />
              <div className="min-w-0">
                <Link
                  href={`/empleos/empresas/${job.company_slug}`}
                  className="text-sm font-semibold text-mute hover:text-ink"
                >
                  {job.company_name}
                </Link>
                <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
                  {job.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-mute">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} strokeWidth={1.8} />
                    {jobLocation(job)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase size={14} strokeWidth={1.8} />
                    {EMPLOYMENT_TYPE_LABELS[job.employment_type]} · {SENIORITY_LABELS[job.seniority]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-faint">
                    <Calendar size={14} strokeWidth={1.8} />
                    {job.published_at ? timeAgo(job.published_at) : "Nueva"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Contenido */}
          <div className="space-y-10 lg:col-span-7">
            {job.skills.length > 0 && (
              <div>
                <h2 className="text-xl font-bold tracking-tight text-ink">Skills requeridas</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-wash px-3 py-1.5 text-sm font-medium text-mute"
                    >
                      {getSkillLabel(skill)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink">Descripción</h2>
              <div className="mt-4 text-base">
                <JobMarkdown content={job.description} />
              </div>
            </div>

            {job.responsibilities.length > 0 && (
              <div>
                <h2 className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-ink">
                  <ListChecks size={19} strokeWidth={2} />
                  Responsabilidades
                </h2>
                <ul className="mt-4 space-y-3">
                  {job.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-mute">
                      <Check size={17} strokeWidth={2.2} className="mt-1 shrink-0 text-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements.length > 0 && (
              <div>
                <h2 className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-ink">
                  <ListChecks size={19} strokeWidth={2} />
                  Requisitos
                </h2>
                <ul className="mt-4 space-y-3">
                  {job.requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-mute">
                      <Check size={17} strokeWidth={2.2} className="mt-1 shrink-0 text-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits.length > 0 && (
              <div>
                <h2 className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-ink">
                  <Gift size={19} strokeWidth={2} />
                  Beneficios
                </h2>
                <ul className="mt-4 space-y-3">
                  {job.benefits.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-mute">
                      <Check size={17} strokeWidth={2.2} className="mt-1 shrink-0 text-ink" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Aside sticky */}
          <aside className="lg:col-span-5">
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-[22px] border border-line bg-paper p-6 shadow-[0_20px_60px_rgba(23,23,22,0.06)]">
                <ApplyPanel job={job} />
                <div className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
                  {salary && (
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-mute">
                        <Banknote size={15} strokeWidth={1.8} />
                        Salario
                      </span>
                      <span className="font-semibold text-ink">
                        {salary} CLP/mes
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-mute">Modalidad</span>
                    <span className="font-medium text-ink">
                      {MODALITY_LABELS[job.modality] ?? job.modality}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-mute">
                      <Eye size={15} strokeWidth={1.8} />
                      Vistas
                    </span>
                    <span className="font-mono text-[13px] text-ink">{job.views_count + 1}</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-line pt-6">
                  <ShareBox title={job.title} />
                </div>
              </div>

              {/* Tarjeta empresa */}
              <div className="rounded-[22px] border border-line bg-paper p-6">
                <div className="flex items-center gap-3">
                  <CompanyAvatar logoUrl={job.company_logo_url} name={job.company_name} size={44} />
                  <div className="min-w-0">
                    <Link
                      href={`/empleos/empresas/${job.company_slug}`}
                      className="text-base font-bold tracking-tight text-ink hover:underline"
                    >
                      {job.company_name}
                    </Link>
                    <p className="inline-flex items-center gap-1 text-xs text-faint">
                      <Building2 size={12} />
                      Empresa verificada
                    </p>
                  </div>
                </div>
                <Link
                  href={`/empleos/empresas/${job.company_slug}`}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full border border-line bg-paper text-sm font-medium text-ink transition-colors hover:bg-wash"
                >
                  <Globe size={14} className="mr-2" />
                  Ver perfil y vacantes
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Similares */}
      {similar.length > 0 && (
        <section className="border-t border-line px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Vacantes similares
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <JobCard key={s.id} job={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
