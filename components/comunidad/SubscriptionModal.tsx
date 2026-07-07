"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { communityPlans } from "@/lib/data/community_plans";
import { useGeoPricing } from "@/hooks/useGeoPricing";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId?: string | null;
}

export default function SubscriptionModal({ isOpen, onClose, currentPlanId = null }: SubscriptionModalProps) {
  const [billingCycle, setBillingCycle] = useState<'mensual' | 'anual'>('mensual');
  const [userType, setUserType] = useState<'individual' | 'empresarial'>('individual');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { formatGeoPrice } = useGeoPricing();

  const handleAction = async (planId: string) => {
    setLoadingPlan(planId);
    try {
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
    } catch {
      alert("Error redirigiendo a la pasarela de pagos.");
      setLoadingPlan(null);
    }
  };

  const getPlanHierarchy = (planId: string): number => {
    switch (planId) {
      case "pro": return 1;
      case "max": return 2;
      case "ultra": return 3;
      default: return 0;
    }
  };

  const hasAnyPlan = !!currentPlanId;
  const currentHierarchy = currentPlanId ? getPlanHierarchy(currentPlanId) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] bg-white dark:bg-black w-screen h-screen overflow-y-auto flex flex-col"
        >
          {/* Close button (top right of screen) */}
          <button
            onClick={onClose}
            className="fixed top-6 right-6 sm:top-8 sm:right-8 w-11 h-11 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors border-0 cursor-pointer shadow-sm z-50"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Fullscreen Wrapper Centered Content */}
          <div className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-8 py-16 flex flex-col justify-center">
            
            {/* Header / Brand */}
            <div className="pb-8 px-6 text-center flex flex-col items-center select-none">
              {/* Brand Logo / Header Title */}
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
                <span className="font-extrabold text-xl text-neutral-900 dark:text-white uppercase tracking-widest">
                  ProgramBI Premium
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight leading-none mt-2">
                Pruébalo por <span className="text-orange-600 font-extrabold">$0.00</span> durante 7 días
              </h2>

              {/* User Type Switcher (Individual / Empresarial) */}
              <div className="mt-6 flex bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-full max-w-[240px] w-full border border-neutral-200/30 dark:border-neutral-800/40">
                {(['individual', 'empresarial'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setUserType(type)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-full border-0 cursor-pointer transition-all uppercase tracking-wider
                      ${userType === type
                        ? 'bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white shadow-sm font-extrabold'
                        : 'bg-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'}`}
                  >
                    {type === 'individual' ? 'Individual' : 'Empresarial'}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch w-full">
              {communityPlans.map((plan) => {
                const planHierarchy = getPlanHierarchy(plan.id);
                const isCurrent = currentPlanId === plan.id;
                const isDowngrade = currentHierarchy > planHierarchy;
                
                // Pricing calculations
                let monthsCount = 1;
                let totalBilledPrice = plan.price;

                if (billingCycle === 'anual') {
                  monthsCount = 12;
                  totalBilledPrice = plan.priceAnnual || (plan.price * 12 * 0.7);
                }

                const finalMonthlyPrice = Math.round(totalBilledPrice / monthsCount);
                const compositePlanId = `${plan.id}_${billingCycle}`;
                const isProcessing = loadingPlan === compositePlanId;

                // Color configuration matching the mockup style
                // Lite (gray button), Grok (black button), Grok Heavy (black button with promo badge)
                const isLite = plan.id === "pro";
                const buttonBg = isLite 
                  ? "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200" 
                  : "bg-slate-900 hover:bg-slate-950 dark:bg-white dark:text-black dark:hover:bg-neutral-100 text-white";

                return (
                  <div
                    key={plan.id}
                    className={`bg-white dark:bg-neutral-950 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col justify-between transition-all duration-300 relative shadow-sm hover:shadow-md
                      ${isCurrent ? 'opacity-85 bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-300 dark:border-neutral-700' : ''}`}
                  >
                    {/* Badge */}
                    {plan.highlight && (
                      <div className="absolute -top-3 right-6">
                        <span className="bg-orange-500/10 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-orange-200/20 shadow-sm select-none">
                          {plan.highlight}
                        </span>
                      </div>
                    )}

                    {/* Top Info */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                          {plan.name}
                        </h3>
                      </div>

                      {/* Price Block */}
                      <div className="my-3 flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold text-neutral-955 dark:text-white tracking-tight">
                            {formatGeoPrice(finalMonthlyPrice)}
                          </span>
                          <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                            /mes
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed mb-6">
                        {plan.description}
                      </p>

                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-full text-xs font-bold border-0 cursor-not-allowed bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-450 mb-6"
                        >
                          Plan Actual
                        </button>
                      ) : isDowngrade ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-full text-xs font-bold border-0 cursor-not-allowed bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 mb-6"
                        >
                          No disponible
                        </button>
                      ) : (
                        <div className="mb-6">
                          <button
                            onClick={() => handleAction(compositePlanId)}
                            disabled={isProcessing}
                            className={`w-full py-2.5 rounded-full text-xs font-bold border-0 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm ${buttonBg}`}
                          >
                            {isProcessing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                {hasAnyPlan ? "Mejorar Plan" : (plan.id === 'ultra' ? "Suscribirse" : "Aprovechar oferta")}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                          {!hasAnyPlan && plan.id !== 'ultra' && (
                            <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 block text-center mt-1.5 uppercase tracking-wider select-none">
                              7 días de acceso gratis
                            </span>
                          )}
                        </div>
                      )}

                      <div className="h-px bg-neutral-200/60 dark:bg-neutral-800/80 mb-6" />

                      {/* Features List */}
                      <ul className="space-y-4 p-0 m-0">
                        {plan.features.map((feature, idx) => {
                          const cleanFeature = feature.replace(/^✓\s*|^💬\s*|^🎓\s*/, "");
                          return (
                            <li key={idx} className="flex items-start gap-3 text-xs text-neutral-800 dark:text-neutral-300 leading-normal list-none">
                              <div className="w-5.5 h-5.5 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0 mt-0.5 text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 shadow-sm">
                                <Check className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200 font-bold" />
                              </div>
                              <span className="flex-1 font-semibold">{cleanFeature}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Toggle Switcher */}
            <div className="mt-8 flex flex-col items-center gap-2 shrink-0 select-none">
              <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Ahorra con facturación anual (30% dto.)
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={billingCycle === "anual"}
                    onChange={(e) => setBillingCycle(e.target.checked ? "anual" : "mensual")}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-neutral-200 dark:bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 dark:after:border-neutral-600 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950 dark:peer-checked:bg-neutral-100"></div>
                </div>
              </label>
            </div>

          </div>

          {/* Footer Notice */}
          <div className="bg-neutral-50 dark:bg-neutral-900/40 border-t border-neutral-200/60 dark:border-neutral-800/80 py-6 px-6 text-center text-[10px] text-neutral-400 dark:text-neutral-500 font-medium select-none mt-auto">
            Puedes cancelar tu suscripción en cualquier momento desde tu perfil con un solo clic. Sin contratos a largo plazo.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
