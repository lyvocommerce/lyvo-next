export default function Loading() {
  return (
    <div className="min-h-screen bg-tg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-tg-link border-r-transparent"></div>
        <p className="mt-4 text-tg-hint">Loading...</p>
      </div>
    </div>
  );
}
