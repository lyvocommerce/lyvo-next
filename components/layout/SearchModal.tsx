"use client";

import { IoSearch } from "react-icons/io5";
import { useState } from "react";
import BottomSheetModal from "../design/BottomSheetModal";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose} fullHeight={true}>
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full px-4 py-3 pl-12 bg-tg-secondary text-tg-text rounded-full border border-tg-hint/20 focus:outline-none focus:border-tg-link transition-colors"
          />
          <IoSearch
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-tg-hint"
          />
        </div>
        <button
          onClick={onClose}
          className="text-tg-link text-sm font-medium hover:underline whitespace-nowrap"
        >
          Close
        </button>
      </div>
    </BottomSheetModal>
  );
}
