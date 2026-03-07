/**
 * Ядро генерации словаря: вызывается из scripts/generate-search-dictionary.ts и из API.
 */
import type { PrismaClient } from "@prisma/client";
import { CATEGORY_EN_TO_FI, STATIC_PRODUCT_CONCEPTS } from "./en-fi-concepts";
import { normalizeTerm, dedupeTerms } from "./normalize";
import type { ConceptGroup, SearchDictionaryExport } from "./types";

export async function generateDictionaryFromDb(prisma: PrismaClient): Promise<SearchDictionaryExport> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { name: true, slug: true },
    orderBy: [{ level: "asc" }, { displayOrder: "asc" }],
  });

  const categoryGroups = buildCategoryGroups(categories);
  const staticGroups: ConceptGroup[] = STATIC_PRODUCT_CONCEPTS.map((c) => ({
    code: c.code,
    terms: dedupeTerms(c.terms),
  }));
  const merged = mergeGroups(categoryGroups, staticGroups);

  return {
    version: "1.0",
    generatedAt: new Date().toISOString(),
    groups: merged,
  };
}

function buildCategoryGroups(categories: { name: string; slug: string }[]): ConceptGroup[] {
  const groups: ConceptGroup[] = [];
  for (const cat of categories) {
    const terms: { term: string; lang: string }[] = [];
    const nameNorm = normalizeTerm(cat.name);
    if (nameNorm) terms.push({ term: nameNorm, lang: "en" });
    const slugNorm = normalizeTerm(cat.slug.replace(/-/g, " "));
    if (slugNorm && slugNorm !== nameNorm) terms.push({ term: slugNorm, lang: "en" });
    const slugParts = cat.slug.split("-").map((p) => normalizeTerm(p)).filter(Boolean);
    for (const p of slugParts) {
      if (p.length >= 2 && !terms.some((t) => t.term === p)) terms.push({ term: p, lang: "en" });
    }
    const fiTerms = CATEGORY_EN_TO_FI[cat.slug];
    if (fiTerms) {
      for (const fi of fiTerms) {
        const t = normalizeTerm(fi);
        if (t) terms.push({ term: t, lang: "fi" });
      }
    }
    const deduped = dedupeTerms(terms);
    if (deduped.length > 0) {
      groups.push({ code: cat.slug, terms: deduped });
    }
  }
  return groups;
}

function mergeGroups(categoryGroups: ConceptGroup[], staticGroups: ConceptGroup[]): ConceptGroup[] {
  const byCode = new Map<string, ConceptGroup>();
  for (const g of categoryGroups) {
    byCode.set(g.code, { code: g.code, terms: [...g.terms] });
  }
  for (const g of staticGroups) {
    const existing = byCode.get(g.code);
    if (existing) {
      const combined = dedupeTerms([...existing.terms, ...g.terms]);
      byCode.set(g.code, { code: g.code, terms: combined });
    } else {
      byCode.set(g.code, { code: g.code, terms: dedupeTerms(g.terms) });
    }
  }
  return Array.from(byCode.values());
}
