import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'
import App from './App'
import {About} from "./ApplicationComponent/Pages/About"
import { Settvask } from './ApplicationComponent/LaundryPages/Settvask'
import {Historic} from './ApplicationComponent/LaundryPages/Historic'
import {Reservation} from './ApplicationComponent/LaundryPages/Reservation'
import {Status} from './ApplicationComponent/LaundryPages/Status'
import { Report } from './ApplicationComponent/ReportComponent/Report'
import {ViewReport } from './ApplicationComponent/ReportComponent/ViewReport'
import {Register} from './ApplicationComponent/AccountComponent/Register'
import {Login} from './ApplicationComponent/AccountComponent/Login'
import {Profile} from './ApplicationComponent/AccountComponent/Profile'
import { SuccessPage } from './ApplicationComponent/Pages/SuccessPage'


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
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/viewreport" element={<ViewReport />}/>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
