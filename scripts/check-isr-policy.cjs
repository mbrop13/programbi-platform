// Runs the real path planners, invalidation adapter, admin mutations and DST
// conversions without writing to a database or touching the production cache.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
function loader(mocks = {}, sourceOverrides = {}) {
  const modules = new Map();
  function load(file) {
    file = path.resolve(file);
    if (!path.extname(file)) file += ".ts";
    if (modules.has(file)) return modules.get(file).exports;
    const mod = { exports: {} };
    modules.set(file, mod);
    const source = sourceOverrides[file] ?? fs.readFileSync(file, "utf8");
    const js = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
      fileName: file,
    }).outputText;
    const localRequire = (name) => {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name.startsWith("@/")) return load(path.join(root, name.slice(2)));
      if (name.startsWith(".")) return load(path.resolve(path.dirname(file), name));
      return require(name);
    };
    new Function("require", "module", "exports", js)(localRequire, mod, mod.exports);
    return mod.exports;
  }
  return (relative) => load(path.join(root, relative));
}

async function main() {
  const invalidated = [];
  const load = loader({ "next/cache": { revalidatePath: (...args) => invalidated.push(args) } });
  const { PAISES_CARPETA } = load("config/paises.ts");
  const { courses } = load("lib/data/courses.ts");
  const { publicCoursePaths, publicSchedulePaths } = load("lib/cache/public-course-paths.ts");
  const prefixes = ["", ...PAISES_CARPETA.map((p) => `/${p.iso}`)];
  for (const course of courses) {
    const paths = publicCoursePaths(course.slug);
    assert.equal(paths.length, prefixes.length * 2);
    assert.equal(new Set(paths).size, paths.length);
    for (const prefix of prefixes) {
      assert(paths.includes(`${prefix}/cursos/${course.slug}`));
      assert(paths.includes(`${prefix}/cursos/${course.slug}/brochure`));
    }
    assert(paths.every((p) => !p.includes("[") && !p.includes("/guias")));
  }
  assert.deepEqual(publicCoursePaths("../admin"), []);
  assert.deepEqual(publicSchedulePaths("comunidad"), []);
  assert.deepEqual(publicCoursePaths("copilot-studio"), publicCoursePaths("copilot"));
  const schedules = publicSchedulePaths("python");
  for (const prefix of prefixes) {
    for (const suffix of ["", "/cursos", "/curso-python", "/cursos/analisis-de-datos/brochure"]) {
      assert(schedules.includes(`${prefix}${suffix}` || "/"));
    }
  }
  assert(!schedules.includes("/cursos/claude"));
  const adapter = load("lib/cache/revalidate-public-course.ts");
  adapter.revalidatePublicCourse("power-bi");
  assert.deepEqual(invalidated, publicCoursePaths("power-bi").map((p) => [p]));

  // Exercise the real server actions: no failed/unauthorized write should
  // invalidate public pages, and a successful edit must refresh all markets.
  let dbError = null;
  let isAdmin = true;
  const row = { slug: "python", course_slug: "python", is_active: true, id: "schedule-1" };
  const query = new Proxy({}, {
    get: (_, key) => key === "then"
      ? (resolve) => Promise.resolve({ data: row, error: dbError }).then(resolve)
      : () => query,
  });
  const db = { from: () => query };
  const mutationInvalidations = [];
  const mutationLoad = loader({
    "./server": { createClient: async () => db, createAdminClient: () => db },
    "./comunidad": { isCurrentUserAdmin: async () => isAdmin },
    "next/cache": { revalidatePath: (...args) => mutationInvalidations.push(args) },
  });
  const actions = mutationLoad("lib/supabase/comunidad-ai.ts");
  for (const action of [
    () => actions.adminUpdateCourseDescription("id", "Updated"),
    () => actions.adminUpdateCourseShortDescription("id", "Short"),
    () => actions.adminUpdateCourseMeta("id", { short_description: "Short" }),
    () => actions.adminUpsertPriceOverride({ item_type: "course", item_id: "python", level_name: "Básico", price: 100 }),
  ]) {
    mutationInvalidations.length = 0;
    await action();
    assert.deepEqual(mutationInvalidations.filter(([p]) => p.startsWith("/cursos") || p.includes("/cursos/")), publicCoursePaths("python").map((p) => [p]));
    mutationInvalidations.length = 0;
    dbError = { message: "write failed" };
    await assert.rejects(action, /write failed/);
    assert.equal(mutationInvalidations.length, 0);
    dbError = null;
    isAdmin = false;
    await assert.rejects(action, /administradores/);
    assert.equal(mutationInvalidations.length, 0);
    isAdmin = true;
  }
  for (const action of [
    () => actions.adminAddSchedule({ course_slug: "python" }),
    () => actions.adminDeleteSchedule("id"),
    () => actions.adminToggleScheduleActive("id"),
  ]) {
    mutationInvalidations.length = 0;
    await action();
    assert.deepEqual(mutationInvalidations, publicSchedulePaths("python").map((p) => [p]));
    mutationInvalidations.length = 0;
    dbError = { message: "write failed" };
    await assert.rejects(action, /write failed/);
    assert.equal(mutationInvalidations.length, 0);
    dbError = null;
  }

  let articleData = null;
  let articleError = { message: "Temporary upstream outage" };
  const articleQuery = new Proxy({}, {
    get: (_, key) => key === "then"
      ? (resolve) => Promise.resolve({ data: articleData, error: articleError }).then(resolve)
      : () => articleQuery,
  });
  const articleLoad = loader({
    "@/lib/supabase/server": { createAdminClient: () => ({ from: () => articleQuery }) },
  });
  const articles = articleLoad("lib/blog/data.ts");
  const oldErrorLogger = console.error;
  try {
    console.error = () => {};
    await assert.rejects(() => articles.getArticuloPorSlug("known-article"), /No se pudo cargar/);
    await assert.rejects(() => articles.getPublishedArticles(), /No se pudieron cargar/);
  } finally { console.error = oldErrorLogger; }
  articleError = null;
  assert.deepEqual(await articles.getArticuloPorSlug("missing"), { estado: "no_encontrado" });
  articleData = { slug: "known-article", title: "Published article" };
  assert.deepEqual(await articles.getArticuloPorSlug("known-article"), { estado: "ok", articulo: articleData });

  // Compare outputs to the previous implementation across both sides of DST.
  const file = path.join(root, "lib/paises/horarios.ts");
  const beforeSource = execFileSync("git", ["show", "2cac586:lib/paises/horarios.ts"], { cwd: root, encoding: "utf8" });
  const before = loader({}, { [file]: beforeSource })("lib/paises/horarios.ts");
  const after = load("lib/paises/horarios.ts");
  const dates = ["2026-01-15", "2026-04-04", "2026-04-05", "2026-07-15", "2026-09-05", "2026-09-06", "2026-11-11"];
  let comparisons = 0;
  for (const iso of ["cl", ...PAISES_CARPETA.map((p) => p.iso)]) {
    for (const day of dates) {
      const date = new Date(`${day}T12:00:00Z`);
      const expected = before.horarioLocal(iso, { referencia: date });
      const actual = after.horarioLocal(iso, { referencia: date });
      assert.deepEqual(actual, expected, `${iso} ${day}`);
      comparisons++;
    }
  }
  const reference = new Date("2026-11-11T12:00:00Z");
  const benchmark = (api) => {
    const start = performance.now();
    for (let i = 0; i < 60; i++) api.horarioLocal("pe", { referencia: reference });
    return performance.now() - start;
  };
  const oldMs = benchmark(before);
  const newMs = benchmark(after);
  console.log(JSON.stringify({
    result: "PASS", countries: prefixes.length, courseInvalidations: publicCoursePaths("python").length,
    previousBroadCourseInvalidations: courses.length * prefixes.length * 2,
    dstComparisons: comparisons, formatterBenchmark: { iterations: 60, beforeMs: Math.round(oldMs), afterMs: Math.round(newMs) },
  }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
