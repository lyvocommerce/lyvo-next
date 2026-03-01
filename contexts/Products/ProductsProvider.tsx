"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { ProductsContext } from "./ProductsContext";

interface ProductsProviderProps {
  children: React.ReactNode;
}

/** Catalog API product shape (Prisma / DB). Decimals may serialize as string. */
type CatalogProduct = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
  price_min?: number | string | null;
  price_max?: number | string | null;
  currency: string | null;
  merchant_id: string | null;
  category: string | null;
  lang: string | null;
  rating_rate?: number | null;
  rating_count?: number | null;
  created_at: string | null;
};

function mapCatalogToProduct(row: CatalogProduct): Product {
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

export default function ProductsProvider({ children }: ProductsProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/catalog/products?limit=100&page=1");
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const msg = typeof data?.error === "string" ? data.error : "Failed to fetch products";
          throw new Error(msg);
        }
        const list = Array.isArray(data.products) ? data.products : [];
        setProducts(list.map((row: CatalogProduct) => mapCatalogToProduct(row)));
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const getProductById = (id: number | string): Product | undefined => {
    const key = String(id);
    return products.find((product) => String(product.id) === key);
  };

  const value = {
    products,
    isLoading,
    error,
    getProductById,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}
