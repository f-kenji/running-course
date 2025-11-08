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
        text-rose-600 border border-rose-400 bg-white hover:bg-rose-100\
         text-xs sm:text-sm px-1 sm:px-2 py-0.5 sm:py-1 "

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
        <header className="flex justify-between items-center mb-2 mx-4 sm:mx-6 z-50
                       p-2 sm:p-4"> 
            <h1 className="text-rose-600 font-bold text-lg sm:text-xl p-1 sm:p-2">
                <Link href="/">CourseFi</Link>
            </h1>
            <div className="flex items-center gap-1 sm:gap-2">
                {user ? (
                    <div className="">
                        <span className="text-xs sm:text-sm">
                            {user?.display_name
                                ? `${user.display_name}（ID: ****${user.id?.slice(-6) ?? '不明'}）`
                                : user.id
                                    ? `ゲスト（ID: ****${user.id.slice(-6)}）`
                                    : 'ゲスト（ID: 未登録）'}

                        </span>
                        <button
                            className={linkStyle}
                            onClick={() => {
                                supabase.auth.signOut();
                                router.push("/");
                            }}>
                            ログアウト
                        </button>
                    </div>
                ) : (
                    <>
                        <span className="text-xs sm:text-sm">ゲスト</span>
                        <Link
                            href="/loginGoogle"
                            className={`m-1 sm:m-2 ${linkStyle}`}>
                            ログイン
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}