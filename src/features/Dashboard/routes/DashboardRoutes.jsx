import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainScreen from '../Pages/MainScreen'
import ProtectedRoute from '../../../route/ProtectedRoute'
import MainLayout from '../../../layout/Main/MainLayout'
function DashboardRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={       // ← /dashboard pe match karega
          <ProtectedRoute>
            <MainScreen />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}
export default DashboardRoutes