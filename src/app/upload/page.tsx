// /app/upload/page.tsx
'use client'
import UploadForm from "@/app/components/features/uploadForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"

export default function UploadPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // 認証状態が確定したら、未ログインならリダイレクト
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/loginGoogle")
    }
  }, [status, router])

  if (status === "loading") {
    return <p>認証中...</p>
  }

  // 遅延なく、未ログインなら何も表示しない
  if (!session) return null

  return (
    <>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">コースを投稿する</h1>
        <UploadForm />
      </div >
    </>
  );
}