import { prisma } from "@/lib/prisma";
import { Subscription } from "@prisma/client";

export async function getSubscription(subscriptionId: string): Promise<Subscription | null> {
    return await prisma.subscription.findUnique({
        where: { id: subscriptionId },
    });
}