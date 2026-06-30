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
  Target,
  Award,
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
      ? "text-accent-copper"
      : "text-red-500";

  const npsLabel =
    analytics.npsScore >= 50
      ? "Excelente"
      : analytics.npsScore >= 20
      ? "Bueno"
      : analytics.npsScore >= 0
      ? "Aceptable"
      : "Necesita mejorar";

  return (
    <div className="min-h-screen bg-surface-1">
      {/* ===== Header ===== */}
      <header className="bg-white border-b border-surface-3 sticky top-0 z-30 backdrop-blur-md bg-white/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/comunidad/inicio"
              className="p-2 rounded-lg hover:bg-surface-2 text-text-secondary transition-colors"
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
            className="hidden sm:inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-brand-blue/20"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ===== KPIs principales ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="NPS Score"
            value={`${analytics.npsScore > 0 ? "+" : ""}${analytics.npsScore}`}
            sub={npsLabel}
            accent="blue"
            index={0}
          />
          <KpiCard
            icon={<MessageSquare className="w-5 h-5" />}
            label="Total respuestas"
            value={String(analytics.total)}
            sub={`${analytics.last7Days} últimos 7 días`}
            accent="purple"
            index={1}
          />
          <KpiCard
            icon={<Users className="w-5 h-5" />}
            label="Alumnos únicos"
            value={String(analytics.totalUniqueEmails)}
            sub="por correo"
            accent="emerald"
            index={2}
          />
          <KpiCard
            icon={<Star className="w-5 h-5" />}
            label="Satisfacción media"
            value={analytics.avgOverall ? analytics.avgOverall.toFixed(1) : "—"}
            sub="sobre 5 ⭐"
            accent="yellow"
            index={3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ===== NPS detalle ===== */}
          <Panel
            title="Net Promoter Score (NPS)"
            icon={<TrendingUp className="w-4 h-4" />}
            className="lg:col-span-2"
            index={1}
          >
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="text-center relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className={`text-6xl font-black ${npsColor} font-display leading-none`}
                >
                  {analytics.npsScore > 0 ? "+" : ""}
                  {analytics.npsScore}
                </motion.div>
                <div className="text-xs text-text-muted mt-2">rango -100 a +100</div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3 w-full">
                <NpsBucket icon={<Smile className="w-5 h-5" />} label="Promotores" count={analytics.npsPromoters} color="emerald" />
                <NpsBucket icon={<Meh className="w-5 h-5" />} label="Pasivos" count={analytics.npsPassives} color="yellow" />
                <NpsBucket icon={<Frown className="w-5 h-5" />} label="Detractores" count={analytics.npsDetractors} color="red" />
              </div>
            </div>
            {/* Distribución 0-10 */}
            <div>
              <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Distribución de puntuaciones</p>
              <div className="flex items-end gap-1.5 h-32">
                {analytics.npsBreakdown.map((b, i) => {
                  const max = Math.max(1, ...analytics.npsBreakdown.map((x) => x.count));
                  const h = (b.count / max) * 100;
                  let bg = "from-red-400 to-red-500";
                  if (b.score >= 9) bg = "from-accent-emerald to-emerald-600";
                  else if (b.score >= 7) bg = "from-accent-yellow to-amber-500";
                  else bg = "from-red-400 to-red-500";
                  return (
                    <div key={b.score} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[10px] text-text-muted font-medium opacity-0 group-hover:opacity-100 transition-opacity">{b.count}</span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.04, duration: 0.5 }}
                        className={`w-full rounded-t bg-gradient-to-t ${bg} min-h-[3px] hover:opacity-80 transition-opacity`}
                      />
                      <span className="text-[11px] font-semibold text-text-secondary">{b.score}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>

          {/* ===== Tendencia ===== */}
          <Panel title="Respuestas (30 días)" icon={<Calendar className="w-4 h-4" />} index={2}>
            <Sparkline data={analytics.trend.map((t) => t.count)} />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-surface-1 rounded-xl p-3 text-center border border-surface-2">
                <div className="text-2xl font-bold text-brand-blue">{analytics.last7Days}</div>
                <div className="text-xs text-text-muted">Últimos 7 días</div>
              </div>
              <div className="bg-surface-1 rounded-xl p-3 text-center border border-surface-2">
                <div className="text-2xl font-bold text-accent-purple">{analytics.trend.reduce((a, b) => a + b.count, 0)}</div>
                <div className="text-xs text-text-muted">Últimos 30 días</div>
              </div>
            </div>
          </Panel>
        </div>

        {/* ===== Evaluación por dimensión ===== */}
        <Panel title="Evaluación por dimensión" icon={<Star className="w-4 h-4" />} subtitle="Promedio de calificaciones (1-5)" index={3}>
          <div className="space-y-4">
            {analytics.avgRatings.map((r, i) => (
              <div key={r.label} className="flex items-center gap-4">
                <div className="w-44 flex-shrink-0 text-sm font-medium text-text-secondary">
                  {r.label}
                </div>
                <div className="flex-1 bg-surface-2 rounded-full h-3 overflow-hidden">
                  {r.value !== null && (
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(r.value / 5) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.6 }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-blue-dark relative"
                    >
                      <span className="absolute right-0 top-0 bottom-0 w-1 bg-white/40" />
                    </motion.div>
                  )}
                </div>
                <div className="w-12 text-right">
                  {r.value !== null ? (
                    <span className={`text-sm font-bold ${r.value >= 4.5 ? "text-accent-emerald" : r.value >= 3.5 ? "text-text-primary" : "text-accent-copper"}`}>
                      {r.value.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-sm text-text-faint">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ===== Cursos deseados ===== */}
          <Panel title="Cursos que quieren los alumnos" icon={<Sparkles className="w-4 h-4" />} subtitle="Demanda por tema" index={4}>
            {analytics.desiredCoursesCounts.length === 0 ? (
              <EmptyHint />
            ) : (
              <div className="space-y-2.5">
                {analytics.desiredCoursesCounts.slice(0, 12).map((c, i) => {
                  const max = Math.max(...analytics.desiredCoursesCounts.map((x) => x.count));
                  return <BarRow key={c.name} label={c.name} count={c.count} max={max} accent="purple" delay={i * 0.04} />;
                })}
              </div>
            )}
          </Panel>

          {/* ===== Cursos tomados + formatos ===== */}
          <Panel title="Cursos tomados" icon={<ThumbsUp className="w-4 h-4" />} subtitle="Historial de los alumnos" index={5}>
            {analytics.coursesTakenCounts.length === 0 ? (
              <EmptyHint />
            ) : (
              <div className="space-y-2.5 mb-6">
                {analytics.coursesTakenCounts.map((c, i) => {
                  const max = Math.max(...analytics.coursesTakenCounts.map((x) => x.count));
                  return <BarRow key={c.name} label={c.name} count={c.count} max={max} accent="blue" delay={i * 0.04} />;
                })}
              </div>
            )}
            <p className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-emerald" />
              Formatos preferidos
            </p>
            {analytics.preferredFormatsCounts.length === 0 ? (
              <p className="text-sm text-text-muted">Sin datos.</p>
            ) : (
              <div className="space-y-2">
                {analytics.preferredFormatsCounts.map((c, i) => {
                  const max = Math.max(...analytics.preferredFormatsCounts.map((x) => x.count));
                  return <BarRow key={c.name} label={c.name} count={c.count} max={max} accent="emerald" delay={i * 0.04} />;
                })}
              </div>
            )}
          </Panel>
        </div>

        {/* ===== Impacto profesional ===== */}
        <Panel title="Impacto profesional" icon={<Award className="w-4 h-4" />} subtitle="¿Aplicaron lo aprendido?" index={6}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {analytics.appliedCounts.length === 0 ? (
              <EmptyHint />
            ) : (
              analytics.appliedCounts
                .sort((a, b) => {
                  const order = ["mucho", "algo", "poco", "no"];
                  return order.indexOf(a.value) - order.indexOf(b.value);
                })
                .map((a, i) => {
                  const colors: Record<string, string> = {
                    mucho: "from-accent-emerald/15 to-emerald-50 text-accent-emerald border-accent-emerald/20",
                    algo: "from-brand-blue/15 to-brand-blue-light text-brand-blue-dark border-brand-blue/20",
                    poco: "from-accent-yellow/15 to-amber-50 text-accent-copper border-accent-yellow/30",
                    no: "from-red-50 to-red-50 text-red-500 border-red-200",
                  };
                  return (
                    <motion.div
                      key={a.value}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className={`bg-gradient-to-br ${colors[a.value]} rounded-xl p-4 text-center border`}
                    >
                      <div className="text-3xl font-black font-display">{a.count}</div>
                      <div className="text-xs text-text-muted mt-1 font-medium">{a.label}</div>
                    </motion.div>
                  );
                })
            )}
          </div>
        </Panel>

        {/* ===== Testimonios / comentarios ===== */}
        <Panel
          title={`Comentarios y testimonios (${analytics.testimonials.length})`}
          icon={<MessageSquare className="w-4 h-4" />}
          index={7}
        >
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en comentarios, resultados o email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-3 bg-surface-1 text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all"
            />
          </div>

          {filteredTestimonials.length === 0 ? (
            <EmptyHint text="Aún no hay comentarios." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filteredTestimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="bg-surface-1 rounded-xl p-4 border border-surface-2 hover:border-brand-blue/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-dark text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
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
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
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
                    <p className="text-sm text-text-primary bg-accent-emerald/5 border-l-2 border-accent-emerald/50 pl-3 py-1.5 mb-2 italic rounded-r">
                      🏆 {t.result}
                    </p>
                  )}
                  {t.feedback && (
                    <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{t.feedback}</p>
                  )}
                  <p className="text-xs text-text-faint mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(t.submittedAt).toLocaleDateString("es", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </Panel>

        {/* ===== Últimas respuestas ===== */}
        <Panel title={`Últimas respuestas (${analytics.recent.length})`} icon={<Mail className="w-4 h-4" />} index={8}>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted border-b border-surface-2">
                  <th className="py-2.5 px-2 font-medium text-xs uppercase tracking-wide">Fecha</th>
                  <th className="py-2.5 px-2 font-medium text-xs uppercase tracking-wide">Email</th>
                  <th className="py-2.5 px-2 font-medium text-xs uppercase tracking-wide">NPS</th>
                  <th className="py-2.5 px-2 font-medium text-xs uppercase tracking-wide">Gen.</th>
                  <th className="py-2.5 px-2 font-medium text-xs uppercase tracking-wide">Cursos</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recent.slice(0, 20).map((r) => (
                  <tr key={r.id} className="border-b border-surface-2 last:border-0 hover:bg-surface-1 transition-colors">
                    <td className="py-2.5 px-2 text-text-muted whitespace-nowrap">
                      {new Date(r.submitted_at).toLocaleDateString("es")}
                    </td>
                    <td className="py-2.5 px-2 text-text-primary truncate max-w-[200px]">{r.email}</td>
                    <td className="py-2.5 px-2">
                      {r.nps_score != null ? (
                        <span
                          className={`font-bold inline-flex items-center justify-center w-7 h-7 rounded-full text-xs ${
                            r.nps_score >= 9
                              ? "bg-accent-emerald/15 text-accent-emerald"
                              : r.nps_score <= 6
                              ? "bg-red-100 text-red-600"
                              : "bg-accent-yellow/15 text-accent-copper"
                          }`}
                        >
                          {r.nps_score}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-text-secondary">
                      {r.overall_rating ? `${r.overall_rating}⭐` : "—"}
                    </td>
                    <td className="py-2.5 px-2 text-text-muted truncate max-w-[200px]">
                      {(r.courses_taken ?? []).join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="sm:hidden">
          <button
            onClick={handleExportCSV}
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-sm font-medium px-4 py-3 rounded-lg shadow-sm shadow-brand-blue/20"
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
  index,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: keyof typeof accentMap | string;
  index: number;
}) {
  const a = accentMap[accent] ?? accentMap.blue;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-surface-3 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      <div className={`absolute -top-6 -right-6 w-24 h-24 ${a.bg} rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
      <div className="relative">
        <div className={`inline-flex p-2.5 rounded-xl ${a.bg} ${a.text} mb-3`}>{icon}</div>
        <div className="text-3xl font-black font-display text-text-primary">{value}</div>
        <div className="text-sm text-text-muted">{label}</div>
        {sub && <div className="text-xs text-text-faint mt-1">{sub}</div>}
      </div>
    </motion.div>
  );
}

function Panel({
  title,
  subtitle,
  icon,
  children,
  className = "",
  index = 0,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.4 }}
      className={`bg-white rounded-2xl border border-surface-3 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-base font-bold text-text-primary font-display flex items-center gap-2">
          {icon && <span className="text-brand-blue">{icon}</span>}
          {title}
        </h2>
        {subtitle && <p className="text-xs text-text-muted mt-0.5 ml-6">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
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
    <div className="text-center bg-surface-1 rounded-xl p-3 border border-surface-2">
      <div className={`inline-flex ${a.text} mb-1`}>{icon}</div>
      <div className="text-2xl font-bold text-text-primary">{count}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}

function BarRow({
  label,
  count,
  max,
  accent,
  delay = 0,
}: {
  label: string;
  count: number;
  max: number;
  accent: keyof typeof accentMap | string;
  delay?: number;
}) {
  const a = accentMap[accent] ?? accentMap.blue;
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 text-sm text-text-secondary truncate">{label}</div>
      <div className="flex-[2] bg-surface-2 rounded-full h-2.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ delay, duration: 0.5 }}
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
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${(v / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.01, duration: 0.4 }}
          className="flex-1 bg-gradient-to-t from-brand-blue/40 to-brand-blue rounded-t hover:from-brand-blue hover:to-brand-blue-dark transition-colors min-h-[3px] cursor-default"
          title={`${v}`}
        />
      ))}
    </div>
  );
}

function EmptyHint({ text = "Aún no hay datos suficientes." }: { text?: string }) {
  return (
    <div className="text-center py-10">
      <div className="inline-flex w-12 h-12 rounded-full bg-surface-2 items-center justify-center mb-3">
        <BarChart3 className="w-5 h-5 text-text-faint" />
      </div>
      <p className="text-sm text-text-muted">{text}</p>
    </div>
  );
}
