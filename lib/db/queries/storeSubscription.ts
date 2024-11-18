import { prisma } from "@/lib/prisma";
import { Subscription } from "@prisma/client";
import { PushSubscription as WebPushSubscription } from 'web-push';

export async function storeSubscription(subscription: WebPushSubscription): Promise<Subscription> {
    return await prisma.subscription.create({
        data: {
            subscription: {
                endpoint: subscription.endpoint,
                expirationTime: subscription.expirationTime ?
                    Math.floor(subscription.expirationTime) : null,
                keys: {
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth
                }
            }
        },
    });
}