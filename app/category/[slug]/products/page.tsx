import {
  getCategoryBySlug,
  getCategoryChildren,
  getProductsByCategorySlugAndDescendants,
} from "@/lib/categories";
import { mapDbProductToProduct } from "@/lib/catalog";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/design/ProductCard";
import BackToHomeLink from "@/components/utils/BackToHomeLink";
import BackToCategoryLink from "@/components/utils/BackToCategoryLink";

interface CategoryProductsPageProps {
  params: Promise<{ slug: string }>;
}

const TILE_RADIUS = 16;
const LABEL_FONT_SIZE = 13;

export default async function CategoryProductsPage({
  params,
}: CategoryProductsPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [children, dbProducts] = await Promise.all([
    getCategoryChildren(category.id),
    getProductsByCategorySlugAndDescendants(slug),
  ]);
  const products = dbProducts.map(mapDbProductToProduct);

  return (
    <main className="min-h-screen bg-tg-bg text-tg-text px-4 py-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackToHomeLink />
          <BackToCategoryLink slug={slug} categoryName={category.name} />
          <h1 className="text-3xl font-bold text-tg-text mt-1">
            {category.name}
          </h1>
          <p className="text-tg-hint mt-1">Все товары</p>
        </div>

        {/* Level-2 subcategories: grid 3 per row, same style as main carousel */}
        {children.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-8">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="flex flex-col items-center touch-manipulation active:opacity-90"
              >
                <div
                  className="w-full aspect-square overflow-hidden transition-opacity"
                  style={{
                    borderRadius: TILE_RADIUS,
                    backgroundColor: "var(--category-tile-bg)",
                  }}
                >
                  {/* Placeholder for future category image */}
                </div>
                <p
                  className="mt-2 text-center font-normal leading-tight line-clamp-2 w-full px-0.5"
                  style={{
                    fontSize: LABEL_FONT_SIZE,
                    color: "var(--category-tile-label)",
                  }}
                >
                  {child.name}
                </p>
              </Link>
            ))}
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-1 gap-y-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-tg-hint">
              В этой категории пока нет товаров.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
