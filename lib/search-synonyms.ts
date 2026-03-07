import { prisma } from "@/lib/prisma";

/**
 * Возвращает список терминов для поиска: исходный запрос + все термины из групп синонимов.
 * Если таблица синонимов недоступна (старый Prisma client / миграция не применена), возвращает только запрос.
 */
export async function getSearchTerms(query: string): Promise<string[]> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  try {
    const terms = await prisma.searchConceptTerm.findMany({
      where: { term: normalized },
      include: { group: true },
    });

    if (terms.length === 0) {
      return [normalized];
    }

    const groupIds = Array.from(new Set(terms.map((t) => t.groupId)));
    const allTermsInGroups = await prisma.searchConceptTerm.findMany({
      where: { groupId: { in: groupIds } },
      select: { term: true },
    });

    const unique = new Set<string>([normalized]);
    for (const { term } of allTermsInGroups) {
      unique.add(term);
    }
    return Array.from(unique);
  } catch {
    return [normalized];
  }
}
