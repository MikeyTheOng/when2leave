import { useState, useEffect } from 'react';
import { TransitConfig } from '@/lib/types';

export const useTransitConfig = () => {
    const [transitConfig, setTransitConfig] = useState<TransitConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('transitConfig');
        if (stored) {
            setTransitConfig(JSON.parse(stored));
        }
        setIsLoading(false);
    }, []);

    return { transitConfig, isLoading };
};
