// /app/upload/page.tsx
'use client'
import Link from "next/link"
import { supabase } from '@/lib/supabase/client'
import { redirect } from 'next/navigation';
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
      <UploadForm />
      <Link href="/">Running Course</Link>
    </>
  );
}