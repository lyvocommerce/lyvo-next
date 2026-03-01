"use client";

import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { ReactNode, useEffect, useRef } from "react";

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  fullHeight?: boolean;
}

export default function BottomSheetModal({
  isOpen,
  onClose,
  title,
  children,
  fullHeight = false,
}: BottomSheetModalProps) {
  const height = fullHeight ? "100vh" : "30vh";
  const showHeader = !fullHeight;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // wait a bit for animation/DOM to settle, then focus first input-like element
    const timeout = setTimeout(() => {
      if (document.activeElement && document.activeElement !== document.body) return;
      const selectors = 'input:not([disabled]), textarea:not([disabled]), [contenteditable="true"]';
      const el = containerRef.current?.querySelector(selectors) as HTMLElement | null;
      if (el && typeof el.focus === "function") {
        try {
          el.focus();
        } catch {}
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const body = document.body;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    // Lock the document by fixing body (works on desktop and improves mobile behavior)
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    // Prevent touchmove outside the sheet (iOS rubberband) and wheel on desktop
    const onDocumentTouchMove = (e: TouchEvent) => {
      const target = e.target as Node | null;
      if (!containerRef.current || !target) return;
      if (!containerRef.current.contains(target)) {
        e.preventDefault();
      }
    };

    const onDocumentWheel = (e: WheelEvent) => {
      const target = e.target as Node | null;
      if (!containerRef.current || !target) return;
      if (!containerRef.current.contains(target)) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", onDocumentTouchMove, { passive: false });
    document.addEventListener("wheel", onDocumentWheel, { passive: false });

    // Prevent overscroll from propagating when scrolling inside sheet.
    // If the inner scroll is at top and user swipes down (trying to scroll past top), preventDefault.
    let startY = 0;
    const contentElSelector = ".overflow-y-auto";
    const onContainerTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
    };

    const onContainerTouchMove = (e: TouchEvent) => {
      const el = containerRef.current?.querySelector(contentElSelector) as HTMLElement | null;
      if (!el) return;
      const touchY = e.touches[0]?.clientY ?? 0;
      const deltaY = touchY - startY;

      const atTop = el.scrollTop === 0;
      const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;

      if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
        e.preventDefault();
      }
    };

    // Attach to container when available
    if (containerRef.current) {
      containerRef.current.addEventListener("touchstart", onContainerTouchStart, { passive: true });
      containerRef.current.addEventListener("touchmove", onContainerTouchMove, { passive: false });
    }

    return () => {
      document.removeEventListener("touchmove", onDocumentTouchMove as EventListener);
      document.removeEventListener("wheel", onDocumentWheel as EventListener);
      if (containerRef.current) {
        containerRef.current.removeEventListener("touchstart", onContainerTouchStart as EventListener);
        containerRef.current.removeEventListener("touchmove", onContainerTouchMove as EventListener);
      }

      // restore body scroll
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - only show when not fullHeight */}
          {!fullHeight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />
          )}

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 300 }}
            ref={containerRef}
            className="bottom-sheet-modal fixed bottom-0 left-0 right-0 bg-tg-bg rounded-t-3xl z-50"
            style={{ height }}
          >
            {showHeader && (
              <>
                <div className="flex justify-center pt-2 pb-1">
                  <div className="bottom-sheet-handle w-12 h-1 bg-gray-300 rounded-full" />
                </div>

                <div className="flex items-center justify-between px-5 pb-1 border-b border-tg-hint/10">
                  <div className="w-8" />
                  <h2 className="text-md font-bold text-tg-text flex-1 text-center">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-tg-secondary rounded-full transition-colors"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={24} className="text-tg-text" />
                  </button>
                </div>
              </>
            )}

            {/* Content */}
            <div
              className="p-5 overflow-y-auto"
              style={{
                height: showHeader ? "calc(100% - 80px)" : "calc(100% - 40px)",
              }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
