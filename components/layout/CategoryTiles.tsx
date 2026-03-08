"use client";

import { useCategoriesContext } from "@/contexts/Categories/CategoriesProvider";
import Link from "next/link";

const TILE_SIZE = 88;
const TILE_RADIUS = 16;
const TILE_GAP = 5;
const LABEL_FONT_SIZE = 13;

export default function CategoryTiles() {
  const { getRootCategories } = useCategoriesContext();
  const rootCategories = getRootCategories();

  return (
    <div
      className="w-full overflow-x-auto overflow-y-hidden overscroll-x-contain pb-6 scrollbar-hide"
      style={{
        marginTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
      }}
    >
      <div
        className="flex min-w-max px-3"
        style={{ gap: TILE_GAP }}
      >
        {rootCategories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="flex-shrink-0 flex flex-col items-center touch-manipulation active:opacity-90"
            style={{ width: TILE_SIZE + 8 }}
          >
            <div
              className="flex-shrink-0 overflow-hidden transition-opacity"
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                borderRadius: TILE_RADIUS,
                backgroundColor: "var(--category-tile-bg)",
              }}
            >
              {/* Placeholder for future category image */}
            </div>
            <p
              className="mt-2 text-left font-normal leading-tight line-clamp-2 mx-2"
              style={{
                fontSize: LABEL_FONT_SIZE,
                color: "var(--category-tile-label)",
                maxWidth: TILE_SIZE + 16,
              }}
            >
              {category.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
