interface ErrorStateProps {
  error: string
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-5 text-center">
      <div>
        <p className="text-red-500 mb-2.5 font-medium">Authentication Error</p>
        <p className="text-sm text-tg-hint">{error}</p>
      </div>
    </div>
  )
}

