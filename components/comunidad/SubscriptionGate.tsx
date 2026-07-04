"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Shield, Lock, ArrowRight, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { communityPlans } from "@/lib/data/community_plans";
import AuthModal from "@/components/shared/AuthModal";
import { useGeoPricing } from "@/hooks/useGeoPricing";

interface SubscriptionGateProps {
  onSubscribe?: (planId: string) => void;
  message?: string;
  isLoggedIn: boolean;
  isLoading?: boolean;
  /** When true, renders only the hero headline/subtitle (no badge, plans, or billing) */
  heroOnly?: boolean;
  transparent?: boolean;
}

type BillingPeriod = 'mensual' | 'semestral' | 'anual';

export default function SubscriptionGate({ onSubscribe, message, isLoggedIn, isLoading = false, heroOnly = false, transparent = false }: SubscriptionGateProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("max");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('mensual');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<any[]>([]);

  const { isInternational, formatGeoPrice } = useGeoPricing();

  useEffect(() => {
    fetch("/api/promotions")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPromotions(data);
      })
      .catch(console.error);
  }, []);

  const getPlanPromo = (planId: string) => {
    const promo = promotions.find(p => p.target_type === 'all' || p.target_type === 'plans' || (p.target_type === 'specific_plan' && p.target_id === planId));
    return promo;
  };

  const handleAction = async (planId: string) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    
    setLoadingPlan(planId);
    try {
      if (onSubscribe) {
        onSubscribe(planId);
      } else {
        // Redirigir al checkout de suscripción de Mercado Pago
        const res = await fetch("/api/mercadopago/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId }),
        });
        const data = await res.json();
        
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert("Error de suscripción: " + (data.error || "Fallo al generar orden."));
          setLoadingPlan(null);
        }
      }
    } catch(err) {
      alert("Error redirigiendo a la pasarela de pagos.");
      setLoadingPlan(null);
    }
  };
  return (
    <div id={heroOnly ? "hero" : "pricing"} className={`w-full relative isolate flex flex-col items-center px-4 overflow-hidden top-0 ${heroOnly ? 'pt-24 sm:pt-36 pb-6 sm:pb-8' : 'pt-6 pb-28'}`}>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="register"
      />

      {/* Background Video (Hero Only) or Engineering Grid & Orbs (Pricing Section) - Placed at -z-20 behind everything */}
      {!transparent && (
        heroOnly ? (
          <div className="absolute inset-0 -z-20 w-full h-full bg-slate-50 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-[0.6] pointer-events-none"
            >
              <source src="/videos/que_gire_lentamente.mp4" type="video/mp4" />
            </video>
            {/* Smooth overlay for readability and fade into the next section */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-slate-50/90 backdrop-blur-[0.5px]" />
          </div>
        ) : (
          <div className="absolute inset-0 -z-20 w-full h-full bg-slate-50">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-blue-400/20 to-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-purple-300/15 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/2" />
          </div>
        )
      )}

      <div className={`max-w-4xl text-center relative z-10 ${heroOnly ? 'mb-0' : 'mb-12'}`}>
        {!heroOnly && (
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-2 bg-white/95 border border-blue-100 shadow-[0_4px_15px_rgba(59,130,246,0.08)] px-5 py-2.5 rounded-full mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-brand-blue animate-pulse" />
            <span className="text-xs font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 uppercase tracking-[0.2em]">
              Comunidad Premium
            </span>
          </motion.div>
        )}
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight mb-6 leading-[1.08] text-slate-900"
        >
          {message ? (
             <span className="text-slate-950 font-black">{message}</span>
          ) : (
             <div className="flex flex-col gap-1 items-center">
               <span className="font-[family-name:var(--font-caveat)] text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight font-medium text-slate-800 leading-none block">
                 Desbloquea el poder de la
               </span>
               <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] font-display mt-4 block">
                 Comunidad{" "}
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1890FF] to-indigo-600">
                   ProgramBI
                 </span>
               </span>
             </div>
          )}
        </motion.h1>
        
        {!heroOnly && (
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.15 }}
             className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[11px] sm:text-xs px-4 py-2 rounded-full mb-8 shadow-lg shadow-blue-500/25 tracking-[0.15em] uppercase"
          >
            Pruébalo 7 días GRATIS
          </motion.div>
        )}
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-10"
        >
          Elige el plan que mejor se adapte a tus objetivos. Obtén acceso a nuestra plataforma interactiva, Asistente IA especializado y una red de profesionales de élite.
        </motion.p>

        {/* Hero Actions (Ver Planes & Contactar) */}
        {heroOnly && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-0 relative z-20"
          >
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Ver Planes
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/#contacto"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-black text-sm px-8 py-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Contactar
            </a>
          </motion.div>
        )}

        {/* Billing Selector */}
        {!heroOnly && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/90 backdrop-blur-md border border-slate-200/80 p-1.5 rounded-full inline-flex items-center mx-auto shadow-md relative z-20"
          >
            <button 
              onClick={() => setBillingPeriod('mensual')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 ${billingPeriod === 'mensual' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Mensual
            </button>
            <button 
              onClick={() => setBillingPeriod('semestral')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${billingPeriod === 'semestral' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Semestral <span className="bg-emerald-500/10 text-emerald-600 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-normal">-10%</span>
            </button>
            <button 
              onClick={() => setBillingPeriod('anual')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${billingPeriod === 'anual' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Anual <span className="bg-blue-500/10 text-blue-600 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-normal">-30%</span>
            </button>
          </motion.div>
        )}
      </div>

      {!heroOnly && (
        <div className="max-w-[1400px] mx-auto px-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch relative z-10">
        {communityPlans.map((plan, i) => {
          const isActive = selectedPlanId === plan.id;
          const compositePlanId = `${plan.id}_${billingPeriod}`;
          const isProcessing = loadingPlan === compositePlanId;

          // Billing discount logic
          let periodName = "mes";
          let monthsCount = 1;
          let totalBilledPrice = plan.price;

          if (billingPeriod === 'semestral') { 
            periodName = "semestre"; 
            monthsCount = 6; 
            totalBilledPrice = plan.priceSemiannual || (plan.price * 6 * 0.9);
          }
          if (billingPeriod === 'anual') { 
            periodName = "año"; 
            monthsCount = 12; 
            totalBilledPrice = plan.priceAnnual || (plan.price * 12 * 0.7);
          }

          const promo = getPlanPromo(plan.id);
          const originalMonthlyPrice = Math.round(totalBilledPrice / monthsCount);
          
          let adminDiscountPercent = 0;
          if (promo) {
             if (promo.promo_price) {
                totalBilledPrice = promo.promo_price;
                adminDiscountPercent = promo.discount_percentage || Math.round((1 - (promo.promo_price / (plan.price * monthsCount))) * 100);
             } else if (promo.discount_percentage > 0) {
                adminDiscountPercent = promo.discount_percentage;
                totalBilledPrice = Math.round(totalBilledPrice * (100 - adminDiscountPercent) / 100);
             }
          }

          const finalMonthlyPrice = Math.round(totalBilledPrice / monthsCount);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 + 0.3 }}
              onHoverStart={() => setSelectedPlanId(plan.id)}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`relative rounded-[2.5rem] cursor-pointer transition-all duration-500 flex flex-col h-full bg-white border ${
                isActive 
                  ? 'scale-[1.03] z-20 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.25)] border-blue-500/80 ring-1 ring-blue-500/30' 
                  : 'scale-[0.97] hover:scale-[0.99] z-10 border-slate-200/80 hover:border-slate-300/80 shadow-sm opacity-90 hover:opacity-100'
              }`}
            >
              
              <div className="relative z-10 w-full h-full flex flex-col p-6 lg:p-8 pt-10">

                {/* Highlight Badge */}
                {plan.highlight && adminDiscountPercent === 0 && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/30 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 whitespace-nowrap"
                  >
                    <Star className="w-3 h-3 fill-white text-white" />
                    {plan.highlight}
                  </div>
                )}
                {adminDiscountPercent > 0 && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-blue-600 uppercase shadow-md shadow-blue-500/10 flex items-center gap-1.5 bg-blue-50 border border-blue-100 whitespace-nowrap"
                  >
                    <Sparkles className="w-3 h-3 text-brand-blue" />
                    Oferta -{adminDiscountPercent}%
                  </div>
                )}

                {/* Header */}
                <div className="mb-5 flex-grow-0">
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-2.5 tracking-tight">{plan.name}</h3>
                  <p className="text-slate-500 leading-snug text-xs md:text-sm font-medium">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="flex flex-col mb-6 flex-grow-0 pb-6 border-b border-gray-100">
                  {adminDiscountPercent > 0 && (
                     <div className="text-xs text-gray-400 line-through decoration-red-400/50 decoration-2 font-bold mb-1 block w-fit">
                        {formatGeoPrice(originalMonthlyPrice)} /mes
                     </div>
                  )}
                  <div className="flex items-end gap-1">
                    <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">
                      {formatGeoPrice(finalMonthlyPrice)}
                    </span>
                    <span className="text-slate-400 font-bold mb-1.5 text-sm">/mes</span>
                  </div>
                  {billingPeriod !== 'mensual' && (
                    <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl inline-block self-start">
                      Facturado {formatGeoPrice(totalBilledPrice)} cada {periodName}
                    </div>
                  )}
                  {billingPeriod === 'mensual' && (
                    <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl inline-block self-start opacity-0 select-none">Spacer</div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8 flex-grow">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Beneficios Incluidos:</p>
                  {plan.features.map((feature, idx) => {
                    const isCheck = feature.startsWith("✓");
                    const isChat = feature.startsWith("💬");
                    const isLive = feature.startsWith("🎓");
                    const cleanFeature = feature.replace(/^✓\s*|^💬\s*|^🎓\s*/, "");
                    return (
                      <div key={idx} className="flex gap-3 items-start group/item">
                        {isCheck || isChat || isLive ? (
                           <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-amber-50 group-hover/item:scale-110 transition-transform duration-300">
                             {isCheck && <Check className="w-3 h-3 font-bold text-amber-500" />}
                             {isChat && <span className="text-[11px]">💬</span>}
                             {isLive && <span className="text-[11px]">🎓</span>}
                           </div>
                        ) : (
                          <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform duration-300" style={{ backgroundColor: `${plan.color}15` }}>
                            <Check className="w-3 h-3 font-bold" style={{ color: plan.color }} />
                          </div>
                        )}
                        <span className={`text-[13px] md:text-sm leading-snug transition-colors duration-300 group-hover/item:text-slate-900 ${isCheck || isChat || isLive ? 'text-[#0F172A] font-bold' : 'text-slate-600 font-medium'}`}>{cleanFeature}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Button - Always at the bottom */}
                <div className="flex-grow-0 mt-auto">
                    <button
                    disabled={isLoading || isProcessing}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAction(compositePlanId);
                    }}
                    className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group relative overflow-hidden text-sm shadow-sm hover:shadow-md`}
                    style={{ 
                        backgroundColor: isActive ? '#2563eb' : '#f8fafc',
                        color: isActive ? '#ffffff' : '#334155',
                        opacity: (isLoading || isProcessing) ? 0.7 : undefined,
                    }}
                    >
                    {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                    ) : (
                        <div className="flex flex-col items-center justify-center relative z-10 w-full">
                          <div className="flex items-center gap-2 justify-center w-full">
                            {plan.id === 'ultraplus' ? "Suscribirse Ahora" : "Iniciar Prueba Gratis"}
                            <ArrowRight className={`w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                          </div>
                          {plan.id !== 'ultraplus' && (
                            <span className="text-[9px] font-bold opacity-80 mt-1 uppercase tracking-wider block text-center">7 días de acceso y sin cargos</span>
                          )}
                        </div>
                    )}
                    </button>
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
      )}

      {!heroOnly && (
        <>
          <div className="mt-20 flex flex-col sm:flex-row items-center gap-6 opacity-60 pb-4">
            <span className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Shield className="w-4 h-4" /> Pagos Procesados de Forma Segura
            </span>
            <div className="hidden sm:block h-4 w-px bg-slate-300" />
            <span className="text-sm font-medium text-slate-500">Cancela cuando quieras, sin amarras institucionales.</span>
          </div>
          {isInternational && (
            <div className="text-center opacity-60 pb-10">
              <span className="text-[10px] text-slate-500 font-medium">
                * Los cobros se procesarán en pesos chilenos (CLP). Tu banco aplicará la conversión a tu moneda local. (Tasa ref: $1 USD = $1000 CLP)
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
