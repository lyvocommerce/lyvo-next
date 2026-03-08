import { getCategoryBySlug, getCategoryChildren, getProductsByCategorySlug } from "@/lib/categories";
import { mapDbProductToProduct } from "@/lib/catalog";
import { categoryImageSrc, isBlobStorageUrl } from "@/lib/format";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

        {/* Subcategories: 40px placeholder left, 12px gap, text 15px/20px right */}
        {children.length > 0 && (
          <div className="space-y-2 mb-10">
            {children.map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="flex items-center gap-3 h-[56px] touch-manipulation active:opacity-90"
              >
                <div
                  className="flex-shrink-0 overflow-hidden rounded-lg relative"
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: "var(--category-tile-bg)",
                  }}
                >
                  {child.imageUrl ? (
                    <Image
                      src={categoryImageSrc(child.imageUrl)}
                      alt=""
                      width={56}
                      height={56}
                      className="object-contain w-full h-full"
                      unoptimized={isBlobStorageUrl(child.imageUrl)}
                    />
                  ) : null}
                </div>
                <span
                  className="text-tg-text font-normal flex-1 min-w-0 line-clamp-2"
                  style={{ fontSize: 15, lineHeight: "20px" }}
                >
                  {child.name}
                </span>
              </Link>
            ))}
            <Link
              href={`/category/${slug}/products`}
              className="flex items-center justify-center w-full py-3 px-6 mt-4 rounded-full bg-[#03A770]/75 backdrop-blur-md border border-[#03A770]/50 text-white font-semibold hover:bg-[#03A770]/60 touch-manipulation active:opacity-90 transition-all text-[17px]"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              Show all products
            </Link>
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
