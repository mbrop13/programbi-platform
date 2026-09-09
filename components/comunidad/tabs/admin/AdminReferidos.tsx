"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Search,
  Share2,
  Users,
} from "lucide-react";
import { PIPELINE_STATUSES, WON_STATUSES } from "@/lib/referrals/constants";
import { formatClp, formatDateCl } from "@/lib/referrals/format";
import {
  COMMISSION_LABELS,
  REFERRER_STATUS_LABELS,
  REFERRER_TYPE_LABELS,
  SOURCE_LABELS,
  STATUS_LABELS,
} from "@/lib/referrals/status";
import type {
  CommissionStatus,
  LeadHint,
  ReferralStatus,
  ReferralWithCommission,
  Referrer,
} from "@/lib/referrals/types";
import { SITE_URL } from "@/lib/seo";

type ReferrerRow = Referrer & { intros: number };
type View = "referidores" | "intros";

function referralLink(code: string) {
  return `${SITE_URL}/empresas?ref=${encodeURIComponent(code)}`;
}

function statusClass(status: ReferralStatus): string {
  if (status === "won" || status === "paid") return "bg-emerald-50 text-emerald-700";
  if (status === "lost" || status === "clawback") return "bg-rose-50 text-rose-700";
  if (status === "submitted") return "bg-neutral-100 text-neutral-600";
  return "bg-sky-50 text-sky-700";
}

function referrerStatusClass(status: Referrer["status"]): string {
  if (status === "active") return "bg-emerald-50 text-emerald-700";
  if (status === "suspended") return "bg-rose-50 text-rose-700";
  return "bg-amber-50 text-amber-700";
}

function sourceLabel(source: string) {
  return SOURCE_LABELS[source as keyof typeof SOURCE_LABELS] || source;
}

