"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import GlassButton from "../design/GlassButton";
import { useState, useEffect, useRef } from "react";
import BottomSheetModal from "../design/BottomSheetModal";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;

    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(t);
  }, [isOpen]);

  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose} fullHeight={true}>
      <div
        className="flex gap-3 items-center pt-3"
        style={{
          paddingTop: "env(safe-area-inset-top, 12px)",
          paddingLeft: "env(safe-area-inset-left, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
      >
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={inputRef}
            placeholder="Search for products..."
            className="w-full px-4 py-3 pl-12 bg-tg-secondary text-tg-text rounded-full border border-tg-hint/20 focus:outline-none focus:border-tg-link transition-colors"
          />
          <HugeiconsIcon
            icon={Search01Icon}
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-tg-hint"
          />
        </div>
        <GlassButton
          onClick={onClose}
          aria-label="Close search"
          variant="icon"
          className="w-[50px] h-[50px] p-0 flex items-center justify-center text-tg-text"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={24} className="text-tg-text" />
        </GlassButton>
      </div>
    </BottomSheetModal>
  );
}
