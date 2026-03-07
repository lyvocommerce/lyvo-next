import { getCategoryBySlug, getCategoryChildren, getProductsByCategorySlug } from "@/lib/categories";
import { mapDbProductToProduct } from "@/lib/catalog";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/design/ProductCard";
import BackToHomeLink from "@/components/utils/BackToHomeLink";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const children = await getCategoryChildren(category.id);
  const dbProducts =
    children.length === 0 ? await getProductsByCategorySlug(slug) : [];
  const products = dbProducts.map(mapDbProductToProduct);

  return (
    <main className="min-h-screen bg-tg-bg text-tg-text px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header — in browser: Back to Home link; in Mini App: Telegram native Back only */}
        <div className="mb-6">
          <BackToHomeLink />
          <h1 className="text-3xl font-bold text-tg-text">{category.name}</h1>
          {category.description && (
            <p className="text-tg-hint mt-2">{category.description}</p>
          )}
        </div>

        {/* Subcategories */}
        {children.length > 0 && (
          <div className="space-y-3 mb-10">
            <h2 className="text-lg font-semibold text-tg-subtitle mb-4">
              Subcategories
            </h2>
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="block"
              >
                <div className="bg-tg-section-bg hover:bg-tg-section-bg/80 transition-colors rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-tg-text font-medium">{child.name}</h3>
                      {child.description && (
                        <p className="text-tg-hint text-sm mt-1">
                          {child.description}
                        </p>
                      )}
                    </div>
                    <svg
                      className="w-5 h-5 text-tg-hint"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Products in this category */}
        {products.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-tg-subtitle mb-4">
              Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {children.length === 0 && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-tg-hint">No subcategories or products in this category yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
