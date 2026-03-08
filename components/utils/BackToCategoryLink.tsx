"use client";

import Link from "next/link";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";

/**
 * Shows "← Category name" link only in browser; in Mini App back is via Telegram native button.
 */
interface BackToCategoryLinkProps {
  slug: string;
  categoryName: string;
}

export default function BackToCategoryLink({
  slug,
  categoryName,
}: BackToCategoryLinkProps) {
  const { isMiniApp } = useTelegramAuth();

  if (isMiniApp) return null;

  return (
    <Link
      href={`/category/${slug}`}
      className="text-tg-link text-sm mb-2 inline-block hover:underline"
    >
      ← {categoryName}
    </Link>
  );
}
