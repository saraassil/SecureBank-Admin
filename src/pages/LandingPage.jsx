import { Avatar, Rating } from "@mui/material";
import { Star } from "@mui/icons-material";
import {
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";

import {
  Facebook,
  Instagram,
  LinkedIn,
  Twitter,
} from "@mui/icons-material";

import { motion } from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import logo from "../assets/images/logo.png";

import illustration from "../assets/images/logo-illustration-1.jpeg";

const stats = [
  {
    number: "99.9%",
    label: "Précision IA",
    color: "#8B5CF6",
  },

  {
    number: "24/7",
    label: "Surveillance",
    color: "#38BDF8",
  },

  {
    number: "500K+",
    label: "Transactions",
    color: "#A855F7",
  },

  {
    number: "100%",
    label: "Protection",
    color: "#0EA5E9",
  },
];

/* MENU STYLE */
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

/* LOGO */
const SecureBankAI = () => (
  <Typography
    sx={{
      fontSize: "32px",

      fontWeight: 900,

      cursor: "pointer",

      letterSpacing: "-1px",

      transition: "0.4s",

      "&:hover": {
        transform: "scale(1.03)",
      },
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
);

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",

        minHeight: "100vh",

        background: "#020617",

        color: "#fff",

        overflowX: "hidden",

        position: "relative",
      }}
    >
      {/* BACKGROUND GLOW */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],

          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,

          repeat: Infinity,
        }}
      >
        <Box
          sx={{
            position: "absolute",

            top: "-200px",

            right: "-150px",

            width: "500px",

            height: "500px",

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)",

            filter: "blur(80px)",
          }}
        />
      </motion.div>

      <motion.div
        animate={{
          scale: [1, 1.12, 1],

          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,

          repeat: Infinity,
        }}
      >
        <Box
          sx={{
            position: "absolute",

            bottom: "-220px",

            left: "-120px",

            width: "450px",

            height: "450px",

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(56,189,248,0.16), transparent 70%)",

            filter: "blur(90px)",
          }}
        />
      </motion.div>

      {/* NAVBAR */}
      <Box
        sx={{
          display: "flex",

          justifyContent: "space-between",

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

          <SecureBankAI />
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

          <Typography sx={menuStyle}>
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

              color: "#FFFFFF",

              border:
                "1px solid rgba(59,130,246,0.15)",

              boxShadow:
                "0 10px 30px rgba(15,23,42,0.55)",

              transition: "0.4s ease",

              "&:hover": {
                background:
                  "linear-gradient(135deg,#5B21B6,#8B5CF6)",

                boxShadow:
                  "0 0 28px rgba(139,92,246,0.45)",

                transform:
                  "translateY(-3px)",
              },
            }}
          >
            Se connecter
          </Button>
        </motion.div>
      </Box>

      {/* HERO SECTION */}
      <Box
        sx={{
          display: "flex",

          flexDirection: {
            xs: "column",
            md: "row",
          },

          alignItems: "flex-start",

          gap: 8,

          px: {
            xs: 3,
            md: 8,
          },

          pt: 6,

          position: "relative",

          zIndex: 5,
        }}
      >
        {/* LEFT */}
        <motion.div
          initial={{
            opacity: 0,

            x: -30,
          }}
          animate={{
            opacity: 1,

            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          style={{ flex: 1.3 }}
        >
          {/* TITLE */}
          <Typography
            sx={{
              fontSize: {
                xs: "45px",
                md: "72px",
              },

              fontWeight: 900,

              lineHeight: 1.05,

              mb: 4,

              letterSpacing: "-2px",
            }}
          >
            Votre sécurité <br />

            <span style={{ color: "#38BDF8" }}>
              bancaire
            </span>

            <br />

          

            <span style={{ color: "#8B5CF6" }}>
              Notre intelligence
            </span>
          </Typography>

          {/* DESCRIPTION */}
          <Typography
            sx={{
              color: "#94A3B8",

              fontSize: "20px",

              mb: 4,

              maxWidth: "550px",

              lineHeight: 1.6,
            }}
          >
            Découvrez une protection nouvelle
            génération. Nos algorithmes IA
            analysent, détectent et sécurisent vos
            transactions en temps réel
          </Typography>

          {/* BUTTONS */}
          <Box
            sx={{
              display: "flex",

              gap: 3,

              flexWrap: "wrap",

              mb: 8,
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "50px",

                  textTransform: "none",

                  background:
                    "linear-gradient(135deg,#5B21B6,#8B5CF6)",

                  px: 5,

                  py: 1.6,

                  fontSize: "17px",

                  fontWeight: 700,

                  color: "#FFFFFF",

                  boxShadow:
                    "0 0 25px rgba(139,92,246,0.35)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#7C3AED,#A855F7)",
                  },
                }}
              >
                Découvrir
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "50px",

                  textTransform: "none",

                  px: 5,

                  py: 1.6,

                  fontSize: "17px",

                  fontWeight: 700,

                  border:
                    "1px solid rgba(56,189,248,0.4)",

                  color: "#38BDF8",

                  backdropFilter: "blur(10px)",

                  background:
                    "rgba(255,255,255,0.03)",

                  "&:hover": {
                    border:
                      "1px solid #38BDF8",

                    background:
                      "rgba(56,189,248,0.08)",
                  },
                }}
              >
                En savoir plus
              </Button>
            </motion.div>
          </Box>

          {/* STATS */}
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns:
                "repeat(2,1fr)",

              gap: 3,

              maxWidth: "550px",

              mt: 4,
            }}
          >
            {stats.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{
                  y: -10,

                  scale: 1.03,
                }}
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 3,

                  repeat: Infinity,

                  delay: index * 0.2,
                }}
              >
                <Box
                  sx={{
                    p: 3.2,

                    borderRadius: "24px",

                    background:
                      "rgba(255,255,255,0.03)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    backdropFilter:
                      "blur(12px)",

                    transition: "0.4s",

                    "&:hover": {
                      background:
                        "rgba(139,92,246,0.08)",

                      border:
                        "1px solid rgba(139,92,246,0.25)",

                      boxShadow:
                        "0 0 30px rgba(139,92,246,0.20)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "34px",

                      fontWeight: 800,

                      color: item.color,
                    }}
                  >
                    {item.number}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B",

                      fontSize: "14px",

                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* IMAGE */}
        <motion.div
          initial={{
            opacity: 0,

            scale: 0.95,
          }}
          animate={{
            opacity: 1,

            scale: 1,

            y: [0, -10, 0],
          }}
          transition={{
            duration: 1,

            y: {
              duration: 5,

              repeat: Infinity,
            },
          }}
          style={{
            flex: 1,

            marginTop: "-40px",
          }}
        >
          <img
            src={illustration}
            alt="illustration"
            style={{
              width: "100%",

              borderRadius: "30px",

              boxShadow:
                "0 20px 40px rgba(0,0,0,0.6)",
            }}
          />
        </motion.div>
      </Box>
      {/* SECTION TÉMOIGNAGES */}
      <Box sx={{ py: 12, px: { xs: 3, md: 8 }, position: "relative" }}>
        <Typography
          sx={{
            fontSize: { xs: "32px", md: "48px" },
            fontWeight: 900,
            textAlign: "center",
            mb: 8,
          }}
        >
          Retours de nos {" "}
          <span style={{ color: "#8B5CF6" }}>utilisateurs</span>
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 4,
          }}
        >
          {[
            {
              name: "Sophia Benani ",
              role: "Entrepreneure",
              text: "La sécurité offerte par Secure Bank AI est inégalée. Mes transactions professionnelles sont enfin protégées en temps réel.",
              color: "#38BDF8"
            },
            {
              name: "Soulaimane El Amrani",
              role: "Investisseur",
              text: "Une interface fluide et une intelligence artificielle qui détecte la moindre anomalie. Je dors sur mes deux oreilles.",
              color: "#8B5CF6"
            },
            {
              name: "Sanae Abedlaziz",
              role: "Étudiante",
              text: "Simple, rapide et sécurisé. C'est exactement ce dont j'avais besoin pour gérer mon budget quotidien sans stress.",
              color: "#38BDF8"
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Box
                sx={{
                  p: 4,
                  borderRadius: "30px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  height: "100%",
                  "&:hover": {
                    borderColor: item.color,
                    boxShadow: `0 0 20px ${item.color}20`,
                  }
                }}
              >
                <Rating 
                  value={5} 
                  readOnly 
                  icon={<Star sx={{ color: item.color }} />} 
                  emptyIcon={<Star style={{ opacity: 0.55 }} />} 
                  sx={{ mb: 2 }}
                />
                <Typography sx={{ color: "#CBD5E1", mb: 3, fontStyle: "italic" }}>
                  "{item.text}"
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: item.color }}>{item.name[0]}</Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                    <Typography sx={{ fontSize: "12px", color: "#64748B" }}>{item.role}</Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          mt: 14,

          position: "relative",

          overflow: "hidden",

          background: `
          linear-gradient(
            180deg,
            #070B14 0%,
            #0B1120 45%,
            #111827 100%
          )
        `,

          borderTop:
            "1px solid rgba(255,255,255,0.05)",

          px: {
            xs: 3,
            md: 8,
          },

          py: {
            xs: 5,
            md: 5.5,
          },
        }}
      >
        {/* MAIN */}
        <Box
          sx={{
            position: "relative",

            zIndex: 2,

            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            flexWrap: "wrap",

            gap: 6,

            pb: 4,
          }}
        >
          {/* LEFT */}
          <Box sx={{ maxWidth: "500px" }}>
            <Typography
              sx={{
                fontSize: {
                  xs: "34px",
                  md: "40px",
                },

                fontWeight: 900,

                mb: 1.5,

                letterSpacing: "-1px",
              }}
            >
              <span
                style={{ color: "#f5f5f5" }}
              >
                Secure
              </span>

              <span
                style={{ color: "#38BDF8" }}
              >
                Bank
              </span>

              <span
                style={{ color: "#8B5CF6" }}
              >
                AI
              </span>
            </Typography>

            <Typography
              sx={{
                color: "#CBD5E1",

                fontSize: {
                  xs: "15px",
                  md: "17px",
                },

                lineHeight: 1.9,
              }}
            >
              Une expérience bancaire
              futuriste alimentée par
              l’intelligence artificielle
              pour protéger chaque
              transaction avec rapidité,
              précision et élégance
            </Typography>
          </Box>

          {/* SOCIALS */}
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
                  y: -6,

                  scale: 1.08,
                }}
              >
                <IconButton
                  sx={{
                    width: "58px",

                    height: "58px",

                    borderRadius: "18px",

                    background:
                      "rgba(255,255,255,0.04)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    transition: "0.4s",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg,#5B21B6,#8B5CF6)",

                      boxShadow:
                        "0 0 24px rgba(139,92,246,0.35)",
                    },
                  }}
                >
                  <Icon
                    sx={{
                      color: "#FFFFFF",

                      fontSize: "24px",
                    }}
                  />
                </IconButton>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* DIVIDER */}
        <Box
          sx={{
            width: "100%",

            height: "2px",

            background:
              "linear-gradient(90deg, transparent, #1E40AF, #8B5CF6, transparent)",

            my: 4,
          }}
        />

        {/* COPYRIGHT */}
        <Typography
          sx={{
            textAlign: "center",

            fontSize: {
              xs: "15px",
              md: "17px",
            },

            fontWeight: 700,
          }}
        >
          <span style={{ color: "#FFFFFF" }}>
            © 2026
          </span>{" "}

          <span style={{ color: "#eeeeee" }}>
            Secure
          </span>

          <span style={{ color: "#38BDF8" }}>
            Bank
          </span>

          <span style={{ color: "#8B5CF6" }}>
            AI
          </span>

          <span style={{ color: "#FFFFFF" }}>
            {" "}
            —{" "}
          </span>

          <span style={{ color: "#7587c1" }}>
            Innovation
          </span>

          <span style={{ color: "#FFFFFF" }}>
            {" • "}
          </span>

          <span style={{ color: "#8B5CF6" }}>
            Sécurité
          </span>

          <span style={{ color: "#FFFFFF" }}>
            {" • "}
          </span>

          <span style={{ color: "#38BDF8" }}>
            Intelligence Artificielle
          </span>
        </Typography>
        
      </Box>
    </Box>
  );
}

export default LandingPage;