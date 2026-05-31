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

const activityData = [
  { day: "16 Mai", analyses: 80, fraudes: 20 },
  { day: "17 Mai", analyses: 120, fraudes: 40 },
  { day: "18 Mai", analyses: 180, fraudes: 60 },
  { day: "19 Mai", analyses: 110, fraudes: 30 },
  { day: "20 Mai", analyses: 200, fraudes: 75 },
  { day: "21 Mai", analyses: 160, fraudes: 50 },
  { day: "22 Mai", analyses: 220, fraudes: 100 },
];

const riskData = [
  {
    name: "Risque élevé",
    value: 18,
    count: 662,
    color: "#FF4D4F",
  },
  {
    name: "Risque moyen",
    value: 32,
    count: 1174,
    color: "#F5A623",
  },
  {
    name: "Risque faible",
    value: 50,
    count: 1836,
    color: "#22C55E",
  },
];

function AdminCharts() {
  return (
    <Box
      sx={{
        mt: 4,
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 3,
      }}
    >
      {/* ACTIVITÉ */}
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

        <Box sx={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
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

      {/* RISQUES */}
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
            fontSize:   22,
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
<PieChart width={240} height={240}>            <Pie
              data={riskData}
              innerRadius={65}
              outerRadius={95}
              dataKey="value"
            >
              {riskData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Pie>
          </PieChart>

          <Box
            sx={{
              width: "100%",
              mt: 2,
            }}
          >
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
                  sx={{
                    color: item.color,
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {item.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
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