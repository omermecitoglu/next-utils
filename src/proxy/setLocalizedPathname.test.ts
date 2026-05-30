import { describe, expect, it } from "vitest";
import { setLocalizedPathname } from "./setLocalizedPathname";

describe("setLocalizedPathname", () => {
  const locales = ["en", "tr"];
  it("should change the pathname correctly while there is no locale prefix", () => {
    const pathname1 = setLocalizedPathname(locales, "https://example.com/dashboard", "/login").pathname;
    expect(pathname1).toBe("/login");
    const pathname2 = setLocalizedPathname(locales, new URL("/dashboard", "https://example.com"), "/login").pathname;
    expect(pathname2).toBe("/login");
    const pathname3 = setLocalizedPathname(locales, "https://example.com/logout", "/").pathname;
    expect(pathname3).toBe("/");
    const pathname4 = setLocalizedPathname(locales, "https://example.com/settings/account", "/profile").pathname;
    expect(pathname4).toBe("/profile");
    const pathname5 = setLocalizedPathname(locales, "https://example.com/user/details", "/profile/details").pathname;
    expect(pathname5).toBe("/profile/details");
  });

  it("should change the pathname correctly with locale prefix", () => {
    const pathname1 = setLocalizedPathname(locales, "https://example.com/en/dashboard", "/login").pathname;
    expect(pathname1).toBe("/en/login");
    const pathname2 = setLocalizedPathname(locales, "https://example.com/tr/dashboard", "/login").pathname;
    expect(pathname2).toBe("/tr/login");
    const pathname3 = setLocalizedPathname(locales, "https://xx.com/en/user/details", "/profile/details").pathname;
    expect(pathname3).toBe("/en/profile/details");
    const pathname4 = setLocalizedPathname(locales, "https://xx.com/en/logout", "/").pathname;
    expect(pathname4).toBe("/en");
  });
});
