"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, Zap, Shield, HelpCircle, Star } from "lucide-react";
import Image from "next/image";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [billingCycle, setBillingCycle] = useState<'mensual' | 'semestral' | 'anual'>('mensual');

  // Pricing plans configuration
  const plans = [
    {
      name: "ProgramBI Lite",
      badge: null,
      description: "Acceso básico para dar tus primeros pasos en datos",
      prices: {
        mensual: { usd: 15, clp: "14.500" },
        semestral: { usd: 12, clp: "11.600" },
        anual: { usd: 9, clp: "8.700" }
      },
      buttonText: "Mejorar a Lite",
      features: [
        "Acceso a 2 cursos simultáneos",
        "Chats limitados con Mentor IA (50 al mes)",
        "Certificados digitales estándar",
        "Soporte básico por foro comunitario",
        "Descarga de archivos de lección básica"
      ],
      icon: Zap,
      color: "text-slate-500",
      borderClass: "border-gray-200",
      buttonClass: "bg-gray-100 hover:bg-gray-200 text-gray-800"
    },
    {
      name: "ProgramBI Pro",
      badge: "Oferta por tiempo limitado",
      description: "Acceso ilimitado a todas las herramientas profesionales",
      prices: {
        mensual: { usd: 29, clp: "28.000" },
        semestral: { usd: 22, clp: "21.200" },
        anual: { usd: 18, clp: "17.400" }
      },
      buttonText: "Aprovechar oferta de $0.00",
      features: [
        "Acceso ILIMITADO a los 4 cursos (Power BI, Python, SQL, Excel)",
        "Chats con IA ilimitados en modo Experto",
        "Descarga ilimitada de recursos y archivos de clase",
        "Certificaciones profesionales oficiales de ProgramBI",
        "Acceso inmediato a tutorías grupales semanales",
        "Proyectos integradores reales con feedback"
      ],
      icon: Star,
      color: "text-brand-blue",
      borderClass: "border-brand-blue ring-2 ring-brand-blue/10",
      buttonClass: "bg-slate-950 hover:bg-slate-900 text-white shadow-lg",
      highlighted: true
    },
    {
      name: "ProgramBI Expert",
      badge: "67% de descuento por 3 meses",
      description: "Mentoría 1-a-1 y acompañamiento profesional premium",
      prices: {
        mensual: { usd: 79, clp: "76.000" },
        semestral: { usd: 59, clp: "57.000" },
        anual: { usd: 49, clp: "47.000" }
      },
      buttonText: "Aprovechar oferta Expert",
      features: [
        "Todo lo de Pro + Consultoría 1-a-1 (30 min semanales)",
        "Revisión y auditoría de código de proyectos",
        "Acceso a clases y bootcamps exclusivos en vivo",
        "Certificado Expert firmado por Manuel Ropero",
        "Canal exclusivo de WhatsApp 24/7 con mentores"
      ],
      icon: Sparkles,
      color: "text-violet-600",
      borderClass: "border-violet-200 hover:border-violet-400",
      buttonClass: "bg-slate-950 hover:bg-slate-900 text-white"
    }
  ];

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
            className="relative bg-[#f8f9fb] w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl z-10 my-8 border border-white"
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
                Pruébalo gratis por $0.00 durante 7 días
              </h2>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                Desbloquea los 4 cursos y acelera tu especialización profesional en datos.
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
                    {cycle === 'anual' && (
                      <span className="ml-1 text-[9px] bg-green-100 text-green-700 font-extrabold px-1.5 py-0.5 rounded-full lowercase">
                        -35%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan Cards Grid */}
            <div className="px-6 pb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {plans.map((plan, i) => {
                const currentPrice = plan.prices[billingCycle];
                const Icon = plan.icon;
                return (
                  <div
                    key={i}
                    className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 relative
                      ${plan.borderClass}
                      ${plan.highlighted ? 'shadow-md md:scale-[1.02]' : 'shadow-sm'}`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="bg-amber-100/90 backdrop-blur-sm text-amber-800 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-amber-200">
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    {/* Top Info */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                          {plan.name}
                        </h3>
                        <Icon className={`w-5 h-5 ${plan.color}`} />
                      </div>

                      {/* Price Block */}
                      <div className="my-4 flex items-baseline">
                        <span className="text-4xl font-black text-gray-950 tracking-tight">
                          ${currentPrice.usd}
                        </span>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1.5">
                          USD/mes
                        </span>
                        <span className="text-xs text-gray-400 ml-2 font-medium">
                          (~${currentPrice.clp} CLP)
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                        {plan.description}
                      </p>

                      <button
                        onClick={onClose}
                        className={`w-full py-3 rounded-xl text-xs font-black border-0 cursor-pointer transition-all active:scale-[0.98] mb-6 ${plan.buttonClass}`}
                      >
                        {plan.buttonText}
                      </button>

                      <div className="h-px bg-gray-100 mb-6" />

                      {/* Features List */}
                      <ul className="space-y-4 p-0 m-0">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 leading-normal list-none">
                            <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-150 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5 text-gray-800 font-black" />
                            </div>
                            <span className="flex-1 font-medium">{feature}</span>
                          </li>
                        ))}
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
