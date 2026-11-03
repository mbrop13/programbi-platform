import { testExcel } from "./excel";
import { testSql } from "./sql";
import type { TestNivel } from "./tipos";

export const TESTS_NIVEL: readonly TestNivel[] = [testSql, testExcel];

export function getTestNivel(tema: string): TestNivel | null {
  const encontrado = TESTS_NIVEL.find((test) => test.tema === tema);
  return encontrado ?? null;
}

export { testExcel, testSql };
export * from "./tipos";
