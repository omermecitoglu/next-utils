import { describe, expect, it, vi } from "vitest";
import { handleProxy } from "./handleProxy";

// Mock server-only
vi.mock("server-only", () => ({}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

describe("handleProxy", () => {
  function generateMockRequest(pathname: string): Request {
    return new Request(new URL(pathname, "https://example.com"), {
      method: "GET",
      headers: {
        cookie: "session=abc",
        authorization: "Bearer token",
      },
    });
  }

  const mockHomePageResponse = Response.json({ mock: true, home: true });
  const mockLoginPageResponse = Response.json({ mock: true, login: true });
  const mockDefaultProcedure = Response.json({ mock: true, default: true });

  const mockOptions = {
    redirectToHomePage(): Response {
      return mockHomePageResponse;
    },
    redirectToLoginPage(): Response {
      return mockLoginPageResponse;
    },
    defaultProcedure(): Response {
      return mockDefaultProcedure;
    },
  };

  it("should call the default procedure for public pages", () => {
    const output = handleProxy(["en", "de"], generateMockRequest("/en/dashboard"), {
      publicPages: ["/dashboard"],
      isLoggedIn: () => false,
      ...mockOptions,
    });
    expect(output === mockDefaultProcedure).toBe(true);
  });

  it("should redirect to the home page when trying to access auth pages while already logged in", () => {
    const output = handleProxy(["en", "de"], generateMockRequest("/en/login"), {
      authPages: ["/login"],
      isLoggedIn: () => true,
      ...mockOptions,
    });
    expect(output === mockHomePageResponse).toBe(true);
  });

  it("should call the default procedure when trying to access auth pages while not logged in", () => {
    const output = handleProxy(["en", "de"], generateMockRequest("/en/login"), {
      authPages: ["/login"],
      isLoggedIn: () => false,
      ...mockOptions,
    });
    expect(output === mockDefaultProcedure).toBe(true);
  });

  it("should redirect to the login page when trying to access the app while not logged in", () => {
    const output = handleProxy(["en", "de"], generateMockRequest("/en/dashboard"), {
      isLoggedIn: () => false,
      ...mockOptions,
    });
    expect(output === mockLoginPageResponse).toBe(true);
  });

  it("should call the default procedure when trying to access the app while already logged in", () => {
    const output = handleProxy(["en", "de"], generateMockRequest("/en/dashboard"), {
      publicPages: ["/"],
      authPages: ["/login"],
      isLoggedIn: () => true,
      ...mockOptions,
    });
    expect(output === mockDefaultProcedure).toBe(true);
  });
});
