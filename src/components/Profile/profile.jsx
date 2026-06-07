import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../pages/Dashboard/Sidebar";
import { useNotifications } from "../../context/NotificationContext";

// ✅ REMOVED: unused `color` import from framer-motion

const textFieldSx = {
  "& .MuiInputBase-input": { color: "#fff" },
  "& .MuiInputLabel-root": { color: "#94A3B8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#8B5CF6" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(255,255,255,.12)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,.3)" },
    "&.Mui-focused fieldset": { borderColor: "#8B5CF6" },
  },
};

const Profile = () => {
  const { showToast } = useNotifications();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [merchant_Name, setMerchantName] = useState(user?.merchantname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [city, setCity] = useState(user?.city || "");

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  const isClient = user.role === "Client";

  // ✅ FIXED: display name now correctly shows merchant_name for merchants
  const displayName = isClient
    ? `${user.firstname || ""} ${user.lastname || ""}`.trim()
    : user.merchantname || "";

  const initial =
    (isClient ? user.firstname : user.merchantname)
      ?.charAt(0)
      ?.toUpperCase() || "U";

  const handleUpdate = async () => {


    const payload = {
      user_id: user.id,
      role: user.role,
      email,
      city,
    };

    if (isClient) {
      payload.firstname = firstname;
      payload.lastname = lastname;
    } else {
      payload.merchant_name = merchant_Name;
    }

    try {
      const res = await fetch("http://localhost:5000/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Profil mis à jour", "success");

        const updatedUser = { ...user, ...payload };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
      } else {
        showToast(data.error || data.message || "Erreur", "error");
      }
    } catch {
      showToast("Erreur de connexion au serveur", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(180deg,#020617 0%, #040816 100%)",
      }}
    >
      <Sidebar />

      <Box sx={{ flex: 1, p: 5 }}>
        <Typography
          sx={{ color: "#fff", fontSize: 42, fontWeight: 700, mb: 1 }}
        >
          Mon Profil
        </Typography>

        <Typography sx={{ color: "#94A3B8", mb: 5 }}>
          Gérez vos informations personnelles.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "24px",
            p: 4,
            maxWidth: "950px",
          }}
        >
          {/* ── Avatar + Name Header ── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 4 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                sx={{
                  width: 110,
                  height: 110,
                  fontSize: 42,
                  fontWeight: 700,
                  background: "linear-gradient(135deg,#5B21B6,#8B5CF6)",
                }}
              >
                {initial}
              </Avatar>

            </Box>

            <Box>
              {/* ✅ FIXED: shows full name or merchant name correctly */}
              <Typography sx={{ color: "#fff", fontSize: 26, fontWeight: 700 }}>
                {displayName}
              </Typography>

              <Typography sx={{ color: "#94A3B8", mt: 0.5 }}>
                Membre depuis le {new Date(user.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,.08)", mb: 4 }} />

          {/* ── Form Fields ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {/* ✅ All TextFields now have consistent dark-theme styling */}
            {isClient ? (
              <>
                <TextField
                  label="Prénom"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  sx={textFieldSx}
                />
                <TextField
                  label="Nom"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  sx={textFieldSx}
                />
              </>
            ) : (
              <TextField
                label="Nom du commerce"
                value={merchant_Name}
                onChange={(e) => setMerchantName(e.target.value)}
                sx={textFieldSx}
              />
            )}

            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={textFieldSx}
            />

            <TextField
              label="Ville"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              sx={textFieldSx}
            />
          </Box>

          <Box sx={{ mt: 4, textAlign: "right" }}>
            <Button
              variant="contained"
              onClick={handleUpdate}
              sx={{
                background: "linear-gradient(135deg,#5B21B6,#8B5CF6)",
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  background: "linear-gradient(135deg,#6D28D9,#A78BFA)",
                },
              }}
            >
              Modifier le profil
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Profile;