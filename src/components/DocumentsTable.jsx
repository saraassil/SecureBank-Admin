import { useState, useEffect } from "react";
import {
  Paper, Typography, Box, TextField, Card, CardContent, IconButton,
  InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Grid,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";

const API = "http://localhost:5000";
const PAGE_SIZE = 8;

function DocumentsTable() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const fetchDocs = () => {
    fetch(`${API}/admin/documents`)
      .then((r) => r.json())
      .then(setDocuments)
      .catch(() => {});
  };

  useEffect(() => { fetchDocs(); }, []);

  const filtered = documents.filter((d) =>
    d.user.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase()) ||
    (d.filename || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const getDocId = (id) => {
    if (id.startsWith("UPL-")) return parseInt(id.replace("UPL-", ""), 10);
    return null;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const form = e.target;
    const file = form.file.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("user_id", "1");
    try {
      const r = await fetch(`${API}/admin/documents`, { method: "POST", body: fd });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Erreur");
      setSnack({ open: true, msg: "Document téléchargé", severity: "success" });
      setUploadOpen(false);
      fetchDocs();
    } catch (e) {
      setSnack({ open: true, msg: e.message, severity: "error" });
    }
  };

  const handleView = (doc) => {
    const id = getDocId(doc.id);
    if (id) {
      window.open(`${API}/admin/documents/${id}/view`, "_blank");
    } else {
      setViewDoc(doc);
    }
  };

  const handleDownload = (doc) => {
    const id = getDocId(doc.id);
    if (id) {
      const a = document.createElement("a");
      a.href = `${API}/admin/documents/${id}/download`;
      a.download = doc.filename || "document";
      a.click();
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: "24px", background: "#07122B", border: "1px solid rgba(255,255,255,0.05)" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>Documents téléchargés</Typography>
          <Typography sx={{ color: "#94A3B8", mt: 1 }}>Gestion des documents des utilisateurs</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField placeholder="Rechercher un document..." size="small" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            sx={{ width: 320, "& .MuiOutlinedInput-root": { background: "#0A1936", color: "#fff", borderRadius: "12px" } }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchOutlinedIcon sx={{ color: "#94A3B8" }} /></InputAdornment> } }} />
          <Button onClick={() => setUploadOpen(true)} startIcon={<UploadOutlinedIcon />}
            sx={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)", color: "#fff", px: 3, borderRadius: "14px", "&:hover": { background: "linear-gradient(135deg,#6D28D9,#9333EA)" } }}>
            Upload
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {paged.map((doc) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={doc.id}>
            <Card sx={{ background: "linear-gradient(180deg,#0A1936 0%,#081229 100%)", borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)", transition: "all .3s ease",
              "&:hover": { borderColor: "#8B5CF6", boxShadow: "0 0 25px rgba(139,92,246,.35)", transform: "translateY(-6px)" } }}>
              <CardContent>
                <Box sx={{ height: 140, borderRadius: "12px", background: "linear-gradient(135deg,#162447,#1F3B73)",
                  display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                  <DescriptionOutlinedIcon sx={{ fontSize: 70, color: "#8B5CF6" }} />
                </Box>
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{doc.id}</Typography>
                <Typography sx={{ color: "#94A3B8", fontSize: 12, mt: 0.5 }}>{doc.filename || ""}</Typography>
                <Typography sx={{ color: "#fff", mt: 1.5, fontWeight: 500 }}>{doc.user}</Typography>
                <Typography sx={{ color: "#94A3B8", fontSize: 13, mt: 1 }}>{doc.type}</Typography>
                <Typography sx={{ color: "#94A3B8", fontSize: 13 }}>{doc.date}</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  <IconButton onClick={() => handleView(doc)} sx={{ color: "#3B82F6" }}><VisibilityOutlinedIcon /></IconButton>
                  <IconButton onClick={() => handleDownload(doc)} sx={{ color: "#8B5CF6" }}><DownloadOutlinedIcon /></IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 1 }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button key={i} onClick={() => setPage(i)}
              variant={page === i ? "contained" : "outlined"}
              sx={{ minWidth: "40px", color: "#fff", borderColor: "rgba(255,255,255,0.15)", background: page === i ? "#3B82F6" : "transparent" }}>
              {i + 1}
            </Button>
          ))}
        </Box>
      )}

      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} slotProps={{ paper: { sx: { background: "#07122B", color: "#fff", borderRadius: "24px", minWidth: 400 } } }}>
        <form onSubmit={handleUpload}>
          <DialogTitle sx={{ color: "#fff", fontWeight: 700 }}>Télécharger un document</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 1 }}><input type="file" name="file" required style={{ color: "#fff" }} /></Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUploadOpen(false)} sx={{ color: "#94A3B8" }}>Annuler</Button>
            <Button type="submit" variant="contained" sx={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)" }}>Uploader</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={!!viewDoc} onClose={() => setViewDoc(null)} slotProps={{ paper: { sx: { background: "#07122B", color: "#fff", borderRadius: "24px", minWidth: 400 } } }}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 700 }}>Détails du document</DialogTitle>
        <DialogContent>
          {viewDoc && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography>ID: {viewDoc.id}</Typography>
              <Typography>Utilisateur: {viewDoc.user}</Typography>
              <Typography>Type: {viewDoc.type}</Typography>
              <Typography>Date: {viewDoc.date}</Typography>
              {viewDoc.filename && <Typography>Fichier: {viewDoc.filename}</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDoc(null)} sx={{ color: "#94A3B8" }}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snack.severity} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Paper>
  );
}

export default DocumentsTable;
