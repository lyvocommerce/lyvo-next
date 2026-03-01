import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ingestProducts, parseCatalogFromRawJson } from "@/lib/ingestion/load-catalog";

function slugFromName(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return base || `store-${Date.now()}`;
}

function detectFormat(raw: unknown): string {
  if (Array.isArray(raw)) return "FakeStore (array)";
  if (raw && typeof raw === "object" && "products" in raw && Array.isArray((raw as { products: unknown }).products)) {
    return "DummyJSON (object with products array)";
  }
  return "unknown";
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const log: {
    step: string;
    fileSizeBytes?: number;
    fileSizeKB?: number;
    format?: string;
    parsedCount?: number;
    merchantId?: string;
    storeName?: string;
    homeUrl?: string;
    ingested?: number;
    durationMs?: number;
    error?: string;
    errorStack?: string;
    httpStatus?: number;
  } = { step: "start" };

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (e) {
    log.step = "form_data";
    log.error = e instanceof Error ? e.message : "Invalid form data";
    log.errorStack = e instanceof Error ? e.stack : undefined;
    log.httpStatus = 400;
    return NextResponse.json(
      { error: log.error, log },
      { status: 400 }
    );
  }

  const name = (formData.get("name") as string | null)?.trim();
  const homeUrl = (formData.get("homeUrl") as string | null)?.trim();
  const file = formData.get("file") as File | null;

  if (!name) {
    log.step = "validation";
    log.error = "Store name is required";
    log.httpStatus = 400;
    return NextResponse.json({ error: log.error, log }, { status: 400 });
  }
  if (!file) {
    log.step = "validation";
    log.error = "JSON file is required";
    log.httpStatus = 400;
    return NextResponse.json({ error: log.error, log }, { status: 400 });
  }

  log.fileSizeBytes = file.size;
  log.fileSizeKB = Math.round((file.size / 1024) * 10) / 10;
  log.storeName = name;
  log.homeUrl = homeUrl || undefined;

  const productBaseUrl = homeUrl && homeUrl.length > 0 ? homeUrl.replace(/\/$/, "") : "https://example.com";
  let merchantId = slugFromName(name);

  const existing = await prisma.merchants.findUnique({ where: { id: merchantId } });
  if (existing) {
    merchantId = `${merchantId}-${Date.now()}`;
  }
  log.merchantId = merchantId;

  let raw: unknown;
  try {
    const text = await file.text();
    raw = JSON.parse(text);
  } catch (e) {
    log.step = "parse_json";
    log.error = e instanceof Error ? e.message : "Invalid JSON";
    log.errorStack = e instanceof Error ? e.stack : undefined;
    log.httpStatus = 400;
    return NextResponse.json(
      { error: `Failed to parse JSON: ${log.error}`, log },
      { status: 400 }
    );
  }

  log.format = detectFormat(raw);
  const rows = parseCatalogFromRawJson(raw, merchantId, productBaseUrl);
  log.parsedCount = rows.length;

  if (rows.length === 0) {
    log.step = "parse_catalog";
    log.error = "No products in file. Use FakeStore (array) or DummyJSON ({ products: [] }) format.";
    log.httpStatus = 400;
    return NextResponse.json(
      { error: log.error, log },
      { status: 400 }
    );
  }

  try {
    await prisma.merchants.create({
      data: {
        id: merchantId,
        name,
        home_url: homeUrl || null,
        connection_type: "url",
        connection_params: homeUrl ? { feedUrl: homeUrl } : undefined,
      },
    });
  } catch (e) {
    log.step = "create_merchant";
    log.error = e instanceof Error ? e.message : "Failed to create store";
    log.errorStack = e instanceof Error ? e.stack : undefined;
    log.httpStatus = 400;
    return NextResponse.json({ error: log.error, log }, { status: 400 });
  }

  try {
    await ingestProducts(merchantId, rows);
  } catch (e) {
    await prisma.merchants.delete({ where: { id: merchantId } }).catch(() => {});
    log.step = "ingest_products";
    log.error = e instanceof Error ? e.message : "Ingest failed";
    log.errorStack = e instanceof Error ? e.stack : undefined;
    log.httpStatus = 500;
    log.durationMs = Date.now() - startedAt;
    return NextResponse.json(
      { error: log.error, log },
      { status: 500 }
    );
  }

  log.step = "success";
  log.ingested = rows.length;
  log.durationMs = Date.now() - startedAt;

  return NextResponse.json({
    ok: true,
    merchantId,
    name,
    ingested: rows.length,
    log,
  });
}
