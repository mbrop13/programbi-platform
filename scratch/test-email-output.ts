import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
    }
  });
}

// Mock dynamic import paths
import { buildQuoteEmailHtml } from '../lib/email/quote-template';
import { staticSchedules } from '../lib/data/course-schedules';
import { courses as masterCourses } from '../lib/data/courses';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

function formatCLP(price: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price);
}

function calculateCoursePrice(
  slug: string,
  levelName: string,
  masterCoursesList: any[],
  priceOverridesList: any[],
  promotionsList: any[]
) {
  const masterCourse = masterCoursesList.find(c => c.slug === slug);
  if (!masterCourse) {
    return { finalPrice: 0, originalPrice: 0, hasDiscount: false };
  }
  
  let basePrice = 0;
  let originalPrice = 0;
  if (levelName) {
    const masterLevel = masterCourse.levels?.find((l: any) => 
      l.name.toLowerCase().includes(levelName.toLowerCase()) || 
      levelName.toLowerCase().includes(l.name.toLowerCase())
    );
    if (masterLevel) {
      basePrice = masterLevel.price || 0;
      originalPrice = masterLevel.originalPrice || basePrice;
    }
  } else if (masterCourse.levels && masterCourse.levels.length > 0) {
    basePrice = masterCourse.levels[0].price || 0;
    originalPrice = masterCourse.levels[0].originalPrice || basePrice;
  }

  if (slug === "analisis-de-datos" && (originalPrice === basePrice || !originalPrice)) {
    originalPrice = 747000;
  }

  const override = priceOverridesList.find(
    (o: any) => o.item_type === 'course' && o.item_id === slug && o.level_name === levelName
  );
  const effectiveBase = override ? override.price : basePrice;

  const promo = promotionsList.find(
    (pr: any) => pr.target_type === 'all' || pr.target_type === 'courses' || (pr.target_type === 'specific_course' && pr.target_id === slug)
  );

  if (promo) {
    if (promo.promo_price) {
      return { finalPrice: promo.promo_price, originalPrice: effectiveBase === basePrice ? originalPrice : effectiveBase, hasDiscount: true };
    }
    const ratio = (100 - promo.discount_percentage) / 100;
    const finalPrice = Math.round(effectiveBase * ratio);
    return { finalPrice, originalPrice: effectiveBase === basePrice ? originalPrice : effectiveBase, hasDiscount: true };
  }

  return { finalPrice: effectiveBase, originalPrice: effectiveBase === basePrice ? originalPrice : effectiveBase, hasDiscount: false };
}

function formatEmailDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const day = date.getDate();
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const month = months[date.getMonth()];
  return `${day} de ${month}`;
}

function formatEmailDays(daysStr: string): string {
  let res = daysStr.toLowerCase();
  res = res.replace("lunes y miércoles", "Lun y Mié");
  res = res.replace("lunes y miercoles", "Lun y Mié");
  res = res.replace("martes y jueves", "Mar y Jue");
  res = res.replace("sábado", "Sáb");
  res = res.replace("sabado", "Sáb");
  return res.charAt(0).toUpperCase() + res.slice(1);
}

function formatEmailTime(timeStr: string): string {
  const match = timeStr.match(/^(\d{1,2}:\d{2})/);
  return match ? match[1] : timeStr;
}

// Emulate nearest schedule selector
function getNearestSchedule(schedules: any[]): any | null {
  const now = new Date();
  const future = schedules
    .filter(s => new Date(s.start_date + "T12:00:00") >= now && s.is_active)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  return future[0] || null;
}

