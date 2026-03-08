"use client";

import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { useTelegramAuth } from "@/contexts/TelegramAuth/TelegramAuthContext";

/** "Cancel" label by Telegram language_code (fallback: en) */
const CANCEL_LABELS: Record<string, string> = {
  en: "Cancel",
  ru: "Отменить",
  uk: "Скасувати",
  be: "Скасаваць",
  kk: "Болдырмау",
  uz: "Bekor qilish",
  de: "Abbrechen",
  fr: "Annuler",
  es: "Cancelar",
  it: "Annulla",
  pt: "Cancelar",
  tr: "İptal",
  pl: "Anuluj",
  vi: "Hủy",
  id: "Batal",
  zh: "取消",
  ja: "キャンセル",
  ko: "취소",
  ar: "إلغاء",
  hi: "रद्द करें",
};

function getCancelLabel(languageCode: string): string {
  const code = (languageCode || "en").toLowerCase().split("-")[0];
  return CANCEL_LABELS[code] ?? CANCEL_LABELS.en;
}

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

/** ~16px below Telegram native header: safe-area + ~56px header + 16px gap */
const SEARCH_TOP_OFFSET = "calc(env(safe-area-inset-top, 0px) + 72px)";

export default function StickySearchBar({
  value,
  onChange,
  onClear,
  onCancel,
  onGoToSearchPage,
  placeholder = "Поиск",
}: StickySearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { user } = useTelegramAuth();
  const cancelLabel = getCancelLabel(user?.languageCode ?? "en");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (onGoToSearchPage && q) {
      onGoToSearchPage(q);
    }
  };

  const showCancel = isFocused || value.length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky top-0 z-30 flex w-full items-center gap-2 bg-tg-bg border-b border-tg-hint/10 shrink-0"
      style={{
        paddingTop: SEARCH_TOP_OFFSET,
        paddingLeft: "max(12px, env(safe-area-inset-left))",
        paddingRight: "max(12px, env(safe-area-inset-right))",
        paddingBottom: 10,
      }}
    >
      <div
        className="flex w-full flex-1 items-center gap-2 min-w-0 rounded-xl bg-tg-secondary px-3"
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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label="Поиск"
          className="min-w-0 flex-1 bg-transparent text-tg-text placeholder:text-tg-hint outline-none text-base w-full"
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
      {showCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 text-tg-link text-[15px] font-medium py-2 pl-2 pr-1 touch-manipulation whitespace-nowrap"
        >
          {cancelLabel}
        </button>
      )}
    </form>
  );
}
