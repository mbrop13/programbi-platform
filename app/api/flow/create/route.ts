import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * POST /api/flow/create
 * Creates a Flow payment order. Requires authenticated user.
 * Stores courseSlug in the payment for direct enrollment later.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Debes iniciar sesión para comprar" }, { status: 401 });
    }

    const body = await req.json();
    const { courseId, courseSlug, levelName } = body;

    if (!courseId && !courseSlug) {
      return NextResponse.json({ error: "courseId o courseSlug requerido" }, { status: 400 });
    }

    // Get course info — look up by slug first, fallback to id
    let courseQuery = supabase
      .from("courses")
      .select("id, title, slug, price_clp");
    
    if (courseSlug) {
      courseQuery = courseQuery.eq("slug", courseSlug);
    } else {
      courseQuery = courseQuery.eq("id", courseId);
    }

    const { data: course } = await courseQuery.single();

    if (!course) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    // --- PRICE CALCULATION LOGIC ---
    // We use the local courses data as the source of truth for level-specific pricing
    const { courses: masterCourses } = await import("@/lib/data/courses");
    const masterCourse = masterCourses.find(c => c.slug === course.slug);
    
    let basePrice = course.price_clp || 0;

    if (masterCourse) {
      if (levelName) {
        // Search for the level in the master data
        const masterLevel = masterCourse.levels?.find(l => 
          l.name.toLowerCase().includes(levelName.toLowerCase()) || 
          levelName.toLowerCase().includes(l.name.toLowerCase())
        );
        if (masterLevel && masterLevel.price) {
          basePrice = masterLevel.price;
        }
      } else if (masterCourse.levels && masterCourse.levels.length > 0) {
        // Fallback to the first level's price if no level specified but levels exist
        basePrice = masterCourse.levels[0].price || basePrice;
      }
    }

    if (basePrice <= 0) {
      return NextResponse.json({ error: "Este curso aún no tiene precio definido" }, { status: 400 });
    }

    // Determine discount dynamically
    let discountMultiplier = 1;
    const { data: profile } = await supabase.from('profiles').select('subscription_plan').eq('id', user.id).single();
    if (profile?.subscription_plan) {
      const isSpec = masterCourse && (
        masterCourse.durationHours > 50 || 
        masterCourse.slug === "analisis-de-datos" || 
        masterCourse.slug === "analitica-mineria" || 
        masterCourse.slug === "analitica-financiera"
      );
      const userPlan = profile.subscription_plan;
      let discPercent = 0;
      if (userPlan === 'pro') discPercent = isSpec ? 10 : 20;
      else if (userPlan === 'max') discPercent = isSpec ? 12.5 : 25;
      else if (userPlan === 'ultra') discPercent = isSpec ? 20 : 40;
      
      discountMultiplier = 1 - (discPercent / 100);
    }
    
    let finalPriceClp = Math.floor(basePrice * discountMultiplier);

    // Check if already enrolled
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", course.slug)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Ya estás inscrito en este curso" }, { status: 400 });
    }

    // Get user email
    const email = user.email || "";

    // Generate unique commerce order ID
    const commerceOrder = `PBI-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const { bumpSelections = [] } = body;
    let bumpAddTotal = 0;
    
    // Security check: Only add if the array is an array
    if (Array.isArray(bumpSelections)) {
        bumpAddTotal = bumpSelections.length * 99000;
    }
    
    const grandTotalClp = finalPriceClp + bumpAddTotal;

    // Import Flow client
    const { createFlowPayment } = await import("@/lib/flow/client");

    // Create payment in Flow — pass courseSlug, userId and bumpSelections in optional
    const flowResult = await createFlowPayment({
      commerceOrder,
      subject: `ProgramBI - ${course.title}${bumpSelections.length > 0 ? ' + Bundle Especial' : ''}`,
      amount: grandTotalClp,
      email,
      optional: {
        userId: user.id,
        courseSlug: course.slug,
        courseId: course.id,
        levelName, // Store selected level name
        bumpSelections: JSON.stringify(bumpSelections), // Pass the array as JSON string
      },
    });

    // Save payment record with courseSlug for reliable matching
    const adminDb = createAdminClient();
    await adminDb.from("payments").insert({
      user_id: user.id,
      course_id: course.id,
      flow_order: commerceOrder,
      flow_token: flowResult.token,
      amount: grandTotalClp,
      currency: "CLP",
      status: "pending",
      payer_email: email,
    });

    console.log("💰 Payment created:", commerceOrder, "for", course.slug, "user:", user.id);

    return NextResponse.json({
      url: flowResult.url,
      token: flowResult.token,
      commerceOrder,
    });

  } catch (error: any) {
    console.error("Error creating Flow payment:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar el pago" },
      { status: 500 }
    );
  }
}
