
import { Box, Typography, Button, Paper } from "@mui/material";

import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

import { useNotifications } from "../../context/NotificationContext";

function Login() {
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const [role, setRole] = useState("Client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = false;
  
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // needed for Flask-Login session cookie
      body: JSON.stringify({
        role,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data))
      showToast(`Connecté en tant que ${role}`, "success");
      navigate("/dashboard");
      
    } else {
      showToast(data.error || "Identifiants invalides", "error");
    }
  } catch {
    showToast("Erreur de connexion au serveur", "error");
  }
};
  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "#f04d0c",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  };

 const labelStyle = {
    color: "#CBD5E1",
    marginBottom: "8px",
    marginTop: "20px",
    fontSize: "14px",
    display: "block",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",

        background: `
        radial-gradient(circle at top left, rgba(124,58,237,0.25), transparent 25%),
        radial-gradient(circle at bottom right, rgba(0,212,255,0.12), transparent 25%),
        linear-gradient(180deg,#020617 0%, #040816 100%)
      `,

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        px: 3,

        overflow: "hidden",

        position: "relative",
      }}
    >
      {/* GLOW */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-180px",
            right: "-180px",

            width: "450px",
            height: "450px",

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)",

            filter: "blur(90px)",
          }}
        />
      </motion.div>

      <motion.div animate={{ scale: [1, 1.12, 1], }} transition={{ duration: 10, repeat: Infinity, }} >
        <Box sx={{ position: "absolute", bottom: "-180px", left: "-180px", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(56,189,248,0.16), transparent 70%)", filter: "blur(90px)", }} />
      </motion.div>

      {/* CONTAINER */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "500px",
          margin:"5%"
        }}
      >
        {/* LOGIN */}
        <motion.div
          initial={{
            opacity: 0,
            x: -40,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: !isRegister ? 1.02 : 1,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              background:
                "rgba(10,15,30,0.75)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              borderRadius: "28px",

              backdropFilter: "blur(20px)",

              p: {
                xs: 4,
                md: 5,
              },

              boxShadow:
                "0 0 40px rgba(0,0,0,0.45)",

              height: "100%",

              transition: "0.4s ease",

              "&:hover": {
                transform: "translateY(-8px)",

                border:
                  "1px solid rgba(139,92,246,0.25)",

                boxShadow:
                  "0 0 50px rgba(139,92,246,0.20)",
              },
            }}
          ><form onSubmit={handleLogin}>
            {/* LOGO */}
            <Typography
              sx={{
                fontSize: "34px",

                fontWeight: 800,

                textAlign: "center",

                mb: 1,

                letterSpacing: "-1px",
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

            {/* TITLE */}
            <Typography
              sx={{
                color: "#FFFFFF",

                fontSize: "30px",

                fontWeight: 700,

                textAlign: "center",

                mb: 1,
              }}
            >
              Connexion
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",

                textAlign: "center",

                mb: 5,

                fontSize: "15px",
              }}
            >
              Bienvenue de retour !
              <br />
              Connectez-vous à votre compte
            </Typography>
             {/* ROLE SELECT */}
              <label style={labelStyle}>Type de compte</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={inputStyle}
              >
                <option value="Client">Client</option>
                <option value="Merchant">Merchant</option>
              </select>

            {/* EMAIL */}
                <label style={labelStyle}>Email</label>

              <input
                type="email"
                placeholder={role === "Client" ? "alice@test.com" : "merchant@test.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
              {/* password */}

              <label style={labelStyle}>Mot de passe</label>

              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
              <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "4px" }}>Mot de passe test : 123456</p>

            {/* BUTTON */}
            <motion.div
              whileHover={{
                scale: 1.03,
              }}
            >
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  background:
                    "linear-gradient(135deg,#5B21B6,#8B5CF6)",

                  py: 1.7,
                  mt: 4,

                  borderRadius: "14px",

                  textTransform: "none",

                  fontSize: "16px",

                  fontWeight: 700,

                  boxShadow:
                    "0 0 30px rgba(139,92,246,0.35)",

                  transition: "0.4s",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#6D28FF,#A855F7)",

                    boxShadow:
                      "0 0 35px rgba(139,92,246,0.45)",

                    transform:
                      "translateY(-3px)",
                  },
                }}
              >
                Se connecter
              </Button>
            </motion.div>

            {/* BOTTOM */}
            <Typography
              sx={{
                textAlign: "center",

                color: "#94A3B8",

                mt: 4,

                fontSize: "14px",
              }}
            >
              Pas encore de compte ?{" "}
              <span
                onClick={() =>
                  navigate("/signup")
                }
                style={{
                  color: "#8B5CF6",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Créer un compte
              </span>
            </Typography>
            </form>
          </Paper>
        </motion.div>


      </Box>
    </Box>
  );
}

export default Login;
