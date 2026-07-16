"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Bell,
  Loader2,
  CheckCircle,
  AlertCircle,
  Lock,
  Newspaper,
  Sparkles,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, FormEvent, type ElementType } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUserProfile } from "@/lib/supabase/comunidad";
import {
  getNewsletterSubscription,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
} from "@/lib/supabase/comunidad-ai";
import { useCountry } from "@/lib/context/CountryContext";
import { cn } from "@/lib/utils";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "profile" | "settings";
}

type SettingsTab = "cuenta" | "blog";

const COUNTRIES = [
  { code: "+56", iso: "cl", name: "Chile" },
  { code: "+52", iso: "mx", name: "México" },
  { code: "+54", iso: "ar", name: "Argentina" },
  { code: "+57", iso: "co", name: "Colombia" },
  { code: "+51", iso: "pe", name: "Perú" },
  { code: "+593", iso: "ec", name: "Ecuador" },
  { code: "+507", iso: "pa", name: "Panamá" },
  { code: "+58", iso: "ve", name: "Venezuela" },
  { code: "+598", iso: "uy", name: "Uruguay" },
  { code: "+595", iso: "py", name: "Paraguay" },
  { code: "+591", iso: "bo", name: "Bolivia" },
  { code: "+502", iso: "gt", name: "Guatemala" },
  { code: "+506", iso: "cr", name: "Costa Rica" },
  { code: "+503", iso: "sv", name: "El Salvador" },
  { code: "+504", iso: "hn", name: "Honduras" },
  { code: "+505", iso: "ni", name: "Nicaragua" },
  { code: "+1", iso: "do", name: "Rep. Dominicana" },
  { code: "+34", iso: "es", name: "España" },
  { code: "+1", iso: "us", name: "EE.UU." },
];

