// app/api/schedule-notification/route.ts
import { NextResponse } from 'next/server';
import webpush from 'web-push';

// Types
type RequestBody = {
    delayInSeconds: number;
    subscription: webpush.PushSubscription;
};

if (!process.env.VAPID_CONTACT_EMAIL || 
    !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
    !process.env.VAPID_PRIVATE_KEY
) {
    throw new Error('Missing required VAPID environment variables');
}

webpush.setVapidDetails(
    `mailto:${process.env.VAPID_CONTACT_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export async function POST(request: Request) {
    try {
        const { delayInSeconds, subscription } = await request.json() as RequestBody;

        // Schedule the notification
        setTimeout(async () => {
            const payload = JSON.stringify({
                title: 'Timer Complete!',
                body: `Your ${delayInSeconds}-second timer has finished!`,
            });

            try {
                await webpush.sendNotification(subscription, payload);
            } catch (error) {
                console.error('Error sending notification:', error);
            }
        }, delayInSeconds * 1000);

        return NextResponse.json({
            success: true,
            message: 'Notification scheduled'
        });

    } catch (error) {
        console.error('Failed to schedule notification:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}