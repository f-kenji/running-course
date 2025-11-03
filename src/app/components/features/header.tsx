'use client';
import { useUser } from "@/context/UserContext";
import { supabase } from '@/lib/supabase/client';
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


// ----------------------------------------
// CSS 
// ----------------------------------------
const linkStyle = "text-sm ml-4 transition rounded-md px-1\
        text-rose-600 border border-rose-400 bg-white hover:bg-rose-100 "

export default function Header() {
    const { user } = useUser();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // SSRとCSRのズレを防ぐ

    // console.log(user);
    return (
        <header className="flex justify-between items-center mb-2 ml-6 mr-6 z-50">
            <h1 className=" text-rose-600 font-bold text-xl p-2 ">
                <Link href="/">CourseFi</Link>
            </h1>
            <div className="flex items-center">
                {user ? (
                    <div className="">
                        <span className="text-sm">
                            {user?.display_name
                                ? `${user.display_name}（ID: ****${user.id?.slice(-6) ?? '不明'}）`
                                : user.id
                                    ? `ゲスト（ID: ****${user.id.slice(-6)}）`
                                    : 'ゲスト（ID: 未登録）'}
                            {/* {user?.display_name
                                ? user.display_name
                                : user.id
                                    ? `ゲスト****${user.id.slice(-8)}`
                                    : 'ゲスト'} */}
                        </span>
                        <button
                            className={linkStyle}
                            onClick={() => {
                                supabase.auth.signOut()
                                router.push("/")
                            }}>
                            ログアウト</button>
                    </div>
                ) : (
                    <>
                        <span className="text-sm">ゲスト</span>
                        <Link
                            href="/loginGoogle"
                            className={`m-2 ${linkStyle}`}>
                            ログイン
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}