import {
  Box,
  Typography,
} from "@mui/material";
import { useState, useRef } from "react";
import BadgeIcon from "@mui/icons-material/Badge";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import Sidebar from "../../pages/Dashboard/Sidebar";
import { useNotifications } from "../../context/NotificationContext";

function Documents() {
  const { showToast } = useNotifications();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    // Allow only images
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select an image");
      return;
    }

    setFile(selectedFile);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        showToast("Document uploadé avec succès", "success");
      } else {
        showToast(data.error || "Erreur upload", "error");
      }
    } catch {
      showToast("Erreur de connexion au serveur", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(180deg,#020617 0%, #040816 100%)",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          p: 5,
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontSize: "42px",
            fontWeight: 700,
            mb: 1,
          }}
        >
          Télécharger vos documents
        </Typography>

        <Typography
          sx={{
            color: "#94A3B8",
            fontSize: "18px",
            mb: 5,
          }}
        >
          Téléchargez ces documents pour une analyse automatique
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          {/* CIN */}
          <Box
            sx={{
              flex: 1,
              minWidth: "520px",
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "24px",
              p: 5,
              transition: ".3s",
              "&:hover": {
                border: "1px solid rgba(139,92,246,.8)",
                boxShadow: "0 0 35px rgba(139,92,246,.25)",
                transform: "translateY(-5px)",
              },
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "24px",
                textAlign: "center",
                mb: 4,
              }}
            >
              Carte d'identité nationale (CIN)
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "180px",
                mb: 4,
              }}
            >
              <BadgeIcon
                sx={{
                  fontSize: 130,
                  color: "#38BDF8",
                  filter: "drop-shadow(0 0 20px rgba(56,189,248,.4))",
                }}
              />
            </Box>

            {/* UPLOAD ZONE */}
            <Box
              onClick={handleClick}
              sx={{
                border: "2px dashed rgba(255,255,255,.12)",
                borderRadius: "20px",
                p: 5,
                textAlign: "center",
                color: "#94A3B8",
                transition: ".3s",
                cursor: "pointer",
                "&:hover": {
                  border: "2px dashed #8B5CF6",
                  background: "rgba(139,92,246,.05)",
                },
              }}
            >
              <CloudUploadIcon
                sx={{
                  fontSize: 55,
                  color: "#8B5CF6",
                  mb: 2,
                }}
              />

              <Typography sx={{ fontSize: "18px", color: "#fff", mb: 1 }}>
                Cliquez pour télécharger votre CIN
              </Typography>

              <Typography sx={{ fontSize: "14px", color: "#94A3B8" }}>
                PNG, JPG, PDF (Max 5MB)
              </Typography>

              {file && (
                <Typography sx={{ mt: 2, color: "#38BDF8", fontSize: "14px" }}>
                  📄 {file.name}
                </Typography>
              )}

              {/* REAL INPUT */}
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileChange}
              />
            </Box>
          </Box>

          {/* CARTE BANCAIRE */}
          <Box
            sx={{
              flex: 1,
              minWidth: "190px",
              background:
                "rgba(255,255,255,.03)",
              border:
                "1px solid rgba(255,255,255,.08)",
              borderRadius: "24px",
              p: 5,
              transition: ".3s",

              "&:hover": {
                border:
                  "1px solid rgba(139,92,246,.8)",
                boxShadow:
                  "0 0 35px rgba(139,92,246,.25)",
                transform:
                  "translateY(-5px)",
              },
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "24px",
                textAlign: "center",
                mb: 4,
              }}
            >
              Carte bancaire
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "180px",
                mb: 4,
              }}
            >
              <CreditCardIcon
                sx={{
                  fontSize: 130,
                  color: "#8B5CF6",
                  filter:
                    "drop-shadow(0 0 20px rgba(139,92,246,.4))",
                }}
              />
            </Box>

            <Box
              sx={{
                border:
                  "2px dashed rgba(255,255,255,.12)",
                borderRadius: "20px",
                p: 5,
                textAlign: "center",
                color: "#94A3B8",
                transition: ".3s",
                cursor: "pointer",

                "&:hover": {
                  border:
                    "2px dashed #8B5CF6",
                  background:
                    "rgba(139,92,246,.05)",
                },
              }}
            >
              <CloudUploadIcon
                sx={{
                  fontSize: 55,
                  color: "#8B5CF6",
                  mb: 2,
                }}
              />

              <Typography
                sx={{
                  fontSize: "18px",
                  color: "#fff",
                  mb: 1,
                }}
              >
                Cliquez pour télécharger votre carte
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#94A3B8",
                }}
              >
                PNG, JPG, PDF (Max 5MB)
              </Typography>

              <input
                type="file"
                id="bank-file"
                hidden
              />
            </Box>
          </Box>
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            mt: 5,
            color: "#38BDF8",
            fontSize: "20px",
          }}
        >
          🔒 Vos documents sont sécurisés et chiffrés
        </Typography>
      </Box>
    </Box>
  );
}

export default Documents;