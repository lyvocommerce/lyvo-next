import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const merchantId = searchParams.get("merchant_id") ?? undefined;
    const categorySlug = searchParams.get("category_slug") ?? undefined;

    const skip = (page - 1) * limit;
    const where: { merchant_id?: string; category?: string } = {};
    if (merchantId) where.merchant_id = merchantId;
    if (categorySlug) where.category = categorySlug;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.products.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    console.error("[catalog/products] GET error:", e);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
