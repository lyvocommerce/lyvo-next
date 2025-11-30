"use client";

import BottomSheetModal from "../design/BottomSheetModal";

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FiltersModal({ isOpen, onClose }: FiltersModalProps) {
  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose} title="Sorting">
      <div className="text-tg-text">
        {/* Filters content will go here */}
        <p className="text-tg-hint">Filter options coming soon...</p>
      </div>
    </BottomSheetModal>
  );
}
