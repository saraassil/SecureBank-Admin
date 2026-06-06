import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

const API = "http://localhost:5000";
const PAGE_SIZE = 8;

function AlertsTable() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [viewAlert, setViewAlert] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const fetchAlerts = () => {
    fetch(`${API}/admin/alerts`)
      .then((r) => r.json())
      .then(setAlerts)
      .catch(() => {});
  };

  useEffect(() => { fetchAlerts(); }, []);

  const riskLevel = (prob) => {
    if (prob >= 0.7) return { label: "Critique", color: "#7F1D1D" };
    if (prob >= 0.4) return { label: "Élevé", color: "#991B1B" };
    return { label: "Moyen", color: "#78350F" };
  };

  const filtered = filter === "all" ? alerts : alerts.filter((a) => riskLevel(a.fraud_probability).label === filter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleResolve = async (id) => {
    try {
      const r = await fetch(`${API}/admin/alerts/${id}/resolve`, { method: "POST" });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Erreur");
      setSnack({ open: true, msg: "Alerte résolue", severity: "success" });
      fetchAlerts();
    } catch (e) {
      setSnack({ open: true, msg: e.message, severity: "error" });
    }
  };

  return (
    <Paper sx={{ background: "#07122B", borderRadius: "24px", p: 4, border: "1px solid rgba(255,255,255,0.08)" }}>
      <Typography sx={{ color: "#fff", fontSize: 34, fontWeight: 700 }}>Alertes fraude</Typography>
      <Typography sx={{ color: "#94A3B8", mt: 1 }}>Liste des activités suspectes détectées</Typography>
      <Typography sx={{ color: "#8B5CF6", fontWeight: 600, mt: 1, mb: 4 }}>{alerts.length} alertes détectées</Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {["all", "Critique", "Élevé", "Moyen"].map((f) => (
            <Button key={f} onClick={() => { setFilter(f); setPage(0); }}
              variant={filter === f ? "contained" : "outlined"}
              sx={{ borderRadius: "30px", background: filter === f ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "transparent",
                color: filter === f ? "#fff" : "#94A3B8", border: "1px solid rgba(255,255,255,0.15)" }}>
              {f === "all" ? "Tous" : f}
            </Button>
          ))}
        </Box>
        <Button startIcon={<FilterListOutlinedIcon />} sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "14px" }}>Filtrer</Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#94A3B8" }}>ID Alerte</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Utilisateur</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Type</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Risque</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Date</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Probabilité</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((alert) => {
              const risk = riskLevel(alert.fraud_probability);
              return (
                <TableRow key={alert.id} sx={{ "&:hover": { background: "rgba(255,255,255,0.03)" } }}>
                  <TableCell sx={{ color: "#fff" }}>TXN-{String(alert.id).padStart(3, "0")}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{alert.client_name}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{alert.merchant_name}</TableCell>
                  <TableCell><Chip label={risk.label} sx={{ color: "#fff", background: risk.color }} /></TableCell>
                  <TableCell sx={{ color: "#fff" }}>{alert.date}</TableCell>
                  <TableCell>
                    <Chip label={`${(alert.fraud_probability * 100).toFixed(0)}%`} sx={{ color: "#fff", background: alert.fraud_probability >= 0.5 ? "#7F1D1D" : "#78350F" }} />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => setViewAlert(alert)}><VisibilityOutlinedIcon sx={{ color: "#3B82F6" }} /></IconButton>
                    <IconButton onClick={() => handleResolve(alert.id)}><CheckCircleOutlineOutlinedIcon sx={{ color: "#22C55E" }} /></IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
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

      {/* View Dialog */}
      <Dialog open={!!viewAlert} onClose={() => setViewAlert(null)} slotProps={{ paper: { sx: { background: "#07122B", color: "#fff", borderRadius: "24px", minWidth: 400 } } }}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 700 }}>Détails de l'alerte</DialogTitle>
        <DialogContent>
          {viewAlert && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>ID: TXN-{String(viewAlert.id).padStart(3, "0")}</Typography>
              <Typography>Client: {viewAlert.client_name}</Typography>
              <Typography>Commerce: {viewAlert.merchant_name}</Typography>
              <Typography>Montant: {viewAlert.amount} $</Typography>
              <Typography>Date: {viewAlert.date}</Typography>
              <Typography>Distance: {viewAlert.distance_km ? `${viewAlert.distance_km.toFixed(2)} km` : "-"}</Typography>
              <Typography>Probabilité de fraude: {(viewAlert.fraud_probability * 100).toFixed(1)}%</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewAlert(null)} sx={{ color: "#94A3B8" }}>Fermer</Button>
          {viewAlert && <Button onClick={() => { handleResolve(viewAlert.id); setViewAlert(null); }} variant="contained" color="success">Résoudre</Button>}
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.severity} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Paper>
  );
}

export default AlertsTable;
