import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/categories — list all categories with imageUrl for admin UI.
 * Returns all categories (including inactive) so admin can set images for any.
 * Protected by middleware (admin session required).
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ level: "asc" }, { displayOrder: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        level: true,
        displayOrder: true,
        parentId: true,
        imageUrl: true,
      },
    });
    return NextResponse.json(categories);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    const isDbSchema =
      /column.*does not exist|image_url|migrate/i.test(message) ||
      (e as { code?: string }).code === "P2010";
    const userMessage = isDbSchema
      ? "В базе нет колонки для изображений. Выполните в терминале: npx prisma migrate deploy"
      : `Ошибка базы данных: ${message}`;
    console.error("[GET /api/admin/categories]", e);
    return NextResponse.json(
      { error: userMessage },
      { status: 500 }
    );
  }
}
