import { Box } from "@mui/material";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AlertsTable from "../components/AlertsTable";
import AdminFooter from "../components/AdminFooter";

function AlertsPage() {
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
          p: 4,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AdminHeader />

        <Box
          sx={{
            flex: 1,

            "& .MuiPaper-root": {
              transition: "all .3s ease",
            },

            "& .MuiPaper-root:hover": {
              borderColor: "#8B5CF6",
              boxShadow:
                "0 0 20px rgba(139,92,246,.15)",
            },
          }}
        >
          <AlertsTable />
        </Box>

        <AdminFooter />
      </Box>
    </Box>
  );
}

export default AlertsPage;