import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const merchant = await prisma.merchants.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!merchant) {
    return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
  }
  return NextResponse.json(merchant);
}

type UpdateBody = {
  name?: string;
  logo_url?: string;
  country?: string;
  home_url?: string;
  connection_type?: string;
  connection_params?: Record<string, unknown>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  let body: UpdateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data: Prisma.merchantsUpdateInput = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.logo_url !== undefined) data.logo_url = body.logo_url;
  if (body.country !== undefined) data.country = body.country;
  if (body.home_url !== undefined) data.home_url = body.home_url;
  if (body.connection_type !== undefined) data.connection_type = body.connection_type;
  if (body.connection_params !== undefined) {
    data.connection_params =
      body.connection_params === null
        ? Prisma.JsonNull
        : (body.connection_params as Prisma.InputJsonValue);
  }

  try {
    const merchant = await prisma.merchants.update({
      where: { id },
      data,
    });
    return NextResponse.json(merchant);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
