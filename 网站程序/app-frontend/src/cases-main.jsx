import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CasesGalleryPage from './pages/CasesGalleryPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CasesGalleryPage />
  </StrictMode>,
)
