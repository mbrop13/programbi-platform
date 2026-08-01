/**
 * Feature flags for the Community product.
 * Flip these when memberships / paid access come back online.
 */

/** When false, pricing, checkout and upgrade CTAs are hidden/disabled. */
export const SUBSCRIPTIONS_ENABLED = true;

/**
 * When true (and subscriptions are off), any logged-in user can enter
 * community courses and watch lessons marked as free preview in admin.
 */
export const FREE_PREVIEW_ACCESS_ENABLED = true;
