"use client";

import { usePathname } from "next/navigation";
import TelegramAuthProvider from "@/contexts/TelegramAuth/TelegramAuthProvider";
import TelegramBackButton from "@/components/TelegramAuth/TelegramBackButton";
import ProductsProvider from "@/contexts/Products/ProductsProvider";
import { SideMenuProvider } from "@/contexts/SideMenu/SideMenuContext";
import SideMenu from "@/components/layout/SideMenu";
import PageTransition from "@/components/utils/PageTransition";
import ContentSafeArea from "@/components/utils/ContentSafeArea";

interface ConditionalProvidersProps {
  children: React.ReactNode;
}

export default function ConditionalProviders({
  children,
}: ConditionalProvidersProps) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  // Read testMode from environment variable (default to false if not set)
  const testMode = process.env.NEXT_PUBLIC_TELEGRAM_TEST_MODE === "true";

  // Admin page doesn't need Telegram auth
  if (isAdminPage) {
    return <>{children}</>;
  }

  // All other pages use Telegram auth and product providers
  return (
    <TelegramAuthProvider testMode={testMode}>
      <SideMenuProvider>
        <TelegramBackButton />
        <SideMenu />
        <ProductsProvider>
        <PageTransition>
          <ContentSafeArea>{children}</ContentSafeArea>
        </PageTransition>
      </ProductsProvider>
      </SideMenuProvider>
    </TelegramAuthProvider>
  );
}
