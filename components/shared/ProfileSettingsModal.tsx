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
  Globe,
  Settings2,
  LayoutDashboard,
  BookOpen,
  LifeBuoy,
  ExternalLink,
  Database,
  AlertTriangle,
  Sun,
  Languages,
  Calendar,
  Radio,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
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

type SettingsTab =
  | "cuenta"
  | "blog"
  | "region"
  | "preferencias"
  | "accesos"
  | "privacidad";

const PREFS_KEY = "programbi_platform_prefs";

const PHONE_COUNTRIES = [
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

type PlatformPrefs = {
  courseReminders: boolean;
  webinarAlerts: boolean;
  promoEmails: boolean;
  productUpdates: boolean;
  reducedMotion: boolean;
};

const DEFAULT_PREFS: PlatformPrefs = {
  courseReminders: true,
  webinarAlerts: true,
  promoEmails: false,
  productUpdates: true,
  reducedMotion: false,
};

function loadPrefs(): PlatformPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs: PlatformPrefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 border-0 cursor-pointer",
        checked ? "bg-indigo-600" : "bg-neutral-300"
      )}
      aria-label={label}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

function PrefRow({
  icon: Icon,
  label,
  desc,
  checked,
  onChange,
  iconClass,
}: {
  icon: ElementType;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  iconClass?: string;
}) {
  return (
    <div className="flex items-center gap-3.5 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          iconClass || (checked ? "bg-indigo-50 text-indigo-600" : "bg-neutral-100 text-neutral-400")
        )}
      >
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-bold text-slate-800">{label}</div>
        <div className="text-[11px] text-slate-400 mt-0.5">{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

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
  const [memberSince, setMemberSince] = useState<string | null>(null);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");
  const [prefs, setPrefs] = useState<PlatformPrefs>(DEFAULT_PREFS);

  const supabase = createClient();
  const { country: globalCountry, setCountryByIso, countries } = useCountry();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab === "settings" ? "blog" : "cuenta");
      setPrefs(loadPrefs());
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
        if (authUser.created_at) {
          setMemberSince(
            new Date(authUser.created_at).toLocaleDateString("es-CL", {
              year: "numeric",
              month: "long",
            })
          );
        }

        const profile = await getCurrentUserProfile();
        if (profile) {
          setFullName(profile.full_name || authUser.user_metadata?.full_name || "");

          const rawPhone = profile.phone || authUser.user_metadata?.whatsapp || "";
          if (rawPhone) {
            const matchedCountry = PHONE_COUNTRIES.slice()
              .sort((a, b) => b.code.length - a.code.length)
              .find((c) => rawPhone.startsWith(c.code));

            if (matchedCountry) {
              setPhonePrefix(matchedCountry.code);
              setWhatsapp(rawPhone.slice(matchedCountry.code.length));
            } else {
              setWhatsapp(rawPhone);
            }
          } else {
            const matched = PHONE_COUNTRIES.find((c) => c.iso === globalCountry.iso);
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
      const matched = PHONE_COUNTRIES.find((c) => c.iso === globalCountry.iso);
      if (matched) setPhonePrefix(matched.code);
    }
  }, [globalCountry.iso, whatsapp]);

  const handleCategoryToggle = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const updatePref = <K extends keyof PlatformPrefs>(key: K, value: PlatformPrefs[K]) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      savePrefs(next);
      return next;
    });
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

      savePrefs(prefs);
      setSuccess("Configuración guardada correctamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Ocurrió un error al guardar los cambios.";
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

  const tabs: { id: SettingsTab; label: string; icon: ElementType }[] = [
    { id: "cuenta", label: "Cuenta", icon: User },
    { id: "blog", label: "Blog y alertas", icon: Bell },
    { id: "region", label: "Región y moneda", icon: Globe },
    { id: "preferencias", label: "Preferencias", icon: Settings2 },
    { id: "accesos", label: "Accesos rápidos", icon: LayoutDashboard },
    { id: "privacidad", label: "Privacidad", icon: Database },
  ];

  const tabMeta: Record<SettingsTab, { title: string; desc: string }> = {
    cuenta: { title: "Cuenta", desc: "Perfil y datos de contacto" },
    blog: { title: "Blog y alertas", desc: "Newsletter y categorías" },
    region: { title: "Región y moneda", desc: "País, moneda y zona horaria" },
    preferencias: { title: "Preferencias", desc: "Notificaciones y experiencia" },
    accesos: { title: "Accesos rápidos", desc: "Atajos a la plataforma" },
    privacidad: { title: "Privacidad", desc: "Datos y seguridad de la cuenta" },
  };

  const needsSave = activeTab === "cuenta" || activeTab === "blog";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4">
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
          className="relative bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] w-full max-w-4xl h-[min(85vh,640px)] overflow-hidden flex flex-col md:flex-row border border-neutral-100 z-10"
        >
          {/* Sidebar — fixed width like community */}
          <div className="w-full md:w-[240px] bg-neutral-50/50 border-b md:border-b-0 md:border-r border-neutral-100 p-4 md:p-5 shrink-0 flex flex-col justify-between max-h-[38%] md:max-h-none overflow-y-auto">
            <div>
              <div className="mb-4 md:mb-6 px-1">
                <h3 className="font-display font-black text-slate-900 text-lg tracking-tight">
                  Ajustes
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Plataforma ProgramBI</p>
              </div>

              <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "text-left px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl transition-all text-[12px] md:text-[13px] flex items-center gap-2.5 md:gap-3 cursor-pointer border-0 font-medium select-none whitespace-nowrap shrink-0",
                        isActive
                          ? "bg-neutral-100 text-slate-900"
                          : "text-slate-500 bg-transparent hover:bg-neutral-100/50 hover:text-slate-900"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 md:w-[18px] md:h-[18px] shrink-0",
                          isActive ? "text-slate-800" : "text-slate-400"
                        )}
                      />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 mt-4 hidden md:block">
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

          {/* Content panel — fixed height, scroll inside */}
          <div className="flex-1 min-h-0 flex flex-col bg-white">
            <div className="flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-6 pb-3 shrink-0">
              <div>
                <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 tracking-tight">
                  {tabMeta[activeTab].title}
                </h2>
                <p className="text-[12px] text-slate-400 mt-0.5">{tabMeta[activeTab].desc}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-slate-500 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-8 pb-4">
              {loadingData ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[240px] space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <span className="text-xs text-slate-400 font-bold">Cargando datos...</span>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[13px] mb-4">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span className="font-medium">{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-[13px] mb-4">
                      <CheckCircle size={16} className="flex-shrink-0" />
                      <span className="font-medium">{success}</span>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {/* ── CUENTA ── */}
                    {activeTab === "cuenta" && (
                      <motion.div
                        key="cuenta"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-4"
                      >
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

                        <div className="flex items-start gap-3.5">
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
                          </div>
                        </div>

                        <div className="flex items-start gap-3.5">
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

                        <div className="flex items-start gap-3.5">
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
                                      PHONE_COUNTRIES.find((c) => c.code === phonePrefix)?.iso ||
                                      "cl"
                                    }.png`}
                                    alt=""
                                    className="w-4 h-auto"
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
                                      {PHONE_COUNTRIES.map((country) => (
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
                                            className="w-4 h-auto"
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

                        <div className="divide-y divide-neutral-100 border-t border-neutral-100 pt-1">
                          <div className="py-3.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-slate-600 shrink-0">
                                <Shield className="w-[18px] h-[18px]" />
                              </div>
                              <div>
                                <div className="font-bold text-[13px] text-slate-800">
                                  Cuenta de ProgramBI
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  Acceso a plataforma y comunidad
                                </div>
                              </div>
                            </div>
                            <span className="bg-neutral-100 text-slate-600 font-semibold px-3 py-1.5 rounded-full text-[11px] shrink-0">
                              Estudiante
                            </span>
                          </div>
                          {memberSince && (
                            <div className="py-3.5 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-slate-500 shrink-0">
                                  <Calendar className="w-[18px] h-[18px]" />
                                </div>
                                <div>
                                  <div className="font-bold text-[13px] text-slate-800">
                                    Miembro desde
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    {memberSince}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* ── BLOG ── */}
                    {activeTab === "blog" && (
                      <motion.div
                        key="blog"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                isSubscribed
                                  ? "bg-indigo-50 text-indigo-600"
                                  : "bg-neutral-100 text-neutral-400"
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
                          <Toggle
                            checked={isSubscribed}
                            onChange={setIsSubscribed}
                            label="Suscripción al blog"
                          />
                        </div>

                        {isSubscribed ? (
                          <div className="space-y-4">
                            <div>
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
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
                                        "w-full flex items-center gap-3.5 p-3 rounded-2xl border transition-all text-left cursor-pointer",
                                        checked
                                          ? "bg-indigo-50/60 border-indigo-200"
                                          : "bg-white border-neutral-100 hover:border-neutral-200"
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0",
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
                                        <div className="text-[11px] text-slate-400">
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
                                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-slate-800 text-[13px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 cursor-pointer"
                              >
                                <option value="weekly">Semanal (recomendado)</option>
                                <option value="monthly">Mensual</option>
                                <option value="instant">Instantáneo</option>
                              </select>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-[13px] font-bold text-slate-700 mb-1">
                              Estás desuscrito del blog
                            </p>
                            <p className="text-[12px] text-slate-400 max-w-sm mx-auto">
                              Activa el interruptor para recibir contenido de nuestros expertos.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ── REGIÓN ── */}
                    {activeTab === "region" && (
                      <motion.div
                        key="region"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-4"
                      >
                        <div className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/80 flex items-center gap-3.5">
                          <img
                            src={globalCountry.flagUrl.replace("/w40/", "/w80/")}
                            alt=""
                            className="w-10 h-auto shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-[13px] text-slate-800">
                              {globalCountry.name}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {globalCountry.currency.code} · {globalCountry.timezone.label} ·{" "}
                              {globalCountry.phoneCode}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                            Seleccionar país
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
                            {countries.map((c) => {
                              const active = c.iso === globalCountry.iso;
                              return (
                                <button
                                  key={c.iso}
                                  type="button"
                                  onClick={() => {
                                    setCountryByIso(c.iso);
                                    setSuccess("Región actualizada");
                                    setTimeout(() => setSuccess(null), 2000);
                                  }}
                                  className={cn(
                                    "flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer",
                                    active
                                      ? "bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-100"
                                      : "bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50"
                                  )}
                                >
                                  <img
                                    src={c.flagUrl.replace("/w40/", "/w80/")}
                                    alt=""
                                    className="w-6 h-auto shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="text-[12px] font-bold text-slate-800 truncate">
                                      {c.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400">
                                      {c.currency.symbol} {c.currency.code}
                                    </div>
                                  </div>
                                  {active && (
                                    <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-100">
                          <Languages className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                          <div className="flex-1">
                            <div className="text-[13px] font-semibold text-slate-800">
                              Idioma de la interfaz
                            </div>
                            <div className="text-[11px] text-slate-400">Español (Latinoamérica)</div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 bg-neutral-100 px-2.5 py-1 rounded-lg">
                            ES
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* ── PREFERENCIAS ── */}
                    {activeTab === "preferencias" && (
                      <motion.div
                        key="preferencias"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3"
                      >
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Notificaciones
                        </div>
                        <PrefRow
                          icon={GraduationCap}
                          label="Recordatorios de cursos"
                          desc="Avisos de clases en vivo y materiales nuevos"
                          checked={prefs.courseReminders}
                          onChange={(v) => updatePref("courseReminders", v)}
                        />
                        <PrefRow
                          icon={Radio}
                          label="Alertas de webinars"
                          desc="Recordatorios antes de eventos en vivo"
                          checked={prefs.webinarAlerts}
                          onChange={(v) => updatePref("webinarAlerts", v)}
                        />
                        <PrefRow
                          icon={Sparkles}
                          label="Novedades del producto"
                          desc="Nuevas funciones y mejoras de la plataforma"
                          checked={prefs.productUpdates}
                          onChange={(v) => updatePref("productUpdates", v)}
                        />
                        <PrefRow
                          icon={Newspaper}
                          label="Promociones y ofertas"
                          desc="Descuentos y campañas especiales por email"
                          checked={prefs.promoEmails}
                          onChange={(v) => updatePref("promoEmails", v)}
                        />

                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-4 mb-1">
                          Experiencia
                        </div>
                        <PrefRow
                          icon={Sun}
                          label="Reducir animaciones"
                          desc="Menos movimiento en la interfaz (accesibilidad)"
                          checked={prefs.reducedMotion}
                          onChange={(v) => {
                            updatePref("reducedMotion", v);
                            if (typeof document !== "undefined") {
                              document.documentElement.classList.toggle(
                                "reduce-motion",
                                v
                              );
                            }
                          }}
                          iconClass={
                            prefs.reducedMotion
                              ? "bg-amber-50 text-amber-600"
                              : "bg-neutral-100 text-neutral-400"
                          }
                        />
                        <div className="flex items-center gap-3.5 p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 opacity-70">
                          <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0">
                            <Sun className="w-[18px] h-[18px]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-bold text-slate-800">Tema claro</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              El tema oscuro llegará pronto
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 bg-neutral-200/70 px-2.5 py-1 rounded-lg">
                            Activo
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* ── ACCESOS ── */}
                    {activeTab === "accesos" && (
                      <motion.div
                        key="accesos"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-2.5"
                      >
                        {[
                          {
                            href: "/comunidad",
                            icon: LayoutDashboard,
                            title: "Comunidad",
                            desc: "Muro, cursos y asistente IA",
                            color: "text-indigo-600 bg-indigo-50",
                          },
                          {
                            href: "/comunidad/mis-cursos",
                            icon: GraduationCap,
                            title: "Mis cursos",
                            desc: "Progreso y materiales inscritos",
                            color: "text-blue-600 bg-blue-50",
                          },
                          {
                            href: "/cursos",
                            icon: BookOpen,
                            title: "Catálogo de cursos",
                            desc: "Explora todos los bootcamps",
                            color: "text-violet-600 bg-violet-50",
                          },
                          {
                            href: "/blog",
                            icon: Newspaper,
                            title: "Blog ProgramBI",
                            desc: "Artículos y análisis recientes",
                            color: "text-emerald-600 bg-emerald-50",
                          },
                          {
                            href: "/faq",
                            icon: LifeBuoy,
                            title: "Centro de ayuda",
                            desc: "Preguntas frecuentes y soporte",
                            color: "text-amber-600 bg-amber-50",
                          },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={onClose}
                              className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/80 transition-all no-underline group"
                            >
                              <div
                                className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                  item.color
                                )}
                              >
                                <Icon className="w-[18px] h-[18px]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-bold text-slate-800 group-hover:text-slate-950">
                                  {item.title}
                                </div>
                                <div className="text-[11px] text-slate-400">{item.desc}</div>
                              </div>
                              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0" />
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}

                    {/* ── PRIVACIDAD ── */}
                    {activeTab === "privacidad" && (
                      <motion.div
                        key="privacidad"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="divide-y divide-neutral-100"
                      >
                        <div className="py-4 flex items-center justify-between gap-4 first:pt-0">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-slate-500 shrink-0">
                              <Database className="w-[18px] h-[18px]" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[13px] text-slate-800">
                                Exportar mis datos
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Solicita una copia de tu información de cuenta
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSuccess(
                                "Solicitud recibida. Te enviaremos un correo en hasta 48 h."
                              );
                              setTimeout(() => setSuccess(null), 4000);
                            }}
                            className="bg-white border border-neutral-200 hover:bg-neutral-50 text-slate-800 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                          >
                            Solicitar
                          </button>
                        </div>

                        <div className="py-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-slate-500 shrink-0">
                              <Lock className="w-[18px] h-[18px]" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[13px] text-slate-800">
                                Sesión segura
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Tu cuenta usa autenticación de Supabase
                              </div>
                            </div>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 font-semibold px-3 py-1.5 rounded-full text-[11px] shrink-0">
                            Activa
                          </span>
                        </div>

                        <div className="py-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                              <AlertTriangle className="w-[18px] h-[18px]" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[13px] text-red-500">
                                Eliminar cuenta
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Solicitud de borrado permanente de datos
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                confirm(
                                  "¿Deseas solicitar la eliminación permanente de tu cuenta? Soporte te contactará en 48 h."
                                )
                              ) {
                                setSuccess(
                                  "Solicitud de eliminación registrada. Soporte te contactará pronto."
                                );
                                setTimeout(() => setSuccess(null), 4000);
                              }
                            }}
                            className="bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 font-semibold px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer shrink-0"
                          >
                            Eliminar
                          </button>
                        </div>

                        <div className="pt-4">
                          <Link
                            href="/privacidad"
                            onClick={onClose}
                            className="text-[12px] text-indigo-600 font-semibold no-underline hover:underline"
                          >
                            Ver política de privacidad →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Footer — always visible, fixed at bottom of panel */}
            {!loadingData && (
              <div className="shrink-0 border-t border-neutral-100 px-5 sm:px-8 py-3.5 space-y-3 bg-white">
                {needsSave && (
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
                )}

                <div className="p-3.5 sm:p-4 bg-slate-950 rounded-2xl relative overflow-hidden flex items-center justify-between border border-white/10">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
                  <div className="relative z-10 flex items-center gap-2.5 min-w-0">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-white">ProgramBI Premium</div>
                      <div className="text-[10px] text-gray-400 truncate">
                        Cursos, IA y asesorías en directo
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/comunidad"
                    onClick={onClose}
                    className="relative z-10 bg-white hover:bg-neutral-100 text-slate-950 text-[11px] font-bold px-3.5 py-1.5 rounded-xl transition-all no-underline shrink-0"
                  >
                    Ver planes
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
