"use client";
import { Button } from "@/components/shadcn/button";

import { useTransitConfig } from "@/hooks/useTransitConfig";
import { usePushNotifications } from "@/hooks/usePushNotifications";
// import { redirect } from "next/navigation";

export default function CatchTheBus() {
    const transitConfig = useTransitConfig();
    console.log("transitConfig:", transitConfig); // ! Debugging

    // if (!transitConfig) redirect('/transit-config');
    return <div>
        <h1 className="text-center">Catch The Bus</h1>
        <Test />
    </div>;
}

const Test = () => {
    const { subscription, permission, sendPushNotification } = usePushNotifications();
    return <div className="max-w-[50vw]">
        <p>Permission: {permission}</p>
        {subscription ? (
            <>
                <div className="overflow-x-auto">
                    <pre className="whitespace-pre">
                        {JSON.stringify(subscription, null, 2)}
                    </pre>
                </div>
                <Button onClick={() => sendPushNotification("Test Notification!")}>Test Notification</Button>
            </>
        ) : (
            <>Not subscribed</>
        )}
    </div>;
}