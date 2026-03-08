"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/design";
import { useProducts } from "@/contexts/Products/ProductsContext";
import { useSideMenu } from "@/contexts/SideMenu/SideMenuContext";
import { useOverlayBack } from "@/contexts/OverlayBack/OverlayBackContext";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";
import { useProductSearch } from "@/hooks/useProductSearch";
import FiltersAndSearchBar from "@/components/layout/FiltersAndSearchBar";
import {
  SearchOverlay,
  StickySearchBar,
  SearchResults,
} from "@/components/search";
import FiltersModal from "@/components/layout/FiltersModal";
import CategoryTiles from "@/components/layout/CategoryTiles";

export default function LandingPage() {
  const router = useRouter();
  const { products, isLoading, error } = useProducts();
  const sideMenu = useSideMenu();
  const overlayBack = useOverlayBack();
  const { isMiniApp } = useTelegramAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const search = useProductSearch();

  useEffect(() => {
    if (!isSearchOpen || !overlayBack) return;
    const unregister = overlayBack.registerOverlayBack(() =>
      setIsSearchOpen(false)
    );
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when isSearchOpen toggles; overlayBack ref would cause loop
  }, [isSearchOpen]);

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleFilters = () => {
    setIsFiltersOpen(true);
  };

  const handleGoToSearchPage = (q: string) => {
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  if (isMiniApp) {
    return (
      <main className="min-h-screen bg-tg-bg text-tg-text flex flex-col pb-24">
        <StickySearchBar
          value={search.query}
          onChange={search.setQuery}
          onClear={search.clear}
          onCancel={search.clear}
          onGoToSearchPage={handleGoToSearchPage}
          placeholder="Поиск"
        />
        {search.query.trim() ? (
          <div
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain"
            style={{
              paddingLeft: "max(12px, env(safe-area-inset-left))",
              paddingRight: "max(12px, env(safe-area-inset-right))",
              paddingBottom: 24,
            }}
          >
            <div className="px-2 py-3">
              <SearchResults
                products={search.products}
                isLoading={search.isLoading}
                error={search.error}
                query={search.query}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="max-w-4xl mx-auto py-3">
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
              {!isLoading && !error && (
                <div className="grid grid-cols-2 gap-x-1 gap-y-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <FiltersAndSearchBar
          onFilters={handleFilters}
          onMenu={sideMenu?.openMenu}
          hideSearchIcon
        />
        <FiltersModal
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-tg-bg text-tg-text py-3 pb-24">
      <div className="max-w-4xl mx-auto">
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
      <SearchOverlay
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
