"use client";

import { usePathname } from "next/navigation";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";

interface ContentSafeAreaProps {
  children: React.ReactNode;
}

/**
 * In Mini App: top padding so Telegram native header doesn't overlap (safe area).
 * In browser: no extra padding. Skipped on product detail page (full-screen layout).
 * On home ("/") in Mini App we skip so StickySearchBar controls its own top offset (16px below native header).
 */
export default function ContentSafeArea({ children }: ContentSafeAreaProps) {
  const pathname = usePathname();
  const { isMiniApp } = useTelegramAuth();
  const isProductDetailPage = pathname?.startsWith("/product/");
  const isHomeWithStickySearch = pathname === "/" && isMiniApp;

  if (isProductDetailPage || !isMiniApp || isHomeWithStickySearch) {
    return <>{children}</>;
  }

  return (
    <div className="telegram-content-safe-top min-h-screen w-full">
      {children}
    </div>
  );
}
