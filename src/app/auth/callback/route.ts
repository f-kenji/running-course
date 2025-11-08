import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/loginGoogle`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Session exchange error:", error);
    return NextResponse.redirect(`${requestUrl.origin}/loginGoogle`);
  }

  // 成功 → Cookieにセッションセット済み
  return NextResponse.redirect(`${requestUrl.origin}/upload`);
}
