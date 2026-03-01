import type WebApp from "@twa-dev/sdk";

/** Returns true if the hex color is dark (low luminance) */
function isDarkTheme(bgColor: string): boolean {
  const hex = bgColor.replace(/^#/, "");
  if (hex.length !== 6 && hex.length !== 8) return false;
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.5;
}

/**
 * Applies Telegram theme colors to CSS variables and sets data-telegram-theme for dark/light
 */
export function applyTelegramTheme(
  themeParams: (typeof WebApp)["themeParams"] | null
): void {
  if (typeof document === "undefined" || !themeParams) return;

  const bgColor = themeParams.bg_color || "#ffffff";
  document.documentElement.setAttribute(
    "data-telegram-theme",
    isDarkTheme(bgColor) ? "dark" : "light"
  );

  document.documentElement.style.setProperty(
    "--tg-theme-bg-color",
    bgColor
  );
  document.documentElement.style.setProperty(
    "--tg-theme-text-color",
    themeParams.text_color || "#000000"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-hint-color",
    themeParams.hint_color || "#999999"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-link-color",
    themeParams.link_color || "#2481cc"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-button-color",
    themeParams.button_color || "#2481cc"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-button-text-color",
    themeParams.button_text_color || "#ffffff"
  );
  document.documentElement.style.setProperty(
    "--tg-theme-secondary-bg-color",
    themeParams.secondary_bg_color || "#f1f1f1"
  );
}
