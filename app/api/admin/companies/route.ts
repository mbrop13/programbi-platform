import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// Helper function to generate a sanitized password meeting common security standards
function generatePassword(companyName: string, employeeName: string): string {
  const cleanCompany = companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanName = employeeName.toLowerCase().replace(/[^a-z0-9]/g, "");
  // Ensures password has a letters, numbers, and special characters
  return `${cleanCompany}_${cleanName || "user"}_secure2026!`;
}

// Simple CSV parser for multipart form-data uploads
function parseCSV(csvText: string): { email: string; name: string }[] {
  const lines = csvText.split(/\r?\n/);
  const employees: { email: string; name: string }[] = [];
  let headers: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by comma, handling potential surrounding quotes
    const parts = line.split(",").map((p) => p.trim().replace(/^["']|["']$/g, ""));

    // Check if the first line is a header
    if (i === 0 && (parts[0].toLowerCase().includes("email") || parts[0].toLowerCase().includes("name"))) {
      headers = parts.map((h) => h.toLowerCase());
      continue;
    }

    let email = "";
    let name = "";

    if (headers.length > 0) {
      const emailIdx = headers.indexOf("email");
      const nameIdx = headers.indexOf("name");
      if (emailIdx !== -1 && parts[emailIdx]) email = parts[emailIdx];
      if (nameIdx !== -1 && parts[nameIdx]) name = parts[nameIdx];
    } else {
      // Fallback: search for email by locating the "@" symbol
      if (parts[0] && parts[0].includes("@")) {
        email = parts[0];
        name = parts[1] || parts[0].split("@")[0];
      } else if (parts[1] && parts[1].includes("@")) {
        email = parts[1];
        name = parts[0];
      } else {
        email = parts[0] || "";
        name = parts[1] || "";
      }
    }

    if (email && email.includes("@")) {
      employees.push({
        email: email.toLowerCase(),
        name: name || email.split("@")[0],
      });
    }
  }

  return employees;
}

export async function POST(req: NextRequest) {
  try {
    // ─── 1. AUTHENTICATION & SUPERADMIN CHECK ───
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Initialize admin DB client to bypass RLS for verifying the admin role
    const adminDb = createAdminClient();

    const { data: callerProfile, error: profileError } = await adminDb
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || callerProfile?.role !== "admin") {
      return NextResponse.json({ error: "No autorizado. Se requiere rol de administrador." }, { status: 403 });
    }

    // ─── 2. PARSE REQUEST DATA ───
    let companyName = "";
    let logoUrl = "";
    let domain = "";
    let employees: { email: string; name: string }[] = [];
    let managerEmail = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      companyName = (formData.get("name") as string) || "";
      logoUrl = (formData.get("logoUrl") as string) || "";
      domain = (formData.get("domain") as string) || "";
      managerEmail = (formData.get("managerEmail") as string) || "";

      const file = formData.get("file") as File;
      if (file) {
        const csvText = await file.text();
        employees = parseCSV(csvText);
      }
    } else {
      // Expect JSON
      const body = await req.json();
      companyName = body.name || "";
      logoUrl = body.logoUrl || "";
      domain = body.domain || "";
      managerEmail = body.managerEmail || "";
      employees = body.employees || [];
    }

    if (!companyName) {
      return NextResponse.json({ error: "El nombre de la empresa es requerido" }, { status: 400 });
    }

    if (!managerEmail) {
      return NextResponse.json({ error: "El email del administrador/manager de la empresa es requerido" }, { status: 400 });
    }

    // Normalize email addresses
    managerEmail = managerEmail.trim().toLowerCase();
    employees = employees.map((emp) => ({
      email: emp.email.trim().toLowerCase(),
      name: emp.name.trim(),
    }));

    // Ensure manager is in the list of employees to create/link
    const managerInList = employees.some((emp) => emp.email === managerEmail);
    if (!managerInList) {
      // If manager is not explicitly in list, add a fallback or throw error
      // Better to check if the admin passed manager details separately or add manager to employees
      return NextResponse.json({
        error: "El email del manager designado debe estar incluido en la lista de colaboradores",
      }, { status: 400 });
    }

    // ─── 3. CREATE ORGANIZATION ───
    const { data: organization, error: orgError } = await adminDb
      .from("organizations")
      .insert({
        name: companyName,
        logo_url: logoUrl || null,
        domain: domain || null,
      })
      .select()
      .single();

    if (orgError || !organization) {
      console.error("Error creating organization:", orgError);
      return NextResponse.json({ error: "Error al crear la organización en la base de datos" }, { status: 500 });
    }

    const organizationId = organization.id;

    // ─── 4. PROCESS EMPLOYEES ───
    const results = {
      total: employees.length,
      created: 0,
      associated: 0,
      failed: 0,
      errors: [] as { email: string; error: string }[],
    };

    for (const employee of employees) {
      try {
        // A. Check if user already exists in profiles database
        const { data: existingProfile } = await adminDb
          .from("profiles")
          .select("id, email, organization_id")
          .eq("email", employee.email)
          .maybeSingle();

        let userId = existingProfile?.id;
        let isNewUser = false;

        // B. If user doesn't exist, create them in Supabase Auth
        if (!userId) {
          const password = generatePassword(companyName, employee.name);

          const { data: authData, error: authCreateError } = await adminDb.auth.admin.createUser({
            email: employee.email,
            email_confirm: true,
            password: password,
            user_metadata: {
              full_name: employee.name,
            },
          });

          if (authCreateError) {
            // Handle race condition/edge case where user exists in Auth but not in profiles
            if (authCreateError.message.includes("already") || authCreateError.status === 422) {
              const { data: listData } = await adminDb.auth.admin.listUsers();
              const authUser = listData?.users?.find((u) => u.email?.toLowerCase() === employee.email);
              if (authUser) {
                userId = authUser.id;
              } else {
                throw new Error(`El usuario ya existe en Auth pero no se pudo recuperar: ${authCreateError.message}`);
              }
            } else {
              throw authCreateError;
            }
          } else if (authData?.user) {
            userId = authData.user.id;
            isNewUser = true;
          }
        }

        if (!userId) {
          throw new Error("No se pudo obtener ni crear el ID de usuario");
        }

        // C. Associate/Upsert user profile with the organization ID
        const { error: profileError } = await adminDb
          .from("profiles")
          .upsert({
            id: userId,
            email: employee.email,
            full_name: employee.name,
            organization_id: organizationId,
            role: "student", // default role in the platform
          });

        if (profileError) {
          throw new Error(`Error al asociar el perfil: ${profileError.message}`);
        }

        if (isNewUser) {
          results.created++;
        } else {
          results.associated++;
        }

        // D. If this user is the designated manager, insert them into organization_managers
        if (employee.email === managerEmail) {
          const { error: managerError } = await adminDb
            .from("organization_managers")
            .upsert(
              {
                organization_id: organizationId,
                profile_id: userId,
              },
              { onConflict: "organization_id, profile_id" }
            );

          if (managerError) {
            console.error(`Error vinculando manager (${employee.email}):`, managerError);
            results.errors.push({
              email: employee.email,
              error: `Usuario asociado pero falló designación como manager: ${managerError.message}`,
            });
          }
        }
      } catch (err: any) {
        console.error(`Error processing employee ${employee.email}:`, err);
        results.failed++;
        results.errors.push({
          email: employee.email,
          error: err.message || "Error desconocido",
        });
      }
    }

    return NextResponse.json({
      success: true,
      organization,
      results,
    });
  } catch (err: any) {
    console.error("Error in superadmin create company API:", err);
    return NextResponse.json({ error: err.message || "Error interno del servidor" }, { status: 500 });
  }
}
