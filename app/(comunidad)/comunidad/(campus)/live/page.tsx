"use client";

import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import LivePanel from "@/components/comunidad/tabs/LivePanel";
import { useCommunity } from "@/components/comunidad/CommunityProvider";

export default function LivePage() {
  const router = useRouter();
  const { canAccessFull } = useCommunity();
  const restrictedView = !canAccessFull;

  return (
    <div className="relative">
      {restrictedView ? (
        <div className="absolute inset-0 z-20 rounded-xl bg-bg/60 flex flex-col items-center justify-center p-6 border border-border">
          <div className="w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight mb-2">Sección Premium</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6 text-sm">
            Suscripciones próximamente. Mientras tanto, puedes ver las clases gratuitas en Cursos.
          </p>
          <button
            type="button"
            onClick={() => router.push("/comunidad/cursos")}
            className="bg-foreground text-background font-medium px-5 py-2.5 rounded-lg text-sm"
          >
            Ir a Cursos
          </button>
        </div>
      ) : null}
      <LivePanel />
    </div>
  );
}
