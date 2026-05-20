const PROTECTED_PREFIXES = ["/bookings", "/book/", "/booking/"] as const;

export function isProtectedPath(pathname: string): boolean {
  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return /^\/flights\/[^/]+\/seats/.test(pathname);
}

export function isAuthPath(pathname: string): boolean {
  return pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup");
}

export function sanitizeRedirectPath(path: string | null | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }
  return path;
}
