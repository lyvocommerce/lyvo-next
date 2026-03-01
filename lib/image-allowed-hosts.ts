import { prisma } from "@/lib/prisma";

/**
 * Extract hostnames from product image URLs and insert them into allowed_image_hosts.
 * Call this when uploading a catalog so images from those domains load on the frontend.
 * Skips duplicates (createMany with skipDuplicates).
 */
export async function addAllowedHostsFromImageUrls(urls: (string | null | undefined)[]): Promise<string[]> {
  const hostnames = new Set<string>();
  for (const url of urls) {
    if (!url || typeof url !== "string") continue;
    try {
      const u = new URL(url);
      if (u.hostname && (u.protocol === "https:" || u.protocol === "http:")) {
        hostnames.add(u.hostname);
      }
    } catch {
      // ignore invalid URL
    }
  }
  if (hostnames.size === 0) return [];
  const list = Array.from(hostnames);
  await prisma.allowedImageHost.createMany({
    data: list.map((hostname) => ({ hostname })),
    skipDuplicates: true,
  });
  return list;
}

/**
 * Returns the set of hostnames allowed for image proxy.
 * Only from: allowed_image_hosts table (managed in admin) + merchants' home_url and connection_params.feedUrl.
 * No hardcoded list — add domains in the admin panel.
 */
export async function getAllowedImageHosts(): Promise<Set<string>> {
  const [dbHosts, merchants] = await Promise.all([
    prisma.allowedImageHost.findMany({ select: { hostname: true } }),
    prisma.merchants.findMany({
      select: { home_url: true, connection_params: true },
    }),
  ]);
  const hosts = new Set<string>(dbHosts.map((r: { hostname: string }) => r.hostname));
  for (const m of merchants) {
    if (m.home_url) {
      try {
        const u = new URL(m.home_url);
        if (u.hostname) hosts.add(u.hostname);
      } catch {
        // ignore invalid URL
      }
    }
    const params = m.connection_params as { feedUrl?: string } | null;
    const feedUrl = params?.feedUrl;
    if (typeof feedUrl === "string") {
      try {
        const u = new URL(feedUrl);
        if (u.hostname) hosts.add(u.hostname);
      } catch {
        // ignore
      }
    }
  }
  return hosts;
}
