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
  const [deletingMerchantId, setDeletingMerchantId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreUrl, setNewStoreUrl] = useState("");
  const [newStoreFile, setNewStoreFile] = useState<File | null>(null);
  const [addingStore, setAddingStore] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [uploadLog, setUploadLog] = useState<string | null>(null);
  const [uploadLogSuccess, setUploadLogSuccess] = useState<boolean | null>(null);

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

  function formatUploadLog(data: Record<string, unknown>, status: number): string {
    const log = data.log as Record<string, unknown> | undefined;
    const lines: string[] = [
      "=== Upload result ===",
      `HTTP status: ${status}`,
      `Step: ${log?.step ?? "unknown"}`,
    ];
    if (data.error) lines.push(`Error: ${String(data.error)}`);
    if (log?.fileSizeKB != null) lines.push(`File size: ${log.fileSizeKB} KB`);
    if (log?.format) lines.push(`Format: ${String(log.format)}`);
    if (log?.parsedCount != null) lines.push(`Parsed products: ${log.parsedCount}`);
    if (log?.merchantId) lines.push(`Store ID: ${String(log.merchantId)}`);
    if (log?.storeName) lines.push(`Store name: ${String(log.storeName)}`);
    if (log?.ingested != null) lines.push(`Ingested: ${log.ingested}`);
    if (log?.durationMs != null) lines.push(`Duration: ${log.durationMs} ms`);
    if (log?.errorStack) {
      lines.push("");
      lines.push("Stack trace (copy this for support/agents):");
      lines.push(String(log.errorStack));
    }
    return lines.join("\n");
  }

  const handleAddStoreWithCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newStoreName.trim();
    if (!name) {
      setMessage("Store name is required");
      return;
    }
    if (!newStoreFile) {
      setMessage("Please select a JSON file.");
      return;
    }
    setAddingStore(true);
    setMessage("");
    setUploadLog(null);
    setUploadLogSuccess(null);
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("homeUrl", newStoreUrl.trim());
      formData.set("file", newStoreFile);
      const res = await fetch("/api/admin/stores/with-catalog", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      const logText = formatUploadLog(
        { ...data, error: data.error ?? (res.ok ? null : "Request failed") },
        res.status
      );
      setUploadLog(logText);
      setUploadLogSuccess(res.ok && !!data.ok);

      if (res.ok && data.ok) {
        setNewStoreName("");
        setNewStoreUrl("");
        setNewStoreFile(null);
        setMessage(`Store "${data.name ?? name}" added with ${data.ingested ?? 0} products`);
        const list = await fetch("/api/admin/merchants").then((r) => r.json());
        setMerchants(list);
      } else {
        setMessage(data.error ?? "Failed to add store");
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Request failed";
      setMessage(errMsg);
      setUploadLog(
        `=== Upload result ===\nHTTP status: (network error)\nError: ${errMsg}\n\nCopy this and share with support/agents to fix load functions.`
      );
      setUploadLogSuccess(false);
    } finally {
      setAddingStore(false);
    }
  };

  const copyUploadLog = () => {
    if (!uploadLog) return;
    navigator.clipboard.writeText(uploadLog).then(() => setMessage("Log copied to clipboard"));
  };

  const handleDeleteStore = async (merchantId: string, merchantName: string) => {
    if (!confirm(`Delete store "${merchantName}" and all its products? This cannot be undone.`)) {
      return;
    }
    setDeletingMerchantId(merchantId);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/merchants/${encodeURIComponent(merchantId)}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        setMessage(`Store "${merchantName}" deleted`);
        setMerchants((prev) => prev.filter((m) => m.id !== merchantId));
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error ?? "Delete failed");
      }
    } catch {
      setMessage("Request failed");
    } finally {
      setDeletingMerchantId(null);
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
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => loadCatalog(m.id)}
                      disabled={ingesting !== null}
                    >
                      {ingesting === m.id ? "Loading…" : "Load catalog"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDeleteStore(m.id, m.name)}
                      disabled={deletingMerchantId !== null}
                    >
                      {deletingMerchantId === m.id ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Add new store</h2>
          <p className="text-sm text-tg-hint mb-3">
            Enter the store name, its URL, and upload a JSON catalog (FakeStore array or DummyJSON with <code className="bg-tg-secondary px-1 rounded">products</code> array). A new store will be created and products imported.
          </p>
          <form onSubmit={handleAddStoreWithCatalog} className="space-y-3">
            <div>
              <label htmlFor="new-store-name" className="block text-sm mb-1">
                Store name
              </label>
              <input
                id="new-store-name"
                type="text"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-tg-hint bg-tg-secondary text-tg-text"
                placeholder="e.g. My Shop"
              />
            </div>
            <div>
              <label htmlFor="new-store-url" className="block text-sm mb-1">
                Store URL
              </label>
              <input
                id="new-store-url"
                type="url"
                value={newStoreUrl}
                onChange={(e) => setNewStoreUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-tg-hint bg-tg-secondary text-tg-text"
                placeholder="https://..."
              />
            </div>
            <div>
              <label htmlFor="new-store-file" className="block text-sm mb-1">
                JSON file
              </label>
              <input
                id="new-store-file"
                type="file"
                accept=".json,application/json"
                onChange={(e) => setNewStoreFile(e.target.files?.[0] ?? null)}
                className="w-full px-4 py-2 rounded-lg border border-tg-hint bg-tg-secondary text-tg-text"
              />
            </div>
            <Button type="submit" disabled={addingStore || !newStoreName.trim() || !newStoreFile}>
              {addingStore ? "Adding…" : "Add store and import catalog"}
            </Button>
          </form>
        </section>

        {uploadLog && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Upload log</h2>
            <p className="text-sm text-tg-hint mb-2">
              What happened during the last file load. If there were errors, copy this and share with support or an agent to fix the load functions.
            </p>
            <pre
              className={`w-full p-4 rounded-lg border text-sm overflow-x-auto whitespace-pre-wrap font-mono ${
                uploadLogSuccess === true
                  ? "bg-green-950/20 border-green-700/50 text-green-200"
                  : uploadLogSuccess === false
                    ? "bg-red-950/20 border-red-700/50 text-red-200"
                    : "bg-tg-secondary border-tg-hint/30 text-tg-text"
              }`}
            >
              {uploadLog}
            </pre>
            <Button
              type="button"
              variant="secondary"
              onClick={copyUploadLog}
              className="mt-2"
            >
              Copy log
            </Button>
          </section>
        )}

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
