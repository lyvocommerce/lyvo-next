/** Connection params for type "url" (feed by link). */
export type UrlConnectionParams = {
  feedUrl: string;
};

/** Normalized product row for DB (products table). */
export type NormalizedProduct = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  image_url: string | null;
  price_min: number;
  price_max: number | null;
  currency: string;
  merchant_id: string;
  category: string | null;
  lang: string | null;
  rating_rate?: number | null;
  rating_count?: number | null;
};
