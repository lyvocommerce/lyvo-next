/**
 * Импорт сгенерированного словаря в БД (upsert). Вызывается из scripts и из API.
 */
import type { PrismaClient } from "@prisma/client";
import type { SearchDictionaryExport } from "./types";

export async function importDictionaryToDb(
  prisma: PrismaClient,
  data: SearchDictionaryExport
): Promise<{ groups: number; terms: number }> {
  if (!data.groups || !Array.isArray(data.groups)) {
    throw new Error("Invalid format: expected { groups: [...] }");
  }
  let termCount = 0;
  for (const group of data.groups) {
    const code = group.code.trim().toLowerCase().slice(0, 100);
    if (!code) continue;
    const g = await prisma.searchConceptGroup.upsert({
      where: { code },
      create: { code },
      update: {},
    });
    for (const t of group.terms) {
      const term = t.term.trim().toLowerCase().slice(0, 255);
      if (!term) continue;
      await prisma.searchConceptTerm.upsert({
        where: { groupId_term: { groupId: g.id, term } },
        create: { groupId: g.id, term, lang: t.lang?.slice(0, 5) ?? null },
        update: { lang: t.lang?.slice(0, 5) ?? null },
      });
      termCount++;
    }
  }
  return { groups: data.groups.length, terms: termCount };
}
