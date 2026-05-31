import {
  Paper,
  Typography,
  Box,
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
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

const alerts = [
  {
    id: "ALR-001",
    user: "Ahmed Ben Ali",
    type: "Document bancaire",
    risk: "Élevé",
    date: "22/05/2024 14:32",
    status: "Nouveau",
  },
  {
    id: "ALR-002",
    user: "Fatima Zahra",
    type: "Activité inhabituelle",
    risk: "Moyen",
    date: "22/05/2024 13:15",
    status: "En cours",
  },
  {
    id: "ALR-003",
    user: "Karim Meddeb",
    type: "Carte suspecte",
    risk: "Élevé",
    date: "22/05/2024 11:02",
    status: "Nouveau",
  },
  {
    id: "ALR-004",
    user: "Salma Trabelsi",
    type: "Multiple connexions",
    risk: "Moyen",
    date: "21/05/2024 22:47",
    status: "En cours",
  },
  {
    id: "ALR-005",
    user: "Youssef Hajji",
    type: "Virement suspect",
    risk: "Faible",
    date: "21/05/2024 18:05",
    status: "Traitée",
  },
];

function AlertsTable() {
  return (
    <Paper
      sx={{
        background: "#07122B",
        borderRadius: "24px",
        p: 4,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        Alertes fraude
      </Typography>

      <Typography
        sx={{
          color: "#94A3B8",
          mt: 1,
        }}
      >
        Liste des activités suspectes détectées
      </Typography>

      <Typography
        sx={{
          color: "#8B5CF6",
          fontWeight: 600,
          mt: 1,
          mb: 4,
        }}
      >
        142 alertes détectées
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: "30px",
              background:
                "linear-gradient(135deg,#7C3AED,#A855F7)",
            }}
          >
            Tous
          </Button>

          <Button
            sx={{
              color: "#EF4444",
              border: "1px solid #EF4444",
              borderRadius: "30px",
            }}
          >
            Risque élevé
          </Button>

          <Button
            sx={{
              color: "#F59E0B",
              border: "1px solid #F59E0B",
              borderRadius: "30px",
            }}
          >
            Risque moyen
          </Button>

          <Button
            sx={{
              color: "#22C55E",
              border: "1px solid #22C55E",
              borderRadius: "30px",
            }}
          >
            Risque faible
          </Button>
        </Box>

        <Button
          startIcon={<FilterListOutlinedIcon />}
          sx={{
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "14px",
          }}
        >
          Filtrer
        </Button>
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
              <TableCell sx={{ color: "#94A3B8" }}>Statut</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {alerts.map((alert) => (
              <TableRow
                key={alert.id}
                sx={{
                  "&:hover": {
                    background:
                      "rgba(255,255,255,0.03)",
                  },
                }}
              >
                <TableCell sx={{ color: "#fff" }}>
                  {alert.id}
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  {alert.user}
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  {alert.type}
                </TableCell>

                <TableCell>
                  <Chip
                    label={alert.risk}
                    sx={{
                      color: "#fff",
                      background:
                        alert.risk === "Élevé"
                          ? "#7F1D1D"
                          : alert.risk === "Moyen"
                          ? "#78350F"
                          : "#14532D",
                    }}
                  />
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  {alert.date}
                </TableCell>

                <TableCell>
                  <Chip
                    label={alert.status}
                    sx={{
                      color: "#fff",
                      background:
                        alert.status === "Nouveau"
                          ? "#1D4ED8"
                          : alert.status === "En cours"
                          ? "#B45309"
                          : "#15803D",
                    }}
                  />
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

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {[1, 2, 3, 4, 5].map((page) => (
          <Button
            key={page}
            variant={page === 1 ? "contained" : "outlined"}
            sx={{
              minWidth: "40px",
              color: "#fff",
              borderColor: "rgba(255,255,255,0.15)",
              background:
                page === 1
                  ? "#3B82F6"
                  : "transparent",
            }}
          >
            {page}
          </Button>
        ))}
      </Box>
    </Paper>
  );
}

export default AlertsTable;