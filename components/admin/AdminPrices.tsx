"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  CreditCard,
  Edit3,
  FileText,
  Globe,
  GraduationCap,
  Loader2,
  Percent,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  adminCreateCoupon,
  adminCreatePromotion,
  adminDeleteCoupon,
  adminDeletePromotion,
  adminGetCoupons,
  adminGetCourses,
  adminGetPriceOverrides,
  adminGetPromotions,
  adminToggleCoupon,
  adminTogglePromotion,
  adminUpdateCoupon,
  adminUpdatePromotion,
  adminUpsertPriceOverride,
} from "@/lib/supabase/comunidad-ai";
import { courses as allCourses } from "@/lib/data/courses";
import { communityPlans } from "@/lib/data/community_plans";
import { getPais, ISO_CHILE, PAISES } from "@/config/paises";
import {
  formatMoneda,
  resolverPrecioCursoPais,
  type PromocionAplicable,
} from "@/lib/paises/precios";
import { courseBrochurePath } from "@/lib/pricing-gate";

const ADMIN_PREVIEW_COUNTRIES = ["cl", "mx", "ar", "pe", "co", "uy", "us"] as const;

type PromoTargetType = "courses" | "plans" | "all" | "specific_course" | "specific_plan";

type PromoRow = {
  id: string;
  name: string;
  target_type: PromoTargetType | string;
  target_id?: string | null;
  discount_percentage: number;
  promo_price?: number | null;
  is_active: boolean;
  valid_until?: string | null;
};

type PriceOverrideRow = {
  id?: string;
  item_type: string;
  item_id: string;
  level_name?: string | null;
  price: number;
};

type CouponRow = {
  id: string;
  code: string;
  discount_percentage: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  valid_until?: string | null;
  allow_stacking?: boolean | null;
  applicable_courses?: string[] | null;
};

type AdminCourseSummary = {
  id?: string;
  slug: string;
  title: string;
};

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Ocurrió un error inesperado.";
}

