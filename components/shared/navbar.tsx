"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
    const pathname = usePathname()
    
    return (
        <nav className="z-50
            px-6 py-[10px] bg-primary text-white flex flex-col gap-1 text-sm tracking-tight sm:flex-row sm:items-center sm:gap-4 sm:text-base sm:tracking-normal 
            [&_a]:font-semibold [&_a]:rounded-md [&_a]:ring-transparent [&_a]:transition-colors [&_a]:duration-150 
            [&_a:hover]:text-black [&_a:hover]:underline
            [&_a:focus]:outline-none [&_a:focus-visible]:underline [&_a:focus-visible]:text-primary">
            <ul className="flex flex-row gap-4 justify-end w-full">
                {pathname !== "/catch-the-bus" && (
                    <li>
                        <Link href="/catch-the-bus">Catch Bus</Link>
                    </li>
                )}
                {pathname !== "/transit-config" && (
                    <li>
                        <Link href="/transit-config">Select Bus</Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}
