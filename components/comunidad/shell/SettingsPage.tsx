"use client";

import { useEffect, useState } from "react";
import { Gauge, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cancelSubscription } from "@/app/actions/subscription";
import { updateProfile } from "@/app/actions/profile";
import { useToast } from "@/components/comunidad/ui/Toast";
import { useCampusUi } from "./CampusShell";
import { useCommunity } from "@/components/comunidad/CommunityProvider";

type Tab = "cuenta" | "limites" | "notificaciones";

const NOTIF_KEY = "programbi:campus:notif-prefs";

export function SettingsPage() {
  const { userProfile } = useCommunity();
  const { openUpgrade } = useCampusUi();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("cuenta");
  const [name, setName] = useState(userProfile?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [quota, setQuota] = useState<{
    plan?: string;
    used?: { monthly: number };
    quota?: { monthly: number };
    percentages?: { monthly: number };
  } | null>(null);
  const [notif, setNotif] = useState({
    announcements: true,
    liveClasses: true,
    achievements: true,
    courseUpdates: true,
  });

  useEffect(() => {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (!raw) return;
    try {
      setNotif((p) => ({ ...p, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (tab !== "limites" || quota) return;
    fetch("/api/ai/quota")
      .then((r) => r.json())
      .then(setQuota)
      .catch(() => {});
  }, [tab, quota]);

  const saveNotif = (next: typeof notif) => {
    setNotif(next);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(next));
  };

  const saveName = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const result = await updateProfile({ fullName: name.trim() });
      if (!result.success) throw new Error(result.error);
      toast("success", "Nombre actualizado");
    } catch (err) {
      toast("error", "No se pudo actualizar", err instanceof Error ? err.message : "");
    } finally {
      setSaving(false);
    }
  };

  const cancelPlan = async () => {
    const typed = window.prompt('Escribe CANCELAR para confirmar que pierdes el acceso premium.');
    if (typed !== "CANCELAR") return;
    setCanceling(true);
    try {
      const result = await cancelSubscription();
      if (!result.success) throw new Error(result.error);
      toast("success", "Suscripción cancelada");
      window.location.reload();
    } catch (err) {
      toast("error", "No se pudo cancelar", err instanceof Error ? err.message : "");
      setCanceling(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "cuenta", label: "Cuenta" },
    { id: "limites", label: "Límites IA" },
    { id: "notificaciones", label: "Notificaciones" },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Ajustes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cuenta, plan y avisos del campus.</p>
      </div>

      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "px-3 py-2 text-sm border-0 bg-transparent cursor-pointer border-b-2 -mb-px",
              tab === t.id ? "border-foreground font-medium" : "border-transparent text-muted-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "cuenta" ? (
        <div className="rounded-xl border border-border bg-surface divide-y divide-border">
          <div className="p-4 flex items-center gap-3">
            <span className="size-10 rounded-full bg-foreground text-background text-sm font-medium flex items-center justify-center">
              {(userProfile?.full_name || "U").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-8 rounded-md border border-border bg-bg px-2 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1 truncate">{userProfile?.email}</p>
            </div>
            <Button size="sm" onClick={() => void saveName()} disabled={saving}>
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <User className="size-3.5" />}
              Guardar
            </Button>
          </div>
          <div className="p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Plan</p>
              <p className="text-xs text-muted-foreground">{userProfile?.subscription_plan || "Sin plan"}</p>
            </div>
            <Button size="sm" variant="outline" onClick={openUpgrade}>
              Actualizar
            </Button>
          </div>
          {userProfile?.subscription_plan ? (
            <div className="p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Cancelar suscripción</p>
                <p className="text-xs text-muted-foreground">Pierdes el acceso premium al confirmar.</p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => void cancelPlan()} disabled={canceling}>
                {canceling ? "…" : "Cancelar"}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "limites" ? (
        <div className="rounded-xl border border-border bg-surface p-5">
          {!quota ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="size-4" />
              <Loader2 className="size-4 animate-spin" />
              Cargando cuota…
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium">Uso mensual de IA</p>
              <p className="text-xs text-muted-foreground mt-1">
                {quota.used?.monthly ?? 0} de {quota.quota?.monthly ?? "—"} mensajes
              </p>
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-foreground"
                  style={{ width: `${Math.min(100, quota.percentages?.monthly ?? 0)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : null}

      {tab === "notificaciones" ? (
        <div className="rounded-xl border border-border bg-surface divide-y divide-border">
          {(
            [
              ["announcements", "Anuncios de la comunidad"],
              ["liveClasses", "Clases en vivo"],
              ["achievements", "Logros y certificados"],
              ["courseUpdates", "Actualizaciones de cursos"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between p-4 text-sm cursor-pointer">
              {label}
              <input
                type="checkbox"
                checked={notif[key]}
                onChange={(e) => saveNotif({ ...notif, [key]: e.target.checked })}
              />
            </label>
          ))}
          <p className="px-4 py-3 text-xs text-muted-foreground">Se guardan en este dispositivo.</p>
        </div>
      ) : null}
    </div>
  );
}
