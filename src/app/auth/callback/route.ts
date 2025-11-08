// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    console.error("OAuth Error:", error);
    return NextResponse.redirect(`${url.origin}/loginGoogle?error=${error}`);
  }

  if (!code) {
    console.log("No code found in callback URL");
    return NextResponse.redirect(`${url.origin}/loginGoogle`);
  }

  const response = NextResponse.redirect(`${url.origin}/upload`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.headers.get("cookie") ?? "";
        },
        set(name, value, options) {
          response.headers.append(
            "set-cookie",
            `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax`
          );
        },
        remove(name, options) {
          response.headers.append(
            "set-cookie",
            `${name}=; Path=/; Max-Age=0`
          );
        },
      },
    }
  );

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("Session exchange error:", exchangeError);
    return NextResponse.redirect(`${url.origin}/loginGoogle`);
  }

  console.log("Session exchanged successfully");
  return response;
}
