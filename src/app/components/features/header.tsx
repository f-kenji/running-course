import Link from "next/link"

export default function Header() {
    return (
        <header>
            <h1 className=" text-rose-600 font-bold text-xl p-6 mb-2 ">
                <Link href="/">Running Course</Link>
            </h1>
        </header>
    );
}