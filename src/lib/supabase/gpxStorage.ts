// src/lib/supabase/gpxStorage.ts

// アップロード：API Route 経由でサーバー側で実行
export const uploadGpxFile = async (file: File, userId: string) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload-gpx', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Upload failed')
  }

  const data = await response.json()
  
  return {
    path: data.path,
    url: data.url,
  }
}

// 削除も API Route 経由にする場合
export const deleteGpxFile = async (path: string) => {
  const response = await fetch('/api/delete-gpx', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Delete failed')
  }

  return await response.json()
}