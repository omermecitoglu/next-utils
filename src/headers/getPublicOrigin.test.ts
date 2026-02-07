import { headers as nextHeaders } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPublicOrigin } from "./getPublicOrigin";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

describe("getPublicOrigin", () => {
  const mockedHeaders = vi.mocked(nextHeaders);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw an error when headers are missing", async () => {
    const emptyHeaders = new Headers();
    await expect(getPublicOrigin(emptyHeaders)).rejects.toThrow();
  });

  it("should handle multiple hosts in the x-forwarded-host header", async () => {
    const headers = new Headers({
      "x-forwarded-proto": "https",
      "x-forwarded-host": "myapp.com, load-balancer.internal",
    });
    const origin = await getPublicOrigin(headers);
    expect(origin).toBe("https://myapp.com");
  });

  it("should correctly handle and normalize hosts that include ports", async () => {
    const headers = new Headers({
      "x-forwarded-proto": "https",
      "x-forwarded-host": "example.com:8080",
    });

    const origin = await getPublicOrigin(headers);
    expect(origin).toBe("https://example.com:8080");
  });

  it("should handle protocol/port weirdness", async () => {
    const headers = new Headers({
      "x-forwarded-proto": "http", // Dev environment maybe?
      "x-forwarded-host": "localhost:3000",
    });

    const origin = await getPublicOrigin(headers);
    expect(origin).toBe("http://localhost:3000");
  });

  it("should fallback to 'https' when x-forwarded-proto is missing", async () => {
    const headers = new Headers({
      "x-forwarded-host": "my-app.com",
      // "x-forwarded-proto" is intentionally omitted
    });

    const origin = await getPublicOrigin(headers);

    // Verify line 6 default logic
    expect(origin).toBe("https://my-app.com");
  });

  it("should throw a specific error message when URL generation fails (Line 16)", async () => {
    const headers = new Headers({
      "x-forwarded-proto": "invalid protocol", // Spaces are illegal in protocols
      "x-forwarded-host": "###", // Not a valid host
    });
    await expect(getPublicOrigin(headers)).rejects.toThrow("Invalid origin generated: invalid protocol://###");
  });

  it("should use nextHeaders() when no argument is passed (Line 6 Coverage)", async () => {
    // Setup the mock return value
    const mockHeadersInstance = new Headers({
      "x-forwarded-proto": "https",
      "x-forwarded-host": "mocked-origin.com",
    });

    mockedHeaders.mockResolvedValue(mockHeadersInstance);
    const origin = await getPublicOrigin();
    expect(origin).toBe("https://mocked-origin.com");
    expect(mockedHeaders).toHaveBeenCalledTimes(1);
  });
});
