import { CommunityProvider } from "@/components/comunidad/CommunityProvider";
import { getCommunityPortalData } from "@/lib/supabase/comunidad";

export default async function ComunidadTabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pre-fetch all community data on the server (zero client latency)
  let serverData = null;
  try {
    serverData = await getCommunityPortalData();
  } catch (err) {
    console.error("Error pre-fetching community data:", err);
  }

  return (
    <CommunityProvider serverData={serverData}>
      {children}
    </CommunityProvider>
  );
}
