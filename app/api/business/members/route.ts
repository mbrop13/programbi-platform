import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getCurrentUserManagedOrganization } from "@/lib/supabase/comunidad";

// 1. GET: Fetch all organization members with their progress
export async function GET() {
  try {
    const org = await getCurrentUserManagedOrganization();
    if (!org) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const adminDb = createAdminClient();

    // Fetch profiles in the organization
    const { data: employees, error: empError } = await adminDb
      .from("profiles")
      .select("id, full_name, email, department, study_streak, xp_points, created_at")
      .eq("organization_id", org.id);

    if (empError) {
      console.error("Error fetching business members:", empError);
      return NextResponse.json({ error: "Error al cargar miembros" }, { status: 500 });
    }

    const employeeIds = (employees || []).map((e) => e.id);

    if (employeeIds.length === 0) {
      return NextResponse.json({ members: [], invitations: [] });
    }

    // Fetch enrollments with course titles
    const { data: enrollments, error: enrolError } = await adminDb
      .from("enrollments")
      .select("id, user_id, status, courses(id, title), enrolled_at, completed_at")
      .in("user_id", employeeIds);

    // Fetch certificates
    const { data: certificates, error: certError } = await adminDb
      .from("certificates")
      .select("id, user_id, course_id, certificate_code, issued_at")
      .in("user_id", employeeIds);

    // Fetch pending invitations
    const { data: invitations } = await adminDb
      .from("organization_invitations")
      .select("id, email, department, created_at")
      .eq("organization_id", org.id);

    // Map and consolidate members data
    const members = (employees || []).map((emp) => {
      const empEnrollments = (enrollments || []).filter((en) => en.user_id === emp.id);
      const empCertificates = (certificates || []).filter((cert) => cert.user_id === emp.id);

      // Detail course progress list
      const coursesProgress = empEnrollments.map((en: any) => ({
        id: en.id,
        courseTitle: en.courses?.title || "Curso Desconocido",
        status: en.status,
        enrolledAt: en.enrolled_at,
        completedAt: en.completed_at,
      }));

      // Calculate overall stats
      const totalCourses = empEnrollments.length;
      const completedCourses = empEnrollments.filter((en) => en.status === "completed").length;
      const avgProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

      return {
        id: emp.id,
        fullName: emp.full_name,
        email: emp.email,
        department: emp.department || "General",
        studyStreak: emp.study_streak || 0,
        xpPoints: emp.xp_points || 0,
        createdAt: emp.created_at,
        coursesProgress,
        certificatesCount: empCertificates.length,
        avgProgress,
      };
    });

    return NextResponse.json({
      members,
      invitations: invitations || [],
    });
  } catch (err: any) {
    console.error("Error in GET business members API:", err);
    return NextResponse.json({ error: "Error interno de servidor" }, { status: 500 });
  }
}

// 2. POST: Invite or associate a new member to the organization
export async function POST(req: Request) {
  try {
    const org = await getCurrentUserManagedOrganization();
    if (!org) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { email, fullName, department } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const adminDb = createAdminClient();

    // Check if the user is already registered in profiles
    const { data: existingProfile } = await adminDb
      .from("profiles")
      .select("id, email, organization_id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (existingProfile) {
      if (existingProfile.organization_id === org.id) {
        return NextResponse.json({ error: "El usuario ya es parte de tu organización" }, { status: 400 });
      }

      // Associate existing profile with organization
      const { error: updateError } = await adminDb
        .from("profiles")
        .update({
          organization_id: org.id,
          department: department || "General",
        })
        .eq("id", existingProfile.id);

      if (updateError) {
        console.error("Error updating profile in invitation:", updateError);
        return NextResponse.json({ error: "Error al asociar colaborador" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Colaborador asociado exitosamente" });
    } else {
      // User is not registered yet. Create a pending invitation in organization_invitations
      const { error: inviteError } = await adminDb
        .from("organization_invitations")
        .insert({
          organization_id: org.id,
          email: email.trim().toLowerCase(),
          department: department || "General",
        });

      if (inviteError) {
        // Handle constraint/unique email violations
        if (inviteError.code === "23505") {
          return NextResponse.json({ error: "Este email ya tiene una invitación pendiente" }, { status: 400 });
        }
        console.error("Error inserting invitation:", inviteError);
        return NextResponse.json({ error: "Error al registrar invitación" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Invitación pendiente registrada. Se asociará en su registro." });
    }
  } catch (err: any) {
    console.error("Error in POST business members API:", err);
    return NextResponse.json({ error: "Error interno de servidor" }, { status: 500 });
  }
}

// 3. DELETE: De-associate an employee from the organization (revoke corporate access)
export async function DELETE(req: Request) {
  try {
    const org = await getCurrentUserManagedOrganization();
    if (!org) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const inviteId = searchParams.get("inviteId");

    const adminDb = createAdminClient();

    if (inviteId) {
      // Delete a pending invitation
      const { error: deleteInviteError } = await adminDb
        .from("organization_invitations")
        .delete()
        .eq("id", inviteId)
        .eq("organization_id", org.id);

      if (deleteInviteError) {
        console.error("Error deleting pending invite:", deleteInviteError);
        return NextResponse.json({ error: "Error al eliminar la invitación" }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Invitación cancelada" });
    }

    if (!userId) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    // Update profile to set organization_id and department to null
    const { error: removeError } = await adminDb
      .from("profiles")
      .update({
        organization_id: null,
        department: null,
      })
      .eq("id", userId)
      .eq("organization_id", org.id); // Security: ensure employee belongs to manager's org

    if (removeError) {
      console.error("Error de-associating user:", removeError);
      return NextResponse.json({ error: "Error al remover colaborador de la empresa" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Colaborador desvinculado de la empresa exitosamente" });
  } catch (err: any) {
    console.error("Error in DELETE business members API:", err);
    return NextResponse.json({ error: "Error interno de servidor" }, { status: 500 });
  }
}
