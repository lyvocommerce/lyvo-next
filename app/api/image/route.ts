import { NextRequest, NextResponse } from "next/server";
import { getAllowedImageHosts } from "@/lib/image-allowed-hosts";

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");
  if (!urlParam || typeof urlParam !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(urlParam);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return NextResponse.json({ error: "Only http(s) allowed" }, { status: 400 });
  }

  const allowed = await getAllowedImageHosts();
  const isVercelBlob = parsed.hostname.includes("blob.vercel-storage.com");
  if (!isVercelBlob && !allowed.has(parsed.hostname)) {
    return NextResponse.json(
      { error: "Host not allowed. Add this store domain in the admin panel." },
      { status: 403 }
    );
  }

  try {
    const res = await fetch(parsed.toString(), {
      headers: { "User-Agent": "LyvoShop/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: res.status === 404 ? 404 : 502 }
      );
    }
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Fetch failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
