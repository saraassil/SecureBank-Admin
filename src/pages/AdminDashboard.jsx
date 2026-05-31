import { Box } from "@mui/material";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AdminStats from "../components/AdminStats";
import AdminCharts from "../components/AdminCharts";
import RiskStats from "../components/RiskStats";
import AdminFooter from "../components/AdminFooter";

function AdminDashboard() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #020617 0%, #030B3D 100%)",
      }}
    >
      <AdminSidebar />

      <Box
        sx={{
          flex: 1,
          p: 4,

          "& .MuiPaper-root": {
            transition: "all 0.3s ease-in-out",
          },

          "& .MuiPaper-root:hover": {
            borderColor: "#8B5CF6",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.15)",
          },
        }}
      >
        <AdminHeader />

        <AdminStats />

        <Box sx={{ mt: 4 }}>
          <AdminCharts />
        </Box>

        <Box sx={{ mt: 4 }}>
          <RiskStats />
        </Box>

        <AdminFooter />
      </Box>
    </Box>
  );
}

export default AdminDashboard;