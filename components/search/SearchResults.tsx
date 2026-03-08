"use client";

import { Product } from "@/types/product";
import SearchResultItem from "./SearchResultItem";

interface SearchResultsProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  query: string;
  className?: string;
}

export default function SearchResults({
  products,
  isLoading,
  error,
  query,
  className = "",
}: SearchResultsProps) {
  if (error) {
    return (
      <div
        className={`flex items-center justify-center py-8 px-4 text-tg-hint text-sm ${className}`}
      >
        {error}
      </div>
    );
  }

  if (isLoading && products.length === 0) {
    return (
      <div
        className={`flex items-center justify-center py-8 px-4 text-tg-hint text-sm ${className}`}
      >
        Search…
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div
        className={`flex items-center justify-center py-8 px-4 text-tg-hint text-sm ${className}`}
      >
        Enter search query
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className={`flex items-center justify-center py-8 px-4 text-tg-hint text-sm ${className}`}
      >
        No results found
      </div>
    );
  }

  return (
    <ul className={`space-y-2 list-none p-0 m-0 ${className}`}>
      {products.map((product) => (
        <li key={product.id}>
          <SearchResultItem product={product} />
        </li>
      ))}
    </ul>
  );
}