export function AdminPrices() {
  const [promos, setPromos] = useState<PromoRow[]>([]);
  const [priceOverrides, setPriceOverrides] = useState<PriceOverrideRow[]>([]);
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorObj, setErrorObj] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"prices" | "promos" | "coupons">("prices");
  const [selectedCountry, setSelectedCountry] = useState<string>(ISO_CHILE);

  // Promo form
  const [editingPromo, setEditingPromo] = useState<PromoRow | null>(null);
  const [name, setName] = useState("");
  const [targetType, setTargetType] = useState<PromoTargetType>("courses");
  const [targetId, setTargetId] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [promoPrice, setPromoPrice] = useState<number | "">("");
  const [promoValidUntil, setPromoValidUntil] = useState("");

  // Coupon form
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState<number>(10);
  const [couponMaxUses, setCouponMaxUses] = useState<number | "">("");
  const [couponValidUntil, setCouponValidUntil] = useState("");
  const [couponAllowStacking, setCouponAllowStacking] = useState(false);
  const [couponApplicableCourses, setCouponApplicableCourses] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<AdminCourseSummary[]>([]);
  const [editingCoupon, setEditingCoupon] = useState<CouponRow | null>(null);

  // Price editing (Chile CLP override)
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<number>(0);
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [promosData, overridesData, couponsData, coursesData] = await Promise.all([
        adminGetPromotions(),
        adminGetPriceOverrides(),
        adminGetCoupons(),
        adminGetCourses(),
      ]);
      setPromos(promosData);
      setPriceOverrides(overridesData);
      setCoupons(couponsData);
      setAvailableCourses(coursesData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const activePromos: PromocionAplicable[] = promos.filter(
    (p) => p.is_active && (!p.valid_until || new Date(p.valid_until).getTime() > Date.now())
  );
  const selectedCountryInfo = getPais(selectedCountry);

  const getOverriddenPrice = (
    itemType: string,
    itemId: string,
    levelName: string,
    basePrice: number
  ) => {
    const override = priceOverrides.find(
      (o) =>
        o.item_type === itemType && o.item_id === itemId && o.level_name === levelName
    );
    return override && typeof override.price === "number" && override.price > 0 && override.price < basePrice
      ? override.price
      : basePrice;
  };

  const handleSavePrice = async (itemType: string, itemId: string, levelName: string) => {
    setSavingPrice(true);
    try {
      await adminUpsertPriceOverride({
        item_type: itemType,
        item_id: itemId,
        level_name: levelName,
        price: editPriceValue,
      });
      setEditingPrice(null);
      loadData();
    } catch (err: unknown) {
      alert("Error: " + errorMessage(err));
    } finally {
      setSavingPrice(false);
    }
  };

  const resetPromoForm = () => {
    setEditingPromo(null);
    setName("");
    setTargetType("courses");
    setTargetId("");
    setDiscountPercent(20);
    setPromoPrice("");
    setPromoValidUntil("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorObj(null);
    try {
      if (viewMode === "coupons") {
        if (editingCoupon) {
          await adminUpdateCoupon(editingCoupon.id, {
            code: couponCode,
            discount_percentage: couponDiscount,
            max_uses: couponMaxUses === "" ? null : couponMaxUses,
            valid_until:
              couponValidUntil === "" ? null : new Date(couponValidUntil).toISOString(),
            allow_stacking: couponAllowStacking,
            applicable_courses:
              couponApplicableCourses.length > 0 ? couponApplicableCourses : null,
          });
          setEditingCoupon(null);
        } else {
          await adminCreateCoupon({
            code: couponCode,
            discount_percentage: couponDiscount,
            max_uses: couponMaxUses === "" ? undefined : couponMaxUses,
            is_active: true,
            valid_until:
              couponValidUntil === "" ? undefined : new Date(couponValidUntil).toISOString(),
            allow_stacking: couponAllowStacking,
            applicable_courses:
              couponApplicableCourses.length > 0 ? couponApplicableCourses : null,
          });
        }
        setShowAdd(false);
        setCouponCode("");
        setCouponDiscount(10);
        setCouponMaxUses("");
        setCouponValidUntil("");
        setCouponAllowStacking(false);
        setCouponApplicableCourses([]);
        loadData();
      } else {
        const cleanTargetId =
          targetType === "specific_course" || targetType === "specific_plan"
            ? targetId
            : undefined;
        if ((targetType === "specific_course" || targetType === "specific_plan") && !cleanTargetId) {
          setErrorObj("Selecciona el curso o plan específico al que aplica la promoción.");
          setSubmitting(false);
          return;
        }
        const validUntilIso =
          promoValidUntil === "" ? null : new Date(promoValidUntil).toISOString();
        const fixedClp = promoPrice === "" ? null : Number(promoPrice);

        if (editingPromo) {
          await adminUpdatePromotion(editingPromo.id, {
            name,
            target_type: targetType,
            target_id: cleanTargetId ?? null,
            discount_percentage: discountPercent,
            promo_price: fixedClp,
            valid_until: validUntilIso,
          });
        } else {
          await adminCreatePromotion({
            name,
            target_type: targetType,
            target_id: cleanTargetId,
            discount_percentage: discountPercent,
            promo_price: fixedClp ?? undefined,
            is_active: true,
            valid_until: validUntilIso,
          });
        }
        setShowAdd(false);
        resetPromoForm();
        setViewMode("promos");
        loadData();
      }
    } catch (err: unknown) {
      setErrorObj(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await adminTogglePromotion(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta promoción?")) return;
    try {
      await adminDeletePromotion(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCoupon = async (id: string) => {
    try {
      await adminToggleCoupon(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este cupón?")) return;
    try {
      await adminDeleteCoupon(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditCoupon = (coupon: CouponRow) => {
    setEditingCoupon(coupon);
    setCouponCode(coupon.code);
    setCouponDiscount(coupon.discount_percentage);
    setCouponMaxUses(coupon.max_uses === null ? "" : coupon.max_uses);
    setCouponValidUntil(
      coupon.valid_until ? new Date(coupon.valid_until).toISOString().substring(0, 16) : ""
    );
    setCouponAllowStacking(!!coupon.allow_stacking);
    setCouponApplicableCourses(coupon.applicable_courses || []);
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startPromo = (type: PromoTargetType, id = "") => {
    resetPromoForm();
    setTargetType(type);
    setTargetId(id);
    setViewMode("promos");
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditPromo = (promo: PromoRow) => {
    setEditingPromo(promo);
    setName(promo.name || "");
    setTargetType((promo.target_type as PromoTargetType) || "courses");
    setTargetId(promo.target_id || "");
    setDiscountPercent(promo.discount_percentage || 20);
    setPromoPrice(promo.promo_price ?? "");
    setPromoValidUntil(
      promo.valid_until ? new Date(promo.valid_until).toISOString().substring(0, 16) : ""
    );
    setViewMode("promos");
    setShowAdd(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditPrice = (key: string, currentPrice: number) => {
    setEditingPrice(key);
    setEditPriceValue(currentPrice);
  };

  const previewSlug = targetType === "specific_course" && targetId ? targetId : "power-bi";
  const draftPromoPreview: PromocionAplicable[] =
    targetType === "plans" || targetType === "specific_plan"
      ? []
      : [
          {
            id: "draft-preview",
            name: name || "Vista previa",
            target_type: targetType,
            target_id: targetType === "specific_course" ? targetId : null,
            discount_percentage: discountPercent,
            promo_price: promoPrice === "" ? null : Number(promoPrice),
            is_active: true,
          },
        ];

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-gray-900 mb-1">
            Precios y Promociones
          </h2>
          <p className="text-sm text-gray-500">
            Los descuentos (%) aplican a todos los países, fichas, checkout y PDFs de cada curso.
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl self-start">
          <button
            onClick={() => {
              setViewMode("prices");
              setShowAdd(false);
              setEditingCoupon(null);
              resetPromoForm();
            }}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
              viewMode === "prices"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            } border-none cursor-pointer`}
          >
            Precios por País
          </button>
          <button
            onClick={() => {
              setViewMode("promos");
              setShowAdd(false);
              setEditingCoupon(null);
            }}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
              viewMode === "promos"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            } border-none cursor-pointer flex items-center gap-2`}
          >
            Promos Activas
            {activePromos.length > 0 && (
              <span className="bg-brand-blue text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {activePromos.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setViewMode("coupons");
              setShowAdd(false);
              setEditingCoupon(null);
              resetPromoForm();
            }}
            className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
              viewMode === "coupons"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            } border-none cursor-pointer flex items-center gap-2`}
          >
            Cupones
            {coupons.filter((c) => c.is_active).length > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {coupons.filter((c) => c.is_active).length}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-8 bg-gray-50 border border-gray-200 p-6 rounded-2xl overflow-hidden"
          >
            {errorObj && (
              <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium">
                {errorObj}
              </div>
            )}

            {viewMode === "coupons" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Código del Cupón (Ej: PROMO50)
                  </label>
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Ej: PROMO50"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none font-mono tracking-wide"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Límite de Usos (Opcional - Vacío para ilimitado)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej: 100"
                    value={couponMaxUses}
                    onChange={(e) =>
                      setCouponMaxUses(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Fecha de Vencimiento (Opcional)
                  </label>
                  <input
                    type="datetime-local"
                    value={couponValidUntil}
                    onChange={(e) => setCouponValidUntil(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none"
                  />
                </div>

                <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        Cursos Aplicables (Opcional)
                      </label>
                      <p className="text-xs text-gray-500">
                        Selecciona los cursos en los que funcionará este cupón.{" "}
                        <span className="font-semibold text-gray-700">
                          Si no seleccionas ninguno (vacío), funcionará para TODOS los cursos.
                        </span>
                      </p>
                    </div>
                    <div className="text-xs font-bold shrink-0">
                      {couponApplicableCourses.length === 0 ? (
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                          ✨ Aplica a TODOS los Cursos
                        </span>
                      ) : (
                        <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
                          🎯 Solo {couponApplicableCourses.length} curso(s) seleccionado(s)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 max-h-48 overflow-y-auto p-1">
                    {availableCourses.map((course) => {
                      const isSelected = couponApplicableCourses.includes(course.slug);
                      return (
                        <button
                          key={course.id || course.slug}
                          type="button"
                          onClick={() => {
                            setCouponApplicableCourses((prev) =>
                              isSelected
                                ? prev.filter((s) => s !== course.slug)
                                : [...prev, course.slug]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                            isSelected
                              ? "bg-brand-blue border-brand-blue text-white shadow-sm scale-[1.02]"
                              : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                          }`}
                        >
                          {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          <span>{course.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 md:col-span-2">
                  <input
                    type="checkbox"
                    id="coupon-allow-stacking"
                    checked={couponAllowStacking}
                    onChange={(e) => setCouponAllowStacking(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-[#0F172A] cursor-pointer"
                  />
                  <label
                    htmlFor="coupon-allow-stacking"
                    className="text-xs text-gray-600 font-semibold cursor-pointer select-none"
                  >
                    Permitir descuento sobre descuento (Acumulable con otras promociones de cursos)
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Nombre de la Campaña (Ej: Black Friday)
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Black Friday 2026"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Descuento (%) · Todos los Países
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none font-bold"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Se descuenta sobre el precio vigente de cada país (fichas, checkout y PDFs).
                    </p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Aplica a
                    </label>
                    <select
                      value={targetType}
                      onChange={(e) => {
                        const next = e.target.value as PromoTargetType;
                        setTargetType(next);
                        if (next === "specific_course") {
                          setTargetId(allCourses[0]?.slug || "");
                        } else if (next === "specific_plan") {
                          setTargetId(communityPlans[0]?.id || "");
                        } else {
                          setTargetId("");
                        }
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none cursor-pointer"
                    >
                      <option value="courses">Todos los Cursos</option>
                      <option value="plans">Todas las Membresías</option>
                      <option value="all">Toda la Tienda (Cursos y Planes)</option>
                      <option value="specific_course">Curso Específico</option>
                      <option value="specific_plan">Plan Específico</option>
                    </select>
                  </div>
                  {targetType === "specific_course" && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Curso Objetivo
                      </label>
                      <select
                        required
                        value={targetId}
                        onChange={(e) => setTargetId(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none cursor-pointer"
                      >
                        <option value="">Selecciona un curso…</option>
                        {allCourses.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.title} ({c.slug})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {targetType === "specific_plan" && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Plan Objetivo
                      </label>
                      <select
                        required
                        value={targetId}
                        onChange={(e) => setTargetId(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none cursor-pointer"
                      >
                        <option value="">Selecciona un plan…</option>
                        {communityPlans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Precio Fijo Solo Chile CLP (Opcional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Vacío = usar % también en Chile"
                      value={promoPrice}
                      onChange={(e) =>
                        setPromoPrice(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Solo reemplaza el monto en Chile (CLP). Los demás países siguen usando el{" "}
                      {discountPercent}% de arriba.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Fecha de Vencimiento (Opcional)
                    </label>
                    <input
                      type="datetime-local"
                      value={promoValidUntil}
                      onChange={(e) => setPromoValidUntil(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none"
                    />
                  </div>
                </div>

                {targetType !== "plans" && targetType !== "specific_plan" && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Vista previa en Web y PDF (
                      {allCourses.find((c) => c.slug === previewSlug)?.title || previewSlug})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {ADMIN_PREVIEW_COUNTRIES.map((iso) => {
                        const paisInfo = getPais(iso);
                        const res = resolverPrecioCursoPais(iso, previewSlug, draftPromoPreview);
                        if (!res) return null;
                        return (
                          <div
                            key={iso}
                            className="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-2"
                          >
                            <div className="text-[10px] font-bold text-gray-500 uppercase">
                              {paisInfo.nombre} ({paisInfo.moneda})
                            </div>
                            <div className="text-[11px] text-gray-400 line-through tabular-nums">
                              {formatMoneda(iso, res.basePrice)}
                            </div>
                            <div className="text-xs font-black text-emerald-700 tabular-nums">
                              {formatMoneda(iso, res.finalPrice)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setEditingCoupon(null);
                  resetPromoForm();
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-200 transition-colors border-none cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-colors disabled:opacity-50 border-none cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {viewMode === "coupons"
                  ? editingCoupon
                    ? "Guardar Cambios"
                    : "Crear Cupón"
                  : editingPromo
                    ? "Guardar Promoción"
                    : "Publicar Promoción"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {viewMode === "prices" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-brand-blue shrink-0">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 text-sm">
                  Descuentos Multipaís y PDFs en vivo
                </h3>
                <p className="text-xs text-blue-700 mt-0.5">
                  Cada país usa su propia moneda y tabla base. Crea una promoción (%) para rebajar
                  precios en fichas, checkout y PDFs de todos los mercados a la vez.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => startPromo("courses")}
                className="text-xs font-bold px-3.5 py-2 bg-brand-blue text-white rounded-xl hover:bg-blue-600 transition-all cursor-pointer border-none shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Nueva Promoción
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div>
              <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-gray-500" />
                Vista previa de precios y PDFs en:{" "}
                <span className="text-brand-blue">
                  {selectedCountryInfo.nombre} ({selectedCountryInfo.moneda})
                </span>
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {selectedCountry === ISO_CHILE
                  ? "En Chile también puedes hacer clic en el precio base de un nivel para fijar un override CLP menor."
                  : `Mostrando la tabla adaptada de ${selectedCountryInfo.nombre} más las promociones activas.`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="hidden xl:flex items-center gap-1">
                {ADMIN_PREVIEW_COUNTRIES.map((iso) => (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setSelectedCountry(iso)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      selectedCountry === iso
                        ? "bg-[#0F172A] text-white border-[#0F172A]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {iso.toUpperCase()}
                  </button>
                ))}
              </div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-brand-blue cursor-pointer"
              >
                {PAISES.map((p) => (
                  <option key={p.iso} value={p.iso}>
                    {p.nombre} ({p.moneda})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Courses Table */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-gray-400" /> Cursos en{" "}
              {selectedCountryInfo.nombre}
            </h3>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Curso</th>
                      <th className="px-5 py-3">Nivel</th>
                      <th className="px-5 py-3">
                        Precio Base ({selectedCountryInfo.moneda})
                      </th>
                      <th className="px-5 py-3">Final Web y PDF</th>
                      <th className="px-5 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allCourses.map((course) => {
                      const resolvedCountry = resolverPrecioCursoPais(
                        selectedCountry,
                        course.slug,
                        activePromos,
                        {
                          priceOverrides:
                            selectedCountry === ISO_CHILE ? priceOverrides : undefined,
                        }
                      );
                      const brochureHref = courseBrochurePath(course.slug, selectedCountry);
                      const levelsList =
                        course.levels && course.levels.length > 0
                          ? course.levels
                          : [{ name: "Completo", price: 0 }];

                      return levelsList.map((lvl, i) => {
                        const editKey = `course-${course.slug}-${lvl.name}`;
                        const clpOverridePrice = getOverriddenPrice(
                          "course",
                          course.slug,
                          lvl.name,
                          lvl.price || 0
                        );
                        const resolvedLevel =
                          selectedCountry === ISO_CHILE
                            ? resolverPrecioCursoPais(ISO_CHILE, course.slug, activePromos, {
                                priceOverrides,
                                levelName: lvl.name,
                              })
                            : resolvedCountry;

                        return (
                          <tr key={editKey} className="hover:bg-gray-50 transition-colors">
                            {i === 0 && (
                              <td className="px-5 py-3 align-top" rowSpan={levelsList.length}>
                                <div className="font-bold text-gray-900 text-xs">{course.title}</div>
                                <div className="text-[10px] text-gray-400 mb-1.5">
                                  {course.slug}
                                </div>
                                <a
                                  href={brochureHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue hover:underline"
                                >
                                  <FileText className="w-3 h-3" /> Ver PDF (
                                  {selectedCountry.toUpperCase()})
                                </a>
                              </td>
                            )}
                            <td className="px-5 py-3 text-xs font-medium text-gray-600">
                              {lvl.name}
                            </td>
                            <td className="px-5 py-3">
                              {selectedCountry === ISO_CHILE ? (
                                editingPrice === editKey ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">$</span>
                                    <input
                                      type="number"
                                      value={editPriceValue}
                                      onChange={(e) => setEditPriceValue(Number(e.target.value))}
                                      className="w-28 border border-blue-300 rounded-lg px-3 py-1.5 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
                                      autoFocus
                                    />
                                    <button
                                      disabled={savingPrice}
                                      onClick={() =>
                                        handleSavePrice("course", course.slug, lvl.name)
                                      }
                                      className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 cursor-pointer border-none"
                                    >
                                      {savingPrice ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : (
                                        <CheckCircle className="w-3 h-3" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => setEditingPrice(null)}
                                      className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200 cursor-pointer border-none"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <button
                                      onClick={() => startEditPrice(editKey, clpOverridePrice)}
                                      className="font-bold text-gray-800 text-sm hover:text-brand-blue transition-colors cursor-pointer bg-transparent border-none p-0 tabular-nums"
                                      title="Clic para editar override CLP"
                                    >
                                      ${clpOverridePrice.toLocaleString("es-CL")}
                                    </button>
                                    {resolvedLevel?.listPrice ? (
                                      <div className="text-[10px] text-gray-400">
                                        Lista: ${resolvedLevel.listPrice.toLocaleString("es-CL")}
                                      </div>
                                    ) : null}
                                  </div>
                                )
                              ) : resolvedLevel ? (
                                <div>
                                  <div className="font-bold text-gray-800 text-sm tabular-nums">
                                    {formatMoneda(selectedCountry, resolvedLevel.basePrice)}
                                  </div>
                                  {resolvedLevel.listPrice ? (
                                    <div className="text-[10px] text-gray-400">
                                      Lista: {formatMoneda(selectedCountry, resolvedLevel.listPrice)}
                                    </div>
                                  ) : null}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">Por WhatsApp</span>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              {resolvedLevel ? (
                                resolvedLevel.hasPromoDiscount ? (
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-black text-emerald-700 text-sm tabular-nums">
                                        {formatMoneda(selectedCountry, resolvedLevel.finalPrice)}
                                      </span>
                                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                                        -{resolvedLevel.promoDiscountPercentage}% promo
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-gray-500">
                                      {resolvedLevel.promoName || "Promoción activa"} ·{" "}
                                      {resolvedLevel.discountPercentage}% dcto total vs lista
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-gray-700 text-sm tabular-nums">
                                      {formatMoneda(selectedCountry, resolvedLevel.finalPrice)}
                                    </span>
                                    {resolvedLevel.discountPercentage > 0 && (
                                      <span className="text-[10px] text-gray-400">
                                        ({resolvedLevel.discountPercentage}% vs lista)
                                      </span>
                                    )}
                                  </div>
                                )
                              ) : (
                                <span className="text-xs text-gray-400">Sin monto público</span>
                              )}
                            </td>
                            <td className="px-5 py-3 text-right">
                              {i === 0 ? (
                                <button
                                  onClick={() => startPromo("specific_course", course.slug)}
                                  className="text-[10px] font-bold px-2.5 py-1.5 bg-white border border-gray-200 text-brand-blue rounded-md hover:bg-blue-50 transition-all cursor-pointer"
                                >
                                  + Descuento
                                </button>
                              ) : null}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Memberships Table */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-400" /> Membresías
            </h3>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Plan</th>
                      <th className="px-5 py-3">Mensual</th>
                      <th className="px-5 py-3">Anual</th>
                      <th className="px-5 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {communityPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="font-bold text-gray-900 text-xs">{plan.name}</div>
                          <div className="text-[10px] text-gray-400">ID: {plan.id}</div>
                        </td>
                        <td className="px-5 py-3 font-semibold text-gray-600 text-sm">
                          ${plan.price.toLocaleString("es-CL")}
                        </td>
                        <td className="px-5 py-3 font-semibold text-gray-600 text-sm">
                          ${(plan.priceAnnual || plan.price * 12 * 0.7).toLocaleString("es-CL")}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => startPromo("specific_plan", plan.id)}
                            className="text-[10px] font-bold px-2.5 py-1 bg-white border border-gray-200 text-brand-blue rounded-md hover:bg-blue-50 transition-all cursor-pointer"
                          >
                            Descuento
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      ) : viewMode === "promos" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Percent className="w-5 h-5 text-gray-400" /> Promociones Dinámicas
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Las promociones activas descuentan automáticamente en todos los países, checkout y
                PDFs.
              </p>
            </div>
            {!showAdd && (
              <button
                onClick={() => startPromo("courses")}
                className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer border-none flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Nueva Promoción
              </button>
            )}
          </div>

          {promos.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
              <Percent className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-black text-gray-900 mb-1">
                Sin Promociones Configuradas
              </h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                Crea una promoción porcentual y se aplicará en todos los países y en los PDFs de los
                cursos.
              </p>
              <button
                onClick={() => startPromo("courses")}
                className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-all cursor-pointer border-none flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" /> Nueva Promoción
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {promos.map((promo) => {
                const isExpired = Boolean(
                  promo.valid_until && new Date(promo.valid_until).getTime() <= Date.now()
                );
                const isLive = promo.is_active && !isExpired;
                const courseMatch =
                  promo.target_type === "specific_course"
                    ? allCourses.find((c) => c.slug === promo.target_id)
                    : null;
                const planMatch =
                  promo.target_type === "specific_plan"
                    ? communityPlans.find((p) => p.id === promo.target_id)
                    : null;

                return (
                  <div
                    key={promo.id}
                    className={`relative bg-white rounded-2xl border ${
                      isLive
                        ? "border-brand-blue ring-1 ring-brand-blue/20 shadow-md"
                        : "border-gray-200 shadow-sm opacity-75"
                    } overflow-hidden flex flex-col`}
                  >
                    {isLive ? (
                      <div className="absolute top-0 right-0 py-1 px-3 bg-brand-blue text-white text-[10px] font-bold rounded-bl-xl shadow-sm z-10">
                        Activa
                      </div>
                    ) : isExpired ? (
                      <div className="absolute top-0 right-0 py-1 px-3 bg-amber-500 text-white text-[10px] font-bold rounded-bl-xl shadow-sm z-10">
                        Vencida
                      </div>
                    ) : null}
                    <div className="p-5 flex-1">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isLive ? "bg-blue-50 text-brand-blue" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <Percent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 leading-tight">{promo.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {promo.target_type === "courses"
                              ? "Todos los Cursos"
                              : promo.target_type === "plans"
                                ? "Todas las Membresías"
                                : promo.target_type === "all"
                                  ? "Toda la Tienda"
                                  : promo.target_type === "specific_course"
                                    ? `Curso: ${courseMatch?.title || promo.target_id}`
                                    : `Plan: ${planMatch?.name || promo.target_id}`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-gray-500 font-medium">
                            Descuento multipaís:
                          </span>
                          <span className="text-[10px] text-gray-400">
                            Todos los países y PDFs
                          </span>
                          {promo.promo_price ? (
                            <span className="text-[10px] text-blue-700 font-semibold">
                              Fijo Chile: ${promo.promo_price.toLocaleString("es-CL")} CLP
                            </span>
                          ) : null}
                          {promo.valid_until ? (
                            <span className="text-[10px] text-gray-500">
                              Vence:{" "}
                              {new Date(promo.valid_until).toLocaleDateString("es-CL", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          ) : null}
                        </div>
                        <span className="font-black text-xl text-emerald-600">
                          {promo.discount_percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-auto p-4 border-t border-gray-50 bg-gray-50/50">
                      <button
                        onClick={() => handleToggle(promo.id)}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer border-none ${
                          promo.is_active
                            ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {promo.is_active ? "Pausar" : "Reactivar"}
                      </button>
                      <button
                        onClick={() => startEditPromo(promo)}
                        className="py-2 px-3 rounded-xl text-[11px] font-bold bg-blue-50 text-brand-blue hover:bg-blue-100 transition-colors cursor-pointer border-none"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="py-2 px-3 rounded-xl text-[11px] font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer border-none"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-400" /> Cupones de Descuento
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Los cupones aplican en el checkout sobre la moneda local de cada país.
              </p>
            </div>
            {!showAdd && (
              <button
                onClick={() => {
                  setEditingCoupon(null);
                  setCouponCode("");
                  setCouponDiscount(10);
                  setCouponMaxUses("");
                  setCouponValidUntil("");
                  setShowAdd(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer border-none flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Nuevo Cupón
              </button>
            )}
          </div>

          {coupons.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-black text-gray-900 mb-1">Sin Cupones Configurados</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                No has configurado ningún cupón de descuento promocional.
              </p>
              <button
                onClick={() => {
                  setEditingCoupon(null);
                  setCouponCode("");
                  setCouponDiscount(10);
                  setCouponMaxUses("");
                  setCouponValidUntil("");
                  setShowAdd(true);
                }}
                className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-all cursor-pointer border-none flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" /> Crear Cupón
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`relative bg-white rounded-2xl border ${
                    coupon.is_active
                      ? "border-emerald-500 ring-1 ring-emerald-500/20 shadow-md"
                      : "border-gray-200 shadow-sm opacity-70"
                  } overflow-hidden flex flex-col`}
                >
                  {coupon.is_active && (
                    <div className="absolute top-0 right-0 py-1 px-3 bg-emerald-600 text-white text-[10px] font-bold rounded-bl-xl shadow-sm z-10">
                      Activo
                    </div>
                  )}
                  <div className="p-5 flex-1">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          coupon.is_active
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-mono font-black text-lg text-gray-900 leading-tight tracking-wider">
                          {coupon.code}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                          <span>
                            Usos: <strong>{coupon.used_count}</strong> /{" "}
                            {coupon.max_uses === null ? "∞" : coupon.max_uses}
                          </span>
                          {coupon.max_uses !== null && coupon.used_count >= coupon.max_uses && (
                            <span className="text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded text-[9px] uppercase">
                              Agotado
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Descuento
                          </span>
                          <span className="font-black text-xl text-emerald-600">
                            {coupon.discount_percentage}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                            Vence
                          </span>
                          <span className="text-xs font-semibold text-gray-600">
                            {coupon.valid_until
                              ? new Date(coupon.valid_until).toLocaleDateString("es-CL", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Sin vencimiento"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] flex items-center justify-between border-t border-gray-200/60 pt-2">
                        <span className="text-gray-400 font-semibold uppercase tracking-wider">
                          Acumulable con ofertas:
                        </span>
                        <span
                          className={`font-bold ${
                            coupon.allow_stacking ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {coupon.allow_stacking ? "Sí" : "No"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-[11px] px-1">
                      <span className="text-gray-400 font-bold uppercase tracking-wider block mb-1">
                        Cursos Permitidos:
                      </span>
                      {!coupon.applicable_courses || coupon.applicable_courses.length === 0 ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-100 text-[10px]">
                          ✨ Todos los Cursos
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {coupon.applicable_courses.map((slug: string) => {
                            const courseObj = availableCourses.find((c) => c.slug === slug);
                            return (
                              <span
                                key={slug}
                                className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md border border-purple-100 text-[10px]"
                              >
                                🎯 {courseObj?.title || slug}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-auto p-4 border-t border-gray-50 bg-gray-50/50">
                    <button
                      onClick={() => handleToggleCoupon(coupon.id)}
                      className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition-colors cursor-pointer border-none ${
                        coupon.is_active
                          ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                    >
                      {coupon.is_active ? "Pausar" : "Reactivar"}
                    </button>
                    <button
                      onClick={() => startEditCoupon(coupon)}
                      className="py-2 px-3 rounded-xl text-[11px] font-bold bg-blue-50 text-brand-blue hover:bg-blue-100 transition-colors cursor-pointer border-none flex items-center justify-center"
                      title="Editar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="py-2 px-3 rounded-xl text-[11px] font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer border-none flex items-center justify-center"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
