"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Gauge, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuotaData {
  plan: string;
  isAdmin?: boolean;
  unlimited?: boolean;
  quota: { monthly: number; weekly: number; fiveHour: number };
  used: { five_hour: number; weekly: number; monthly: number };
  remaining: { five_hour: number; weekly: number; monthly: number };
  percentages: { five_hour: number; weekly: number; monthly: number };
  resetAt: string;
}

interface QuotaIndicatorProps {
  /** Disparador externo para refrescar (ej. tras onFinish de un mensaje). */
  refreshKey?: number;
  onUpgradeClick?: () => void;
}

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  max: "Max",
  ultra: "Ultra",
};

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `${n}`;
}

function formatRemaining(isoDate: string): string {
  const ms = new Date(isoDate).getTime() - Date.now();
  if (ms <= 0) return "ya";
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h < 24) return `${h}h ${m}m`;
  return `${Math.round(h / 24)}d`;
}

function barColor(pct: number): string {
  if (pct >= 90) return "bg-rose-500";
  if (pct >= 75) return "bg-amber-500";
  return "bg-brand-blue";
}

export default function QuotaIndicator({ refreshKey = 0, onUpgradeClick }: QuotaIndicatorProps) {
  const [data, setData] = useState<QuotaData | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchQuota = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/quota", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
    } catch {
      /* silencioso: la UI es informativa */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota, refreshKey]);

  // Refrescar cada 30s solo si la pestaña está visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchQuota();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const t = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchQuota();
      }
    }, 30_000);

    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchQuota]);

  if (loading || !data) {
    return (
      <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-100" aria-hidden />
    );
  }

  // Admins: badge simple sin barras
  if (data.unlimited) {
    return (
      <div
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200"
        title="Acceso ilimitado (admin)"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-[11px] font-semibold text-amber-700">Ilimitado</span>
      </div>
    );
  }

  const windows = [
    {
      key: "five_hour" as const,
      label: "Próx. 5h",
      icon: Clock,
      pct: data.percentages.five_hour,
      used: data.used.five_hour,
      cap: data.quota.fiveHour,
    },
    {
      key: "weekly" as const,
      label: "Semanal",
      icon: Gauge,
      pct: data.percentages.weekly,
      used: data.used.weekly,
      cap: data.quota.weekly,
    },
    {
      key: "monthly" as const,
      label: "Mensual",
      icon: Gauge,
      pct: data.percentages.monthly,
      used: data.used.monthly,
      cap: data.quota.monthly,
    },
  ];

  // El pct más alto define el color del trigger
  const maxPct = Math.max(
    data.percentages.five_hour,
    data.percentages.weekly,
    data.percentages.monthly
  );
  const triggerColor =
    maxPct >= 90
      ? "text-rose-500 hover:bg-rose-50"
      : maxPct >= 75
      ? "text-amber-500 hover:bg-amber-50"
      : "text-gray-400 hover:bg-gray-50";
  const triggerDot =
    maxPct >= 90 ? "bg-rose-500" : maxPct >= 75 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors cursor-pointer border-0 bg-transparent",
          triggerColor
        )}
        title="Uso de tokens IA"
      >
        <span className={cn("w-1.5 h-1.5 rounded-full", triggerDot)} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* backdrop para cerrar */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="absolute right-0 bottom-full mb-2 w-72 z-50 bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue">
                    {PLAN_LABELS[data.plan] ?? data.plan}
                  </span>
                  <span className="text-[11px] text-gray-400">Tokens IA</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Barras por ventana */}
              <div className="px-4 pb-3 space-y-3">
                {windows.map((w) => {
                  const Icon = w.icon;
                  return (
                    <div key={w.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
                          <Icon className="w-3 h-3 text-gray-400" />
                          {w.label}
                        </span>
                        <span className="text-[10px] text-gray-400 tabular-nums">
                          {formatTokens(w.used)} / {formatTokens(w.cap)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", barColor(w.pct))}
                          style={{ width: `${w.pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500">
                    Reinicio 5h en <strong className="text-gray-700">{formatRemaining(data.resetAt)}</strong>
                  </span>
                </div>
                {data.plan === "free" && onUpgradeClick && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      onUpgradeClick();
                    }}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-white text-[11px] font-bold rounded-lg transition-all active:scale-[0.98] cursor-pointer border-0 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3" />
                    Subir de plan
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
