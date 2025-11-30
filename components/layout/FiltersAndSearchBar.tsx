"use client";

import { IoOptionsOutline } from "react-icons/io5";

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
          <button
            onClick={onSearch}
            className="bg-white/10 backdrop-blur-md border border-white/40 text-tg-text py-3 px-6 rounded-full font-semibold hover:bg-white/20 transition-all shadow-lg"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            Search
          </button>
          <button
            onClick={onFilters}
            className="bg-white/10 backdrop-blur-md border border-white/40 text-tg-text py-3 px-3 rounded-full font-semibold hover:bg-white/20 transition-all shadow-lg flex items-center justify-center gap-2"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <IoOptionsOutline size={25} />
          </button>
        </div>
      </div>
    </div>
  );
}
