"use client";
import { useTransitConfig } from "@/hooks/useTransitConfig";
// import { redirect } from "next/navigation";

export default function CatchTheBus() {
    const transitConfig = useTransitConfig();
    console.log("transitConfig:", transitConfig); // ! Debugging

    // if (!transitConfig) redirect('/transit-config');
    return <div>
        <h1 className="text-center">Catch The Bus</h1>
    </div>;
}
