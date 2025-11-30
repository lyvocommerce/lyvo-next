import type { Metadata, Viewport } from "next";
import "./globals.css";
import TelegramAuthProvider from "@/contexts/TelegramAuth/TelegramAuthProvider";
import ProductsProvider from "@/contexts/Products/ProductsProvider";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  title: "LyvoShop Telegram App",
  description: "Telegram Web App for LyvoShop",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read testMode from environment variable (default to false if not set)
  const testMode = process.env.NEXT_PUBLIC_TELEGRAM_TEST_MODE === "true";
  return (
    <html lang="en">
      <body>
        <TelegramAuthProvider testMode={testMode}>
          <ProductsProvider>
            <PageTransition>{children}</PageTransition>
          </ProductsProvider>
        </TelegramAuthProvider>
      </body>
    </html>
  );
}
