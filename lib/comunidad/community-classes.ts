"use server";

import { revalidatePath } from "next/cache";
import { isCurrentUserAdmin } from "@/lib/supabase/comunidad";
import { createAdminClient } from "@/lib/supabase/server";
import {
  type CommunityClass,
  type CommunityClassLevel,
  isCommunityClassLevel,
} from "@/lib/comunidad/community-class";

const COURSE_SLUG = "comunidad";

type Row = {
  id: string;
  level_name: string | null;
  start_date: string;
  schedule_time: string | null;
  is_active?: boolean | null;
};

function padTime(value: string) {
  const [hour, minute] = value.split(":");
  return `${hour.padStart(2, "0")}:${minute}`;
}

function parseRange(value: string | null) {
  const match = value?.match(/(\d{1,2}:\d{2})\s*a\s*(\d{1,2}:\d{2})/i);
  if (!match) return { start: "19:30", end: "21:30" };
  return { start: padTime(match[1]), end: padTime(match[2]) };
}

function levelFromName(name: string | null): CommunityClassLevel {
  return name?.toLowerCase().includes("avanz") ? "avanzada" : "clase";
}

function mapRow(row: Row): CommunityClass {
  const time = parseRange(row.schedule_time);
  return {
    id: row.id,
    classDate: row.start_date.slice(0, 10),
    startTime: time.start,
    endTime: time.end,
    level: levelFromName(row.level_name),
    topic: null,
  };
}

function weekdayEs(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const label = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("es-CL", {
    weekday: "long",
    timeZone: "UTC",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export async function getCommunityClasses(): Promise<CommunityClass[]> {
  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("course_schedules")
    .select("id, level_name, start_date, schedule_time, is_active")
    .eq("course_slug", COURSE_SLUG)
    .eq("is_active", true)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("community classes:", error.message);
    return [];
  }

  return (data ?? []).map((row) => mapRow(row as Row));
}

function revalidateClasses() {
  revalidatePath("/comunidad");
  revalidatePath("/admin/clases");
}

function assertTime(value: string) {
  if (!/^\d{2}:\d{2}$/.test(value)) throw new Error("La hora tiene que ser HH:MM.");
}

export async function adminCreateCommunityClass(input: {
  classDate: string;
  startTime: string;
  endTime: string;
  level: CommunityClassLevel;
  topic: string;
}) {
  if (!(await isCurrentUserAdmin())) throw new Error("Solo administradores");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.classDate)) throw new Error("La fecha no es válida.");
  assertTime(input.startTime);
  assertTime(input.endTime);
  if (!isCommunityClassLevel(input.level)) throw new Error("Elige Clase o Clase avanzada.");
  if (input.endTime <= input.startTime) throw new Error("La hora de término tiene que ser después del inicio.");

  const adminDb = createAdminClient();
  const { error } = await adminDb.from("course_schedules").insert({
    course_slug: COURSE_SLUG,
    level_name: input.level === "avanzada" ? "Clase avanzada" : "Clase",
    start_date: input.classDate,
    schedule_days: weekdayEs(input.classDate),
    schedule_time: `${input.startTime} a ${input.endTime}`,
    duration_hours: 2,
    is_active: true,
  });
  if (error) throw new Error(error.message);
  revalidateClasses();
}

export async function adminDeleteCommunityClass(id: string) {
  if (!(await isCurrentUserAdmin())) throw new Error("Solo administradores");
  const adminDb = createAdminClient();
  const { error } = await adminDb
    .from("course_schedules")
    .delete()
    .eq("id", id)
    .eq("course_slug", COURSE_SLUG);
  if (error) throw new Error(error.message);
  revalidateClasses();
}
