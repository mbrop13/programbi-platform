"use client";

import { useEffect, useState } from "react";
import { Bookmark, Bell, Briefcase, Building2, Search, UserRound, CheckCircle2, Clock, XCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import JobSearchPanel from "./empleos/JobSearchPanel";
import MyApplications from "./empleos/MyApplications";
import SavedJobs from "./empleos/SavedJobs";
import JobAlerts from "./empleos/JobAlerts";
import CandidateProfileForm from "./empleos/CandidateProfileForm";
import EmployerDashboard from "./empleos/EmployerDashboard";

type Section = "buscar" | "postulaciones" | "guardados" | "alertas" | "perfil" | "empresa";

export default function EmpleosTab() {
  const [section, setSection] = useState<Section>("buscar");
  const [isEmployer, setIsEmployer] = useState(false);
  const [featureResult, setFeatureResult] = useState<"ok" | "pending" | "error" | null>(null);

  useEffect(() => {
    // Navegación directa desde la página pública (ej. "completar perfil para postular")
    const target = sessionStorage.getItem("empleos-section");
    if (target) {
      sessionStorage.removeItem("empleos-section");
      setSection(target as Section);
    }
    // ¿Pertenece a una empresa? (incluso pendiente: mostramos su estado)
    fetch("/api/employer/verify")
      .then((r) => r.json())
      .then((data) => setIsEmployer(!!data.membership?.company))
      .catch(() => {});
  }, []);

  // Retorno del pago de vacante destacada (Flow)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const feature = params.get("feature");
    if (feature && ["ok", "pending", "error"].includes(feature)) {
      setFeatureResult(feature as "ok" | "pending" | "error");
      params.delete("feature");
      const clean = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState(null, "", clean);
      const t = setTimeout(() => setFeatureResult(null), 8000);
      return () => clearTimeout(t);
    }
  }, []);

  const sections: Array<{ id: Section; label: string; icon: LucideIcon }> = [
    { id: "buscar", label: "Buscar vacantes", icon: Search },
    { id: "postulaciones", label: "Mis postulaciones", icon: Briefcase },
    { id: "guardados", label: "Guardadas", icon: Bookmark },
    { id: "alertas", label: "Alertas", icon: Bell },
    { id: "perfil", label: "Mi perfil laboral", icon: UserRound },
    ...(isEmployer ? [{ id: "empresa" as Section, label: "Panel de empresa", icon: Building2 }] : []),
  ];

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-text">Bolsa de Trabajo</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Vacantes de empresas verificadas · tus certificados se adjuntan automáticamente al postular.
          </p>
        </div>
        <a
          href="/empleos/vacantes"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center rounded-full border border-border-strong px-4 text-xs font-semibold text-text hover:bg-surface-hover"
        >
          Ver bolsa pública ↗
        </a>
      </div>

      {featureResult && (
        <div
          className={`mb-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium ${
            featureResult === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400"
              : featureResult === "pending"
                ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-400"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
          }`}
          role="status"
        >
          {featureResult === "ok" ? (
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          ) : featureResult === "pending" ? (
            <Clock size={16} className="mt-0.5 shrink-0" />
          ) : (
            <XCircle size={16} className="mt-0.5 shrink-0" />
          )}
          <span>
            {featureResult === "ok"
              ? "¡Pago recibido! Tu vacante ya está destacada."
              : featureResult === "pending"
                ? "El pago está en proceso. Te avisaremos cuando se confirme el destacado."
                : "El pago no se completó. Puedes volver a intentarlo desde «Destacar»."}
          </span>
        </div>
      )}

      <div className="mb-6 flex gap-1.5 overflow-x-auto rounded-full bg-surface-hover p-1" role="tablist" aria-label="Secciones de la Bolsa de Trabajo">
        {sections.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={section === s.id}
            onClick={() => setSection(s.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
              section === s.id
                ? "bg-surface text-text shadow-sm"
                : "text-text-secondary hover:text-text"
            )}
          >
            <s.icon size={14} />
            {s.label}
          </button>
        ))}
      </div>

      {section === "buscar" && <JobSearchPanel />}
      {section === "postulaciones" && <MyApplications />}
      {section === "guardados" && <SavedJobs />}
      {section === "alertas" && <JobAlerts />}
      {section === "perfil" && <CandidateProfileForm />}
      {section === "empresa" && <EmployerDashboard />}
    </div>
  );
}
