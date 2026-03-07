"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";
import { useProductSearch } from "@/hooks/useProductSearch";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function useVisualViewportHeight() {
  const [height, setHeight] = useState(() =>
    typeof window !== "undefined" ? window.visualViewport?.height ?? window.innerHeight : 0
  );
  const [offsetTop, setOffsetTop] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      setHeight(vv.height);
      setOffsetTop(vv.offsetTop);
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return { height, offsetTop };
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { isMiniApp } = useTelegramAuth();
  const { query, setQuery, products, isLoading, error, clear } = useProductSearch();
  const { height: viewportHeight, offsetTop } = useVisualViewportHeight();

  const handleClear = useCallback(() => {
    clear();
  }, [clear]);

  const handleClose = useCallback(() => {
    clear();
    onClose();
  }, [clear, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    clear();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps -- clear when opening

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY ?? window.pageYOffset ?? 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isFullScreen = isMiniApp;

  if (isFullScreen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="search-overlay search-overlay-fullscreen fixed inset-0 z-[100] flex flex-col bg-tg-bg"
          style={{
            top: offsetTop,
            left: 0,
            right: 0,
            height: viewportHeight,
            paddingTop: "env(safe-area-inset-top, 0px)",
          }}
        >
          {/* Top bar: close button */}
          <div
            className="flex items-center justify-between shrink-0 py-2 px-3 border-b border-tg-hint/10"
            style={{
              paddingLeft: "max(12px, env(safe-area-inset-left))",
              paddingRight: "max(12px, env(safe-area-inset-right))",
            }}
          >
            <span className="text-tg-hint text-sm">Поиск</span>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Закрыть"
              className="p-2 -m-2 rounded-full text-tg-text hover:bg-tg-secondary active:opacity-80 transition-opacity touch-manipulation"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={24} />
            </button>
          </div>

          {/* Scrollable results — takes all space above the input */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain">
            <div
              className="px-3 py-3"
              style={{
                paddingLeft: "max(12px, env(safe-area-inset-left))",
                paddingRight: "max(12px, env(safe-area-inset-right))",
              }}
            >
              <SearchResults
                products={products}
                isLoading={isLoading}
                error={error}
                query={query}
              />
            </div>
          </div>

          {/* Search input fixed at bottom (above keyboard) */}
          <div
            className="shrink-0 pt-2 pb-3 bg-tg-bg"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
              paddingLeft: "max(12px, env(safe-area-inset-left))",
              paddingRight: "max(12px, env(safe-area-inset-right))",
            }}
          >
            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={handleClear}
              placeholder="Поиск"
              autoFocus={true}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  /* Web: bottom sheet по центру, высота ~70% экрана (iOS-style) */
  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 z-40"
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 35, stiffness: 300 }}
          className="fixed left-0 right-0 mx-auto w-full max-w-4xl bg-tg-bg rounded-t-3xl z-50 flex flex-col shadow-xl"
          style={{
            bottom: 0,
            height: "70vh",
            minHeight: 280,
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          <div className="flex justify-center pt-2 pb-1 shrink-0">
            <div className="w-12 h-1 rounded-full bg-tg-hint/30" />
          </div>
          <div
            className="shrink-0 px-4 pb-3"
            style={{
              paddingLeft: "max(16px, env(safe-area-inset-left))",
              paddingRight: "max(16px, env(safe-area-inset-right))",
            }}
          >
            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={handleClear}
              placeholder="Поиск"
              autoFocus={true}
            />
          </div>
          <div
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-4"
            style={{
              paddingLeft: "max(16px, env(safe-area-inset-left))",
              paddingRight: "max(16px, env(safe-area-inset-right))",
            }}
          >
            <SearchResults
              products={products}
              isLoading={isLoading}
              error={error}
              query={query}
            />
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
