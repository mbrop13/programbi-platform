"use client";

import Link from "next/link";
import { MapPin, Bookmark, Banknote, Building2, Sparkles } from "lucide-react";
import type { JobPublic } from "@/lib/jobs/types";
import { formatSalaryCLP, jobLocation, timeAgo, EMPLOYMENT_TYPE_LABELS, SENIORITY_LABELS } from "@/lib/jobs/types";
import { getSkillLabel } from "@/lib/data/job-skills";

interface JobCardProps {
  job: JobPublic;
  match?: number | null;
  saved?: boolean;
  onToggleSave?: (jobId: string) => void;
  showSave?: boolean;
}

export function CompanyAvatar({ logoUrl, name, size = 44 }: { logoUrl: string | null; name: string; size?: number }) {
  if (logoUrl) {
    return (
      // Logos de empresas pueden venir de dominios arbitrarios: <img> lazy en vez de next/image
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="shrink-0 rounded-xl border border-line bg-paper object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl border border-line bg-wash text-faint"
      style={{ width: size, height: size }}
    >
      <Building2 size={Math.round(size * 0.45)} strokeWidth={1.8} />
    </div>
  );
}

/** Skeleton con la silueta exacta de JobCard para estados de carga. */
export function JobCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-[22px] border border-line bg-paper p-6" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-wash" />
        <div className="space-y-1.5">
          <div className="h-2.5 w-24 animate-pulse rounded-full bg-wash" />
          <div className="h-2 w-14 animate-pulse rounded-full bg-wash" />
        </div>
      </div>
      <div className="mt-4 h-4 w-4/5 animate-pulse rounded-full bg-wash" />
      <div className="mt-2.5 h-2.5 w-3/5 animate-pulse rounded-full bg-wash" />
      <div className="mt-4 flex gap-1.5">
        <div className="h-6 w-16 animate-pulse rounded-full bg-wash" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-wash" />
        <div className="h-6 w-14 animate-pulse rounded-full bg-wash" />
      </div>
      <div className="mt-auto flex items-center justify-between pt-5">
        <div className="h-3.5 w-28 animate-pulse rounded-full bg-wash" />
        <div className="h-3.5 w-16 animate-pulse rounded-full bg-wash" />
      </div>
    </div>
  );
}

export default function JobCard({ job, match, saved, onToggleSave, showSave = false }: JobCardProps) {
  const salary = job.salary_visible ? formatSalaryCLP(job.salary_min_clp, job.salary_max_clp) : null;
  const visibleSkills = job.skills.slice(0, 4);
  const extraSkills = job.skills.length - visibleSkills.length;

  return (
    <div className="group relative">
      <Link
        href={`/empleos/${job.slug}`}
        className="flex h-full flex-col rounded-[22px] border border-line bg-paper p-6 no-underline transition-all hover:border-ink/20 hover:shadow-[0_8px_30px_rgba(23,23,22,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <CompanyAvatar logoUrl={job.company_logo_url} name={job.company_name} />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-mute">{job.company_name}</p>
              <p className="text-[11px] text-faint">
                {job.published_at ? timeAgo(job.published_at) : "Nueva"}
              </p>
            </div>
          </div>
        </div>

        <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight text-ink">
          {job.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mute">
          {job.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-canvas">
              <Sparkles size={10} />
              Destacada
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} strokeWidth={1.8} />
            {jobLocation(job)}
          </span>
          <span className="text-faint">·</span>
          <span>{EMPLOYMENT_TYPE_LABELS[job.employment_type] ?? job.employment_type}</span>
          <span className="text-faint">·</span>
          <span>{SENIORITY_LABELS[job.seniority] ?? job.seniority}</span>
        </div>

        {visibleSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {visibleSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-wash px-2.5 py-1 text-xs font-medium text-mute"
              >
                {getSkillLabel(skill)}
              </span>
            ))}
            {extraSkills > 0 && (
              <span className="rounded-full bg-wash px-2.5 py-1 text-xs font-medium text-faint">
                +{extraSkills}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-3">
            {salary ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                <Banknote size={15} strokeWidth={2} />
                {salary} <span className="text-xs font-normal text-faint">CLP/mes</span>
              </span>
            ) : (
              <span className="text-xs text-faint">Salario a conversar</span>
            )}
            {typeof match === "number" && match > 0 && (
              <span className="rounded-full border border-line bg-ink/[0.03] px-2.5 py-1 font-mono text-[11px] font-semibold text-ink">
                {match}% match
              </span>
            )}
          </div>
          <span className="text-sm font-semibold text-ink transition-transform group-hover:translate-x-0.5">
            Ver detalle →
          </span>
        </div>
      </Link>

      {showSave && onToggleSave && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave(job.id);
          }}
          aria-label={saved ? "Quitar de guardados" : "Guardar vacante"}
          aria-pressed={!!saved}
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 ${
            saved
              ? "border-ink bg-ink text-canvas"
              : "border-line bg-paper text-faint hover:text-ink"
          }`}
        >
          <Bookmark size={15} strokeWidth={2} fill={saved ? "currentColor" : "none"} />
        </button>
      )}
    </div>
  );
}
