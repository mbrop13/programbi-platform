import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MarketingAnalytics from "@/components/shared/MarketingAnalytics";

export default function SiteAnalytics() {
  return (
    <>
      <Suspense fallback={null}>
        <MarketingAnalytics />
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
