export const MAP_CONFIG = {
    initialViewState: {
        longitude: 5.2913,
        latitude: 52.1326,
        zoom: 7
    },
    mapStyle: 'https://tiles.openfreemap.org/styles/positron'
} as const;

export const GEOJSON_LAYER_CONFIGS = {
    line: {
        id: 'geojson-line-layer',
        type: 'line' as const,
        paint: {
            'line-color': '#dc2626',
            'line-width': 3,
            'line-opacity': 0.8
        }
    },
    fill: {
        id: 'geojson-fill-layer',
        type: 'fill' as const,
        paint: {
            'fill-color': '#ff0000',
            'fill-opacity': 0.5
        }
    },
    circle: {
        id: 'geojson-circle-layer',
        type: 'circle' as const,
        paint: {
            'circle-color': '#ff0000',
            'circle-radius': 5
        }
    }
} as const;
