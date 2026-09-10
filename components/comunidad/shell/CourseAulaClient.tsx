"use client";

import { useRouter } from "next/navigation";
import AulaVirtual from "@/components/comunidad/tabs/AulaVirtual";
import { useCampusUi } from "./CampusShell";

export function CourseAulaClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { openUpgrade } = useCampusUi();

  return (
    <AulaVirtual
      courseId={courseId}
      onBack={() => router.push("/comunidad/cursos")}
      onUpgradeClick={openUpgrade}
    />
  );
}
