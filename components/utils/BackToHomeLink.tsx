"use client";

import Link from "next/link";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";

/**
 * Shows "Back to Home" link only in browser; in Mini App back is via Telegram native button.
 */
export default function BackToHomeLink() {
  const { isMiniApp } = useTelegramAuth();

  if (isMiniApp) return null;

  return (
    <Link
      href="/"
      className="text-tg-link text-sm mb-2 inline-block hover:underline"
    >
      ← Back to Home
    </Link>
  );
}
