import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import Loader from './Loader'
import type { RootState } from '../app/store';

interface ProtectedRouteProps {
  children: React.ReactNode
}


function ProtectedRoute({children}: ProtectedRouteProps) {
    const { loading, isAuthenticated } = useSelector((state: RootState) => state.user)
    {console.log('is authenticated', isAuthenticated)}
    if (loading) {
        return <Loader />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }
    
  return <>{children}</>
}

export default ProtectedRoute