function getCourseScheduleString(
  slug: string,
  levelName: string,
  schedulesList: any[],
  staticList: any[],
  type: "basic" | "intermediate"
): string {
  const courseSchedules = schedulesList.filter(s => s.course_slug === slug && s.level_name === levelName);
  let sched = getNearestSchedule(courseSchedules);
  
  if (!sched) {
    const courseStatic = staticList.filter(s => s.course_slug === slug && s.level_name === levelName) as any[];
    sched = getNearestSchedule(courseStatic);
  }
  
  if (!sched) {
    const defaultSchedules: Record<string, { start_date: string, schedule_days: string, schedule_time: string, is_active: boolean }> = {
      "power-bi-Básico": { start_date: "2026-05-19", schedule_days: "Martes y Jueves", schedule_time: "19:30 a 21:30", is_active: true },
      "sql-server-Básico": { start_date: "2026-06-22", schedule_days: "Lunes y Miércoles", schedule_time: "19:30 a 21:30", is_active: true },
      "python-Básico": { start_date: "2026-05-25", schedule_days: "Lunes y Miércoles", schedule_time: "19:30 a 21:30", is_active: true },
      "power-bi-Intermedio": { start_date: "2026-05-25", schedule_days: "Lunes y Miércoles", schedule_time: "19:30 a 21:30", is_active: true },
      "sql-server-Intermedio": { start_date: "2026-06-22", schedule_days: "Lunes y Miércoles", schedule_time: "19:30 a 21:30", is_active: true },
      "python-Intermedio": { start_date: "2026-07-27", schedule_days: "Lunes y Miércoles", schedule_time: "19:30 a 21:30", is_active: true },
    };
    const key = `${slug}-${levelName}`;
    sched = defaultSchedules[key] as any;
  }
  
  if (!sched) {
    return type === "basic" ? "Próximamente · Consultar horarios" : "Próximamente";
  }

  const dateFormatted = formatEmailDate(sched.start_date);
  const daysFormatted = formatEmailDays(sched.schedule_days);
  
  if (type === "basic") {
    const timeFormatted = formatEmailTime(sched.schedule_time);
    return `${dateFormatted} · ${daysFormatted} · ${timeFormatted}`;
  } else {
    return `${dateFormatted} · ${daysFormatted}`;
  }
}

async function runTest() {
  console.log("Fetching Supabase records...");
  
  const [schRes, promoRes, overRes] = await Promise.all([
    supabase.from("course_schedules").select("*").eq("is_active", true),
    supabase.from("promotions").select("*").eq("is_active", true),
    supabase.from("price_overrides").select("*")
  ]);

  const schedules = schRes.data || [];
  let promotions = promoRes.data || [];
  const priceOverrides = overRes.data || [];

  const now = new Date().toISOString();
  promotions = promotions.filter((p: any) => !p.valid_until || p.valid_until > now);

  console.log("Found promotions:", promotions.length);
  console.log("Found price overrides:", priceOverrides.length);
  console.log("Found active schedules in DB:", schedules.length);

  // Selected Courses (Básicos de prueba)
  const basicCoursesSlugs = [
    { slug: "power-bi", title: "Power BI Básico", color: "#eab308" },
    { slug: "sql-server", title: "SQL Server Básico", color: "#ef4444" },
    { slug: "python", title: "Python Básico", color: "#3b82f6" },
  ];
  
  const selectedCourses = basicCoursesSlugs.map(item => {
    const pricing = calculateCoursePrice(item.slug, "Básico", masterCourses, priceOverrides, promotions);
    const dateStr = getCourseScheduleString(item.slug, "Básico", schedules, staticSchedules, "basic");
    return {
      slug: item.slug,
      title: "Curso de " + item.title.replace(" Básico", ""),
      levelName: "Nivel Básico",
      durationHours: 16,
      startDate: dateStr,
      originalPrice: formatCLP(pricing.originalPrice),
      finalPrice: formatCLP(pricing.finalPrice),
      hasDiscount: pricing.hasDiscount,
      color: item.color
    };
  });

  console.log("\n--- CALCULATED SELECTED COURSES ---");
  console.log(JSON.stringify(selectedCourses, null, 2));

  // Pack Info
  const packPricing = calculateCoursePrice("analisis-de-datos", "Básico", masterCourses, priceOverrides, promotions);
  const savingPercent = Math.round(((packPricing.originalPrice - packPricing.finalPrice) / packPricing.originalPrice) * 100);
  const packInfo = {
    showPackRecommendation: true,
    origPrice: formatCLP(packPricing.originalPrice),
    offerPrice: formatCLP(packPricing.finalPrice),
    savingPercent,
    url: "https://www.programbi.com/cursos/analisis-de-datos"
  };

  console.log("\n--- CALCULATED PACK INFO ---");
  console.log(JSON.stringify(packInfo, null, 2));

  const html = buildQuoteEmailHtml("Estudiante de Prueba", selectedCourses, packInfo);
  const outputPath = path.resolve(__dirname, 'test-email-rendered.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`\nHTML rendered and saved successfully to ${outputPath}`);
}

runTest().catch(console.error);

