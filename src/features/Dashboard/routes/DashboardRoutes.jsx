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
import EditPermissionForm from "../../Users/components/EditPermissionForm";
import Permissions from "../../Users/pages/Permissions";
import Pages from "../../CMS/pages/Pages";
import Activity from "../Pages/Activity";
import Profile from "../Pages/Profile";
import Messages from "../Pages/ChatPage";
import Schedule from "../Pages/Schedule";
import PageForm from "../../CMS/components/PageForm";
import Blogs from "../../CMS/pages/Blogs";
import BlogForm from "../../CMS/components/BlogForm";
import CoursesPage from "../../Courses/Pages/CoursePage";
import CourseDetail1 from "../../Courses/Pages/Coursedetail1";
import BlogCategories from "../../CMS/components/BlogCategories";
import CourseDetail2 from "../../Courses/Pages/Coursedetail2";

import BlogTags from "../../CMS/components/BlogTags";
import InstructorDashboard from "../../Instructor/Pages/Instructordashboard";


import Comments from "../../CMS/pages/Comments";
import CommentForm from "../../CMS/components/CommentForm";
import Subscribers from "../../CMS/pages/Subscribers";
import InstructorCourses from "../../Instructor/Pages/InstructorCourses";
import InstructorSchedule from "../../Instructor/Pages/InstructorSchedule";
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
          path="/activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-details-1"
          element={
            <ProtectedRoute>
              <CourseDetail1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-details-2"
          element={
            <ProtectedRoute>
              <CourseDetail2 />
            </ProtectedRoute>
          }
        />
          <Route
          path="/instructor-dashboard"
          element={
            <ProtectedRoute>
  <InstructorDashboard />
            </ProtectedRoute>
          }
        />
             <Route
          path="/instructor-courses"
          element={
            <ProtectedRoute>
  <InstructorCourses/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/instructor-schedule"
          element={
            <ProtectedRoute>
  <InstructorSchedule/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/message"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
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
        <Route
          path="permissions"
          element={
            <ProtectedRoute>
              <Permissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-permissions/:id"
          element={
            <ProtectedRoute>
              <EditPermissionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="pages"
          element={
            <ProtectedRoute>
              <Pages />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-page/:id"
          element={
            <ProtectedRoute>
              <PageForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="add-page"
          element={
            <ProtectedRoute>
              <PageForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="blogs"
          element={
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-blog/:id"
          element={
            <ProtectedRoute>
              <BlogForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="add-blog"
          element={
            <ProtectedRoute>
              <BlogForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="blogs/categories"
          element={
            <ProtectedRoute>
              <BlogCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="blogs/tags"
          element={
            <ProtectedRoute>
              <BlogTags />
            </ProtectedRoute>
          }
        />
        <Route
          path="comments"
          element={
            <ProtectedRoute>
              <Comments />
            </ProtectedRoute>
          }
        />
        <Route
          path="edit-comment/:id"
          element={
            <ProtectedRoute>
              <CommentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="subscribers"
          element={
            <ProtectedRoute>
              <Subscribers />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default DashboardRoutes;
