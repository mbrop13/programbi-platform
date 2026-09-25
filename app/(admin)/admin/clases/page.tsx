import { AdminCommunityClasses } from "@/components/admin/AdminCommunityClasses";
import { getCommunityClasses } from "@/lib/comunidad/community-classes";

export default async function Page() {
  const classes = await getCommunityClasses();
  return <AdminCommunityClasses initialClasses={classes} />;
}
