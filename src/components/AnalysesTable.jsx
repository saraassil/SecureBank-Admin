import { useState, useEffect } from "react";
import {
  Paper, Typography, Box, Button, TextField, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const API = "http://localhost:5000";
const PAGE_SIZE = 10;

function StatCard({ title, value, color }) {
  return (
    <Paper sx={{ p: 4, borderRadius: "24px", background: "#0a1936", color: "#fff",
      transition: "transform 0.2s", "&:hover": { transform: "scale(1.02)" },
      border: "1px solid rgba(255,255,255,0.05)"
    }}>
      <Typography color="#94A3B8" sx={{ mb: 1, fontSize: "0.9rem" }}>{title}</Typography>
      <Typography fontSize={42} fontWeight={700} color={color || "#fff"}>{value}</Typography>
    </Paper>
  );
}

function AnalysesTable() {
  const [analyses, setAnalyses] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [viewRow, setViewRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const fetchAnalyses = () => {
    fetch(`${API}/admin/analyses`)
      .then((r) => r.json())
      .then(setAnalyses)
      .catch(() => {});
  };

  useEffect(() => { fetchAnalyses(); }, []);

  const today = analyses.filter((a) => a.status === "Terminée").length;
  const highRisk = analyses.filter((a) => a.risk === "Élevé").length;
  const correct = analyses.filter((a) => (a.risk === "Élevé" && a.status === "Terminée") || (a.risk === "Faible" && a.status === "Terminée")).length;
  const accuracy = analyses.length > 0 ? ((correct / analyses.length) * 100).toFixed(1) : "N/A";

  const filtered = analyses.filter((a) =>
    a.user.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const r = await fetch(`${API}/admin/analyses/${deleteId}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Erreur");
      setSnack({ open: true, msg: "Analyse supprimée", severity: "success" });
      setDeleteId(null);
      fetchAnalyses();
    } catch (e) {
      setSnack({ open: true, msg: e.message, severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: "1400px", margin: "auto" }}>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 3 }}><StatCard title="Analyses aujourd'hui" value={today} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><StatCard title="Cette semaine" value={analyses.length} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><StatCard title="Risque élevé" value={highRisk} color="#EF4444" /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><StatCard title="Précision IA" value={`${accuracy}%`} color="#22C55E" /></Grid>
      </Grid>

      <Paper sx={{ p: 4, borderRadius: "24px", background: "#07122B" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography sx={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>Analyses</Typography>
            <Typography sx={{ color: "#94A3B8" }}>Historique détaillé des transactions</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField placeholder="Rechercher..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              slotProps={{ input: { startAdornment: <SearchOutlinedIcon sx={{ color: "#94A3B8", mr: 1 }} /> } }}
              sx={{ width: 300, input: { color: "#fff" }, "& .MuiOutlinedInput-root": { borderRadius: "12px", background: "#0a1936" } }} />
            <Button variant="outlined" startIcon={<FilterListOutlinedIcon />} sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)", borderRadius: "12px" }}>Filtrer</Button>
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
              {paged.map((row) => (
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
                    <IconButton onClick={() => setViewRow(row)} sx={{ color: "#3B82F6" }}><VisibilityOutlinedIcon /></IconButton>
                    <IconButton onClick={() => setDeleteId(row.id.replace("AN-", ""))} sx={{ color: "#EF4444" }}><DeleteOutlineOutlinedIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 1 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i} onClick={() => setPage(i)}
                variant={page === i ? "contained" : "outlined"}
                sx={{ minWidth: "40px", color: "#fff", borderColor: "rgba(255,255,255,0.15)",
                  background: page === i ? "#3B82F6" : "transparent" }}>
                {i + 1}
              </Button>
            ))}
          </Box>
        )}
      </Paper>

      {/* View Dialog */}
      <Dialog open={!!viewRow} onClose={() => setViewRow(null)} slotProps={{ paper: { sx: { background: "#07122B", color: "#fff", borderRadius: "24px", minWidth: 400 } } }}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 700 }}>Détails de l'analyse</DialogTitle>
        <DialogContent>
          {viewRow && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>ID: {viewRow.id}</Typography>
              <Typography>Utilisateur: {viewRow.user}</Typography>
              <Typography>Document: {viewRow.document}</Typography>
              <Typography>Risque: {viewRow.risk}</Typography>
              <Typography>Score IA: {viewRow.score}</Typography>
              <Typography>Date: {viewRow.date}</Typography>
              <Typography>Statut: {viewRow.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewRow(null)} sx={{ color: "#94A3B8" }}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} slotProps={{ paper: { sx: { background: "#07122B", color: "#fff", borderRadius: "24px" } } }}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 700 }}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} sx={{ color: "#94A3B8" }}>Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.severity} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

export default AnalysesTable;
