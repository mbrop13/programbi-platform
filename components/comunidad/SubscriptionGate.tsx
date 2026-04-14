"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Shield, Lock, ArrowRight, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { communityPlans } from "@/lib/data/community_plans";
import AuthModal from "@/components/shared/AuthModal";

interface SubscriptionGateProps {
  onSubscribe?: (planId: string) => void;
  message?: string;
  isLoggedIn: boolean;
  isLoading?: boolean;
}

type BillingPeriod = 'mensual' | 'semestral' | 'anual';

export default function SubscriptionGate({ onSubscribe, message, isLoggedIn, isLoading = false }: SubscriptionGateProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("max");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('mensual');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

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
    <div className="w-full relative flex flex-col items-center px-4 overflow-hidden pt-4 pb-20 top-0" style={{ background: 'linear-gradient(to bottom, #ffffff, #f0f7ff)'}}>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="register"
      />

      {/* Decorative Orbs - Light Theme */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-purple-400/10 rounded-full blur-[100px] -z-10 pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-0 left-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none -translate-x-1/2" />

      <div className="max-w-4xl text-center mb-10 relative z-10">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 bg-white border border-blue-100 shadow-[0_2px_10px_rgba(59,130,246,0.1)] px-5 py-2.5 rounded-full mb-4 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-brand-blue" />
          <span className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 uppercase tracking-widest">
            Comunidad Premium
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl tracking-tight mb-4 leading-[1.1] text-slate-900"
        >
          {message ? (
             <span className="font-black">{message}</span>
          ) : (
             <>
               <span className="font-[family-name:var(--font-caveat)] text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight font-medium text-slate-800" style={{lineHeight: '1.2'}}>Desbloquea el poder de la Comunidad </span>
               <span className="font-display font-light text-brand-blue drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">ProgramBI</span>
             </>
          )}
        </motion.h1>
        
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.15 }}
           className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm px-4 py-1.5 rounded-full mb-6 mx-auto shadow-lg tracking-widest uppercase shadow-blue-500/25"
        >
          Pruébalo 7 días GRATIS
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-10"
        >
          Elige el plan que mejor se adapte a tus objetivos. Obtén acceso a nuestra plataforma interactiva, Asistente IA especializado y una red de profesionales de élite.
        </motion.p>

        {/* Frecuencia de Facturación (Pill Selector) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/80 backdrop-blur-md border border-slate-200 p-1.5 rounded-full inline-flex items-center mx-auto shadow-sm relative z-20"
        >
          <button 
            onClick={() => setBillingPeriod('mensual')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${billingPeriod === 'mensual' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Mensual
          </button>
          <div className="relative group">
            <button 
              onClick={() => setBillingPeriod('semestral')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingPeriod === 'semestral' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Semestral <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest hidden sm:inline-block">-10%</span>
            </button>
          </div>
          <div className="relative group">
            <button 
              onClick={() => setBillingPeriod('anual')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingPeriod === 'anual' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Anual <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest hidden sm:inline-block">-30%</span>
            </button>
            {/* Absolute badge for mobile if needed, but flex gap is fine */}
          </div>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch relative z-10">
        {communityPlans.map((plan, i) => {
          const isActive = selectedPlanId === plan.id;
          const compositePlanId = `${plan.id}_${billingPeriod}`;
          const isProcessing = loadingPlan === compositePlanId;

          // Calcular Descuentos Exclusivos Manuales
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
                  ? 'scale-105 z-20 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] border-blue-500 ring-2 ring-blue-500/20' 
                  : 'scale-95 hover:scale-100 z-10 border-slate-200 hover:border-slate-300 shadow-sm opacity-80 hover:opacity-100'
              }`}
            >
              
              <div className="relative z-10 w-full h-full flex flex-col p-6 lg:p-8 pt-10">

                {/* Highlight Badge */}
                {plan.highlight && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-blue-500/30 flex items-center gap-1.5 bg-blue-600 whitespace-nowrap"
                  >
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                    {plan.highlight}
                  </div>
                )}

                {/* Header */}
                <div className="mb-4 flex-grow-0">
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-2 tracking-tight">{plan.name}</h3>
                  <p className="text-slate-500 leading-snug text-xs md:text-sm font-medium">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="flex flex-col mb-6 flex-grow-0 pb-6 border-b border-gray-100">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">
                      ${(finalMonthlyPrice).toLocaleString("es-CL")}
                    </span>
                    <span className="text-slate-400 font-bold mb-1.5 text-sm">/mes</span>
                  </div>
                  {billingPeriod !== 'mensual' && (
                    <div className="mt-2 text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg inline-block self-start">
                      Facturado ${(totalBilledPrice).toLocaleString('es-CL')} cada {periodName}
                    </div>
                  )}
                  {billingPeriod === 'mensual' && (
                    <div className="mt-2 text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg inline-block self-start opacity-0">Spacer</div>
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
                      <div key={idx} className="flex gap-3 items-start">
                        {isCheck || isChat || isLive ? (
                           <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-amber-50">
                             {isCheck && <Check className="w-3 h-3 font-bold text-amber-500" />}
                             {isChat && <span className="text-[11px]">💬</span>}
                             {isLive && <span className="text-[11px]">🎓</span>}
                           </div>
                        ) : (
                          <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${plan.color}15` }}>
                            <Check className="w-3 h-3 font-bold" style={{ color: plan.color }} />
                          </div>
                        )}
                        <span className={`text-[13px] md:text-sm leading-snug ${isCheck || isChat || isLive ? 'text-[#0F172A] font-bold' : 'text-slate-600 font-medium'}`}>{cleanFeature}</span>
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
                    className={`w-full py-3.5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group relative overflow-hidden text-sm shadow-sm hover:shadow-md`}
                    style={{ 
                        backgroundColor: isActive ? '#3b82f6' : '#f1f5f9', // Blue-500 when active
                        color: isActive ? '#ffffff' : '#475569',
                        opacity: (isLoading || isProcessing) ? 0.7 : undefined,
                    }}
                    >
                    {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                    ) : (
                        <div className="flex flex-col items-center justify-center relative z-10 w-full">
                          <div className="flex items-center gap-2 justify-center w-full">
                            {plan.id === 'ultraplus' ? "Suscribirse Ahora" : "Iniciar Prueba Gratis"}
                            <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          </div>
                          {plan.id !== 'ultraplus' && (
                            <span className="text-[9px] font-medium opacity-80 mt-1 uppercase tracking-wider block text-center">7 días de acceso y sin cargos</span>
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

      <div className="mt-20 flex flex-col sm:flex-row items-center gap-6 opacity-60 pb-4">
        <span className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Shield className="w-4 h-4" /> Pagos Procesados de Forma Segura
        </span>
        <div className="hidden sm:block h-4 w-px bg-slate-300" />
        <span className="text-sm font-medium text-slate-500">Cancela cuando quieras, sin amarras institucionales.</span>
      </div>
    </div>
  );
}
