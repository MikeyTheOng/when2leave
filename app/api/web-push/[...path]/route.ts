import { getSubscription } from '@/lib/db/queries/getSubscription';
import { PushSubscription } from 'web-push';
import { storeSubscription } from '@/lib/db/queries/storeSubscription';
import webpush from 'web-push';

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_CONTACT_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  switch (pathname) {
    case '/api/web-push/subscription':
      return setSubscription(request);
    case '/api/web-push/send':
      return sendPush(request);
    default:
      return notFoundApi();
  }
}

async function setSubscription(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const subscriptionId = searchParams.get('subscriptionId') || null;
  const body: { subscription: PushSubscription } = await request.json();

  try {
    const result = await storeSubscription(subscriptionId, body.subscription);

    const message = subscriptionId ? 'Subscription updated.' : 'Subscription created.';
    return new Response(JSON.stringify({ message, data: result }), {});
  } catch (error) {
    console.error('Error setting subscription:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to set subscription' }),
      { status: 500 }
    );
  }
}

async function sendPush(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const subscriptionId = searchParams.get('subscriptionId');
    if (!subscriptionId) return new Response(JSON.stringify({ error: 'No subscription ID, notification not sent.' }), { status: 400 });

    const result = await getSubscription(subscriptionId);
    if (!result) return new Response(JSON.stringify({ error: 'No subscription, notification not sent.' }), { status: 400 });

    const body = await request.json();
    const pushPayload = JSON.stringify(body);

    await webpush.sendNotification(result.subscription, pushPayload);
    console.log('Notification sent.');

    return new Response(JSON.stringify({ message: 'Notification sent.' }), {});
  } catch (error) {
    console.error('Error sending push notification:', error);
    return new Response(JSON.stringify({ error: 'Failed to send push notification' }), { status: 500 });
  }
}

async function notFoundApi() {
  return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 404,
  });
}
