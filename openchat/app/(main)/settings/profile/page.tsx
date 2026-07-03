import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { auth } from "@/lib/auth"

export default async function ProfilePage() {
  const session = await auth()
  return (
    <SettingsSidebar session={session}>
      <div className="space-y-2">
      </div>
    </SettingsSidebar>
  )
}
