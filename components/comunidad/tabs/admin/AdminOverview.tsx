"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  adminGetDetailedDashboardStats,
  adminGetProgressLeaderboard,
} from "@/lib/supabase/comunidad-ai";
import PricingExperimentCard from "./PricingExperimentCard";
import { AdminPageHeader, AdminStat, AdminTableWrap } from "@/components/admin/ui";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashTab = "overview" | "subscribers" | "progress";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dashTab, setDashTab] = useState<DashTab>("overview");
  const [subscriberPlanFilter, setSubscriberPlanFilter] = useState("all");
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [progressCourseFilter, setProgressCourseFilter] = useState("all");
  const [progressSearch, setProgressSearch] = useState("");
  const [leaderboard, setLeaderboard] = useState<any[] | null>(null);
  const [loadingBoard, setLoadingBoard] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await adminGetDetailedDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (dashTab !== "progress" || leaderboard) return;
    let cancelled = false;
    setLoadingBoard(true);
    adminGetProgressLeaderboard()
      .then((data) => {
        if (!cancelled) setLeaderboard(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoadingBoard(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dashTab, leaderboard]);

  const formatCLP = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n.toLocaleString("es-CL")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-20 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Cargando métricas…
      </div>
    );
  }

  const filteredSubscribers = (stats?.subscribers || []).filter((sub: any) => {
    const matchesPlan =
      subscriberPlanFilter === "all" || sub.subscription_plan?.toLowerCase() === subscriberPlanFilter.toLowerCase();
    const searchLower = subscriberSearch.toLowerCase().trim();
    const matchesSearch =
      !subscriberSearch ||
      sub.full_name?.toLowerCase().includes(searchLower) ||
      sub.email?.toLowerCase().includes(searchLower);
    return matchesPlan && matchesSearch;
  });

  const board = leaderboard || [];
  const coursesInLeaderboard = Array.from(new Set(board.map((l: any) => l.courseTitle)));
  const filteredLeaderboard = board.filter((item: any) => {
    const matchesCourse = progressCourseFilter === "all" || item.courseTitle === progressCourseFilter;
    const searchLower = progressSearch.toLowerCase().trim();
    const matchesSearch =
      !progressSearch ||
      item.studentName?.toLowerCase().includes(searchLower) ||
      item.studentEmail?.toLowerCase().includes(searchLower);
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Estadísticas"
        description="Ingresos, suscriptores y avance de alumnos"
        actions={
          <div className="flex rounded-lg border border-border p-0.5 bg-surface">
            {(
              [
                ["overview", "Resumen"],
                ["subscribers", "Suscriptores"],
                ["progress", "Progreso"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setDashTab(id)}
                className={cn(
                  "px-3 h-7 text-xs rounded-md transition-colors",
                  dashTab === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        }
      />

      {dashTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <AdminStat
              label="Ingresos este mes"
              value={formatCLP(stats?.revenue?.thisMonth || 0)}
              hint={`${stats?.revenue?.change || 0}% vs mes anterior`}
            />
            <AdminStat label="Suscriptores activos" value={String(stats?.subscribers?.length || 0)} />
            <AdminStat label="Matrículas activas" value={String(stats?.enrollments?.total || 0)} />
            <AdminStat
              label="Promedio de avance"
              value={`${stats?.activity?.avgProgressPercent || 0}%`}
              hint="Clases completadas / iniciadas"
            />
          </div>

          <PricingExperimentCard />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <AdminStat label="Ingresos acumulados" value={formatCLP(stats?.revenue?.total || 0)} />
            <AdminStat label="Curso más vendido" value={stats?.bestCourse || "—"} />
            <AdminStat
              label="Actividad 30 días"
              value={String(stats?.activity?.watchedLastMonthCount || 0)}
              hint={`${stats?.activity?.completedClassesCount || 0} clases completadas`}
            />
          </div>

          {stats?.recentPayments?.length > 0 && (
            <AdminTableWrap>
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-medium">Últimas transacciones</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Cliente</th>
                      <th className="px-4 py-2.5 font-medium">Curso</th>
                      <th className="px-4 py-2.5 font-medium">Estado</th>
                      <th className="px-4 py-2.5 font-medium">Fecha</th>
                      <th className="px-4 py-2.5 font-medium text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentPayments.map((p: any) => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5">{p.payer_email}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{p.course?.title || "Curso"}</td>
                        <td className="px-4 py-2.5 text-xs">{p.status === "paid" ? "Pagado" : p.status}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          {p.paid_at
                            ? new Date(p.paid_at).toLocaleDateString("es-CL", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums">{formatCLP(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AdminTableWrap>
          )}
        </div>
      )}

      {dashTab === "subscribers" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                placeholder="Buscar suscriptor"
                className="pl-8"
              />
            </div>
            <div className="flex gap-1">
              {["all", "basic", "premium"].map((plan) => (
                <button
                  key={plan}
                  onClick={() => setSubscriberPlanFilter(plan)}
                  className={cn(
                    "h-8 px-3 rounded-md text-xs border border-border",
                    subscriberPlanFilter === plan ? "bg-foreground text-background border-foreground" : "bg-surface"
                  )}
                >
                  {plan === "all" ? "Todos" : plan}
                </button>
              ))}
            </div>
          </div>

          <AdminTableWrap>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Nombre</th>
                    <th className="px-4 py-2.5 font-medium">Correo</th>
                    <th className="px-4 py-2.5 font-medium">Plan</th>
                    <th className="px-4 py-2.5 font-medium">Vencimiento</th>
                    <th className="px-4 py-2.5 font-medium text-right">Alta</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No hay suscriptores con estos filtros.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub: any) => (
                      <tr key={sub.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 font-medium">{sub.full_name || "Sin nombre"}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{sub.email}</td>
                        <td className="px-4 py-2.5 text-xs capitalize">{sub.subscription_plan}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          {sub.subscription_expires_at
                            ? new Date(sub.subscription_expires_at).toLocaleDateString("es-CL")
                            : "Permanente"}
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">
                          {sub.created_at ? new Date(sub.created_at).toLocaleDateString("es-CL") : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </AdminTableWrap>
        </div>
      )}

      {dashTab === "progress" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AdminStat label="Promedio de avance" value={`${stats?.activity?.avgProgressPercent || 0}%`} />
            <AdminStat label="Clases completadas" value={String(stats?.activity?.completedClassesCount || 0)} />
            <AdminStat label="Vistas este mes" value={String(stats?.activity?.watchedLastMonthCount || 0)} />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={progressSearch}
                onChange={(e) => setProgressSearch(e.target.value)}
                placeholder="Buscar alumno"
                className="pl-8"
              />
            </div>
            <select
              value={progressCourseFilter}
              onChange={(e) => setProgressCourseFilter(e.target.value)}
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              <option value="all">Todos los cursos</option>
              {coursesInLeaderboard.map((course: any) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <AdminTableWrap>
            <div className="overflow-x-auto">
              {loadingBoard ? (
                <div className="flex items-center gap-2 px-4 py-10 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Cargando ranking…
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Alumno</th>
                      <th className="px-4 py-2.5 font-medium">Curso</th>
                      <th className="px-4 py-2.5 font-medium">Clases</th>
                      <th className="px-4 py-2.5 font-medium">Avance</th>
                      <th className="px-4 py-2.5 font-medium text-right">Última actividad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                          No hay datos de avance.
                        </td>
                      </tr>
                    ) : (
                      filteredLeaderboard.slice(0, 80).map((item: any, idx: number) => (
                        <tr key={`${item.userId}-${item.courseId}`} className="border-b border-border last:border-0">
                          <td className="px-4 py-2.5">
                            <div className="font-medium">
                              {idx < 3 ? `${idx + 1}. ` : ""}
                              {item.studentName}
                            </div>
                            <div className="text-xs text-muted-foreground">{item.studentEmail}</div>
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">{item.courseTitle}</td>
                          <td className="px-4 py-2.5 tabular-nums text-xs">
                            {item.completedLessons}/{item.totalLessons}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-foreground"
                                  style={{ width: `${item.completionPercent}%` }}
                                />
                              </div>
                              <span className="text-xs tabular-nums">{item.completionPercent}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">
                            {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString("es-CL") : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </AdminTableWrap>
        </div>
      )}
    </div>
  );
}
