"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { ProductsContext } from "./ProductsContext";

interface ProductsProviderProps {
  children: React.ReactNode;
}

export default function ProductsProvider({ children }: ProductsProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
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

  const getProductById = (id: number): Product | undefined => {
    return products.find((product) => product.id === id);
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
