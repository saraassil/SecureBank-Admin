import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

const reports = [
  { name: "Rapport_Fraude_Mai_2024", type: "PDF", date: "30/05/2024", size: "2.3 MB" },
  { name: "Rapport_Utilisateurs_Mai_2024", type: "Excel", date: "29/05/2024", size: "1.1 MB" },
  { name: "Rapport_Analyses_Mai_2024", type: "PDF", date: "28/05/2024", size: "3.2 MB" },
  { name: "Rapport_Mensuel_Avril_2024", type: "PDF", date: "27/05/2024", size: "4.1 MB" },
];

function ReportsTable() {
  const cardHoverStyle = {
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#8B5CF6",
      boxShadow: "0 4px 20px rgba(139, 92, 246, 0.2)",
      transform: "translateY(-5px)",
    },
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* SECTION 1 : STATISTIQUES */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { title: "Rapports générés", value: "128", icon: <DescriptionOutlinedIcon />, color: "#8B5CF6" },
          { title: "PDF exportés", value: "84", icon: <PictureAsPdfOutlinedIcon />, color: "#EF4444" },
          { title: "Excel exportés", value: "44", icon: <TableChartOutlinedIcon />, color: "#22C55E" },
          { title: "Précision IA", value: "98%", icon: <PsychologyOutlinedIcon />, color: "#60A5FA" },
        ].map((card, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "24px",
                background: "#07122B",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.05)",
                ...cardHoverStyle,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ color: card.color, fontSize: 40 }}>{card.icon}</Box>
                <Chip icon={<TrendingUpOutlinedIcon />} label="+12%" size="small" sx={{ background: "rgba(34,197,94,.15)", color: "#22C55E" }} />
              </Box>
              <Typography sx={{ color: "#94A3B8", mb: 1 }}>{card.title}</Typography>
              <Typography sx={{ fontSize: 34, fontWeight: 700 }}>{card.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* SECTION 2 : RAPPORTS DISPONIBLES */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { title: "Rapport Global", color: "#8B5CF6" },
          { title: "Rapport Fraude", color: "#EF4444" },
          { title: "Rapport Utilisateurs", color: "#22C55E" },
          { title: "Rapport IA", color: "#60A5FA" },
        ].map((report, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "22px",
                background: "#07122B",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,.05)",
                ...cardHoverStyle,
              }}
            >
              <DescriptionOutlinedIcon sx={{ color: report.color, fontSize: 42, mb: 2 }} />
              <Typography sx={{ color: "#fff", mb: 2, fontWeight: 600 }}>{report.title}</Typography>
              <Button fullWidth variant="contained" sx={{ background: "linear-gradient(90deg,#7C3AED,#A855F7)" }}>
                Générer
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* TABLEAU */}
      <Paper sx={{ p: 4, background: "#07122B", borderRadius: "24px" }}>
        <Typography sx={{ color: "#fff", fontSize: 34, fontWeight: 700 }}>Rapports récents</Typography>
        <Typography sx={{ color: "#94A3B8", mb: 4 }}>Historique des exportations</Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <TextField
            placeholder="Rechercher un rapport..."
            sx={{ width: 400, "& .MuiOutlinedInput-root": { color: "#fff", background: "#030F2D" } }}
          />
          <Button variant="contained" sx={{ background: "linear-gradient(90deg,#7C3AED,#A855F7)", px: 4 }}>
            Générer un rapport
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { color: "#94A3B8" } }}>
                <TableCell>Nom</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Taille</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.name}>
                  <TableCell sx={{ color: "#fff" }}>{report.name}</TableCell>
                  <TableCell>
                    <Chip label={report.type} sx={{ color: "#fff", background: report.type === "PDF" ? "#991B1B" : "#166534" }} />
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>{report.date}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{report.size}</TableCell>
                  <TableCell>
                    <IconButton><VisibilityOutlinedIcon sx={{ color: "#3B82F6" }} /></IconButton>
                    <IconButton><DownloadOutlinedIcon sx={{ color: "#22C55E" }} /></IconButton>
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

export default ReportsTable;