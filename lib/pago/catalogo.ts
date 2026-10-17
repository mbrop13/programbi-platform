import { createAdminClient } from "@/lib/supabase/server";
import type { CourseSchedule } from "@/lib/data/course-schedules";

export type CheckoutPromotion = {
  target_type?: string;
  target_id?: string | null;
  promo_price?: number | null;
  discount_percentage?: number | null;
  valid_until?: string | null;
};

export type CheckoutPriceOverride = {
  item_type?: string;
  item_id?: string;
  level_name?: string;
  price?: number;
};

export type CheckoutDescription = {
  slug: string;
  description?: string | null;
  short_description?: string | null;
};

export type CheckoutCatalog = {
  schedules: CourseSchedule[];
  promotions: CheckoutPromotion[];
  priceOverrides: CheckoutPriceOverride[];
  descriptions: CheckoutDescription[];
};

const emptyCatalog = (): CheckoutCatalog => ({
  schedules: [],
  promotions: [],
  priceOverrides: [],
  descriptions: [],
});

/** Horarios, promos y precios que el carrito necesita en el primer HTML. */
export async function getCheckoutCatalog(): Promise<CheckoutCatalog> {
  try {
    const db = createAdminClient();
    const now = new Date().toISOString();
    const [schedulesRes, promotionsRes, pricesRes, descriptionsRes] = await Promise.all([
      db
        .from("course_schedules")
        .select("*")
        .eq("is_active", true)
        .neq("course_slug", "comunidad")
        .order("start_date", { ascending: true }),
      db.from("promotions").select("*").eq("is_active", true),
      db.from("price_overrides").select("*"),
      db.from("courses").select("slug, description, short_description"),
    ]);

    if (schedulesRes.error) console.error("checkout schedules:", schedulesRes.error.message);
    if (promotionsRes.error) console.error("checkout promotions:", promotionsRes.error.message);
    if (pricesRes.error) console.error("checkout prices:", pricesRes.error.message);
    if (descriptionsRes.error) console.error("checkout descriptions:", descriptionsRes.error.message);

    const promotions = ((promotionsRes.data || []) as CheckoutPromotion[]).filter(
      (promo) => !promo.valid_until || promo.valid_until > now
    );

    return {
      schedules: (schedulesRes.data || []) as CourseSchedule[],
      promotions,
      priceOverrides: (pricesRes.data || []) as CheckoutPriceOverride[],
      descriptions: (descriptionsRes.data || []) as CheckoutDescription[],
    };
  } catch (error) {
    console.error("checkout catalog:", error);
    return emptyCatalog();
  }
}
