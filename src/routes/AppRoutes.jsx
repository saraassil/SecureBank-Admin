import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import UsersPage from "../pages/UsersPage";
import ReportsPage from "../pages/ReportsPage";
import AlertsPage from "../pages/AlertsPage";
import AnalysesPage from "../pages/AnalysesPage";
import DocumentsPage from "../pages/DocumentsPage";
import SettingsPage from "../pages/SettingsPage";
import ProfileAdmin from "../pages/ProfileAdmin";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/analyses" element={<AnalysesPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfileAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;