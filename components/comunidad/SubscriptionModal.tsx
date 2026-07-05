"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Star, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { communityPlans } from "@/lib/data/community_plans";
import { useGeoPricing } from "@/hooks/useGeoPricing";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId?: string | null;
}

export default function SubscriptionModal({ isOpen, onClose, currentPlanId = null }: SubscriptionModalProps) {
  const [billingCycle, setBillingCycle] = useState<'mensual' | 'semestral' | 'anual'>('mensual');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { isInternational, formatGeoPrice } = useGeoPricing();

  const handleAction = async (planId: string) => {
    setLoadingPlan(planId);
    try {
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
    } catch (err) {
      alert("Error redirigiendo a la pasarela de pagos.");
      setLoadingPlan(null);
    }
  };

  const getPlanHierarchy = (planId: string): number => {
    switch (planId) {
      case "pro": return 1;
      case "max": return 2;
      case "ultra": return 3;
      case "ultraplus": return 4;
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
            className="relative bg-[#f8f9fb] w-full max-w-6xl rounded-[32px] overflow-hidden shadow-2xl z-10 my-8 border border-white"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors border-0 cursor-pointer shadow-sm z-20"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Brand */}
            <div className="pt-10 pb-6 px-6 text-center flex flex-col items-center">
              <div className="h-10 relative w-44 mb-3">
                <img
                  src="https://cdn.shopify.com/s/files/1/0564/3812/8712/files/logo-03_b7b98699-bd18-46ee-8b1b-31885a2c4c62.png?v=1766816974"
                  alt="ProgramBI"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
                {hasAnyPlan ? "Mejora tu Plan de Membresía" : "Pruébalo gratis por $0.00 durante 7 días"}
              </h2>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                {hasAnyPlan ? "Sube al siguiente nivel y desbloquea más beneficios exclusivos." : "Desbloquea los cursos y acelera tu especialización profesional en datos."}
              </p>

              {/* Billing Cycle Switcher */}
              <div className="mt-6 flex bg-white border border-gray-150 p-1 rounded-full shadow-sm max-w-md w-full">
                {(['mensual', 'semestral', 'anual'] as const).map((cycle) => (
                  <button
                    key={cycle}
                    onClick={() => setBillingCycle(cycle)}
                    className={`flex-1 py-2 text-xs font-black rounded-full border-0 cursor-pointer transition-all uppercase tracking-wider
                      ${billingCycle === cycle
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'bg-transparent text-gray-500 hover:text-gray-900'}`}
                  >
                    {cycle}
                    {cycle === 'semestral' && (
                      <span className="ml-1 text-[9px] bg-emerald-100 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded-full lowercase">
                        -10%
                      </span>
                    )}
                    {cycle === 'anual' && (
                      <span className="ml-1 text-[9px] bg-blue-100 text-blue-700 font-extrabold px-1.5 py-0.5 rounded-full lowercase">
                        -30%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div className="px-6 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {communityPlans.map((plan, i) => {
                const planHierarchy = getPlanHierarchy(plan.id);
                const isCurrent = currentPlanId === plan.id;
                const isDowngrade = currentHierarchy > planHierarchy;
                
                // Pricing calculation matching SubscriptionGate.tsx
                let periodName = "mes";
                let monthsCount = 1;
                let totalBilledPrice = plan.price;

                if (billingCycle === 'semestral') {
                  periodName = "semestre";
                  monthsCount = 6;
                  totalBilledPrice = plan.priceSemiannual || (plan.price * 6 * 0.9);
                }
                if (billingCycle === 'anual') {
                  periodName = "año";
                  monthsCount = 12;
                  totalBilledPrice = plan.priceAnnual || (plan.price * 12 * 0.7);
                }

                const finalMonthlyPrice = Math.round(totalBilledPrice / monthsCount);
                const compositePlanId = `${plan.id}_${billingCycle}`;
                const isProcessing = loadingPlan === compositePlanId;

                return (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 relative shadow-sm
                      ${isCurrent ? 'opacity-85 bg-gray-50/50 border-gray-300 ring-2 ring-gray-300/10' : 'border-gray-200 hover:border-blue-400'}`}
                  >
                    {/* Badge */}
                    {plan.highlight && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="bg-amber-100/90 backdrop-blur-sm text-amber-800 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-amber-200">
                          {plan.highlight}
                        </span>
                      </div>
                    )}

                    {/* Top Info */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                          {plan.name}
                        </h3>
                        {plan.id === 'ultra' || plan.id === 'ultraplus' ? (
                          <Sparkles className="w-5 h-5 text-violet-600" />
                        ) : (
                          <Star className="w-5 h-5 text-brand-blue" />
                        )}
                      </div>

                      {/* Price Block */}
                      <div className="my-4 flex items-baseline">
                        <span className="text-3xl font-black text-gray-950 tracking-tight">
                          {formatGeoPrice(finalMonthlyPrice)}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          /mes
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                        {plan.description}
                      </p>

                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full py-3 rounded-xl text-xs font-black border-0 cursor-not-allowed transition-all bg-gray-200 text-gray-500 mb-6"
                        >
                          Plan Actual
                        </button>
                      ) : isDowngrade ? (
                        <button
                          disabled
                          className="w-full py-3 rounded-xl text-xs font-black border-0 cursor-not-allowed transition-all bg-gray-100 text-gray-400 mb-6"
                        >
                          No disponible
                        </button>
                      ) : (
                        <div className="mb-6">
                          <button
                            onClick={() => handleAction(compositePlanId)}
                            disabled={isProcessing}
                            className="w-full py-3 rounded-xl text-xs font-black border-0 cursor-pointer transition-all active:scale-[0.98] bg-slate-950 hover:bg-slate-900 text-white flex items-center justify-center gap-1.5"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                {hasAnyPlan ? "Mejorar Plan" : (plan.id === 'ultraplus' ? "Suscribirse Ahora" : "Aprovechar oferta")}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                          {!hasAnyPlan && plan.id !== 'ultraplus' && (
                            <span className="text-[9px] font-bold text-gray-400 block text-center mt-1 uppercase tracking-wider">
                              7 días de acceso gratis
                            </span>
                          )}
                        </div>
                      )}

                      <div className="h-px bg-gray-100 mb-6" />

                      {/* Features List */}
                      <ul className="space-y-4 p-0 m-0">
                        {plan.features.map((feature, idx) => {
                          const cleanFeature = feature.replace(/^✓\s*|^💬\s*|^🎓\s*/, "");
                          return (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-normal list-none">
                              <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-150 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3.5 h-3.5 text-gray-800 font-black" />
                              </div>
                              <span className="flex-1 font-medium">{cleanFeature}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Notice */}
            <div className="bg-slate-50 border-t border-gray-100 py-4 px-6 text-center text-[10px] text-gray-400 font-medium">
              Puedes cancelar tu suscripción en cualquier momento desde tu perfil con un solo clic. Sin contratos a largo plazo.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
