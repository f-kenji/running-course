// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // --- 状態チェック追加 ---
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader?.includes("sb-access-token")) {
    console.log("Middleware: cookie present (logged in)");
  } else {
    console.log("Middleware: no auth cookie (guest)");
  }

  return response;

}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */

    {
      source:
        '/((?!api|webhook|zoom|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

