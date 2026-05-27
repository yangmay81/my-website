export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/admin/:path*", "/api/posts/:path*", "/api/upload/:path*"],
};
