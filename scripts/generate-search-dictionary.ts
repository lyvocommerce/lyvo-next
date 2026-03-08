/**
 * Generate search dictionary from DB (categories) and static EN/FI dictionary.
 * Run: npx tsx scripts/generate-search-dictionary.ts
 * Output: data/search-dictionary.json (for import via scripts/import-search-dictionary.ts).
 */
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { generateDictionaryFromDb } from "../lib/search-dictionary/generate";

const prisma = new PrismaClient();

async function main() {
  console.log("Generating search dictionary from DB and static EN/FI concepts...");
  const exportData = await generateDictionaryFromDb(prisma);
  console.log(`Merged total groups: ${exportData.groups.length}`);

  const outDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "search-dictionary.json");
  fs.writeFileSync(outPath, JSON.stringify(exportData, null, 2), "utf-8");
  console.log(`Written: ${outPath}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
