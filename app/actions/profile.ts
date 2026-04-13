import { createBrowserClient } from "@supabase/ssr";

export async function updateProfile(data: { fullName: string }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No authenticated user" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: data.fullName })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
