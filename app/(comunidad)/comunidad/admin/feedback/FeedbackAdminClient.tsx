"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Star,
  ThumbsUp,
  MessageSquare,
  Download,
  Search,
  Smile,
  Meh,
  Frown,
  BarChart3,
  Sparkles,
  Calendar,
  Mail,
} from "lucide-react";
import type { FeedbackAnalytics } from "@/lib/supabase/feedback";

interface Props {
  analytics: FeedbackAnalytics;
}

export default function FeedbackAdminClient({ analytics }: Props) {
  const [query, setQuery] = useState("");

  const filteredTestimonials = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return analytics.testimonials;
    return analytics.testimonials.filter(
      (t) =>
        (t.feedback ?? "").toLowerCase().includes(q) ||
        (t.result ?? "").toLowerCase().includes(q) ||
        (t.name ?? "").toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
    );
  }, [analytics.testimonials, query]);

  const handleExportCSV = () => {
    const headers = [
      "fecha", "nombre", "email", "nps", "general",
      "contenido", "instructor", "practico", "materiales", "soporte", "plataforma", "precio",
      "cursos_tomados", "anio_ultimo_curso", "aplico", "resultados", "cursos_deseados", "formatos", "comentario",
    ];
    const rows = analytics.recent.map((r) => [
      r.submitted_at,
      r.name ?? "",
      r.email,
      r.nps_score ?? "",
      r.overall_rating ?? "",
      r.rating_content_quality ?? "",
      r.rating_instructor_clarity ?? "",
      r.rating_practical_use ?? "",
      r.rating_materials ?? "",
      r.rating_support ?? "",
      r.rating_platform ?? "",
      r.rating_value_price ?? "",
      (r.courses_taken ?? []).join("|"),
      r.last_course_year ?? "",
      r.applied_knowledge ?? "",
      (r.concrete_results ?? "").replace(/\n/g, " "),
      (r.desired_courses ?? []).join("|"),
      (r.preferred_formats ?? []).join("|"),
      (r.open_feedback ?? "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-programbi-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const npsColor =
    analytics.npsScore >= 50
      ? "text-accent-emerald"
      : analytics.npsScore >= 0
      ? "text-accent-yellow"
      : "text-red-500";

  return (
    <div className="min-h-screen bg-surface-1">
      {/* Header */}
      <header className="bg-white border-b border-surface-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/comunidad/inicio"
              className="p-2 rounded-lg hover:bg-surface-2 text-text-secondary"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-text-primary font-display flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-blue" />
                Encuesta de satisfacción
              </h1>
              <p className="text-xs text-text-muted">Analítica de feedback de alumnos</p>
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            className="hidden sm:inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPIs principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="NPS Score"
            value={`${analytics.npsScore > 0 ? "+" : ""}${analytics.npsScore}`}
            sub={`${analytics.npsPromoters + analytics.npsPassives + analytics.npsDetractors} respuestas`}
            accent="blue"
          />
          <KpiCard
            icon={<MessageSquare className="w-5 h-5" />}
            label="Total respuestas"
            value={String(analytics.total)}
            sub={`${analytics.last7Days} en los últimos 7 días`}
            accent="purple"
          />
          <KpiCard
            icon={<Users className="w-5 h-5" />}
            label="Alumnos únicos"
            value={String(analytics.totalUniqueEmails)}
            sub="por correo"
            accent="emerald"
          />
          <KpiCard
            icon={<Star className="w-5 h-5" />}
            label="Satisfacción media"
            value={analytics.avgOverall ? analytics.avgOverall.toFixed(1) : "—"}
            sub="sobre 5 ⭐"
            accent="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* NPS detalle */}
          <Card title="Net Promoter Score (NPS)" icon={<TrendingUp className="w-4 h-4" />} className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="text-center">
                <div className={`text-5xl font-bold ${npsColor}`}>
                  {analytics.npsScore > 0 ? "+" : ""}
                  {analytics.npsScore}
                </div>
                <div className="text-xs text-text-muted mt-1">rango -100 a +100</div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3 w-full">
                <NpsBucket
                  icon={<Smile className="w-5 h-5" />}
                  label="Promotores"
                  count={analytics.npsPromoters}
                  color="emerald"
                />
                <NpsBucket
                  icon={<Meh className="w-5 h-5" />}
                  label="Pasivos"
                  count={analytics.npsPassives}
                  color="yellow"
                />
                <NpsBucket
                  icon={<Frown className="w-5 h-5" />}
                  label="Detractores"
                  count={analytics.npsDetractors}
                  color="red"
                />
              </div>
            </div>
            {/* Distribución 0-10 */}
            <div>
              <p className="text-xs text-text-muted mb-2">Distribución de puntuaciones</p>
              <div className="flex items-end gap-1 h-28">
                {analytics.npsBreakdown.map((b) => {
                  const max = Math.max(1, ...analytics.npsBreakdown.map((x) => x.count));
                  const h = (b.count / max) * 100;
                  let bg = "bg-red-400";
                  if (b.score >= 9) bg = "bg-accent-emerald";
                  else if (b.score >= 7) bg = "bg-accent-yellow";
                  return (
                    <div key={b.score} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <span className="text-[10px] text-text-muted">{b.count || ""}</span>
                      <div
                        className={`w-full rounded-t ${bg} transition-all min-h-[2px]`}
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[10px] font-medium text-text-secondary">{b.score}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Tendencia */}
          <Card title="Respuestas (30 días)" icon={<Calendar className="w-4 h-4" />}>
            <Sparkline data={analytics.trend.map((t) => t.count)} />
            <div className="mt-3 text-sm text-text-secondary">
              <span className="font-bold text-text-primary">{analytics.last7Days}</span> en los últimos 7 días
            </div>
          </Card>
        </div>

        {/* Evaluación por dimensión */}
        <Card title="Evaluación por dimensión" icon={<Star className="w-4 h-4" />}>
          <div className="space-y-4">
            {analytics.avgRatings.map((r) => (
              <div key={r.label} className="flex items-center gap-4">
                <div className="w-44 flex-shrink-0 text-sm font-medium text-text-secondary">
                  {r.label}
                </div>
                <div className="flex-1 bg-surface-2 rounded-full h-3 overflow-hidden">
                  {r.value !== null ? (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(r.value / 5) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-dark"
                    />
                  ) : null}
                </div>
                <div className="w-12 text-right text-sm font-semibold text-text-primary">
                  {r.value !== null ? r.value.toFixed(1) : "—"}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cursos deseados */}
          <Card title="Cursos que quieren los alumnos" icon={<Sparkles className="w-4 h-4" />}>
            {analytics.desiredCoursesCounts.length === 0 ? (
              <EmptyHint />
            ) : (
              <div className="space-y-2.5">
                {analytics.desiredCoursesCounts.slice(0, 12).map((c) => {
                  const max = Math.max(...analytics.desiredCoursesCounts.map((x) => x.count));
                  return (
                    <BarRow key={c.name} label={c.name} count={c.count} max={max} accent="purple" />
                  );
                })}
              </div>
            )}
          </Card>

          {/* Cursos tomados + formatos */}
          <Card title="Cursos tomados" icon={<ThumbsUp className="w-4 h-4" />}>
            {analytics.coursesTakenCounts.length === 0 ? (
              <EmptyHint />
            ) : (
              <div className="space-y-2.5 mb-6">
                {analytics.coursesTakenCounts.map((c) => {
                  const max = Math.max(...analytics.coursesTakenCounts.map((x) => x.count));
                  return (
                    <BarRow key={c.name} label={c.name} count={c.count} max={max} accent="blue" />
                  );
                })}
              </div>
            )}
            <p className="text-sm font-semibold text-text-primary mb-2">Formatos preferidos</p>
            {analytics.preferredFormatsCounts.length === 0 ? (
              <p className="text-sm text-text-muted">Sin datos.</p>
            ) : (
              <div className="space-y-2">
                {analytics.preferredFormatsCounts.map((c) => {
                  const max = Math.max(...analytics.preferredFormatsCounts.map((x) => x.count));
                  return (
                    <BarRow key={c.name} label={c.name} count={c.count} max={max} accent="emerald" />
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Impacto profesional */}
        <Card title="Impacto profesional" icon={<TrendingUp className="w-4 h-4" />}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {analytics.appliedCounts.length === 0 ? (
              <EmptyHint />
            ) : (
              analytics.appliedCounts
                .sort((a, b) => {
                  const order = ["mucho", "algo", "poco", "no"];
                  return order.indexOf(a.value) - order.indexOf(b.value);
                })
                .map((a) => (
                  <div
                    key={a.value}
                    className="bg-surface-1 rounded-xl p-4 text-center border border-surface-2"
                  >
                    <div className="text-2xl font-bold text-text-primary">{a.count}</div>
                    <div className="text-xs text-text-muted mt-1">{a.label}</div>
                  </div>
                ))
            )}
          </div>
        </Card>

        {/* Testimonios / comentarios */}
        <Card
          title={`Comentarios y testimonios (${analytics.testimonials.length})`}
          icon={<MessageSquare className="w-4 h-4" />}
        >
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en comentarios, resultados o email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-3 bg-surface-1 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          {filteredTestimonials.length === 0 ? (
            <EmptyHint text="Aún no hay comentarios." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filteredTestimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-surface-1 rounded-xl p-4 border border-surface-2"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-brand-blue-light text-brand-blue-dark flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {(t.name || t.email)[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {t.name || "Anónimo"}
                        </p>
                        <p className="text-xs text-text-muted truncate">{t.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {t.nps !== null && (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            t.nps >= 9
                              ? "bg-accent-emerald/15 text-accent-emerald"
                              : t.nps <= 6
                              ? "bg-red-100 text-red-600"
                              : "bg-accent-yellow/15 text-accent-copper"
                          }`}
                        >
                          {t.nps}
                        </span>
                      )}
                    </div>
                  </div>
                  {t.result && (
                    <p className="text-sm text-text-primary bg-accent-emerald/5 border-l-2 border-accent-emerald/40 pl-3 py-1.5 mb-2 italic">
                      🏆 {t.result}
                    </p>
                  )}
                  {t.feedback && (
                    <p className="text-sm text-text-secondary whitespace-pre-wrap">{t.feedback}</p>
                  )}
                  <p className="text-xs text-text-faint mt-2">
                    {new Date(t.submittedAt).toLocaleDateString("es", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Últimas respuestas (tabla compacta) */}
        <Card title={`Últimas respuestas (${analytics.recent.length})`} icon={<Mail className="w-4 h-4" />}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted border-b border-surface-2">
                  <th className="py-2 px-2 font-medium">Fecha</th>
                  <th className="py-2 px-2 font-medium">Email</th>
                  <th className="py-2 px-2 font-medium">NPS</th>
                  <th className="py-2 px-2 font-medium">Gen.</th>
                  <th className="py-2 px-2 font-medium">Cursos</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recent.slice(0, 20).map((r) => (
                  <tr key={r.id} className="border-b border-surface-2 last:border-0">
                    <td className="py-2 px-2 text-text-muted whitespace-nowrap">
                      {new Date(r.submitted_at).toLocaleDateString("es")}
                    </td>
                    <td className="py-2 px-2 text-text-primary truncate max-w-[200px]">{r.email}</td>
                    <td className="py-2 px-2">
                      {r.nps_score != null ? (
                        <span
                          className={`font-bold ${
                            r.nps_score >= 9
                              ? "text-accent-emerald"
                              : r.nps_score <= 6
                              ? "text-red-500"
                              : "text-accent-copper"
                          }`}
                        >
                          {r.nps_score}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2 px-2 text-text-secondary">
                      {r.overall_rating ? `${r.overall_rating}⭐` : "—"}
                    </td>
                    <td className="py-2 px-2 text-text-muted truncate max-w-[200px]">
                      {(r.courses_taken ?? []).join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="sm:hidden">
          <button
            onClick={handleExportCSV}
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-sm font-medium px-4 py-3 rounded-lg"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </main>
    </div>
  );
}

// ============================================
// Sub-componentes
// ============================================
const accentMap: Record<string, { bg: string; text: string; bar: string }> = {
  blue: { bg: "bg-brand-blue-light", text: "text-brand-blue-dark", bar: "from-brand-blue to-brand-blue-dark" },
  purple: { bg: "bg-accent-purple/10", text: "text-accent-purple", bar: "from-accent-purple to-indigo-600" },
  emerald: { bg: "bg-accent-emerald/10", text: "text-accent-emerald", bar: "from-accent-emerald to-emerald-600" },
  yellow: { bg: "bg-accent-yellow/10", text: "text-accent-copper", bar: "from-accent-yellow to-amber-500" },
};

function KpiCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: keyof typeof accentMap | string;
}) {
  const a = accentMap[accent] ?? accentMap.blue;
  return (
    <div className="bg-white rounded-2xl border border-surface-3 p-5 shadow-sm">
      <div className={`inline-flex p-2 rounded-lg ${a.bg} ${a.text} mb-3`}>{icon}</div>
      <div className="text-2xl font-bold text-text-primary">{value}</div>
      <div className="text-sm text-text-muted">{label}</div>
      {sub && <div className="text-xs text-text-faint mt-1">{sub}</div>}
    </div>
  );
}

function Card({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-white rounded-2xl border border-surface-3 p-6 shadow-sm ${className}`}>
      <h2 className="text-base font-bold text-text-primary font-display flex items-center gap-2 mb-4">
        {icon && <span className="text-brand-blue">{icon}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

function NpsBucket({
  icon,
  label,
  count,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: keyof typeof accentMap | string;
}) {
  const a = accentMap[color] ?? accentMap.blue;
  return (
    <div className="text-center bg-surface-1 rounded-xl p-3">
      <div className={`inline-flex ${a.text} mb-1`}>{icon}</div>
      <div className="text-xl font-bold text-text-primary">{count}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}

function BarRow({
  label,
  count,
  max,
  accent,
}: {
  label: string;
  count: number;
  max: number;
  accent: keyof typeof accentMap | string;
}) {
  const a = accentMap[accent] ?? accentMap.blue;
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 text-sm text-text-secondary truncate">{label}</div>
      <div className="flex-[2] bg-surface-2 rounded-full h-2.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full bg-gradient-to-r ${a.bar}`}
        />
      </div>
      <div className="w-6 text-right text-sm font-semibold text-text-primary">{count}</div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  return (
    <div className="flex items-end gap-0.5 h-24">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 bg-brand-blue/30 rounded-t hover:bg-brand-blue transition-colors min-h-[2px]"
          style={{ height: `${(v / max) * 100}%` }}
          title={`${v}`}
        />
      ))}
    </div>
  );
}

function EmptyHint({ text = "Aún no hay datos suficientes." }: { text?: string }) {
  return <p className="text-sm text-text-muted py-6 text-center">{text}</p>;
}
