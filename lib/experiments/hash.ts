/** FNV-1a 32-bit. Edge-safe, no Node crypto. */

export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Deterministic 0–99 bucket for a visitor × experiment. */
export function experimentBucket(visitorId: string, experimentId: string): number {
  return fnv1a32(`${visitorId}:${experimentId}`) % 100;
}

/**
 * Walk variant weights in insertion order until the bucket lands.
 * Weights should sum to 100; leftover buckets fall to the last variant.
 */
export function pickWeightedVariant<T extends string>(
  bucket: number,
  weights: Record<T, number>,
  order: readonly T[],
): T {
  let acc = 0;
  for (const id of order) {
    acc += weights[id] ?? 0;
    if (bucket < acc) return id;
  }
  return order[order.length - 1];
}
