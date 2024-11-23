"use client";

import { useTransitConfig } from "@/hooks/useTransitConfig";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useMonitoring } from "@/hooks/useMonitoring";

import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { H1 } from "@/components/shared/headers";
import Link from "next/link";

export default function CatchTheBus() {
    const { transitConfig, isLoading } = useTransitConfig();
    const { isMonitoring, startMonitoring, stopMonitoring } = useMonitoring({
        transitConfig
    });

    const {
        arePushNotificationsUnsupported,
        permission,
        error: pushError,
        subscribe: registerPushNotifications
    } = usePushNotifications();

    const handleStartMonitoring = async () => {
        if (arePushNotificationsUnsupported()) {
            alert('Push notifications are not supported in your browser');
            return;
        }

        if (permission !== 'granted') {
            try {
                await registerPushNotifications();
                return;
            } catch (error) {
                console.error('Failed to register push notifications:', error);
                alert('Failed to enable notifications. Please try again.');
                return;
            }
        }

        try {
            await startMonitoring();
        } catch (error) {
            console.error('Failed to start monitoring:', error);
            alert('Failed to start monitoring. Please try again.');
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-pulse">Loading...</div>
        </div>;
    }

    return (
        <div className="p-4 w-[90vw] sm:w-[400px] mx-auto space-y-4">
            <H1 className="text-center">Catch The Bus</H1>

            {pushError && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Error with notifications: {pushError}
                    </AlertDescription>
                </Alert>
            )}

            { !transitConfig ? (
                <Alert>
                    <AlertTitle>You&apos;ve to Select Your Bus Stop First!</AlertTitle>
                    <AlertDescription>
                        Please select your bus stop and services first! <br/>
                        <Link href="/transit-config" className="underline hover:text-primary">Go to Transit Config</Link>
                    </AlertDescription>
                </Alert>
            ) : isMonitoring ? (
                <div className="space-y-4">
                    <Alert>
                        <AlertTitle>Monitoring Bus Arrival Times</AlertTitle>
                        <AlertDescription>
                            You&apos;ll receive a notification when your bus is about {transitConfig?.walkingTime} minutes away.
                            We&apos;re monitoring busses {transitConfig?.busServices.join(', ')} ({transitConfig?.busServices.length} services).
                        </AlertDescription>
                    </Alert>
                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={stopMonitoring}
                    >
                        I Caught The Bus!
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <Alert>
                        <AlertTitle>Ready to Catch The Bus?</AlertTitle>
                        <AlertDescription>
                            Click below when you&apos;re ready to start monitoring your bus arrival times.
                            {permission !== 'granted' && " You'll need to enable notifications."}
                        </AlertDescription>
                    </Alert>
                    <Button
                        className="w-full"
                        onClick={handleStartMonitoring}
                        disabled={arePushNotificationsUnsupported()}
                    >
                        Tell me when my bus is coming!
                    </Button>
                </div>
            )}

            {/* <div className="mt-8 p-4 bg-gray-100 rounded-lg overflow-x-auto">
                <div className="text-sm font-medium mb-2">Your Transit Config:</div>
                <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(transitConfig, null, 2)}
                </pre>
            </div> */}
        </div>
    );
}