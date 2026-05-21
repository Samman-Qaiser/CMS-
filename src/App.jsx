import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./context/ThemeProvider";

import Login from './auth/Login'
import SignUp from './auth/SignUp'
import ForgotPassword from './auth/ForgotPassword'
import DashboardRoutes from './features/Dashboard/routes/DashboardRoutes'
import ResetPassword from "./auth/ResetPassword";
import PublicRoute from "./route/PublicRoute";


const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          {/* Protected Dashboard */}
          <Route
            path="/dashboard/*"
            element={
           
                <DashboardRoutes />
        
            }
          />

          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          <Route path="/reset-password/:token" element={<ResetPassword />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App
