import { revalidatePath } from "next/cache";
import { publicCoursePaths, publicPricingPaths, publicSchedulePaths } from "./public-course-paths";

export function revalidatePublicCourse(slug: string) {
  for (const path of publicCoursePaths(slug)) revalidatePath(path);
}

export function revalidatePublicSchedule(slug: string) {
  for (const path of publicSchedulePaths(slug)) revalidatePath(path);
}

export function revalidatePublicPricing(slug?: string | null) {
  try {
    for (const path of publicPricingPaths(slug)) revalidatePath(path);
    revalidatePath("/(marketing)/guias/[slug]", "page");
    revalidatePath("/(pais)/[pais]/guias/[slug]", "page");
  } catch (err) {
    console.warn("revalidatePublicPricing warning:", err);
  }
}
