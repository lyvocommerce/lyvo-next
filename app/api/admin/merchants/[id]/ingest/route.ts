import { NextResponse } from "next/server";
import { loadCatalogForMerchant } from "@/lib/ingestion/load-catalog";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const result = await loadCatalogForMerchant(id);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error, ingested: 0 },
      { status: 400 }
    );
  }
  return NextResponse.json({
    ok: true,
    ingested: result.ingested,
  });
}
