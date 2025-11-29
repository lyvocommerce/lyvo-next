import type WebApp from "@twa-dev/sdk";

/**
 * Applies Telegram theme colors to CSS variables
 */
export function applyTelegramTheme(
  themeParams: (typeof WebApp)["themeParams"] | null
): void {
  if (typeof document === "undefined" || !themeParams) return;

  document.documentElement.style.setProperty(
    "--tg-theme-bg-color",
    themeParams.bg_color || "#ffffff"
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
