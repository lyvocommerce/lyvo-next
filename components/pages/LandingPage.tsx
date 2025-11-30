"use client";

import Link from "next/link";
import Button from "@/components/design/Button";
import { ProductCard } from "@/components/design";
import { useProducts } from "@/contexts/Products/ProductsContext";

export default function LandingPage() {
  const { products, isLoading, error } = useProducts();

  return (
    <main className="min-h-screen bg-tg-bg text-tg-text p-5">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-tg-text">Lyvoshop</h1>
          <Link href="/user">
            <Button variant="primary">User Info</Button>
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
    </main>
  );
}
