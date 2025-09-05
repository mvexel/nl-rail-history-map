import type { FeatureCollection } from 'geojson';
import { convertGeoJSONFromRD } from './coordinateUtils';

/**
 * Utility function to load GeoJSON data from a given path.
 * Converts coordinates from EPSG:28992 (Dutch RD) to WGS84 if needed.
 * @param path - The path to the GeoJSON file (relative to public or absolute URL).
 * @returns Promise resolving to the GeoJSON FeatureCollection.
 */
export async function loadGeoJSON(path: string): Promise<FeatureCollection> {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        const data: FeatureCollection = await response.json();

        // Convert coordinates from Dutch RD to WGS84
        const convertedData = convertGeoJSONFromRD(data);

        return convertedData;
    } catch (error) {
        console.error('Error loading GeoJSON:', error);
        throw error;
    }
}
