self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        
        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                vibrate: [200, 100, 200],
                tag: 'timer-notification',
                renotify: true,
                silent: false
            })
        );
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});