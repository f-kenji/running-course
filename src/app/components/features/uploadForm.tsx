'use client';

import React from 'react'
import { useEffect, useState } from 'react';
import PrefCitySelect from '@/app/components/features/pref-city-select';
import Button from '@/app/components/ui/Button';
import AttributeSelect from '@/app/components/features/courseAttributes';
import { insertCourse } from '@/lib/supabase/courses';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useUser } from '@/context/UserContext';

// ----------------------------------------
// CSS 
// ----------------------------------------
const inputStyle = "border border-gray-300 rounded-xl"
const attStyle = "rounded-xl text-gray-800  border border-rose-400 bg-rose-200 p-1"

//user入れる

export default function UploadForm() {
    // ----------------------------------------
    // initialize
    // ----------------------------------------
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pref, setPref] = useState('');
    const [city, setCity] = useState('');
    const [distance, setDistance] = useState('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [gpxFile, setGpxFile] = useState<File | null>(null);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [dbError, setDbError] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [snackBarshow, setSnackBarShow] = useState(false);
    let [dialogOpen, setDialogOpen] = useState(false)
    const { user } = useUser();

    // 仮設定
    const gpxUrl = "/activity_20443982855.gpx";
    const thumbnailUrl = "";

    //-----------------------------------------------
    // eventHandler - コースデータを投稿
    //-----------------------------------------------
    const handlePost = async () => {
        // if (!gpxFile || !title || !pref || !city) return;
        if (!user) {
            alert("投稿するにはログインが必要です");
            return;
        }
        setLoading(true);       // ← 処理開始
        setDbError(null);       // ← 前のエラーをクリア

        try {
            // 1. GPXファイルをSupabase Storageにアップロード
            // const gpxName = `${Date.now()}-${gpxFile.name}`;
            // const { data: gpxData, error: gpxError } = await supabase
            //   .storage
            //   .from('gpx-files')
            //   .upload(gpxName, gpxFile, { cacheControl: '3600', upsert: false });

            // if (gpxError) throw gpxError;


            // const gpxUrl = supabase
            //   .storage
            //   .from('gpx-files')
            //   .getPublicUrl(gpxName).data.publicUrl;

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

            // 3. DBにレコード登録
            // const { error: dbError } = await supabase
            //   .from('courses')
            //   .insert([{
            //     title,
            //     description,
            //     pref,
            //     city,
            //     distance: parseFloat(distance),
            //     gpx_url: gpxUrl,
            //     thumbnail: thumbnailUrl
            //   }]);

            // if (dbError) throw dbError;

            const { data, error } = await insertCourse({
                title,
                description,
                prefecture: pref,
                city,
                distance: parseFloat(distance),
                gpx_url: gpxUrl,
                image_url: thumbnailUrl,
                attributes: selectedAttributes,
                user_id: user?.id ?? null,
            });

            if (data && data.length > 0) {
                const newCourse = data[0];
                setMessage(`登録しました\n
           タイトル：${newCourse.title}`);
            }

            setTitle('');
            setDescription('');
            setDistance('');
            setPref('');
            setCity('');
            setThumbnail(null);
            setGpxFile(null);
            setSelectedAttributes({})

            setDialogOpen(false) //ダイアログを閉じる

            console.log("投稿成功", data);
        } catch (error: any) {
            console.error("DBエラー", error);
            setDbError(error.message);
        } finally {
            setLoading(false);
        }

    };
    // ----------------------------------------
    //useeffect - タイトルの挿入
    // ----------------------------------------
    useEffect(() => {
        if (city) {
            setTitle(`${city} ランニング`)
        }
    }, [city])
    // ----------------------------------------
    //useeffect - 「投稿しました」スナックバー
    // ----------------------------------------
    useEffect(() => {
        if (message) {
            setSnackBarShow(true)
            const timer = setTimeout(() => setSnackBarShow(false), 4000); // 4秒でフェードアウト
            return () => clearTimeout(timer);
        }
    }, [message]);
    // ----------------------------------------
    // JSX 
    // ----------------------------------------
    // console.log('選択された市区:', pref, city)
    // console.log("title", title);
    // console.log("description", description);
    // console.log("distance",parseFloat(distance))
    // console.log(gpxUrl)
    // console.log(thumbnailUrl)
    // console.log("selectedAttribute", selectedAttributes)
    return (
        <>
            <div className="max-w-md mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">コースを投稿する</h1>
                <div className="space-y-4">
                    <div className="flex flex-col space-y-6">
                        <PrefCitySelect
                            pref={pref}
                            city={city}
                            setPref={setPref}
                            setCity={setCity} />
                        <input
                            type="text"
                            placeholder="タイトル"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            className={`w-full p-2  ${inputStyle}`} />
                        <textarea
                            placeholder="説明"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className={`w-full p-2  ${inputStyle}`} />
                        <div>
                            <input
                                type="number"
                                placeholder="距離(km)"
                                value={distance}
                                onChange={e => setDistance(e.target.value)}
                                className={`w-sm p-2 ${inputStyle}`} />
                            <span className="ml-2">km</span>
                        </div>
                        <input
                            type="file"
                            accept=".gpx"
                            onChange={e => setGpxFile(e.target.files?.[0] || null)}
                            required
                            className={inputStyle} />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setThumbnail(e.target.files?.[0] || null)}
                            className={inputStyle} />
                        <AttributeSelect selected={selectedAttributes} setSelected={setSelectedAttributes} />
                        <Button
                            type="button"
                            disabled={loading}
                            variant="primary"
                            className="w-24 px-4 py-2"
                            onClick={() => setDialogOpen(true)}>
                            {loading ? '投稿中...' : '投稿'}
                        </Button>
                    </div>
                    {/* スナックバー */}
                    <div
                        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 
              px-4 py-2 rounded-xl shadow-md whitespace-pre-line leading-[0.7]
              bg-rose-200 text-rose-600 border border-rose-400
              transition-all duration-100
              ${snackBarshow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {message}
                    </div>
                </div>
                {/* 投稿確認ダイアログ */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center">
                    <DialogPanel
                        transition
                        className="shadow-[0_8px_30px_rgba(0,0,0,0.25)] max-w-3xl w-full 
            space-y-6 bg-white p-12 rounded-3xl text-center max-h-[80vh] overflow-y-auto
            duration-100 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0">
                        <DialogTitle className="font-bold text-lg">
                            以下の内容で投稿します、よろしいですか？
                        </DialogTitle>
                        <div className='flex items-center justify-center'>
                            <div className="text-2xl font-bold space-y-1 text-left">
                                <div><span className='text-base'>エリア：</span>{`${pref} ${city}`}</div>
                                <div><span className='text-base'>タイトル：</span>{`${title}`}</div>
                                <div className='text-sm font-light '>説明：</div>
                                <div className='text-xs indent-3 whitespace-normal max-w-[400px]'>{description}</div>
                                <div><span className='text-base'>距離：</span>{`${distance}`} km</div>
                                <div className='flex text-[12px] font-medium gap-2 max-w-[400px] flex-wrap'>
                                    <p className={`${attStyle} empty:hidden`}>{selectedAttributes.time}</p>
                                    <p className={`${attStyle} empty:hidden`}>{selectedAttributes.terrain}</p>
                                    <p className={`${attStyle} empty:hidden`}>{selectedAttributes.surface}</p>
                                    <p className={`${attStyle} empty:hidden`}>{selectedAttributes.traffic}</p>
                                    <p className={`${attStyle} empty:hidden`}>{selectedAttributes.lighting}</p>
                                    <p className={`${attStyle} empty:hidden`}>{selectedAttributes.signal}</p>
                                    <p className={`${attStyle} empty:hidden`}>{selectedAttributes.shade}</p>
                                    <p className={`${attStyle} empty:hidden`}>{selectedAttributes.rain}</p>
                                    <p className={`${attStyle} empty:hidden`}>{selectedAttributes.scenery}</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-2 items-center justify-center'>
                            <Button
                                onClick={handlePost}
                                disabled={loading}
                                variant="primary"
                                className='w-24 px-4 py-2'>
                                {loading ? '投稿中...' : 'OK'}
                            </Button>
                            <Button onClick={() => setDialogOpen(false)}
                                variant="primary"
                                className='px-4 py-2'
                            >キャンセル</Button>
                        </div>
                    </DialogPanel>
                </Dialog >
            </div >
        </>
    )
}

