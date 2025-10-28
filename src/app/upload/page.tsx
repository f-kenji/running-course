// /app/upload/page.tsx
'use client'
import Link from "next/link"
import { supabase } from '@/lib/supabase/client'
import UploadForm from "@/app/components/features/uploadForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push("/loginGoogle")
      }
      setLoading(false)
    }
    checkUser()
  }, [router])

  if (loading) return <p>認証中...</p>

  return (
    <>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">コースを投稿する</h1>
        <UploadForm />
      </div >
      <Link href="/">Running Course</Link>
    </>
  );
}