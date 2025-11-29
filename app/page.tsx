'use client'

import { useTelegramAuth } from '@/contexts/TelegramAuth/TelegramAuthContext'
import Button from '@/components/design/Button'

export default function Home() {
  const { user, webApp, platform, version } = useTelegramAuth()

  const handleAlertButtonClick = () => {
    if (webApp) {
      webApp.showAlert('Button clicked!')
    }
  }

  const handleConfirmButtonClick = () => {
    if (webApp) {
      webApp.showConfirm('Are you sure?', (confirmed: boolean) => {
        if (confirmed && webApp) {
          webApp.showAlert('Confirmed!')
        }
      })
    }
  }

  if (!user) {
    return (
      <main className="p-5 text-center">
        <p className="text-tg-text">No user data found</p>
      </main>
    )
  }

  return (
    <main className="p-5 min-h-screen bg-tg-bg text-tg-text">
      <div className="mb-8">
        <h1 className="mb-5 text-2xl font-bold text-tg-text">
          Welcome to LyvoShop!
        </h1>
        
        {user && (
          <div className="bg-tg-secondary p-4 rounded-lg mb-5">
            <h2 className="mb-2.5 text-lg font-semibold text-tg-text">User Info</h2>
            <p className="text-tg-text"><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            {user.username && <p className="text-tg-text"><strong>Username:</strong> @{user.username}</p>}
            <p className="text-tg-text"><strong>ID:</strong> {user.id}</p>
            {user.isPremium && <p className="text-tg-text"><strong>Premium:</strong> ✓</p>}
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <Button onClick={handleAlertButtonClick} variant="primary">
            Show Alert
          </Button>

          <Button onClick={handleConfirmButtonClick} variant="secondary">
            Show Confirm
          </Button>
        </div>

        <div className="mt-8 p-4 bg-tg-secondary rounded-lg">
          <h3 className="mb-2.5 text-tg-text font-semibold">Telegram Web App Info</h3>
          <p className="text-sm text-tg-hint">
            Platform: {platform}
          </p>
          <p className="text-sm text-tg-hint">
            Version: {version}
          </p>
        </div>
      </div>
    </main>
  )
}

