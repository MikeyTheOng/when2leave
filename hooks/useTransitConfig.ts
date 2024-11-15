import { useState } from 'react';
import { TransitConfig } from '@/lib/types';

export const useTransitConfig = () => {
    const [transitConfig] = useState<TransitConfig | null>(() => {
        const stored = localStorage.getItem('transitConfig');
        return stored ? JSON.parse(stored) : null;
    });

    return transitConfig;
};
