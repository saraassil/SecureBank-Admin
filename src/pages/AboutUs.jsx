import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Typography, Grid, Container, Button } from "@mui/material";
import { Shield, FaceRetouchingNatural, CreditCard, Security, VerifiedUser, Analytics } from "@mui/icons-material";
import { motion } from "framer-motion";
import videoBank from "../assets/images/video.mp4";

function AboutUs() {
  const featureGroups = [
    {
      title: ["Technologies", "Intelligentes"],
      items: [
        { icon: <Shield />, title: "Détection IA", desc: "Analyse intelligente des transactions en temps réel.", color: "#8B5CF6" },
        { icon: <FaceRetouchingNatural />, title: "Biométrie", desc: "Authentification faciale hautement sécurisée.", color: "#38BDF8" },
      ],
    },
    {
      title: ["Protection", "Avancée"],
      items: [
        { icon: <VerifiedUser />, title: "OCR Intelligent", desc: "Extraction automatisée et sécurisée de données.", color: "#A855F7" },
        { icon: <CreditCard />, title: "Surveillance", desc: "Prévention proactive contre les fraudes bancaires.", color: "#3B82F6" },
      ],
    },
    {
      title: ["Authentification", "Sécurisée"],
      items: [
        { icon: <Analytics />, title: "Analyse Prédictive", desc: "Détection d'anomalies complexes instantanée.", color: "#C084FC" },
        { icon: <Security />, title: "Data Privacy", desc: "Architecture confidentielle et protection totale.", color: "#0EA5E9" },
      ],
    },
  ];

  return (
    <Box sx={{ background: "#020617", minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>
      <Navbar />

      {/* SECTION 1: HERO - Fond Principal */}
      <Container maxWidth="xl" sx={{ pt: 4, pb: 12  }}>
        <Typography sx={{ fontSize: { xs: "32px", md: "52px "}, fontWeight: 900, textAlign: "center", mb: 6 }}>
          <span style={{ color: "#fff" }}>Protection </span>
          <span style={{ color: "#38BDF8" }}>bancaire </span>
          <span style={{ color: "#8B5CF6" }}>intelligente</span>
        </Typography>

        <Box sx={{ position: "relative", borderRadius: "30px", overflow: "hidden", height: "70vh", border: "1px solid rgba(139,92,246,0.3)" }}>
          <video autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
            <source src={videoBank} type="video/mp4" />
          </video>
          
          <Box sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", p: 5, background: "linear-gradient(to top, rgba(2,6,23,0.9), transparent)", textAlign: "left" }}>
            <Typography sx={{ color: "#CBD5E1", fontSize: { xs: "14px", md: "16px" }, maxWidth: "500px", mb: 2, fontWeight: 400 }}>
              Protégez vos actifs avec la puissance de l'intelligence artificielle nouvelle génération.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
              <Button variant="contained" sx={{ borderRadius: "50px", px: 4, py: 1, background: "linear-gradient(135deg, #5B21B6, #8B5CF6)", fontWeight: 700 }}>Découvrir</Button>
            </motion.div>
          </Box>
        </Box>
      </Container>

      {/* SECTION 2: FEATURES - Fond Alternatif (Portfolio Style) */}
      <Box sx={{ py: 15, background: "#080b1a", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Container maxWidth="md">
          {featureGroups.map((group, groupIdx) => (
            <Box key={groupIdx} sx={{ mb: 14 }}>
              <Typography sx={{ fontSize: "36px", fontWeight: 900, mb: 6, textAlign: "center" }}>
                <span style={{ color: "#fff" }}>{group.title[0]} </span>
                <span style={{ color: groupIdx % 2 === 0 ? "#38BDF8" : "#8B5CF6" }}>{group.title[1]}</span>
              </Typography>
              
              <Grid container spacing={4} justifyContent="center">
                {group.items.map((item, idx) => (
                  <Grid item xs={12} sm={6} key={idx}>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: idx * 0.1 }}>
                      <Box sx={{ p: 4, borderRadius: "20px", background: "rgba(15,23,42,0.5)", border: `1px solid ${item.color}30`, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 2, transition: "0.4s", "&:hover": { borderColor: item.color, transform: "translateY(-10px)", boxShadow: `0 10px 30px ${item.color}20` } }}>
                        <Box sx={{ p: 2, borderRadius: "15px", border: `2px solid ${item.color}`, color: item.color }}>
                          {item.icon}
                        </Box>
                        <Typography sx={{ fontSize: "20px", fontWeight: 800 }}>{item.title}</Typography>
                        <Typography sx={{ color: "#94A3B8", fontSize: "14px" }}>{item.desc}</Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Container>
      </Box>

      {/* SECTION 3: FINALE - Retour au fond principal */}
      <Box sx={{ py: 16, textAlign: "center", position: "relative", overflow: "hidden", background: "#020617" }}>
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography sx={{ fontSize: { xs: "32px", md: "44px" }, fontWeight: 800, mb: 2 }}>
            <span style={{ color: "#fff" }}>Sécurisez </span>
            <span style={{ color: "#38BDF8" }}>votre </span>
            <span style={{ color: "#8B5CF6" }}>futur</span>
          </Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: "16px", mb: 5 }}>Rejoignez la révolution de la sécurité bancaire.</Typography>
          
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }}>
            <Button variant="contained" sx={{ 
              borderRadius: "25px", 
              px: 6, 
              py: 2, 
              background: "#38BDF8", 
              color: "#020617", 
              fontWeight: 800, 
              textTransform: "none", 
              fontSize: "16px",
              boxShadow: "0 10px 20px rgba(56, 189, 248, 0.3)",
              "&:hover": { background: "#fff" } 
            }}>
              Contactez nos experts
            </Button>
          </motion.div>
        </motion.div>
      </Box>

      <Footer />
    </Box>
  );
}
export default AboutUs;