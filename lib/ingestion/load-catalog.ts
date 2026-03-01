import { prisma } from "@/lib/prisma";
import { getActiveCategorySlugs } from "@/lib/categories";
import type { NormalizedProduct } from "./types";
import { resolveCategory } from "./resolve-category";
import { parseFakeStoreResponse } from "./parsers/fakestore";
import { parseDummyJsonResponse } from "./parsers/dummyjson";

type UrlParams = { feedUrl?: string };

function isFakeStoreUrl(url: string): boolean {
  return /fakestoreapi\.com/i.test(url);
}

function isDummyJsonUrl(url: string): boolean {
  return /dummyjson\.com/i.test(url);
}

export async function loadCatalogForMerchant(merchantId: string): Promise<{
  ok: boolean;
  ingested: number;
  error?: string;
}> {
  const merchant = await prisma.merchants.findUnique({
    where: { id: merchantId },
  });
  if (!merchant) {
    return { ok: false, ingested: 0, error: "Merchant not found" };
  }

  const type = merchant.connection_type ?? "url";
  if (type !== "url") {
    return {
      ok: false,
      ingested: 0,
      error: `Connection type "${type}" is not implemented yet`,
    };
  }

  const params = merchant.connection_params as UrlParams | null;
  const feedUrl = params?.feedUrl;
  if (!feedUrl || typeof feedUrl !== "string") {
    return { ok: false, ingested: 0, error: "Missing feedUrl in connection_params" };
  }

  let response: Response;
  try {
    response = await fetch(feedUrl);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Fetch failed";
    return { ok: false, ingested: 0, error: msg };
  }
  if (!response.ok) {
    return {
      ok: false,
      ingested: 0,
      error: `Feed returned ${response.status}`,
    };
  }

  const raw = await response.json();
  const homeUrl = merchant.home_url ?? new URL(feedUrl).origin;
  let rows: NormalizedProduct[];

  if (isFakeStoreUrl(feedUrl)) {
    rows = parseFakeStoreResponse(raw, merchantId, homeUrl);
  } else if (isDummyJsonUrl(feedUrl)) {
    rows = parseDummyJsonResponse(raw, merchantId, homeUrl);
  } else {
    return {
      ok: false,
      ingested: 0,
      error: "Unknown feed format; supported: FakeStore, DummyJSON",
    };
  }

  if (rows.length === 0) {
    return { ok: true, ingested: 0 };
  }

  await resolveCategoriesForProducts(rows);
  await ingestProducts(merchantId, rows);
  return { ok: true, ingested: rows.length };
}

/**
 * Resolve each product's category to a valid Category.slug from DB (or null).
 * Mutates rows in place. Call before ingestProducts so only valid slugs are persisted.
 */
export async function resolveCategoriesForProducts(
  rows: NormalizedProduct[]
): Promise<void> {
  const validSlugs = await getActiveCategorySlugs();
  for (const row of rows) {
    row.category = resolveCategory(row.category, validSlugs);
  }
}

/** Default transaction timeout for ingest (ms). Single upsert can be ~150–200ms over network; 60s allows hundreds of products. */
const INGEST_TRANSACTION_TIMEOUT_MS = 60_000;

/** Persist normalized products for a merchant (replaces existing products for that merchant). */
export async function ingestProducts(
  merchantId: string,
  rows: NormalizedProduct[]
): Promise<void> {
  if (rows.length === 0) return;
  await prisma.$transaction(
    async (tx) => {
      await tx.products.deleteMany({ where: { merchant_id: merchantId } });
      for (const p of rows) {
        await tx.products.upsert({
          where: { id: p.id },
          create: {
            id: p.id,
            title: p.title,
            description: p.description,
            url: p.url,
            image_url: p.image_url,
            price_min: p.price_min,
            price_max: p.price_max,
            currency: p.currency,
            merchants: { connect: { id: p.merchant_id } },
            category: p.category,
            lang: p.lang,
            rating_rate: p.rating_rate ?? undefined,
            rating_count: p.rating_count ?? undefined,
          },
          update: {
            title: p.title,
            description: p.description,
            url: p.url,
            image_url: p.image_url,
            price_min: p.price_min,
            price_max: p.price_max,
            currency: p.currency,
            category: p.category,
            lang: p.lang,
            rating_rate: p.rating_rate ?? undefined,
            rating_count: p.rating_count ?? undefined,
          },
        });
      }
    },
    { timeout: INGEST_TRANSACTION_TIMEOUT_MS }
  );
}

/**
 * Parse raw JSON (from file or response) into normalized products.
 * Supports: array (FakeStore) or object with .products array (DummyJSON).
 * @param currency - Optional. "auto" or empty = try from JSON (root or per-product), else use this (e.g. "EUR", "USD").
 */
export function parseCatalogFromRawJson(
  raw: unknown,
  merchantId: string,
  productBaseUrl: string,
  currency?: string
): NormalizedProduct[] {
  const base = productBaseUrl.replace(/\/$/, "");
  if (Array.isArray(raw)) {
    return parseFakeStoreResponse(raw, merchantId, base, currency);
  }
  if (raw && typeof raw === "object" && "products" in raw && Array.isArray((raw as { products: unknown }).products)) {
    return parseDummyJsonResponse(raw, merchantId, base, currency);
  }
  return [];
}
