"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon, UserIcon, SearchIcon } from "@hugeicons/core-free-icons";
import GlassButton from "@/components/design/GlassButton";

interface FiltersAndSearchBarProps {
  onSearch?: () => void;
  onFilters?: () => void;
}

export default function FiltersAndSearchBar({
  onSearch,
  onFilters,
}: FiltersAndSearchBarProps) {
  const glassIconClasses =
    "flex items-center justify-center py-3 px-3 bg-white/10 backdrop-blur-md border border-white/40 text-black font-semibold hover:bg-white/20 transition-all rounded-full text-[17px]";

  return (
    <div
      className="fixed left-0 right-0"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
    >
      <div className="max-w-4xl mx-auto px-5">
        <div className="flex gap-3 justify-center items-center">
          <Link
            href="/user"
            className={glassIconClasses}
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <HugeiconsIcon icon={UserIcon} size={25} />
          </Link>
          <GlassButton
            onClick={onFilters}
            variant="icon"
            className="flex items-center justify-center gap-2"
          >
            <HugeiconsIcon icon={FilterHorizontalIcon} size={25} />
          </GlassButton>
          <GlassButton onClick={onSearch} variant="icon">
            <HugeiconsIcon icon={SearchIcon} size={25} />
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
