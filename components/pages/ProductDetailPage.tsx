"use client";

import { useProducts } from "@/contexts/Products/ProductsContext";
import { useCategoriesContext } from "@/contexts/Categories/CategoriesProvider";
import { formatPrice, productImageSrc } from "@/lib/format";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/design/Button";
import GlassButton from "@/components/design/GlassButton";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProductById, isLoading } = useProducts();
  const { getCategoryBySlug } = useCategoriesContext();
  const { isMiniApp } = useTelegramAuth();

  const productId = typeof params.id === "string" ? params.id : String(params.id);
  const product = getProductById(productId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-tg-bg text-tg-text p-5 pb-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-tg-hint text-center py-12">Loading product...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-tg-bg text-tg-text p-5 pb-24">
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
    <main className="min-h-screen bg-tg-bg text-tg-text pb-24">
      {/* Fixed image - at top; content panel has translateZ(0) so it scrolls over image in WebView */}
      <div className="fixed top-0 left-0 right-0 z-0 h-[50vh] min-h-[280px] bg-[#F5F7FA]">
        <div className="relative w-full h-full">
          <Image
            src={productImageSrc(product.image)}
            alt={product.title}
            fill
            className="object-contain p-6"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Spacer: content starts visually below the image */}
      <div className="h-[50vh] min-h-[280px]" aria-hidden />

      {/* Scrollable content - own layer so it always scrolls over the image in Telegram WebView */}
      <div
        className="relative z-10 bg-white rounded-t-[20px] px-5 pt-6 pb-8"
        style={{ transform: "translateZ(0)" }}
      >
        <div className="max-w-4xl mx-auto">
          {product.category && (
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-tg-secondary text-tg-hint text-xs rounded-full">
                {getCategoryBySlug(product.category)?.name ?? product.category}
              </span>
            </div>
          )}

          <h1 className="text-tg-text font-sans text-[13px] font-normal leading-[16px] tracking-[-0.08px] mb-4">
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
            <span className="text-tg-text text-[13px] font-bold leading-[16px] tracking-[-0.08px]">
              {formatPrice(product.price, product.currency)}
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
        </div>
      </div>

      {/* Fixed bottom bar - same as main page */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-4xl mx-auto px-5 pb-10">
          <div className="flex gap-3 justify-center items-center">
            <GlassButton onClick={() => router.back()}>Back</GlassButton>
            <button
              type="button"
              className="flex-1 max-w-[240px] py-3 px-6 bg-[#03A770]/75 backdrop-blur-md border border-[#03A770]/50 text-white font-semibold hover:bg-[#03A770]/60 transition-all rounded-full text-[17px]"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
