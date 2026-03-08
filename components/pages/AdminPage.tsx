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

type AllowedImageHostRow = { id: number; hostname: string };

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
  const [newStoreCurrency, setNewStoreCurrency] = useState("auto");
  const [newStoreFile, setNewStoreFile] = useState<File | null>(null);
  const [addingStore, setAddingStore] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [uploadLog, setUploadLog] = useState<string | null>(null);
  const [uploadLogSuccess, setUploadLogSuccess] = useState<boolean | null>(null);
  const [allowedHosts, setAllowedHosts] = useState<AllowedImageHostRow[]>([]);
  const [loadingAllowedHosts, setLoadingAllowedHosts] = useState(true);
  const [newHostInput, setNewHostInput] = useState("");
  const [addingHost, setAddingHost] = useState(false);
  const [deletingHostId, setDeletingHostId] = useState<number | null>(null);

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

  useEffect(() => {
    fetch("/api/admin/allowed-image-hosts")
      .then((r) => r.json())
      .then(setAllowedHosts)
      .catch(() => setAllowedHosts([]))
      .finally(() => setLoadingAllowedHosts(false));
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
    if (log?.currency) lines.push(`Currency: ${String(log.currency)}`);
    if (Array.isArray(log?.imageDomainsAdded) && log.imageDomainsAdded.length)
      lines.push(`Image domains added: ${log.imageDomainsAdded.join(", ")}`);
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
      formData.set("currency", newStoreCurrency);
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
        setNewStoreCurrency("auto");
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

  const handleAddAllowedHost = async (e: React.FormEvent) => {
    e.preventDefault();
    const host = newHostInput.trim();
    if (!host) {
      setMessage("Enter a domain (e.g. media.fds.fi or https://cdn.example.com)");
      return;
    }
    setAddingHost(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/allowed-image-hosts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostname: host }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.id) {
        setAllowedHosts((prev) => [...prev, { id: data.id, hostname: data.hostname }].sort((a, b) => a.hostname.localeCompare(b.hostname)));
        setNewHostInput("");
        setMessage(`Domain ${data.hostname} added`);
      } else {
        setMessage(data.error ?? "Failed to add");
      }
    } catch {
      setMessage("Request failed");
    } finally {
      setAddingHost(false);
    }
  };

  const handleRemoveAllowedHost = async (id: number) => {
    setDeletingHostId(id);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/allowed-image-hosts/${id}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setAllowedHosts((prev) => prev.filter((h) => h.id !== id));
        setMessage("Domain removed");
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error ?? "Delete failed");
      }
    } catch {
      setMessage("Request failed");
    } finally {
      setDeletingHostId(null);
    }
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

  const totalProducts = merchants.reduce(
    (sum, m) => sum + (m._count?.products ?? 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar (static, as per layout) */}
        <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200/70">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
              LY
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">Lyvo Admin</span>
              <span className="text-xs text-slate-500">v1.0</span>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-sm">
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Main
              </p>
              <button className="w-full flex items-center justify-between rounded-xl bg-slate-900 text-white px-3 py-2.5 text-sm font-medium shadow-sm hover:bg-slate-800 transition-colors">
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  Dashboard
                </span>
                <span className="rounded-full bg-white/10 px-2 text-[10px]">Live</span>
              </button>
            </div>

            <div className="space-y-1">
              <p className="px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Data
              </p>
              <div className="space-y-1">
                <div className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors cursor-default">
                  <span>Stores</span>
                  <span className="text-[11px] text-slate-400">
                    {merchants.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 transition-colors cursor-default">
                  <span>Allowed hosts</span>
                  <span className="text-[11px] text-slate-400">
                    {allowedHosts.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </nav>
          <div className="border-t border-slate-200 px-4 py-4 text-xs text-slate-400">
            Admin tools · {new Date().getFullYear()}
          </div>
        </aside>

        {/* Main column */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-16 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 md:px-8 backdrop-blur-sm">
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Dashboard
              </span>
              <h1 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900">
                Admin panel
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {loadingHealth
                    ? "Checking database…"
                    : health?.ok
                      ? "Database online"
                      : "Database issue"}
                </span>
              </div>
              <Button
                variant="secondary"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="rounded-full px-4 py-2 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
              >
                {logoutLoading ? "Logging out…" : "Log out"}
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 px-4 py-6 md:px-8 md:py-7 space-y-6 md:space-y-7">
            {/* Metrics row */}
            <section className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
              <div className="rounded-2xl bg-white border border-slate-200/70 shadow-sm px-4 py-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500">
                    Total stores
                  </p>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                </div>
                <p className="text-2xl font-semibold tracking-tight">
                  {loadingMerchants ? "…" : merchants.length}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Connected merchant accounts
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200/70 shadow-sm px-4 py-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500">
                    Total products
                  </p>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                </div>
                <p className="text-2xl font-semibold tracking-tight">
                  {loadingMerchants ? "…" : totalProducts}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Across all active stores
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200/70 shadow-sm px-4 py-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500">
                    Image hosts
                  </p>
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                </div>
                <p className="text-2xl font-semibold tracking-tight">
                  {loadingAllowedHosts ? "…" : allowedHosts.length}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Domains allowed for product images
                </p>
              </div>

              <div className="hidden lg:flex rounded-2xl bg-white border border-slate-200/70 shadow-sm px-4 py-3.5 flex-col justify-between">
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Status
                </p>
                <p className="text-sm text-slate-600">
                  {message
                    ? message
                    : "No recent system messages. All good."}
                </p>
              </div>
            </section>

            {/* Middle layout: merchants + domains/add store */}
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              {/* Merchants */}
              <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
                      Merchants
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      List of merchants and their product counts.
                    </p>
                  </div>
                </div>
                {loadingMerchants ? (
                  <p className="text-sm text-slate-500">Loading…</p>
                ) : merchants.length === 0 ? (
                  <p className="text-sm text-slate-500">No merchants yet.</p>
                ) : (
                  <ul className="mt-2 divide-y divide-slate-100">
                    {merchants.map((m) => (
                      <li
                        key={m.id}
                        className="flex items-center justify-between gap-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {m.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {m._count.products} products · {m.id}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => loadCatalog(m.id)}
                            disabled={ingesting !== null}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors"
                          >
                            {ingesting === m.id ? "Loading…" : "Load"}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleDeleteStore(m.id, m.name)}
                            disabled={deletingMerchantId !== null}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50 transition-colors"
                          >
                            {deletingMerchantId === m.id ? "Deleting…" : "Delete"}
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Right column: allowed hosts + add store */}
              <div className="space-y-4">
                <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm px-5 py-4">
                  <h2 className="text-sm font-semibold text-slate-900 tracking-tight mb-1.5">
                    Allowed image domains
                  </h2>
                  <p className="text-xs text-slate-500 mb-3">
                    Domains in this list (and from merchant URLs) are allowed to
                    load product images.
                  </p>
                  {loadingAllowedHosts ? (
                    <p className="text-sm text-slate-500">Loading…</p>
                  ) : (
                    <>
                      <ul className="space-y-1.5 mb-3 max-h-40 overflow-y-auto pr-1">
                        {allowedHosts.map((h) => (
                          <li
                            key={h.id}
                            className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-1.5"
                          >
                            <span className="font-mono text-xs text-slate-700 truncate">
                              {h.hostname}
                            </span>
                            <Button
                              variant="secondary"
                              onClick={() => handleRemoveAllowedHost(h.id)}
                              disabled={deletingHostId !== null}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] hover:bg-slate-50 transition-colors"
                            >
                              {deletingHostId === h.id ? "Removing…" : "Remove"}
                            </Button>
                          </li>
                        ))}
                        {allowedHosts.length === 0 && (
                          <li className="text-xs text-slate-500 py-1.5">
                            No domains yet. Add one below.
                          </li>
                        )}
                      </ul>
                      <form
                        onSubmit={handleAddAllowedHost}
                        className="flex gap-2 flex-wrap items-center"
                      >
                        <input
                          type="text"
                          value={newHostInput}
                          onChange={(e) => setNewHostInput(e.target.value)}
                          placeholder="media.fds.fi or https://cdn.example.com"
                          className="flex-1 min-w-[200px] rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-colors"
                        />
                        <Button
                          type="submit"
                          disabled={addingHost || !newHostInput.trim()}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs hover:bg-slate-50 transition-colors"
                        >
                          {addingHost ? "Adding…" : "Add domain"}
                        </Button>
                      </form>
                    </>
                  )}
                </section>

                <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm px-5 py-4">
                  <h2 className="text-sm font-semibold text-slate-900 tracking-tight mb-1.5">
                    Add new store
                  </h2>
                  <p className="text-xs text-slate-500 mb-3">
                    Enter name, URL and upload a JSON catalog (FakeStore or
                    DummyJSON with{" "}
                    <code className="rounded bg-slate-100 px-1 text-[11px]">
                      products
                    </code>
                    ). The merchant and products will be created automatically.
                  </p>
                  <form
                    onSubmit={handleAddStoreWithCatalog}
                    className="space-y-3 text-sm"
                  >
                    <div className="space-y-1">
                      <label
                        htmlFor="new-store-name"
                        className="block text-xs font-medium text-slate-600"
                      >
                        Store name
                      </label>
                      <input
                        id="new-store-name"
                        type="text"
                        value={newStoreName}
                        onChange={(e) => setNewStoreName(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-colors"
                        placeholder="e.g. My Shop"
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="new-store-url"
                        className="block text-xs font-medium text-slate-600"
                      >
                        Store URL
                      </label>
                      <input
                        id="new-store-url"
                        type="url"
                        value={newStoreUrl}
                        onChange={(e) => setNewStoreUrl(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-colors"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="new-store-currency"
                        className="block text-xs font-medium text-slate-600"
                      >
                        Currency
                      </label>
                      <select
                        id="new-store-currency"
                        value={newStoreCurrency}
                        onChange={(e) => setNewStoreCurrency(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-colors"
                      >
                        <option value="auto">Auto (from file or EUR)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="UAH">UAH (Hryvnia)</option>
                        <option value="RUB">RUB (Ruble)</option>
                        <option value="GBP">GBP (Pound)</option>
                        <option value="PLN">PLN (Złoty)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label
                        htmlFor="new-store-file"
                        className="block text-xs font-medium text-slate-600"
                      >
                        JSON file
                      </label>
                      <input
                        id="new-store-file"
                        type="file"
                        accept=".json,application/json"
                        onChange={(e) => setNewStoreFile(e.target.files?.[0] ?? null)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 file:mr-3 file:rounded-md file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-900 hover:file:bg-slate-300/90 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-colors"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={addingStore || !newStoreName.trim() || !newStoreFile}
                      className="mt-1 rounded-full border border-slate-200 bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 transition-colors"
                    >
                      {addingStore ? "Adding…" : "Add store and import catalog"}
                    </Button>
                  </form>
                </section>
              </div>
            </div>

            {/* Bottom row: upload log + actions */}
            {uploadLog && (
              <section className="rounded-2xl bg-white border border-slate-200/70 shadow-sm px-5 py-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
                      Upload log
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Log of the latest catalog upload. Copy for support
                      if something went wrong.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={copyUploadLog}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs hover:bg-slate-50 transition-colors"
                  >
                    Copy log
                  </Button>
                </div>
                <pre
                  className={`mt-2 w-full rounded-xl border text-xs overflow-x-auto whitespace-pre-wrap font-mono px-4 py-3 ${
                    uploadLogSuccess === true
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : uploadLogSuccess === false
                        ? "bg-red-50 border-red-200 text-red-900"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  {uploadLog}
                </pre>
              </section>
            )}

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => router.push("/")}
                className="md:max-w-xs rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
              >
                Go to Store
              </Button>
              {message && (
                <div className="flex-1 rounded-2xl bg-white border border-slate-200/70 px-4 py-3 text-sm text-slate-800">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
