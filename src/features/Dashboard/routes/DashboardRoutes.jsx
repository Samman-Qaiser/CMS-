import { Route, Routes } from "react-router-dom";
import MainScreen from "../Pages/MainScreen";
import ProtectedRoute from "../../../route/ProtectedRoute";
import MainLayout from "../../../layout/Main/MainLayout";
import Users from "../Pages/Users"; 
import AssignPermissionsToUser from "../components/AssignPermissionsToUser";
import { UserForm } from "../components/UserForm";
import Instructors from "../Pages/Instructors";
function DashboardRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={
            // ← /dashboard pe match karega
            <ProtectedRoute>
              <MainScreen />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/instructors"
          element={
            <ProtectedRoute>
              <Instructors />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/assign-permissions-to-user/:id"
          element={
            <ProtectedRoute>
              <AssignPermissionsToUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-user/:id"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="add-user"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
export default DashboardRoutes;
