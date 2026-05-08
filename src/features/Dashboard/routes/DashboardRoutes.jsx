import { Route, Routes } from "react-router-dom";
import MainScreen from "../Pages/MainScreen";
import ProtectedRoute from "../../../route/ProtectedRoute";
import MainLayout from "../../../layout/Main/MainLayout";
import Users from "../../Users/pages/Users";
import AssignPermissionsToUser from "../../Users/components/AssignPermissionsToUser";
import { UserForm } from "../../Users/components/UserForm";
import Groups from "../../Users/pages/Groups";
import GroupForm from "../../Users/components/GroupForm";
import Instructors from "../Pages/Instructors";
function DashboardRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={
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
        <Route
          path="groups"
          element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          }
        />
        <Route
          path="add-group"
          element={
            <ProtectedRoute>
              <GroupForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-group-permissions/:name"
          element={
            <ProtectedRoute>
              <GroupForm />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default DashboardRoutes;
