import { Subscription } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

const SERVICE_WORKER_FILE_PATH = '/sw.js'; // * To register service-worker it must be accessible at https://domain.example/sw.js

interface PushNotificationBody {
    title: string;
    body: string;
    image?: string;
    icon?: string;
    url?: string;
}

// Implemented based on https://medium.com/@ameerezae/implementing-web-push-notifications-in-next-js-a-complete-guide-e21acd89492d
// https://github.com/ameerezae/web-push-nextjs

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

    const registerServiceWorker = useCallback(async (): Promise<ServiceWorkerRegistration> => {
        try {
            const registration = await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);
            console.log('Service Worker registered successfully:', registration);
            return registration;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Failed to register service worker';
            setError(errorMessage);
            console.error('Failed to register service-worker: ', e);
            throw new Error(errorMessage);
        }
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
            const subscription = await submitSubscription(pushSubscription);
            
            console.log('Received subscription from server:', subscription);
            console.log('Attempting to store subscriptionId:', subscription.id);
            
            localStorage.setItem('subscriptionId', subscription.id);
            
            const storedId = localStorage.getItem('subscriptionId');
            console.log('Verified stored subscriptionId:', storedId);

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
            await registerServiceWorker();
            await subscribe();
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Failed to register service worker';
            setError(errorMessage);
            console.error('Failed to register service-worker: ', e);
        }
    }, [subscribe, registerServiceWorker]);

    // Store subscription in db
    async function submitSubscription(subscription: PushSubscription): Promise<Subscription> {
        try {
            const subscriptionId = localStorage.getItem('subscriptionId');
            // Remove the error throw and make the subscriptionId optional in the URL
            const url = subscriptionId 
                ? `/api/web-push/subscription?subscriptionId=${subscriptionId}`
                : '/api/web-push/subscription';

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to submit subscription: ${res.status} ${errorText}`);
            }

            const resData = await res.json();
            return resData.data;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Failed to submit subscription';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }

    const sendPushNotification = useCallback(async (message: string | null): Promise<void> => {
        const pushBody: PushNotificationBody = {
            title: 'Test Notification',
            body: message ?? 'This is a test push message',
            // image: '/next.png',
            // icon: 'nextjs.png',
            url: window.location.origin,
        };

        try {
            const subscriptionId = localStorage.getItem('subscriptionId');
            if (!subscriptionId) throw new Error('No subscription ID');

            const res = await fetch(`/api/web-push/send?subscriptionId=${subscriptionId}`, {
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