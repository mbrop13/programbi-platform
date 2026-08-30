import {
  PRICING_VISIBILITY_EXPERIMENT_ID,
  PRICING_VISIBILITY_WEIGHTS,
  type PricingVisibilityMode,
  type PricingVisibilityVariant,
  forcedVariantFromMode,
  isPricingVisibilityVariant,
} from "@/lib/experiments/config";
import { experimentBucket, pickWeightedVariant } from "@/lib/experiments/hash";

const VARIANT_ORDER = ["gate", "direct"] as const;

export type PricingAssignment = {
  vid: string;
  variant: PricingVisibilityVariant;
  setVid: boolean;
  setVariant: boolean;
};

function newVisitorId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `pb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function assignFromHash(vid: string): PricingVisibilityVariant {
  const bucket = experimentBucket(vid, PRICING_VISIBILITY_EXPERIMENT_ID);
  return pickWeightedVariant(bucket, PRICING_VISIBILITY_WEIGHTS, VARIANT_ORDER);
}

/**
 * Resolve sticky variant for this request.
 * Forced modes overwrite a previous cookie (rollback / winner).
 * Split keeps an existing valid cookie so weight changes only affect new visitors.
 */
export function resolvePricingVisibility(opts: {
  existingVid?: string | null;
  existingVariant?: string | null;
  override?: string | null;
  mode: PricingVisibilityMode;
}): PricingAssignment {
  const setVid = !opts.existingVid;
  const vid = opts.existingVid || newVisitorId();

  // Query override wins for this request (QA). Forced env still wins on later requests without the param.
  if (isPricingVisibilityVariant(opts.override)) {
    return {
      vid,
      variant: opts.override,
      setVid,
      setVariant: opts.existingVariant !== opts.override,
    };
  }

  const forced = forcedVariantFromMode(opts.mode);
  if (forced) {
    return {
      vid,
      variant: forced,
      setVid,
      setVariant: opts.existingVariant !== forced,
    };
  }

  if (isPricingVisibilityVariant(opts.existingVariant)) {
    return {
      vid,
      variant: opts.existingVariant,
      setVid,
      setVariant: false,
    };
  }

  return {
    vid,
    variant: assignFromHash(vid),
    setVid,
    setVariant: true,
  };
}
