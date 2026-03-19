import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './index.css'
import App from './App'
import {About} from "./ApplicationComponent/Pages/About"
import { Settvask } from './ApplicationComponent/LaundryPages/Settvask'
import {Historic} from './ApplicationComponent/LaundryPages/Historic'
import {Status} from './ApplicationComponent/LaundryPages/Status'
import { Report } from './ApplicationComponent/ReportComponent/Report'
import {ViewReport } from './ApplicationComponent/ReportComponent/ViewReport'
import {Register} from './ApplicationComponent/AccountComponent/Register'
import {Login} from './ApplicationComponent/AccountComponent/Login'
import {Profile} from './ApplicationComponent/AccountComponent/Profile'
import { SuccessPage } from './ApplicationComponent/Pages/SuccessPage'
import { Error404 } from './ApplicationComponent/Pages/Error404'
import { UserOverview } from './ApplicationComponent/AdminComponent/UserOverview'
import { MainGate } from './ApplicationComponent/AccountComponent/MainGate'
import ProtectedRoute from './ApplicationComponent/SecurityComponent/ProtectedRoute'



createRoot(document.getElementById('root')!).render( //This is where React injects the whole SPA into the #root div
  <StrictMode>
    <BrowserRouter> {/* in main, this wraps up our whole app, and enable react router everywhere in the components*/}
    <Routes>  {/* This and Route define which component should render for each URL path*/}

      {/* Protected Routes - Require authentication */}
      <Route path="/vask" element={<ProtectedRoute><Settvask /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
      <Route path="/historic" element={<ProtectedRoute><Historic /></ProtectedRoute>} />
      <Route path="/statusnreservation" element={<ProtectedRoute><Status /></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/viewreport" element={<ProtectedRoute><ViewReport /></ProtectedRoute>} />
      <Route path="/useroverview" element={<ProtectedRoute><UserOverview/></ProtectedRoute>} />

      {/* Public Routes - No authentication required */}
      <Route path="/aboutus" element={<About />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/error404" element={<Error404 />} />
      <Route path="/Stage" element={<MainGate/>} />
      <Route path="/" element={<App />} />

    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
