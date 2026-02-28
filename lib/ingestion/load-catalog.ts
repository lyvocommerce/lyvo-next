import { prisma } from "@/lib/prisma";
import type { NormalizedProduct } from "./types";
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

  await prisma.$transaction(async (tx) => {
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
          merchant_id: p.merchant_id,
          category: p.category,
          lang: p.lang,
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
        },
      });
    }
  });

  return { ok: true, ingested: rows.length };
}
