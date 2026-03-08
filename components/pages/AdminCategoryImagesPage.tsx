"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/design";

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  level: number;
  displayOrder: number;
  parentId: number | null;
  imageUrl: string | null;
};

export default function AdminCategoryImagesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadCategories = useCallback(() => {
    setLoadError(null);
    setLoading(true);
    fetch("/api/admin/categories", { credentials: "include" })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          if (r.status === 401) {
            throw new Error("Не авторизованы. Войдите в админку заново (Dashboard → выйти и зайти).");
          }
          throw new Error(typeof data?.error === "string" ? data.error : `Ошибка ${r.status}`);
        }
        return data;
      })
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        setCategories([]);
        setLoadError(e instanceof Error ? e.message : "Не удалось загрузить список категорий.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleUpload = async (categoryId: number, file: File) => {
    setMessage("");
    setUploadingId(categoryId);
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch(`/api/admin/categories/${categoryId}/image`, {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === categoryId ? { ...c, imageUrl: data.url } : c
          )
        );
        setMessage(`Image updated for category #${categoryId}`);
      } else {
        setMessage(data.error ?? "Upload failed");
      }
    } catch {
      setMessage("Request failed");
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemove = async (categoryId: number) => {
    if (!confirm("Remove image for this category?")) return;
    setMessage("");
    setDeletingId(categoryId);
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}/image`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === categoryId ? { ...c, imageUrl: null } : c
          )
        );
        setMessage("Image removed");
      } else {
        setMessage(data.error ?? "Remove failed");
      }
    } catch {
      setMessage("Request failed");
    } finally {
      setDeletingId(null);
    }
  };

  const sorted = [...categories].sort(
    (a, b) => a.level - b.level || a.displayOrder - b.displayOrder
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
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
              <Link
                href="/admin"
                className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/categories"
                className="w-full flex items-center justify-between rounded-xl bg-slate-900 text-white px-3 py-2.5 text-sm font-medium shadow-sm"
              >
                Category images
              </Link>
            </div>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 md:px-8 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-slate-500 hover:text-slate-700 text-sm"
              >
                ← Dashboard
              </Link>
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Data
                </span>
                <h1 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900">
                  Category images
                </h1>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 md:px-8 md:py-7">
            {message && (
              <p className="mb-4 text-sm text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
                {message}
              </p>
            )}
            <p className="text-sm text-slate-500 mb-6">
              Upload an image for each category. Used in the app on the home carousel, side menu, and category pages. Max 3 MB, JPEG/PNG/WebP/GIF.
            </p>

            {loading ? (
              <p className="text-slate-500">Загрузка категорий…</p>
            ) : loadError ? (
              <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-slate-800">
                <p className="font-medium text-red-800">Ошибка загрузки</p>
                <p className="mt-1 text-sm text-slate-600">{loadError}</p>
                <p className="mt-3 text-sm text-slate-600">
                  Устраните причину (см. выше), затем нажмите «Повторить» или зайдите заново:{" "}
                  <Link href="/admin/login" className="text-tg-link underline">Вход в админку</Link>.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-4"
                  onClick={() => loadCategories()}
                >
                  Повторить
                </Button>
              </div>
            ) : sorted.length === 0 ? (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-slate-800">
                <p className="font-medium text-amber-800">Категории не найдены</p>
                <p className="mt-1 text-sm text-slate-600">
                  Заполните базу категориями. В терминале в папке проекта выполните:
                </p>
                <code className="mt-2 inline-block bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm font-mono">
                  npm run prisma:seed
                </code>
                <p className="mt-3 text-sm text-slate-600">
                  Дождитесь сообщения «Seed completed successfully!», затем обновите эту страницу (F5). Появится список категорий — у каждой строки будет кнопка «Upload» для загрузки своего изображения.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {sorted.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-white border border-slate-200/70 shadow-sm px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-slate-100">
                        {cat.imageUrl ? (
                          <Image
                            src={cat.imageUrl}
                            alt=""
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                            unoptimized={cat.imageUrl.includes("blob.vercel-storage.com")}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {cat.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {cat.slug} · Level {cat.level}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="cursor-pointer inline-block">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          disabled={uploadingId !== null}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUpload(cat.id, f);
                            e.target.value = "";
                          }}
                        />
                        <span
                          className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-opacity ${
                            uploadingId !== null
                              ? "opacity-60 cursor-not-allowed bg-slate-300 text-slate-500"
                              : "bg-tg-button text-tg-button-text hover:opacity-90"
                          }`}
                        >
                          {uploadingId === cat.id ? "Uploading…" : "Upload"}
                        </span>
                      </label>
                      {cat.imageUrl && (
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={deletingId !== null}
                          className="rounded-xl px-3 py-2 text-sm"
                          onClick={() => handleRemove(cat.id)}
                        >
                          {deletingId === cat.id ? "Removing…" : "Remove"}
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
