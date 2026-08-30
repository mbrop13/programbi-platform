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
    <div className="rounded-2xl border border-neutral-100 bg-white p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-black text-neutral-900">{title}</p>
          <p className="text-[11px] font-semibold text-neutral-400">{hint}</p>
        </div>
      </div>
      <dl className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-3">
            <dt className="text-xs font-semibold text-neutral-500">{row.label}</dt>
            <dd className="text-sm font-black tabular-nums text-neutral-900">{row.value}</dd>
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
    <section className="rounded-3xl border border-neutral-100 bg-neutral-50 p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-black text-neutral-900">Experimento de precio: 50% / 50%</h3>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-neutral-500">
          No son las primeras 50 personas. Cada visita nueva tiene 50% de probabilidad de ver el candado o el
          precio. Si la misma persona vuelve, ve lo mismo. En los dos casos el registro y el pago se guardan, y
          aquí se comparan leads y ventas de cada opción.
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
            title="Candado (50%)"
            hint="Tienen que registrarse para ver el precio"
            icon={Lock}
            counts={pick(stats, "gate")}
          />
          <Arm
            title="Precio visible (50%)"
            hint="Ven el valor y después se registran para pagar"
            icon={Eye}
            counts={pick(stats, "direct")}
          />
        </div>
      )}
    </section>
  );
}
