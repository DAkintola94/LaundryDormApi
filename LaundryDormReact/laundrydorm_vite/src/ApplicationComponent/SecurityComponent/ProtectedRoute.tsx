import React from 'react'
import { Navigate } from 'react-router-dom'
import { getValidAccess } from '@/lib/authExpire';

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const validToken = getValidAccess();

    return validToken? <> {children}</> : <Navigate to="/Stage" replace/>
    //tenary condition, if there is a validtoken, return the "child html" that we are in
    //else, use the navigate routing hook and replace the current page we are in, to Stage html
};

export default ProtectedRoute