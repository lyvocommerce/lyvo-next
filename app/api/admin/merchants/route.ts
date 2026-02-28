import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const list = await prisma.merchants.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(list);
}

type CreateBody = {
  id: string;
  name: string;
  logo_url?: string;
  country?: string;
  home_url?: string;
  connection_type?: string;
  connection_params?: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  let body: CreateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }
  const id = (body.id ?? "").trim();
  const name = (body.name ?? "").trim();
  if (!id || !name) {
    return NextResponse.json(
      { error: "id and name are required" },
      { status: 400 }
    );
  }
  const connection_type = body.connection_type ?? "url";
  const connection_params =
    body.connection_params != null
      ? (body.connection_params as Prisma.InputJsonValue)
      : undefined;

  try {
    const merchant = await prisma.merchants.create({
      data: {
        id,
        name,
        logo_url: body.logo_url ?? null,
        country: body.country ?? null,
        home_url: body.home_url ?? null,
        connection_type,
        ...(connection_params !== undefined && { connection_params }),
      },
    });
    return NextResponse.json(merchant);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Create failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
