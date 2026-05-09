import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function useCrowdData() {
    const [crowdData, setCrowdData] = useState<Map<string, 'l' | 'm' | 'h'>>(new Map());
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchCrowdData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const { data, error } = await supabase
                .from('mrt_crowd')
                .select('station_code, crowd_level, updated_at');

            if (error) throw error;

            const map = new Map<string, 'l' | 'm' | 'h'>();
            data.forEach(row => {
                map.set(row.station_code, row.crowd_level as 'l' | 'm' | 'h');
            });

            setCrowdData(map);
            if (data.length > 0) {
                // Use the most recent updated_at from any row
                const latest = data.reduce((a, b) =>
                    new Date(a.updated_at) > new Date(b.updated_at) ? a : b
                );
                setLastUpdated(new Date(latest.updated_at));
            }
        } catch (err) {
            console.error('Failed to fetch crowd data from Supabase:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCrowdData();
        const interval = setInterval(() => fetchCrowdData(true), 60000);
        return () => clearInterval(interval);
    }, []);

    return { crowdData, loading, refreshing, lastUpdated, refresh: () => fetchCrowdData(true) };
}