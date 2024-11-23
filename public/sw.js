let busMonitoringInterval = null;

self.addEventListener('install', () => {
    console.info('service worker installed.');
    self.skipWaiting(); // Add this to ensure the SW activates immediately
});

self.addEventListener('activate', (event) => {
    console.info('service worker activated.');
    event.waitUntil(clients.claim()); // Add this to ensure the SW takes control
});

const sendDeliveryReportAction = () => {
    console.log('Web push delivered.');
};

self.addEventListener('push', function (event) {
    if (!event.data) {
        return;
    }

    const payload = event.data.json();
    const { body, icon, image, badge, url, title } = payload;
    console.log('push payload:', payload);
    const notificationTitle = title ?? 'Hi'; // TODO: Change this to the actual title
    const notificationOptions = {
        body,
        icon,
        image,
        data: {
            url,
        },
        badge,
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions).then(() => {
            sendDeliveryReportAction();
        }),
    );
});

self.addEventListener('message', async (event) => {
    if (event.data.type === 'START_BUS_MONITORING') {
        console.log('START_BUS_MONITORING');
        const { busStopCode, busServices, walkingTime } = event.data;
        startBusMonitoring(busStopCode, busServices, walkingTime);
    } else if (event.data.type === 'STOP_BUS_MONITORING') {
        console.log('STOP_BUS_MONITORING');
        stopBusMonitoring();
    } else if (event.data.type === 'GET_MONITORING_STATE') {
        event.source?.postMessage({
            type: 'MONITORING_STATE',
            isMonitoring: busMonitoringInterval !== null
        });
    }
});

async function checkBusArrival(busStopCode, busServices, walkingTime) {
    const response = await fetch(`/api/busarrivals?busStopCode=${busStopCode}`);
    const busArrivals = await response.json();

    // ! Debugging
    // const formattedData = formatBusArrivalsForLogging(busArrivals);
    // console.log("Raw bus arrivals data:");
    // console.table(formattedData);
    // ! Debugging

    const selectedBusServicesFastestArrivalTimes = getSelectedBusArrivalTimes(busArrivals, busServices);

    // Filter buses based on walking time
    const notifyOnBuses = getBusesWithinWalkingTime(selectedBusServicesFastestArrivalTimes, walkingTime);
    // console.log("Notify on buses:", notifyOnBuses); // ! Debugging

    // Show notification if there are buses to notify about
    if (Object.keys(notifyOnBuses).length > 0) {
        const notificationBody = createNotificationMessage(notifyOnBuses);
        // console.log(`Notifying on buses: ${JSON.stringify(notifyOnBuses)}`); // ! Debugging
        await showNotification(notificationBody);
    }
}

// ! Debugging
// function formatBusArrivalsForLogging(busArrivals) {
//     return Object.entries(busArrivals).map(([busNo, times]) => ({
//         'Bus No': busNo,
//         'Next Bus': times[0],
//         'Next Bus 2': times[1],
//         'Next Bus 3': times[2]
//     }));
// }
// ! Debugging

function getSelectedBusArrivalTimes(busArrivals, busServices) {
    const selectedTimes = {};
    for (const bus of busServices) {
        const busArrivalsForBus = busArrivals[bus]?.[0];
        if (busArrivalsForBus) {
            selectedTimes[bus] = busArrivalsForBus;
        }
    }
    return selectedTimes;
}

function getBusesWithinWalkingTime(arrivalTimes, walkingTime) {
    const eligibleBuses = {};
    for (const bus in arrivalTimes) {
        const arrivalTime = arrivalTimes[bus];
        if (arrivalTime >= walkingTime && arrivalTime <= walkingTime + 2) {
            // console.log(`Bus ${bus} arrives in ${arrivalTime} minutes`); // ! Debugging
            eligibleBuses[bus] = arrivalTime;
        }
    }
    return eligibleBuses;
}

function createNotificationMessage(notifyOnBuses) {
    const busesToNotifyOn = Object.keys(notifyOnBuses).join(', ');
    const bussesArrivalTimes = Object.values(notifyOnBuses).join(', ');
    return `Leave now to catch bus ${busesToNotifyOn} arriving in ${bussesArrivalTimes} minutes!`;
}

async function showNotification(notificationBody) {
    await self.registration.showNotification("Time to Leave!", {
        body: notificationBody,
        data: {
            url: '/catch-the-bus'
        }
    });
}

function startBusMonitoring(busStopCode, busServices, walkingTime) {
    stopBusMonitoring();
    
    busMonitoringInterval = setInterval(
        () => checkBusArrival(busStopCode, busServices, walkingTime),
        5000 // Check every 5 seconds
    );
    checkBusArrival(busStopCode, busServices, walkingTime);
}

function stopBusMonitoring() {
    if (busMonitoringInterval) {
        clearInterval(busMonitoringInterval);
        busMonitoringInterval = null;
        // Broadcast monitoring state to all clients
        clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'MONITORING_STATE',
                    isMonitoring: false
                });
            });
        });
    }
}

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    stopBusMonitoring();
    if (event.notification.data?.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});