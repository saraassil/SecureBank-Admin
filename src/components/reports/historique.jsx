import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import Sidebar from "../../pages/Dashboard/Sidebar";
import { useEffect, useState } from "react";
import { useNotifications } from "../../../context/NotificationContext";



const History = () => {
  const { showToast } = useNotifications();
  // Exemple de données - Vous pouvez remplacer cela par un appel API
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await fetch("http://localhost:5000/history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
          }),
        });

        const data = await res.json();


        setHistoryData(data);
      } catch {
        showToast("Erreur de chargement de l'historique", "error");
      }
    };

    fetchHistory();
  }, []);


  const cardStyle = {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "24px",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      borderColor: "#8B5CF6",
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.15)",
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", background: "linear-gradient(180deg,#020617 0%, #040816 100%)" }}>
      <Sidebar />

      <Box sx={{ flex: 1, p: 5 }}>
        <Typography sx={{ color: "#fff", fontSize: 42, fontWeight: 700, mb: 1 }}>
          Historique
        </Typography>
        <Typography sx={{ color: "#94A3B8", mb: 5 }}>
          Retrouvez toutes vos analyses précédentes.
        </Typography>

        <Paper elevation={0} sx={{ ...cardStyle, p: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {["ID Analyse", "Date", "destination", "amount", "Statut"].map((head) => (
                    <TableCell key={head} sx={{ color: "#94A3B8", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {historyData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ color: "#fff" }}>
                      {row.id}
                    </TableCell>

                    <TableCell sx={{ color: "#E2E8F0" }}>
                      {row.date}
                    </TableCell>

                    <TableCell sx={{ color: "#E2E8F0" }}>
                      {row.destination}
                    </TableCell>

                    <TableCell sx={{ color: "#E2E8F0" }}>
                      ${row.amount}
                    </TableCell>

                    <TableCell >
                      <Chip
                        label={row.is_fraud ? "Fraude" : "Normal"}
                        sx={{
                          background: row.is_fraud ? "rgba(239,68,68,.2)" : "rgba(34,197,94,.2)",
                          color: row.is_fraud ? "#EF4444" : "#22C55E",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default History;