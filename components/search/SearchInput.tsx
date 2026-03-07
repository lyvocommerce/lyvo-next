"use client";

import { useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  "aria-label"?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Поиск",
  autoFocus = true,
  "aria-label": ariaLabel = "Поиск",
  className = "",
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  return (
    <div
      className={`search-input-wrapper flex items-center gap-2 rounded-xl bg-tg-secondary px-3 py-2.5 ${className}`}
      style={{
        paddingLeft: "env(safe-area-inset-left, 12px)",
        paddingRight: "env(safe-area-inset-right, 12px)",
      }}
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
        autoComplete="off"
        autoCapitalize="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="min-w-0 flex-1 bg-transparent text-tg-text placeholder:text-tg-hint outline-none text-base"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Очистить"
          className="shrink-0 p-1 rounded-full text-tg-hint hover:bg-black/10 dark:hover:bg-white/10 transition-colors touch-manipulation"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} />
        </button>
      )}
    </div>
  );
}
