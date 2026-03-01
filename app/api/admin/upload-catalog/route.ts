import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addAllowedHostsFromImageUrls } from "@/lib/image-allowed-hosts";
import { ingestProducts, parseCatalogFromRawJson, resolveCategoriesForProducts } from "@/lib/ingestion/load-catalog";

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  const merchantId = (formData.get("merchantId") as string | null)?.trim();

  if (!file || !merchantId) {
    return NextResponse.json(
      { error: "file and merchantId are required" },
      { status: 400 }
    );
  }

  const merchant = await prisma.merchants.findUnique({
    where: { id: merchantId },
  });
  if (!merchant) {
    return NextResponse.json(
      { error: "Merchant not found" },
      { status: 404 }
    );
  }

  let raw: unknown;
  try {
    const text = await file.text();
    raw = JSON.parse(text);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid JSON";
    return NextResponse.json(
      { error: `Failed to parse JSON: ${msg}` },
      { status: 400 }
    );
  }

  const productBaseUrl = merchant.home_url ?? "https://example.com";
  const rows = parseCatalogFromRawJson(raw, merchantId, productBaseUrl);

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No products in file. Use FakeStore (array) or DummyJSON ({ products: [] }) format." },
      { status: 400 }
    );
  }

  await addAllowedHostsFromImageUrls(rows.map((r) => r.image_url));
  await resolveCategoriesForProducts(rows);

  try {
    await ingestProducts(merchantId, rows);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ingest failed";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, ingested: rows.length });
}
