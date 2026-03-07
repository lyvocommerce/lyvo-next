"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Product } from "@/types/product";

const DEBOUNCE_MS = 250;

interface SearchState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export function useProductSearch() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<SearchState>({
    products: [],
    isLoading: false,
    error: null,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setState({ products: [], isLoading: false, error: null });
      return;
    }
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&limit=30`,
        { signal: abortRef.current.signal }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Search failed: ${res.status}`);
      }
      const data = await res.json();
      setState({
        products: data.products ?? [],
        isLoading: false,
        error: null,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Search failed",
        products: [],
      }));
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setState({ products: [], isLoading: false, error: null });
      return;
    }
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      runSearch(query);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  const clear = useCallback(() => {
    setQuery("");
    setState({ products: [], isLoading: false, error: null });
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    abortRef.current?.abort();
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  return {
    query,
    setQuery,
    products: state.products,
    isLoading: state.isLoading,
    error: state.error,
    clear,
  };
}
