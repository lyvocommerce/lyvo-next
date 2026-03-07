/**
 * Импорт поискового словаря из data/search-dictionary.json в БД.
 * Запуск: npx tsx scripts/import-search-dictionary.ts
 * Файл генерируется: npx tsx scripts/generate-search-dictionary.ts
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { importDictionaryToDb } from "../lib/search-dictionary/import-to-db";
import type { SearchDictionaryExport } from "../lib/search-dictionary/types";

const prisma = new PrismaClient();

async function main() {
  const p = path.join(process.cwd(), "data", "search-dictionary.json");
  if (!fs.existsSync(p)) {
    console.error("File not found: data/search-dictionary.json. Run generate-search-dictionary.ts first.");
    process.exit(1);
  }
  const raw = fs.readFileSync(p, "utf-8");
  const data = JSON.parse(raw) as SearchDictionaryExport;
  const { groups, terms } = await importDictionaryToDb(prisma, data);
  console.log(`Done: ${groups} groups, ${terms} terms.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
