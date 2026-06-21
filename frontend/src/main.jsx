import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import LandingPage from './pages/LandingPage'
import VariantPage from './pages/VariantPage'
import BrowserPage from './pages/BrowserPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/variant/:variantId" element={<VariantPage />} />
          <Route path="/browse" element={<BrowserPage />} />
        </Routes>
      </App>
    </BrowserRouter>
  </React.StrictMode>
)
