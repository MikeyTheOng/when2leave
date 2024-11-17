import { useState, useEffect } from 'react';
import { TransitConfig } from '@/lib/types';

export const useTransitConfig = () => {
    const [transitConfig, setTransitConfig] = useState<TransitConfig | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('transitConfig');
        if (stored) {
            setTransitConfig(JSON.parse(stored));
        }
    }, []);

    return transitConfig;
};
