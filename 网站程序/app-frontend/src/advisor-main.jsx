import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdvisorPage from './pages/AdvisorPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdvisorPage />
  </StrictMode>,
)
