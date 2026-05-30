import "server-only";

export interface ProxyHandlerOptions {
  publicPages?: string[],
  authPages?: string[],
  isLoggedIn: () => boolean,
  redirectToHomePage: () => Response,
  redirectToLoginPage: () => Response,
  defaultProcedure(pathname: string): Response,
}

export function handleProxy(locales: readonly string[], request: Request, options: ProxyHandlerOptions): Response {
  for (const pathname of options.publicPages ?? []) {
    if (new URLPattern({ pathname: `/:locale?${pathname}` }).test(request.url)) {
      return options.defaultProcedure(pathname);
    }
  }

  for (const pathname of options.authPages ?? []) {
    if (new URLPattern({ pathname: `/:locale?${pathname}` }).test(request.url)) {
      if (options.isLoggedIn()) {
        return options.redirectToHomePage();
      }
      return options.defaultProcedure(pathname);
    }
  }

  if (!options.isLoggedIn()) {
    return options.redirectToLoginPage();
  }

  const match = new URLPattern({ pathname: `/:locale(${locales.join("|")})?/:rest*` }).exec(new URL(request.url));
  const pathname = `/${(match && match.pathname.groups.rest) ?? ""}`;
  return options.defaultProcedure(pathname);
}
