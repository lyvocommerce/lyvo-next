/**
 * Поиск товаров по названию и описанию (pg_trgm + ILIKE).
 * Поддержка синонимов EN/FI: запрос расширяется по таблице search_concept_terms.
 *
 * Интеграция AI-поиска (гибрид): добавить колонку embedding (pgvector), объединить
 * keyword_score с vector_score.
 */
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapDbProductToProduct, type DbProduct } from "@/lib/catalog";
import { getSearchTerms } from "@/lib/search-synonyms";

export const dynamic = "force-dynamic";

const SIMILARITY_THRESHOLD = 0.2;

/** Веса релевантности. Для гибрида с AI: добавить score от vector similarity. */
const TITLE_MATCH_WEIGHT = 2.0;
const TITLE_SIMILARITY_WEIGHT = 1.0;
const DESCRIPTION_MATCH_WEIGHT = 0.3;

/** Экранирует строку для использования внутри regex (PostgreSQL). */
function escapeRegex(s: string): string {
  return s.replace(/[\\.*+?^${}()|[\]-]/g, "\\$&");
}

/** Паттерн для совпадения целого слова (границы слова в PostgreSQL: \m и \M). */
function wordBoundaryPattern(term: string): string {
  return "\\m" + escapeRegex(term) + "\\M";
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q")?.trim() ?? "";
    const categorySlug = searchParams.get("category_slug")?.trim() || null;
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));

    if (!q) {
      return NextResponse.json({ products: [], pagination: { total: 0 } });
    }

    const qWordPattern = wordBoundaryPattern(q);
    const searchTerms = await getSearchTerms(q);
    const synonymTitleConditions = searchTerms.map((t) =>
      Prisma.sql`title ~* ${wordBoundaryPattern(t)}`
    );
    const synonymDescConditions = searchTerms.map((t) =>
      Prisma.sql`(description IS NOT NULL AND description ~* ${wordBoundaryPattern(t)})`
    );
    const synonymTitleOr =
      synonymTitleConditions.length > 0
        ? Prisma.join(synonymTitleConditions, " OR ")
        : Prisma.sql`FALSE`;
    const synonymDescOr =
      synonymDescConditions.length > 0
        ? Prisma.join(synonymDescConditions, " OR ")
        : Prisma.sql`FALSE`;

    const categoryFilter = categorySlug ? Prisma.sql`AND category = ${categorySlug}` : Prisma.sql``;

    try {
      // Поиск: исходный запрос (similarity + ILIKE) ИЛИ совпадение по любому синониму.
      const raw = await prisma.$queryRaw<
        Array<{
          id: string;
          title: string;
          description: string | null;
          url: string;
          image_url: string | null;
          price_min: unknown;
          price_max: unknown;
          currency: string | null;
          merchant_id: string | null;
          category: string | null;
          lang: string | null;
          rating_rate: number | null;
          rating_count: number | null;
          created_at: Date | null;
        }>
      >`
        SELECT id, title, description, url, image_url, price_min, price_max, currency,
               merchant_id, category, lang, rating_rate, rating_count, created_at
        FROM products
        WHERE (
          similarity(title, ${q}) > ${SIMILARITY_THRESHOLD}
          OR title ~* ${qWordPattern}
          OR (description IS NOT NULL AND (similarity(description, ${q}) > ${SIMILARITY_THRESHOLD} OR description ~* ${qWordPattern}))
          OR (${synonymTitleOr})
          OR (${synonymDescOr})
        ) ${categoryFilter}
        ORDER BY (
          (CASE WHEN title ~* ${qWordPattern} THEN ${TITLE_MATCH_WEIGHT} ELSE 0 END)
          + COALESCE(similarity(title, ${q}), 0) * ${TITLE_SIMILARITY_WEIGHT}
          + (CASE WHEN description IS NOT NULL AND description ~* ${qWordPattern} THEN ${DESCRIPTION_MATCH_WEIGHT} ELSE 0 END)
        ) DESC NULLS LAST, created_at DESC NULLS LAST
        LIMIT ${limit}
      `;

      const mapped = raw.map((row) => mapDbProductToProduct(row as DbProduct));

      return NextResponse.json({
        products: mapped,
        pagination: { total: mapped.length },
      });
    } catch (pgError) {
      // Если pg_trgm недоступен — поиск по подстроке (title + description) с учётом синонимов
      const msg = pgError instanceof Error ? pgError.message : String(pgError);
      if (!msg.includes("similarity") && !msg.includes("function")) {
        throw pgError;
      }

      const orConditions = searchTerms.flatMap((term) => [
        { title: { contains: term, mode: "insensitive" as const } },
        { description: { contains: term, mode: "insensitive" as const } },
      ]);

      const whereClause = categorySlug
        ? { OR: orConditions, category: categorySlug }
        : { OR: orConditions };

      const products = await prisma.products.findMany({
        where: whereClause,
        orderBy: { created_at: "desc" },
        take: limit,
      });

      const mapped = products.map((row) => mapDbProductToProduct(row as unknown as DbProduct));

      return NextResponse.json({
        products: mapped,
        pagination: { total: mapped.length },
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Search error";
    console.error("[api/search] GET error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
