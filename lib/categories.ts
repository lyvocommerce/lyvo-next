import { prisma } from "./prisma";
import { Category } from "@prisma/client";

export type CategoryWithChildren = Category & {
  children?: CategoryWithChildren[];
};

/**
 * Fetch all categories from the database
 */
export async function getAllCategories(): Promise<Category[]> {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ level: "asc" }, { displayOrder: "asc" }],
  });
}

/**
 * Return set of active category slugs for resolving product categories during ingest.
 * Products are stored with category = one of these slugs or null.
 */
export async function getActiveCategorySlugs(): Promise<Set<string>> {
  const rows = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return new Set(rows.map((r) => r.slug));
}

/**
 * Build a hierarchical tree structure from flat category list
 */
export function buildCategoryTree(
  categories: Category[],
): CategoryWithChildren[] {
  const categoryMap = new Map<number, CategoryWithChildren>();
  const rootCategories: CategoryWithChildren[] = [];

  // Create a map of all categories
  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Build the tree structure
  categories.forEach((category) => {
    const categoryWithChildren = categoryMap.get(category.id)!;

    if (category.parentId === null) {
      // Root level category
      rootCategories.push(categoryWithChildren);
    } else {
      // Child category - add to parent's children
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children!.push(categoryWithChildren);
      }
    }
  });

  return rootCategories;
}

/**
 * Get all root-level categories (level 1)
 */
export async function getRootCategories(): Promise<Category[]> {
  return await prisma.category.findMany({
    where: {
      isActive: true,
      level: 1,
    },
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Get children of a specific category
 */
export async function getCategoryChildren(
  parentId: number,
): Promise<Category[]> {
  return await prisma.category.findMany({
    where: {
      isActive: true,
      parentId,
    },
    orderBy: { displayOrder: "asc" },
  });
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  return await prisma.category.findUnique({
    where: { slug },
  });
}

/**
 * Get full category path (breadcrumbs)
 */
export async function getCategoryPath(categoryId: number): Promise<Category[]> {
  const path: Category[] = [];
  let currentId: number | null = categoryId;

  while (currentId !== null) {
    const category: Category | null = await prisma.category.findUnique({
      where: { id: currentId },
    });

    if (!category) break;

    path.unshift(category); // Add to beginning
    currentId = category.parentId;
  }

  return path;
}

/**
 * Get all categories with their full hierarchical tree structure
 */
export async function getCategoriesTree(): Promise<CategoryWithChildren[]> {
  const allCategories = await getAllCategories();
  return buildCategoryTree(allCategories);
}

/**
 * Build category tree from already-fetched categories (synchronous version)
 */
export function getCategoriesTreeSync(
  categories: Category[],
): CategoryWithChildren[] {
  return buildCategoryTree(categories);
}

/**
 * Fetch products that belong to a category (products.category = slug).
 * Used on category pages to show products assigned during ingest.
 */
export async function getProductsByCategorySlug(
  slug: string,
  limit = 50
) {
  return prisma.products.findMany({
    where: { category: slug },
    orderBy: { created_at: "desc" },
    take: limit,
  });
}

/**
 * Get slug of a category and all its descendants (for "show all products").
 */
async function getDescendantSlugsRecursive(categoryId: number): Promise<string[]> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) return [];

  const children = await getCategoryChildren(categoryId);
  const slugs = [category.slug];
  for (const child of children) {
    slugs.push(...(await getDescendantSlugsRecursive(child.id)));
  }
  return slugs;
}

/**
 * Fetch products that belong to this category or any of its descendant categories.
 * Used for "Show all products" on root/level-1 category pages.
 */
export async function getProductsByCategorySlugAndDescendants(
  slug: string,
  limit = 100
) {
  const category = await getCategoryBySlug(slug);
  if (!category) return [];

  const slugs = await getDescendantSlugsRecursive(category.id);
  return prisma.products.findMany({
    where: { category: { in: slugs } },
    orderBy: { created_at: "desc" },
    take: limit,
  });
}
