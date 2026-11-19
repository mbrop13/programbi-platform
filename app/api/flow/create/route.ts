import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { getPricingVariantForUser } from "@/lib/experiments/user-variant";
import { bloqueoPorMercado } from "@/lib/paises/arbitraje";
import { resolveOrCreateGuestUser } from "@/lib/pago/guest-user";

/**
 * POST /api/flow/create
 * Creates a Flow payment order for one or multiple courses.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const { couponCode } = body;
    let { items } = body;

    // Flow cobra con el precio de Chile: con IP de EE.UU. se rechaza.
    const bloqueo = bloqueoPorMercado(req.headers, "cl");
    if (bloqueo) {
      return NextResponse.json(bloqueo, { status: 409 });
    }

    let userId: string;
    let email: string;
    if (user) {
      userId = user.id;
      email = user.email || "";
    } else {
      const guest = await resolveOrCreateGuestUser(req.headers, {
        name: body.guestName,
        email: body.guestEmail,
        whatsapp: body.guestWhatsapp,
      });
      if (!guest.ok) {
        return NextResponse.json({ error: guest.error }, { status: guest.status });
      }
      userId = guest.userId;
      email = guest.email;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      // Backwards compatibility with old single-course checkout
      if (body.courseSlug) {
        items = [{ courseSlug: body.courseSlug, levelName: body.levelName, quantity: 1 }];
      } else {
         return NextResponse.json({ error: "No se enviaron cursos para comprar" }, { status: 400 });
      }
    }

    const { courses: masterCourses } = await import("@/lib/data/courses");
    
    // Evaluate discount based on authenticated user subscription profile only
    let baseDiscountPercent = 0;
    let specDiscountPercent = 0;

    if (user) {
      const { data: profile } = await supabase.from('profiles').select('subscription_plan').eq('id', user.id).single();
      if (profile?.subscription_plan) {
        const userPlan = profile.subscription_plan;
        if (userPlan === 'pro') { baseDiscountPercent = 20; specDiscountPercent = 10; }
        else if (userPlan === 'max') { baseDiscountPercent = 25; specDiscountPercent = 12.5; }
        else if (userPlan === 'ultra') { baseDiscountPercent = 40; specDiscountPercent = 20; }
      }
    }

    const { getActivePromotions, getPriceOverrides } = await import("@/lib/supabase/comunidad-ai");
    const { aplicarPorcentajeDescuento, seleccionarPromocionCurso } = await import("@/lib/paises/precios");
    const activePromos = await getActivePromotions();
    const priceOverrides = await getPriceOverrides();


    const getOverriddenPrice = (slug: string, levelName: string, codePrice: number) => {
       const override = priceOverrides.find((o: { item_type?: string; item_id?: string; level_name?: string; price?: unknown }) => o.item_type === 'course' && o.item_id === slug && o.level_name === levelName);
       return override && typeof override.price === 'number' && override.price > 0 && override.price < codePrice
         ? override.price
         : codePrice;
    };

    let grandTotalClp = 0;
    const validatedItems: Array<{
      slug: string;
      levelName: string;
      quantity: number;
      pricePerUnit: number;
      title: string;
      selectedStartDate?: string | null;
      hasPromoDiscount: boolean;
    }> = [];

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
       
       const promo = seleccionarPromocionCurso(activePromos, masterCourse.slug, "cl", basePrice);
       
       let finalPriceClp = basePrice;
       
       if (promo && promo.promo_price && promo.promo_price > 0) {
         // If a fixed promo price is set, that overrides percentages (never raising above base)
         finalPriceClp = Math.min(basePrice, Math.round(promo.promo_price));
       } else {
         const promoDiscount = promo?.discount_percentage ?? 0;
         const maxDiscountPercent = Math.max(subDiscount, promoDiscount);
         finalPriceClp =
           maxDiscountPercent > 0
             ? aplicarPorcentajeDescuento(basePrice, maxDiscountPercent, 0)
             : basePrice;
       }
       
       const itemTotal = finalPriceClp * (item.quantity || 1);
       grandTotalClp += itemTotal;

        const isBundle = ["analisis-de-datos", "analitica-mineria"].includes(masterCourse.slug);
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

    // A-32 (OWASP ASVS L3): use a CSPRNG for order identifiers so they cannot
    // be predicted or collide. Math.random() is NOT cryptographically secure.
    const commerceOrder = `PBI-${randomUUID()}`;

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

    // Apply coupon discount if present
    if (couponCode) {
      const { validateCouponAction } = await import("@/lib/supabase/comunidad-ai");
      const itemSlugs = (items || []).map((i: { courseSlug?: string; slug?: string }) => i.courseSlug || i.slug).filter(Boolean);
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

    const flowResult = await createFlowPayment({
      commerceOrder,
      subject: subjectStr,
      amount: grandTotalClp,
      email,
      optional: {
        userId
      },
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

    const pricingVariant = await getPricingVariantForUser(adminDb, userId);
    const paymentRow: Record<string, unknown> = {
      user_id: userId,
      course_id: firstCourseId?.id || null,
      flow_order: commerceOrder,
      flow_token: flowResult.token,
      amount: grandTotalClp,
      currency: "CLP",
      status: "pending",
      payment_method: tempMetadata,
    };
    if (pricingVariant) paymentRow.pricing_variant = pricingVariant;
    const paymentInsert = await adminDb.from("payments").insert(paymentRow as never);
    if (paymentInsert.error && paymentRow.pricing_variant) {
      delete paymentRow.pricing_variant;
      await adminDb.from("payments").insert(paymentRow as never);
    }

    // Save scheduling_slots as pending_payment
    const { scheduling_slots = [] } = body;
    if (Array.isArray(scheduling_slots) && scheduling_slots.length > 0) {
      const slotsToInsert = scheduling_slots.map(slot => ({
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

    console.log("💰 Multi-cart Payment created:", commerceOrder, "Items:", validatedItems.length, "user:", userId);

    return NextResponse.json({
      url: flowResult.url,
      token: flowResult.token,
      commerceOrder,
    });

  } catch (error: unknown) {
    console.error("Error creating Flow payment:", error);
    const isProd = process.env.NODE_ENV === "production";
    const errMsg = error instanceof Error ? error.message : "Error al procesar el pago";
    return NextResponse.json(
      { error: isProd ? "Error al procesar el pago" : errMsg },
      { status: 500 }
    );
  }
}
