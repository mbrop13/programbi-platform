"use server";

import { createClient } from "./server";
import { revalidatePath } from "next/cache";

/**
 * Get the current user's profile data.
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url, role, subscription_plan, subscription_expires_at, phone, organization_id, department, study_streak, xp_points")
    .eq("id", user.id)
    .single();

  return profile || { 
    id: user.id, 
    full_name: user.email, 
    email: user.email, 
    avatar_url: null, 
    role: "student",
    subscription_plan: null,
    subscription_expires_at: null,
    phone: null
  };
}

/**
 * Checks if the current user is admin.
 * Looks at both profiles.role and community_members.role.
 */
export async function isCurrentUserAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;

  // Fetch as admin to bypass RLS entirely, ensuring we get the true role even if RLS Select policies are missing
  const { createAdminClient } = await import("./server");
  const adminDb = createAdminClient();

  // 1. Check profiles table
  const { data: profile } = await adminDb
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") return true;

  // 2. Check community_members table
  const { data: adminCheck } = await adminDb
    .from("community_members")
    .select("role")
    .eq("profile_id", user.id)
    .eq("role", "admin")
    .limit(1)
    .single();

  if (adminCheck) return true;
  
  // Fallback for dev — remove in production
  return user.email === "manuel@programbi.com" || false; 
}

// ------------------------------------------
// POSTS (MURO FEED) 
// ------------------------------------------

/**
 * Obtener todos los posts del muro de la comunidad. 
 * Se trae likes y profiles (autores).
 */
export async function getPosts(communityId: string = "default") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Realiza inner join a profiles para el autor
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      created_at,
      likes_count,
      is_pinned,
      author:profiles(id, full_name, avatar_url),
      comments(id, content, created_at, author:profiles(id, full_name, avatar_url))
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  let likedPostIds: string[] = [];
  if (user) {
    const { data: likes } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id);
    if (likes) {
      likedPostIds = likes.map((l: any) => l.post_id);
    }
  }

  const postsWithLiked = (posts || []).map((p: any) => ({
    ...p,
    is_liked_by_user: likedPostIds.includes(p.id)
  }));

  return postsWithLiked;
}

export async function createPost(content: string, isQuestion: boolean = false, communityId: string = "default") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Debes autenticarte");

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin && !isQuestion) {
    throw new Error("Solo los administradores pueden crear posts regulares no-preguntas");
  }

  // Obtenemos 'communityId' validado o por defecto insertaremos al primer community.
  let targetId = communityId;
  if (communityId === "default") {
     const { data: comm } = await supabase.from("communities").select("id").limit(1).single();
     if (comm) targetId = comm.id;
  }

  const { error } = await supabase.from("posts").insert({
    community_id: targetId,
    author_id: user.id,
    content,
    // Podría mapearse isQuestion al campo channel_id o metadata
    channel_id: isQuestion ? "support" : "general" 
  });

  if (error) {
    console.error("Error creating post:", error);
    throw new Error(error.message);
  }

  revalidatePath("/(comunidad)", "layout");
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes autenticarte");

  // Check if user already liked this post
  const { data: existingLike } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
  } else {
    // Like
    const { error } = await supabase
      .from("post_likes")
      .insert({
        post_id: postId,
        user_id: user.id
      });
    if (error) throw new Error(error.message);
  }
  
  revalidatePath("/(comunidad)", "layout");
}

export async function addComment(postId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes autenticarte");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    content
  });

  if (error) throw new Error(error.message);
  revalidatePath("/(comunidad)", "layout");
}

// ------------------------------------------
// ADMIN PANEL (MANAGEMENT)
// ------------------------------------------

export async function getCommunityMembers() {
  const supabase = await createClient();
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) throw new Error("Válido solo para Admins");

  const { data: members, error } = await supabase
    .from("community_members")
    .select(`
      role,
      joined_at,
      profile:profiles(id, full_name, email, avatar_url)
    `);

  if (error) {
    console.error("Error fetching members:", error.message);
    return [];
  }

  return members || [];
}

// ------------------------------------------
// CURSOS ALUMNO
// ------------------------------------------

export async function getEnrolledCourses() {
   const supabase = await createClient();
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) return [];
   
   // En Produccion la lógica haría join con "enrollments" o "purchases"
   // Temporalmente consultaremos los cursos publicados (simulando inscritos para demo func)
   const { data: courses, error } = await supabase
     .from("courses")
     .select("id, title, description, instructor_id, published, created_at")
     .eq("published", true)
     .limit(5);
   
   if (error || !courses) return [];

   // Mapeamos a la interfaz Premium de la comunidad
   return courses.map((c: any) => ({
      id: c.id,
      title: c.title,
      instructor: "Equipo ProgramBI",
      progress: Math.floor(Math.random() * 100), // Mock temporal de progreso de videos (hasta la fase de reproductor)
      totalModules: 10,
      completedModules: Math.floor(Math.random() * 10),
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      lastClass: "Continuar Lección",
      color: "bg-brand-blue"
   }));
}

/**
 * Returns the organization managed by the current logged-in user, if any.
 */
export async function getCurrentUserManagedOrganization() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Query intermediate table to see if user is a manager
  const { data: managerRecord, error } = await supabase
    .from("organization_managers")
    .select("organization_id, organizations(id, name, logo_url, domain)")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (error || !managerRecord) return null;
  return (managerRecord as any).organizations || null;
}

// ------------------------------------------
// CHAT GLOBAL ACTIONS
// ------------------------------------------

export async function getChatChannels() {
  const supabase = await createClient();
  
  // Get first community ID
  const { data: comm } = await supabase.from("communities").select("id").limit(1).single();
  if (!comm) return [];

  const { data: channels, error } = await supabase
    .from("chat_channels")
    .select("id, name, type, category")
    .eq("community_id", comm.id)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching channels:", error);
    return [];
  }

  // Seed default channels if empty
  if (!channels || channels.length === 0) {
    const defaultChannels = [
      { community_id: comm.id, name: "anuncios", type: "announcement", category: "General" },
      { community_id: comm.id, name: "general", type: "text", category: "General" },
      { community_id: comm.id, name: "python-help", type: "support", category: "Ayuda" },
      { community_id: comm.id, name: "sql-queries", type: "support", category: "Ayuda" },
      { community_id: comm.id, name: "power-bi", type: "support", category: "Ayuda" }
    ];
    const { data: seeded, error: seedError } = await supabase
      .from("chat_channels")
      .insert(defaultChannels)
      .select("id, name, type, category");
    if (!seedError && seeded) return seeded;
  }

  return channels || [];
}

export async function getChatMessages(channelId: string) {
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from("chat_messages")
    .select(`
      id,
      content,
      created_at,
      author:profiles(id, full_name, role, avatar_url)
    `)
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }
  return messages || [];
}

export async function sendChatMessage(channelId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes autenticarte");

  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      channel_id: channelId,
      author_id: user.id,
      content
    })
    .select(`
      id,
      content,
      created_at,
      author:profiles(id, full_name, role, avatar_url)
    `)
    .single();

  if (error) {
    console.error("Error sending message:", error);
    throw new Error(error.message);
  }
  return data;
}

export async function getActiveUsers() {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url")
    .limit(20);
  
  if (error) return [];
  
  return (profiles || []).map((p, i) => ({
    id: p.id,
    name: p.full_name,
    initials: p.full_name ? p.full_name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "??",
    role: p.role,
    color: p.role === "admin" ? "bg-gradient-to-br from-brand-blue to-indigo-600" : "bg-emerald-500",
    status: i % 3 === 0 ? "online" : i % 3 === 1 ? "idle" : "offline"
  }));
}
