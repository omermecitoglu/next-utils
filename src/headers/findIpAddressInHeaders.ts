import "server-only";
import net from "node:net";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export function findIpAddressInHeaders(headers: ReadonlyHeaders): string | null {
  const headerKeys = ["x-real-ip", "x-forwarded-for", "CF-Connecting-IP"];

  for (const key of headerKeys) {
    const value = headers.get(key);
    if (!value) continue;

    const parts = value.split(",");
    for (const part of parts) {
      const cleanIp = part.trim();

      if (net.isIP(cleanIp) !== 0) {
        return cleanIp;
      }
    }
  }

  return null;
}
