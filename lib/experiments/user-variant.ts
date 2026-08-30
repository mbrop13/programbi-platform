import { createAdminClient } from "@/lib/supabase/server";
import { isPricingVisibilityVariant, type PricingVisibilityVariant } from "@/lib/experiments/config";

export async function getPricingVariantForUser(
  adminDb: ReturnType<typeof createAdminClient>,
  userId: string,
): Promise<PricingVisibilityVariant | null> {
  try {
    const { data } = await adminDb
      .from("profiles")
      .select("pricing_variant")
      .eq("id", userId)
      .maybeSingle();
    const value = (data as { pricing_variant?: string | null } | null)?.pricing_variant;
    return isPricingVisibilityVariant(value) ? value : null;
  } catch {
    return null;
  }
}
