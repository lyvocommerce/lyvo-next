"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useRef } from "react";
import type { Product } from "@/types/product";
import BackToHomeLink from "@/components/utils/BackToHomeLink";
import { SearchResults } from "@/components/search";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setProducts([]);
      setError(null);
      return;
    }
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setError(null);
    setIsLoading(true);
    const signal = abortRef.current.signal;
    fetch(`/api/search?q=${encodeURIComponent(q)}&limit=50`, { signal })
      .then((res) => {
        if (!res.ok) {
          return res.json().catch(() => ({})).then((data) => {
            throw new Error(data.error ?? `Search failed: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.products ?? []);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Search failed");
        setProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      abortRef.current?.abort();
    };
  }, [q]);

  return (
    <main className="min-h-screen bg-tg-bg text-tg-text px-4 py-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackToHomeLink />
          <h1 className="text-xl font-bold text-tg-text mt-2">
            Результаты поиска
            {q.trim() && (
              <span className="text-tg-hint font-normal ml-2">
                «{q}»
              </span>
            )}
          </h1>
        </div>
        {!q.trim() ? (
          <p className="text-tg-hint text-sm py-8">
            Введите запрос в строке поиска на главной и нажмите «Найти».
          </p>
        ) : (
          <SearchResults
            products={products}
            isLoading={isLoading}
            error={error}
            query={q}
          />
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-tg-bg text-tg-text px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-tg-hint">Загрузка…</p>
          </div>
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
