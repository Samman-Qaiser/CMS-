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
import ProfilePage from "../../Apps/Pages/ProfilePage";
import BlogTags from "../../CMS/components/BlogTags";
import LessonPlayer from "../../Courses/Pages/LessonPlayer";
import Comments from "../../CMS/pages/Comments";

import Contact from "../../CMS/pages/Contact";
import InstructorDashboard from "../../Instructor/Pages/Instructordashboard";
import MenuSetup from "../../CMS/pages/MenuSetup";

import CommentForm from "../../CMS/components/CommentForm";
import Subscribers from "../../CMS/pages/Subscribers";
import InstructorCourses from "../../Instructor/Pages/InstructorCourses";
import InstructorSchedule from "../../Instructor/Pages/InstructorSchedule";
import StudentsPage from "../../Instructor/Pages/StudentsPage";
import InstructorTransactions from "../../Instructor/Pages/InstructorTransactions";
import InstructorResources from "../../Instructor/Pages/InstructorResources";
import InstructorLiveClass from "../../Instructor/Pages/InstructorLiveClass";
import Configurations from "../../Config/pages/Configurations";
import ConfigForm from "../../Config/components/ConfigForm";
import Site from "../../Config/pages/Site";
import Reading from "../../Config/pages/Reading";
import Social from "../../Config/pages/Social";
import Theme from "../../Config/pages/Theme";
import Widget from "../../Config/pages/Widget";
import Postdetails from "../../Apps/Pages/Postdetails";
import AppCalender from "../../Apps/Pages/Calender";
import ConfigLayout from "../../Config/layout/ConfigLayout";
import CustomersPage from "../../Apps/Pages/CustomersPage";
import InvoicePage from "../Pages/InvoicePage";
import CheckoutPage from "../../Apps/Pages/CheckoutPage";
import CheckoutPageBuy from "../../../checkout/CheckoutPage";
import ProductDetailPage from "../../Apps/Pages/ProductDetailPage";
import OrdersPage from "../../Apps/Pages/OrderPage";
import EmailRead from "../../Apps/Pages/EmailRead";
import EmailInbox from "../../Apps/Pages/EmailInbox";
import EmailCompose from "../../Apps/Pages/EmailCompose";
import ProductGrid from "../../Apps/Pages/ProductGridPage";
import ProductListPage from "../../Apps/Pages/ProductListPage";
import BecomeInstructor from "../../../components/SidePannel/BecomeInstructor";
import { useSelector } from "react-redux";
import DropProfile from "../../../components/SidePannel/Profile";
import InstructorApplications from "../../../components/SidePannel/InstructorApplications";
import ContactAdminForm from "../../CMS/pages/ContactAdminForm";
import CourseCategoriesPage from "../../Courses/Pages/CourseCategoriesPage";
import AdminReviews from "../../../components/SidePannel/AdminReviews";
import CourseForm from "../../Courses/Components/CourseForm";
import Chapters from "../../Courses/Pages/Chapters";
import Lessons from "../../Courses/Pages/Lessons";
import BlogDetail from "../../Instructor/Pages/Blogdetail";
import StudentLiveClass from "../../Instructor/Pages/StudentLiveClass";
import LiveClassesList from "../../Instructor/Pages/LiveClassesList";
import CreateLiveClass from "../../Instructor/Pages/CreateLiveClass";
import CreateProduct from "../../Apps/Pages/CreateProduct";

function DashboardRoutes() {

   const user = useSelector((state) => state.auth.user);
   console.log('dashboard user',user)
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
          path="/profile-page"
          element={
            <ProtectedRoute>
              <DropProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/become-instructor"
          element={
            <ProtectedRoute>
              <BecomeInstructor userId={user?.id} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/instructor-applications"
          element={
            <ProtectedRoute>
              <InstructorApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <AdminReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:lessonId"
          element={
            <ProtectedRoute>
              <LessonPlayer />
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
          path="/chapters"
          element={
            <ProtectedRoute>
              <Chapters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons"
          element={
            <ProtectedRoute>
              <Lessons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-categories"
          element={
            <ProtectedRoute>
              <CourseCategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-details-1/:id"
          element={
            // <ProtectedRoute>
            <CourseDetail1 />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <ProtectedRoute>
              <CourseForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-details-2/:id"
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
              <InstructorCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor-schedule"
          element={
            <ProtectedRoute>
              <InstructorSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor-students"
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor-transactions"
          element={
            <ProtectedRoute>
              <InstructorTransactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor-resources"
          element={
            <ProtectedRoute>
              <InstructorResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <BlogDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor-liveclass"
          element={
            <ProtectedRoute>
              <InstructorLiveClass />
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

        <Route
          path="contact-us"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="menus/setup"
          element={
            <ProtectedRoute>
              <MenuSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="app-profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="post-details"
          element={
            <ProtectedRoute>
              <Postdetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="app-calender"
          element={
            <ProtectedRoute>
              <AppCalender />
            </ProtectedRoute>
          }
        />
        <Route
          path="ecom-customers"
          element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ecom-invoice"
          element={
            <ProtectedRoute>
              <InvoicePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ecom-checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ecom-product-detail/:id"
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ecom-product-order"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ecom-product-grid"
          element={
            <ProtectedRoute>
              <ProductGrid />
            </ProtectedRoute>
          }
        />
        <Route
          path="ecom-product-create"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="ecom-product-list"
          element={
            <ProtectedRoute>
              <ProductListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="email-compose"
          element={
            <ProtectedRoute>
              <EmailCompose />
            </ProtectedRoute>
          }
        />
        <Route
          path="email-inbox"
          element={
            <ProtectedRoute>
              <EmailInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="email-read/:id"
          element={
            <ProtectedRoute>
              <EmailRead />
            </ProtectedRoute>
          }
        />
        <Route
          path="configurations"
          element={
            <ProtectedRoute>
              <ConfigLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Configurations />} />
          <Route path="add-config" element={<ConfigForm />} />
          <Route path="edit-config/:id?" element={<ConfigForm />} />
          <Route path="prefix/Site" element={<Site />} />
          <Route path="prefix/Reading" element={<Reading />} />
          <Route path="prefix/Social" element={<Social />} />
          <Route path="prefix/Widget" element={<Widget />} />
          <Route path="prefix/Theme" element={<Theme />} />
        </Route>
        <Route
          path="contact-admin-form"
          element={
            <ProtectedRoute>
              <ContactAdminForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/:id"
          element={
            <ProtectedRoute>
              <CheckoutPageBuy />
            </ProtectedRoute>
          }
        />
        <Route path="/live-classes" element={<LiveClassesList />} />

        <Route path="/create-live-class" element={<CreateLiveClass />} />

        <Route
          path="/instructor-live-class/:id"
          element={<InstructorLiveClass />}
        />

        <Route path="/student-live-class/:id" element={<StudentLiveClass />} />
      </Route>
    </Routes>
  );
}

export default DashboardRoutes;
