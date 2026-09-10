import { AdminPopups } from "@/components/admin/legacy-tabs";
import { AdminLegacyFrame } from "@/components/admin/ui";

export default function Page() {
  return (
    <AdminLegacyFrame>
      <AdminPopups />
    </AdminLegacyFrame>
  );
}
