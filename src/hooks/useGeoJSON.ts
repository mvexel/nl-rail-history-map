import { use, useMemo } from 'react';
import type { FeatureCollection } from 'geojson';
import { loadGeoJSON } from '../utils';

const promiseCache = new Map<string, Promise<FeatureCollection>>();

export function useGeoJSON(path: string) {
    const promise = useMemo(() => {
        if (!promiseCache.has(path)) {
            const basePromise = loadGeoJSON(path);
            const errorHandledPromise = basePromise.catch(error => {
                throw error;
            });
            promiseCache.set(path, errorHandledPromise);
        }
        return promiseCache.get(path)!;
    }, [path]);

    const data = use(promise);
    return { data, loading: false, error: null };
}
