"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MuroFeed from "@/components/comunidad/tabs/MuroFeed";
import { useCommunity } from "@/components/comunidad/CommunityProvider";

export default function InicioPage() {
  const router = useRouter();
  const { isOrgManager, userProfile, canAccessFull, hasCourses } = useCommunity();
  const restrictedView = !canAccessFull && !!hasCourses;

  useEffect(() => {
    if (isOrgManager && userProfile) {
      router.replace("/comunidad/business");
    }
  }, [isOrgManager, userProfile, router]);

  if (isOrgManager) return null;

  return <MuroFeed isRestricted={restrictedView} />;
}
