/**
 * Módulo de contexto dinámico para el chatbot de ProgramBI.
 * 
 * Combina datos estáticos (cursos, planes, mentores) con datos dinámicos
 * de Supabase (horarios, promociones, sobrecargos de precio) para construir
 * un prompt de sistema compacto y eficiente en tokens.
 * 
 * Usa caché en memoria con TTL de 5 minutos para evitar consultar
 * Supabase en cada mensaje del chatbot.
 */

import { courses } from '@/lib/data/courses'
import { communityPlans } from '@/lib/data/community_plans'
import { mentors } from '@/lib/data/mentors'
import { createAdminClient } from '@/lib/supabase/server'

// ─── Tipos para datos dinámicos de Supabase ───
interface CourseSchedule {
  course_slug: string
  level_name: string
  start_date: string
  schedule_days: string
  schedule_time: string
  duration_hours: number
}

interface Promotion {
  name: string
  target_type: string
  target_id: string
  discount_percentage: number | null
  promo_price: number | null
  valid_until: string | null
}

interface PriceOverride {
  item_type: string
  item_id: string
  level_name: string | null
  price: number
}

// ─── Caché en memoria con TTL de 5 minutos ───
interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutos
let dynamicCache: CacheEntry<{
  schedules: CourseSchedule[]
  promotions: Promotion[]
  priceOverrides: PriceOverride[]
}> | null = null

/**
 * Obtiene los datos dinámicos de Supabase, usando caché si está vigente.
 */
async function fetchDynamicData() {
  // Retornar caché si es válido
  if (dynamicCache && Date.now() - dynamicCache.timestamp < CACHE_TTL_MS) {
    return dynamicCache.data
  }

  const supabase = createAdminClient()

  // Consultas en paralelo para mejor rendimiento
  const [schedulesRes, promotionsRes, priceOverridesRes] = await Promise.all([
    // Horarios activos
    supabase
      .from('course_schedules')
      .select('course_slug, level_name, start_date, schedule_days, schedule_time, duration_hours')
      .eq('is_active', true),

    // Promociones activas y vigentes
    supabase
      .from('promotions')
      .select('name, target_type, target_id, discount_percentage, promo_price, valid_until')
      .eq('is_active', true)
      .or('valid_until.is.null,valid_until.gt.' + new Date().toISOString()),

    // Sobrecargos de precio
    supabase
      .from('price_overrides')
      .select('item_type, item_id, level_name, price'),
  ])

  const data = {
    schedules: (schedulesRes.data as CourseSchedule[]) || [],
    promotions: (promotionsRes.data as Promotion[]) || [],
    priceOverrides: (priceOverridesRes.data as PriceOverride[]) || [],
  }

  // Actualizar caché
  dynamicCache = { data, timestamp: Date.now() }

  return data
}

// ─── Helpers para formateo compacto ───

/** Formatea precio CLP de manera legible: 299000 → "$299.000" */
function formatCLP(price: number): string {
  return '$' + price.toLocaleString('es-CL')
}

