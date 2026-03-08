"use client";

import { useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

interface StickySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  /** Close search mode (blur, hide results panel) */
  onCancel: () => void;
  /** Navigate to full search results page (e.g. on keyboard "Search" / Enter) */
  onGoToSearchPage?: (query: string) => void;
  placeholder?: string;
}

export default function StickySearchBar({
  value,
  onChange,
  onClear,
  onCancel,
  onGoToSearchPage,
  placeholder = "Поиск",
}: StickySearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (onGoToSearchPage && q) {
      onGoToSearchPage(q);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky top-0 z-30 flex items-center gap-2 bg-tg-bg border-b border-tg-hint/10 shrink-0"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingLeft: "max(12px, env(safe-area-inset-left))",
        paddingRight: "max(12px, env(safe-area-inset-right))",
        paddingBottom: 6,
      }}
    >
      <div
        className="flex items-center gap-2 flex-1 min-w-0 rounded-lg bg-tg-secondary px-3"
        style={{ height: 48 }}
      >
        <HugeiconsIcon
          icon={Search01Icon}
          size={20}
          className="shrink-0 text-tg-hint"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCapitalize="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Поиск"
          className="min-w-0 flex-1 bg-transparent text-tg-text placeholder:text-tg-hint outline-none text-base"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Очистить"
            className="shrink-0 p-1 rounded-full text-tg-hint hover:bg-black/10 active:opacity-80 touch-manipulation"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="shrink-0 text-tg-link text-[15px] font-medium py-2 px-2 touch-manipulation"
      >
        Отменить
      </button>
    </form>
  );
}
