import { type FC, useState, useMemo } from 'react'
import Map from 'react-map-gl/maplibre'
import { Source, Layer } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAP_CONFIG, GEOJSON_LAYER_CONFIGS } from '../constants'
import { useGeoJSON } from '../hooks'
import { useTimeFilter } from '../hooks/useTimeFilter'
import TimeSlider from './TimeSlider'
import { RAILWAY_TIME_CONFIG } from '../config/timeConfigs'

interface MapComponentProps {
    className?: string
}

const MapComponent: FC<MapComponentProps> = ({ className = "h-full w-full" }) => {
    const { data: geojsonData, loading, error } = useGeoJSON('/geo/historische_spoorwegen.json');
    const [mapLoaded, setMapLoaded] = useState(false);

    const {
        currentTime,
        isPlaying,
        minDate,
        maxDate,
        filteredData,
        togglePlay,
        handleTimeChange,
        config
    } = useTimeFilter((geojsonData as any)?.features, RAILWAY_TIME_CONFIG);

    const filteredGeoJSON = useMemo(() => ({
        type: 'FeatureCollection',
        features: filteredData || []
    }), [filteredData]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className={`${className} relative`}>
            <Map
                initialViewState={MAP_CONFIG.initialViewState}
                mapStyle={MAP_CONFIG.mapStyle}
                onLoad={() => setMapLoaded(true)}
            >
                {mapLoaded && (
                    <Source
                        id="geojson-source"
                        type="geojson"
                        data={filteredGeoJSON as any}
                    >
                        <Layer {...GEOJSON_LAYER_CONFIGS.line} />
                    </Source>
                )}
            </Map>

            <TimeSlider
                currentTime={currentTime}
                isPlaying={isPlaying}
                minDate={minDate}
                maxDate={maxDate}
                itemCount={filteredData.length}
                onTimeChange={handleTimeChange}
                onTogglePlay={togglePlay}
                config={config}
            />
        </div>
    )
}

export default MapComponent
