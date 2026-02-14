"use client";

import { useState } from "react";
import { ProductCard } from "@/components/design";
import { useProducts } from "@/contexts/Products/ProductsContext";
import FiltersAndSearchBar from "@/components/layout/FiltersAndSearchBar";
import SearchModal from "@/components/layout/SearchModal";
import FiltersModal from "@/components/layout/FiltersModal";

export default function LandingPage() {
  const { products, isLoading, error } = useProducts();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleFilters = () => {
    setIsFiltersOpen(true);
  };

  return (
    <main className="min-h-screen bg-tg-bg text-tg-text px-3 py-3 pb-24">
      <div className="max-w-4xl mx-auto">
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-tg-hint">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <FiltersAndSearchBar onSearch={handleSearch} onFilters={handleFilters} />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </main>
  );
}
