// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 🍪 ここでCookieを全部ログ出力！
  console.log("🍪 All cookies:", request.cookies.getAll());

  const response = await updateSession(request);

  // --- 状態チェック追加 ---
  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader?.includes("sb-access-token")) {
    console.log("✅ Middleware: cookie present (logged in)");
  } else {
    console.log("🚫 Middleware: no auth cookie (guest)");
  }

  return response;
}

export const config = {
  matcher: [
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
