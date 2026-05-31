import { Box, Typography } from "@mui/material";
import logo from "../assets/images/logo.png";

function AdminFooter() {
  return (
    <Box
      sx={{
        mt: 6,
        py: 3,
        px: 4,

        borderTop: "1px solid rgba(255,255,255,.08)",

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {/* Logo + Nom */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="SecureBankAI"
          sx={{
            width: 32,
            height: 32,
            objectFit: "contain",
          }}
        />

        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 800,
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
      </Box>

      {/* Texte central */}

      <Typography
        sx={{
          color: "#64748B",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        Intelligence Artificielle • Détection de Fraude • Sécurité Bancaire
      </Typography>

      {/* Copyright */}

      <Typography
        sx={{
          color: "#94A3B8",
          fontSize: "14px",
        }}
      >
        © 2026 SecureBank AI
      </Typography>
    </Box>
  );
}

export default AdminFooter;