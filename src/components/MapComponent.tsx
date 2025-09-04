import { type FC, useState, useMemo, memo } from 'react'
import Map from 'react-map-gl/maplibre'
import { Source, Layer } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { FeatureCollection } from 'geojson'
import { MAP_CONFIG, GEOJSON_LAYER_CONFIGS } from '../constants'
import { useGeoJSON } from '../hooks'
import { useTimeFilter } from '../hooks/useTimeFilter'
import TimeSlider from './TimeSlider'
import { RAILWAY_TIME_CONFIG } from '../config/timeConfigs'

const MapComponent: FC = () => {
    const { data: geojsonData, loading, error } = useGeoJSON('/geo/historische_spoorwegen.json');
    const [mapLoaded, setMapLoaded] = useState(false);

    const {
        currentTime,
        isPlaying,
        minDate,
        maxDate,
        filteredData,
        totalLength,
        togglePlay,
        handleTimeChange,
        config
    } = useTimeFilter(geojsonData?.features || null, RAILWAY_TIME_CONFIG);

    const filteredGeoJSON: FeatureCollection = useMemo(() => ({
        type: 'FeatureCollection',
        features: filteredData || []
    }), [filteredData]);

    if (loading) return <div>Bezig...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="h-full w-full relative">
            <Map
                initialViewState={MAP_CONFIG.initialViewState}
                mapStyle={MAP_CONFIG.mapStyle}
                onLoad={() => setMapLoaded(true)}
            >
                {mapLoaded && (
                    <Source
                        id="geojson-source"
                        type="geojson"
                        data={filteredGeoJSON}
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
                totalLength={totalLength}
                onTimeChange={handleTimeChange}
                onTogglePlay={togglePlay}
                config={config}
            />
        </div>
    )
}

export default memo(MapComponent)
