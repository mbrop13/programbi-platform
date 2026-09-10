"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BusinessPortal from "@/components/comunidad/tabs/BusinessPortal";
import { useCommunity } from "@/components/comunidad/CommunityProvider";

export default function BusinessPage() {
  const router = useRouter();
  const { isOrgManager, userProfile } = useCommunity();

  useEffect(() => {
    if (userProfile && !isOrgManager) {
      router.replace("/comunidad/inicio");
    }
  }, [isOrgManager, userProfile, router]);

  if (!isOrgManager) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center max-w-lg mx-auto">
        <h1 className="text-xl font-semibold tracking-tight">Acceso restringido</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Esta sección está disponible únicamente para gestores corporativos.
        </p>
      </div>
    );
  }

  return <BusinessPortal />;
}
