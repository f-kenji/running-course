import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    // NextAuth でセッション確認
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const userId = session.user.id
    const filePath = `${userId}/${Date.now()}-${file.name}`

    // Service Role を使ってアップロード（RLS をバイパス）
    const { data, error } = await supabaseAdmin.storage
      .from('gpx')
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type || 'application/gpx+xml',
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 公開URL取得
    const { data: urlData } = supabaseAdmin.storage
      .from('gpx')
      .getPublicUrl(data.path)

    return NextResponse.json({
      path: data.path,
      url: urlData.publicUrl
    })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}