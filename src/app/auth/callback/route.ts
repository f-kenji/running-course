// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  console.log("Callback URL:", request.url);
  console.log("Code:", code);

  // エラーチェック
  if (error) {
    console.error("OAuth Error:", error);
    return NextResponse.redirect(`${url.origin}/loginGoogle?error=${error}`);
  }

  if (!code) {
    console.log("No code found in callback URL");
    return NextResponse.redirect(`${url.origin}/loginGoogle`);
  }

  const response = NextResponse.redirect(`${url.origin}/upload`);

  // 正しい cookie 管理を行う createServerClient
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.headers
            .get("cookie")
            ?.split("; ")
            .map((c) => {
              const [name, ...rest] = c.split("=");
              return { name, value: rest.join("=") };
            }) ?? [];
        },
        setAll(cookiesToSet) {
          const isLocalhost = url.hostname === "localhost";
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieString = `${name}=${value}; Path=/; ${
              isLocalhost ? "" : "Secure;"
            } HttpOnly; SameSite=Lax${
              options?.maxAge ? `; Max-Age=${options.maxAge}` : ""
            }`;
            response.headers.append("set-cookie", cookieString);
          });
        },
      },
    }
  );

  // 認可コードをセッションに変換
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("Session exchange error:", exchangeError);
    return NextResponse.redirect(`${url.origin}/loginGoogle`);
  }

  console.log("✅ Session exchanged successfully");
  return response;
}
