import type { NormalizedProduct } from "../types";

type FakeStoreItem = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export function parseFakeStoreResponse(
  data: unknown,
  merchantId: string,
  productBaseUrl: string
): NormalizedProduct[] {
  if (!Array.isArray(data)) return [];
  const base = productBaseUrl.replace(/\/$/, "");
  return data.map((item: FakeStoreItem) => {
    const id = String(item.id);
    return {
      id: `${merchantId}-${id}`,
      title: item.title ?? "",
      description: item.description ?? null,
      url: `${base}/products/${id}`,
      image_url: item.image ?? null,
      price_min: Number(item.price) ?? 0,
      price_max: null,
      currency: "EUR",
      merchant_id: merchantId,
      category: item.category ?? null,
      lang: null,
    };
  });
}
