import proj4 from 'proj4';

/**
 * Utility function to load GeoJSON data from a given path.
 * Converts coordinates from EPSG:28992 (Dutch RD) to WGS84 if needed.
 * @param path - The path to the GeoJSON file (relative to public or absolute URL).
 * @returns Promise resolving to the GeoJSON object.
 */
export async function loadGeoJSON(path: string): Promise<unknown> {
    try {
        console.log('Loading GeoJSON from:', path);
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Loaded GeoJSON data:', data);

        // Define projections
        const rdProjection = '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs';
        const wgs84Projection = 'EPSG:4326';

        // Function to convert coordinates recursively
        function convertCoordinates(coords: unknown): unknown {
            if (Array.isArray(coords)) {
                if (coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
                    // It's a point [x, y]
                    const [lon, lat] = proj4(rdProjection, wgs84Projection, coords);
                    return [lon, lat];
                } else {
                    // It's an array of points or deeper
                    return coords.map(convertCoordinates);
                }
            }
            return coords;
        }

        // Convert coordinates in features
        if (data && typeof data === 'object' && 'features' in data && Array.isArray((data as any).features)) {
            (data as any).features.forEach((feature: any) => {
                if (feature && feature.geometry && feature.geometry.coordinates) {
                    feature.geometry.coordinates = convertCoordinates(feature.geometry.coordinates);
                }
            });
        }

        console.log('Converted GeoJSON data:', data);
        return data;
    } catch (error) {
        console.error('Error loading GeoJSON:', error);
        throw error;
    }
}
