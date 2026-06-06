import React from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";

import {
  Mail,
  Phone,
  LocationOn,
  Send,
} from "@mui/icons-material";

import { motion } from "framer-motion";

import illustration from "../assets/images/contact.png";

function ContactUs() {
  const contactInfos = [
    {
      icon: <Mail />,
      title: "Adresse Email",
      text: "contact@securebankai.ma",
      color: "#8B5CF6",
    },

    {
      icon: <Phone />,
      title: "Téléphone",
      text: "+212 6 12 34 56 78",
      color: "#38BDF8",
    },

    {
      icon: <LocationOn />,
      title: "Localisation",
      text: "Casablanca, Maroc",
      color: "#7C3AED",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#020617",
        overflow: "hidden",
      }}
    >
      <Navbar />

      {/* HERO SECTION */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: {
            xs: "520px",
            md: "700px",
          },
          overflow: "hidden",
        }}
      >
        {/* IMAGE */}
        <motion.img
          src={illustration}
          alt="SecureBank AI"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.38)",
          }}
        />

        {/* OVERLAY */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(2,6,23,0.15), rgba(2,6,23,0.92))",
          }}
        />

        {/* HERO GLOW */}
        <Box
          sx={{
            position: "absolute",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "rgba(139,92,246,0.20)",
            filter: "blur(120px)",
            top: "-100px",
            right: "-80px",
          }}
        />

        {/* HERO TEXT */}
        <Box
          sx={{
            position: "absolute",
            left: {
              xs: "25px",
              md: "80px",
            },

            bottom: {
              xs: "60px",
              md: "100px",
            },

            zIndex: 5,

            maxWidth: "500px",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "42px",
                  md: "68px",
                },

                fontWeight: 900,

                lineHeight: 1,

                color: "#FFFFFF",

                mb: 3,

                letterSpacing: "-3px",

                textShadow:
                  "0 10px 40px rgba(0,0,0,0.5)",
              }}
            >
              Toujours là
              <br />

              <span
                style={{
                  color: "#8B5CF6",
                }}
              >
                pour vous
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

                maxWidth: "430px",
              }}
            >
              Une assistance intelligente et sécurisée disponible à tout moment
              pour protéger vos transactions.
            </Typography>
          </motion.div>
        </Box>

        {/* BOTTOM FADE */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "160px",
            background:
              "linear-gradient(to top, #020617, transparent)",
          }}
        />
      </Box>

      {/* CONTACT CARDS SECTION */}
      <Box
        sx={{
          py: {
            xs: 7,
            md: 9,
          },

          px: {
            xs: 2,
            md: 6,
          },

          background: "#080b1a",

          borderTop:
            "1px solid rgba(255,255,255,0.05)",

          borderBottom:
            "1px solid rgba(255,255,255,0.05)",

          position: "relative",

          overflow: "hidden",
        }}
      >
        {/* BACKGROUND GLOW */}
        <Box
          sx={{
            position: "absolute",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "rgba(139,92,246,0.10)",
            filter: "blur(120px)",
            top: "-180px",
            left: "-120px",
          }}
        />

        <Typography
          sx={{
            fontSize: {
              xs: "30px",
              md: "42px",
            },

            fontWeight: 900,

            color: "#FFFFFF",

            textAlign: "center",

            mb: 7,

            letterSpacing: "-2px",

            position: "relative",

            zIndex: 2,
          }}
        >
          Nos
          <span
            style={{
              color: "#8B5CF6",
            }}
          >
            {" "}
            coordonnées
          </span>
        </Typography>
<Grid
  container
  spacing={8}
  justifyContent="center"
  alignItems="center"
  sx={{
    rowGap: "65px",
    columnGap: "160px",
    ml: {
      xs: 0,
      md: 9,
    },
  }}
