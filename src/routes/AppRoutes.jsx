import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import Login from "../pages/Auth/Login";
import Loginadmin from "../pages/Auth/Loginadmin";
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import Signup from "../pages/Auth/signup";
import Dashboard from "../pages/Dashboard/Dashboard";
import Documents from "../components/documents/Documents";
import Analyses from "../pages/Analysis/analyses";
import Historique from "../components/reports/historique";
import Notifications from "../components/Notifications/notifications";
import Profile from "../components/Profile/profile";
import Parametres from "../components/Parametres/parametres";

import AdminDashboard from "../pages/AdminDashboard";
import UsersPage from "../pages/UsersPage";
import ReportsPage from "../pages/ReportsPage";
import AlertsPage from "../pages/AlertsPage";
import AnalysesPage from "../pages/AnalysesPage";
import DocumentsPage from "../pages/DocumentsPage";
import SettingsPage from "../pages/SettingsPage";
import ProfileAdmin from "../pages/ProfileAdmin";
import IDVerify from "../pages/IDVerify/IDVerify";

import { NotificationProvider } from "../context/NotificationContext";

function AppRoutes() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loginadmin" element={<Loginadmin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/analyses" element={<Analyses />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/parametres" element={<Parametres />} />
        <Route path="/id-verify" element={<IDVerify />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/alerts" element={<AlertsPage />} />
          <Route path="/admin/analyses" element={<AnalysesPage />} />
          <Route path="/admin/documents" element={<DocumentsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/profile" element={<ProfileAdmin />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default AppRoutes;
