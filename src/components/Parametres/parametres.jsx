import {
  Box,
  Typography,
  Paper,
  Switch,
  Divider,
  Button,
} from "@mui/material";
import Sidebar from "../../pages/Dashboard/Sidebar";

import {
  useNavigate,
} from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";


const Settings = () => {
  const { showToast } = useNotifications();
  const navigate = useNavigate();

    const handleDelete = async () => {
    const user = JSON.parse(localStorage.getItem("user")); 
    try {
      const res = await fetch(`http://localhost:5000/delete/${user.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        showToast(data.message || "Compte supprimé", "success");
        navigate("/login");
      } else {
        showToast(data.error || "Erreur", "error");
      }
    } catch {
      showToast("Erreur de connexion au serveur", "error");
    }
  };


  const cardStyle = {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "24px",
    transition: "all 0.3s ease-in-out",
    p: 4,
    mb: 4,
    "&:hover": {
      borderColor: "#8B5CF6",
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.15)",
    },
  };

  const settingItem = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    py: 2,
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", background: "linear-gradient(180deg,#020617 0%, #040816 100%)" }}>
      <Sidebar />

      <Box sx={{ flex: 1, p: 5 }}>
        <Typography sx={{ color: "#fff", fontSize: 42, fontWeight: 700, mb: 1 }}>
          Paramètres
        </Typography>
        <Typography sx={{ color: "#94A3B8", mb: 5 }}>
          Gérez les paramètres de votre compte et de sécurité.
        </Typography>

        {/* SECTION SÉCURITÉ */}
        <Paper elevation={0} sx={cardStyle}>
          <Typography sx={{ color: "#38BDF8", fontWeight: 700, mb: 2 }}>Sécurité</Typography>
          <Box sx={settingItem}>
            <Typography sx={{ color: "#E2E8F0" }}>Changer le mot de passe</Typography>
            <Button sx={{ color: "#8B5CF6" }}>Modifier</Button>
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
          <Box sx={settingItem}>
            <Typography sx={{ color: "#E2E8F0" }}>Authentification à deux facteurs</Typography>
            <Switch defaultChecked sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B5CF6" } }} />
          </Box>
        </Paper>

        {/* SECTION PRÉFÉRENCES */}
        <Paper elevation={0} sx={cardStyle}>
          <Typography sx={{ color: "#38BDF8", fontWeight: 700, mb: 2 }}>Préférences</Typography>
          <Box sx={settingItem}>
            <Typography sx={{ color: "#E2E8F0" }}>Notifications par email</Typography>
            <Switch defaultChecked sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B5CF6" } }} />
          </Box>
          <Box sx={settingItem}>
            <Typography sx={{ color: "#E2E8F0" }}>Notifications push</Typography>
            <Switch sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B5CF6" } }} />
          </Box>
        </Paper>

        {/* SECTION CONFIDENTIALITÉ */}
        <Paper elevation={0} sx={cardStyle}>
          <Typography sx={{ color: "#38BDF8", fontWeight: 700, mb: 2 }}>Confidentialité</Typography>
          <Box sx={settingItem}>
            <Typography sx={{ color: "#E2E8F0" }}>Télécharger mes données</Typography>
            <Button sx={{ color: "#38BDF8" }}>Télécharger</Button>
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
          <Box sx={settingItem}>
            <Typography sx={{ color: "#EF4444" }}>Supprimer mon compte</Typography>
            <Button sx={{ color: "#EF4444" }} onClick={handleDelete}>Supprimer</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Settings;