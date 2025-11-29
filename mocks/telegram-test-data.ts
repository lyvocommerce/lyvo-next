import { TelegramUser } from '@/types/telegram'

/**
 * Mock user data for test mode
 */
export const MOCK_TELEGRAM_USER: TelegramUser = {
  id: 123456789,
  firstName: 'Test',
  lastName: 'User',
  username: 'testuser',
  languageCode: 'en',
  isPremium: false,
  photoUrl: '',
}

/**
 * Default Telegram theme colors for test mode
 */
export const DEFAULT_TELEGRAM_THEME = {
  bgColor: '#ffffff',
  textColor: '#000000',
  hintColor: '#999999',
  linkColor: '#2481cc',
  buttonColor: '#2481cc',
  buttonTextColor: '#ffffff',
  secondaryBgColor: '#f1f1f1',
} as const

/**
 * Applies default Telegram theme colors to the document
 */
export function applyDefaultTelegramTheme(): void {
  if (typeof document === 'undefined') return

  document.documentElement.style.setProperty('--tg-theme-bg-color', DEFAULT_TELEGRAM_THEME.bgColor)
  document.documentElement.style.setProperty('--tg-theme-text-color', DEFAULT_TELEGRAM_THEME.textColor)
  document.documentElement.style.setProperty('--tg-theme-hint-color', DEFAULT_TELEGRAM_THEME.hintColor)
  document.documentElement.style.setProperty('--tg-theme-link-color', DEFAULT_TELEGRAM_THEME.linkColor)
  document.documentElement.style.setProperty('--tg-theme-button-color', DEFAULT_TELEGRAM_THEME.buttonColor)
  document.documentElement.style.setProperty('--tg-theme-button-text-color', DEFAULT_TELEGRAM_THEME.buttonTextColor)
  document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', DEFAULT_TELEGRAM_THEME.secondaryBgColor)
}

/**
 * Test mode configuration
 */
export const TEST_MODE_CONFIG = {
  platform: 'test',
  version: '1.0.0',
} as const

