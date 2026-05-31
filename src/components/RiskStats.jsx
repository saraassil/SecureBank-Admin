import { Box, Typography } from "@mui/material";

function RiskStats() {
  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography sx={{ color: "#EF4444", fontWeight: 600 }}>
          Risque élevé
        </Typography>

        <Typography sx={{ color: "#fff" }}>
          18% (662)
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography sx={{ color: "#F59E0B", fontWeight: 600 }}>
          Risque moyen
        </Typography>

        <Typography sx={{ color: "#fff" }}>
          32% (1174)
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ color: "#22C55E", fontWeight: 600 }}>
          Risque faible
        </Typography>

        <Typography sx={{ color: "#fff" }}>
          50% (1836)
        </Typography>
      </Box>
    </Box>
  );
}

export default RiskStats;