import {
  getCategoryBySlug,
  getProductsByCategorySlugAndDescendants,
} from "@/lib/categories";
import { mapDbProductToProduct } from "@/lib/catalog";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/design/ProductCard";
import BackToHomeLink from "@/components/utils/BackToHomeLink";

interface CategoryProductsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryProductsPage({
  params,
}: CategoryProductsPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const dbProducts = await getProductsByCategorySlugAndDescendants(slug);
  const products = dbProducts.map(mapDbProductToProduct);

  return (
    <main className="min-h-screen bg-tg-bg text-tg-text px-4 py-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackToHomeLink />
          <Link
            href={`/category/${slug}`}
            className="text-tg-link text-sm mb-2 inline-block hover:underline"
          >
            ← {category.name}
          </Link>
          <h1 className="text-3xl font-bold text-tg-text mt-1">
            {category.name}
          </h1>
          <p className="text-tg-hint mt-1">Все товары</p>
        </div>

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
