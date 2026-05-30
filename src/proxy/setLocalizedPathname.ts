export function setLocalizedPathname(locales: readonly string[], input: string | URL, targetPathname: string): URL {
  const url = typeof input === "string" ? new URL(input) : new URL(input.toString());
  const localePattern = new URLPattern({ pathname: `/:locale(${locales.join("|")})/:rest*` });
  const match = localePattern.exec(url);

  if (!match) {
    url.pathname = targetPathname;
    return url;
  }

  const { locale } = match.pathname.groups;

  const normalizedTarget = targetPathname === "/" ? `/${locale}` : `/${locale}${targetPathname}`;
  url.pathname = normalizedTarget;
  return url;
}
