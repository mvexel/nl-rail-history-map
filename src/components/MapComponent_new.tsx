import { type FC, useState, useMemo } from 'react'
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
    const [currentTime, setCurrentTime] = useState(new Date('1860-01-01'));

    // Calculate min and max dates from the data
    const { minDate, maxDate } = useMemo(() => {
        if (!geojsonData || !(geojsonData as any).features) return { minDate: new Date('1900-01-01'), maxDate: new Date() };

        let min = new Date();
        let max = new Date('1900-01-01');

        (geojsonData as any).features.forEach((feature: any) => {
            const openingStr = feature.properties?.opening;
            const stakingStr = feature.properties?.staking_personen_vervoer;

            if (!openingStr) return;

            const opening = new Date(openingStr);
            if (isNaN(opening.getTime())) return;

            const staking = stakingStr === '9999-12-31T01:00:00+01:00'
                ? new Date()
                : stakingStr ? new Date(stakingStr) : new Date();

            if (isNaN(staking.getTime())) return;

            if (opening < min) min = opening;
            if (staking > max) max = staking;
        });

        return { minDate: min, maxDate: max };
    }, [geojsonData]);

    // Filter features based on current time
    const filteredGeoJSON = useMemo(() => {
        if (!geojsonData) return null;

        const filteredFeatures = (geojsonData as any).features.filter((feature: any) => {
            const openingStr = feature.properties?.opening;
            const stakingStr = feature.properties?.staking_personen_vervoer;

            if (!openingStr) return false;

            const opening = new Date(openingStr);
            if (isNaN(opening.getTime())) return false;

            const staking = stakingStr === '9999-12-31T01:00:00+01:00'
                ? new Date('2100-01-01')
                : stakingStr ? new Date(stakingStr) : new Date('2100-01-01');

            if (isNaN(staking.getTime())) return false;

            return currentTime >= opening && currentTime <= staking;
        });

        return {
            ...(geojsonData as any),
            features: filteredFeatures
        };
    }, [geojsonData, currentTime]);

    if (loading) return <div>Loading map...</div>;
    if (error) return <div>Error loading GeoJSON: {error.message}</div>;

    return (
        <div className={`${className} relative`}>
            <Map
                initialViewState={MAP_CONFIG.initialViewState}
                mapStyle={MAP_CONFIG.mapStyle}
                onLoad={() => setMapLoaded(true)}
            >
                {mapLoaded && filteredGeoJSON && (
                    <Source id="geojson-source" type="geojson" data={filteredGeoJSON}>
                        <Layer {...GEOJSON_LAYER_CONFIGS.line} />
                    </Source>
                )}
            </Map>

            {/* Time Slider Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 p-4 rounded-lg shadow-lg border border-gray-200">
                <div className="flex items-center space-x-4 mb-2">
                    <span className="text-sm font-medium text-gray-700">Railway Timeline</span>
                    <span className="text-xs text-gray-500">
                        {minDate.getFullYear()} - {maxDate.getFullYear() === new Date().getFullYear() ? 'Present' : maxDate.getFullYear()}
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700 min-w-[60px]">Year:</span>
                    <input
                        type="range"
                        min={minDate.getTime()}
                        max={maxDate.getTime()}
                        value={currentTime.getTime()}
                        onChange={(e) => setCurrentTime(new Date(parseInt(e.target.value)))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <span className="text-sm font-semibold text-blue-600 min-w-[80px]">
                        {currentTime.getFullYear()}
                    </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                    Showing {filteredGeoJSON?.features.length || 0} rail lines active on {currentTime.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>
        </div>
    )
}

export default MapComponent
