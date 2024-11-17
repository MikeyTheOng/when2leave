// app/api/schedule-notification/route.ts
import { NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure web-push with your VAPID keys
webpush.setVapidDetails(
    `mailto:${process.env.VAPID_CONTACT_EMAIL}`, 
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
    try {
        const { delayInSeconds, subscription, title, body } = await request.json();

        // Validate subscription object
        if (!subscription || !subscription.endpoint || !subscription.keys) {
            return NextResponse.json(
                { error: 'Invalid subscription object' },
                { status: 400 }
            );
        }

        const scheduledTime = new Date(Date.now() + delayInSeconds * 1000).toISOString();
        
        // Send a test notification immediately to verify the subscription
        try {
            await webpush.sendNotification(
                subscription,
                JSON.stringify({
                    title: "Notification created",
                    body: "This is a test notification",
                    timestamp: scheduledTime
                })
            );
        } catch (error) {
            // Check for expired or invalid subscription
            if (
                error && 
                typeof error === 'object' && 
                'statusCode' in error && 
                (error.statusCode === 404 || error.statusCode === 410)
            ) {
                return NextResponse.json(
                    { error: 'Subscription has expired or is invalid' },
                    { status: 400 }
                );
            }
            throw error;
        }

        // Schedule the notification
        setTimeout(async () => {
            try {
                await webpush.sendNotification(
                    subscription,
                    JSON.stringify({
                        title,
                        body,
                        timestamp: scheduledTime
                    })
                );
                console.log('Notification sent successfully');
            } catch (error) {
                console.error('Error sending notification:', error);
            }
        }, delayInSeconds * 1000);

        return NextResponse.json({
            success: true,
            message: 'Notification scheduled',
            scheduledFor: scheduledTime
        });

    } catch (error) {
        console.error('Error scheduling notification:', error);
        return NextResponse.json(
            { error: 'Failed to schedule notification' },
            { status: 500 }
        );
    }
}