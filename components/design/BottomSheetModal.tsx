"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { ReactNode } from "react";

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
  const height = fullHeight ? "92vh" : "30vh";
  const showHeader = !fullHeight;

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
            className="fixed bottom-0 left-0 right-0 bg-tg-bg rounded-t-3xl z-50"
            style={{ height }}
          >
            {showHeader && (
              <>
                <div className="flex justify-center pt-2 pb-1">
                  <div className="w-12 h-1 bg-gray-300 rounded-full" />
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
                    <IoClose size={24} className="text-tg-text" />
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
