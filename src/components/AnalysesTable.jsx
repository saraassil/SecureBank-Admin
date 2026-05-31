import React from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
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
  const StatCard = ({ title, value, color }) => (
    <Paper
      sx={{
        p: 4,
        borderRadius: "24px",
        background: "#0a1936",
        color: "#fff",
        transition: "transform 0.2s",
        "&:hover": { transform: "scale(1.02)" },
        border: "1px solid rgba(255,255,255,0.05)"
      }}
    >
      <Typography color="#94A3B8" sx={{ mb: 1, fontSize: "0.9rem" }}>{title}</Typography>
      <Typography fontSize={42} fontWeight={700} color={color || "#fff"}>
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ p: 3, maxWidth: "1400px", margin: "auto" }}>
      {/* Section Cartes */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={3}><StatCard title="Analyses aujourd'hui" value="128" /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Cette semaine" value="672" /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Risque élevé" value="82" color="#EF4444" /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Précision IA" value="98.7%" color="#22C55E" /></Grid>
      </Grid>

      {/* Section Tableau */}
      <Paper sx={{ p: 4, borderRadius: "24px", background: "#07122B" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography sx={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>Analyses</Typography>
            <Typography sx={{ color: "#94A3B8" }}>Historique détaillé des transactions</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              placeholder="Rechercher..."
              InputProps={{ startAdornment: <SearchOutlinedIcon sx={{ color: "#94A3B8", mr: 1 }} /> }}
              sx={{ width: 300, input: { color: "#fff" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#0a1936" } }}
            />
            <Button variant="outlined" startIcon={<FilterListOutlinedIcon />} sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)", borderRadius: "12px" }}>
              Filtrer
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#94A3B8" } }}>
                <TableCell>ID</TableCell>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Document</TableCell>
                <TableCell>Risque</TableCell>
                <TableCell>Score IA</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analyses.map((row) => (
                <TableRow key={row.id} sx={{ "& td": { borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#fff", py: 2 } }}>
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
                  <TableCell align="center">
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