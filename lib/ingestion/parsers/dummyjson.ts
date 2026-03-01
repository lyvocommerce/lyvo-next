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
};

type DummyJsonResponse = {
  products?: DummyJsonProduct[];
};

export function parseDummyJsonResponse(
  data: unknown,
  merchantId: string,
  productBaseUrl: string
): NormalizedProduct[] {
  const body = data as DummyJsonResponse;
  const list = body?.products;
  if (!Array.isArray(list)) return [];
  const base = productBaseUrl.replace(/\/$/, "");
  return list.map((item: DummyJsonProduct) => {
    const id = String(item.id);
    const price = Number(item.price) ?? 0;
    const rating = item.rating;
    return {
      id: `${merchantId}-${id}`,
      title: item.title ?? "",
      description: item.description ?? null,
      url: `${base}/products/${id}`,
      image_url: item.thumbnail ?? item.images?.[0] ?? null,
      price_min: price,
      price_max: null,
      currency: "EUR",
      merchant_id: merchantId,
      category: item.category ?? null,
      lang: null,
      rating_rate: typeof rating === "number" ? rating : null,
      rating_count: null,
    };
  });
}
