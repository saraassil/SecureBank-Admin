import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Avatar, Button, TextField, Divider, IconButton, Grid, Snackbar, Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminFooter from "../components/AdminFooter";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AdminSidebar from "../components/AdminSidebar";

const API = "http://localhost:5000";

const ProfileAdmin = () => {
  const navigate = useNavigate();
  const [admin] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [stats, setStats] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  useEffect(() => {
    if (!admin) navigate("/loginadmin");
    fetch(`${API}/admin/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, [navigate, admin]);

  const adminData = {
    name: admin?.email?.split("@")[0] || "Admin",
    role: "Administrateur Principal",
    email: admin?.email || "admin@securebank.ai",
    phone: "+212 6 00 00 00 00",
    memberSince: "10 Avril 2024",
    initial: (admin?.email?.split("@")[0]?.[0] || "A").toUpperCase(),
  };

  const handleUpdate = async () => {
    try {
      const r = await fetch(`${API}/admin/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: adminData.name, email: adminData.email }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Erreur");
      setSnack({ open: true, msg: "Profil mis à jour", severity: "success" });
    } catch (e) {
      setSnack({ open: true, msg: e.message, severity: "error" });
    }
  };

  const cardStyle = {
    background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "24px", transition: "all .3s ease",
    "&:hover": { borderColor: "#8B5CF6", boxShadow: "0 0 25px rgba(139,92,246,.15)" },
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#FFFFFF", borderRadius: "16px",
      "& input": { color: "#FFFFFF", WebkitTextFillColor: "#FFFFFF" },
      "& fieldset": { borderColor: "rgba(255,255,255,.15)" },
      "&:hover fieldset": { borderColor: "#8B5CF6" },
      "&.Mui-focused fieldset": { borderColor: "#8B5CF6" },
    },
    "& .MuiInputLabel-root": { color: "#FFFFFF" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#8B5CF6" },
    "& .MuiFormLabel-root": { color: "#FFFFFF" },
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", background: "linear-gradient(180deg,#020617 0%, #040816 100%)" }}>
      <AdminSidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 1, p: 5 }}>
          <Typography sx={{ color: "#FFFFFF", fontSize: 42, fontWeight: 700, mb: 1 }}>Profil Administrateur</Typography>
          <Typography sx={{ color: "#94A3B8", mb: 5 }}>Gérez vos informations personnelles et votre compte administrateur.</Typography>

          <Paper elevation={0} sx={{ ...cardStyle, p: 4, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
              <Box sx={{ position: "relative" }}>
                <Avatar sx={{ width: 110, height: 110, fontSize: 42, fontWeight: 700,
                  background: "linear-gradient(135deg,#5B21B6,#8B5CF6)" }}>
                  {adminData.initial}
                </Avatar>
                <IconButton sx={{ position: "absolute", bottom: 0, right: 0, background: "#1E293B", color: "#fff",
                  "&:hover": { background: "#334155" } }}>
                  <PhotoCameraIcon />
                </IconButton>
              </Box>
              <Box>
                <Typography sx={{ color: "#FFFFFF", fontSize: 30, fontWeight: 700 }}>{adminData.name}</Typography>
                <Typography sx={{ color: "#8B5CF6", fontWeight: 600, fontSize: 22, mt: 1 }}>{adminData.role}</Typography>
                <Typography sx={{ color: "#94A3B8", mt: 1 }}>Membre depuis le {adminData.memberSince}</Typography>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={{ ...cardStyle, p: 3 }}>
                <Typography sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: 600, mb: 1 }}>Utilisateurs</Typography>
                <Typography sx={{ color: "#FFFFFF", fontSize: 34, fontWeight: 700 }}>
                  {(stats?.total_clients + stats?.total_merchants || 0).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={{ ...cardStyle, p: 3 }}>
                <Typography sx={{ color: "#ffffff", fontSize: 18, fontWeight: 600, mb: 1 }}>Transactions</Typography>
                <Typography sx={{ color: "#ffffff", fontSize: 34, fontWeight: 700 }}>
                  {(stats?.total_transactions || 0).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={{ ...cardStyle, p: 3 }}>
                <Typography sx={{ color: "#ffffff", fontSize: 18, fontWeight: 600, mb: 1 }}>Alertes Fraude</Typography>
                <Typography sx={{ color: "#EF4444", fontSize: 34, fontWeight: 700 }}>
                  {stats?.fraud_transactions || 0}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Paper elevation={0} sx={{ ...cardStyle, p: 4 }}>
            <Typography sx={{ color: "#38BDF8", fontWeight: 700, fontSize: 24, mb: 3 }}>Informations personnelles</Typography>
            <Divider sx={{ borderColor: "rgba(255,255,255,.08)", mb: 4 }} />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Email" defaultValue={adminData.email} fullWidth sx={inputStyle} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Rôle" defaultValue={adminData.role} fullWidth sx={inputStyle} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Téléphone" defaultValue={adminData.phone} fullWidth sx={inputStyle} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Membre depuis" defaultValue={adminData.memberSince} fullWidth sx={inputStyle} InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleUpdate} variant="contained"
                sx={{ background: "linear-gradient(135deg,#5B21B6,#8B5CF6)", px: 4, py: 1.5, borderRadius: "12px",
                  textTransform: "none", fontWeight: 700,
                  "&:hover": { background: "linear-gradient(135deg,#6D28D9,#A855F7)" } }}>
                Mettre à jour le profil
              </Button>
            </Box>
          </Paper>
        </Box>
        <AdminFooter />
      </Box>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.severity} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileAdmin;