export default function AdminReferidos() {
  const [view, setView] = useState<View>("referidores");
  const [referrers, setReferrers] = useState<ReferrerRow[]>([]);
  const [intros, setIntros] = useState<ReferralWithCommission[]>([]);
  const [hints, setHints] = useState<LeadHint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [introRes, referrerRes] = await Promise.all([
        fetch("/api/referrals/admin/intros"),
        fetch("/api/referrals/admin/referidores"),
      ]);
      const introJson = await introRes.json().catch(() => ({}));
      const referrerJson = await referrerRes.json().catch(() => ({}));
      if (!introRes.ok || !referrerRes.ok) {
        throw new Error(introJson.error || referrerJson.error || "No se pudo cargar referidos.");
      }
      setIntros(introJson.referrals || []);
      setHints(introJson.hints || []);
      setReferrers(referrerJson.referrers || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar referidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const kpis = useMemo(() => {
    const active = referrers.filter((r) => r.status === "active").length;
    const pipeline = intros.filter((r) =>
      (PIPELINE_STATUSES as readonly string[]).includes(r.status)
    ).length;
    const won = intros.filter((r) => (WON_STATUSES as readonly string[]).includes(r.status)).length;
    const commissions = intros.map((r) => r.commission).filter(Boolean);
    const payable = commissions
      .filter((c) => c && (c.status === "payable" || c.status === "accrued"))
      .reduce((s, c) => s + Number(c?.commission_amount_clp || 0), 0);
    const paid = commissions
      .filter((c) => c?.status === "paid")
      .reduce((s, c) => s + Number(c?.commission_amount_clp || 0), 0);
    return { active, total: referrers.length, intros: intros.length, pipeline, won, payable, paid };
  }, [referrers, intros]);

  const q = query.trim().toLowerCase();

  const filteredReferrers = useMemo(() => {
    if (!q) return referrers;
    return referrers.filter((r) =>
      [r.name, r.email, r.referral_code, r.phone || ""].some((v) => v.toLowerCase().includes(q))
    );
  }, [referrers, q]);

  const filteredIntros = useMemo(() => {
    if (!q) return intros;
    return intros.filter((r) =>
      [
        r.prospect_name,
        r.prospect_company,
        r.prospect_email || "",
        r.referrer?.name || "",
        r.referrer?.email || "",
        r.referrer?.referral_code || "",
      ].some((v) => v.toLowerCase().includes(q))
    );
  }, [intros, q]);

  const introsByReferrer = useMemo(() => {
    const map = new Map<string, ReferralWithCommission[]>();
    for (const intro of intros) {
      const list = map.get(intro.referrer_id) || [];
      list.push(intro);
      map.set(intro.referrer_id, list);
    }
    return map;
  }, [intros]);

  const copyLink = async (code: string) => {
    const link = referralLink(code);
    try {
      await navigator.clipboard.writeText(link);
      setCopied(code);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      window.prompt("Copia el link", link);
    }
  };

  const patchReferrer = async (id: string, status: Referrer["status"]) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/referrals/admin/referidores/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("patch");
      await load();
    } catch {
      alert("No se pudo actualizar el referidor.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        <span className="mt-3 text-sm font-semibold text-neutral-400">Cargando referidos…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-sm font-semibold text-neutral-600">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              void load();
            }}
            className="mt-4 inline-flex h-9 items-center rounded-full bg-neutral-900 px-5 text-xs font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Referidos</h2>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-neutral-500">
            Quién se inscribió como referidor, su link, a quién invitó y en qué estado está cada intro.
            Comisión 15% del Pack Adopción cuando se cobra.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/referidos/admin"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 text-xs font-semibold text-neutral-700 no-underline hover:bg-neutral-50"
          >
            <ExternalLink size={13} />
            Cola y comisiones
          </a>
          <a
            href="/api/referrals/admin/export"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 text-xs font-semibold text-emerald-700 no-underline hover:bg-emerald-100"
          >
            <Download size={13} />
            Exportar CSV
          </a>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Referidores", value: String(kpis.total), hint: `${kpis.active} activos` },
          { label: "Intros", value: String(kpis.intros), hint: "Invitaciones enviadas" },
          { label: "En pipeline", value: String(kpis.pipeline), hint: "Aún abiertas" },
          { label: "Ganadas", value: String(kpis.won), hint: "Pack cobrado" },
          { label: "Por pagar", value: formatClp(kpis.payable), hint: "Comisión pendiente" },
          { label: "Pagado", value: formatClp(kpis.paid), hint: "Ya transferido" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{card.label}</p>
            <p className="mt-1 text-xl font-black tabular-nums text-neutral-900">{card.value}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-neutral-400">{card.hint}</p>
          </div>
        ))}
      </div>

      {hints.length > 0 ? (
        <div className="mb-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs font-bold text-amber-800">
            Atribución sugerida por cookie (?ref=) — confirmar en la cola
          </p>
          <ul className="mt-2 space-y-1 text-xs text-amber-800/80">
            {hints.slice(0, 8).map((h) => (
              <li key={h.id}>
                {h.referral_code} · {h.lead_name || "—"} · {h.lead_company || "—"} · {h.lead_email || "—"}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-full bg-neutral-100 p-1">
          {(
            [
              { id: "referidores", label: "Referidores", icon: Users },
              { id: "intros", label: "Quién invitó a quién", icon: Share2 },
            ] as const
          ).map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  view === tab.id
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <TabIcon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>
        <label className="relative block w-full max-w-xs">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar nombre, email o código"
            className="h-9 w-full rounded-full border border-neutral-200 bg-white pl-9 pr-3 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-neutral-400"
          />
        </label>
      </div>

      {view === "referidores" ? (
        filteredReferrers.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-neutral-100 bg-neutral-50 py-14 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-neutral-300" />
            <p className="font-bold text-neutral-900">Aún no hay referidores</p>
            <p className="mt-1 text-sm text-neutral-400">
              Se inscriben en /referidos y reciben un link único para compartir.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200 bg-[#F8FAFC]">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500">Referidor</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500">Código / link</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500">Invitó</th>
                  <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500 md:table-cell">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrers.map((r) => {
                  const mine = introsByReferrer.get(r.id) || [];
                  const won = mine.filter((i) =>
                    (WON_STATUSES as readonly string[]).includes(i.status)
                  ).length;
                  const open = openId === r.id;
                  return (
                    <FragmentRow
                      key={r.id}
                      referrer={r}
                      intros={mine}
                      won={won}
                      open={open}
                      copied={copied === r.referral_code}
                      busy={busyId === r.id}
                      onToggle={() => setOpenId(open ? null : r.id)}
                      onCopy={() => void copyLink(r.referral_code)}
                      onPatch={(status) => void patchReferrer(r.id, status)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : filteredIntros.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-neutral-100 bg-neutral-50 py-14 text-center">
          <Share2 className="mx-auto mb-3 h-10 w-10 text-neutral-300" />
          <p className="font-bold text-neutral-900">Nadie ha enviado intros todavía</p>
          <p className="mt-1 text-sm text-neutral-400">
            Cuando un referidor invite a un prospecto, aparece acá quién invitó a quién.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 bg-[#F8FAFC]">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500">Invitó</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500">A quién</th>
                <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500 lg:table-cell">
                  Canal
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500">Estado</th>
                <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500 md:table-cell">
                  Comisión
                </th>
                <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-500 sm:table-cell">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIntros.map((intro) => (
                <tr key={intro.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="text-sm font-bold text-neutral-900">{intro.referrer?.name || "—"}</p>
                    <p className="text-[11px] font-semibold text-neutral-400">
                      {intro.referrer?.referral_code} · {intro.referrer?.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-neutral-900">{intro.prospect_name}</p>
                    <p className="text-[11px] text-neutral-500">
                      {intro.prospect_company} · {intro.prospect_role}
                      {intro.prospect_email ? ` · ${intro.prospect_email}` : ""}
                    </p>
                    {intro.suggested_from_cookie ? (
                      <span className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        Vino con el link
                      </span>
                    ) : null}
                  </td>
                  <td className="hidden px-4 py-3 text-xs font-semibold text-neutral-500 lg:table-cell">
                    {sourceLabel(intro.source)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass(intro.status)}`}>
                      {STATUS_LABELS[intro.status]}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs font-semibold text-neutral-600 md:table-cell">
                    {intro.commission ? (
                      <span>
                        {formatClp(intro.commission.commission_amount_clp)}
                        <span className="ml-1 text-[10px] text-neutral-400">
                          {COMMISSION_LABELS[intro.commission.status as CommissionStatus]}
                        </span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-neutral-500 sm:table-cell">
                    {formatDateCl(intro.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FragmentRow({
  referrer,
  intros,
  won,
  open,
  copied,
  busy,
  onToggle,
  onCopy,
  onPatch,
}: {
  referrer: ReferrerRow;
  intros: ReferralWithCommission[];
  won: number;
  open: boolean;
  copied: boolean;
  busy: boolean;
  onToggle: () => void;
  onCopy: () => void;
  onPatch: (status: Referrer["status"]) => void;
}) {
  return (
    <>
      <tr className="border-b border-neutral-100">
        <td className="px-4 py-3">
          <button type="button" onClick={onToggle} className="flex items-start gap-2 text-left">
            <ChevronDown
              size={14}
              className={`mt-1 shrink-0 text-neutral-400 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
            />
            <span>
              <span className="block text-sm font-bold text-neutral-900">{referrer.name}</span>
              <span className="block text-[11px] font-semibold text-neutral-400">{referrer.email}</span>
              <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {REFERRER_TYPE_LABELS[referrer.type]}
              </span>
            </span>
          </button>
        </td>
        <td className="px-4 py-3">
          <p className="font-mono text-xs font-bold text-neutral-800">{referrer.referral_code}</p>
          <button
            type="button"
            onClick={onCopy}
            className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:underline"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copiado" : "Copiar link"}
          </button>
        </td>
        <td className="px-4 py-3 text-sm font-black tabular-nums text-neutral-900">
          {referrer.intros}
          <span className="ml-1 text-[11px] font-semibold text-neutral-400">{won} ganadas</span>
        </td>
        <td className="hidden px-4 py-3 md:table-cell">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${referrerStatusClass(referrer.status)}`}>
            {REFERRER_STATUS_LABELS[referrer.status]}
          </span>
          <p className="mt-1 text-[11px] text-neutral-400">{formatDateCl(referrer.created_at)}</p>
        </td>
        <td className="px-4 py-3 text-right">
          {referrer.status !== "suspended" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => onPatch("suspended")}
              className="rounded-full border border-rose-100 px-3 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
            >
              {busy ? "…" : "Suspender"}
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => onPatch("active")}
              className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
            >
              {busy ? "…" : "Activar"}
            </button>
          )}
        </td>
      </tr>
      {open ? (
        <tr className="border-b border-neutral-100 bg-neutral-50/80">
          <td colSpan={5} className="px-4 py-4">
            {intros.length === 0 ? (
              <p className="text-xs font-semibold text-neutral-400">Todavía no ha invitado a nadie.</p>
            ) : (
              <ul className="space-y-2">
                {intros.map((intro) => (
                  <li
                    key={intro.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{intro.prospect_name}</p>
                      <p className="text-[11px] text-neutral-500">
                        {intro.prospect_company} · {intro.prospect_role}
                        {intro.prospect_email ? ` · ${intro.prospect_email}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass(intro.status)}`}>
                        {STATUS_LABELS[intro.status]}
                      </span>
                      <span className="text-[11px] text-neutral-400">{formatDateCl(intro.created_at)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </td>
        </tr>
      ) : null}
    </>
  );
}
