import { useState, useEffect } from "react";
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, TextField, MenuItem,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const API = "http://localhost:5000";

function ReportsTable() {
  const [report, setReport] = useState(null);
  const [period, setPeriod] = useState("30d");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API}/admin/reports?period=${period}`)
      .then((r) => r.json())
      .then(setReport)
      .catch(() => {});
  }, [period]);

  if (!report) return null;

  const stats = [
    { title: "Transactions", value: report.total_transactions, icon: <DescriptionOutlinedIcon />, color: "#8B5CF6", change: `Période: ${period}` },
    { title: "Fraudes", value: report.fraud_transactions, icon: <PictureAsPdfOutlinedIcon />, color: "#EF4444", change: `${report.fraud_rate}% taux` },
    { title: "Montant total", value: `${report.total_amount.toLocaleString()} $`, icon: <TrendingUpOutlinedIcon />, color: "#22C55E", change: `${report.fraud_amount.toLocaleString()} $ fraudes` },
    { title: "Moyenne/transaction", value: `${report.avg_amount} $`, icon: <SearchOutlinedIcon />, color: "#60A5FA", change: `${report.safe_transactions} légitimes` },
  ];

  const cardHover = {
    transition: "all 0.3s ease", cursor: "pointer",
    "&:hover": { borderColor: "#8B5CF6", boxShadow: "0 4px 20px rgba(139, 92, 246, 0.2)", transform: "translateY(-5px)" },
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {stats.map((card, i) => (
            <Grid size={{ xs: 12, md: 3 }} key={i}>
            <Paper sx={{ p: 3, borderRadius: "24px", background: "#07122B", color: "#fff", border: "1px solid rgba(255,255,255,0.05)", ...cardHover }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ color: card.color, fontSize: 40 }}>{card.icon}</Box>
                <Chip icon={<TrendingUpOutlinedIcon />} label={card.change} size="small" sx={{ background: "rgba(34,197,94,.15)", color: "#22C55E" }} />
              </Box>
              <Typography sx={{ color: "#94A3B8", mb: 1 }}>{card.title}</Typography>
              <Typography sx={{ fontSize: 34, fontWeight: 700 }}>{card.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Daily chart */}
      <Paper sx={{ p: 4, borderRadius: "24px", background: "#07122B", border: "1px solid rgba(255,255,255,0.05)", mb: 4 }}>
        <Typography sx={{ color: "#fff", fontSize: 22, fontWeight: 700, mb: 3 }}>Évolution quotidienne</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={report.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" stroke="#94A3B8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#0A1936", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} />
            <Legend />
            <Bar dataKey="total" name="Transactions" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="frauds" name="Fraudes" fill="#EF4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 4, background: "#07122B", borderRadius: "24px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography sx={{ color: "#fff", fontSize: 34, fontWeight: 700 }}>Rapport d'activité</Typography>
            <Typography sx={{ color: "#94A3B8" }}>Données réelles des transactions</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              select value={period} onChange={(e) => setPeriod(e.target.value)}
              sx={{ minWidth: 140, "& .MuiOutlinedInput-root": { color: "#fff", background: "#030F2D", borderRadius: "12px" }, "& .MuiSvgIcon-root": { color: "#fff" } }}
            >
              <MenuItem value="7d">7 jours</MenuItem>
              <MenuItem value="30d">30 jours</MenuItem>
              <MenuItem value="90d">90 jours</MenuItem>
            </TextField>
            <TextField
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 250, "& .MuiOutlinedInput-root": { color: "#fff", background: "#030F2D", borderRadius: "12px" } }}
            />
          </Box>
        </Box>

        {/* Top merchants */}
        <Typography sx={{ color: "#38BDF8", fontWeight: 700, mb: 2, mt: 2 }}>Top commerçants</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { color: "#94A3B8" } }}>
                <TableCell>Commerce</TableCell>
                <TableCell>Transactions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.top_merchants.filter((m) => m.name.toLowerCase().includes(search.toLowerCase())).map((m) => (
                <TableRow key={m.name}>
                  <TableCell sx={{ color: "#fff" }}>{m.name}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{m.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Top clients */}
        <Typography sx={{ color: "#38BDF8", fontWeight: 700, mb: 2, mt: 4 }}>Top clients</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ "& th": { color: "#94A3B8" } }}>
                <TableCell>Client</TableCell>
                <TableCell>Transactions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.top_clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())).map((c) => (
                <TableRow key={c.name}>
                  <TableCell sx={{ color: "#fff" }}>{c.name}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{c.count}</TableCell>
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
