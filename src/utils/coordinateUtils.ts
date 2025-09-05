import proj4 from 'proj4';
import type { FeatureCollection, Geometry } from 'geojson';

// Define named projections for cleaner code
proj4.defs([
    // Dutch RD (EPSG:28992) - Rijksdriehoekstelsel
    ["EPSG:28992", "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs"]
    // WGS84 (EPSG:4326) is predefined in proj4, so no need to define it here
]);

// Use named projections instead of long strings
const RD_PROJECTION = 'EPSG:28992';
const WGS84_PROJECTION = 'EPSG:4326';

/**
 * Type for coordinate arrays at any nesting level
 */
type Coordinate = number | CoordinateArray;
type CoordinateArray = Coordinate[];

/**
 * Converts a single point from Dutch RD to WGS84
 * @param rdCoords - [x, y] coordinates in Dutch RD system (EPSG:28992)
 * @returns [longitude, latitude] coordinates in WGS84 (EPSG:4326)
 */
export function convertPointFromRD(rdCoords: [number, number]): [number, number] {
    return proj4(RD_PROJECTION, WGS84_PROJECTION, rdCoords);
}

/**
 * Recursively converts coordinates from EPSG:28992 (Dutch RD) to EPSG:4326 (WGS84)
 * Handles points, line strings, polygons, and multi-geometries
 * @param coords - Coordinate array at any nesting level
 * @returns Converted coordinate array
 */
export function convertCoordinatesFromRD(coords: CoordinateArray): CoordinateArray {
    if (!Array.isArray(coords)) {
        return coords;
    }

    // Check if this is a point [x, y]
    if (coords.length === 2 &&
        typeof coords[0] === 'number' &&
        typeof coords[1] === 'number') {
        return convertPointFromRD(coords as [number, number]);
    }

    // Recursively convert nested coordinate arrays
    return coords.map((coord): Coordinate => {
        if (Array.isArray(coord)) {
            return convertCoordinatesFromRD(coord);
        }
        return coord;
    });
}

/**
 * Converts all geometry coordinates in a GeoJSON FeatureCollection from EPSG:28992 to EPSG:4326
 * @param geoJsonData - GeoJSON FeatureCollection with EPSG:28992 coordinates
 * @returns GeoJSON FeatureCollection with EPSG:4326 coordinates
 */
export function convertGeoJSONFromRD(geoJsonData: FeatureCollection): FeatureCollection {
    const convertedData = { ...geoJsonData };

    convertedData.features = geoJsonData.features.map(feature => {
        const convertedFeature = { ...feature };

        if (convertedFeature.geometry && 'coordinates' in convertedFeature.geometry) {
            const geometry = convertedFeature.geometry as Geometry & { coordinates: CoordinateArray };
            geometry.coordinates = convertCoordinatesFromRD(geometry.coordinates);
        }

        return convertedFeature;
    });

    return convertedData;
}

/**
 * Checks if coordinates appear to be in Dutch RD system
 * Dutch RD coordinates are typically in the range:
 * X: 0-300,000, Y: 300,000-600,000
 * @param coords - Sample coordinates to check
 * @returns true if coordinates appear to be in RD system
 */
export function isLikelyRDCoordinates(coords: [number, number]): boolean {
    const [x, y] = coords;
    return x >= 0 && x <= 300000 && y >= 300000 && y <= 600000;
}
