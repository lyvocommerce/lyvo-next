'use client'

import { createContext, useContext, ReactNode } from 'react'
import { TelegramUser } from '@/types/telegram'
import type WebAppType from '@twa-dev/sdk'

interface TelegramAuthContextType {
  user: TelegramUser | null
  isReady: boolean
  isLoading: boolean
  error: string | null
  webApp: typeof WebAppType | null
  platform: string
  version: string
  testMode: boolean
  /** True when running inside Telegram Mini App; false in browser (or testMode) */
  isMiniApp: boolean
}

const TelegramAuthContext = createContext<TelegramAuthContextType | undefined>(undefined)

export function useTelegramAuth() {
  const context = useContext(TelegramAuthContext)
  if (context === undefined) {
    throw new Error('useTelegramAuth must be used within a TelegramAuthProvider')
  }
  return context
}

interface TelegramAuthProviderProps {
  children: ReactNode
  testMode?: boolean
}

export { TelegramAuthContext, type TelegramAuthProviderProps }

