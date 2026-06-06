import { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AdminCharts() {
  const [activityData, setActivityData] = useState([]);
  const [riskData, setRiskData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin/charts")
      .then((r) => r.json())
      .then((d) => {
        setActivityData(d.activity || []);
        setRiskData(d.risk_data || []);
      })
      .catch(() => {});
  }, []);

  return (
    <Box
      sx={{
        mt: 4,
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 3,
      }}
    >
      <Paper
        sx={{
          background: "#07122B",
          borderRadius: "24px",
          p: 3,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            mb: 3,
          }}
        >
          Activité du système
        </Typography>

        <Box sx={{ height: 320, width: "100%" }}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis stroke="#94A3B8" dataKey="day" />
              <YAxis stroke="#94A3B8" />

              <Line
                type="monotone"
                dataKey="analyses"
                stroke="#3B82F6"
                strokeWidth={4}
              />

              <Line
                type="monotone"
                dataKey="fraudes"
                stroke="#EF4444"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Paper
        sx={{
          background: "#07122B",
          borderRadius: "24px",
          p: 3,
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            mb: 2,
          }}
        >
          Répartition des risques
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PieChart width={240} height={240}>
            <Pie
              data={riskData}
              innerRadius={65}
              outerRadius={95}
              dataKey="value"
              cx="50%"
              cy="50%"
            >
              {riskData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>

          <Box sx={{ width: "100%", mt: 2 }}>
            {riskData.map((item) => (
              <Box
                key={item.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{ color: item.color, fontWeight: 700, fontSize: 18 }}
                >
                  {item.name}
                </Typography>

                <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>
                  {item.value}% ({item.count})
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default AdminCharts;
