import { useState, useEffect } from "react";
import {
  Paper, Typography, Box, Switch, Divider, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Snackbar, Alert,
} from "@mui/material";
import { useNotifications } from "../context/NotificationContext";

const API = "http://localhost:5000";

function SettingsPanel() {
  const { showToast } = useNotifications();
  const [settings, setSettings] = useState({ two_factor: true, email_notifications: true, push_notifications: false });
  const [pwOpen, setPwOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ old: "", new: "" });
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    fetch(`${API}/admin/settings`)
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const toggleSetting = async (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    try {
      await fetch(`${API}/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch { showToast("Échec de la mise à jour", "warning"); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const r = await fetch(`${API}/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pwForm),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Erreur");
      setSnack({ open: true, msg: "Mot de passe changé", severity: "success" });
      setPwOpen(false);
      setPwForm({ old: "", new: "" });
    } catch (e) {
      setSnack({ open: true, msg: e.message, severity: "error" });
    }
  };

  const handleExportData = () => {
    window.open(`${API}/admin/reports?period=all`, "_blank");
    setSnack({ open: true, msg: "Export des données...", severity: "info" });
  };

  const handleDeleteAccount = async () => {
    setSnack({ open: true, msg: "Fonctionnalité désactivée en démo", severity: "warning" });
    setDeleteOpen(false);
  };

  const cardStyle = {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "24px",
    transition: "all 0.3s ease-in-out",
    p: 4, mb: 4,
    "&:hover": { borderColor: "#8B5CF6", boxShadow: "0 0 20px rgba(139,92,246,.15)" },
  };

  const settingItem = { display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 };
  const switchStyle = {
    "& .MuiSwitch-switchBase.Mui-checked": { color: "#8B5CF6" },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#8B5CF6" },
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography sx={{ color: "#fff", fontSize: 42, fontWeight: 700, mb: 1 }}>Paramètres Administrateur</Typography>
      <Typography sx={{ color: "#94A3B8", mb: 5 }}>Gérez les paramètres de votre compte administrateur et de sécurité.</Typography>

      <Paper elevation={0} sx={cardStyle}>
        <Typography sx={{ color: "#38BDF8", fontWeight: 700, mb: 2 }}>Sécurité</Typography>
        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>Changer le mot de passe</Typography>
          <Button onClick={() => setPwOpen(true)} sx={{ color: "#8B5CF6" }}>Modifier</Button>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>Authentification à deux facteurs</Typography>
          <Switch checked={settings.two_factor} onChange={(e) => toggleSetting("two_factor", e.target.checked)} sx={switchStyle} />
        </Box>
      </Paper>

      <Paper elevation={0} sx={cardStyle}>
        <Typography sx={{ color: "#38BDF8", fontWeight: 700, mb: 2 }}>Préférences</Typography>
        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>Notifications Email</Typography>
          <Switch checked={settings.email_notifications} onChange={(e) => toggleSetting("email_notifications", e.target.checked)} sx={switchStyle} />
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>Notifications Push</Typography>
          <Switch checked={settings.push_notifications} onChange={(e) => toggleSetting("push_notifications", e.target.checked)} sx={switchStyle} />
        </Box>
      </Paper>

      <Paper elevation={0} sx={cardStyle}>
        <Typography sx={{ color: "#38BDF8", fontWeight: 700, mb: 2 }}>Confidentialité</Typography>
        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>Télécharger les données</Typography>
          <Button onClick={handleExportData} sx={{ color: "#38BDF8" }}>Télécharger</Button>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
        <Box sx={settingItem}>
          <Typography sx={{ color: "#EF4444" }}>Supprimer le compte administrateur</Typography>
          <Button onClick={() => setDeleteOpen(true)} sx={{ color: "#EF4444" }}>Supprimer</Button>
        </Box>
      </Paper>

      {/* Password Dialog */}
      <Dialog open={pwOpen} onClose={() => setPwOpen(false)} slotProps={{ paper: { sx: { background: "#07122B", color: "#fff", borderRadius: "24px", minWidth: 400 } } }}>
        <form onSubmit={handleChangePassword}>
          <DialogTitle sx={{ color: "#fff", fontWeight: 700 }}>Changer le mot de passe</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField type="password" label="Ancien mot de passe" value={pwForm.old}
                onChange={(e) => setPwForm({ ...pwForm, old: e.target.value })}
                sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" } }} />
              <TextField type="password" label="Nouveau mot de passe" value={pwForm.new}
                onChange={(e) => setPwForm({ ...pwForm, new: e.target.value })}
                sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" } }} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPwOpen(false)} sx={{ color: "#94A3B8" }}>Annuler</Button>
            <Button type="submit" variant="contained" sx={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)" }}>Changer</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} slotProps={{ paper: { sx: { background: "#07122B", color: "#fff", borderRadius: "24px" } } }}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 700 }}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer votre compte administrateur ? Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} sx={{ color: "#94A3B8" }}>Annuler</Button>
          <Button onClick={handleDeleteAccount} variant="contained" color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.severity} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

export default SettingsPanel;
