"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/design";

type Health = {
  ok?: boolean;
  database?: string;
  provider?: string;
  error?: string;
};

type Merchant = {
  id: string;
  name: string;
  logo_url: string | null;
  country: string | null;
  home_url: string | null;
  _count: { products: number };
};

export default function AdminPage() {
  const router = useRouter();
  const [health, setHealth] = useState<Health | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [loadingMerchants, setLoadingMerchants] = useState(true);
  const [ingesting, setIngesting] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [addStoreId, setAddStoreId] = useState("");
  const [addStoreName, setAddStoreName] = useState("");
  const [addStoreFeedUrl, setAddStoreFeedUrl] = useState("");
  const [addingStore, setAddingStore] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ ok: false, error: "Request failed" }))
      .finally(() => setLoadingHealth(false));
  }, []);

  useEffect(() => {
    fetch("/api/admin/merchants")
      .then((r) => r.json())
      .then(setMerchants)
      .catch(() => setMerchants([]))
      .finally(() => setLoadingMerchants(false));
  }, []);

  const loadCatalog = async (merchantId: string) => {
    setIngesting(merchantId);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/merchants/${encodeURIComponent(merchantId)}/ingest`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok) {
        setMessage(`Loaded ${data.ingested ?? 0} products for ${merchantId}`);
        const list = await fetch("/api/admin/merchants").then((r) => r.json());
        setMerchants(list);
      } else {
        setMessage(data.error ?? "Load failed");
      }
    } catch {
      setMessage("Request failed");
    } finally {
      setIngesting(null);
    }
  };

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = addStoreId.trim();
    const name = addStoreName.trim();
    const feedUrl = addStoreFeedUrl.trim();
    if (!id || !name) {
      setMessage("ID and name are required");
      return;
    }
    setAddingStore(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/merchants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          connection_type: "url",
          connection_params: feedUrl ? { feedUrl } : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setAddStoreId("");
        setAddStoreName("");
        setAddStoreFeedUrl("");
        setMessage(`Store "${name}" created`);
        const list = await fetch("/api/admin/merchants").then((r) => r.json());
        setMerchants(list);
      } else {
        setMessage(data.error ?? "Create failed");
      }
    } catch {
      setMessage("Request failed");
    } finally {
      setAddingStore(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button
            variant="secondary"
            onClick={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? "Logging out…" : "Log out"}
          </Button>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Database status</h2>
          {loadingHealth ? (
            <p className="text-tg-hint">Checking…</p>
          ) : health?.ok ? (
            <p className="text-green-600">
              {health.database} ({health.provider})
            </p>
          ) : (
            <p className="text-red-500">
              {health?.database ?? "Disconnected"}
              {health?.error ? ` — ${health.error}` : ""}
            </p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Merchants</h2>
          {loadingMerchants ? (
            <p className="text-tg-hint">Loading…</p>
          ) : merchants.length === 0 ? (
            <p className="text-tg-hint">No merchants yet.</p>
          ) : (
            <ul className="space-y-2">
              {merchants.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-2 py-2 border-b border-tg-hint/30"
                >
                  <span>
                    {m.name} ({m.id}) — {m._count.products} products
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => loadCatalog(m.id)}
                    disabled={ingesting !== null}
                  >
                    {ingesting === m.id ? "Loading…" : "Load catalog"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Add store</h2>
          <form onSubmit={handleAddStore} className="space-y-3">
            <div>
              <label htmlFor="store-id" className="block text-sm mb-1">
                ID
              </label>
              <input
                id="store-id"
                type="text"
                value={addStoreId}
                onChange={(e) => setAddStoreId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-tg-hint bg-tg-secondary text-tg-text"
                placeholder="e.g. mystore"
              />
            </div>
            <div>
              <label htmlFor="store-name" className="block text-sm mb-1">
                Name
              </label>
              <input
                id="store-name"
                type="text"
                value={addStoreName}
                onChange={(e) => setAddStoreName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-tg-hint bg-tg-secondary text-tg-text"
                placeholder="Store display name"
              />
            </div>
            <div>
              <label htmlFor="store-feed" className="block text-sm mb-1">
                Feed URL (optional)
              </label>
              <input
                id="store-feed"
                type="url"
                value={addStoreFeedUrl}
                onChange={(e) => setAddStoreFeedUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-tg-hint bg-tg-secondary text-tg-text"
                placeholder="https://..."
              />
            </div>
            <Button type="submit" disabled={addingStore}>
              {addingStore ? "Adding…" : "Add store"}
            </Button>
          </form>
        </section>

        <div className="mb-6">
          <Button variant="secondary" fullWidth onClick={() => router.push("/")}>
            Go to Store
          </Button>
        </div>

        {message && (
          <div className="p-4 rounded-lg bg-tg-secondary text-tg-text text-center">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
