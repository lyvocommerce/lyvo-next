/** Currency code -> symbol for display. Add more as needed. */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  UAH: "₴",
  RUB: "₽",
  GBP: "£",
  PLN: "zł",
};

/**
 * Format price with currency symbol (or code if unknown).
 * Uses product.currency from catalog; falls back to EUR if missing.
 */
export function formatPrice(price: number, currency?: string | null): string {
  const code = (currency ?? "EUR").trim().toUpperCase().slice(0, 3);
  const symbol = CURRENCY_SYMBOLS[code] ?? code;
  return `${symbol}${price.toFixed(2)}`;
}

/**
 * Proxy URL for product images. Uses /api/image so that domains added in admin (store URL) are allowed automatically.
 * Pass the raw image URL from the catalog; returns our proxy URL for next/image.
 */
export function productImageSrc(rawUrl: string): string {
  if (!rawUrl || rawUrl.startsWith("/")) return rawUrl;
  if (rawUrl.startsWith("/api/image?")) return rawUrl;
  return `/api/image?url=${encodeURIComponent(rawUrl)}`;
}

/**
 * Category image URL. Category images are proxied via /api/image so they load
 * in Telegram Mini App (WebView often blocks external domains like Vercel Blob).
 */
export function categoryImageSrc(imageUrl: string | null | undefined): string {
  if (!imageUrl || !imageUrl.trim()) return "";
  if (imageUrl.startsWith("/")) return imageUrl;
  if (imageUrl.startsWith("/api/image?")) return imageUrl;
  return `/api/image?url=${encodeURIComponent(imageUrl)}`;
}

/** Whether the URL is from Vercel Blob (needs unoptimized in next/image if not in remotePatterns). */
export function isBlobStorageUrl(url: string): boolean {
  return url.includes("blob.vercel-storage.com");
}
