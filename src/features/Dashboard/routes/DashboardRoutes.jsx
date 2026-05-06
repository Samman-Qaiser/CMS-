import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainScreen from '../Pages/MainScreen'
import ProtectedRoute from '../../../route/ProtectedRoute'
function DashboardRoutes() {
  return (
  <Routes>
    <Route path='/dashboard' element={
        <ProtectedRoute>
        <MainScreen />
    </ProtectedRoute>
         } />
  </Routes>
  )
}

export default DashboardRoutes