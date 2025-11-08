// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Secure 属性を localhost では外す
            const isLocalhost =
              request.headers.get("host")?.includes("localhost") ?? false;
            response.cookies.set({
              name,
              value,
              ...options,
              secure: !isLocalhost,
            });
          });
        },
      },
    }
  );

  await supabase.auth.getSession();

  return response;
}
