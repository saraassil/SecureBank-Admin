import { Box } from "@mui/material";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import SettingsPanel from "../components/SettingsPanel";
import AdminFooter from "../components/AdminFooter";

function SettingsPage() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617 0%, #030B3D 100%)",
      }}
    >
      <AdminSidebar />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 4,
        }}
      >
        <AdminHeader />

        <Box sx={{ flex: 1 }}>
          <SettingsPanel />
        </Box>

        <AdminFooter />
      </Box>
    </Box>
  );
}

export default SettingsPage;