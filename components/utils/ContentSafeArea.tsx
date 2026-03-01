"use client";

import { usePathname } from "next/navigation";

interface ContentSafeAreaProps {
  children: React.ReactNode;
}

/**
 * Wraps content with top padding so Telegram native header doesn't overlap.
 * Uses env(safe-area-inset-top) + --tg-content-offset-top for each device.
 * Skipped on product detail page (/product/[id]) which has its own full-screen layout.
 */
export default function ContentSafeArea({ children }: ContentSafeAreaProps) {
  const pathname = usePathname();
  const isProductDetailPage = pathname?.startsWith("/product/");

  if (isProductDetailPage) {
    return <>{children}</>;
  }

  return (
    <div className="telegram-content-safe-top min-h-screen w-full">
      {children}
    </div>
  );
}
