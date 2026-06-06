import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  InputAdornment,
  Alert,
} from "@mui/material";

import { motion } from "framer-motion";

import VisibilityIcon from "@mui/icons-material/Visibility";
import SecurityIcon from "@mui/icons-material/Security";

import loginIllustration from "../../assets/images/logo-illustration-1.jpeg";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: "admin", email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/admin");
      } else {
        setError(data.error || "Identifiants invalides");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Box
        sx={{
          minHeight: "100vh",

          background: `
          radial-gradient(circle at top left, rgba(124,58,237,0.25), transparent 25%),
          radial-gradient(circle at bottom right, rgba(0,212,255,0.18), transparent 25%),
          linear-gradient(180deg,#020617 0%, #040B1D 40%, #020617 100%)
          `,

          padding: {
            xs: "20px",
            md: "35px",
          },

          color: "white",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 7,
          }}
        >
          {/* LOGO */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,

                borderRadius: "24px",

                background:
                  "linear-gradient(180deg,#8B5CF6,#00D4FF)",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                boxShadow:
                  "0 0 40px rgba(139,92,246,0.6)",
              }}
            >
              <SecurityIcon
                sx={{
                  fontSize: 45,
                  color: "white",
                }}
              />
            </Box>
          </motion.div>

          {/* TITLE */}
          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: "40px",
                  md: "74px",
                },

                fontWeight: 900,

                lineHeight: 1,

                letterSpacing: 2,

                background:
                  "linear-gradient(90deg,#FFFFFF,#E9D5FF)",

                WebkitBackgroundClip: "text",

                WebkitTextFillColor: "transparent",

                textShadow:
                  "0 0 30px rgba(255,255,255,0.12)",
              }}
            >
              SECUREBANK{" "}
              <span
                style={{
                  color: "#8B5CF6",
                }}
              >
                AI
              </span>
            </Typography>

            <Typography
              sx={{
                color: "#FFFFFF",

                mt: 1.5,

                letterSpacing: 2,

                fontSize: "15px",

                fontWeight: 500,

                opacity: 0.9,
              }}
            >
              PLATEFORME INTELLIGENTE DE DÉTECTION DE FRAUDE
              BANCAIRE
            </Typography>
          </Box>
        </Box>

        {/* MAIN CONTAINER */}
        <Paper
          elevation={0}
          sx={{
            background: "rgba(5,11,26,0.72)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            borderRadius: "32px",

            padding: {
              xs: "25px",
              md: "40px",
            },

            backdropFilter: "blur(18px)",

            boxShadow: `
            0 0 40px rgba(124,58,237,0.15),
            0 0 120px rgba(0,0,0,0.45)
            `,
          }}
        >
          {/* TITLE SECTION */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 6,
            }}
          >
            <Box
              sx={{
                width: 55,
                height: 55,

                borderRadius: "16px",

                background:
                  "linear-gradient(180deg,#6D28FF,#8B5CF6)",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                fontWeight: "bold",

                fontSize: "22px",

                color: "white",

                boxShadow:
                  "0 0 25px rgba(109,40,255,0.45)",
              }}
            >
              1
            </Box>

            <Typography
              sx={{
                fontSize: {
                  xs: "30px",
                  md: "42px",
                },

                fontWeight: 800,

                letterSpacing: 1.5,

                color: "white",
              }}
            >
              CONNEXION ADMIN
            </Typography>
          </Box>

          {/* CONTENT */}
          <Box
            sx={{
              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              flexWrap: "wrap",

              gap: 8,
            }}
          >
            {/* LEFT IMAGE */}
            <Box
              sx={{
                flex: 1,

                display: "flex",

                justifyContent: "center",

                alignItems: "center",
              }}
            >
              <motion.img
                src={loginIllustration}
                alt="securebank"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                style={{
                  width: "540px",

                  maxWidth: "100%",

                  objectFit: "contain",

                  filter:
                    "drop-shadow(0 0 45px rgba(139,92,246,0.55))",
                }}
              />
            </Box>

            {/* LOGIN CARD */}
            <Paper
              elevation={0}
              sx={{
                width: 460,

                maxWidth: "100%",

                background: "rgba(13,19,35,0.78)",

                borderRadius: "30px",

                padding: "42px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter: "blur(18px)",

                boxShadow:
                  "0 0 45px rgba(0,0,0,0.5)",
              }}
            >
              {/* ERROR */}
              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleLogin}
              >
              {/* MINI HEADER */}
              <Box
                sx={{
                  display: "flex",

                  alignItems: "center",

                  gap: 1.5,

                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 44,

                    height: 44,

                    borderRadius: "14px",

                    background:
                      "linear-gradient(180deg,#8B5CF6,#00D4FF)",

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "center",

                    boxShadow:
                      "0 0 20px rgba(139,92,246,0.4)",
                  }}
                >
                  <SecurityIcon
                    sx={{
                      fontSize: 24,
                      color: "white",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontSize: "36px",

                    fontWeight: "bold",

                    color: "white",
                  }}
                >
                  SecureBank AI
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#FFFFFF",

                  mb: 1,

                  fontWeight: 500,
                }}
              >
                Interface administrateur
              </Typography>

              <Typography
                sx={{
                  color: "#D1D5DB",

                  mb: 4,
                }}
              >
                Connectez-vous à votre compte
              </Typography>

              {/* EMAIL */}
              <Typography
                sx={{
                  mb: 1,

                  fontWeight: 600,

                  color: "#FFFFFF",
                }}
              >
                Email
              </Typography>

              <TextField
                fullWidth
                placeholder="admin@test.com"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: 3,

                  "& .MuiOutlinedInput-root": {
                    background:
                      "rgba(255,255,255,0.04)",

                    borderRadius: "16px",

                    color: "white",

                    transition: "0.3s",

                    input: {
                      color: "white",
                    },

                    "& input::placeholder": {
                      color: "#D1D5DB",
                      opacity: 1,
                    },

                    "& fieldset": {
                      borderColor: "#1F2937",
                    },

                    "&:hover fieldset": {
                      borderColor: "#8B5CF6",
                    },

                    "&.Mui-focused": {
                      boxShadow:
                        "0 0 25px rgba(124,58,237,0.18)",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: "#8B5CF6",
                    },
                  },
                }}
              />

              {/* PASSWORD */}
              <Typography
                sx={{
                  mb: 1,

                  fontWeight: 600,

                  color: "#FFFFFF",
                }}
              >
                Mot de passe
              </Typography>

              <TextField
                fullWidth
                type="password"
                placeholder="********"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <VisibilityIcon
                        sx={{
                          color: "#FFFFFF",
                          cursor: "pointer",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,

                  "& .MuiOutlinedInput-root": {
                    background:
                      "rgba(255,255,255,0.04)",

                    borderRadius: "16px",

                    color: "white",

                    transition: "0.3s",

                    input: {
                      color: "white",
                    },

                    "& input::placeholder": {
                      color: "#D1D5DB",
                      opacity: 1,
                    },

                    "& fieldset": {
                      borderColor: "#1F2937",
                    },

                    "&:hover fieldset": {
                      borderColor: "#8B5CF6",
                    },

                    "&.Mui-focused": {
                      boxShadow:
                        "0 0 25px rgba(124,58,237,0.18)",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: "#8B5CF6",
                    },
                  },
                }}
              />

              {/* OPTIONS */}
              <Box
                sx={{
                  display: "flex",

                  justifyContent: "space-between",

                  alignItems: "center",

                  mb: 4,

                  flexWrap: "wrap",
                }}
              >
                <FormControlLabel
                  sx={{
                    color: "white",
                  }}
                  control={
                    <Checkbox
                      sx={{
                        color: "#8B5CF6",

                        "&.Mui-checked": {
                          color: "#8B5CF6",
                        },
                      }}
                    />
                  }
                  label="Se souvenir de moi"
                />

                <Typography
                  sx={{
                    color: "#C4B5FD",

                    cursor: "pointer",

                    fontWeight: 600,

                    transition: "0.3s",

                    "&:hover": {
                      color: "#FFFFFF",
                    },
                  }}
                >
                  Mot de passe oublié ?
                </Typography>
              </Box>

              {/* BUTTON */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(90deg,#5B21B6,#7C3AED)",

                    borderRadius: "18px",

                    padding: "17px",

                    fontSize: "17px",

                    fontWeight: "bold",

                    letterSpacing: 1,

                    textTransform: "none",

                    color: "white",

                    backdropFilter: "blur(10px)",

                    boxShadow:
                      "0 0 30px rgba(139,92,246,0.55)",

                    transition: "0.3s",

                    "&:hover": {
                      background:
                        "linear-gradient(90deg,#6D28FF,#8B5CF6)",

                      boxShadow:
                        "0 0 45px rgba(139,92,246,0.7)",
                    },
                  }}
                >
                  Se connecter
                </Button>
              </motion.div>
            </Box>
            </Paper>
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
}

export default Login;