import { describe, expect, it } from "vitest";
import { findIpAddressInHeaders } from "./findIpAddressInHeaders";

describe("findIpAddressInHeaders", () => {
  it("should return the real IP address", () => {
    const headers = new Headers();
    headers.set("x-real-ip", "1.2.3.4");
    const output = findIpAddressInHeaders(headers);
    expect(output).toBe("1.2.3.4");
  });

  it("should return the real IP address if the app is behind a reverse proxy server (like Nginx)", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "1.2.3.4");
    const output = findIpAddressInHeaders(headers);
    expect(output).toBe("1.2.3.4");
  });

  it("should return the real IP address if the request is coming from Cloudflare", () => {
    const headers = new Headers();
    headers.set("CF-Connecting-IP", "1.2.3.4");
    const output = findIpAddressInHeaders(headers);
    expect(output).toBe("1.2.3.4");
  });

  it("should return null if none of the headers are providing the IP address with a valid key", () => {
    const headers = new Headers();
    headers.set("hey-this-is-my-ip-address", "1.2.3.4");
    const output = findIpAddressInHeaders(headers);
    expect(output).toBe(null);
  });

  it("should handle a comma-separated list in x-forwarded-for and (ideally) return the client IP", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "203.0.113.195, 70.41.3.18, 150.172.238.178");
    const output = findIpAddressInHeaders(headers);
    expect(output).toBe("203.0.113.195");
  });

  it("should correctly identify and return an IPv6 address", () => {
    const headers = new Headers();
    headers.set("x-real-ip", "2001:4860:4860::8888");
    const output = findIpAddressInHeaders(headers);
    expect(output).toBe("2001:4860:4860::8888");
  });

  it("should handle a list where the first entry is invalid/malicious", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "unknown, 1.2.3.4");
    const output = findIpAddressInHeaders(headers);
    expect(output).toBe("1.2.3.4");
  });
});
