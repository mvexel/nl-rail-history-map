import { MapComponent, ErrorBoundary } from './components'
import { Suspense } from 'react'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="text-lg text-gray-600">Bezig...</div>
        </div>
      }>
        <div className="h-screen w-screen">
          <MapComponent />
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
