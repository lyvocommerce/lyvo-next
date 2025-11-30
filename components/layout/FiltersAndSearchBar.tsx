"use client";

import { IoOptionsOutline } from "react-icons/io5";
import GlassButton from "@/components/design/GlassButton";

interface FiltersAndSearchBarProps {
  onSearch?: () => void;
  onFilters?: () => void;
}

export default function FiltersAndSearchBar({
  onSearch,
  onFilters,
}: FiltersAndSearchBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="max-w-4xl mx-auto px-5 py-3">
        <div className="flex gap-3 justify-center">
          <GlassButton onClick={onSearch}>Search</GlassButton>
          <GlassButton
            onClick={onFilters}
            variant="icon"
            className="flex items-center justify-center gap-2"
          >
            <IoOptionsOutline size={25} />
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
