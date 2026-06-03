import React from "react";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const documents = [
  {
    id: "DOC-2301-0891",
    user: "Ahmed Ben Ali",
    type: "CIN",
    date: "22/05/2024",
  },
  {
    id: "DOC-2301-0892",
    user: "Fatima Zahra",
    type: "Carte bancaire",
    date: "23/05/2024",
  },
  {
    id: "DOC-2301-0893",
    user: "Karim Meddeb",
    type: "CIN",
    date: "22/05/2024",
  },
  {
    id: "DOC-2301-0894",
    user: "Salma Trabelsi",
    type: "Carte bancaire",
    date: "23/05/2024",
  },
];

function DocumentsTable() {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: "24px",
        background: "#07122B",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 5,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            Documents téléchargés
          </Typography>

          <Typography
            sx={{
              color: "#94A3B8",
              mt: 1,
            }}
          >
            Gestion des documents des utilisateurs
          </Typography>
        </Box>

        <TextField
          placeholder="Rechercher un document..."
          size="small"
          sx={{
            width: 320,
            "& .MuiOutlinedInput-root": {
              background: "#0A1936",
              color: "#fff",
              borderRadius: "12px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: "#94A3B8" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Documents */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "32px",
          flexWrap: "nowrap",
        }}
      >
        {documents.map((doc) => (
          <Card
            key={doc.id}
            sx={{
              flex: 1,
              minWidth: 0,
              background:
                "linear-gradient(180deg,#0A1936 0%,#081229 100%)",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "all .3s ease",

              "&:hover": {
                borderColor: "#8B5CF6",
                boxShadow: "0 0 25px rgba(139,92,246,.35)",
                transform: "translateY(-6px)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  height: 140,
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg,#162447,#1F3B73)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <DescriptionOutlinedIcon
                  sx={{
                    fontSize: 70,
                    color: "#8B5CF6",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {doc.id}
              </Typography>

              <Typography
                sx={{
                  color: "#fff",
                  mt: 1.5,
                  fontWeight: 500,
                }}
              >
                {doc.user}
              </Typography>

              <Typography
                sx={{
                  color: "#94A3B8",
                  fontSize: 13,
                  mt: 1,
                }}
              >
                {doc.type}
              </Typography>

              <Typography
                sx={{
                  color: "#94A3B8",
                  fontSize: 13,
                }}
              >
                {doc.date}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <IconButton sx={{ color: "#3B82F6" }}>
                  <VisibilityOutlinedIcon />
                </IconButton>

                <IconButton sx={{ color: "#8B5CF6" }}>
                  <DownloadOutlinedIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          textAlign: "center",
          mt: 5,
        }}
      >
        <Typography
          sx={{
            color: "#8B5CF6",
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": {
              color: "#A855F7",
            },
          }}
        >
          Voir tous les documents
        </Typography>
      </Box>
    </Paper>
  );
}

export default DocumentsTable;