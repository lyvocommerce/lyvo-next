import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB (under Vercel 4.5 MB body limit)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function getExtension(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[mime] ?? "jpg";
}

/**
 * POST /api/admin/categories/[id]/image — upload image for a category.
 * Body: FormData with "file" (image). Updates category.imageUrl.
 * Protected by middleware (admin session required).
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await context.params;
  const id = parseInt(idParam, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { id },
    select: { id: true, imageUrl: true },
  });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing file. Send FormData with key 'file'." },
      { status: 400 }
    );
  }

  const mime = file.type?.toLowerCase() ?? "";
  if (!ALLOWED_TYPES.includes(mime)) {
    return NextResponse.json(
      { error: `Invalid type. Allowed: ${ALLOWED_TYPES.join(", ")}` },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: `File too large. Max ${MAX_SIZE_BYTES / 1024 / 1024} MB` },
      { status: 400 }
    );
  }

  const ext = getExtension(mime);
  const pathname = `categories/${id}.${ext}`;

  try {
    // Remove old blob if exists (optional: Vercel Blob overwrites same path, but old URL would 404)
    if (category.imageUrl) {
      try {
        await del(category.imageUrl);
      } catch {
        // ignore if blob already deleted or different storage
      }
    }

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    await prisma.category.update({
      where: { id },
      data: { imageUrl: blob.url },
    });

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/categories/[id]/image — remove category image.
 * Sets category.imageUrl to null and deletes blob if possible.
 */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await context.params;
  const id = parseInt(idParam, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  }

  const category = await prisma.category.findUnique({
    where: { id },
    select: { id: true, imageUrl: true },
  });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  if (category.imageUrl) {
    try {
      await del(category.imageUrl);
    } catch {
      // continue to clear DB
    }
  }

  await prisma.category.update({
    where: { id },
    data: { imageUrl: null },
  });

  return NextResponse.json({ ok: true });
}
