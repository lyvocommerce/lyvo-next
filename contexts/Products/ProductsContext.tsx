"use client";

import { createContext, useContext } from "react";
import { Product } from "@/types/product";

interface ProductsContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  getProductById: (id: number) => Product | undefined;
}

export const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
