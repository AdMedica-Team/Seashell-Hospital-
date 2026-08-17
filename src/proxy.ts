import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { auth } from "./auth.edge";

const handleI18nRouting = createMiddleware(routing);

// Matches /en/admin/..., /ar/admin/... (and /admin/... before locale negotiation redirects it)
const ADMIN_ROUTE = /^\/(en|ar)?\/?admin(\/.*)?$/;
const ADMIN_LOGIN_ROUTE = /^\/(en|ar)?\/?admin\/login\/?$/;

const proxy = auth((request) => {
  const { pathname } = request.nextUrl;

  if (ADMIN_ROUTE.test(pathname) && !ADMIN_LOGIN_ROUTE.test(pathname)) {
    // Optimistic check only — reads the already-verified session from the
    // request, no DB call here. Server Actions/pages re-check role
    // themselves (see lib/dal.ts); this just keeps unauthenticated/wrong
    // role visitors from ever rendering the admin shell.
    if (!request.auth?.user) {
      const locale = pathname.startsWith("/ar") ? "ar" : "en";
      return NextResponse.redirect(
        new URL(`/${locale}/admin/login`, request.url),
      );
    }

    if (
      (pathname.includes("/admin/users") || pathname.includes("/admin/audit-log")) &&
      request.auth.user.role !== "SUPER_ADMIN"
    ) {
      const locale = pathname.startsWith("/ar") ? "ar" : "en";
      return NextResponse.redirect(
        new URL(`/${locale}/admin/dashboard`, request.url),
      );
    }

    if (
      pathname.includes("/admin/settings") &&
      request.auth.user.role === "CONTENT_EDITOR"
    ) {
      const locale = pathname.startsWith("/ar") ? "ar" : "en";
      return NextResponse.redirect(
        new URL(`/${locale}/admin/dashboard`, request.url),
      );
    }
  }

  return handleI18nRouting(request);
});

export { proxy };

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
