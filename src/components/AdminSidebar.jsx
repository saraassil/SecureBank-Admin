import {
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import logo from "../assets/images/logo.png";

function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardOutlinedIcon />,
    },
    {
      label: "Utilisateurs",
      path: "/users",
      icon: <GroupOutlinedIcon />,
    },
    {
      label: "Alertes Fraude",
      path: "/alerts",
      icon: <WarningAmberOutlinedIcon />,
    },
    {
      label: "Analyses",
      path: "/analyses",
      icon: <QueryStatsOutlinedIcon />,
    },
    {
      label: "Documents",
      path: "/documents",
      icon: <DescriptionOutlinedIcon />,
    },
    {
      label: "Rapports",
      path: "/reports",
      icon: <AssessmentOutlinedIcon />,
    },
    {
      label: "Paramètres",
      path: "/settings",
      icon: <SettingsOutlinedIcon />,
    },
    {
      label: "Profil",
      path: "/profile",
      icon: <PersonOutlineOutlinedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        width: "260px",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#040816 0%, #020617 100%)",
        borderRight:
          "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Box>
        {/* LOGO */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            mb: 4,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="logo"
            sx={{
              width: 42,
              height: 42,
              objectFit: "contain",
            }}
          />

          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "22px",
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
                fontSize: "12px",
                mt: 0.5,
              }}
            >
              Administration SecureBank
            </Typography>
          </Box>
        </Box>

        {/* MENU */}

        <Box>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              style={{
                textDecoration: "none",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1.8,
                  mb: 1.2,
                  borderRadius: "16px",

                  background:
                    location.pathname === item.path
                      ? "linear-gradient(135deg,#5B21B6,#7C3AED)"
                      : "transparent",

                  border:
                    location.pathname === item.path
                      ? "1px solid rgba(139,92,246,0.4)"
                      : "1px solid transparent",

                  color: "#FFFFFF",
                  cursor: "pointer",
                  transition: "all .3s ease",

                  "&:hover": {
                    background:
                      location.pathname === item.path
                        ? "linear-gradient(135deg,#5B21B6,#7C3AED)"
                        : "rgba(255,255,255,0.04)",

                    transform: "translateX(5px)",
                  },
                }}
              >
                {item.icon}

                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight:
                      location.pathname === item.path
                        ? 700
                        : 500,
                  }}
                >
                  {item.label}
                </Typography>
              </Paper>
            </Link>
          ))}
        </Box>
      </Box>

      {/* SECURITY CARD */}

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          borderRadius: "24px",
          p: 2.5,
          background:
            "linear-gradient(180deg,rgba(91,33,182,0.22),rgba(15,23,42,0.9))",
          border:
            "1px solid rgba(139,92,246,0.2)",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{
            width: 70,
            height: 70,
            objectFit: "contain",
            mb: 2,
          }}
        />

        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "18px",
            mb: 1,
          }}
        >
          Contrôle total du système
        </Typography>

        <Typography
          sx={{
            color: "#CBD5E1",
            fontSize: "13px",
            lineHeight: 1.7,
            mb: 2,
          }}
        >
          Gérez les utilisateurs, documents, analyses et alertes de fraude.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          sx={{
            background:
              "linear-gradient(135deg,#5B21B6,#8B5CF6)",
            py: 1.2,
            borderRadius: "14px",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 700,

            "&:hover": {
              background:
                "linear-gradient(135deg,#6D28D9,#9333EA)",
            },
          }}
        >
          En savoir plus
        </Button>
      </Paper>
    </Box>
  );
}

export default AdminSidebar;