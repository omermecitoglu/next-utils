import "server-only";
import { headers as nextHeaders } from "next/headers";

export async function getPublicOrigin(headers?: Headers): Promise<string> {
  const h = headers ?? await nextHeaders();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const rawHost = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const host = rawHost.split(",")[0].trim();
  if (!host) {
    throw new Error("Missing host headers; cannot determine public origin.");
  }
  try {
    const url = new URL(`${proto}://${host}`);
    return url.origin;
  } catch {
    throw new Error(`Invalid origin generated: ${proto}://${host}`);
  }
}
