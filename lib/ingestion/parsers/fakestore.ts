import type { NormalizedProduct } from "../types";

type FakeStoreItem = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate?: number; count?: number };
  currency?: string;
  price_currency?: string;
};

const DEFAULT_CURRENCY = "EUR";

function normalizeCurrency(s: string | undefined): string {
  if (!s || typeof s !== "string") return DEFAULT_CURRENCY;
  const code = s.trim().toUpperCase();
  return code.length >= 3 ? code.slice(0, 3) : code || DEFAULT_CURRENCY;
}

export function parseFakeStoreResponse(
  data: unknown,
  merchantId: string,
  productBaseUrl: string,
  defaultCurrency?: string
): NormalizedProduct[] {
  if (!Array.isArray(data)) return [];
  const base = productBaseUrl.replace(/\/$/, "");
  const fallback =
    defaultCurrency && defaultCurrency.toLowerCase() !== "auto"
      ? normalizeCurrency(defaultCurrency)
      : DEFAULT_CURRENCY;

  return data.map((item: FakeStoreItem) => {
    const id = String(item.id);
    const rating = item.rating;
    const itemCurrency = item.currency ?? item.price_currency;
    const currency = itemCurrency ? normalizeCurrency(itemCurrency) : fallback;
    return {
      id: `${merchantId}-${id}`,
      title: item.title ?? "",
      description: item.description ?? null,
      url: `${base}/products/${id}`,
      image_url: item.image ?? null,
      price_min: Number(item.price) ?? 0,
      price_max: null,
      currency,
      merchant_id: merchantId,
      category: item.category ?? null,
      lang: null,
      rating_rate: typeof rating?.rate === "number" ? rating.rate : null,
      rating_count: typeof rating?.count === "number" ? rating.count : null,
    };
  });
}
