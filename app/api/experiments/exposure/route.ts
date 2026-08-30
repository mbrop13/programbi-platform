import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/security/rate-limiter";
import {
  PRICING_VISIBILITY_EXPERIMENT_ID,
  VID_COOKIE,
  isPricingVisibilityVariant,
} from "@/lib/experiments/config";

export const dynamic = "force-dynamic";

/** Record one unique visitor exposure. First write wins (sticky). */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    if (isRateLimited(ip, "exp-exposure", 20, 60 * 1000).limited) {
      return NextResponse.json({ ok: true });
    }

    const visitorId = req.cookies.get(VID_COOKIE)?.value;
    if (!visitorId) return NextResponse.json({ ok: true });

    const body = await req.json().catch(() => ({}));
    const variant = typeof body.variant === "string" ? body.variant : "";
    if (!isPricingVisibilityVariant(variant)) {
      return NextResponse.json({ error: "Variante inválida" }, { status: 400 });
    }

    const courseSlug =
      typeof body.course_slug === "string" ? body.course_slug.slice(0, 120) : null;

    const adminDb = createAdminClient();
    const { error } = await adminDb.from("experiment_exposures").upsert(
      {
        experiment_id: PRICING_VISIBILITY_EXPERIMENT_ID,
        visitor_id: visitorId,
        variant,
        course_slug: courseSlug,
      },
      { onConflict: "experiment_id,visitor_id", ignoreDuplicates: true },
    );

    if (error) {
      console.error("experiment_exposures upsert:", error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("experiment exposure:", err);
    return NextResponse.json({ ok: true });
  }
}
