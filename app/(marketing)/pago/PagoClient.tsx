"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CourseImage from "@/components/shared/CourseImage";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Calendar, Building2, User, Users,
  CheckCircle2, Bell, Loader2, ShoppingCart, Check, Plus, Minus,
  X, BadgeCheck, ChevronUp, ChevronDown,
  Info, Globe, Tag
} from "lucide-react";
import { courses as allCourses, Course, COURSE_NAV_GROUPS } from "@/lib/data/courses";

const CATALOG_FILTERS = [{ id: "todos" as const, label: "Todos" }, ...COURSE_NAV_GROUPS];
type CatalogFilter = (typeof CATALOG_FILTERS)[number]["id"];

const chipClass = (on: boolean) =>
  `rounded-md border-2 px-3.5 py-2 text-sm font-semibold transition-colors ${
    on
      ? "border-[rgb(23_23_22_/_0.28)] bg-paper text-ink"
      : "border-transparent bg-wash text-mute hover:text-ink"
  }`;

const fieldClass =
  "w-full rounded-md border border-line bg-wash px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-[rgb(23_23_22_/_0.28)] focus:bg-paper";
import { type CourseSchedule, analisisDeDatosSlugs, formatScheduleDate, getNearestSchedule, getAllActiveSchedules, convertSchedule, SCHEDULE_COUNTRIES } from "@/lib/data/course-schedules";
import { FadeIn } from "@/components/shared/AnimatedComponents";
import { useCountry } from "@/lib/context/CountryContext";
import { validateCouponAction } from "@/lib/supabase/comunidad-ai";
import { trackCheckoutStart, trackLeadSubmit } from "@/lib/analytics/marketing";

type Mode = "individual" | "enterprise";

interface CartItem {
  slug: string;
  levelName: string;
  price: number;
  quantity: number;
  title: string;
  selectedStartDate?: string;
  selectedScheduleDays?: string;
  selectedScheduleTime?: string;
  originalPrice?: number;
  hasDiscount?: boolean;
}

