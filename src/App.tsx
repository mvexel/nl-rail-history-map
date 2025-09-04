import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './App.css'

function App() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (map.current) return

    if (mapContainer.current) {
      // Fetch the style and remove the sprite to avoid 404
      fetch('https://tiles.openfreemap.org/styles/liberty')
        .then(response => response.json())
        .then(style => {
          // Remove the sprite to prevent failed requests
          delete style.sprite
          map.current = new maplibregl.Map({
            container: mapContainer.current!,
            style: style,
            center: [5.2913, 52.1326],
            zoom: 7
          })
          map.current.on('load', () => {
            console.log('Map loaded')
            map.current?.resize()
          })
          map.current.on('error', (e) => {
            console.error('Map error:', e)
          })
        })
        .catch(error => console.error('Failed to load style:', error))
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
