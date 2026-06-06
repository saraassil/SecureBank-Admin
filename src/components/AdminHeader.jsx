import { useState, useEffect } from "react";
import { Box, Typography, Avatar, Badge, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const API = "http://localhost:5000";

function AdminHeader() {
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);
  const [admin] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });

  useEffect(() => {
    fetch(`${API}/admin/alerts`)
      .then((r) => r.json())
      .then((data) => setAlertCount(data.length))
      .catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const adminName = admin?.email?.split("@")[0] || "Admin";
  const initial = (adminName[0] || "A").toUpperCase();

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
      <Box>
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "38px", mb: 0.5, lineHeight: 1.2 }}>
          Bonjour, {adminName} 👋
        </Typography>
        <Typography sx={{ color: "#94A3B8", fontSize: "15px" }}>
          Vue d'ensemble du système SecureBank AI
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ background: "#07122B", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", px: 2, py: 1, color: "#fff", fontSize: "14px", fontWeight: 500 }}>
          📅 {today}
        </Box>

        <IconButton onClick={() => navigate("/admin/alerts")}>
          <Badge badgeContent={alertCount} color="secondary">
            <NotificationsNoneOutlinedIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Badge>
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ bgcolor: "#8B5CF6", width: 48, height: 48, fontSize: 20 }}>{initial}</Avatar>
          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "15px" }}>{adminName}</Typography>
            <Typography sx={{ color: "#94A3B8", fontSize: "13px" }}>Administrateur</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminHeader;
