import type { Unit } from "./types";
import { loadPracticeUnit, PRACTICE_UNIT_META } from "./catalog";

export { loadPracticeUnit, PRACTICE_UNIT_META } from "./catalog";

/** @deprecated Prefer PRACTICE_UNIT_META + loadPracticeUnit. Empty on purpose so the map does not pull 8k lines. */
export const PRACTICE_UNITS: Unit[] = [];

export async function getUnitBySlug(slug: string): Promise<Unit | undefined> {
  const meta = PRACTICE_UNIT_META.find((u) => u.slug === slug || u.id === slug);
  if (!meta) return undefined;
  return loadPracticeUnit(meta.id);
}
