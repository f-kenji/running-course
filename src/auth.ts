// auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { v4 as uuidv4 } from "uuid"
import { UserProfileRow } from "./types/user.type"

export const runtime = "nodejs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,  // Vercel の動的 URL に対応
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        console.error("signIn: user.email is missing")
        return false
      }

      try {
        // メールアドレスで既存ユーザーを検索
        const { data: existingUser } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("email", user.email)
          .maybeSingle<UserProfileRow>();

        // 既存ユーザーがいればそのID、いなければ新しいUUIDを生成
        const userId = existingUser?.id ?? uuidv4()
        const displayName = existingUser?.display_name ?? ""; 

        const { data, error } = await supabaseAdmin
          .from("users")
          .upsert(
            {
              id: userId,
              email: user.email,
              full_name: user.name ?? "",
              avatar_url: user.image ?? "",
              display_name: displayName,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "email" // email での重複チェック
            }
          )
          .select("*")
          .single()

        if (error) {
          console.error("Supabase upsert error:", error)
          return true
        }

        console.log("Supabase upsert success:", data)
        return true
      } catch (e) {
        console.error("Unexpected signIn error:", e)
        return true
      }
    },

    async jwt({ token, user }) {
      if (user && user.email) {
        try {
          // Supabaseからユーザー情報を取得
          const { data } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("email", user.email)
            .single()

          if (data) {
            token.id = data.id
          }
          token.email = user.email
        } catch (e) {
          console.error("jwt callback error:", e)
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})