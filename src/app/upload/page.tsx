// /app/upload/page.tsx
'use client';
import { useState } from 'react';
import Link from "next/link"
// import { supabase } from '../../lib/supabaseClient';
import PrefCitySelect from '../components/PrefCitySelect';
import Button from '../components/Button';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pref, setPref] = useState('');
  const [city, setCity] = useState('');
  const [distance, setDistance] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gpxFile || !title || !pref || !city) return;

    setLoading(true);

    // try {
    //   // 1. GPXファイルをSupabase Storageにアップロード
    //   const gpxName = `${Date.now()}-${gpxFile.name}`;
    //   const { data: gpxData, error: gpxError } = await supabase
    //     .storage
    //     .from('gpx-files')
    //     .upload(gpxName, gpxFile, { cacheControl: '3600', upsert: false });

    //   if (gpxError) throw gpxError;

    //   const gpxUrl = supabase
    //     .storage
    //     .from('gpx-files')
    //     .getPublicUrl(gpxName).data.publicUrl;

    //   // 2. サムネイル画像もあればアップロード
    //   let thumbnailUrl = '';
    //   if (thumbnail) {
    //     const thumbName = `${Date.now()}-${thumbnail.name}`;
    //     const { error: thumbError } = await supabase
    //       .storage
    //       .from('thumbnails')
    //       .upload(thumbName, thumbnail);
    //     if (thumbError) throw thumbError;
    //     thumbnailUrl = supabase
    //       .storage
    //       .from('thumbnails')
    //       .getPublicUrl(thumbName).data.publicUrl;
    //   }

    //   // 3. DBにレコード登録
    //   const { error: dbError } = await supabase
    //     .from('courses')
    //     .insert([{
    //       title,
    //       description,
    //       pref,
    //       city,
    //       distance: parseFloat(distance),
    //       gpx_url: gpxUrl,
    //       thumbnail: thumbnailUrl
    //     }]);

    //   if (dbError) throw dbError;

    setMessage('投稿成功！');
    setTitle('');
    setDescription('');
    setDistance('');
    setPref('');
    setCity('');
    setThumbnail(null);
    setGpxFile(null);

    // } catch (err: any) {
    //   console.error(err);
    //   setMessage(`エラー: ${err.message}`);
    // } finally {
    //   setLoading(false);
    // }
  };
  // ----------------------------------------
  // JSX 
  // ----------------------------------------
  // console.log('選択された市区:', pref, city)
  return (
    <>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">コースを投稿する</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-6">
            <input
              type="text"
              placeholder="タイトル"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md" />
            <textarea
              placeholder="説明"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md " />
            <input
              type="number"
              placeholder="距離(km)"
              value={distance}
              onChange={e => setDistance(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md" />
            <PrefCitySelect
              pref={pref}
              city={city}
              setPref={setPref}
              setCity={setCity} />
            <input
              type="file"
              accept=".gpx"
              onChange={e => setGpxFile(e.target.files?.[0] || null)}
              required
              className="border border-gray-300 rounded-md" />
            <input
              type="file"
              accept="image/*"
              onChange={e => setThumbnail(e.target.files?.[0] || null)}
              className="border border-gray-300 rounded-md" />
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="max-w-4xl w-24"
            >
              {loading ? '投稿中...' : '投稿'}
            </Button>
          </div>
        </form>
        {message && <p className="mt-2">{message}</p>}
      </div>
      <Link href="/">Running Course</Link>
    </>
  );
}