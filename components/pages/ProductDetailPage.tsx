"use client";

import { useProducts } from "@/contexts/Products/ProductsContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/design/Button";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProductById, isLoading } = useProducts();

  const productId = Number(params.id);
  const product = getProductById(productId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-tg-bg text-tg-text p-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-tg-hint text-center py-12">Loading product...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-tg-bg text-tg-text p-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-500 text-center py-12">Product not found</p>
          <div className="text-center">
            <Button onClick={() => router.push("/")} variant="primary">
              Back to Products
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-tg-bg text-tg-text p-5">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-4 text-tg-link hover:underline"
        >
          &lt; Go back
        </button>

        <div className="bg-tg-secondary rounded-lg overflow-hidden shadow-lg">
          <div className="relative aspect-square bg-white">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-8"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="p-6">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-tg-bg text-tg-hint text-xs rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-tg-text mb-4">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="text-tg-text font-semibold">
                  {product.rating.rate}
                </span>
                <span className="text-tg-hint text-sm">
                  ({product.rating.count} reviews)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-tg-text">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-tg-text mb-2">
                Description
              </h2>
              <p className="text-tg-hint leading-relaxed">
                {product.description}
              </p>
            </div>

            <Button variant="primary" fullWidth>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
