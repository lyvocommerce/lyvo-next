import type { Metadata, Viewport } from "next";
import "./globals.css";
import ConditionalProviders from "@/contexts/ConditionalProviders";
import { CategoriesProvider } from "@/contexts/Categories/CategoriesProvider";
import { getAllCategories, getCategoriesTreeSync } from "@/lib/categories";

export const metadata: Metadata = {
  title: "LyvoShop Telegram App",
  description: "Telegram Web App for LyvoShop",
  icons: {
    icon: "/favicon.ico", // or '/icon.png'
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch categories on the server
  const categories = await getAllCategories();
  const categoriesTree = getCategoriesTreeSync(categories);

  return (
    <html lang="en">
      <body>
        <CategoriesProvider
          categories={categories}
          categoriesTree={categoriesTree}
        >
          <ConditionalProviders>{children}</ConditionalProviders>
        </CategoriesProvider>
      </body>
    </html>
  );
}
