import {
  Box,
  Typography,
  IconButton,
} from "@mui/material";

import {
  Facebook,
  Instagram,
  LinkedIn,
  Twitter,
} from "@mui/icons-material";

import { motion } from "framer-motion";
import logo from "../assets/images/logo.png";

function Footer() {
  return (
    <Box
      sx={{
        mt: 14,
        background:
          "linear-gradient(180deg,#070B14,#111827)",
        px: {
          xs: 3,
          md: 8,
        },
        py: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 5,
        }}
      >
        {/* Logo et Texte */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={logo} alt="Logo" style={{ height: "45px" }} />
          <Typography
            sx={{
              fontSize: "34px",
              fontWeight: 900,
            }}
          >
            <span style={{ color: "#ffffff" }}>
              Secure
            </span>
            <span style={{ color: "#38BDF8" }}>
              Bank
            </span>
            <span style={{ color: "#8B5CF6" }}>
              AI
            </span>
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          {[
            Facebook,
            Instagram,
            Twitter,
            LinkedIn,
          ].map((Icon, i) => (
            <motion.div
              key={i}
              whileHover={{
                y: -5,
              }}
            >
              <IconButton
                sx={{
                  background:
                    "rgba(255,255,255,0.05)",
                  "&:hover": {
                    background:
                      "#8B5CF6",
                  },
                }}
              >
                <Icon
                  sx={{
                    color: "#fff",
                  }}
                />
              </IconButton>
            </motion.div>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, #1E40AF, #8B5CF6, transparent)",
          my: 4,
        }}
      />

      <Typography
        sx={{
          textAlign: "center",
          color: "#CBD5E1",
        }}
      >
        © 2026 SecureBank AI —
        Intelligence Artificielle &
        Sécurité Bancaire
      </Typography>
    </Box>
  );
}

export default Footer;