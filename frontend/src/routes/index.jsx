import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute/ProtectedRoute";
import OpportunityDetails from "../pages/StudentGraduate/OpportunityDetails/OpportunityDetails";

import PublicLayout from "../layouts/PublicLayout/PublicLayout";
import StudentGraduateLayout from "../layouts/StudentGraduateLayout/StudentGraduateLayout";
import EmployerLayout from "../layouts/EmployerLayout/EmployerLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import NotFound from "../pages/NotFound/NotFound";

import Home from "../pages/Public/Home/Home";
import Login from "../pages/Public/Login/Login";
import Register from "../pages/Public/Register/Register";
import About from "../pages/Public/About/About";
import Contact from "../pages/Public/Contact/Contact";
import PublicMentorship from "../pages/StudentGraduate/Mentorship/Mentorship";

import Dashboard from "../pages/StudentGraduate/Dashboard/Dashboard";
import BrowseOpportunities from "../pages/StudentGraduate/BrowseOpportunities/BrowseOpportunities";
import Applications from "../pages/StudentGraduate/Applications/Applications";
import SavedOpportunities from "../pages/StudentGraduate/SavedOpportunities/SavedOpportunities";
import Mentorship from "../pages/StudentGraduate/Mentorship/Mentorship";
import Profile from "../pages/StudentGraduate/Profile/Profile";
import Settings from "../pages/StudentGraduate/Settings/Settings";

import EmployerDashboard from "../pages/Employer/Dashboard/Dashboard";
import PostOpportunity from "../pages/Employer/PostOpportunity/PostOpportunity";
import ManageOpportunities from "../pages/Employer/ManageOpportunities/ManageOpportunities";
import Applicants from "../pages/Employer/Applicants/Applicants";
import EmployerProfile from "../pages/Employer/Profile/Profile";
import EmployerSettings from "../pages/Employer/Settings/Settings";

import AdminDashboard from "../pages/Admin/Dashboard/Dashboard";
import EmployerVerification from "../pages/Admin/EmployerVerification/EmployerVerification";
import UserManagement from "../pages/Admin/UserManagement/UserManagement";
import AdminMentorship from "../pages/Admin/Mentorship/Mentorship";
import ReportedItems from "../pages/Admin/ReportedItems/ReportedItems";
import AdminProfile from "../pages/Admin/Profile/Profile";
import AdminSettings from "../pages/Admin/Settings/Settings";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentorship" element={<PublicMentorship />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentGraduateLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="opportunities" element={<BrowseOpportunities />} />
            <Route path="opportunities/:id" element={<OpportunityDetails />} />
            <Route path="applications" element={<Applications />} />
            <Route path="saved" element={<SavedOpportunities />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
          <Route path="/employer" element={<EmployerLayout />}>
            <Route path="dashboard" element={<EmployerDashboard />} />
            <Route path="post-opportunity" element={<PostOpportunity />} />
            <Route path="manage-opportunities" element={<ManageOpportunities />} />
            <Route path="applicants" element={<Applicants />} />
            <Route path="profile" element={<EmployerProfile />} />
            <Route path="settings" element={<EmployerSettings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employer-verification" element={<EmployerVerification />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="mentorship" element={<AdminMentorship />} />
            <Route path="reported-items" element={<ReportedItems />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;