const CATEGORIES = [
  { id: "ia", label: "Inteligencia Artificial", desc: "IA aplicada a datos y negocio" },
  { id: "economia", label: "Economía y Finanzas", desc: "Análisis de mercados y finanzas" },
  { id: "tecnologia", label: "Tecnología", desc: "Power BI, SQL, Python y más" },
  { id: "general", label: "Cultura y General", desc: "Contenido transversal y novedades" },
];

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  defaultTab = "profile",
}: ProfileSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    defaultTab === "settings" ? "blog" : "cuenta"
  );
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+56");
  const [showPrefixDropdown, setShowPrefixDropdown] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");

  const supabase = createClient();
  const { country: globalCountry } = useCountry();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab === "settings" ? "blog" : "cuenta");
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoadingData(true);
      setError(null);
      setSuccess(null);

      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) {
          setError("No se detectó un usuario activo.");
          setLoadingData(false);
          return;
        }

        setEmail(authUser.email || "");

        const profile = await getCurrentUserProfile();
        if (profile) {
          setFullName(profile.full_name || authUser.user_metadata?.full_name || "");

          const rawPhone = profile.phone || authUser.user_metadata?.whatsapp || "";
          if (rawPhone) {
            const matchedCountry = COUNTRIES.slice()
              .sort((a, b) => b.code.length - a.code.length)
              .find((c) => rawPhone.startsWith(c.code));

            if (matchedCountry) {
              setPhonePrefix(matchedCountry.code);
              setWhatsapp(rawPhone.slice(matchedCountry.code.length));
            } else {
              setWhatsapp(rawPhone);
            }
          } else {
            const matched = COUNTRIES.find((c) => c.iso === globalCountry.iso);
            if (matched) setPhonePrefix(matched.code);
          }
        }

        const sub = await getNewsletterSubscription();
        if (sub) {
          setIsSubscribed(sub.is_active);
          setSelectedCategories(sub.categories || []);
          setFrequency(sub.frequency || "weekly");
        } else {
          setIsSubscribed(false);
          setSelectedCategories(["ia", "economia", "tecnologia", "general"]);
          setFrequency("weekly");
        }
      } catch (err) {
        console.error("Error loading profile settings:", err);
        setError("Error al cargar los datos del perfil.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [isOpen, supabase, globalCountry.iso]);

  useEffect(() => {
    if (!whatsapp) {
      const matched = COUNTRIES.find((c) => c.iso === globalCountry.iso);
      if (matched) setPhonePrefix(matched.code);
    }
  }, [globalCountry.iso, whatsapp]);

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSave = async (e?: FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) throw new Error("No hay una sesión iniciada");

      const cleanPhone = whatsapp.trim();
      const whatsappVal = cleanPhone ? `${phonePrefix}${cleanPhone}` : "";

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: whatsappVal,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authUser.id);

      if (profileError) throw new Error(profileError.message);

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          whatsapp: whatsappVal,
        },
      });

      if (authError) throw new Error(authError.message);

      if (isSubscribed) {
        if (selectedCategories.length === 0) {
          throw new Error("Debes elegir al menos una categoría si estás suscrito al blog.");
        }
        await subscribeToNewsletter({
          categories: selectedCategories,
          frequency,
        });
      } else {
        await unsubscribeFromNewsletter();
      }

      setSuccess("Configuración guardada correctamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ocurrió un error al guardar los cambios.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email
      ? email[0].toUpperCase()
      : "U";

  const tabs: { id: SettingsTab; label: string; icon: ElementType; desc: string }[] = [
    { id: "cuenta", label: "Cuenta", icon: User, desc: "Perfil y datos de contacto" },
    { id: "blog", label: "Blog y alertas", icon: Bell, desc: "Suscripción y preferencias" },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="relative bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] border border-neutral-100 z-10"
        >
          {/* ─── Sidebar ─── */}
          <div className="w-full md:w-[240px] bg-neutral-50/50 border-r border-neutral-100 p-5 shrink-0 flex flex-col justify-between">
            <div>
              <div className="mb-6 px-1">
                <h3 className="font-display font-black text-slate-900 text-lg tracking-tight">
                  Ajustes
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Perfil y preferencias</p>
              </div>

              <div className="flex flex-col gap-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full text-left px-3.5 py-2.5 rounded-xl transition-all text-[13px] flex items-center gap-3 cursor-pointer border-0 font-medium select-none",
                        isActive
                          ? "bg-neutral-100 text-slate-900"
                          : "text-slate-500 bg-transparent hover:bg-neutral-100/50 hover:text-slate-900"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-[18px] h-[18px] shrink-0",
                          isActive ? "text-slate-800" : "text-slate-400"
                        )}
                      />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 mt-8 hidden md:block">
              <div className="flex items-center gap-3 px-1.5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-800 truncate leading-snug">
                    {fullName || "Usuario"}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate leading-none mt-0.5">
                    {email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Content ─── */}
          <div className="flex-1 overflow-y-auto flex flex-col justify-between p-6 sm:p-8 bg-white min-h-[400px]">
            <div>
              <div className="flex items-center justify-between mb-6 pb-2">
                <div>
                  <h2 className="font-display font-black text-xl text-slate-900 tracking-tight">
                    {activeTab === "cuenta" ? "Cuenta" : "Blog y alertas"}
                  </h2>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    {activeTab === "cuenta"
                      ? "Perfil y datos de membresía"
                      : "Preferencias del newsletter y notificaciones"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-slate-500 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>

              {loadingData ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <span className="text-xs text-slate-400 font-bold">Cargando datos...</span>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[13px] mb-5">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span className="font-medium">{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-[13px] mb-5">
                      <CheckCircle size={16} className="flex-shrink-0" />
                      <span className="font-medium">{success}</span>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {activeTab === "cuenta" && (
                      <motion.div
                        key="cuenta"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-5"
                      >
                        {/* Avatar + identity row */}
                        <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm select-none">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[14px] text-slate-800 truncate">
                              {fullName || "Usuario de ProgramBI"}
                            </div>
                            <div className="text-[12px] text-slate-400 truncate mt-0.5">
                              {email}
                            </div>
                          </div>
                        </div>

                        {/* Email (read-only) */}
                        <div className="flex items-start justify-between gap-4 py-1">
                          <div className="flex items-start gap-3.5 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-slate-500 shrink-0">
                              <Mail className="w-[18px] h-[18px]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-[13px] text-slate-800">
                                Correo electrónico
                              </div>
                              <div className="relative mt-2">
                                <input
                                  type="email"
                                  value={email}
                                  disabled
                                  className="w-full pl-3 pr-9 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-slate-400 text-[13px] focus:outline-none cursor-not-allowed"
                                />
                                <Lock
                                  size={13}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1.5">
                                No editable por seguridad
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Full name */}
                        <div className="flex items-start gap-3.5 py-1">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-indigo-500 shrink-0">
                            <User className="w-[18px] h-[18px]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-[13px] text-slate-800">
                              Nombre completo
                            </div>
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full mt-2 px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-slate-800 text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                              placeholder="Juan Pérez"
                            />
                          </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex items-start gap-3.5 py-1">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-emerald-600 shrink-0">
                            <Phone className="w-[18px] h-[18px]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-[13px] text-slate-800">
                              WhatsApp / Teléfono
                            </div>
                            <div className="flex gap-2 mt-2">
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowPrefixDropdown(!showPrefixDropdown)}
                                  className="h-[42px] px-3 rounded-xl border border-neutral-200 bg-white text-slate-700 text-[13px] font-semibold flex items-center gap-1.5 focus:outline-none hover:bg-neutral-50 cursor-pointer"
                                >
                                  <img
                                    src={`https://flagcdn.com/w20/${
                                      COUNTRIES.find((c) => c.code === phonePrefix)?.iso || "cl"
                                    }.png`}
                                    alt=""
                                    className="w-4 h-auto rounded-[2px]"
                                  />
                                  <span>{phonePrefix}</span>
                                  <ChevronDown size={12} className="text-slate-400" />
                                </button>

                                {showPrefixDropdown && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-30"
                                      onClick={() => setShowPrefixDropdown(false)}
                                    />
                                    <div className="absolute top-[calc(100%+4px)] left-0 w-52 bg-white border border-neutral-100 rounded-xl shadow-xl z-40 max-h-56 overflow-y-auto py-1">
                                      {COUNTRIES.map((country) => (
                                        <button
                                          key={country.iso}
                                          type="button"
                                          onClick={() => {
                                            setPhonePrefix(country.code);
                                            setShowPrefixDropdown(false);
                                          }}
                                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-neutral-50 border-none cursor-pointer text-left bg-transparent"
                                        >
                                          <img
                                            src={`https://flagcdn.com/w20/${country.iso}.png`}
                                            alt=""
                                            className="w-4 h-auto rounded-[2px]"
                                          />
                                          <span>
                                            {country.name} ({country.code})
                                          </span>
                                        </button>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>

                              <input
                                type="tel"
                                value={whatsapp}
                                onChange={(e) =>
                                  setWhatsapp(e.target.value.replace(/\D/g, ""))
                                }
                                className="flex-1 px-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-slate-800 text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                                placeholder="912345678"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Account type row */}
                        <div className="flex items-center justify-between gap-4 py-4 border-t border-neutral-100">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-slate-600 shrink-0">
                              <Shield className="w-[18px] h-[18px]" />
                            </div>
                            <div>
                              <div className="font-bold text-[13px] text-slate-800">
                                Cuenta de ProgramBI
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Acceso a la plataforma y comunidad
                              </div>
                            </div>
                          </div>
                          <span className="bg-neutral-100 text-slate-600 font-semibold px-3 py-1.5 rounded-full text-[11px] shrink-0">
                            Estudiante
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "blog" && (
                      <motion.div
                        key="blog"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-5"
                      >
                        {/* Main subscription toggle */}
                        <div className="flex items-center justify-between gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                isSubscribed ? "bg-indigo-50 text-indigo-600" : "bg-neutral-100 text-neutral-400"
                              )}
                            >
                              <Newspaper className="w-[18px] h-[18px]" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[13px] text-slate-800">
                                Suscripción al blog
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Resúmenes, guías y noticias exclusivas
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsSubscribed(!isSubscribed)}
                            className={cn(
                              "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 border-0 cursor-pointer",
                              isSubscribed ? "bg-indigo-600" : "bg-neutral-300"
                            )}
                            aria-label="Activar o desactivar suscripción"
                          >
                            <motion.div
                              animate={{ x: isSubscribed ? 22 : 2 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                          </button>
                        </div>

                        {isSubscribed ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-5"
                          >
                            <div>
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                                Categorías de interés
                              </div>
                              <div className="space-y-2">
                                {CATEGORIES.map((cat) => {
                                  const checked = selectedCategories.includes(cat.id);
                                  return (
                                    <button
                                      key={cat.id}
                                      type="button"
                                      onClick={() => handleCategoryToggle(cat.id)}
                                      className={cn(
                                        "w-full flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all text-left cursor-pointer",
                                        checked
                                          ? "bg-indigo-50/60 border-indigo-200"
                                          : "bg-white border-neutral-100 hover:border-neutral-200"
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                                          checked
                                            ? "bg-indigo-600 border-indigo-600"
                                            : "border-neutral-300 bg-white"
                                        )}
                                      >
                                        {checked && (
                                          <CheckCircle className="w-3 h-3 text-white" />
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <div className="text-[13px] font-semibold text-slate-800">
                                          {cat.label}
                                        </div>
                                        <div className="text-[11px] text-slate-400 mt-0.5">
                                          {cat.desc}
                                        </div>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div>
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Frecuencia de envío
                              </div>
                              <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-slate-800 text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer"
                              >
                                <option value="weekly">
                                  Semanal (recomendado — fines de semana)
                                </option>
                                <option value="monthly">
                                  Mensual (un resumen al mes)
                                </option>
                                <option value="instant">
                                  Instantáneo (cada artículo destacado)
                                </option>
                              </select>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="text-center py-10 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-[13px] font-bold text-slate-700 mb-1">
                              Estás desuscrito del blog
                            </p>
                            <p className="text-[12px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                              No recibirás correos sobre nuevas entradas, tutoriales o análisis.
                              Activa el interruptor de arriba para suscribirte.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Footer actions + premium banner */}
            {!loadingData && (
              <div className="mt-8 space-y-4 shrink-0">
                <div className="flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-slate-700 font-semibold rounded-xl text-[13px] transition-colors border-0 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave()}
                    disabled={saving}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-[13px] transition-colors border-0 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <span>Guardar cambios</span>
                    )}
                  </button>
                </div>

                <div className="p-5 bg-slate-950 rounded-2xl relative overflow-hidden flex items-center justify-between border border-white/10 shadow-lg">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_60%)] pointer-events-none" />

                  <div className="relative z-10 flex items-center gap-3 min-w-0">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white">ProgramBI Premium</div>
                      <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                        Cursos, IA integrada y asesorías en directo.
                      </div>
                    </div>
                  </div>

                  <a
                    href="/comunidad"
                    className="relative z-10 bg-white hover:bg-neutral-100 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer border-0 select-none shadow-sm no-underline shrink-0"
                  >
                    Ver planes
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
