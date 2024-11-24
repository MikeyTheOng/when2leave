"use client";
import React, { useEffect, useState } from 'react';
import { useTransitConfig } from "@/hooks/useTransitConfig";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useMonitoring } from "@/hooks/useMonitoring";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { H1 } from "@/components/shared/headers";
import Link from "next/link";
import { AlertTriangle } from 'lucide-react';

export default function CatchTheBus() {
    const { transitConfig, isLoading } = useTransitConfig();
    const { isMonitoring, startMonitoring, stopMonitoring } = useMonitoring({
        transitConfig
    });

    const {
        isPushNotificationsSupported,
        permission,
        error: pushError,
        subscribe: registerPushNotifications
    } = usePushNotifications();

    const [compatibilityError, setCompatibilityError] = useState<string | null>(null);

    useEffect(() => {
        if (!isPushNotificationsSupported()) {
            alert('Please open this page in a web browser!');
            setCompatibilityError(
                "When2Leave requires push notifications which are only supported on web browsers and non-iOS devices."
            );
        }
    }, [isPushNotificationsSupported]);

    const handleStartMonitoring = async () => {
        if (!isPushNotificationsSupported()) {
            setCompatibilityError(
                "When2Leave requires push notifications which are only supported on web browsers and non-iOS devices."
            );
            return;
        }

        if (permission !== 'granted') {
            try {
                await registerPushNotifications();
                return;
            } catch (error) {
                console.error('Failed to register push notifications:', error);
                setCompatibilityError(
                    "Failed to enable notifications. Please check your browser settings and ensure notifications are allowed."
                );
                return;
            }
        }

        try {
            await startMonitoring();
        } catch (error) {
            console.error('Failed to start monitoring:', error);
            setCompatibilityError(
                "Failed to start monitoring. Please refresh the page and try again."
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-4 w-[90vw] sm:w-[400px] mx-auto space-y-4">
            <H1 className="text-center">Catch The Bus</H1>

            {/* Compatibility Error Alert */}
            {compatibilityError && (
                <Alert variant="destructive" className="border-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Compatibility Issue</AlertTitle>
                    <AlertDescription>
                        {compatibilityError}
                    </AlertDescription>
                </Alert>
            )}

            {/* Push Notification Error */}
            {pushError && !compatibilityError && (
                <Alert variant="destructive">
                    <AlertDescription>
                        Error with notifications: {pushError}
                    </AlertDescription>
                </Alert>
            )}

            {!transitConfig ? (
                <Alert>
                    <AlertTitle>You&apos;ve to Select Your Bus Stop First!</AlertTitle>
                    <AlertDescription>
                        Please select your bus stop and services first! <br />
                        <Link href="/transit-config" className="underline hover:text-primary">
                            Go to Transit Config
                        </Link>
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
                            {permission !== 'granted' && !compatibilityError && " You'll need to enable notifications."}
                        </AlertDescription>
                    </Alert>
                    <Button
                        className="w-full"
                        onClick={handleStartMonitoring}
                        disabled={!!compatibilityError || !isPushNotificationsSupported()}
                    >
                        Tell me when my bus is coming!
                    </Button>
                </div>
            )}
        </div>
    );
}