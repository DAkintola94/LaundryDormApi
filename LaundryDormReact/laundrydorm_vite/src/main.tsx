import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'
import App from './App.tsx'
import {About} from "./ApplicationComponent/Pages/About.tsx"
import { Settvask } from './ApplicationComponent/Pages/Settvask.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* in main, this wraps up our whole app, and enable react router everywhere in the components*/}
    <Routes>  {/* This and Route define which component should render for each URL path*/}

      <Route path="/" element={<App />} />
      <Route path="/aboutus" element={<About />} />
      <Route path="/laundry" element={<Settvask />} />
      
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
