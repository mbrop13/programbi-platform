import { AdminSupport } from "@/components/admin/legacy-tabs";
import { AdminLegacyFrame } from "@/components/admin/ui";

export default function Page() {
  return (
    <AdminLegacyFrame>
      <AdminSupport />
    </AdminLegacyFrame>
  );
}
