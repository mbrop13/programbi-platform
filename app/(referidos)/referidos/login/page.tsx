import type { Metadata } from "next";
import { Suspense } from "react";
import { ReferidosLogin } from "@/components/referrals/auth-card";

export const metadata: Metadata = {
  title: "Iniciar sesión · Referidos",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <ReferidosLogin />
    </Suspense>
  );
}
