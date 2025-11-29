import type { Metadata, Viewport } from 'next'
import './globals.css'
import TelegramAuthProvider from '@/contexts/TelegramAuth/TelegramAuthProvider'

export const metadata: Metadata = {
  title: 'LyvoShop Telegram App',
  description: 'Telegram Web App for LyvoShop',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <TelegramAuthProvider testMode={false}>
          {children}
        </TelegramAuthProvider>
      </body>
    </html>
  )
}

