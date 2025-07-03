import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'
import App from './App.tsx'
import {About} from "./ApplicationComponent/Pages/About.tsx"
import { Settvask } from './ApplicationComponent/LaundryPages/Settvask.tsx'
import {Historic} from './ApplicationComponent/LaundryPages/Historic.tsx'
import {Reservation} from './ApplicationComponent/LaundryPages/Reservation.tsx'
import {Status} from './ApplicationComponent/LaundryPages/Status.tsx'
import { Report } from './ApplicationComponent/Pages/Report.tsx'
import {Register} from './ApplicationComponent/AccountComponent/Register.tsx'
import {Login} from './ApplicationComponent/AccountComponent/Login.tsx'
import {Profile} from './ApplicationComponent/AccountComponent/Profile.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* in main, this wraps up our whole app, and enable react router everywhere in the components*/}
    <Routes>  {/* This and Route define which component should render for each URL path*/}

      <Route path="/" element={<App />} />
      <Route path="/aboutus" element={<About />} />
      <Route path="/vask" element={<Settvask />} />
      <Route path="/report" element={<Report />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/historic" element={<Historic />} />
      <Route path="/reservation" element={<Reservation />}  />
      <Route path="/availability" element={<Status />} />
      <Route path="/account" element={<Profile />} />
      
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
