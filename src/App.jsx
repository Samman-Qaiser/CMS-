import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./context/ThemeProvider";

import Login from './auth/Login'
import SignUp from './auth/SignUp'
import ForgotPassword from './auth/ForgotPassword'
import DashboardRoutes from './features/Dashboard/routes/DashboardRoutes'

const App = () => {
return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
        </Routes>
        {/* ← DashboardRoutes duplicate hata diya */}
      </BrowserRouter>
    </ThemeProvider>
  )
};

export default App
