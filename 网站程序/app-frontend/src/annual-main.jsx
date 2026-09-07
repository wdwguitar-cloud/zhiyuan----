import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AnnualConsultingPage from './pages/AnnualConsultingPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AnnualConsultingPage />
  </StrictMode>,
)
