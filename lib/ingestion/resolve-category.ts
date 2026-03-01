/**
 * Resolve incoming category labels (from JSON/API) to valid Category.slug from DB.
 * Ensures products are stored only with slugs that exist in the categories table.
 */

/**
 * Normalize a category string to a slug form (lowercase, spaces to hyphens, no special chars).
 * Used for matching against Category.slug.
 */
export function normalizeCategoryToSlug(value: string | null | undefined): string {
  if (value == null || typeof value !== "string") return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Optional alias map: normalized slug from feed -> valid Category.slug in DB.
 * Only map when it makes sense (e.g. beauty/fragrances -> clothes). Do NOT map
 * furniture, groceries, etc. to clothes — those stay null (uncategorized) until
 * you add real categories in the DB.
 */
export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  beauty: "clothes",
  fragrances: "clothes",
};

/**
 * Resolve an incoming category label to a valid slug from the given set, or null.
 * - Normalizes the incoming string to slug form.
 * - If it exists in validSlugs, returns it.
 * - Else checks CATEGORY_SLUG_ALIASES; if the normalized slug has an alias that exists in validSlugs, returns that.
 * - Otherwise returns null (product will be stored without category).
 */
export function resolveCategory(
  incoming: string | null | undefined,
  validSlugs: Set<string>
): string | null {
  const normalized = normalizeCategoryToSlug(incoming);
  if (!normalized) return null;
  if (validSlugs.has(normalized)) return normalized;
  const alias = CATEGORY_SLUG_ALIASES[normalized];
  if (alias && validSlugs.has(alias)) return alias;
  return null;
}
