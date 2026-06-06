import {
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import logo from "../../assets/images/logo.png";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include", // IMPORTANT for Flask-Login sessions
      });

      if (!res.ok) throw new Error("Logout failed");

      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      path: "/dashboard",
    },

    {
      label: "Mes documents",
      icon: <DescriptionOutlinedIcon />,
      path: "/documents",
    },

    {
      label: "Currency Converter",
      icon:  <CurrencyExchangeIcon />,
      path: "/analyses",
    },

    {
      label: "Historique",
      icon: <HistoryOutlinedIcon />,
      path: "/historique",
    },

    {
      label: "Notifications",
      icon: <NotificationsNoneOutlinedIcon />,
      path: "/notifications",
    },

    {
      label: "Profil",
      icon: <PersonOutlineOutlinedIcon />,
      path: "/profile",
    },

    {
      label: "Paramètres",
      icon: <SettingsOutlinedIcon />,
      path: "/parametres",
    },

    {
      label: "Déconnexion",
      icon: <LogoutOutlinedIcon />,
      action: handleLogout,
    },
  ];

  return (
    <Box
      sx={{
        width: "290px",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#040816 0%, #020617 100%)",
        borderRight:
          "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2.5,
      }}
    >
      <Box>
        {/* LOGO */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 5,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="logo"
            sx={{
              width: 55,
              height: 55,
              objectFit: "contain",
            }}
          />

          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "31px",
                lineHeight: 1,
              }}
            >
              <span style={{ color: "#FFFFFF" }}>
                Secure
              </span>

              <span style={{ color: "#38BDF8" }}>
                Bank
              </span>

              <span style={{ color: "#8B5CF6" }}>
                AI
              </span>
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",
                fontSize: "13px",
                mt: 0.5,
              }}
            >
              Détection intelligente de fraude
            </Typography>
          </Box>
        </Box>

        {/* MENU */}
        <Box>
          {menuItems.map((item, index) => (
            <Paper
              key={index}
              elevation={0}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                }
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                mb: 1.5,
                borderRadius: "16px",
                background:
                  item.path && window.location.pathname === item.path

                    ? "linear-gradient(135deg,#5B21B6,#7C3AED)"
                    : "transparent",

                border: item.path && window.location.pathname === item.path

                  ? "1px solid rgba(139,92,246,0.4)"
                  : "1px solid transparent",

                color: "#FFFFFF",
                cursor: "pointer",
                transition: "0.3s",

                "&:hover": {
                  background:
                    "rgba(255,255,255,0.04)",
                  transform:
                    "translateX(5px)",
                },
              }}
            >
              <Box
                sx={{
                  color:
                    window.location.pathname ===
                      item.path
                      ? "#fff"
                      : "#CBD5E1",
                }}
              >
                {item.icon}
              </Box>

              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight:
                    window.location.pathname ===
                      item.path
                      ? 700
                      : 500,
                }}
              >
                {item.label}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* SECURITY CARD */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          borderRadius: "28px",
          p: 3,
          background:
            "linear-gradient(180deg,rgba(91,33,182,0.22),rgba(15,23,42,0.9))",
          border:
            "1px solid rgba(139,92,246,0.2)",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{
            width: 100,
            height: 100,
            objectFit: "contain",
            mb: 3,
          }}
        />

        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "22px",
            mb: 1,
          }}
        >
          Votre sécurité, notre priorité.
        </Typography>

        <Typography
          sx={{
            color: "#CBD5E1",
            fontSize: "14px",
            lineHeight: 1.8,
            mb: 3,
          }}
        >
          L'IA au service de la protection de vos documents et transactions.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          sx={{
            background:
              "linear-gradient(135deg,#5B21B6,#8B5CF6)",
            py: 1.4,
            borderRadius: "14px",
            textTransform: "none",
            fontSize: "15px",
            fontWeight: 700,
          }}
        >
          En savoir plus
        </Button>
      </Paper>
    </Box>
  );
}

export default Sidebar;