import { Box } from "@mui/material";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AnalysesTable from "../components/AnalysesTable";
import AdminFooter from "../components/AdminFooter";

function AnalysesPage() {
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
          transition: "all .3s ease",
        }}
      >
        <AdminHeader />

        <Box
          sx={{
            flex: 1,

            "& .MuiPaper-root:hover": {
              borderColor: "#8B5CF6",
              boxShadow:
                "0 0 20px rgba(139,92,246,.15)",
            },
          }}
        >
          <AnalysesTable />
        </Box>

        <AdminFooter />
      </Box>
    </Box>
  );
}

export default AnalysesPage;