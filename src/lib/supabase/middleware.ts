// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request: Request) {
  let response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.headers.get("cookie") ?? "";
        },
        set(name, value, options) {
          response.headers.append("set-cookie", `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax`);
        },
        remove(name, options) {
          response.headers.append("set-cookie", `${name}=; Path=/; Max-Age=0`);
        },
      },
    }
  );

  await supabase.auth.getUser();
  return response;
}