export default function PagoClient() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("curso") || "";
  const initialLevel = searchParams.get("nivel") || "";
  const initialName = searchParams.get("nombre") || "";
  const initialEmail = searchParams.get("email") || "";
  const initialServicio = searchParams.get("servicio") || "";

  const { country, countries, setCountryByIso, convertPrice, convertTime } = useCountry();
  const scheduleCountry = useMemo(() => SCHEDULE_COUNTRIES.find(c => c.code === country.iso) || SCHEDULE_COUNTRIES[0], [country.iso]);

  const [mode, setMode] = useState<Mode>("individual");
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilter>("todos");
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [priceOverrides, setPriceOverrides] = useState<any[]>([]);
  const [courseDescriptions, setCourseDescriptions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Country state for dropdown


  // Cart state
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  // Enterprise toggles
  const [enterpriseToggles, setEnterpriseToggles] = useState<Set<string>>(new Set());
  
  // Selected levels per course slug
  const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({});

  // Selected start dates per course level combination
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});

  // Custom dropdown open key (slug-levelName)
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);

  const [notifyLoading, setNotifyLoading] = useState<string | null>(null);
  const [notifySuccess, setNotifySuccess] = useState<Set<string>>(new Set());
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmittingEnterprise, setIsSubmittingEnterprise] = useState(false);
  const [enterpriseSuccess, setEnterpriseSuccess] = useState(false);

  // Coupon states & handlers
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount_percentage: number; allow_stacking: boolean } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    
    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await validateCouponAction(couponCodeInput);
      if (res.valid) {
        const items = Object.values(cart);
        if (!res.allow_stacking && items.length > 0 && items.every(item => item.hasDiscount)) {
          setCouponError("Este cupón no se puede aplicar a productos que ya tienen descuento");
          setValidatingCoupon(false);
          return;
        }

        setAppliedCoupon({
          code: res.code!,
          discount_percentage: res.discount_percentage!,
          allow_stacking: !!res.allow_stacking
        });
        setCouponCodeInput("");
      } else {
        setCouponError(res.message || "Cupón inválido");
      }
    } catch (err) {
      setCouponError("Error al validar el cupón");
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Automatically remove non-stackable coupons if the cart changes and ends up containing only discounted products
  useEffect(() => {
    if (appliedCoupon && !appliedCoupon.allow_stacking) {
      const items = Object.values(cart);
      if (items.length > 0 && items.every(item => item.hasDiscount)) {
        setAppliedCoupon(null);
        setCouponError("Se eliminó el cupón porque no es acumulable con productos en promoción.");
      }
    }
  }, [cart, appliedCoupon]);

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Enterprise form fields
  const [entName, setEntName] = useState(initialName);
  const [entEmail, setEntEmail] = useState(initialEmail);
  const [entPhone, setEntPhone] = useState("");
  const [entCompany, setEntCompany] = useState("");
  const [entPosition, setEntPosition] = useState("");
  const [entEmployees, setEntEmployees] = useState("");
  const [entMessage, setEntMessage] = useState("");
  const [entAcceptsPrivacy, setEntAcceptsPrivacy] = useState(false);

  const convertAndFormat = (clpAmount: number) => {
    return convertPrice(clpAmount);
  };

  const getCourseDescription = (course: Course) => {
    const descObj = courseDescriptions.find(d => d.slug === course.slug);
    return descObj?.short_description || descObj?.description || course.shortDescription;
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/schedules").then(r => r.json()),
      fetch("/api/promotions").then(r => r.json()),
      fetch("/api/prices").then(r => r.json()),
      fetch("/api/courses/descriptions").then(r => r.json())
    ]).then(([schData, promoData, pricesData, descData]) => {
      if (Array.isArray(schData)) setSchedules(schData);
      if (Array.isArray(promoData)) setPromotions(promoData);
      if (Array.isArray(pricesData)) setPriceOverrides(pricesData);
      if (Array.isArray(descData)) setCourseDescriptions(descData);
    })
    .catch(console.error)
    .finally(() => setLoadingData(false));
  }, []);

  const getEffectiveBasePrice = (slug: string, levelName: string, codePrice: number) => {
    const override = priceOverrides.find((o: any) => o.item_type === 'course' && o.item_id === slug && o.level_name === levelName);
    return override ? override.price : codePrice;
  };

  const getDiscountedPrice = (slug: string, basePrice: number | undefined, levelName?: string) => {
    if (!basePrice) return { finalPrice: 0, originalPrice: 0, hasDiscount: false };
    const effectiveBase = levelName ? getEffectiveBasePrice(slug, levelName, basePrice) : basePrice;
    const applicablePromo = promotions.find(p => p.target_type === 'all' || p.target_type === 'courses' || (p.target_type === 'specific_course' && p.target_id === slug));
    
    if (applicablePromo) {
       if (applicablePromo.promo_price) {
         return { finalPrice: applicablePromo.promo_price, originalPrice: effectiveBase, hasDiscount: true };
       }
       const ratio = (100 - applicablePromo.discount_percentage) / 100;
       const finalPrice = Math.round(effectiveBase * ratio);
       return { finalPrice, originalPrice: effectiveBase, hasDiscount: true };
    }
    return { finalPrice: effectiveBase, originalPrice: effectiveBase, hasDiscount: false };
  };

  // Initialize selected levels and cart
  useEffect(() => {
    if (!loadingData) {
      const initialLevels: Record<string, string> = {};
      allCourses.forEach(c => {
        if (c.slug === initialSlug) {
           initialLevels[c.slug] = initialLevel || c.levels?.[0]?.name || "Básico";
        } else {
           initialLevels[c.slug] = c.levels?.[0]?.name || "Básico";
        }
      });
      setSelectedLevels(initialLevels);

      // Auto-add if came from a course detail
      if (initialSlug) {
        const course = allCourses.find(c => c.slug === initialSlug);
        const levelName = initialLevel || course?.levels?.[0]?.name || "Básico";
        const level = course?.levels?.find(l => l.name === levelName);
        if (course && level && level.price) {
          const pricing = getDiscountedPrice(course.slug, level.price, levelName);
          const isBundle = ["analisis-de-datos", "analitica-mineria", "analitica-financiera"].includes(course.slug);
          setCart({
             [`${course.slug}-${levelName}`]: {
                slug: course.slug,
                title: course.title,
                levelName: level.name,
                price: pricing.finalPrice,
                quantity: 1,
                originalPrice: isBundle ? 747000 : pricing.originalPrice,
                hasDiscount: isBundle ? true : pricing.hasDiscount
             }
          });
          setEnterpriseToggles(new Set([`${course.slug}-${levelName}`]));
        }
      } else if (initialServicio === "asesoria") {
        setCart({
           "asesoria-Hora": {
              slug: "asesoria",
              title: "Mentoría y Asesoría 1 a 1",
              levelName: "Hora",
              price: 60000,
              quantity: 1,
              originalPrice: 60000,
              hasDiscount: false
           }
        });
      }
    }
  }, [loadingData, initialSlug, initialLevel, initialServicio, promotions]);

  // Pre-select nearest starting dates once schedules are loaded
  useEffect(() => {
    if (schedules.length > 0) {
      const datesUpdate: Record<string, string> = { ...selectedDates };
      let cartUpdated = false;
      const updatedCart = { ...cart };

      allCourses.forEach(course => {
        course.levels?.forEach(lvl => {
          const key = `${course.slug}-${lvl.name}`;
          
          let courseSchedules: CourseSchedule[] = [];
          if (course.slug === "analisis-de-datos") {
             if (lvl.name.includes("Básico") || lvl.name.includes("Completo")) {
                 const adSchedules = schedules.filter(s => analisisDeDatosSlugs.includes(s.course_slug) && s.level_name.includes("Básico"));
                 courseSchedules = getAllActiveSchedules(adSchedules);
             }
          } else {
             courseSchedules = getAllActiveSchedules(
               schedules.filter(s => s.course_slug === course.slug && s.level_name === lvl.name)
             );
          }

          if (courseSchedules.length > 0) {
            const nearest = courseSchedules[0];
            if (!datesUpdate[key]) {
              datesUpdate[key] = nearest.start_date;
            }

            // If this item is in the cart but lacks selectedStartDate, populate it
            if (updatedCart[key] && !updatedCart[key].selectedStartDate) {
              updatedCart[key] = {
                ...updatedCart[key],
                selectedStartDate: nearest.start_date,
                selectedScheduleDays: nearest.schedule_days,
                selectedScheduleTime: nearest.schedule_time
              };
              cartUpdated = true;
            }
          }
        });
      });

      setSelectedDates(datesUpdate);
      if (cartUpdated) {
        setCart(updatedCart);
      }
    }
  }, [schedules, cart]);

  const changeLevel = (slug: string, newLevelName: string) => {
    setSelectedLevels(prev => ({ ...prev, [slug]: newLevelName }));
  };

  const updateCartQuantity = (
    slug: string,
    title: string,
    levelName: string,
    price: number,
    active: boolean,
    increment: number,
    selectedStartDate?: string,
    selectedScheduleDays?: string,
    selectedScheduleTime?: string
  ) => {
    if (!active) return; // Cannot buy inter/avanzado without dates

    setCart(prev => {
      const key = `${slug}-${levelName}`;
      const current = prev[key];
      const newQty = (current?.quantity || 0) + increment;

      if (newQty <= 0) {
        const next = { ...prev };
        delete next[key];
        return next;
      }

      const course = allCourses.find(c => c.slug === slug);
      const level = course?.levels?.find(l => l.name === levelName);
      const isBundle = ["analisis-de-datos", "analitica-mineria", "analitica-financiera"].includes(slug);
      let itemOriginalPrice = price;
      let itemHasDiscount = false;
      
      if (isBundle) {
        itemOriginalPrice = 747000;
        itemHasDiscount = true;
      } else if (course && level && level.price) {
        const pricing = getDiscountedPrice(slug, level.price, levelName);
        itemOriginalPrice = pricing.originalPrice;
        itemHasDiscount = pricing.hasDiscount;
      }

      return {
        ...prev,
        [key]: {
          slug,
          title,
          levelName,
          price,
          quantity: newQty,
          selectedStartDate: selectedStartDate || current?.selectedStartDate,
          selectedScheduleDays: selectedScheduleDays || current?.selectedScheduleDays,
          selectedScheduleTime: selectedScheduleTime || current?.selectedScheduleTime,
          originalPrice: itemOriginalPrice,
          hasDiscount: itemHasDiscount
        }
      };
    });
  };

  const handleDateChange = (slug: string, levelName: string, dateVal: string, courseSchedules: CourseSchedule[]) => {
    setSelectedDates(prev => ({ ...prev, [`${slug}-${levelName}`]: dateVal }));
    
    // Find matching schedule
    const chosenSchedule = courseSchedules.find(s => s.start_date === dateVal);
    if (!chosenSchedule) return;

    setCart(prev => {
      const key = `${slug}-${levelName}`;
      if (!prev[key]) return prev; // Not in cart, no need to update
      return {
        ...prev,
        [key]: {
          ...prev[key],
          selectedStartDate: chosenSchedule.start_date,
          selectedScheduleDays: chosenSchedule.schedule_days,
          selectedScheduleTime: chosenSchedule.schedule_time
        }
      };
    });
  };

  const toggleEnterpriseSelect = (slug: string, levelName: string) => {
    const key = `${slug}-${levelName}`;
    setEnterpriseToggles(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const handleNotifyMe = async (slug: string, levelName: string) => {
    const key = `${slug}-${levelName}`;
    if (notifySuccess.has(key)) return;
    setNotifyLoading(key);
    try {
      await fetch("/api/leads/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: initialName || "Visitante",
          email: initialEmail || "",
          courseSlug: slug,
          levelName,
        }),
      });
      setNotifySuccess(prev => new Set(prev).add(key));
    } catch (err) {
      console.error(err);
    } finally {
      setNotifyLoading(null);
    }
  };

  const cartItems = Object.values(cart);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const couponDiscountAmount = (() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.allow_stacking) {
      return Math.floor(totalPrice * (appliedCoupon.discount_percentage / 100));
    }
    // No stackable discount: only apply to items that DO NOT have promo discount
    return cartItems.reduce((acc, item) => {
      if (!item.hasDiscount) {
        return acc + Math.floor((item.price * item.quantity) * (appliedCoupon.discount_percentage / 100));
      }
      return acc;
    }, 0);
  })();
  const finalPriceWithCoupon = totalPrice - couponDiscountAmount;
  const hasExtraLicenses = cartItemCount > Object.keys(cart).length;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    trackCheckoutStart({
      courseSlugs: cartItems.map((item) => item.slug),
      value: finalPriceWithCoupon,
      location: "pago_page",
    });
    try {
      // In a real multi-item implementation, we modify backend to accept `items` array.
      // Below is the mapped array to pass to the updated Flow creation logic.
      const res = await fetch("/api/mp/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: appliedCoupon?.code || null,
          items: cartItems.map(item => ({
            courseSlug: item.slug,
            levelName: item.levelName,
            quantity: item.quantity,
            price: item.price,
            selectedStartDate: item.selectedStartDate || null
          }))
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error: " + (data.error || "No se pudo procesar el pago."));
      }
    } catch (err) {
      alert("Error al procesar el pago.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entName || !entEmail || !entCompany || !entPhone) return;
    setIsSubmittingEnterprise(true);
    try {
      await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: entName,
          email: entEmail,
          whatsapp: entPhone,
          company: entCompany,
          position: entPosition,
          employeeCount: entEmployees,
          message: entMessage,
          selectedCourses: Array.from(enterpriseToggles),
          leadType: "enterprise",
        }),
      });
      trackLeadSubmit("enterprise", "pago_page");
      setEnterpriseSuccess(true);
    } catch (err) {
      alert("Error al enviar la solicitud.");
    } finally {
      setIsSubmittingEnterprise(false);
    }
  };
  const sortedCourses = useMemo(() => {
    return [...allCourses].sort((a, b) => {
      // Priorizar el curso seleccionado en la URL
      if (initialSlug) {
        if (a.slug === initialSlug && b.slug !== initialSlug) return -1;
        if (b.slug === initialSlug && a.slug !== initialSlug) return 1;
      }

      const getHasBaseSchedule = (course: Course) => {
        if (analisisDeDatosSlugs.includes(course.slug) || course.slug === "analisis-de-datos") {
          const adSchedules = schedules.filter(s => analisisDeDatosSlugs.includes(s.course_slug) && s.level_name.includes("Básico"));
          return !!getNearestSchedule(adSchedules);
        }
        return !!schedules.find(s => s.course_slug === course.slug);
      };

      const aHas = getHasBaseSchedule(a);
      const bHas = getHasBaseSchedule(b);

      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    });
  }, [schedules, initialSlug]);

  const catalogSections = useMemo(() => {
    const pinned = initialSlug ? sortedCourses.find((c) => c.slug === initialSlug) : undefined;
    const source = pinned ? sortedCourses.filter((c) => c.slug !== initialSlug) : sortedCourses;
    const groups =
      catalogFilter === "todos"
        ? COURSE_NAV_GROUPS
        : COURSE_NAV_GROUPS.filter((g) => g.id === catalogFilter);
    const groupedSlugs = new Set<string>(COURSE_NAV_GROUPS.flatMap((g) => [...g.slugs]));
    const sections: { id: string; label: string; courses: Course[] }[] = groups
      .map((g) => ({
        id: g.id,
        label: g.label,
        courses: source.filter((c) => (g.slugs as readonly string[]).includes(c.slug)),
      }))
      .filter((s) => s.courses.length > 0);

    if (catalogFilter === "todos") {
      const rest = source.filter((c) => !groupedSlugs.has(c.slug));
      if (rest.length) sections.push({ id: "otros", label: "Otros", courses: rest });
    }

    const pinVisible =
      pinned &&
      (catalogFilter === "todos" ||
        (COURSE_NAV_GROUPS.find((g) => g.id === catalogFilter)?.slugs as readonly string[] | undefined)?.includes(
          pinned.slug
        ));
    if (pinVisible && pinned) {
      return [{ id: "seleccion", label: "Tu selección", courses: [pinned] }, ...sections];
    }
    return sections;
  }, [sortedCourses, catalogFilter, initialSlug]);

  return (
    <>
    <section className="relative overflow-x-hidden bg-canvas pb-32 pt-10 lg:pt-14">
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-8 max-w-[40rem]">
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Inscripción
            </h1>
            <p className="mt-4 text-base leading-relaxed text-mute">
              Elige programas y niveles. Puedes añadir cupos extra para tu equipo.
            </p>
          </div>
        </FadeIn>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("individual")}
            className={`inline-flex items-center gap-2 ${chipClass(mode === "individual")}`}
          >
            <User className="h-4 w-4" /> Individual
          </button>
          <button
            type="button"
            onClick={() => setMode("enterprise")}
            className={`inline-flex items-center gap-2 ${chipClass(mode === "enterprise")}`}
          >
            <Building2 className="h-4 w-4" /> Empresa
          </button>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-8 lg:col-span-7">
            <div className="flex flex-wrap gap-2">
              {CATALOG_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={catalogFilter === f.id}
                  onClick={() => setCatalogFilter(f.id)}
                  className={chipClass(catalogFilter === f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {catalogSections.map((section) => (
            <div key={section.id} className="space-y-4">
            {catalogSections.length > 1 ? (
              <p className="text-sm font-semibold text-mute">{section.label}</p>
            ) : null}
            {section.courses.map((course) => {
               const activeLevel = selectedLevels[course.slug];
               const currentLevelData = course.levels?.find(l => l.name === activeLevel);
               
               // Logic to determine bundle pricing visuals
               const isBundle = ["analisis-de-datos", "analitica-mineria", "analitica-financiera"].includes(course.slug);
               
               // Logic to check active schedule
               let courseSchedules: CourseSchedule[] = [];
               
               // Specialty courses can always be purchased
               const alwaysAvailable = ["analitica-mineria", "analitica-financiera"].includes(course.slug);
               
               if (course.slug === "analisis-de-datos") {
                  if (activeLevel?.includes("Básico") || activeLevel?.includes("Completo")) {
                      const adSchedules = schedules.filter(s => analisisDeDatosSlugs.includes(s.course_slug) && s.level_name.includes("Básico"));
                      courseSchedules = getAllActiveSchedules(adSchedules);
                  }
               } else if (!alwaysAvailable) {
                  courseSchedules = getAllActiveSchedules(
                    schedules.filter(s => s.course_slug === course.slug && s.level_name === activeLevel)
                  );
               }

               const hasScheduleActive = courseSchedules.length > 0 || alwaysAvailable;
               // Overwrite hasScheduleActive if fetching schedules is done but it evaluates to false, we assume you cannot purchase and must notify.
               const canBuy = mode === 'individual' && hasScheduleActive && currentLevelData?.price;

               const cartKey = `${course.slug}-${activeLevel}`;
               const itemQty = cart[cartKey]?.quantity || 0;
               const entSelected = enterpriseToggles.has(cartKey);

               return (
                    <article
                      key={course.slug}
                      className={`overflow-hidden rounded-[22px] border bg-paper ${
                        itemQty > 0 || entSelected
                          ? "border-[rgb(23_23_22_/_0.28)]"
                          : "border-line"
                      }`}
                    >
                    <div className="flex flex-col md:flex-row">
                       <div className="relative aspect-[16/10] w-full shrink-0 bg-wash md:aspect-auto md:min-h-[11.5rem] md:w-[11.5rem] md:self-stretch lg:w-52">
                          <CourseImage src={course.imageUrl} alt={course.title} fill sizes="(max-width: 640px) 100vw, 208px" className="object-cover" />
                          {isBundle && mode === "individual" && (
                             <span className="absolute left-3 top-3 rounded-md bg-ink px-2 py-1 text-[11px] font-semibold text-paper">
                               3×2
                             </span>
                          )}
                       </div>

                       <div className="flex min-w-0 flex-1 flex-col gap-3 p-5 sm:p-6">
                          <div>
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h3 className="text-lg font-bold tracking-tight text-ink">{course.title}</h3>
                              {itemQty > 0 ? (
                                <span className="text-xs font-semibold text-ink">En el carrito · {itemQty}</span>
                              ) : entSelected ? (
                                <span className="text-xs font-semibold text-ink">En la cotización</span>
                              ) : null}
                            </div>
                            <p className="mt-1 text-xs font-semibold text-mute">
                              {course.durationHours} h · En vivo
                              {course.techStack.length ? ` · ${course.techStack.join(" · ")}` : ""}
                            </p>
                            {isBundle && (
                               <p className="mt-1 text-xs font-semibold text-ink">Incluye Power BI, Python y SQL Server</p>
                             )}
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mute">{getCourseDescription(course)}</p>
                          </div>

                          {course.levels && course.levels.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                               {course.levels.map(lvl => (
                                 <button 
                                   key={lvl.name} 
                                   type="button"
                                   onClick={() => changeLevel(course.slug, lvl.name)}
                                   className={`rounded-md border-2 px-3 py-1.5 text-xs font-semibold transition-colors ${
                                     activeLevel === lvl.name
                                       ? "border-[rgb(23_23_22_/_0.28)] bg-canvas text-ink"
                                       : "border-transparent bg-wash text-mute hover:text-ink"
                                   }`}
                                 >
                                    {lvl.name}
                                 </button>
                               ))}
                            </div>
                          )}

                          <div className="flex w-full max-w-md flex-col gap-1.5 rounded-md border border-line bg-wash p-2.5 text-xs text-mute">
                               {hasScheduleActive && courseSchedules.length > 0 ? (
                                  <>
                                    {courseSchedules.length > 1 ? (
                                      <div className="relative w-full">
                                        <label className="mb-1 block text-xs font-semibold text-mute">
                                          Fecha de inicio
                                        </label>
                                        
                                        {(() => {
                                          const dropdownKey = `${course.slug}-${activeLevel}`;
                                          const isDropdownOpen = openDropdownKey === dropdownKey;
                                          const selectedDateVal = selectedDates[dropdownKey] || courseSchedules[0]?.start_date;
                                          
                                          const selectedSchedule = courseSchedules.find(s => s.start_date === selectedDateVal) || courseSchedules[0];
                                          const selectedConverted = convertSchedule(
                                            selectedSchedule.start_date,
                                            selectedSchedule.schedule_time,
                                            selectedSchedule.schedule_days,
                                            scheduleCountry.timeZone
                                          );

                                          return (
                                            <>
                                              {/* Invisible overlay backdrop to close dropdown on click outside */}
                                              {isDropdownOpen && (
                                                <div 
                                                  className="fixed inset-0 z-40 cursor-default" 
                                                  onClick={() => setOpenDropdownKey(null)} 
                                                />
                                              )}
                                              
                                              <div className="relative z-50">
                                                <button
                                                  type="button"
                                                  onClick={() => setOpenDropdownKey(isDropdownOpen ? null : dropdownKey)}
                                                  className="flex w-full cursor-pointer items-center justify-between rounded-md border border-line bg-paper px-3 py-2.5 text-left text-xs font-semibold text-ink outline-none transition-colors hover:border-[rgb(23_23_22_/_0.28)]"
                                                >
                                                  <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 sm:flex-nowrap">
                                                    <span className="flex shrink-0 items-center gap-2 font-semibold text-ink">
                                                      <Calendar className="h-3.5 w-3.5 shrink-0 text-ink" />
                                                      <span className="capitalize">{selectedConverted.dateFormatted}</span>
                                                    </span>
                                                    <span className="hidden shrink-0 font-semibold text-faint sm:inline">·</span>
                                                    <span className="truncate text-[11px] font-semibold text-mute">{selectedConverted.days} {selectedConverted.time}</span>
                                                  </span>
                                                  <ChevronDown className={`h-4 w-4 shrink-0 text-faint transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-ink" : ""}`} />
                                                </button>

                                                <AnimatePresence>
                                                  {isDropdownOpen && (
                                                    <motion.div
                                                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                                      transition={{ duration: 0.12, ease: "easeOut" }}
                                                      className="absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-md border border-line bg-paper py-1.5 divide-y divide-line"
                                                    >
                                                      {courseSchedules.map((sch) => {
                                                        const isSelected = sch.start_date === selectedDateVal;
                                                        const converted = convertSchedule(
                                                          sch.start_date,
                                                          sch.schedule_time,
                                                          sch.schedule_days,
                                                          scheduleCountry.timeZone
                                                        );

                                                        return (
                                                          <button
                                                            key={sch.start_date}
                                                            type="button"
                                                            onClick={() => {
                                                              handleDateChange(course.slug, activeLevel, sch.start_date, courseSchedules);
                                                              setOpenDropdownKey(null);
                                                            }}
                                                            className={`flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-wash ${isSelected ? "bg-wash font-semibold" : ""}`}
                                                          >
                                                            <div className="truncate">
                                                              <span className={`block text-xs capitalize ${isSelected ? "font-semibold text-ink" : "font-semibold text-ink"}`}>
                                                                {converted.dateFormatted}
                                                              </span>
                                                              <span className="mt-0.5 block truncate text-[11px] font-semibold text-mute">
                                                                {converted.days} · {converted.time}
                                                              </span>
                                                            </div>
                                                            {isSelected && (
                                                              <Check className="h-3.5 w-3.5 shrink-0 text-ink" />
                                                            )}
                                                          </button>
                                                        );
                                                      })}
                                                    </motion.div>
                                                  )}
                                                </AnimatePresence>
                                              </div>
                                            </>
                                          );
                                        })()}
                                      </div>
                                    ) : (
                                      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-0.5 font-semibold text-ink sm:flex-nowrap">
                                        <span className="flex shrink-0 items-center gap-1.5">
                                          <Calendar className="h-3.5 w-3.5" />
                                          <span className="capitalize">{(() => {
                                            const converted = convertSchedule(
                                              courseSchedules[0].start_date,
                                              courseSchedules[0].schedule_time,
                                              courseSchedules[0].schedule_days,
                                              scheduleCountry.timeZone
                                            );
                                            return converted.dateFormatted;
                                          })()}</span>
                                        </span>
                                        <span className="hidden shrink-0 font-semibold text-faint sm:inline">·</span>
                                        <span className="truncate text-[11px] font-semibold text-mute">{(() => {
                                          const converted = convertSchedule(
                                            courseSchedules[0].start_date,
                                            courseSchedules[0].schedule_time,
                                            courseSchedules[0].schedule_days,
                                            scheduleCountry.timeZone
                                          );
                                          return `${converted.days} ${converted.time}`;
                                        })()}</span>
                                      </span>
                                    )}
                                  </>
                               ) : (
                                  <span className="flex items-center gap-1.5 font-semibold text-ink">
                                    <Bell className="h-3.5 w-3.5" /> Próxima fecha por confirmar
                                  </span>
                               )}
                               {currentLevelData?.durationHours && (
                                 <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-mute">
                                    <Globe className="h-3.5 w-3.5 shrink-0 text-faint" />
                                    <span>{currentLevelData.durationHours} h en vivo por Zoom</span>
                                 </span>
                               )}
                          </div>
                       </div>

                       <div className="flex w-full shrink-0 flex-col items-start gap-3 border-t border-line p-5 md:w-44 md:items-end md:border-l md:border-t-0 md:p-6">
                           {mode === "individual" && currentLevelData?.price ? (
                              <div className="flex flex-col items-start sm:items-end">
                                 {(() => {
                                    const pricing = getDiscountedPrice(course.slug, currentLevelData.price, activeLevel);
                                    if (isBundle) {
                                      return (
                                        <>
                                           <span className="text-xs font-semibold text-faint line-through">{convertAndFormat(747000)}</span>
                                           <div className="flex flex-col items-start sm:items-end">
                                              <span className="text-xl font-bold tabular-nums text-ink">{convertAndFormat(pricing.finalPrice)}</span>
                                              {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                                                <span className="text-xs font-semibold text-faint">≈ ${Math.round(pricing.finalPrice / 900)} USD</span>
                                              )}
                                           </div>
                                        </>
                                      );
                                    } else if (pricing.hasDiscount) {
                                      return (
                                        <>
                                           <span className="mb-1 text-xs font-semibold text-ink">Promoción</span>
                                           <span className="text-xs font-semibold text-faint line-through">{convertAndFormat(pricing.originalPrice)}</span>
                                           <div className="flex flex-col items-start sm:items-end">
                                              <span className="text-xl font-bold tabular-nums text-ink">{convertAndFormat(pricing.finalPrice)}</span>
                                              {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                                                <span className="text-xs font-semibold text-faint">≈ ${Math.round(pricing.finalPrice / 900)} USD</span>
                                              )}
                                           </div>
                                        </>
                                      );
                                    } else {
                                      return (
                                        <div className="flex flex-col items-start sm:items-end">
                                           <span className="text-xl font-bold tabular-nums text-ink">{convertAndFormat(pricing.finalPrice)}</span>
                                           {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                                             <span className="text-xs font-semibold text-faint">≈ ${Math.round(pricing.finalPrice / 900)} USD</span>
                                           )}
                                        </div>
                                      );
                                    }
                                 })()}
                              </div>
                           ) : mode === "enterprise" ? null : (
                               <div className="flex flex-col items-start sm:items-end">
                                   <span className="text-xs text-faint">Precio no disponible</span>
                               </div>
                           )}

                           {mode === "individual" ? (
                              canBuy ? (
                                <div className="mt-1 flex h-10 items-center overflow-hidden rounded-md border border-line bg-wash">
                                   <button
                                     type="button"
                                     onClick={() => updateCartQuantity(course.slug, course.title, activeLevel, getDiscountedPrice(course.slug, currentLevelData!.price, activeLevel).finalPrice, true, -1)}
                                     disabled={itemQty === 0}
                                     className="flex h-full w-10 items-center justify-center text-mute transition-colors hover:bg-paper hover:text-ink disabled:opacity-30"
                                   >
                                      <Minus className="h-4 w-4" />
                                   </button>
                                   <div className="flex h-full w-10 items-center justify-center border-x border-line bg-paper text-sm font-semibold tabular-nums text-ink">
                                      {itemQty}
                                   </div>
                                   <button
                                      type="button"
                                      onClick={() => {
                                        const chosenDateStr = selectedDates[`${course.slug}-${activeLevel}`] || courseSchedules[0]?.start_date;
                                        const chosenSchedule = courseSchedules.find(s => s.start_date === chosenDateStr) || courseSchedules[0];
                                        updateCartQuantity(
                                          course.slug,
                                          course.title,
                                          activeLevel,
                                          getDiscountedPrice(course.slug, currentLevelData!.price, activeLevel).finalPrice,
                                          true,
                                          1,
                                          chosenSchedule?.start_date,
                                          chosenSchedule?.schedule_days,
                                          chosenSchedule?.schedule_time
                                        );
                                      }}
                                      className="flex h-full w-10 items-center justify-center text-ink transition-colors hover:bg-paper"
                                    >
                                       <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleNotifyMe(course.slug, activeLevel)}
                                  disabled={notifySuccess.has(cartKey) || notifyLoading === cartKey}
                                  className={`mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 text-xs font-semibold transition-colors sm:w-auto ${notifySuccess.has(cartKey) ? "bg-wash text-ink" : "border border-line bg-wash text-ink hover:bg-paper"}`}
                                >
                                  {notifyLoading === cartKey ? <Loader2 className="h-4 w-4 animate-spin" /> : notifySuccess.has(cartKey) ? <><CheckCircle2 className="h-4 w-4" /> Registrado</> : <><Bell className="h-4 w-4" /> Avísame</>}
                                </button>
                              )
                           ) : (
                              <button
                                type="button"
                                onClick={() => toggleEnterpriseSelect(course.slug, activeLevel)}
                                className={`mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 text-xs font-semibold transition-colors sm:w-auto ${
                                  entSelected
                                    ? "border-2 border-[rgb(23_23_22_/_0.28)] bg-canvas text-ink"
                                    : "border-2 border-transparent bg-wash text-mute hover:text-ink"
                                }`}
                              >
                                {entSelected ? <><Check className="h-4 w-4" /> Incluido</> : "Añadir"}
                              </button>
                           )}

                       </div>
                    </div>
                    </article>
               );
            })}
            </div>
            ))}
          </div>

          <div className="lg:col-span-5">
             <div className="sticky top-28 w-full">
                <AnimatePresence mode="wait">
                  {mode === "individual" ? (
                    <motion.div
                      key="individual"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="overflow-hidden rounded-[22px] border border-line bg-paper"
                    >
                      <div className="p-6">
                        <p className="mb-5 text-sm font-semibold text-ink">Tu inscripción</p>
                        {cartItems.length === 0 ? (
                           <div className="py-8">
                             <ShoppingCart className="mb-3 h-8 w-8 text-faint" />
                             <p className="text-sm text-mute">Aún no hay cursos.</p>
                             <p className="mt-1 text-xs text-faint">Suma un programa con +.</p>
                           </div>
                        ) : (
                           <>

                              <div className="custom-scrollbar mb-6 max-h-[300px] space-y-4 overflow-y-auto pr-1">
                                 {cartItems.map(item => (
                                    <div key={`${item.slug}-${item.levelName}`} className="flex items-start justify-between gap-4">
                                       <div className="min-w-0 flex-1">
                                          <span className="line-clamp-2 text-sm font-semibold leading-tight text-ink">{item.quantity}× {item.title}</span>
                                          <span className="mt-0.5 block text-xs text-mute">{item.levelName}</span>
                                          {item.slug !== "asesoria" && item.selectedStartDate && (() => {
                                            const converted = convertSchedule(
                                              item.selectedStartDate,
                                              item.selectedScheduleTime || "19:30 a 21:30",
                                              item.selectedScheduleDays || "Martes y Jueves",
                                              scheduleCountry.timeZone
                                            );
                                            return (
                                              <div className="mt-2.5 space-y-1.5 rounded-md border border-line bg-wash p-2.5">
                                                <div className="flex items-center gap-2">
                                                  <Calendar className="h-3.5 w-3.5 shrink-0 text-mute" />
                                                  <span className="text-xs font-semibold capitalize leading-tight text-ink">{converted.dateFormatted}</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mute" />
                                                  <div className="flex flex-col">
                                                    <span className="text-xs font-semibold leading-tight text-ink">{converted.days}</span>
                                                    <span className="mt-0.5 text-[11px] font-semibold text-mute">{converted.time}</span>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })()}
                                       </div>
                                       <div className="flex shrink-0 flex-col items-end">
                                          {item.hasDiscount && item.originalPrice && item.originalPrice > item.price && (
                                            <div className="mb-1 flex items-center gap-1.5">
                                              <span className="text-[11px] font-semibold text-faint line-through">
                                                {convertAndFormat(item.originalPrice * item.quantity)}
                                              </span>
                                              <span className="rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-paper">
                                                −{Math.round((1 - item.price / item.originalPrice) * 100)}%
                                              </span>
                                            </div>
                                          )}
                                          <span className="text-sm font-semibold tabular-nums text-ink">{convertAndFormat(item.price * item.quantity)}</span>
                                          {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                                            <span className="mt-0.5 text-[10px] font-semibold text-faint">
                                              ≈ ${Math.round((item.price * item.quantity) / 900)} USD
                                            </span>
                                          )}
                                          {item.slug === "asesoria" ? (
                                            <div className="mt-2 flex items-center gap-2 rounded-md border border-line bg-wash">
                                              <button type="button" onClick={() => updateCartQuantity(item.slug, item.title, item.levelName, item.price, true, -1)} className="cursor-pointer border-none bg-transparent p-1 text-mute transition-colors hover:text-ink">
                                                <Minus className="h-3 w-3" />
                                              </button>
                                              <span className="min-w-[12px] text-center text-[10px] font-semibold text-ink">{item.quantity}</span>
                                              <button type="button" onClick={() => updateCartQuantity(item.slug, item.title, item.levelName, item.price, true, 1)} className="cursor-pointer border-none bg-transparent p-1 text-mute transition-colors hover:text-ink">
                                                <Plus className="h-3 w-3" />
                                              </button>
                                            </div>
                                          ) : (
                                            <button type="button" onClick={() => updateCartQuantity(item.slug, item.title, item.levelName, item.price, true, -item.quantity)} className="mt-1.5 cursor-pointer border-none bg-transparent text-xs font-semibold text-faint transition-colors hover:text-ink">
                                              Quitar
                                            </button>
                                          )}
                                       </div>
                                    </div>
                                 ))}
                              </div>

                              {hasExtraLicenses && (
                                 <div className="mb-6 flex gap-3 rounded-md border border-line bg-wash p-3">
                                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                                    <div>
                                      <p className="text-xs font-semibold text-ink">Cupos extra</p>
                                      <p className="mt-1 text-[11px] leading-snug text-mute">Recibirás por correo las instrucciones para asignarlos después del pago.</p>
                                    </div>
                                 </div>
                              )}

                              <div className="mb-4 border-t border-line pt-4">
                                <button
                                  type="button"
                                  onClick={() => setShowCouponInput(!showCouponInput)}
                                  className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent py-1 text-xs font-semibold text-mute transition-colors hover:text-ink"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <Tag className="h-3.5 w-3.5" /> ¿Tienes un cupón?
                                  </span>
                                  {showCouponInput ? <ChevronUp className="h-3.5 w-3.5 text-faint" /> : <ChevronDown className="h-3.5 w-3.5 text-faint" />}
                                </button>
                                
                                <AnimatePresence initial={false}>
                                  {(showCouponInput || appliedCoupon) && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                      animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                      className="overflow-hidden"
                                    >
                                      {appliedCoupon ? (
                                        <div className="flex items-center justify-between rounded-md border border-line bg-wash px-4 py-3">
                                          <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4 shrink-0 text-ink" />
                                            <div>
                                              <span className="font-mono text-xs font-semibold tracking-wide text-ink">{appliedCoupon.code}</span>
                                              <span className="ml-2 text-[11px] font-semibold text-mute">−{appliedCoupon.discount_percentage}%</span>
                                            </div>
                                          </div>
                                          <button type="button" onClick={handleRemoveCoupon} className="flex cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-1 text-mute transition-colors hover:text-ink">
                                            <X className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                      ) : (
                                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                          <div className="relative flex-1">
                                            <input
                                              type="text"
                                              placeholder="Código"
                                              value={couponCodeInput}
                                              onChange={e => {
                                                setCouponCodeInput(e.target.value);
                                                if (couponError) setCouponError(null);
                                              }}
                                              className={`${fieldClass} font-mono uppercase tracking-wider placeholder:font-sans placeholder:normal-case placeholder:tracking-normal`}
                                            />
                                          </div>
                                          <button
                                            type="submit"
                                            disabled={validatingCoupon || !couponCodeInput.trim()}
                                            className="flex cursor-pointer items-center gap-1.5 rounded-md border-none bg-ink px-4 py-2.5 text-xs font-semibold text-paper transition-colors hover:opacity-90 disabled:opacity-50"
                                          >
                                            {validatingCoupon ? <Loader2 className="h-3 w-3 animate-spin" /> : "Aplicar"}
                                          </button>
                                        </form>
                                      )}
                                      
                                      {couponError && (
                                        <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 px-1 text-[11px] font-semibold text-danger">
                                          {couponError}
                                        </motion.p>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {appliedCoupon && (
                                <div className="mb-3 flex items-center justify-between text-xs font-semibold">
                                  <span className="text-faint">Subtotal</span>
                                  <span className="tabular-nums text-ink">{convertAndFormat(totalPrice)}</span>
                                </div>
                              )}
                              
                              {appliedCoupon && (
                                <div className="mb-4 flex items-center justify-between rounded-md border border-line bg-wash p-2.5 text-xs font-semibold text-ink">
                                  <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5"/> Descuento ({appliedCoupon.code})</span>
                                  <span className="tabular-nums">−{convertAndFormat(couponDiscountAmount)}</span>
                                </div>
                              )}

                              <div className="mb-6 flex items-end justify-between border-t border-line pt-4">
                                 <span className="font-semibold text-mute">Total</span>
                                 <div className="text-right">
                                   <span className="block text-2xl font-bold tabular-nums text-ink">
                                     {convertAndFormat(appliedCoupon ? finalPriceWithCoupon : totalPrice)}
                                   </span>
                                   {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                                     <span className="text-xs font-semibold text-faint">
                                       ≈ ${Math.round((appliedCoupon ? finalPriceWithCoupon : totalPrice) / 900)} USD
                                     </span>
                                   )}
                                 </div>
                              </div>

                              {country.currency.code !== "CLP" && (
                                <div className="mb-6 rounded-md border border-line bg-wash p-4 text-left">
                                  <div className="flex items-start gap-2.5">
                                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-mute" />
                                    <div>
                                      <p className="mb-1 text-xs font-semibold text-ink">
                                        Conversión
                                      </p>
                                      <p className="text-xs leading-snug text-mute">
                                        Se cobra el equivalente de <span className="font-semibold text-ink">{convertAndFormat(appliedCoupon ? finalPriceWithCoupon : totalPrice)}</span>.
                                      </p>
                                      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-2 text-[11px] font-semibold text-faint">
                                        <span>Ref. USD: $1 USD = $900 CLP</span>
                                        {country.currency.code !== "USD" && (
                                          <span>$1 USD ≈ {(country.currency.rate * 900).toFixed(2)} {country.currency.code}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <motion.button
                                type="button"
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-ink py-3.5 text-sm font-semibold text-paper transition-opacity disabled:opacity-60"
                                whileTap={{ scale: 0.98 }}
                              >
                                {isCheckingOut ? (
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                  <><ShoppingCart className="h-5 w-5" /> Pagar</>
                                )}
                              </motion.button>
                              
                              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium text-faint">
                                <BadgeCheck className="h-3.5 w-3.5 text-ink" />
                                <span>Pago cifrado vía Flow</span>
                              </div>
                            </>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    // Enterprise Right Widget
                    <motion.div
                      key="enterprise"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="overflow-hidden rounded-[22px] border border-line bg-paper"
                    >
                      <div className="border-b border-line px-6 py-5">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                          <Building2 className="h-5 w-5" /> Cotización empresa
                        </h3>
                      </div>
                      <div className="p-6">
                        {enterpriseSuccess ? (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
                            <CheckCircle2 className="mb-4 h-10 w-10 text-ink" />
                            <h3 className="mb-2 text-lg font-bold text-ink">Solicitud enviada</h3>
                            <p className="text-sm text-mute">Un asesor te contactará en breve.</p>
                          </motion.div>
                        ) : (
                          <form onSubmit={handleEnterpriseSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-mute">Nombre</label>
                              <input type="text" required value={entName} onChange={e => setEntName(e.target.value)}
                                className={fieldClass} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-mute">Email</label>
                              <input type="email" required value={entEmail} onChange={e => setEntEmail(e.target.value)}
                                className={fieldClass} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-mute">WhatsApp</label>
                              <input type="tel" required value={entPhone} onChange={e => setEntPhone(e.target.value)} placeholder="+56 9…"
                                className={fieldClass} />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-mute">Empresa</label>
                              <input type="text" required value={entCompany} onChange={e => setEntCompany(e.target.value)}
                                className={fieldClass} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-mute">Cargo</label>
                                <input type="text" value={entPosition} onChange={e => setEntPosition(e.target.value)}
                                  className={fieldClass} />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-mute">Personas</label>
                                <input type="number" min="1" value={entEmployees} onChange={e => setEntEmployees(e.target.value)}
                                  className={fieldClass} />
                              </div>
                            </div>
                            {enterpriseToggles.size > 0 && (
                              <div className="rounded-md border border-line bg-wash p-3">
                                <p className="mb-2 text-xs font-semibold text-mute">Cursos en la cotización</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {Array.from(enterpriseToggles).map(toggle => {
                                    const split = toggle.split("-");
                                    const level = split.pop();
                                    const slugPart = split.join("-");
                                    const objName = allCourses.find(c => c.slug === slugPart)?.title;
                                    return <span key={toggle} className="rounded-md border border-line bg-paper px-2 py-1 text-[11px] font-semibold text-ink">{objName} · {level}</span>
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-mute">Mensaje</label>
                              <textarea rows={2} value={entMessage} onChange={e => setEntMessage(e.target.value)}
                                className={`${fieldClass} resize-none`} />
                            </div>

                            <div className="mt-1 flex items-start gap-3">
                              <input
                                type="checkbox"
                                id="privacy-enterprise"
                                checked={entAcceptsPrivacy}
                                onChange={(e) => setEntAcceptsPrivacy(e.target.checked)}
                                required
                                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-line accent-ink"
                              />
                              <label htmlFor="privacy-enterprise" className="cursor-pointer text-[11px] leading-relaxed text-mute">
                                Acepto la{" "}
                                <Link href="/privacidad" className="font-semibold text-ink no-underline hover:underline" target="_blank">Política de Privacidad</Link>{" "}
                                y el uso de mis datos para esta cotización.
                              </label>
                            </div>

                            <motion.button
                              type="submit"
                              disabled={isSubmittingEnterprise || enterpriseToggles.size === 0}
                              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-none bg-ink py-3.5 text-sm font-semibold text-paper transition-opacity disabled:opacity-60"
                              whileTap={{ scale: 0.98 }}
                            >
                              {isSubmittingEnterprise ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <><Building2 className="h-4 w-4" /> Enviar solicitud</>
                              )}
                            </motion.button>
                            
                            <a href="https://wa.me/56935409699" target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-line py-3 text-sm font-semibold text-ink no-underline transition-colors hover:bg-wash">
                               WhatsApp
                            </a>
                            {enterpriseToggles.size === 0 && <p className="text-center text-[11px] font-semibold text-mute">Elige al menos un curso</p>}
                          </form>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </div>

      </div>

    </section>

    {/* Mobile Sticky Checkout Bar / Bottom Sheet — OUTSIDE section to avoid overflow/transform issues */}
    <AnimatePresence>
      {mode === "individual" && cartItems.length > 0 && (
        <>
          {/* Overlay background when open */}
          {isMobileCartOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileCartOpen(false)}
              className="fixed inset-0 bg-ink/40 lg:hidden"
              style={{ zIndex: 9990 }}
            />
          )}
          
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] flex max-w-[100vw] flex-col overflow-hidden rounded-t-[22px] border-t border-line bg-paper lg:hidden"
          >
            <div className="flex justify-center pb-1 pt-2">
              <div className="h-1 w-9 rounded-full bg-wash" />
            </div>

            {/* Expandable Cart Details */}
            <AnimatePresence>
              {isMobileCartOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden bg-wash"
                >
                  <div className="max-h-[50vh] overflow-y-auto p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="m-0 flex items-center gap-2 text-[15px] font-bold text-ink">
                        <ShoppingCart className="h-4 w-4" /> Tu inscripción
                      </h4>
                      <button type="button" onClick={() => setIsMobileCartOpen(false)} className="flex cursor-pointer items-center rounded-md border-none bg-paper p-1.5 text-mute">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-2.5">
                      {cartItems.map(item => (
                        <div key={`mob-${item.slug}-${item.levelName}`} className="flex items-start justify-between gap-3 rounded-md border border-line bg-paper p-3.5">
                          <div className="min-w-0 flex-1">
                            <span className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{item.quantity}× {item.title}</span>
                            <span className="mt-1 block text-[11px] font-medium text-mute">{item.levelName}</span>
                          </div>
                          <div className="flex shrink-0 flex-col items-end">
                            {item.hasDiscount && item.originalPrice && item.originalPrice > item.price && (
                              <div className="mb-0.5 flex items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-faint line-through">
                                  {convertAndFormat(item.originalPrice * item.quantity)}
                                </span>
                                <span className="rounded-md bg-ink px-1 py-px text-[10px] font-semibold text-paper">
                                  −{Math.round((1 - item.price / item.originalPrice) * 100)}%
                                </span>
                              </div>
                            )}
                            <span className="text-[15px] font-bold tabular-nums text-ink">{convertAndFormat(item.price * item.quantity)}</span>
                            {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                              <span className="mt-0.5 text-[10px] font-semibold text-faint">
                                ≈ ${Math.round((item.price * item.quantity) / 900)} USD
                              </span>
                            )}
                            <button type="button" onClick={() => updateCartQuantity(item.slug, item.title, item.levelName, item.price, true, -item.quantity)} className="mt-1.5 cursor-pointer rounded-md border-none bg-wash px-2 py-0.5 text-[11px] font-semibold text-ink">Quitar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sticky Bar (Always visible) */}
            <div
              onClick={() => setIsMobileCartOpen(!isMobileCartOpen)}
              className="flex cursor-pointer items-center justify-between gap-3 border-t border-line bg-paper px-5 py-3.5"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 14px)" }}
            >
              <div className="flex select-none items-center gap-3">
                <div className="relative shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-ink text-paper">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-md border-2 border-paper bg-ink text-[10px] font-bold leading-none text-paper">
                    {cartItemCount}
                  </span>
                </div>
                <div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-faint">
                    Ver detalle {isMobileCartOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
                  </span>
                  <span className="mt-1 block text-xl font-bold leading-none tabular-nums text-ink">
                    {convertAndFormat(appliedCoupon ? finalPriceWithCoupon : totalPrice)} {country.currency.code !== "USD" && country.currency.code !== "CLP" && <span className="text-[11px] font-semibold text-mute">≈ ${Math.round((appliedCoupon ? finalPriceWithCoupon : totalPrice) / 900)} USD</span>}
                  </span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleCheckout(); }}
                disabled={isCheckingOut}
                className="flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border-none bg-ink px-5 py-3 text-[13px] font-semibold text-paper disabled:opacity-60"
              >
                {isCheckingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pagar"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
