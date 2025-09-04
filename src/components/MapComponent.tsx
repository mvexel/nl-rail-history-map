import { type FC, useState } from 'react'
import Map from 'react-map-gl/maplibre'
import { Source, Layer } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAP_CONFIG, GEOJSON_LAYER_CONFIGS } from '../constants'
import { useGeoJSON } from '../hooks'

interface MapComponentProps {
    className?: string
}

const MapComponent: FC<MapComponentProps> = ({ className = "h-full w-full" }) => {
    const { data: geojsonData, loading, error } = useGeoJSON('/geo/historische_spoorwegen.json');
    const [mapLoaded, setMapLoaded] = useState(false);

    if (loading) return <div>Loading map...</div>;
    if (error) return <div>Error loading GeoJSON: {error.message}</div>;

    return (
        <div className={className}>
            <Map
                initialViewState={MAP_CONFIG.initialViewState}
                mapStyle={MAP_CONFIG.mapStyle}
                onLoad={() => setMapLoaded(true)}
            >
                {mapLoaded && geojsonData && (
                    <Source id="geojson-source" type="geojson" data={geojsonData}>
                        <Layer {...GEOJSON_LAYER_CONFIGS.line} />
                    </Source>
                )}
            </Map>
        </div>
    )
}

export default MapComponent
