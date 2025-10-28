// src/lib/supabase/gpxStorage.ts
import { supabase } from './client'

//アップロード：登録用のパスとURLを返す
export const uploadGpxFile = async (file: File, userId: string) => {
  const filePath = `${userId}/${Date.now()}-${file.name}`

  // --- アップロード ---
  const { data, error } = await supabase.storage
    .from('gpx')
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type,
    })

  if (error) throw error

  const gpxPath = data.path

  // --- 公開URL取得 ---
  const { data: urlData } = supabase.storage
    .from('gpx')
    .getPublicUrl(gpxPath)

  const gpxUrl = urlData.publicUrl

  return {
    path: gpxPath,    // 例: "12345/1735069600000-myfile.gpx"
    url: gpxUrl,      // 例: "https://xxxx.supabase.co/storage/v1/object/public/gpx/12345/1735069600000-myfile.gpx"
  }
}

// 削除
export const deleteGpxFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from('gpx')
    .remove([path])
  if (error) throw error
  return data
}

// 取得
export const listGpxFiles = async () => {
  const { data, error } = await supabase.storage
    .from('gpx')
    .list('', { limit: 100 })
  if (error) throw error
  return data
}
