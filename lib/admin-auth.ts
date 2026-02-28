import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_session";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return "";
  return secret;
}

function sign(payload: string): string {
  const secret = getSecret();
  if (!secret) return "";
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verify(value: string): boolean {
  const secret = getSecret();
  if (!secret) return false;
  const i = value.lastIndexOf(".");
  if (i === -1) return false;
  const payload = value.slice(0, i);
  const sig = value.slice(i + 1);
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (sig.length !== expected.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(sig, "base64url"), Buffer.from(expected, "base64url"))) return false;
  } catch {
    return false;
  }
  const ts = parseInt(payload, 10);
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts < TTL_MS;
}

export function createSessionToken(): string {
  return sign(String(Date.now()));
}

export function verifySessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
  const value = match?.[1]?.trim();
  if (!value) return false;
  return verifySessionValue(value);
}

export function verifySessionValue(value: string): boolean {
  try {
    return verify(decodeURIComponent(value));
  } catch {
    return false;
  }
}

export function getSessionCookie(value: string, maxAgeSeconds: number): string {
  const encoded = encodeURIComponent(value);
  const isProd = process.env.NODE_ENV === "production";
  const secure = isProd ? "; Secure" : "";
  return `${COOKIE_NAME}=${encoded}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`;
}

export function clearSessionCookie(): string {
  const isProd = process.env.NODE_ENV === "production";
  const secure = isProd ? "; Secure" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export { COOKIE_NAME };
