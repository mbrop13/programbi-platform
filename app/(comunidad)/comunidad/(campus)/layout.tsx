import { redirect } from "next/navigation";
import { CommunityProvider } from "@/components/comunidad/CommunityProvider";
import { CampusShell } from "@/components/comunidad/shell/CampusShell";
import { ToastProvider } from "@/components/comunidad/ui/Toast";
import { getCampusSession } from "@/lib/comunidad/session";

export const metadata = {
  title: "Comunidad | ProgramBI",
  robots: { index: false, follow: false },
};

export default async function CampusLayout({ children }: { children: React.ReactNode }) {
  const session = await getCampusSession();

  if (!session.user) {
    redirect("/login");
  }

  return (
    <CommunityProvider
      serverData={{
        isAdmin: session.isAdmin,
        userProfile: session.user,
        orgData: session.isOrgManager ? { id: "org" } : null,
        enrollmentData: { enrollments: [], programSiblings: [] },
        allCourses: [],
        hasCourses: session.hasCourses,
      }}
    >
      <ToastProvider>
        <CampusShell>{children}</CampusShell>
      </ToastProvider>
    </CommunityProvider>
  );
}
