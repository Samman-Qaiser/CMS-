import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import Login from './auth/Login'
import SignUp from './auth/SignUp'
import ForgotPassword from './auth/ForgotPassword'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App