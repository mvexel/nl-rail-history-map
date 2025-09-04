import { type FC } from 'react'
import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAP_CONFIG } from '../constants'

interface MapComponentProps {
    className?: string
}

const MapComponent: FC<MapComponentProps> = ({ className = "h-full w-full" }) => {
    return (
        <div className={className}>
            <Map
                initialViewState={MAP_CONFIG.initialViewState}
                mapStyle={MAP_CONFIG.mapStyle}
            />
        </div>
    )
}

export default MapComponent
