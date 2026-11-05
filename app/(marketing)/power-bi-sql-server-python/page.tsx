import type { Metadata } from "next";
import { LandingPage } from "@/components/landings";
import { getLanding, landingMetadata } from "@/lib/data/landings-nicho";

const landing = getLanding("power-bi-sql-server-python");

export const metadata: Metadata = landingMetadata(landing);

/** Landing de nicho: ruta de datos SQL Server, Power BI y Python. */
export default function Page() {
  return <LandingPage landing={landing} />;
}
