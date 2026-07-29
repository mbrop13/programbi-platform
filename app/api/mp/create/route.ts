import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

/**
 * POST /api/mp/create
 * Creates a MercadoPago Checkout Pro preference for one or multiple courses.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Debes iniciar sesión para comprar" }, { status: 401 });
    }

    const body = await req.json();
    let { items, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      // Backwards compatibility with old single-course checkout
      if (body.courseSlug) {
        items = [{ courseSlug: body.courseSlug, levelName: body.levelName, quantity: 1 }];
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


    const getOverriddenPrice = (slug: string, levelName: string, codePrice: number) => {
       const override = priceOverrides.find((o: any) => o.item_type === 'course' && o.item_id === slug && o.level_name === levelName);
       return override ? override.price : codePrice;
    };

    let grandTotalClp = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
       if (item.courseSlug === "asesoria") {
          const finalPriceClp = 60000;
          const itemTotal = finalPriceClp * (item.quantity || 1);
          grandTotalClp += itemTotal;
          validatedItems.push({
            slug: "asesoria",
            levelName: "Hora",
            quantity: item.quantity || 1,
            pricePerUnit: finalPriceClp,
            title: "Mentoría y Asesoría 1 a 1",
            hasPromoDiscount: false
          });
          continue;
       }

       const masterCourse = masterCourses.find((c: any) => c.slug === item.courseSlug);
       if (!masterCourse) {
         return NextResponse.json({ error: `Curso no encontrado: ${item.courseSlug}` }, { status: 404 });
       }
       
       let basePrice = 0;
       if (item.levelName) {
         const masterLevel = masterCourse.levels?.find((l: any) => 
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
       
       const promo = activePromos.find((pr: any) => pr.target_type === 'all' || pr.target_type === 'courses' || (pr.target_type === 'specific_course' && pr.target_id === masterCourse.slug));
       
       let finalPriceClp = basePrice;
       
       if (promo && promo.promo_price) {
         // If a fixed promo price is set, that overrides percentages
         finalPriceClp = promo.promo_price;
       } else {
         const promoDiscount = promo ? promo.discount_percentage : 0;
         const maxDiscountPercent = Math.max(subDiscount, promoDiscount);
         const discountMultiplier = 1 - (maxDiscountPercent / 100);
         finalPriceClp = Math.floor(basePrice * discountMultiplier);
       }
       
       const itemTotal = finalPriceClp * (item.quantity || 1);
       grandTotalClp += itemTotal;

        const isBundle = ["analisis-de-datos", "analitica-mineria", "analitica-financiera"].includes(masterCourse.slug);
        const hasPromoDiscount = isBundle || !!promo;

        validatedItems.push({
           slug: masterCourse.slug,
           levelName: item.levelName || "Básico",
           quantity: item.quantity || 1,
           pricePerUnit: finalPriceClp,
           title: masterCourse.title,
           selectedStartDate: item.selectedStartDate || null,
           hasPromoDiscount
        });
    }

    const email = user.email || "";
    // A-32 (OWASP ASVS L3): use a CSPRNG for order identifiers so they cannot
    // be predicted or collide. Math.random() is NOT cryptographically secure.
    const commerceOrder = `PBI-${randomUUID()}`;

    // Calculate bump add logic correctly for backwards compatibility
    const { bumpSelections = [] } = body;
    let bumpAddTotal = 0;
    if (Array.isArray(bumpSelections)) {
        bumpAddTotal = bumpSelections.length * 99000;
        grandTotalClp += bumpAddTotal;
    }

    // Apply coupon discount if present
    if (couponCode) {
      const { validateCouponAction } = await import("@/lib/supabase/comunidad-ai");
      const itemSlugs = (items || []).map((i: any) => i.courseSlug || i.slug).filter(Boolean);
      const couponRes = await validateCouponAction(couponCode, itemSlugs);
      if (!couponRes.valid) {
        return NextResponse.json({ error: couponRes.message || "Cupón inválido" }, { status: 400 });
      }
      
      const allowStacking = !!couponRes.allow_stacking;
      
      if (allowStacking) {
        const discountMultiplier = 1 - (couponRes.discount_percentage / 100);
        grandTotalClp = Math.floor(grandTotalClp * discountMultiplier);
      } else {
        let finalTotalClp = 0;
        for (const valItem of validatedItems) {
          const itemSubtotal = valItem.pricePerUnit * valItem.quantity;
          if (!valItem.hasPromoDiscount) {
            finalTotalClp += Math.floor(itemSubtotal * (1 - (couponRes.discount_percentage / 100)));
          } else {
            finalTotalClp += itemSubtotal;
          }
        }
        // Add bump additions flat (they are not discounted if stacking is false)
        grandTotalClp = finalTotalClp + bumpAddTotal;
      }
    }

    // ── Create MercadoPago Checkout Pro preference ──
    const { createMPPreference } = await import("@/lib/mercadopago/client");
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const subjectStr = validatedItems.length === 1 
      ? `ProgramBI - ${validatedItems[0].title}`
      : `ProgramBI - ${validatedItems.length} cursos seleccionados`;

    // Build items array for MercadoPago
    // MP requires unit_price > 0 for each item. For multi-item carts,
    // we create a single consolidated item to ensure coupon math is exact.
    const mpItems = [{
      title: subjectStr,
      quantity: 1,
      unitPrice: grandTotalClp,
    }];

    const preference = await createMPPreference({
      items: mpItems,
      payerEmail: email,
      externalReference: commerceOrder,
      backUrls: {
        success: `${APP_URL}/api/mp/return`,
        failure: `${APP_URL}/api/mp/return`,
        pending: `${APP_URL}/api/mp/return`,
      },
      notificationUrl: `${APP_URL}/api/mercadopago/webhook`,
      metadata: {
        type: "course_purchase",
        user_id: user.id,
        commerce_order: commerceOrder,
      },
      autoReturn: "approved",
    });

    // Save payment record
    const adminDb = createAdminClient();
    
    // We try to get the id of the first course for relational data backwards compatibility
    const { data: firstCourseId } = await adminDb.from("courses").select("id").eq("slug", validatedItems[0].slug).maybeSingle();

    // Store cart data temporarily in payment_method so the webhook can retrieve it
    const tempMetadata = JSON.stringify({
      items: validatedItems,
      slots: body.scheduling_slots || [],
      couponCode: couponCode || null
    });

    await adminDb.from("payments").insert({
      user_id: user.id,
      course_id: firstCourseId?.id || null,
      flow_order: commerceOrder, // Reusing column for commerce order ID
      flow_token: preference.id, // Reusing column for MP preference ID
      amount: grandTotalClp,
      currency: "CLP",
      status: "pending",
      payment_method: tempMetadata
    } as any);

    // Save scheduling_slots as pending_payment
    const { scheduling_slots = [] } = body;
    if (Array.isArray(scheduling_slots) && scheduling_slots.length > 0) {
      const slotsToInsert = scheduling_slots.map((slot: any) => ({
        slot_date: slot.date,
        slot_time: slot.time,
        status: "pending_payment",
        user_email: email,
        flow_order: commerceOrder
      }));
      // Delete any conflicting pending slots first (cleanup just in case)
      for (const s of slotsToInsert) {
         await adminDb.from("asesoria_slots").delete().match({ slot_date: s.slot_date, slot_time: s.slot_time, status: "pending_payment" });
      }
      const { error: slotsErr } = await adminDb.from("asesoria_slots").insert(slotsToInsert);
      if (slotsErr) {
        console.error("Warning: could not hold asesoria slots:", slotsErr);
      }
    }

    console.log("💰 MP Payment created:", commerceOrder, "Items:", validatedItems.length, "user:", user.id, "Total:", grandTotalClp);

    return NextResponse.json({
      url: preference.init_point,
      token: preference.id,
      commerceOrder,
    });

  } catch (error: any) {
    console.error("Error creating MercadoPago payment:", error);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json(
      { error: isProd ? "Error al procesar el pago" : (error.message || "Error al procesar el pago") },
      { status: 500 }
    );
  }
}
