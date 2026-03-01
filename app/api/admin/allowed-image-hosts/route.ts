import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.allowedImageHost.findMany({
    orderBy: { hostname: "asc" },
    select: { id: true, hostname: true },
  });
  return NextResponse.json(rows);
}

function normalizeHostname(input: string): string {
  const s = input.trim().toLowerCase();
  try {
    const url = s.startsWith("http") ? new URL(s) : new URL(`https://${s}`);
    return url.hostname;
  } catch {
    return s.replace(/^https?:\/\//, "").split("/")[0] ?? s;
  }
}

export async function POST(request: NextRequest) {
  let body: { hostname?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const raw = body.hostname ?? "";
  const hostname = normalizeHostname(raw);
  if (!hostname) {
    return NextResponse.json(
      { error: "hostname is required (e.g. static.insales-cdn.com or https://example.com)" },
      { status: 400 }
    );
  }
  try {
    const row = await prisma.allowedImageHost.create({
      data: { hostname },
    });
    return NextResponse.json(row);
  } catch (e: unknown) {
    const isUnique = e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002";
    return NextResponse.json(
      { error: isUnique ? "This domain is already in the list" : "Failed to add" },
      { status: 400 }
    );
  }
}
