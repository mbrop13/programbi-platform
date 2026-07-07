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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-[#fcfdfe] w-full max-w-6xl rounded-[32px] overflow-hidden shadow-2xl z-10 my-8 border border-neutral-200/50"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-250 text-gray-500 hover:text-gray-900 transition-colors border-0 cursor-pointer z-20 shadow-sm"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Brand */}
            <div className="pt-12 pb-6 px-6 text-center flex flex-col items-center">
              {/* Brand Logo / Header Title */}
              <div className="flex items-center gap-1.5 mb-2 select-none">
                <Sparkles className="w-6 h-6 text-neutral-800" />
                <span className="font-extrabold text-xl text-neutral-900 uppercase tracking-widest">
                  ProgramBI Premium
                </span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-none mt-2">
                Pruébalo por <span className="text-orange-600 font-extrabold">$0.00</span> durante 7 días
              </h2>

              {/* User Type Switcher (Individual / Empresarial) */}
              <div className="mt-6 flex bg-neutral-100/90 p-0.5 rounded-full max-w-[240px] w-full border border-neutral-200/30">
                {(['individual', 'empresarial'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setUserType(type)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-full border-0 cursor-pointer transition-all uppercase tracking-wider
                      ${userType === type
                        ? 'bg-white text-neutral-900 shadow-sm font-extrabold'
                        : 'bg-transparent text-neutral-500 hover:text-neutral-900'}`}
                  >
                    {type === 'individual' ? 'Individual' : 'Empresarial'}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div className="px-8 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
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
                  ? "bg-neutral-200 hover:bg-neutral-300 text-neutral-800" 
                  : "bg-slate-900 hover:bg-slate-950 text-white";

                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-3xl p-6 border border-neutral-200/80 flex flex-col justify-between transition-all duration-300 relative shadow-sm hover:shadow-md
                      ${isCurrent ? 'opacity-85 bg-neutral-50/50 border-neutral-300' : ''}`}
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
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                          {plan.name}
                        </h3>
                      </div>

                      {/* Price Block */}
                      <div className="my-3 flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold text-neutral-950 tracking-tight">
                            {formatGeoPrice(finalMonthlyPrice)}
                          </span>
                          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                            /mes
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 font-medium leading-relaxed mb-6">
                        {plan.description}
                      </p>

                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-full text-xs font-bold border-0 cursor-not-allowed bg-neutral-200 text-neutral-500 mb-6"
                        >
                          Plan Actual
                        </button>
                      ) : isDowngrade ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-full text-xs font-bold border-0 cursor-not-allowed bg-neutral-100 text-neutral-400 mb-6"
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
                            <span className="text-[9px] font-bold text-neutral-400 block text-center mt-1.5 uppercase tracking-wider select-none">
                              7 días de acceso gratis
                            </span>
                          )}
                        </div>
                      )}

                      <div className="h-px bg-neutral-200/60 mb-6" />

                      {/* Features List */}
                      <ul className="space-y-4 p-0 m-0">
                        {plan.features.map((feature, idx) => {
                          const cleanFeature = feature.replace(/^✓\s*|^💬\s*|^🎓\s*/, "");
                          return (
                            <li key={idx} className="flex items-start gap-3 text-xs text-neutral-800 leading-normal list-none">
                              <div className="w-5.5 h-5.5 rounded-full border border-neutral-200 flex items-center justify-center shrink-0 mt-0.5 text-neutral-600 bg-neutral-50 shadow-sm">
                                <Check className="w-3.5 h-3.5 text-neutral-800 font-bold" />
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
            <div className="mt-2 mb-6 flex flex-col items-center gap-2 shrink-0">
              <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Ahorra con facturación anual (30% dto.)
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={billingCycle === "anual"}
                    onChange={(e) => setBillingCycle(e.target.checked ? "anual" : "mensual")}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-955"></div>
                </div>
              </label>
            </div>

            {/* Footer Notice */}
            <div className="bg-neutral-50 border-t border-neutral-200/60 py-4 px-6 text-center text-[10px] text-neutral-400 font-medium">
              Puedes cancelar tu suscripción en cualquier momento desde tu perfil con un solo clic. Sin contratos a largo plazo.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
