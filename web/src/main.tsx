import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Index from './pages/index/home.tsx'
import { BrowserRouter, Route, Routes } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Index/>}/>
        <Route path="*" element={<></>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
