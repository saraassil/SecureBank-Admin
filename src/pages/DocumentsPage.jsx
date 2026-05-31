import { Box } from "@mui/material";

import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import DocumentsTable from "../components/DocumentsTable";
import AdminFooter from "../components/AdminFooter";

function DocumentsPage() {
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
        }}
      >
        <AdminHeader />
        <DocumentsTable />
        <AdminFooter />
      </Box>
    </Box>
  );
}

export default DocumentsPage;