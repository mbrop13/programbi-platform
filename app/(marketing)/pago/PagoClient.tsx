"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Clock, Calendar, Building2, User, Users,
  CheckCircle2, Bell, Loader2, ShoppingCart, Check, Plus, Minus,
  X, BadgeCheck, ChevronUp, ChevronDown, FileText, ExternalLink,
  Info, Globe, Tag
} from "lucide-react";
import { courses as allCourses, Course } from "@/lib/data/courses";
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

  return (
    <>
    <section className="relative -mt-20 lg:-mt-24 pt-28 lg:pt-36 pb-32 min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 60%)" }}>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 relative z-10">
        <div className="pt-4" />

        <FadeIn>
          <div className="text-center mb-10">
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-[#0F172A] mb-4 tracking-tight">
              Selecciona tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600">Cursos</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-[600px] mx-auto">
              Elige los programas y niveles que deseas cursar. También puedes añadir cupos extra para tu equipo.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
           <div className="flex justify-center mb-10">
             <div className="bg-white border border-gray-200 p-1.5 rounded-full inline-flex items-center shadow-sm">
               <button onClick={() => setMode("individual")}
                 className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${mode === "individual" ? "bg-[#0F172A] text-white shadow-md" : "text-gray-500 hover:text-gray-800"}`}>
                 <User className="w-4 h-4" /> Compra Individual
               </button>
               <button onClick={() => setMode("enterprise")}
                 className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${mode === "enterprise" ? "bg-[#0F172A] text-white shadow-md" : "text-gray-500 hover:text-gray-800"}`}>
                 <Building2 className="w-4 h-4" /> Cotización Empresa
               </button>
             </div>
           </div>
        </FadeIn>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Course List */}
          <div className="lg:col-span-7 space-y-6">
            {sortedCourses.map((course) => {
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
                 <FadeIn key={course.slug} delay={0.2}>
                    <div className={`bg-white rounded-3xl border ${itemQty > 0 || entSelected ? 'border-[#1890FF] ring-1 ring-[#1890FF]/30' : 'border-gray-200'} p-4 lg:p-6 transition-all hover:shadow-lg flex flex-col sm:flex-row gap-6 items-start sm:items-center`}>
                       
                       {/* Left Image */}
                       <div className="w-full sm:w-56 h-48 sm:h-40 shrink-0 relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                          <Image src={course.imageUrl} alt={course.title} fill sizes="(max-width: 640px) 100vw, 224px" className="object-cover" />
                          {isBundle && mode === "individual" && (
                             <div className="absolute top-2 left-2 bg-[#1890FF] text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-md">
                               PROMOCIÓN 3x2
                             </div>
                          )}
                       </div>

                       {/* Course Info */}
                       <div className="flex-1 min-w-0 flex flex-col items-start gap-3 w-full">
                          <div>
                            <h3 className="font-bold text-[#0F172A] text-lg lg:text-xl line-clamp-1">{course.title}</h3>
                            {isBundle && (
                               <p className="text-[11px] font-bold text-[#1890FF] mt-0.5">(Incluye Power BI + Python + SQL Server)</p>
                             )}
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{getCourseDescription(course)}</p>
                          </div>

                          {/* Level Selector */}
                          {course.levels && course.levels.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                               {course.levels.map(lvl => (
                                 <button 
                                   key={lvl.name} 
                                   onClick={() => changeLevel(course.slug, lvl.name)}
                                   className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border outline-none ${activeLevel === lvl.name ? 'border-[#1890FF]/30 bg-blue-50 text-[#1890FF]' : 'border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                                 >
                                    {lvl.name}
                                 </button>
                               ))}
                            </div>
                          )}

                          <div className="flex flex-col gap-1.5 text-xs text-gray-500 font-medium mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 w-full max-w-md">
                               {hasScheduleActive && courseSchedules.length > 0 ? (
                                  <>
                                    {courseSchedules.length > 1 ? (
                                      <div className="relative w-full">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                          Selecciona tu fecha de inicio:
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
                                                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 hover:border-gray-300 hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer shadow-sm select-none outline-none focus:border-[#1890FF] focus:ring-2 focus:ring-blue-100"
                                                >
                                                  <span className="flex flex-wrap sm:flex-nowrap items-center gap-x-2 gap-y-0.5 text-left min-w-0 flex-1">
                                                    <span className="flex items-center gap-2 text-slate-800 font-bold shrink-0">
                                                      <Calendar className="w-3.5 h-3.5 text-[#1890FF] shrink-0" />
                                                      <span className="capitalize">{selectedConverted.dateFormatted}</span>
                                                    </span>
                                                    <span className="hidden sm:inline text-slate-400 font-semibold shrink-0">·</span>
                                                    <span className="text-blue-600 truncate font-semibold text-[11px]">{selectedConverted.days} {selectedConverted.time}</span>
                                                  </span>
                                                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isDropdownOpen ? "rotate-180 text-[#1890FF]" : ""}`} />
                                                </button>

                                                <AnimatePresence>
                                                  {isDropdownOpen && (
                                                    <motion.div
                                                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                                      transition={{ duration: 0.12, ease: "easeOut" }}
                                                      className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden divide-y divide-slate-50 max-h-60 overflow-y-auto"
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
                                                            className={`w-full px-4 py-2.5 text-left transition-colors flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-blue-50/50 ${isSelected ? "bg-blue-50/30 font-bold" : ""}`}
                                                          >
                                                            <div className="truncate">
                                                              <span className={`block text-xs font-black capitalize ${isSelected ? "text-[#1890FF]" : "text-slate-800"}`}>
                                                                {converted.dateFormatted}
                                                              </span>
                                                              <span className="block text-[10.5px] text-slate-500 font-bold mt-0.5 truncate">
                                                                {converted.days} &middot; {converted.time}
                                                              </span>
                                                            </div>
                                                            {isSelected && (
                                                              <Check className="w-3.5 h-3.5 text-[#1890FF] shrink-0" />
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
                                      <span className="flex flex-wrap sm:flex-nowrap items-center gap-x-1.5 gap-y-0.5 text-emerald-600 font-bold min-w-0 flex-1">
                                        <span className="flex items-center gap-1.5 shrink-0">
                                          <Calendar className="w-3.5 h-3.5" />
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
                                        <span className="hidden sm:inline text-slate-500 font-semibold shrink-0">·</span>
                                        <span className="text-blue-600 truncate font-semibold text-[11px]">{(() => {
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
                                  <span className="flex items-center gap-1.5 text-amber-500 font-bold">
                                    <Bell className="w-3.5 h-3.5" /> Próxima fecha por confirmar
                                  </span>
                               )}
                               {currentLevelData?.durationHours && (
                                 <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-slate-500 min-w-0 flex-1">
                                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>{currentLevelData.durationHours}h Online en vivo por Zoom</span>
                                 </span>
                               )}
                          </div>
                       </div>

                       {/* Action & Price Col */}
                       <div className="w-full sm:w-auto flex flex-col items-start sm:items-end gap-3 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                           {mode === "individual" && currentLevelData?.price ? (
                              <div className="flex flex-col items-start sm:items-end">
                                 {(() => {
                                    const pricing = getDiscountedPrice(course.slug, currentLevelData.price, activeLevel);
                                    if (isBundle) {
                                      return (
                                        <>
                                           <span className="text-xs text-gray-400 line-through decoration-red-400/50 decoration-2 font-bold">{convertAndFormat(747000)}</span>
                                           <div className="flex flex-col items-start sm:items-end">
                                              <span className="text-2xl font-black text-[#0F172A]">{convertAndFormat(pricing.finalPrice)}</span>
                                              {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                                                <span className="text-xs font-semibold text-gray-400">≈ ${Math.round(pricing.finalPrice / 900)} USD</span>
                                              )}
                                           </div>
                                        </>
                                      );
                                    } else if (pricing.hasDiscount) {
                                      return (
                                        <>
                                           <span className="text-xs text-brand-blue font-bold px-2 py-0.5 rounded-full bg-blue-50 mb-1 tracking-widest uppercase">Promoción</span>
                                           <span className="text-xs text-gray-400 line-through decoration-red-400/50 decoration-2 font-bold">{convertAndFormat(pricing.originalPrice)}</span>
                                           <div className="flex flex-col items-start sm:items-end">
                                              <span className="text-2xl font-black text-[#0F172A]">{convertAndFormat(pricing.finalPrice)}</span>
                                              {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                                                <span className="text-xs font-semibold text-gray-400">≈ ${Math.round(pricing.finalPrice / 900)} USD</span>
                                              )}
                                           </div>
                                        </>
                                      );
                                    } else {
                                      return (
                                        <div className="flex flex-col items-start sm:items-end">
                                           <span className="text-2xl font-black text-[#0F172A]">{convertAndFormat(pricing.finalPrice)}</span>
                                           {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                                             <span className="text-xs font-semibold text-gray-400">≈ ${Math.round(pricing.finalPrice / 900)} USD</span>
                                           )}
                                        </div>
                                      );
                                    }
                                 })()}
                              </div>
                           ) : mode === "enterprise" ? null : (
                               <div className="flex flex-col items-start sm:items-end">
                                   <span className="text-xs text-gray-400 italic">Precio no disponible</span>
                               </div>
                           )}

                           {mode === "individual" ? (
                              canBuy ? (
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden h-10 shadow-sm mt-1">
                                   <button 
                                     onClick={() => updateCartQuantity(course.slug, course.title, activeLevel, getDiscountedPrice(course.slug, currentLevelData!.price, activeLevel).finalPrice, true, -1)}
                                     disabled={itemQty === 0}
                                     className="w-10 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200 disabled:opacity-30 tooltip"
                                   >
                                      <Minus className="w-4 h-4" />
                                   </button>
                                   <div className="w-10 h-full flex items-center justify-center text-sm font-black bg-white border-x border-gray-200 text-[#0F172A]">
                                      {itemQty}
                                   </div>
                                   <button 
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
                                      className="w-10 h-full flex items-center justify-center text-[#1890FF] hover:bg-blue-50"
                                    >
                                       <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleNotifyMe(course.slug, activeLevel)}
                                  disabled={notifySuccess.has(cartKey) || notifyLoading === cartKey}
                                  className={`flex items-center justify-center gap-2 px-5 h-10 rounded-xl text-xs font-bold transition-all mt-1 w-full sm:w-auto ${notifySuccess.has(cartKey) ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                                >
                                  {notifyLoading === cartKey ? <Loader2 className="w-4 h-4 animate-spin" /> : notifySuccess.has(cartKey) ? <><CheckCircle2 className="w-4 h-4" /> ¡Registrado!</> : <><Bell className="w-4 h-4" /> Avísame la próxima fecha</>}
                                </button>
                              )
                           ) : (
                              // Enterprise Mode action
                              <button
                                onClick={() => toggleEnterpriseSelect(course.slug, activeLevel)}
                                className={`flex items-center justify-center gap-2 px-6 h-10 rounded-xl text-xs font-bold transition-all mt-1 border w-full sm:w-auto ${entSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                              >
                                {entSelected ? <><Check className="w-4 h-4" /> Incluido en formato</> : 'Añadir a cotización'}
                              </button>
                           )}

                       </div>
                    </div>
                 </FadeIn>
               );
            })}
          </div>

          {/* Checkout Widget Column */}
          <div className="lg:col-span-5">
             <div className="sticky top-28 w-full">
                <AnimatePresence mode="wait">
                  {mode === "individual" ? (
                    <motion.div
                      key="individual"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white rounded-3xl border border-zinc-200 overflow-hidden"
                      style={{ boxShadow: "0 20px 50px -15px rgba(0,0,0,0.06)" }}
                    >
                      <div className="p-6">
                        {cartItems.length === 0 ? (
                           <div className="text-center py-6">
                             <ShoppingCart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                             <p className="text-sm text-gray-400">Tu carrito está vacío.</p>
                             <p className="text-[10px] text-gray-400 mt-1">Abre el selector de un curso para agregarlo.</p>
                           </div>
                        ) : (
                           <>

                              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                 {cartItems.map(item => (
                                    <div key={`${item.slug}-${item.levelName}`} className="flex justify-between items-start gap-4">
                                       <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                             <span className="font-semibold text-sm text-zinc-900 leading-tight line-clamp-2">{item.quantity}x {item.title}</span>
                                          </div>
                                          <span className="text-[11px] text-zinc-500 mt-0.5 block">{item.levelName}</span>
                                          {item.slug !== "asesoria" && item.selectedStartDate && (() => {
                                            const converted = convertSchedule(
                                              item.selectedStartDate,
                                              item.selectedScheduleTime || "19:30 a 21:30",
                                              item.selectedScheduleDays || "Martes y Jueves",
                                              scheduleCountry.timeZone
                                            );
                                            return (
                                              <div className="mt-2.5 rounded-xl border border-zinc-150 bg-zinc-50/50 p-2.5 space-y-2">
                                                <div className="flex items-center gap-2">
                                                  <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                                                  <div className="flex flex-wrap items-baseline gap-1">
                                                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Inicio:</span>
                                                    <span className="text-[11px] font-bold text-zinc-800 capitalize leading-tight">{converted.dateFormatted}</span>
                                                  </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                  <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                                                  <div className="flex flex-col">
                                                    <div className="flex flex-wrap items-baseline gap-1">
                                                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Horario:</span>
                                                      <span className="text-[11px] font-bold text-zinc-800 leading-tight">{converted.days}</span>
                                                    </div>
                                                    <span className="text-[10px] font-semibold text-zinc-500 mt-0.5">{converted.time}</span>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })()}
                                       </div>
                                       <div className="flex flex-col items-end shrink-0">
                                          {item.hasDiscount && item.originalPrice && item.originalPrice > item.price && (
                                            <div className="flex items-center gap-1.5 mb-1">
                                              <span className="text-[11px] text-zinc-450 line-through font-semibold">
                                                {convertAndFormat(item.originalPrice * item.quantity)}
                                              </span>
                                              <span className="text-[9px] font-extrabold bg-black text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                                              </span>
                                            </div>
                                          )}
                                          <span className="font-black text-zinc-950 text-sm">{convertAndFormat(item.price * item.quantity)}</span>
                                          {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                                            <span className="text-[10px] font-semibold text-zinc-400 mt-0.5">
                                              ≈ ${Math.round((item.price * item.quantity) / 900)} USD
                                            </span>
                                          )}
                                          {item.slug === "asesoria" ? (
                                            <div className="flex items-center gap-2 mt-2 bg-zinc-50 rounded-lg border border-zinc-205">
                                              <button onClick={() => updateCartQuantity(item.slug, item.title, item.levelName, item.price, true, -1)} className="p-1 text-zinc-500 hover:text-black transition-colors bg-transparent border-none cursor-pointer">
                                                <Minus className="w-3 h-3" />
                                              </button>
                                              <span className="text-[10px] font-bold min-w-[12px] text-center text-zinc-805">{item.quantity}</span>
                                              <button onClick={() => updateCartQuantity(item.slug, item.title, item.levelName, item.price, true, 1)} className="p-1 text-zinc-500 hover:text-black transition-colors bg-transparent border-none cursor-pointer">
                                                <Plus className="w-3 h-3" />
                                              </button>
                                            </div>
                                          ) : (
                                            <button onClick={() => updateCartQuantity(item.slug, item.title, item.levelName, item.price, true, -item.quantity)} className="text-[10px] text-zinc-400 hover:text-red-500 mt-1.5 uppercase font-bold tracking-widest bg-transparent border-none cursor-pointer transition-colors">
                                              Eliminar
                                            </button>
                                          )}
                                       </div>
                                    </div>
                                 ))}
                              </div>

                              {hasExtraLicenses && (
                                 <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-6 flex gap-3">
                                    <Users className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-[11px] font-bold text-amber-700">Licencias Adicionales</p>
                                      <p className="text-[10px] text-amber-600/80 leading-snug mt-1">Has activado asientos para otras personas. Recibirás las instrucciones por correo al completar el pago para asignarlas.</p>
                                    </div>
                                 </div>
                              )}

                              {/* Sección de Cupón de Descuento Colapsable */}
                              <div className="border-t border-zinc-100 pt-4 mb-4">
                                <button
                                  type="button"
                                  onClick={() => setShowCouponInput(!showCouponInput)}
                                  className="flex items-center justify-between w-full py-1 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-colors bg-transparent border-none cursor-pointer"
                                >
                                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                    <Tag className="w-3.5 h-3.5" /> ¿Tienes un cupón de descuento?
                                  </span>
                                  {showCouponInput ? <ChevronUp className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />}
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
                                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl">
                                          <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-emerald-650 shrink-0" />
                                            <div>
                                              <span className="font-mono font-black text-xs text-emerald-800 tracking-wider">{appliedCoupon.code}</span>
                                              <span className="text-[10px] text-emerald-600 font-bold ml-2">-{appliedCoupon.discount_percentage}% aplicado</span>
                                            </div>
                                          </div>
                                          <button type="button" onClick={handleRemoveCoupon} className="p-1 rounded-full hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center">
                                            <X className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      ) : (
                                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                          <div className="relative flex-1">
                                            <input
                                              type="text"
                                              placeholder="Ingresa tu código"
                                              value={couponCodeInput}
                                              onChange={e => {
                                                setCouponCodeInput(e.target.value);
                                                if (couponError) setCouponError(null);
                                              }}
                                              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-zinc-100 focus:border-zinc-950 outline-none transition-all font-mono placeholder:font-sans uppercase tracking-wider"
                                            />
                                          </div>
                                          <button
                                            type="submit"
                                            disabled={validatingCoupon || !couponCodeInput.trim()}
                                            className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-50 transition-colors border-none cursor-pointer flex items-center gap-1.5"
                                          >
                                            {validatingCoupon ? <Loader2 className="w-3 h-3 animate-spin" /> : "Aplicar"}
                                          </button>
                                        </form>
                                      )}
                                      
                                      {couponError && (
                                        <motion.p initial={{ opacity: 0, y: -2 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] text-red-500 font-semibold mt-1.5 px-1">
                                          {couponError}
                                        </motion.p>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {appliedCoupon && (
                                <div className="mb-3 flex justify-between items-center text-xs font-semibold">
                                  <span className="text-zinc-400">Subtotal</span>
                                  <span className="text-zinc-700 font-black">{convertAndFormat(totalPrice)}</span>
                                </div>
                              )}
                              
                              {appliedCoupon && (
                                <div className="mb-4 flex justify-between items-center text-xs font-semibold text-emerald-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/30">
                                  <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5"/> Descuento ({appliedCoupon.code})</span>
                                  <span className="font-black">-{convertAndFormat(couponDiscountAmount)}</span>
                                </div>
                              )}

                              <div className="border-t border-zinc-200 border-dashed pt-4 mb-6 flex justify-between items-end">
                                 <span className="font-bold text-zinc-500">Total a pagar</span>
                                 <div className="text-right">
                                   <span className="font-black text-2xl text-zinc-950 block">
                                     {convertAndFormat(appliedCoupon ? finalPriceWithCoupon : totalPrice)}
                                   </span>
                                   {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                                     <span className="text-xs font-semibold text-zinc-400">
                                       ≈ ${Math.round((appliedCoupon ? finalPriceWithCoupon : totalPrice) / 900)} USD
                                     </span>
                                   )}
                                 </div>
                              </div>

                              {/* Exchange Rate Reference Card */}
                              {country.currency.code !== "CLP" && (
                                <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 mb-6 text-left">
                                  <div className="flex gap-2.5 items-start">
                                    <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                                    <div>
                                      <h4 className="text-[11px] font-black text-zinc-800 uppercase tracking-wider mb-1">
                                        Información de Conversión
                                      </h4>
                                      <p className="text-xs text-zinc-600 leading-snug">
                                        Se realizará un cobro por el equivalente de <span className="font-bold">{convertAndFormat(appliedCoupon ? finalPriceWithCoupon : totalPrice)}</span>.
                                      </p>
                                      <div className="mt-2.5 pt-2 border-t border-zinc-200/60 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-zinc-450 font-bold">
                                        <span>Tasa USD Ref: $1 USD = $900 CLP</span>
                                        {country.currency.code !== "USD" && (
                                          <span>Tasa de Cambio: $1 USD ≈ {(country.currency.rate * 900).toFixed(2)} {country.currency.code}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <motion.button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full py-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-sm flex justify-center items-center gap-2 transition-all disabled:opacity-60 border-none cursor-pointer shadow-md shadow-zinc-200 hover:shadow-lg hover:shadow-zinc-300"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {isCheckingOut ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <><ShoppingCart className="w-5 h-5" /> Proceder al Pago</>
                                )}
                              </motion.button>
                              
                              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-zinc-400 font-medium">
                                <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Pago cifrado y seguro vía Flow</span>
                              </div>
                            </>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    // Enterprise Right Widget
                    <motion.div
                      key="enterprise"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden"
                      style={{ boxShadow: "0 20px 50px -15px rgba(0,0,0,0.08)" }}
                    >
                      <div className="bg-indigo-950 px-6 py-5 text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-indigo-400" /> Formulario de Empresa
                        </h3>
                      </div>
                      <div className="p-6">
                        {enterpriseSuccess ? (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 text-3xl">✓</div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">¡Solicitud Enviada!</h3>
                            <p className="text-sm text-gray-500">Un asesor te contactará en breve.</p>
                          </motion.div>
                        ) : (
                          <form onSubmit={handleEnterpriseSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Nombre *</label>
                              <input type="text" required value={entName} onChange={e => setEntName(e.target.value)}
                                className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Email *</label>
                              <input type="email" required value={entEmail} onChange={e => setEntEmail(e.target.value)}
                                className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Teléfono / WhatsApp *</label>
                              <input type="tel" required value={entPhone} onChange={e => setEntPhone(e.target.value)} placeholder="+56 9..."
                                className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Empresa *</label>
                              <input type="text" required value={entCompany} onChange={e => setEntCompany(e.target.value)}
                                className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Cargo</label>
                                <input type="text" value={entPosition} onChange={e => setEntPosition(e.target.value)}
                                  className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">N° Personas</label>
                                <input type="number" min="1" value={entEmployees} onChange={e => setEntEmployees(e.target.value)}
                                  className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                              </div>
                            </div>
                            {enterpriseToggles.size > 0 && (
                              <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50">
                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Cursos sumados a cotización:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {Array.from(enterpriseToggles).map(toggle => {
                                    const split = toggle.split("-");
                                    const level = split.pop();
                                    const slugPart = split.join("-");
                                    const objName = allCourses.find(c => c.slug === slugPart)?.title;
                                    return <span key={toggle} className="text-[11px] font-bold bg-white text-indigo-600 border border-indigo-200 px-2 py-1 rounded-lg shadow-sm">{objName} - {level}</span>
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Mensaje (Opcional)</label>
                              <textarea rows={2} value={entMessage} onChange={e => setEntMessage(e.target.value)}
                                className="w-full rounded-xl p-3 text-sm bg-[#F8FAFC] border border-[#E2E8F0] focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none" />
                            </div>

                            <div className="flex items-start gap-3 mt-1">
                              <input
                                type="checkbox"
                                id="privacy-enterprise"
                                checked={entAcceptsPrivacy}
                                onChange={(e) => setEntAcceptsPrivacy(e.target.checked)}
                                required
                                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-indigo-600 cursor-pointer flex-shrink-0"
                              />
                              <label htmlFor="privacy-enterprise" className="text-[10px] text-gray-500 cursor-pointer leading-relaxed">
                                Acepto la{" "}
                                <Link href="/privacidad" className="text-indigo-500 font-semibold no-underline hover:underline" target="_blank">Política de Privacidad</Link>{" "}
                                y autorizo el uso de mis datos para recibir la cotización solicitada.
                              </label>
                            </div>

                            <motion.button
                              type="submit"
                              disabled={isSubmittingEnterprise || enterpriseToggles.size === 0}
                              className="w-full py-4 rounded-xl text-white font-bold text-sm flex justify-center items-center gap-2 transition-all disabled:opacity-60 border-none cursor-pointer mt-2"
                              style={{ background: "linear-gradient(135deg, #6366F1, #4338CA)" }}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {isSubmittingEnterprise ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <><Building2 className="w-4 h-4" /> Enviar Solicitud</>
                              )}
                            </motion.button>
                            
                            <a href="https://wa.me/56935409699" target="_blank" rel="noopener noreferrer" className="w-full block py-3.5 rounded-xl border-2 border-emerald-500 text-emerald-600 font-bold text-sm flex justify-center items-center gap-2 hover:bg-emerald-50 transition-colors no-underline">
                               Hablar por WhatsApp
                            </a>
                            {enterpriseToggles.size === 0 && <p className="text-[10px] text-center text-amber-500 font-bold">Selecciona al menos 1 curso del panel izquierdo</p>}
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
              className="lg:hidden fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px]"
              style={{ zIndex: 9990 }}
            />
          )}
          
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="lg:hidden flex flex-col"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: "#fff",
              borderTop: "1px solid #e5e7eb",
              boxShadow: "0 -8px 30px rgba(0,0,0,0.12)",
              overflow: "hidden",
              boxSizing: "border-box" as const,
              maxWidth: "100vw",
            }}
          >
            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 8, paddingBottom: 4 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#D1D5DB" }} />
            </div>

            {/* Expandable Cart Details */}
            <AnimatePresence>
              {isMobileCartOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden", backgroundColor: "#f9fafb" }}
                >
                  <div style={{ padding: 20, maxHeight: "50vh", overflowY: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <h4 style={{ fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8, margin: 0, fontSize: 15 }}>
                        <ShoppingCart style={{ width: 16, height: 16, color: "#000" }} /> Tu Carrito
                      </h4>
                      <button onClick={() => setIsMobileCartOpen(false)} style={{ padding: 6, borderRadius: "50%", background: "#e5e7eb", color: "#6b7280", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                        <X style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {cartItems.map(item => (
                        <div key={`mob-${item.slug}-${item.levelName}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: 14, background: "#fff", border: "1px solid #f3f4f6", borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontWeight: 600, fontSize: 14, color: "#0F172A", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.quantity}x {item.title}</span>
                            <span style={{ fontSize: 11, color: "#6b7280", display: "block", marginTop: 4, fontWeight: 500 }}>{item.levelName}</span>
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0">
                            {item.hasDiscount && item.originalPrice && item.originalPrice > item.price && (
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                                <span style={{ fontSize: 11, textDecoration: "line-through", color: "#9ca3af", fontWeight: 650 }}>
                                  {convertAndFormat(item.originalPrice * item.quantity)}
                                </span>
                                <span style={{ fontSize: 9, fontWeight: 900, backgroundColor: "#000", color: "#fff", padding: "1px 4px", borderRadius: 4, textTransform: "uppercase" }}>
                                  -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                                </span>
                              </div>
                            )}
                            <span style={{ fontWeight: 900, color: "#0F172A", fontSize: 15 }}>{convertAndFormat(item.price * item.quantity)}</span>
                            {country.currency.code !== "USD" && country.currency.code !== "CLP" && (
                              <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, marginTop: 2 }}>
                                ≈ ${Math.round((item.price * item.quantity) / 900)} USD
                              </span>
                            )}
                            <button onClick={() => updateCartQuantity(item.slug, item.title, item.levelName, item.price, true, -item.quantity)} style={{ fontSize: 10, color: "#ef4444", marginTop: 6, textTransform: "uppercase", fontWeight: 700, letterSpacing: 1, background: "#fef2f2", padding: "2px 8px", borderRadius: 4, border: "none", cursor: "pointer" }}>Eliminar</button>
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
              style={{
                padding: "14px 20px",
                paddingBottom: "env(safe-area-inset-bottom, 14px)",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid #f3f4f6",
                cursor: "pointer",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, userSelect: "none" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, backgroundColor: "#000", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShoppingCart style={{ width: 20, height: 20 }} />
                  </div>
                  <span style={{ position: "absolute", top: -4, right: -4, backgroundColor: "#22C55E", color: "#fff", fontSize: 10, fontWeight: 900, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "2px solid #fff", lineHeight: 1 }}>
                    {cartItemCount}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
                    Ver Detalles {isMobileCartOpen ? <ChevronDown style={{ width: 14, height: 14 }} /> : <ChevronUp style={{ width: 14, height: 14 }} />}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", lineHeight: 1, display: "block", marginTop: 4 }}>
                    {convertAndFormat(appliedCoupon ? finalPriceWithCoupon : totalPrice)} {country.currency.code !== "USD" && country.currency.code !== "CLP" && <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 700 }}>≈ ${Math.round((appliedCoupon ? finalPriceWithCoupon : totalPrice) / 900)} USD</span>}
                  </span>
                </div>
              </div>
              
              <button
                onClick={(e) => { e.stopPropagation(); handleCheckout(); }}
                disabled={isCheckingOut}
                style={{
                  padding: "12px 20px",
                  borderRadius: 12,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  border: "none",
                  cursor: "pointer",
                  background: "#000",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  flexShrink: 0,
                  opacity: isCheckingOut ? 0.6 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {isCheckingOut ? <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> : 'Pagar'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
