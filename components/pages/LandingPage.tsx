"use client";

import { useState } from "react";
import { ProductCard } from "@/components/design";
import { useProducts } from "@/contexts/Products/ProductsContext";
import { useSideMenu } from "@/contexts/SideMenu/SideMenuContext";
import FiltersAndSearchBar from "@/components/layout/FiltersAndSearchBar";
import SearchModal from "@/components/layout/SearchModal";
import FiltersModal from "@/components/layout/FiltersModal";
import CategoryTiles from "@/components/layout/CategoryTiles";

export default function LandingPage() {
  const { products, isLoading, error } = useProducts();
  const sideMenu = useSideMenu();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleFilters = () => {
    setIsFiltersOpen(true);
  };

  return (
    <main className="min-h-screen bg-tg-bg text-tg-text py-3 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Остальные компоненты: 16px от края */}
        <div className="px-4">
          <CategoryTiles />
        </div>

        {isLoading && (
          <div className="px-4 text-center py-12">
            <p className="text-tg-hint">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="px-4 text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Сетка карточек товаров: 0px от края экрана */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-x-1 gap-y-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <FiltersAndSearchBar
        onSearch={handleSearch}
        onFilters={handleFilters}
        onMenu={sideMenu?.openMenu}
      />
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
