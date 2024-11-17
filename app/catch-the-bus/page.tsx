"use client";
import NotificationTimer from "@/components/notificationTimer";

import { useTransitConfig } from "@/hooks/useTransitConfig";
import { redirect } from "next/navigation";

export default function CatchTheBus() {
    const transitConfig = useTransitConfig();
    console.log("transitConfig:", transitConfig); // ! Debugging

    if (!transitConfig) redirect('/transit-config');
    return <div>
        <h1>Catch The Bus</h1>
        <NotificationTimer />
    </div>;
}
