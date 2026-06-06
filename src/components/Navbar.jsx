import {
  Box,
  Typography,
  Button,
} from "@mui/material";

import { motion } from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import logo from "../assets/images/logo.png";

const menuStyle = {
  position: "relative",

  cursor: "pointer",

  fontWeight: 700,

  fontSize: "20px",

  color: "#94A3B8",

  transition: "0.3s",

  "&:hover": {
    color: "#8B5CF6",
  },

  "&::after": {
    content: '""',

    position: "absolute",

    bottom: -8,

    left: 0,

    width: 0,

    height: "3px",

    background:
      "linear-gradient(90deg,#1E40AF,#8B5CF6)",

    transition: "0.4s",
  },

  "&:hover::after": {
    width: "100%",
  },
};

function Navbar() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",

        justifyContent:
          "space-between",

        alignItems: "center",

        px: {
          xs: 3,
          md: 8,
        },

        py: 4,

        position: "relative",

        zIndex: 5,
      }}
    >
      {/* LEFT */}
      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          gap: 2,
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: "55px",

            height: "55px",
          }}
        />

        <Typography
          sx={{
            fontSize: "32px",

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

      {/* MENU */}
      <Box
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },

          gap: 6,
        }}
      >
        <Typography
          onClick={() => navigate("/")}

          sx={menuStyle}
        >
          Accueil
        </Typography>

        <Typography
          onClick={() =>
            navigate("/about")
          }

          sx={menuStyle}
        >
          À propos
        </Typography>

        <Typography
          onClick={() =>
            navigate("/contact")
          }

          sx={menuStyle}
        >
          Contact
        </Typography>
      </Box>

      {/* BUTTON */}
      <motion.div
        whileHover={{
          scale: 1.05,
        }}
      >
        <Button
          onClick={() =>
            navigate("/login")
          }

          variant="contained"

          sx={{
            borderRadius: "50px",

            textTransform: "none",

            background:
              "linear-gradient(135deg,#0F172A,#1E3A8A)",

            px: 6,

            py: 1.8,

            fontSize: "17px",

            fontWeight: 700,

            "&:hover": {
              background:
                "linear-gradient(135deg,#5B21B6,#8B5CF6)",
            },
          }}
        >
          Se connecter
        </Button>
      </motion.div>
    </Box>
  );
}

export default Navbar;