/** Formatea fecha ISO a formato corto: "2026-06-09" → "9 Jun" */
function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]}`
}

/**
 * Construye el contexto completo del chatbot.
 * Retorna un string compacto y estructurado con toda la información
 * necesaria para que el modelo responda con datos reales.
 */
export async function buildChatbotContext(): Promise<string> {
  // Obtener datos dinámicos (con caché)
  let dynamicData: Awaited<ReturnType<typeof fetchDynamicData>>

  try {
    dynamicData = await fetchDynamicData()
  } catch (error) {
    console.error('[Chatbot Context] Error al obtener datos dinámicos:', error)
    // Si falla Supabase, continuar solo con datos estáticos
    dynamicData = { schedules: [], promotions: [], priceOverrides: [] }
  }

  const { schedules, promotions, priceOverrides } = dynamicData

  // Crear mapa de sobrecargos de precio para acceso rápido
  const priceMap = new Map<string, number>()
  for (const po of priceOverrides) {
    const key = po.level_name
      ? `${po.item_type}:${po.item_id}:${po.level_name}`
      : `${po.item_type}:${po.item_id}`
    priceMap.set(key, po.price)
  }

  // Helper para obtener precio real (con override si existe)
  function getPrice(courseSlug: string, levelName: string, basePrice: number): number {
    const override = priceMap.get(`course:${courseSlug}:${levelName}`)
    return override ?? basePrice
  }

  // ═══════════════════════════════════════════
  // SECCIÓN 1: CATÁLOGO DE CURSOS
  // ═══════════════════════════════════════════
  const coursesSection = courses.map(c => {
    const techStr = c.techStack.join(', ')
    let line = `• ${c.title} [/${c.slug}] (${c.durationHours}h) — ${techStr}`

    if (c.levels && c.levels.length > 0) {
      const levelsStr = c.levels.map(l => {
        const price = getPrice(c.slug, l.name, l.price ?? 0)
        let s = `${l.name} ${formatCLP(price)}`
        if (l.originalPrice && l.originalPrice > price) {
          s += ` (antes ${formatCLP(l.originalPrice)})`
        }
        return s
      }).join(', ')
      line += `. Niveles: ${levelsStr}`
    }

    // Agregar descripción corta
    line += `\n  ${c.shortDescription}`

    return line
  }).join('\n')

  // ═══════════════════════════════════════════
  // SECCIÓN 2: HORARIOS PRÓXIMOS
  // ═══════════════════════════════════════════
  let schedulesSection = '(Sin horarios programados actualmente)'
  if (schedules.length > 0) {
    schedulesSection = schedules.map(s => {
      const course = courses.find(c => c.slug === s.course_slug)
      const courseName = course ? course.title : s.course_slug
      return `• ${courseName} ${s.level_name}: Inicia ${formatDate(s.start_date)}, ${s.schedule_days} ${s.schedule_time} (${s.duration_hours}h)`
    }).join('\n')
  }

  // ═══════════════════════════════════════════
  // SECCIÓN 3: PROMOCIONES ACTIVAS
  // ═══════════════════════════════════════════
  let promotionsSection = '(Sin promociones activas actualmente)'
  if (promotions.length > 0) {
    promotionsSection = promotions.map(p => {
      let line = `• ${p.name} → ${p.target_type}: ${p.target_id}`
      if (p.discount_percentage) line += `, ${p.discount_percentage}% dcto`
      if (p.promo_price) line += `, precio promo ${formatCLP(p.promo_price)}`
      if (p.valid_until) line += ` (hasta ${formatDate(p.valid_until)})`
      return line
    }).join('\n')
  }

  // ═══════════════════════════════════════════
  // SECCIÓN 4: PLANES COMUNIDAD
  // ═══════════════════════════════════════════
  const plansSection = communityPlans.map(p => {
    let line = `• ${p.name} — ${formatCLP(p.price)}/mes`
    if (p.priceSemiannual) line += `, semestral ${formatCLP(p.priceSemiannual)}`
    if (p.priceAnnual) line += `, anual ${formatCLP(p.priceAnnual)}`
    line += `. Acceso nivel ${p.courseAccessLevel}. ${p.discountPercentage}% dcto cursos extras.`
    line += `\n  Incluye: ${p.features.join(' | ')}`
    return line
  }).join('\n')

  // ═══════════════════════════════════════════
  // SECCIÓN 5: EQUIPO DE MENTORES
  // ═══════════════════════════════════════════
  const mentorsSection = mentors.map(m => {
    return `• ${m.name} — ${m.role} | ${m.title}. ${m.credentials.join(' ')}`
  }).join('\n')

  // ═══════════════════════════════════════════
  // ENSAMBLAR CONTEXTO FINAL
  // ═══════════════════════════════════════════
  return `=== CATÁLOGO DE CURSOS ===
${coursesSection}

=== HORARIOS PRÓXIMOS ===
${schedulesSection}

=== PROMOCIONES ACTIVAS ===
${promotionsSection}

=== PLANES COMUNIDAD ===
${plansSection}

=== EQUIPO DE MENTORES ===
${mentorsSection}`
}
