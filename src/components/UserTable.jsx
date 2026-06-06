import {
  Paper, Typography, Box, TextField, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Snackbar, Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";

const API = "http://localhost:5000";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  // View dialog
  const [viewUser, setViewUser] = useState(null);

  // Add/Edit dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    role: "Client", email: "", password: "123456",
    firstname: "", lastname: "", age: 30, gender: "M", city: "Paris",
    merchant_name: "", category: "shopping_net",
  });

  // Delete dialog
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = () => {
    fetch(`${API}/admin/users`)
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.profile?.first_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.profile?.last_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.profile?.merchant_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm({ role: "Client", email: "", password: "123456", firstname: "", lastname: "", age: 30, gender: "M", city: "Paris", merchant_name: "", category: "shopping_net" });
    setFormOpen(true);
  };

  const openEdit = (user) => {
    setEditingId(user.id);
    const p = user.profile || {};
    setForm({
      role: user.role, email: user.email, password: "",
      firstname: p.first_name || "", lastname: p.last_name || "", age: p.age || 30,
      gender: p.gender || "M", city: p.city || "",
      merchant_name: p.merchant_name || "", category: p.category || "shopping_net",
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    const url = editingId ? `${API}/admin/users/${editingId}` : `${API}/admin/users`;
    const method = editingId ? "PUT" : "POST";
    try {
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Erreur");
      setSnack({ open: true, msg: editingId ? "Utilisateur modifié" : "Utilisateur créé", severity: "success" });
      setFormOpen(false);
      fetchUsers();
    } catch (e) {
      setSnack({ open: true, msg: e.message, severity: "error" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const r = await fetch(`${API}/delete/${deleteId}`, { method: "DELETE" });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Erreur");
      setSnack({ open: true, msg: "Utilisateur supprimé", severity: "success" });
      setDeleteId(null);
      fetchUsers();
    } catch (e) {
      setSnack({ open: true, msg: e.message, severity: "error" });
    }
  };

  return (
    <Paper sx={{ background: "#07122B", borderRadius: "24px", p: 4, border: "1px solid rgba(255,255,255,0.08)" }}>
      <Typography sx={{ color: "#FFFFFF", fontSize: 28, fontWeight: 700 }}>Utilisateurs</Typography>
      <Typography sx={{ color: "#94A3B8", mt: 1, mb: 4 }}>Gérez les comptes des utilisateurs</Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, gap: 2 }}>
        <TextField
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          sx={{ width: 350, "& .MuiOutlinedInput-root": { color: "#fff", background: "#091833", borderRadius: "14px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.08)" }, "& input::placeholder": { color: "#94A3B8", opacity: 1 } }}
        />
        <Button startIcon={<AddIcon />} onClick={openAdd} sx={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", px: 4, borderRadius: "14px", "&:hover": { background: "linear-gradient(135deg,#6D28D9,#9333EA)" } }}>
          Ajouter utilisateur
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#94A3B8" }}>ID</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Nom</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Email</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Rôle</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Statut</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Date</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell sx={{ color: "#FFFFFF" }}>USR-{String(user.id).padStart(3, "0")}</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>
                  {user.profile?.first_name ? `${user.profile.first_name} ${user.profile.last_name}` : user.profile?.merchant_name || user.email}
                </TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>{user.email}</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>{user.role}</TableCell>
                <TableCell>
                  <Chip label="Actif" sx={{ color: "#fff", background: "#14532D" }} />
                </TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>{user.created_at || "-"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => setViewUser(user)}>
                    <VisibilityOutlinedIcon sx={{ color: "#3B82F6" }} />
                  </IconButton>
                  <IconButton onClick={() => openEdit(user)}>
                    <EditOutlinedIcon sx={{ color: "#8B5CF6" }} />
                  </IconButton>
                  <IconButton onClick={() => setDeleteId(user.id)}>
                    <DeleteOutlineOutlinedIcon sx={{ color: "#EF4444" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Dialog */}
      <Dialog open={!!viewUser} onClose={() => setViewUser(null)} slotProps={{ paper: { sx: { background: "#07122B", color: "#fff", borderRadius: "24px", minWidth: 400 } } }}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 700 }}>Détails utilisateur</DialogTitle>
        <DialogContent>
          {viewUser && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>ID: USR-{String(viewUser.id).padStart(3, "0")}</Typography>
              <Typography>Email: {viewUser.email}</Typography>
              <Typography>Rôle: {viewUser.role}</Typography>
              <Typography>Date: {viewUser.created_at || "-"}</Typography>
              {viewUser.profile?.first_name && <Typography>Prénom: {viewUser.profile.first_name}</Typography>}
              {viewUser.profile?.last_name && <Typography>Nom: {viewUser.profile.last_name}</Typography>}
              {viewUser.profile?.merchant_name && <Typography>Commerce: {viewUser.profile.merchant_name}</Typography>}
              {viewUser.profile?.city && <Typography>Ville: {viewUser.profile.city}</Typography>}
              {viewUser.profile?.age && <Typography>Âge: {viewUser.profile.age}</Typography>}
              {viewUser.profile?.gender && <Typography>Genre: {viewUser.profile.gender}</Typography>}
              {viewUser.profile?.category && <Typography>Catégorie: {viewUser.profile.category}</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewUser(null)} sx={{ color: "#94A3B8" }}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} slotProps={{ paper: { sx: { background: "#07122B", color: "#fff", borderRadius: "24px", minWidth: 480 } } }}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 700 }}>{editingId ? "Modifier utilisateur" : "Ajouter utilisateur"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField select label="Rôle" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" }, "& .MuiSvgIcon-root": { color: "#fff" } }}>
              <MenuItem value="Client">Client</MenuItem>
              <MenuItem value="Merchant">Merchant</MenuItem>
            </TextField>
            <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" } }} />
            {!editingId && <TextField label="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" } }} />}
            <TextField label="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" } }} />
            {form.role === "Client" && (
              <>
                <TextField label="Prénom" value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.target.value })} sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" } }} />
                <TextField label="Nom" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.target.value })} sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" } }} />
                <TextField label="Âge" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" } }} />
                <TextField select label="Genre" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" }, "& .MuiSvgIcon-root": { color: "#fff" } }}>
                  <MenuItem value="M">Masculin</MenuItem>
                  <MenuItem value="F">Féminin</MenuItem>
                </TextField>
              </>
            )}
            {form.role === "Merchant" && (
              <>
                <TextField label="Nom du commerce" value={form.merchant_name} onChange={(e) => setForm({ ...form, merchant_name: e.target.value })} sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" } }} />
                <TextField select label="Catégorie" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} sx={{ input: { color: "#fff" }, label: { color: "#94A3B8" }, "& .MuiOutlinedInput-root": { color: "#fff" }, "& .MuiSvgIcon-root": { color: "#fff" } }}>
                  <MenuItem value="shopping_net">Shopping</MenuItem>
                  <MenuItem value="grocery_pos">Épicerie</MenuItem>
                  <MenuItem value="transport">Transport</MenuItem>
                  <MenuItem value="food_dining">Restauration</MenuItem>
                  <MenuItem value="travel">Voyage</MenuItem>
                  <MenuItem value="health">Santé</MenuItem>
                  <MenuItem value="fuel">Essence</MenuItem>
                  <MenuItem value="entertainment">Divertissement</MenuItem>
                  <MenuItem value="utilities">Services</MenuItem>
                  <MenuItem value="other">Autre</MenuItem>
                </TextField>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)} sx={{ color: "#94A3B8" }}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" sx={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)" }}>{editingId ? "Modifier" : "Créer"}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} slotProps={{ paper: { sx: { background: "#07122B", color: "#fff", borderRadius: "24px" } } }}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 700 }}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} sx={{ color: "#94A3B8" }}>Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.severity} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Paper>
  );
}

export default UserTable;
