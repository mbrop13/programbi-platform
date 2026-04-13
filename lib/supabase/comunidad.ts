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
    .select("id, full_name, email, avatar_url, role, subscription_plan, subscription_expires_at")
    .eq("id", user.id)
    .single();

  return profile || { 
    id: user.id, 
    full_name: user.email, 
    email: user.email, 
    avatar_url: null, 
    role: "student",
    subscription_plan: null,
    subscription_expires_at: null
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

  return posts || [];
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

  // Nota: implementaremos algo sencillo iterando count.
  // En producción real, requeriría tabla de posts_likes(post_id, user_id)
  const { data: post } = await supabase.from("posts").select("likes_count").eq("id", postId).single();
  let count = post?.likes_count || 0;
  
  const { error } = await supabase.from("posts").update({ likes_count: count + 1 }).eq("id", postId);
  
  if (error) throw new Error(error.message);
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
