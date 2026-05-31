import React from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const analyses = [
  { id: "AN-001", user: "Ahmed Ben Ali", document: "Carte bancaire", risk: "Élevé", score: "97%", date: "22/05/2024", status: "Terminée" },
  { id: "AN-002", user: "Fatima Zahra", document: "CIN", risk: "Moyen", score: "68%", date: "22/05/2024", status: "En cours" },
  { id: "AN-003", user: "Karim Meddeb", document: "Relevé bancaire", risk: "Faible", score: "21%", date: "21/05/2024", status: "Terminée" },
  { id: "AN-004", user: "Salma Trabelsi", document: "Passeport", risk: "Élevé", score: "92%", date: "21/05/2024", status: "Terminée" },
  { id: "AN-005", user: "Youssef Hajji", document: "Carte bancaire", risk: "Moyen", score: "54%", date: "20/05/2024", status: "En cours" },
];

function AnalysesTable() {
  // Composant pour les cartes statistiques avec effet hover violet
  const StatCard = ({ title, value, color }) => (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        p: 3,
        borderRadius: "20px",
        background: "#0a1936",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "all 0.3s ease", // Animation fluide
        cursor: "default",
        "&:hover": {
          borderColor: "#8B5CF6", // Bordure violette au survol
          boxShadow: "0 0 15px rgba(139, 92, 246, 0.2)", // Lueur violette légère
        },
      }}
    >
      <Typography color="#94A3B8" sx={{ fontSize: "0.85rem", mb: 1 }}>{title}</Typography>
      <Typography fontSize={32} fontWeight={700} color={color || "#fff"}>
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ mt: 3 }}>
      {/* Conteneur des cartes */}
      <Box sx={{ display: "flex", gap: 3, mb: 5 }}>
        <StatCard title="Analyses aujourd'hui" value="128" />
        <StatCard title="Cette semaine" value="672" />
        <StatCard title="Risque élevé" value="82" color="#EF4444" />
        <StatCard title="Précision IA" value="98.7%" color="#22C55E" />
      </Box>

      {/* Tableau */}
      <Paper sx={{ p: 4, borderRadius: "24px", background: "#07122B" }}>
        <Typography sx={{ color: "#fff", fontSize: 28, fontWeight: 700, mb: 1 }}>Analyses</Typography>
        <Typography sx={{ color: "#94A3B8", mb: 4 }}>Historique des analyses réalisées</Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <TextField
            placeholder="Rechercher une analyse..."
            InputProps={{ startAdornment: <SearchOutlinedIcon sx={{ color: "#94A3B8", mr: 1 }} /> }}
            sx={{ width: 400, input: { color: "#fff" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#0a1936" } }}
          />
          <Button variant="outlined" startIcon={<FilterListOutlinedIcon />} sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>
            Filtrer
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { color: "#94A3B8", borderBottom: "1px solid rgba(255,255,255,0.1)" } }}>
                <TableCell>ID</TableCell>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Document</TableCell>
                <TableCell>Risque</TableCell>
                <TableCell>Score IA</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analyses.map((row) => (
                <TableRow key={row.id} sx={{ "& td": { color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.05)" } }}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.user}</TableCell>
                  <TableCell>{row.document}</TableCell>
                  <TableCell>
                    <Chip label={row.risk} sx={{ color: "#fff", background: row.risk === "Élevé" ? "#7F1D1D" : row.risk === "Moyen" ? "#78350F" : "#14532D" }} />
                  </TableCell>
                  <TableCell>{row.score}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Chip label={row.status} sx={{ color: "#fff", background: row.status === "Terminée" ? "#15803D" : "#B45309" }} />
                  </TableCell>
                  <TableCell>
                    <IconButton sx={{ color: "#3B82F6" }}><VisibilityOutlinedIcon /></IconButton>
                    <IconButton sx={{ color: "#8B5CF6" }}><EditOutlinedIcon /></IconButton>
                    <IconButton sx={{ color: "#EF4444" }}><DeleteOutlineOutlinedIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default AnalysesTable;