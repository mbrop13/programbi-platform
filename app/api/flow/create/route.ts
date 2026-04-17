import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * POST /api/flow/create
 * Creates a Flow payment order for one or multiple courses.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Debes iniciar sesión para comprar" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      // Backwards compatibility with old single-course checkout
      if (body.courseSlug) {
        items.push({ courseSlug: body.courseSlug, levelName: body.levelName, quantity: 1 });
      } else {
         return NextResponse.json({ error: "No se enviaron cursos para comprar" }, { status: 400 });
      }
    }

    const { courses: masterCourses } = await import("@/lib/data/courses");
    
    // Evaluate discount based on user subscription profile
    let baseDiscountPercent = 0;
    let specDiscountPercent = 0;
    
    const { data: profile } = await supabase.from('profiles').select('subscription_plan').eq('id', user.id).single();
    if (profile?.subscription_plan) {
      const userPlan = profile.subscription_plan;
      if (userPlan === 'pro') { baseDiscountPercent = 20; specDiscountPercent = 10; }
      else if (userPlan === 'max') { baseDiscountPercent = 25; specDiscountPercent = 12.5; }
      else if (userPlan === 'ultra') { baseDiscountPercent = 40; specDiscountPercent = 20; }
    }

    const { getActivePromotions, getPriceOverrides } = await import("@/lib/supabase/comunidad-ai");
    const activePromos = await getActivePromotions();
    const priceOverrides = await getPriceOverrides();

    const getGlobalDiscount = (slug: string) => {
       const p = activePromos.find((pr: any) => pr.target_type === 'all' || pr.target_type === 'courses' || (pr.target_type === 'specific_course' && pr.target_id === slug));
       return p ? p.discount_percentage : 0;
    };

    const getOverriddenPrice = (slug: string, levelName: string, codePrice: number) => {
       const override = priceOverrides.find((o: any) => o.item_type === 'course' && o.item_id === slug && o.level_name === levelName);
       return override ? override.price : codePrice;
    };

    let grandTotalClp = 0;
    const validatedItems = [];

    for (const item of items) {
       const masterCourse = masterCourses.find(c => c.slug === item.courseSlug);
       if (!masterCourse) {
         return NextResponse.json({ error: `Curso no encontrado: ${item.courseSlug}` }, { status: 404 });
       }
       
       let basePrice = 0;
       if (item.levelName) {
         const masterLevel = masterCourse.levels?.find(l => 
           l.name.toLowerCase().includes(item.levelName.toLowerCase()) || 
           item.levelName.toLowerCase().includes(l.name.toLowerCase())
         );
         if (masterLevel && masterLevel.price) basePrice = masterLevel.price;
       } else if (masterCourse.levels && masterCourse.levels.length > 0) {
         basePrice = masterCourse.levels[0].price || basePrice;
       }

       if (basePrice <= 0) {
          return NextResponse.json({ error: `El curso ${masterCourse.title} no tiene precio definido` }, { status: 400 });
       }

       // Apply price override from admin panel if exists
       basePrice = getOverriddenPrice(masterCourse.slug, item.levelName || "Básico", basePrice);

       const isSpec = (masterCourse.durationHours > 50 || masterCourse.slug.includes("analisis") || masterCourse.slug.includes("analitica"));
       const subDiscount = isSpec ? specDiscountPercent : baseDiscountPercent;
       const promoDiscount = getGlobalDiscount(masterCourse.slug);
       const maxDiscountPercent = Math.max(subDiscount, promoDiscount);

       const discountMultiplier = 1 - (maxDiscountPercent / 100);
       
       const finalPriceClp = Math.floor(basePrice * discountMultiplier);
       const itemTotal = finalPriceClp * (item.quantity || 1);
       grandTotalClp += itemTotal;

       validatedItems.push({
          slug: masterCourse.slug,
          levelName: item.levelName || "Básico",
          quantity: item.quantity || 1,
          pricePerUnit: finalPriceClp,
          title: masterCourse.title
       });
    }

    const email = user.email || "";
    const commerceOrder = `PBI-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const { createFlowPayment } = await import("@/lib/flow/client");

    const subjectStr = validatedItems.length === 1 
      ? `ProgramBI - ${validatedItems[0].title}`
      : `ProgramBI - ${validatedItems.length} cursos seleccionados`;

    // Calculate bump add logic correctly for backwards compatibility
    const { bumpSelections = [] } = body;
    let bumpAddTotal = 0;
    if (Array.isArray(bumpSelections)) {
        bumpAddTotal = bumpSelections.length * 99000;
        grandTotalClp += bumpAddTotal;
    }

    const flowResult = await createFlowPayment({
      commerceOrder,
      subject: subjectStr,
      amount: grandTotalClp,
      email,
      optional: {
        userId: user.id
      },
    });

    // Save payment record
    const adminDb = createAdminClient();
    
    // We try to get the id of the first course for relational data backwards compatibility
    const { data: firstCourseId } = await adminDb.from("courses").select("id").eq("slug", validatedItems[0].slug).maybeSingle();

    await adminDb.from("payments").insert({
      user_id: user.id,
      course_id: firstCourseId?.id || null,
      flow_order: commerceOrder,
      flow_token: flowResult.token,
      amount: grandTotalClp,
      currency: "CLP",
      status: "pending",
      payer_email: email,
      // Pass items payload as metadata for robust processing logic later
      metadata: { items: validatedItems }
    } as any);

    console.log("💰 Multi-cart Payment created:", commerceOrder, "Items:", validatedItems.length, "user:", user.id);

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
