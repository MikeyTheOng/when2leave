import { prisma } from "@/lib/prisma";
import { Subscription } from "@prisma/client";
import { PushSubscription as WebPushSubscription } from 'web-push';

export async function storeSubscription(
    subscriptionId: string | null,
    subscription: WebPushSubscription
): Promise<Subscription> {
    try {
        const subscriptionData = {
            subscription: {
                endpoint: subscription.endpoint,
                expirationTime: subscription.expirationTime ?
                    Math.floor(subscription.expirationTime) : null,
                keys: {
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth
                }
            }
        };

        if (subscriptionId) {
            return await prisma.subscription.update({
                where: { id: subscriptionId },
                data: subscriptionData
            });
        }

        return await prisma.subscription.create({
            data: subscriptionData
        });
    } catch (error) {
        throw error;
    }
}