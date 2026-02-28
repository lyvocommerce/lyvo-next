/**
 * Edge-compatible admin session verification (Web Crypto only).
 * Used by middleware. Token format must match lib/admin-auth.ts.
 */

const COOKIE_NAME = "admin_session";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function verifyWithWebCrypto(payload: string, sigB64: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expectedBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  const expectedBytes = new Uint8Array(expectedBuf);
  let sigBytes: Uint8Array;
  try {
    sigBytes = base64UrlDecode(sigB64);
  } catch {
    return false;
  }
  if (sigBytes.length !== expectedBytes.length) return false;
  return timingSafeEqual(sigBytes, expectedBytes);
}

/** Async verification for Edge middleware: parse cookie and validate token. */
export async function verifySessionCookieEdge(cookieHeader: string | null): Promise<boolean> {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
  const raw = match?.[1]?.trim();
  if (!raw) return false;
  let value: string;
  try {
    value = decodeURIComponent(raw);
  } catch {
    return false;
  }
  const i = value.lastIndexOf(".");
  if (i === -1) return false;
  const payload = value.slice(0, i);
  const sig = value.slice(i + 1);
  const secret = process.env.ADMIN_PASSWORD ?? "";
  if (!secret) return false;
  const ts = parseInt(payload, 10);
  if (Number.isNaN(ts) || Date.now() - ts >= TTL_MS) return false;
  return verifyWithWebCrypto(payload, sig, secret);
}
