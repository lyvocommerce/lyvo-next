"use client";

import Link from "next/link";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { ProductCard } from "@/components/design";
import { useProducts } from "@/contexts/Products/ProductsContext";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";
import FiltersAndSearchBar from "@/components/design/FiltersAndSearchBar";
import SearchModal from "@/components/layout/SearchModal";
import FiltersModal from "@/components/layout/FiltersModal";

export default function LandingPage() {
  const { products, isLoading, error } = useProducts();
  const { webApp } = useTelegramAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleFilters = () => {
    setIsFiltersOpen(true);
  };

  const handleClose = () => {
    if (webApp) {
      webApp.close();
    }
  };

  return (
    <main className="min-h-screen bg-tg-bg text-tg-text px-3 py-3 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          {/* Left - Close button */}
          <button
            onClick={handleClose}
            className="p-2 hover:bg-tg-secondary rounded-full transition-colors"
          >
            <IoClose size={24} className="text-tg-text" />
          </button>

          {/* Center - Title and subtitle */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-tg-text leading-tight">
              LyvoShop
            </h1>
            <p className="text-xs text-tg-hint">Smart shopping</p>
          </div>

          {/* Right - User link */}
          <Link
            href="/user"
            className="p-2 hover:bg-tg-secondary rounded-full transition-colors"
          >
            <FaUser size={20} className="text-tg-text" />
          </Link>
        </div>

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
