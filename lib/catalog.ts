import type { Product } from "@/types/product";

/** Product row as returned from Prisma (products table). */
export type DbProduct = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
  price_min?: unknown;
  price_max?: unknown;
  currency: string | null;
  category: string | null;
  rating_rate?: number | null;
  rating_count?: number | null;
};

/**
 * Map a DB/catalog product row to the frontend Product type.
 * Handles Decimal (serialized as number or string) for price.
 */
export function mapDbProductToProduct(row: DbProduct): Product {
  const price = row.price_min ?? row.price_max ?? 0;
  const priceNum = typeof price === "number" ? price : Number(price) || 0;
  const rate = row.rating_rate != null ? Number(row.rating_rate) : 0;
  const count = row.rating_count != null ? Number(row.rating_count) : 0;
  return {
    id: row.id,
    title: row.title,
    price: priceNum,
    currency: row.currency ?? null,
    description: row.description ?? "",
    category: row.category ?? "",
    image: row.image_url ?? "",
    rating: { rate, count },
  };
}
