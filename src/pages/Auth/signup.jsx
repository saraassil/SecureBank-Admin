import { Button, Paper, TextField, Typography, Box, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNotifications } from "../../context/NotificationContext";


function Signup() {
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("M");
  const [age, setAge] = useState(18);

  const [merchant_name, setMerchantName] = useState("");
  const [role, setRole] = useState("Client");
  const [category, setcate] = useState("shopping_net");

  const handleSignup = async () => {
    let payload;

    if (role === "Client") {
      payload = {
        role,
        email,
        password,
        firstname,
        lastname,
        city,
        gender,
        age,
      };
    } else {
      payload = {
        role,
        email,
        password,
        merchant_name,
        category,
        city,
      };
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        showToast("Inscription réussie", "success");
        navigate("/dashboard");
      } else {
        showToast(data.message || "Erreur d'inscription", "error");
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

    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: `
        radial-gradient(circle at top left, rgba(124,58,237,0.25), transparent 25%),
        radial-gradient(circle at bottom right, rgba(0,212,255,0.12), transparent 25%),
        linear-gradient(180deg,#020617 0%, #040816 100%)
      `,
      px: 3,
    }}>

      <Box sx={{ width: "100%", maxWidth: "500px", margin: "5%" }}>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <Paper elevation={0} sx={{
            background: "rgba(10,15,30,0.75)",
            border: "1px solid rgba(59,130,246,0.20)",
            borderRadius: "28px",
            backdropFilter: "blur(20px)",
            p: { xs: 4, md: 5 },
            boxShadow: "0 0 45px rgba(59,130,246,0.15)",
          }}> <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >

              {/* TITLE */}
              <Typography sx={{ fontSize: "34px", fontWeight: 800, textAlign: "center" }}>
                <span style={{ color: "#ffffff" }}>Secure</span>
                <span style={{ color: "#38BDF8" }}>Bank</span>
                <span style={{ color: "#8B5CF6" }}>AI</span>
              </Typography>

              <Typography sx={{ color: "#FFFFFF", fontSize: "30px", fontWeight: 700, textAlign: "center", mb: 1 }}>
                Créer un compte
              </Typography>

              <Typography sx={{ color: "#94A3B8", textAlign: "center", mb: 4 }}>
                Rejoignez SecureBank AI
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

              {/* COMMON FIELDS */}
              <label style={labelStyle}>Email</label>

              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />

              <label style={labelStyle}>Mot de passe</label>

              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />

              {/* CLIENT FIELDS */}
              {role === "Client" && (
                <>
                  <label style={labelStyle}>Prenom</label>

                  <input
                    type="text"
                    placeholder="Votre prenom"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    style={inputStyle}
                    required
                  />

                  <label style={labelStyle}>Nom</label>

                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    style={inputStyle}
                    required
                  />

                  <label style={labelStyle}>Ville</label>

                  <input
                    type="text"
                    placeholder="Casablanca"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={inputStyle}
                    required
                  />

                  <label style={labelStyle}>Gender</label>

                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>

                  <label style={labelStyle}>Age</label>

                  <input
                    type="number"
                    min="18"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </>
              )}

              {/* MERCHANT FIELDS */}
              {role === "Merchant" && (
                <>
                  <label style={labelStyle}>Nom du commerce</label>

                  <input
                    type="text"
                    placeholder="Marjane, Amazon..."
                    value={merchant_name}
                    onChange={(e) => setMerchantName(e.target.value)}
                    style={inputStyle}
                    required
                  />

                  <label style={labelStyle}>Catégorie</label>

                  <select
                    value={category}
                    onChange={(e) => setcate(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="shopping_net">shopping_net</option>
                    <option value="shopping_pos">shopping_pos</option>
                    <option value="grocery_net">grocery_net</option>
                    <option value="grocery_pos">grocery_pos</option>
                    <option value="gas_transport">gas_transport</option>
                    <option value="food_dining">food_dining</option>
                    <option value="travel">travel</option>
                    <option value="health_fitness">health_fitness</option>
                    <option value="kids_pets">kids_pets</option>
                    <option value="entertainment">entertainment</option>
                    <option value="home">home</option>
                    <option value="personal_care">personal_care</option>
                    <option value="misc_net">misc_net</option>
                    <option value="misc_pos">misc_pos</option>
                  </select>


                  <label style={labelStyle}>Ville</label>

                  <input
                    type="text"
                    placeholder="Rabat"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </>
              )}

              {/* BUTTON */}
              <motion.div whileHover={{ scale: 1.03 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 4.5,
                    background: "linear-gradient(135deg,#5B21B6,#8B5CF6)",
                    py: 1.7,
                    borderRadius: "14px",
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  S’inscrire
                </Button>
              </motion.div>

              {/* LOGIN LINK */}
              <Typography sx={{ textAlign: "center", color: "#94A3B8", mt: 4, fontSize: "14px" }}>
                Déjà un compte ?{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={{ color: "#8B5CF6", cursor: "pointer", fontWeight: 700 }}
                >
                  Se connecter
                </span>
              </Typography>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </Box>

  );
}

export default Signup;