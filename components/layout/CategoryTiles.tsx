"use client";

import { useCategoriesContext } from "@/contexts/Categories/CategoriesProvider";
import Link from "next/link";

export default function CategoryTiles() {
  const { getRootCategories } = useCategoriesContext();
  const rootCategories = getRootCategories();

  return (
    <div className="w-full overflow-x-auto pb-4 mb-6">
      <div className="flex gap-3 min-w-max px-1">
        {rootCategories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="flex-shrink-0"
          >
            <div className="bg-tg-section-bg hover:bg-tg-section-bg/80 transition-colors rounded-2xl px-6 py-4 min-w-[140px] text-center shadow-sm">
              <p className="text-tg-text font-medium text-sm">
                {category.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
