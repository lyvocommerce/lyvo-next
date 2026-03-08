/**
 * Seeds for multilingual search (EN + FI).
 * Run: npx tsx prisma/seed-search-synonyms.ts
 * Uses upsert: safe to run repeatedly.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CONCEPTS: { code: string; terms: { term: string; lang: string }[] }[] = [
  { code: "juice", terms: [{ term: "juice", lang: "en" }, { term: "mehu", lang: "fi" }, { term: "сок", lang: "ru" }] },
  { code: "milk", terms: [{ term: "milk", lang: "en" }, { term: "maito", lang: "fi" }] },
  { code: "bread", terms: [{ term: "bread", lang: "en" }, { term: "leipä", lang: "fi" }, { term: "leipa", lang: "fi" }] },
  { code: "fish", terms: [{ term: "fish", lang: "en" }, { term: "kala", lang: "fi" }] },
  { code: "meat", terms: [{ term: "meat", lang: "en" }, { term: "liha", lang: "fi" }] },
  { code: "cheese", terms: [{ term: "cheese", lang: "en" }, { term: "juusto", lang: "fi" }] },
  { code: "egg", terms: [{ term: "egg", lang: "en" }, { term: "eggs", lang: "en" }, { term: "muna", lang: "fi" }, { term: "munat", lang: "fi" }] },
  { code: "fruit", terms: [{ term: "fruit", lang: "en" }, { term: "fruits", lang: "en" }, { term: "hedelmä", lang: "fi" }, { term: "hedelmat", lang: "fi" }] },
  { code: "vegetable", terms: [{ term: "vegetable", lang: "en" }, { term: "vegetables", lang: "en" }, { term: "kasvis", lang: "fi" }, { term: "kasvikset", lang: "fi" }] },
  { code: "coffee", terms: [{ term: "coffee", lang: "en" }, { term: "kahvi", lang: "fi" }] },
  { code: "tea", terms: [{ term: "tea", lang: "en" }, { term: "tee", lang: "fi" }] },
  { code: "water", terms: [{ term: "water", lang: "en" }, { term: "vesi", lang: "fi" }] },
  { code: "yogurt", terms: [{ term: "yogurt", lang: "en" }, { term: "yoghurt", lang: "en" }, { term: "jogurtti", lang: "fi" }] },
  { code: "butter", terms: [{ term: "butter", lang: "en" }, { term: "voi", lang: "fi" }] },
  { code: "oil", terms: [{ term: "oil", lang: "en" }, { term: "öljy", lang: "fi" }, { term: "oljy", lang: "fi" }] },
  { code: "flour", terms: [{ term: "flour", lang: "en" }, { term: "jauho", lang: "fi" }, { term: "jauhot", lang: "fi" }] },
  { code: "sugar", terms: [{ term: "sugar", lang: "en" }, { term: "sokeri", lang: "fi" }] },
  { code: "candy", terms: [{ term: "candy", lang: "en" }, { term: "candies", lang: "en" }, { term: "karkki", lang: "fi" }, { term: "karkit", lang: "fi" }] },
  { code: "cookie", terms: [{ term: "cookie", lang: "en" }, { term: "cookies", lang: "en" }, { term: "keksi", lang: "fi" }, { term: "keksit", lang: "fi" }] },
  { code: "pizza", terms: [{ term: "pizza", lang: "en" }, { term: "pizza", lang: "fi" }] },
  { code: "pasta", terms: [{ term: "pasta", lang: "en" }, { term: "pasta", lang: "fi" }, { term: "makaronit", lang: "fi" }] },
  { code: "rice", terms: [{ term: "rice", lang: "en" }, { term: "riisi", lang: "fi" }] },
  { code: "chicken", terms: [{ term: "chicken", lang: "en" }, { term: "kana", lang: "fi" }] },
  { code: "sausage", terms: [{ term: "sausage", lang: "en" }, { term: "sausages", lang: "en" }, { term: "makkara", lang: "fi" }, { term: "makkarat", lang: "fi" }] },
  { code: "ice cream", terms: [{ term: "ice cream", lang: "en" }, { term: "jäätelö", lang: "fi" }, { term: "jaatelo", lang: "fi" }] },
  { code: "honey", terms: [{ term: "honey", lang: "en" }, { term: "hunaja", lang: "fi" }] },
  { code: "book", terms: [{ term: "book", lang: "en" }, { term: "books", lang: "en" }, { term: "kirja", lang: "fi" }, { term: "kirjat", lang: "fi" }] },
  { code: "toy", terms: [{ term: "toy", lang: "en" }, { term: "toys", lang: "en" }, { term: "lelu", lang: "fi" }, { term: "lelut", lang: "fi" }] },
  { code: "wine", terms: [{ term: "wine", lang: "en" }, { term: "wines", lang: "en" }, { term: "viini", lang: "fi" }, { term: "viinit", lang: "fi" }] },
  { code: "beer", terms: [{ term: "beer", lang: "en" }, { term: "beers", lang: "en" }, { term: "olut", lang: "fi" }] },
];

async function main() {
  console.log("Seeding search synonym groups (EN + FI)...");
  for (const { code, terms } of CONCEPTS) {
    const group = await prisma.searchConceptGroup.upsert({
      where: { code },
      create: { code },
      update: {},
    });
    for (const { term, lang } of terms) {
      await prisma.searchConceptTerm.upsert({
        where: { groupId_term: { groupId: group.id, term: term.toLowerCase().trim() } },
        create: { groupId: group.id, term: term.toLowerCase().trim(), lang },
        update: { lang },
      });
    }
  }
  console.log(`Done: ${CONCEPTS.length} concept groups.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
