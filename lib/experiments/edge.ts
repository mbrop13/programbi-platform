import { type NextRequest, type NextResponse } from "next/server";
import {
  QA_PARAM,
  VARIANT_COOKIE,
  VID_COOKIE,
  experimentCookieOptions,
  getPricingVisibilityMode,
} from "@/lib/experiments/config";
import { resolvePricingVisibility } from "@/lib/experiments/assign";

/** Attach sticky visitor + variant cookies. Does not vary the HTML cache key. */
export function applyExperimentCookies(request: NextRequest, response: NextResponse): NextResponse {
  const resolved = resolvePricingVisibility({
    existingVid: request.cookies.get(VID_COOKIE)?.value ?? null,
    existingVariant: request.cookies.get(VARIANT_COOKIE)?.value ?? null,
    override: request.nextUrl.searchParams.get(QA_PARAM),
    mode: getPricingVisibilityMode(),
  });

  const opts = experimentCookieOptions();
  if (resolved.setVid) {
    response.cookies.set(VID_COOKIE, resolved.vid, opts);
  }
  if (resolved.setVariant) {
    response.cookies.set(VARIANT_COOKIE, resolved.variant, opts);
  }
  return response;
}
