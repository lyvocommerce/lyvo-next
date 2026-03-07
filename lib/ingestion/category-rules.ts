/**
 * Keyword-based category rules for product categorization.
 * Rules are applied first during ingestion; then FEED_CATEGORY_TO_MENU_SLUG and aliases.
 * See docs/CATEGORY_RULES.md.
 */
import { normalizeCategoryToSlug } from "./resolve-category";

export type CategoryRule = {
  keywords: string[];
  categorySlug: string;
  /** If set, rule applies only when product's normalized feed category equals this. */
  feedCategory?: string;
};

/**
 * Rules are evaluated in order; first match whose categorySlug is in validSlugs wins.
 * More specific rules (e.g. with feedCategory) should appear before broader ones.
 */
export const CATEGORY_RULES: CategoryRule[] = [
  { keywords: ["jacket"], categorySlug: "jackets-parkas", feedCategory: "mens-clothing" },
  { keywords: ["jacket"], categorySlug: "jackets-parkas" },
  { keywords: ["dress"], categorySlug: "dresses" },
  { keywords: ["boots"], categorySlug: "womens-boots" },
];

export type ProductForRules = {
  title: string;
  description?: string | null;
  category: string | null;
};

/**
 * Returns the first matching rule's categorySlug if it is in validSlugs, else null.
 * Matching: title/description (case-insensitive) contains any keyword; if rule has
 * feedCategory, product's normalized feed category must equal it.
 */
export function resolveCategoryByRules(
  product: ProductForRules,
  validSlugs: Set<string>
): string | null {
  const text = [product.title, product.description].filter(Boolean).join(" ").toLowerCase();
  const normalizedFeedCategory = normalizeCategoryToSlug(product.category);

  for (const rule of CATEGORY_RULES) {
    if (!validSlugs.has(rule.categorySlug)) continue;
    if (rule.feedCategory != null && rule.feedCategory !== normalizedFeedCategory) continue;
    const hasKeyword = rule.keywords.some((kw) => text.includes(kw.toLowerCase()));
    if (hasKeyword) return rule.categorySlug;
  }
  return null;
}
