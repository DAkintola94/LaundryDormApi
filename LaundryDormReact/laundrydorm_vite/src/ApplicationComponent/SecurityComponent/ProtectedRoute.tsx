import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const token = localStorage.getItem("access_token");
  return token? <>{children}</> : <Navigate to="/Stage" replace/>
}

export default ProtectedRoute