self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { 
        title: 'Default Notification',
        body: 'No data was provided'
    };
    
    const options = {
        body: data.body,
        icon: '/icon.png',
        badge: '/badge.png',
        timestamp: data.timestamp ? new Date(data.timestamp).getTime() : Date.now(),
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'close',
                title: 'Close'
            }
        ],
        data: {
            url: self.registration.scope // URL to open when notification is clicked
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    // Open or focus the app when notification is clicked
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function(clientList) {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                }
                return clients.openWindow(event.notification.data.url);
            })
    );
});