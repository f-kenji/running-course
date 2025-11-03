'use client';

import React from 'react'
import { useEffect, useState } from 'react';
import PrefCitySelect from '@/app/components/features/pref-city-select';
import Button from '@/app/components/ui/Button';
import AttributeSelect from '@/app/components/features/courseAttributes';
import { insertCourse, updateCourse } from '@/lib/supabase/courses';
import { uploadGpxFile } from '@/lib/supabase/gpxStorage'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useUser } from '@/context/UserContext';
import GpxUploadForm from './gpxUploadForm';
import DynamicMap from "@/app/components/features/dynamicMap";
import type { CourseInsert, CourseRow } from '@/types/course.type';
import courseAttributes from '@/app/data/courseAttributes.json';

type UploadFormProps = {
    course?: CourseRow | null; // ← これがあれば「編集モード」
};

// ----------------------------------------
// CSS 
// ----------------------------------------
const inputStyle = "border border-gray-300 rounded-xl"
const attStyle = "rounded-xl text-gray-800  border border-rose-400 bg-rose-200 p-1"

export default function UploadForm({ course }: UploadFormProps) {
    const { user } = useUser();

    // ----------------------------------------
    // initialize (course があれば既存データを反映)
    // ----------------------------------------
    const [title, setTitle] = useState(course?.title ?? '');
    const [description, setDescription] = useState(course?.description ?? '');
    const [pref, setPref] = useState(course?.prefecture ?? '');
    const [city, setCity] = useState(course?.city ?? '');
    const [distance, setDistance] = useState(course?.distance?.toString() ?? '');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [gpxFile, setGpxFile] = useState<File | string | null>(course?.gpx_url ?? null);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(
        (course?.attributes && typeof course.attributes === 'object' && !Array.isArray(course.attributes))
            ? (course.attributes as Record<string, string>)
            : {}
    );
    const [loading, setLoading] = useState(false);
    const [dbError, setDbError] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [snackBarshow, setSnackBarShow] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const attributeKeys = Object.keys(courseAttributes) as (keyof typeof courseAttributes)[];

    // const gpxUrl = "/activity_20443982855.gpx"; // 仮設定
    // const thumbnailUrl = course?.image_url ?? '';
    const thumbnailUrl = "";

    //-----------------------------------------------
    // eventHandler - 投稿 or 更新
    //-----------------------------------------------
    const handleSubmit = async () => {
        // TODO：コメントアウトをもどす
        if (!user) return alert('ログインしてください');
        if (!gpxFile && !course?.gpx_url) return alert('GPXファイルが必要です');
        if (description.length > 1000) return alert('説明文は1000文字以内にしてください');

        setLoading(true);
        setDbError(null);

        try {
            let gpxData = { url: course?.gpx_url ?? '', path: course?.gpx_path ?? '' };

            // 新しいファイルがある場合だけアップロード
            if (gpxFile instanceof File) {
                gpxData = await uploadGpxFile(gpxFile, user.id);
            }

            if (course) {
                // ===== 更新 =====
                const { data, error } = await updateCourse(course.id, {
                    title,
                    description,
                    prefecture: pref,
                    city,
                    distance: parseFloat(distance),
                    gpx_path: gpxData.path,
                    gpx_url: gpxData.url,
                    image_url: thumbnailUrl,
                    attributes: selectedAttributes,
                });

                if (error) throw new Error(error);
                setMessage(`更新しました\n
                    タイトル：${data?.title}`);
            } else {
                // ===== 新規登録 =====
                const { data, error } = await insertCourse({
                    title,
                    description,
                    prefecture: pref,
                    city,
                    distance: parseFloat(distance),
                    gpx_path: gpxData.path,
                    gpx_url: gpxData.url,
                    image_url: thumbnailUrl,
                    attributes: selectedAttributes,
                    user_id: user.id,
                });

                if (error) throw new Error(error);
                setMessage(`登録しました\n
                    タイトル：${data?.[0]?.title}`);
            }

            setDialogOpen(false);
            if (course) {
                // 編集モード → 閉じるだけ
                setDialogOpen(false);
            } else {
                // 新規モード → リセット
                setTitle('');
                setDescription('');
                setDistance('');
                setPref('');
                setCity('');
                setThumbnail(null);
                setGpxFile(null);
                setSelectedAttributes({});
                setDialogOpen(false);
            }
        } catch (error: any) {
            console.error('DBエラー', error);
            setDbError(error.message);
        } finally {
            setLoading(false);
        }
    };
    //-----------------------------------------------
    // eventHandler - 投稿ダイアログを開く、入力チェック
    //-----------------------------------------------
    const handleDialogOpen = () => {
        // if (!gpxFile || !title || !pref || !city) return;
        // ユーザーがログインしているか
        // TODO：コメントアウトをもどす
        if (!user) return alert('ログインしてください');
        // GPXファイルがあるか
        if (!gpxFile && !course?.gpx_url) return alert('GPXファイルが必要です');
        // 説明文の文字数チェック
        if (description.length > 1000) return alert('説明文は1000文字以内にしてください');
        // ダイアログを開く
        setDialogOpen(true);
    }
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
    return (
        <>
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
                    <GpxUploadForm
                        inputStyle={inputStyle}
                        gpxFile={gpxFile}
                        setGpxFile={setGpxFile}
                        isEdit={!!course}
                        existingGpxUrl={course?.gpx_url}
                    />
                    <AttributeSelect selected={selectedAttributes} setSelected={setSelectedAttributes} />
                    <Button
                        type="button"
                        disabled={loading}
                        variant="primary"
                        className="w-24 px-4 py-2"
                        onClick={handleDialogOpen}>
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
                    <div className='text-2xl font-bold '>
                        <p><span className='text-base'>エリア：</span>{`${pref} ${city}`}</p>
                        <p><span className='text-base'>タイトル：</span>{`${title}`}</p>
                    </div>
                    {/* マップ表示 */}
                    <DynamicMap
                        url={typeof gpxFile === 'string'
                            ? gpxFile
                            : gpxFile
                                ? URL.createObjectURL(gpxFile)
                                : ''
                        }
                    />
                    <div className='flex items-center justify-center'>
                        <div className="font-bold space-y-1 text-left">
                            <div className='text-sm font-light '>説明：</div>
                            <div className='text-xs font-medium indent-3 whitespace-normal max-w-[400px]'>{description}</div>
                            <div><span className='text-base'>距離：</span>{`${distance}`} km</div>
                            {/* コース属性 */}
                            <div className='flex text-[12px] font-medium gap-2 max-w-[400px] flex-wrap'>
                                {attributeKeys.map((key) => {
                                    const value = selectedAttributes[key as string]; // selectedAttributes の型が Record<string,string>
                                    return value ? (
                                        <p key={String(key)} className={attStyle}>
                                            {value}
                                        </p>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-3 items-center justify-center'>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            variant="primary"
                            className='px-4 py-2 w-32'>
                            {loading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                    投稿中...
                                </>
                            ) : (
                                'OK'
                            )}
                        </Button>
                        <Button onClick={() => setDialogOpen(false)}
                            variant="primary"
                            className='px-4 py-2 w-32'
                        >キャンセル</Button>
                    </div>
                    <p className='text-sm text-left'>この投稿には自宅や職場などが特定されうる場所が含まれる場合があります。投稿前に位置情報をご確認ください。
                        また、現在ストレージ容量に限りがあるため、一時的に投稿できないことがあります。</p>
                </DialogPanel>
            </Dialog >
        </>
    )
}

