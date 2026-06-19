import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_COOKIE } from "@/lib/auth-cookie";

// Where each role lands once authenticated.
const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin-dashboard",
  RESTAURANT: "/restaurant-dashboard",
  RIDER: "/rider-dashboard",
  USER: "/",
};

// Dashboards: only the matching role may enter. Tokens live in localStorage and
// are invisible here, so this checks the lightweight `cn_role` cookie set at
// login. The backend `authenticate` middleware remains the real authority.
const DASHBOARD_GUARDS: { prefix: string; role: string; signIn: string }[] = [
  { prefix: "/admin-dashboard", role: "ADMIN", signIn: "/admin-signin" },
  { prefix: "/restaurant-dashboard", role: "RESTAURANT", signIn: "/restaurant-signIn" },
  { prefix: "/restaurant-profile", role: "RESTAURANT", signIn: "/restaurant-signIn" },
  { prefix: "/rider-dashboard", role: "RIDER", signIn: "/rider-signIn" },
  // Onboarding pages — reached only via OAuth callback, which sets the role
  // cookie before redirecting here, so a legit user always matches.
  { prefix: "/restaurant-setup", role: "RESTAURANT", signIn: "/restaurant-signIn" },
  { prefix: "/rider-setup", role: "RIDER", signIn: "/rider-signIn" },
  { prefix: "/user-setup", role: "USER", signIn: "/user-signIn" },
];

// Customer-only areas: require an active USER session. A non-customer role is
// sent to their own dashboard; a guest is sent to the customer sign-in.
const CUSTOMER_PROTECTED_PREFIXES = ["/checkout", "/profile", "/order-confirmation"];

// Auth pages (sign-in + sign-up): an already-authenticated visitor (any role)
// is sent to their own dashboard instead of being shown a login/registration
// form on the shared domain.
const GUEST_ONLY_PATHS = [
  "/admin-signin",
  "/restaurant-signIn",
  "/rider-signIn",
  "/user-signIn",
  "/restaurant-signup",
  "/rider-signup",
  "/user-signup",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get(ROLE_COOKIE)?.value;

  // 1. Authenticated user on a sign-in / sign-up page -> their own dashboard.
  if (GUEST_ONLY_PATHS.includes(pathname)) {
    if (role && ROLE_HOME[role]) {
      return redirectTo(req, ROLE_HOME[role]);
    }
    return NextResponse.next();
  }

  // 2. Customer-only areas require a USER session.
  if (CUSTOMER_PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (role === "USER") return NextResponse.next();
    if (role && ROLE_HOME[role]) return redirectTo(req, ROLE_HOME[role]);
    return redirectToSignIn(req, "/user-signIn", pathname);
  }

  // 3. Dashboard access requires the matching role.
  const guard = DASHBOARD_GUARDS.find((g) => pathname.startsWith(g.prefix));
  if (!guard) return NextResponse.next();
  if (role === guard.role) return NextResponse.next();

  // Wrong role -> their own dashboard; no session -> the matching sign-in page.
  if (role && ROLE_HOME[role]) return redirectTo(req, ROLE_HOME[role]);
  return redirectToSignIn(req, guard.signIn, pathname);
}

function redirectTo(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

function redirectToSignIn(req: NextRequest, signIn: string, from: string) {
  const url = req.nextUrl.clone();
  url.pathname = signIn;
  url.search = "";
  url.searchParams.set("redirect", from);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/restaurant-dashboard/:path*",
    "/restaurant-profile/:path*",
    "/rider-dashboard/:path*",
    "/restaurant-setup/:path*",
    "/rider-setup/:path*",
    "/user-setup/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/order-confirmation/:path*",
    "/admin-signin",
    "/restaurant-signIn",
    "/rider-signIn",
    "/user-signIn",
    "/restaurant-signup",
    "/rider-signup",
    "/user-signup",
  ],
};
