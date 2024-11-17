"use client";
import { useState, useEffect } from 'react';

const urlB64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export default function NotificationTimer() {
    const [seconds, setSeconds] = useState<string>('');
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [isCountingDown, setIsCountingDown] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        // Immediately register service worker when component mounts
        async function setupPushNotifications() {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                console.warn('Push notifications not supported');
                return;
            }

            try {
                // Force update the service worker
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'none'
                });

                // Wait for the service worker to be ready
                await navigator.serviceWorker.ready;

                // Check existing subscription
                const existingSubscription = await registration.pushManager.getSubscription();
                if (existingSubscription) {
                    console.log('Existing subscription found:', existingSubscription);
                    setSubscription(existingSubscription);
                    return;
                }

                // Request permission
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    throw new Error('Permission not granted for notifications');
                }

                const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                if (!vapidKey) {
                    throw new Error('VAPID key not found');
                }

                const newSubscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlB64ToUint8Array(vapidKey)
                });

                console.log('New subscription created:', newSubscription);
                setSubscription(newSubscription);
            } catch (error) {
                console.error('Failed to setup push notifications:', error);
            }
        }

        setupPushNotifications();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isCountingDown && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsCountingDown(false);
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isCountingDown, timeLeft]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!subscription) {
            alert('Notifications not enabled!');
            return;
        }

        const secondsNum = parseInt(seconds);
        if (isNaN(secondsNum) || secondsNum <= 0) {
            alert('Please enter a valid number of seconds');
            return;
        }

        setTimeLeft(secondsNum);
        setIsCountingDown(true);

        try {
            const response = await fetch('/api/schedule-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    delayInSeconds: secondsNum,
                    subscription: subscription.toJSON(),
                    title: 'Timer Complete!',  // Add explicit title
                    body: `Your ${secondsNum}-second timer has finished!`  // Add explicit body
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to schedule notification');
            }

            setSeconds('');
        } catch (error) {
            console.error('Error scheduling notification:', error);
            setIsCountingDown(false);  // Reset countdown if there's an error
            alert('Failed to schedule notification: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Notification Timer Test</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="seconds" className="block text-sm font-medium text-gray-700 mb-1">
                        Seconds until notification:
                    </label>
                    <input
                        id="seconds"
                        type="number"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter seconds"
                        disabled={isCountingDown}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isCountingDown || !subscription}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                >
                    Start Timer
                </button>

                {isCountingDown && (
                    <div className="text-center p-4 bg-gray-100 rounded-md">
                        <p className="text-lg font-semibold">Time remaining:</p>
                        <p className="text-3xl font-bold text-blue-600">{timeLeft}s</p>
                    </div>
                )}

                {!subscription && (
                    <p className="text-red-500 text-sm">
                        Please allow notifications when prompted
                    </p>
                )}
            </form>
        </div>
    );
}