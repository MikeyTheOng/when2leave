import { useState, useCallback, useEffect } from 'react';
import { TransitConfig } from '@/lib/types';

interface UseMonitoringProps {
    transitConfig: TransitConfig | null;
}

interface UseMonitoringReturn {
    isMonitoring: boolean;
    startMonitoring: () => Promise<void>;
    stopMonitoring: () => void;
}

export function useMonitoring({ transitConfig }: UseMonitoringProps): UseMonitoringReturn {
    const [isMonitoring, setIsMonitoring] = useState(false);

    useEffect(() => {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Workers are not supported in this environment');
            return;
        }

        const messageHandler = (event: MessageEvent) => {
            if (event.data.type === 'MONITORING_STATE') {
                setIsMonitoring(event.data.isMonitoring);
            }
        };

        // Listen for messages from the service worker
        navigator.serviceWorker.addEventListener('message', messageHandler);
        
        // Request monitoring state from sw
        navigator.serviceWorker.ready.then(registration => {
            registration.active?.postMessage({ type: 'GET_MONITORING_STATE' });
        });

        return () => {
            navigator.serviceWorker.removeEventListener('message', messageHandler);
        };
    }, []);

    const startMonitoring = useCallback(async () => {
        if (!transitConfig) {
            throw new Error('Transit config is required to start monitoring');
        }

        const registration = await navigator.serviceWorker.ready;
        registration.active?.postMessage({
            type: 'START_BUS_MONITORING',
            busStopCode: transitConfig.busStop.BusStopCode,
            busServices: transitConfig.busServices,
            walkingTime: transitConfig.walkingTime
        });
        
        setIsMonitoring(true);
    }, [transitConfig]);

    const stopMonitoring = useCallback(() => {
        navigator.serviceWorker.ready.then(registration => {
            registration.active?.postMessage({
                type: 'STOP_BUS_MONITORING'
            });
            setIsMonitoring(false);
        });
    }, []);

    return {
        isMonitoring,
        startMonitoring,
        stopMonitoring
    };
}