>
          {contactInfos.map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                }}
                style={{
                  width: "100%",
                  maxWidth: "260px",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    width: "360px",
                    height: "260px",

                    borderRadius: "28px",

                    background:
                      "rgba(15,23,42,0.7)",

                    border:
                      `1px solid ${item.color}40`,

                    backdropFilter:
                      "blur(16px)",

                    display: "flex",

                    flexDirection: "column",

                    justifyContent: "center",

                    alignItems: "center",

                    textAlign: "center",

                    position: "relative",

                    overflow: "hidden",

                    transition:
                      "0.4s ease",

                    boxShadow:
                      `0 0 30px ${item.color}15`,

                    "&:hover": {
                      border:
                        `1px solid ${item.color}`,

                      boxShadow:
                        `0 0 45px ${item.color}40`,
                    },
                  }}
                >
                  {/* GLOW */}
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      position: "absolute",
                      width: "180px",
                      height: "180px",
                      borderRadius: "50%",
                      background: `${item.color}20`,
                      filter: "blur(60px)",
                    }}
                  />

                  {/* ICON */}
                  <Box
                    sx={{
                      width: "78px",
                      height: "78px",

                      borderRadius: "22px",

                      background:
                        "rgba(255,255,255,0.05)",

                      display: "flex",

                      justifyContent: "center",

                      alignItems: "center",

                      mb: 3,

                      border:
                        `1px solid ${item.color}60`,

                      boxShadow:
                        `0 0 25px ${item.color}30`,

                      zIndex: 2,
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      sx: {
                        fontSize: 38,
                        color: item.color,
                      },
                    })}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "20px",

                      fontWeight: 800,

                      color: "#8B5CF6",

                      mb: 1.5,

                      zIndex: 2,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#CBD5E1",

                      fontSize: "14px",

                      lineHeight: 1.8,

                      maxWidth: "190px",

                      zIndex: 2,
                    }}
                  >
                    {item.text}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FORM SECTION */}
      <Box
        sx={{
          py: {
            xs: 8,
            md: 10,
          },

          px: {
            xs: 3,
            md: 6,
          },

          background: "#020617",

          position: "relative",

          overflow: "hidden",
        }}
      >
        {/* FORM GLOW */}
        <Box
          sx={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(59,130,246,0.08)",
            filter: "blur(120px)",
            bottom: "-200px",
            right: "-150px",
          }}
        />

        <motion.div
          initial={{
            opacity: 0,
            y: 60,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          viewport={{
            once: true,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              maxWidth: "650px",

              mx: "auto",

              p: {
                xs: 4,
                md: 5,
              },

              borderRadius: "30px",

              background:
                "rgba(15,23,42,0.75)",

              border:
                "1px solid rgba(139,92,246,0.20)",

              position: "relative",

              overflow: "hidden",

              backdropFilter:
                "blur(18px)",

              boxShadow:
                "0 0 45px rgba(139,92,246,0.15)",
            }}
          >
            {/* INNER GLOW */}
            <Box
              sx={{
                position: "absolute",

                width: "250px",

                height: "250px",

                borderRadius: "50%",

                background:
                  "rgba(139,92,246,0.14)",

                filter: "blur(90px)",

                top: "-100px",

                right: "-70px",
              }}
            />

            <Typography
              sx={{
                fontSize: {
                  xs: "34px",
                  md: "46px",
                },

                fontWeight: 900,

                textAlign: "center",

                color: "#FFFFFF",

                mb: 2,

                letterSpacing: "-2px",

                position: "relative",

                zIndex: 2,
              }}
            >
              Contactez
              <span
                style={{
                  color: "#8B5CF6",
                }}
              >
                {" "}
                notre équipe
              </span>
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",

                textAlign: "center",

                mb: 5,

                fontSize: "15px",

                lineHeight: 1.9,

                maxWidth: "480px",

                mx: "auto",
              }}
            >
              Une assistance intelligente et sécurisée pour répondre rapidement
              à vos besoins.
            </Typography>

            <Box
              sx={{
                display: "flex",

                flexDirection:
                  "column",

                gap: 2.5,

                position: "relative",

                zIndex: 2,
              }}
            >
              <TextField
                fullWidth
                label="Nom complet"
                variant="filled"
                sx={inputStyle}
              />

              <TextField
                fullWidth
                label="Adresse Email"
                variant="filled"
                sx={inputStyle}
              />

              <TextField
                fullWidth
                label="Votre message"
                multiline
                rows={5}
                variant="filled"
                sx={inputStyle}
              />

              <Button
                fullWidth
                variant="contained"
                endIcon={<Send />}
                sx={{
                  py: 1.8,

                  borderRadius:
                    "16px",

                  fontSize: "16px",

                  fontWeight: 800,

                  textTransform:
                    "none",

                  background:
                    "linear-gradient(135deg,#2563EB,#8B5CF6)",

                  boxShadow:
                    "0 0 30px rgba(139,92,246,0.30)",

                  transition:
                    "0.35s ease",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg,#3B82F6,#A855F7)",

                    transform:
                      "translateY(-3px)",

                    boxShadow:
                      "0 0 45px rgba(139,92,246,0.45)",
                  },
                }}
              >
                Envoyer le message
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>

      <Footer />
    </Box>
  );
}

const inputStyle = {
  "& .MuiFilledInput-root": {
    background:
      "rgba(255,255,255,0.05)",

    borderRadius: "16px",

    border:
      "1px solid rgba(255,255,255,0.06)",

    color: "#FFFFFF",

    backdropFilter:
      "blur(10px)",

    transition: "0.3s ease",

    "&:hover": {
      background:
        "rgba(255,255,255,0.07)",

      border:
        "1px solid rgba(139,92,246,0.35)",

      boxShadow:
        "0 0 20px rgba(139,92,246,0.15)",
    },

    "&.Mui-focused": {
      background:
        "rgba(255,255,255,0.08)",

      border:
        "1px solid rgba(139,92,246,0.45)",

      boxShadow:
        "0 0 25px rgba(139,92,246,0.22)",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#94A3B8",
  },

  "& input, & textarea": {
    color: "#FFFFFF",
  },
};

export default ContactUs;