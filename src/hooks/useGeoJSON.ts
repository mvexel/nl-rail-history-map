import { use, useMemo } from 'react';
import type { FeatureCollection } from 'geojson';
import { loadGeoJSON } from '../utils';

const promiseCache = new Map<string, Promise<{ data: FeatureCollection | null; error: Error | null }>>();

export function useGeoJSON(path: string) {
    const promise = useMemo(() => {
        if (!promiseCache.has(path)) {
            const resultPromise = loadGeoJSON(path)
                .then(data => ({ data, error: null }))
                .catch(error => ({ data: null, error: error as Error }));
            promiseCache.set(path, resultPromise);
        }
        return promiseCache.get(path)!;
    }, [path]);

    const result = use(promise);
    return { data: result.data, loading: false, error: result.error };
}
