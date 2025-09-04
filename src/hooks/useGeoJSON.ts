import { useState, useEffect, useRef } from 'react';
import type { FeatureCollection } from 'geojson';
import { loadGeoJSON } from '../utils';

export function useGeoJSON(path: string) {
    const [data, setData] = useState<FeatureCollection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await loadGeoJSON(path);
                setData(result);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        if (path) {
            fetchData();
        }
    }, [path]);

    return { data, loading, error };
}
