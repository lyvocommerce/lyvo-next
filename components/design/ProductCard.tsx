"use client";

import { Product } from "@/types/product";
import { formatPrice, productImageSrc } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-tg-secondary rounded-lg overflow-hidden cursor-pointer">
        <div className="relative aspect-square bg-white">
          <Image
            src={productImageSrc(product.image)}
            alt={product.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
        <div className="p-3 bg-white">
          <h3 className="text-gray-800 font-normal text-product-title line-clamp-2 mb-2">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-900 font-bold text-base">
              {formatPrice(product.price, product.currency)}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-gray-600 text-xs">
                {product.rating.rate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
