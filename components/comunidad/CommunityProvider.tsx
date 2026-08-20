"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export interface CommunityUser {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  subscription_plan?: string | null;
  subscription_expires_at?: string | null;
}

export interface CommunityContextValue {
  isAdmin: boolean;
  isOrgManager: boolean;
  userProfile: CommunityUser | null;
  authLoading: boolean;
  isCheckingPlan: boolean;
  hasCourses: boolean | null;
  courseSlugMap: Record<string, string>;
  allCourses: any[];
  enrollmentData: any;
  hasSubscription: boolean;
  canAccessFull: boolean;
  theme: "claro" | "oscuro" | "sistema";
  setTheme: (t: "claro" | "oscuro" | "sistema") => void;
  language: "es" | "en";
  setLanguage: (l: "es" | "en") => void;
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}

/**
 * Props that can be pre-filled from a Server Component layout.
 * When provided, the client skips the expensive Server Action call entirely.
 */
interface ServerData {
  isAdmin: boolean;
  userProfile: any;
  enrollmentData: any;
  orgData: any;
  allCourses: any[];
}

export function CommunityProvider({
  children,
  serverData,
}: {
  children: ReactNode;
  serverData?: ServerData | null;
}) {
  const [isAdmin, setIsAdmin] = useState(serverData?.isAdmin ?? false);
  const [isOrgManager, setIsOrgManager] = useState(!!serverData?.orgData);
  const [userProfile, setUserProfile] = useState<CommunityUser | null>(
    serverData?.userProfile
      ? {
          ...(serverData.userProfile as unknown as CommunityUser),
          subscription_plan: serverData.isAdmin
            ? "ultra"
            : (serverData.userProfile as any).subscription_plan ?? null,
        }
      : null
  );
  const [authLoading, setAuthLoading] = useState(!serverData);
  const [isCheckingPlan, setIsCheckingPlan] = useState(!serverData);
  const [allCourses, setAllCourses] = useState<any[]>(serverData?.allCourses || []);
  const [enrollmentData, setEnrollmentData] = useState<any>(serverData?.enrollmentData || null);
  const [hasCourses, setHasCourses] = useState<boolean | null>(() => {
    if (!serverData) return null;
    const enrolls = Array.isArray(serverData.enrollmentData)
      ? serverData.enrollmentData
      : serverData.enrollmentData?.enrollments ?? [];
    return enrolls.length > 0;
  });
  const [courseSlugMap, setCourseSlugMap] = useState<Record<string, string>>(() => {
    if (!serverData) return {};
    const mapping: Record<string, string> = {};
    if (Array.isArray(serverData.allCourses)) {
      serverData.allCourses.forEach((c: any) => {
        if (c.slug && c.id) mapping[c.slug] = c.id;
      });
    }
    const enrolls = Array.isArray(serverData.enrollmentData)
      ? serverData.enrollmentData
      : serverData.enrollmentData?.enrollments ?? [];
    if (Array.isArray(enrolls)) {
      enrolls.forEach((e: any) => {
        const slug = e.course?.slug || e.course_slug;
        const id = e.course?.id || e.course_id;
        if (slug && id) mapping[slug] = id;
      });
    }
    return mapping;
  });

  const [theme, setTheme] = useState<"claro" | "oscuro" | "sistema">(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("comunidad-theme") as
          | "claro"
          | "oscuro"
          | "sistema") || "claro"
      );
    }
    return "claro";
  });

  const [language, setLanguage] = useState<"es" | "en">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("comunidad-language") as "es" | "en") || "es";
    }
    return "es";
  });

  // Theme persistence
  useEffect(() => {
    localStorage.setItem("comunidad-theme", theme);
    if (theme === "oscuro") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("comunidad-language", language);
  }, [language]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  // If no serverData was provided, do a client-side fallback load
  useEffect(() => {
    if (serverData) return; // Already have data from server

    const loadFallback = async () => {
      try {
        const browser = createBrowserClient();
        const {
          data: { session },
        } = await browser.auth.getSession();
        if (session?.user) {
          setUserProfile({
            id: session.user.id,
            full_name:
              (session.user.user_metadata?.full_name as string | undefined) ||
              session.user.email ||
              "Usuario",
            email: session.user.email || "",
            avatar_url: null,
            role: "student",
            subscription_plan: null,
          });
        }
      } catch (err) {
        console.error("Error reading local session:", err);
      } finally {
        setAuthLoading(false);
      }

      try {
        const { getCommunityPortalData } = await import(
          "@/lib/supabase/comunidad"
        );
        const { isAdmin: adminStatus, userProfile: profile, enrollmentData, orgData, allCourses } =
          await getCommunityPortalData();
        setIsAdmin(adminStatus);
        if (profile) {
          const profileData = profile as unknown as CommunityUser;
          if (adminStatus) {
            profileData.subscription_plan = "ultra";
          }
          setUserProfile(profileData);
        }
        setAllCourses(Array.isArray(allCourses) ? allCourses : []);
        setEnrollmentData(enrollmentData);
        setHasCourses(
          (Array.isArray(enrollmentData)
            ? enrollmentData
            : enrollmentData.enrollments
          ).length > 0
        );
        setIsOrgManager(!!orgData);

        const mapping: Record<string, string> = {};
        if (Array.isArray(allCourses)) {
          allCourses.forEach((c: any) => {
            if (c.slug && c.id) mapping[c.slug] = c.id;
          });
        }
        const enrolls = Array.isArray(enrollmentData)
          ? enrollmentData
          : enrollmentData.enrollments;
        if (Array.isArray(enrolls)) {
          enrolls.forEach((e: any) => {
            const slug = e.course?.slug || e.course_slug;
            const id = e.course?.id || e.course_id;
            if (slug && id) mapping[slug] = id;
          });
        }
        setCourseSlugMap(mapping);
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setIsCheckingPlan(false);
      }
    };
    loadFallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasSubscription =
    !!userProfile?.subscription_plan &&
    (!userProfile?.subscription_expires_at ||
      new Date(userProfile.subscription_expires_at) >= new Date());
  const canAccessFull = isAdmin || hasSubscription;

  return (
    <CommunityContext.Provider
      value={{
        isAdmin,
        isOrgManager,
        userProfile,
        authLoading,
        isCheckingPlan,
        hasCourses,
        courseSlugMap,
        allCourses,
        enrollmentData,
        hasSubscription,
        canAccessFull,
        theme,
        setTheme,
        language,
        setLanguage,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}
