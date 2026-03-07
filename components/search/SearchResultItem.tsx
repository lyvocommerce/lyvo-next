"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatPrice, productImageSrc } from "@/lib/format";

interface SearchResultItemProps {
  product: Product;
}

const IMAGE_SIZE = 64;

export default function SearchResultItem({ product }: SearchResultItemProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="search-result-item flex items-center gap-3 rounded-xl p-3 bg-tg-secondary active:opacity-90 transition-opacity touch-manipulation min-h-[80px]"
      style={{ padding: 12 }}
    >
      <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-tg-bg">
        <Image
          src={productImageSrc(product.image)}
          alt={product.title}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          className="object-cover w-full h-full"
          sizes="64px"
          loading="lazy"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-tg-text font-medium text-sm line-clamp-2 leading-tight">
          {product.title}
        </h3>
        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="text-tg-text text-sm font-semibold">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="flex items-center gap-1 text-tg-hint text-xs shrink-0">
            <span className="text-yellow-500" aria-hidden>⭐</span>
            <span>{product.rating.rate}</span>
            {product.rating.count > 0 && (
              <span>({product.rating.count})</span>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
