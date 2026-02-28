import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  getSessionCookie,
} from "@/lib/admin-auth";

const MAX_AGE_SECONDS = 24 * 60 * 60; // 24 hours

type Body = { password?: string };

export async function POST(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Admin auth not configured" },
      { status: 503 }
    );
  }
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }
  const password = typeof body.password === "string" ? body.password : "";
  if (password !== expected) {
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  }
  const token = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", getSessionCookie(token, MAX_AGE_SECONDS));
  return response;
}
