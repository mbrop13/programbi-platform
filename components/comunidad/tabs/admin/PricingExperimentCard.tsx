"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock, Eye } from "lucide-react";
import {
  adminGetPricingExperimentStats,
  type PricingExperimentStats,
  type PricingVariantCounts,
} from "@/lib/supabase/comunidad-ai";

function pct(num: number, den: number): string {
  if (!den) return "—";
  return `${((num / den) * 100).toFixed(1)}%`;
}

function formatCLP(n: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

function Arm({
  title,
  hint,
  icon: Icon,
  counts,
}: {
  title: string;
  hint: string;
  icon: typeof Lock;
  counts: {
    visitors: number;
    leads: number;
    forms: number;
    sales: number;
    revenue: number;
  };
}) {
  const rows = [
    { label: "Visitas únicas", value: String(counts.visitors) },
    { label: "Leads (registros)", value: `${counts.leads}  ·  ${pct(counts.leads, counts.visitors)}` },
    { label: "Formularios extra", value: `${counts.forms}  ·  ${pct(counts.forms, counts.visitors)}` },
    { label: "Ventas pagadas", value: `${counts.sales}  ·  ${pct(counts.sales, counts.visitors)}` },
    { label: "Ingresos", value: formatCLP(counts.revenue) },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-md bg-muted text-foreground">
          <Icon className="size-3.5" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-[11px] text-muted-foreground">{hint}</p>
        </div>
      </div>
      <dl className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-3">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="text-sm tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function pick(stats: PricingExperimentStats, key: keyof PricingVariantCounts) {
  return {
    visitors: stats.visitors[key],
    leads: stats.leads[key],
    forms: stats.forms[key],
    sales: stats.sales[key],
    revenue: stats.revenue[key],
  };
}

export default function PricingExperimentCard() {
  const [stats, setStats] = useState<PricingExperimentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetPricingExperimentStats()
      .then(setStats)
      .catch((err) => {
        console.error(err);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium">Experimento de precio (cerrado)</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          El split 50/50 ya no está activo: todos los visitantes ven el candado hasta registrarse. Abajo quedan
          los datos históricos de cada brazo.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs font-semibold">Cargando medición…</span>
        </div>
      ) : !stats ? (
        <p className="text-xs font-semibold text-neutral-400">
          Aún no hay datos. Corre el SQL `pricing_experiment` en Supabase si esta tarjeta queda vacía.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Arm
            title="Candado"
            hint="Se registraban para ver el precio"
            icon={Lock}
            counts={pick(stats, "gate")}
          />
          <Arm
            title="Precio visible"
            hint="Veían el valor y se registraban para pagar"
            icon={Eye}
            counts={pick(stats, "direct")}
          />
        </div>
      )}
    </section>
  );
}
