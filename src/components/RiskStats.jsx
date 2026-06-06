import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

function RiskStats() {
  const [riskData, setRiskData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin/charts")
      .then((r) => r.json())
      .then((d) => setRiskData(d.risk_data || []))
      .catch(() => {});
  }, []);

  const colors = { "Risque élevé": "#EF4444", "Risque moyen": "#F59E0B", "Risque faible": "#22C55E" };

  return (
    <Box sx={{ mt: 3 }}>
      {riskData.map((item) => (
        <Box
          key={item.name}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography sx={{ color: colors[item.name] || "#fff", fontWeight: 600 }}>
            {item.name}
          </Typography>

          <Typography sx={{ color: "#fff" }}>
            {item.value}% ({item.count})
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default RiskStats;
