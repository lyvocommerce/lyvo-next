/**
 * POST /api/admin/search-dictionary/regenerate
 * Перестраивает поисковый словарь из категорий БД и статического EN/FI словаря,
 * затем импортирует его в search_concept_groups и search_concept_terms.
 * Вызывать после добавления категорий или при обновлении статического словаря.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDictionaryFromDb } from "@/lib/search-dictionary/generate";
import { importDictionaryToDb } from "@/lib/search-dictionary/import-to-db";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const data = await generateDictionaryFromDb(prisma);
    const result = await importDictionaryToDb(prisma, data);
    return NextResponse.json({
      success: true,
      generatedAt: data.generatedAt,
      groups: result.groups,
      terms: result.terms,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Regenerate failed";
    console.error("[admin/search-dictionary/regenerate]", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
