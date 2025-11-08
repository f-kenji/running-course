// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // まず Supabase クライアントを作成（Cookie状態を正確に確認するため）
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // middleware では response 側でセットするため、ここは何もしない
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    console.log(`✅ Middleware: logged in as ${session.user.email}`);
  } else {
    console.log("🚫 Middleware: no auth cookie (guest)");
  }

  // updateSession() によって Cookie を再同期
  const response = await updateSession(request);

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|webhook|zoom|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
