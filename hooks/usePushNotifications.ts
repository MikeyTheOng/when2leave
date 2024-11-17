import { useCallback, useEffect, useState } from "react";

const SERVICE_WORKER_FILE_PATH = './sw.js'; // * To register service-worker it must be accessible at https://domain.example/sw.js

interface PushNotificationBody {
    title: string;
    body: string;
    image?: string;
    icon?: string;
    url?: string;
}

export function usePushNotifications() {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [error, setError] = useState<string | null>(null);

    // Checks if the browser supports push notifications
    const arePushNotificationsUnsupported = useCallback(() => {
        return (
            !('serviceWorker' in navigator) ||
            !('PushManager' in window) ||
            !('showNotification' in ServiceWorkerRegistration.prototype)
        )
    }, []);

    const subscribe = useCallback(async (): Promise<void> => {
        try {
            const registration = await navigator.serviceWorker.ready;

            // Check for and remove existing subscription
            // ! Debugging, to remove
            // const existingSubscription = await registration.pushManager.getSubscription();
            // if (existingSubscription) {
            //     await existingSubscription.unsubscribe();
            // }

            // Validate VAPID key exists
            const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidKey) {
                throw new Error('VAPID public key is not configured');
            }

            const pushSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKey,
            });

            console.info('Created subscription Object: ', pushSubscription.toJSON());
            await submitSubscription(pushSubscription);
            setSubscription(pushSubscription);
            setError(null);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Failed to subscribe to push notifications';
            setError(errorMessage);
            console.error('Failed to subscribe: ', e);
        }
    }, []);

    const registerAndSubscribe = useCallback(async (): Promise<void> => {
        try {
            const registration = await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
            console.log('Service Worker registered successfully:', registration);
            await subscribe();
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Failed to register service worker';
            setError(errorMessage);
            console.error('Failed to register service-worker: ', e);
        }
    }, [subscribe]);

    async function submitSubscription(subscription: PushSubscription): Promise<void> {
        try {
            const res = await fetch('/api/web-push/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to submit subscription: ${res.status} ${errorText}`);
            }

            const result = await res.json();
            console.log('Subscription submitted:', result);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Failed to submit subscription';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }

    const sendPushNotification = useCallback(async (message: string | null): Promise<void> => {
        const pushBody: PushNotificationBody = {
            title: 'Test Push',
            body: message ?? 'This is a test push message',
            // image: '/next.png',
            // icon: 'nextjs.png',
            url: 'https://google.com',
        };

        try {
            const res = await fetch('/api/web-push/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pushBody),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to send push notification: ${res.status} ${errorText}`);
            }

            const result = await res.json();
            console.log('Push notification result:', result);
            setError(null);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Failed to send push notification';
            setError(errorMessage);
            console.error('Failed to send push notification:', e);
        }
    }, []);

    useEffect(() => {
        setPermission(Notification.permission);

        if (permission === 'granted') {
            registerAndSubscribe();
        } else {
            Notification.requestPermission().then((permission) => {
                setPermission(permission);
            });
        }
    }, [permission, registerAndSubscribe]);

    return {
        arePushNotificationsUnsupported,
        subscription,
        permission,
        error,
        subscribe: registerAndSubscribe,
        sendPushNotification,
    };
}