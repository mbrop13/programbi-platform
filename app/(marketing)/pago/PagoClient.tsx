"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Clock, Calendar, Building2, User, Users,
  CheckCircle2, Bell, Loader2, ShoppingCart, Check, Plus, Minus,
  X, BadgeCheck, ChevronUp, ChevronDown
} from "lucide-react";
import { courses as allCourses, Course } from "@/lib/data/courses";
import { type CourseSchedule, analisisDeDatosSlugs, formatScheduleDate, getNearestSchedule } from "@/lib/data/course-schedules";
import { FadeIn } from "@/components/shared/AnimatedComponents";

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price);
}

type Mode = "individual" | "enterprise";

interface CartItem {
  slug: string;
  levelName: string;
  price: number;
  quantity: number;
  title: string;
}

export default function PagoClient() {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("curso") || "";
  const initialLevel = searchParams.get("nivel") || "";
  const initialName = searchParams.get("nombre") || "";
  const initialEmail = searchParams.get("email") || "";

  const [mode, setMode] = useState<Mode>("individual");
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [priceOverrides, setPriceOverrides] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Cart state
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  // Enterprise toggles
  const [enterpriseToggles, setEnterpriseToggles] = useState<Set<string>>(new Set());
  
  // Selected levels per course slug
  const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({});

  const [notifyLoading, setNotifyLoading] = useState<string | null>(null);
  const [notifySuccess, setNotifySuccess] = useState<Set<string>>(new Set());
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmittingEnterprise, setIsSubmittingEnterprise] = useState(false);
  const [enterpriseSuccess, setEnterpriseSuccess] = useState(false);

  // Enterprise form fields
  const [entName, setEntName] = useState(initialName);
  const [entEmail, setEntEmail] = useState(initialEmail);
  const [entCompany, setEntCompany] = useState("");
  const [entPosition, setEntPosition] = useState("");
  const [entEmployees, setEntEmployees] = useState("");
  const [entMessage, setEntMessage] = useState("");
  const [entAcceptsPrivacy, setEntAcceptsPrivacy] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/schedules").then(r => r.json()),
      fetch("/api/promotions").then(r => r.json()),
      fetch("/api/prices").then(r => r.json())
    ]).then(([schData, promoData, pricesData]) => {
      if (Array.isArray(schData)) setSchedules(schData);
      if (Array.isArray(promoData)) setPromotions(promoData);
      if (Array.isArray(pricesData)) setPriceOverrides(pricesData);
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
          setCart({
             [`${course.slug}-${levelName}`]: {
                slug: course.slug,
                title: course.title,
                levelName: level.name,
                price: pricing.finalPrice,
                quantity: 1
             }
          });
          setEnterpriseToggles(new Set([`${course.slug}-${levelName}`]));
        }
      }
    }
  }, [loadingData, initialSlug, initialLevel, promotions]);

  const changeLevel = (slug: string, newLevelName: string) => {
    setSelectedLevels(prev => ({ ...prev, [slug]: newLevelName }));
  };

  const updateCartQuantity = (slug: string, title: string, levelName: string, price: number, active: boolean, increment: number) => {
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

      return {
        ...prev,
        [key]: { slug, title, levelName, price, quantity: newQty }
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
  const hasExtraLicenses = cartItemCount > Object.keys(cart).length;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);
    try {
      // In a real multi-item implementation, we modify backend to accept `items` array.
      // Below is the mapped array to pass to the updated Flow creation logic.
      const res = await fetch("/api/flow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            courseSlug: item.slug,
            levelName: item.levelName,
            quantity: item.quantity,
            price: item.price
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
    if (!entName || !entEmail || !entCompany) return;
    setIsSubmittingEnterprise(true);
    try {
      await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: entName,
          email: entEmail,
          company: entCompany,
          position: entPosition,
          employeeCount: entEmployees,
          message: entMessage,
          selectedCourses: Array.from(enterpriseToggles),
          leadType: "enterprise",
        }),
      });
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
          const adSchedules = schedules.filter(s => analisisDeDatosSlugs.includes(s.course_slug));
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
    <section className="relative -mt-20 lg:-mt-24 pt-28 lg:pt-36 pb-32 min-h-screen" style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 60%)" }}>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 relative z-10">
        <Link href="/cursos" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 font-medium mb-6 no-underline transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <FadeIn>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-blue-50 text-[#1890FF] font-black text-xs tracking-widest uppercase px-5 py-2.5 rounded-full border border-blue-100 mb-4">
              <ShoppingCart size={14} /> Inscripción
            </span>
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
               let schedule: CourseSchedule | undefined | null = undefined;
               
               // Specialty courses can always be purchased
               const alwaysAvailable = ["analitica-mineria", "analitica-financiera"].includes(course.slug);
               
               if (course.slug === "analisis-de-datos") {
                  if (activeLevel?.includes("Básico") || activeLevel?.includes("Completo")) {
                      const adSchedules = schedules.filter(s => analisisDeDatosSlugs.includes(s.course_slug));
                      schedule = getNearestSchedule(adSchedules);
                  }
               } else if (!alwaysAvailable) {
                  schedule = schedules.find(s => s.course_slug === course.slug && s.level_name === activeLevel);
               }

               const hasScheduleActive = !!schedule || alwaysAvailable;
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
                          <Image src={course.imageUrl} alt={course.title} fill className="object-cover" unoptimized />
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
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{course.shortDescription}</p>
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

                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 font-medium mt-2">
                               {hasScheduleActive && schedule ? (
                                  <span className="flex items-center gap-1 text-emerald-600"><Calendar className="w-3.5 h-3.5" /> Inicio: {schedule.start_date ? formatScheduleDate(schedule.start_date) : ''}</span>
                               ) : (
                                  <span className="flex items-center gap-1 text-amber-500"><Bell className="w-3.5 h-3.5" /> Próxima fecha por confirmar</span>
                               )}
                               {currentLevelData?.durationHours && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {currentLevelData.durationHours}h Online</span>}
                          </div>
                       </div>

                       {/* Action & Price Col */}
                       <div className="w-full sm:w-auto flex flex-col items-start sm:items-end gap-3 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                           {mode === "individual" && currentLevelData?.price ? (
                              <div className="flex flex-col items-start sm:items-end">
                                 {(() => {
                                    const pricing = getDiscountedPrice(course.slug, currentLevelData.price, activeLevel);
                                    if (isBundle) {
                                      // bundle pricing logic overrides specific promo for base visual, but lets mix them logically
                                      return (
                                        <>
                                           <span className="text-xs text-gray-400 line-through decoration-red-400/50 decoration-2 font-bold">$747.000</span>
                                           <span className="text-2xl font-black text-[#0F172A]">{formatCLP(pricing.finalPrice)}</span>
                                        </>
                                      );
                                    } else if (pricing.hasDiscount) {
                                      return (
                                        <>
                                           <span className="text-xs text-brand-blue font-bold px-2 py-0.5 rounded-full bg-blue-50 mb-1 tracking-widest uppercase">Promoción</span>
                                           <span className="text-xs text-gray-400 line-through decoration-red-400/50 decoration-2 font-bold">{formatCLP(pricing.originalPrice)}</span>
                                           <span className="text-2xl font-black text-[#0F172A]">{formatCLP(pricing.finalPrice)}</span>
                                        </>
                                      );
                                    } else {
                                      return <span className="text-2xl font-black text-[#0F172A]">{formatCLP(pricing.finalPrice)}</span>;
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
                                     onClick={() => updateCartQuantity(course.slug, course.title, activeLevel, getDiscountedPrice(course.slug, currentLevelData!.price, activeLevel).finalPrice, true, 1)}
                                     className="w-10 h-full flex items-center justify-center text-[#1890FF] hover:bg-blue-50"
                                   >
                                      <Plus className="w-4 h-4" />
                                   </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleNotifyMe(course.slug, activeLevel)}
                                  disabled={notifySuccess.has(cartKey) || notifyLoading === cartKey}
                                  className={`flex items-center gap-2 px-5 h-10 rounded-xl text-xs font-bold transition-all whitespace-nowrap mt-1 ${notifySuccess.has(cartKey) ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                                >
                                  {notifyLoading === cartKey ? <Loader2 className="w-4 h-4 animate-spin" /> : notifySuccess.has(cartKey) ? <><CheckCircle2 className="w-4 h-4" /> ¡Registrado!</> : <><Bell className="w-4 h-4" /> Avísame la próxima fecha</>}
                                </button>
                              )
                           ) : (
                              // Enterprise Mode action
                              <button
                                onClick={() => toggleEnterpriseSelect(course.slug, activeLevel)}
                                className={`flex items-center gap-2 px-6 h-10 rounded-xl text-xs font-bold transition-all whitespace-nowrap mt-1 border ${entSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
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
                      className="bg-white rounded-3xl border border-gray-200 overflow-hidden"
                      style={{ boxShadow: "0 20px 50px -15px rgba(0,0,0,0.08)" }}
                    >
                      <div className="bg-[#0F172A] px-6 py-5 text-white flex items-center justify-between">
                         <h3 className="font-bold text-lg flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-[#1890FF]" /> Resumen
                         </h3>
                         {cartItemCount > 0 && <span className="bg-[#1890FF] text-white text-xs font-black px-2 py-0.5 rounded-full">{cartItemCount} items</span>}
                      </div>

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
                                             <span className="font-semibold text-sm text-[#0F172A] leading-tight line-clamp-2">{item.quantity}x {item.title}</span>
                                          </div>
                                          <span className="text-[11px] text-gray-500 mt-0.5 block">{item.levelName}</span>
                                       </div>
                                       <div className="flex flex-col items-end shrink-0">
                                          <span className="font-black text-[#0F172A] text-sm">{formatCLP(item.price * item.quantity)}</span>
                                          <button onClick={() => updateCartQuantity(item.slug, item.title, item.levelName, item.price, true, -item.quantity)} className="text-[10px] text-red-400 hover:text-red-600 mt-1 uppercase font-bold tracking-widest bg-transparent border-none cursor-pointer">Eliminar</button>
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

                              <div className="border-t-2 border-dashed border-gray-100 pt-4 mb-6 flex justify-between items-center">
                                 <span className="font-bold text-gray-500">Total a pagar</span>
                                 <span className="font-black text-2xl text-[#1890FF]">{formatCLP(totalPrice)}</span>
                              </div>

                              <motion.button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full py-4 rounded-xl text-white font-bold text-sm flex justify-center items-center gap-2 transition-all disabled:opacity-60 border-none cursor-pointer shadow-lg shadow-blue-500/20"
                                style={{ background: "linear-gradient(135deg, #1890FF, #0050b3)" }}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {isCheckingOut ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <><ShoppingCart className="w-5 h-5" /> Proceder al Pago</>
                                )}
                              </motion.button>
                              
                              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-400 font-medium">
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

      {/* Mobile Sticky Checkout Bar / Bottom Sheet */}
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
                className="lg:hidden fixed inset-0 bg-[#0F172A]/40 z-40 backdrop-blur-[2px]"
              />
            )}
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.1)] flex flex-col rounded-t-[1.5rem] overflow-hidden`}
            >
              {/* Expandable Cart Details */}
              <AnimatePresence>
                {isMobileCartOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-gray-50/50 relative"
                  >
                    <div className="p-5 max-h-[50vh] overflow-y-auto custom-scrollbar">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-[#0F172A] flex items-center gap-2">
                           <ShoppingCart className="w-4 h-4 text-[#1890FF]" /> Tu Carrito
                        </h4>
                        <button onClick={() => setIsMobileCartOpen(false)} className="p-1.5 rounded-full bg-gray-200/50 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer border-none">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                         {cartItems.map(item => (
                            <div key={`${item.slug}-${item.levelName}`} className="flex justify-between items-start gap-4 p-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                               <div className="flex-1 min-w-0">
                                  <span className="font-semibold text-sm text-[#0F172A] leading-tight line-clamp-2">{item.quantity}x {item.title}</span>
                                  <span className="text-[11px] text-gray-500 mt-1 block font-medium">{item.levelName}</span>
                               </div>
                               <div className="flex flex-col items-end shrink-0">
                                  <span className="font-black text-[#0F172A] text-[15px]">{formatCLP(item.price * item.quantity)}</span>
                                  <button onClick={() => updateCartQuantity(item.slug, item.title, item.levelName, item.price, true, -item.quantity)} className="text-[10px] text-red-500 hover:text-red-600 mt-1.5 uppercase font-bold tracking-widest bg-red-50 hover:bg-red-100 transition-colors px-2 py-0.5 rounded border-none cursor-pointer">Eliminar</button>
                               </div>
                            </div>
                         ))}
                      </div>
                      {hasExtraLicenses && (
                         <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mt-4 flex gap-3">
                            <Users className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[11px] font-bold text-amber-700">Licencias Adicionales</p>
                              <p className="text-[10px] text-amber-600/80 leading-snug mt-1">Recibirás las instrucciones por correo al completar el pago.</p>
                            </div>
                         </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sticky Bar (Always visible) */}
              <div 
                className="px-5 py-4 bg-white flex items-center justify-between cursor-pointer active:bg-gray-50 transition-colors border-t border-gray-100 pb-8 sm:pb-4"
                onClick={() => setIsMobileCartOpen(!isMobileCartOpen)}
              >
                <div className="flex items-center gap-3 select-none">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 bg-blue-50 text-[#1890FF] rounded-full flex items-center justify-center">
                       <ShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-[#22C55E] text-white text-[10px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full z-10 shadow-sm border-2 border-white leading-none">
                      {cartItemCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase flex items-center gap-1">
                      Ver Detalles {isMobileCartOpen ? <ChevronDown className="w-3.5 h-3.5 ml-0.5" /> : <ChevronUp className="w-3.5 h-3.5 ml-0.5" />}
                    </span>
                    <span className="text-xl font-black text-[#0F172A] leading-none block mt-0.5">{formatCLP(totalPrice)}</span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => { e.stopPropagation(); handleCheckout(); }}
                  disabled={isCheckingOut}
                  className="py-3 px-6 rounded-xl text-white font-bold text-[13px] flex justify-center items-center gap-2 transition-all disabled:opacity-60 border-none cursor-pointer shadow-lg shadow-blue-500/20 shrink-0 uppercase tracking-wide"
                  style={{ background: "linear-gradient(135deg, #1890FF, #0050b3)" }}
                >
                  {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Pagar Ahora'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </section>
  );
}
