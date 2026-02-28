export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-tg-bg text-tg-text">
      {children}
    </div>
  );
}
