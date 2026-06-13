"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Bell, Loader2, CheckCircle, AlertCircle, Settings, Sliders, Globe, Lock, LogOut } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUserProfile } from "@/lib/supabase/comunidad";
import { getNewsletterSubscription, subscribeToNewsletter, unsubscribeFromNewsletter } from "@/lib/supabase/comunidad-ai";
import { useCountry } from "@/lib/context/CountryContext";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "profile" | "settings";
}

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
  { id: "ia", label: "Inteligencia Artificial (AI)" },
  { id: "economia", label: "Economía y Finanzas" },
  { id: "tecnologia", label: "Tecnología (Power BI, SQL, Python)" },
  { id: "general", label: "Cultura y General" },
];

export default function ProfileSettingsModal({ isOpen, onClose, defaultTab = "profile" }: ProfileSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "settings">(defaultTab);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Profile fields
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+56");
  const [showPrefixDropdown, setShowPrefixDropdown] = useState(false);

  // Settings / Subscription fields
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");

  const supabase = createClient();
  const { country: globalCountry } = useCountry();

  // Load default tab
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Load user data & subscription state
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoadingData(true);
      setError(null);
      setSuccess(null);

      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          setError("No se detectó un usuario activo.");
          setLoadingData(false);
          return;
        }

        setEmail(authUser.email || "");

        // Fetch custom profile details
        const profile = await getCurrentUserProfile();
        if (profile) {
          setFullName(profile.full_name || authUser.user_metadata?.full_name || "");
          
          // Split prefix and number if possible
          const rawPhone = profile.phone || authUser.user_metadata?.whatsapp || "";
          if (rawPhone) {
            const matchedCountry = COUNTRIES.slice()
              .sort((a, b) => b.code.length - a.code.length) // check longer codes first (+593 before +56)
              .find(c => rawPhone.startsWith(c.code));
            
            if (matchedCountry) {
              setPhonePrefix(matchedCountry.code);
              setWhatsapp(rawPhone.slice(matchedCountry.code.length));
            } else {
              setWhatsapp(rawPhone);
            }
          } else {
            // Default prefix to global country
            const matched = COUNTRIES.find(c => c.iso === globalCountry.iso);
            if (matched) setPhonePrefix(matched.code);
          }
        }

        // Fetch newsletter subscription
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

      } catch (err: any) {
        console.error("Error loading profile settings:", err);
        setError("Error al cargar los datos del perfil.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [isOpen, supabase, globalCountry.iso]);

  // Sync prefix if no whatsapp number is loaded yet
  useEffect(() => {
    if (!whatsapp) {
      const matched = COUNTRIES.find(c => c.iso === globalCountry.iso);
      if (matched) setPhonePrefix(matched.code);
    }
  }, [globalCountry.iso, whatsapp]);

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error("No hay una sesión iniciada");

      const cleanPhone = whatsapp.trim();
      const whatsappVal = cleanPhone ? `${phonePrefix}${cleanPhone}` : "";

      // 1. Update Profiles Table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: whatsappVal,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authUser.id);

      if (profileError) throw new Error(profileError.message);

      // 2. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          whatsapp: whatsappVal,
        }
      });

      if (authError) throw new Error(authError.message);

      // 3. Update Newsletter Subscription
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

      setSuccess("¡Configuración guardada exitosamente!");
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-[760px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10"
        >
          {/* Header Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors border-none cursor-pointer z-20"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col md:flex-row h-full min-h-[480px]">
            {/* Left Tab Sidebar */}
            <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r border-slate-100 flex flex-col justify-between">
              <div>
                <div className="mb-8 mt-2">
                  <h3 className="font-serif font-black text-xl text-slate-900 mb-1">Ajustes</h3>
                  <p className="text-xs text-slate-400">Gestiona tu perfil y suscripciones</p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border-none cursor-pointer text-left ${
                      activeTab === "profile"
                        ? "bg-white text-[#1890FF] shadow-sm"
                        : "text-slate-550 hover:bg-slate-100/50 hover:text-slate-800"
                    }`}
                  >
                    <User size={16} />
                    <span>Mi Perfil</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border-none cursor-pointer text-left ${
                      activeTab === "settings"
                        ? "bg-white text-[#1890FF] shadow-sm"
                        : "text-slate-550 hover:bg-slate-100/50 hover:text-slate-800"
                    }`}
                  >
                    <Bell size={16} />
                    <span>Suscripciones Blog</span>
                  </button>
                </div>
              </div>

              {/* Logged in indicator */}
              <div className="pt-6 border-t border-slate-200/50 mt-8 hidden md:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Sesión Activa</p>
                <p className="text-xs font-semibold text-slate-650 truncate max-w-full">{email}</p>
              </div>
            </div>

            {/* Right Panel Content */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              {loadingData ? (
                /* Skeleton Loader */
                <div className="flex flex-col justify-center items-center flex-1 py-12">
                  <Loader2 className="w-8 h-8 text-[#1890FF] animate-spin mb-4" />
                  <span className="text-sm text-slate-400 font-medium">Cargando datos...</span>
                </div>
              ) : (
                <form onSubmit={handleSave} className="flex flex-col justify-between flex-1">
                  {/* Tab Body */}
                  <div className="flex-1">
                    {/* Error / Success Banners */}
                    {error && (
                      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm mb-6">
                        <AlertCircle size={18} className="flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                    {success && (
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm mb-6">
                        <CheckCircle size={18} className="flex-shrink-0" />
                        <span>{success}</span>
                      </div>
                    )}

                    {activeTab === "profile" ? (
                      /* Tab 1: Profile */
                      <div className="space-y-5">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Información de Cuenta</h4>
                        </div>

                        {/* Initials & Info row */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1890FF] to-[#6366F1] flex items-center justify-center text-white font-serif font-black text-lg shadow-md shadow-blue-500/10">
                            {fullName ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : email ? email[0].toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-850 mb-0.5">{fullName || "Usuario de ProgramBI"}</p>
                            <p className="text-xs text-slate-400">Rol: Suscriptor de Comunidad</p>
                          </div>
                        </div>

                        {/* Email (Read Only) */}
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Correo Electrónico</label>
                          <div className="relative">
                            <input
                              type="email"
                              value={email}
                              disabled
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-sm focus:outline-none cursor-not-allowed"
                            />
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <span title="No editable por seguridad">
                              <Lock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            </span>
                          </div>
                        </div>

                        {/* Full Name */}
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Nombre Completo</label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:border-[#1890FF]/45 transition-colors"
                              placeholder="Juan Pérez"
                            />
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>

                        {/* WhatsApp / Phone */}
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">WhatsApp / Teléfono</label>
                          <div className="flex gap-2">
                            {/* Prefix selector */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setShowPrefixDropdown(!showPrefixDropdown)}
                                className="h-[40px] px-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center gap-1.5 focus:outline-none hover:bg-slate-50 cursor-pointer"
                              >
                                <img
                                  src={`https://flagcdn.com/w20/${COUNTRIES.find(c => c.code === phonePrefix)?.iso || "cl"}.png`}
                                  alt=""
                                  className="w-4 h-auto rounded-[2px]"
                                />
                                <span>{phonePrefix}</span>
                              </button>

                              {showPrefixDropdown && (
                                <>
                                  <div className="fixed inset-0 z-30" onClick={() => setShowPrefixDropdown(false)} />
                                  <div className="absolute top-[calc(100%+4px)] left-0 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-40 max-h-56 overflow-y-auto py-1">
                                    {COUNTRIES.map((country) => (
                                      <button
                                        key={country.iso}
                                        type="button"
                                        onClick={() => {
                                          setPhonePrefix(country.code);
                                          setShowPrefixDropdown(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 border-none cursor-pointer text-left"
                                      >
                                        <img src={`https://flagcdn.com/w20/${country.iso}.png`} alt="" className="w-4 h-auto rounded-[2px]" />
                                        <span>{country.name} ({country.code})</span>
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>

                            {/* WhatsApp number input */}
                            <div className="relative flex-1">
                              <input
                                type="tel"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:border-[#1890FF]/45 transition-colors"
                                placeholder="912345678"
                              />
                              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Tab 2: Subscription Settings */
                      <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-0.5">Suscripción al Blog</h4>
                            <p className="text-xs text-slate-400">Recibe resúmenes, guías y noticias exclusivas</p>
                          </div>
                          
                          {/* Main Subscription Switch */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSubscribed}
                              onChange={(e) => setIsSubscribed(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1890FF]"></div>
                          </label>
                        </div>

                        {isSubscribed ? (
                          /* Active subscription settings details */
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-5 pt-2"
                          >
                            {/* Categories checklist */}
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 block">Categorías de Interés</label>
                              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                                {CATEGORIES.map((cat) => {
                                  const checked = selectedCategories.includes(cat.id);
                                  return (
                                    <label key={cat.id} className="flex items-center gap-3.5 cursor-pointer py-1 select-none">
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleCategoryToggle(cat.id)}
                                        className="w-4 h-4 rounded border-slate-300 text-[#1890FF] focus:ring-[#1890FF]"
                                      />
                                      <span className="text-sm text-slate-650 font-medium">{cat.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Frequency selector */}
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Frecuencia de Envío</label>
                              <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:border-[#1890FF]/45 transition-colors"
                              >
                                <option value="weekly">Semanal (Recomendado - Todos los fines de semana)</option>
                                <option value="monthly">Mensual (Un súper resumen al mes)</option>
                                <option value="instant">Instantáneo (Cada vez que sale un artículo destacado)</option>
                              </select>
                            </div>
                          </motion.div>
                        ) : (
                          /* Unsubscribed explanation text */
                          <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Sliders className="w-8 h-8 text-slate-300 mx-auto mb-2.5" />
                            <p className="text-sm font-bold text-slate-700 mb-1">Te encuentras desuscrito del blog</p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                              No recibirás correos sobre nuevas entradas, tutoriales o análisis técnicos. Activa la casilla de arriba si deseas suscribirte de nuevo.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-3 pt-6 border-t border-slate-100 mt-6 justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold rounded-xl text-sm transition-colors border-none cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-brand-blue text-white font-bold rounded-xl text-sm hover:bg-blue-600 transition-colors border-none cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <span>Guardar Cambios</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
