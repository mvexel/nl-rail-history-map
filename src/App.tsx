import { useState, useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './App.css'

function App() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (map.current) return

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [5.2913, 52.1326],
        zoom: 7
      })
    }

    return () => {
      map.current?.remove()
    }
  }, [])

  return (
    <div className="w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />
    </div>)
}

export default App
