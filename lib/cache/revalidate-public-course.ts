import { revalidatePath } from "next/cache";
import { publicCoursePaths, publicSchedulePaths } from "./public-course-paths";

export function revalidatePublicCourse(slug: string) {
  for (const path of publicCoursePaths(slug)) revalidatePath(path);
}

export function revalidatePublicSchedule(slug: string) {
  for (const path of publicSchedulePaths(slug)) revalidatePath(path);
}
