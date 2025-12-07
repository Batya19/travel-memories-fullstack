import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Lazy load Leaflet CSS only when needed
if (import.meta.env.PROD) {
  // In production, load only when map components are used
  const loadLeafletCSS = () => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      import('leaflet/dist/leaflet.css');
    }
  };
  // Load after initial render
  setTimeout(loadLeafletCSS, 100);
} else {
  // In dev, load immediately for better DX
  import('leaflet/dist/leaflet.css');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
