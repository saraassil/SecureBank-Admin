import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";

const users = [
  {
    id: "#USR-001",
    nom: "Ahmed Ben Ali",
    email: "ahmed@email.com",
    role: "Client",
    statut: "Actif",
    date: "22/05/2024",
  },
  {
    id: "#USR-002",
    nom: "Fatima Zahra",
    email: "fatima@email.com",
    role: "Client",
    statut: "Actif",
    date: "20/05/2024",
  },
  {
    id: "#USR-003",
    nom: "Karim Meddeb",
    email: "karim@email.com",
    role: "Client",
    statut: "Actif",
    date: "18/05/2024",
  },
  {
    id: "#USR-004",
    nom: "Salma Trabelsi",
    email: "salma@email.com",
    role: "Client",
    statut: "Bloqué",
    date: "17/05/2024",
  },
  {
    id: "#USR-005",
    nom: "Youssef Hajji",
    email: "youssef@email.com",
    role: "Client",
    statut: "Actif",
    date: "16/05/2024",
  },
];

function UserTable() {
  return (
    <Paper
      sx={{
        background: "#07122B",
        borderRadius: "24px",
        p: 4,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Header */}
      <Typography
        sx={{
          color: "#FFFFFF",
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        Utilisateurs
      </Typography>

      <Typography
        sx={{
          color: "#94A3B8",
          mt: 1,
          mb: 4,
        }}
      >
        Gérez les comptes des utilisateurs
      </Typography>

      {/* Recherche + bouton */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          gap: 2,
        }}
      >
        <TextField
          placeholder="Rechercher un utilisateur..."
          variant="outlined"
          sx={{
            width: 350,

            "& .MuiOutlinedInput-root": {
              color: "#fff",
              background: "#091833",
              borderRadius: "14px",
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.08)",
            },

            "& input::placeholder": {
              color: "#94A3B8",
              opacity: 1,
            },
          }}
        />

        <Button
          startIcon={<AddIcon />}
          sx={{
            background:
              "linear-gradient(135deg,#7C3AED,#A855F7)",
            color: "#fff",
            px: 4,
            borderRadius: "14px",

            "&:hover": {
              background:
                "linear-gradient(135deg,#6D28D9,#9333EA)",
            },
          }}
        >
          Ajouter utilisateur
        </Button>
      </Box>

      {/* Tableau */}
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell sx={{ color: "#FFFFFF" }}>
                  {user.id}
                </TableCell>

                <TableCell sx={{ color: "#FFFFFF" }}>
                  {user.nom}
                </TableCell>

                <TableCell sx={{ color: "#FFFFFF" }}>
                  {user.email}
                </TableCell>

                <TableCell sx={{ color: "#FFFFFF" }}>
                  {user.role}
                </TableCell>

                <TableCell>
                  <Chip
                    label={user.statut}
                    sx={{
                      color: "#fff",
                      background:
                        user.statut === "Actif"
                          ? "#14532D"
                          : "#7F1D1D",
                    }}
                  />
                </TableCell>

                <TableCell sx={{ color: "#FFFFFF" }}>
                  {user.date}
                </TableCell>

                <TableCell>
                  <IconButton>
                    <VisibilityOutlinedIcon
                      sx={{ color: "#3B82F6" }}
                    />
                  </IconButton>

                  <IconButton>
                    <EditOutlinedIcon
                      sx={{ color: "#8B5CF6" }}
                    />
                  </IconButton>

                  <IconButton>
                    <DeleteOutlineOutlinedIcon
                      sx={{ color: "#EF4444" }}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 4,
        }}
      >
        {[1, 2, 3, 4, 5].map((page) => (
          <Box
            key={page}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background:
                page === 1
                  ? "#3B82F6"
                  : "rgba(255,255,255,0.05)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {page}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default UserTable;