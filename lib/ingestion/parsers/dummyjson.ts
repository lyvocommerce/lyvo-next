import type { NormalizedProduct } from "../types";

type DummyJsonProduct = {
  id: number;
  title: string;
  description?: string;
  price?: number;
  category?: string;
  thumbnail?: string;
  images?: string[];
  rating?: number;
  currency?: string;
  price_currency?: string;
};

type DummyJsonResponse = {
  products?: DummyJsonProduct[];
  currency?: string;
};

const DEFAULT_CURRENCY = "EUR";

function normalizeCurrency(s: string | undefined): string {
  if (!s || typeof s !== "string") return DEFAULT_CURRENCY;
  const code = s.trim().toUpperCase();
  return code.length >= 3 ? code.slice(0, 3) : code || DEFAULT_CURRENCY;
}

export function parseDummyJsonResponse(
  data: unknown,
  merchantId: string,
  productBaseUrl: string,
  defaultCurrency?: string
): NormalizedProduct[] {
  const body = data as DummyJsonResponse;
  const list = body?.products;
  if (!Array.isArray(list)) return [];
  const base = productBaseUrl.replace(/\/$/, "");
  const fallback =
    defaultCurrency && defaultCurrency.toLowerCase() !== "auto"
      ? normalizeCurrency(defaultCurrency)
      : normalizeCurrency(body.currency) || DEFAULT_CURRENCY;

  return list.map((item: DummyJsonProduct) => {
    const id = String(item.id);
    const price = Number(item.price) ?? 0;
    const rating = item.rating;
    const itemCurrency = item.currency ?? item.price_currency;
    const currency = itemCurrency ? normalizeCurrency(itemCurrency) : fallback;
    return {
      id: `${merchantId}-${id}`,
      title: item.title ?? "",
      description: item.description ?? null,
      url: `${base}/products/${id}`,
      image_url: item.thumbnail ?? item.images?.[0] ?? null,
      price_min: price,
      price_max: null,
      currency,
      merchant_id: merchantId,
      category: item.category ?? null,
      lang: null,
      rating_rate: typeof rating === "number" ? rating : null,
      rating_count: null,
    };
  });
}
