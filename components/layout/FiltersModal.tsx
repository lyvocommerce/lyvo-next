"use client";

import BottomSheetModal from "../design/BottomSheetModal";

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FiltersModal({ isOpen, onClose }: FiltersModalProps) {
  const categories = [
    "Одежда и обувь",
    "Товары для дома",
    "Электроника",
    "Красота и здоровье",
    "Спорт и хобби",
  ];

  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose} title="Filters">
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-tg-secondary text-tg-text rounded-full text-sm font-medium hover:bg-tg-hint/20 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>
    </BottomSheetModal>
  );
}
