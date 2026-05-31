import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

function StatCard({
  title,
  value,
  subtitle,
  color,
  icon,
}) {
  return (
    <Paper
      sx={{
        background: "#07122B",
        border: `1px solid ${color}30`,
        borderRadius: "24px",
        p: 3,
        height: 180,
        display: "flex",
        alignItems: "center",
        gap: 3,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      <Box
        sx={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: `${color}15`,
          border: `1px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: 500,
            mb: 1,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#fff",
            fontSize: "38px",
            fontWeight: 700,
            lineHeight: 1,
            mb: 1,
          }}
        >
          {value}
        </Typography>

        <Typography
          sx={{
            color: color,
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  );
}

function AdminStats() {
  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Utilisateurs"
            value="1,248"
            subtitle="+12.8% vs hier"
            color="#8B5CF6"
            icon={<GroupsOutlinedIcon sx={{ fontSize: 36 }} />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Analyses effectuées"
            value="3,672"
            subtitle="+18.5% vs hier"
            color="#3B82F6"
            icon={<TrendingUpOutlinedIcon sx={{ fontSize: 36 }} />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Alertes fraude"
            value="142"
            subtitle="+21.1% vs hier"
            color="#EF4444"
            icon={<WarningAmberOutlinedIcon sx={{ fontSize: 36 }} />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Taux de fraude"
            value="3.86%"
            subtitle="-1.2% vs hier"
            color="#22C55E"
            icon={<SecurityOutlinedIcon sx={{ fontSize: 36 }} />}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminStats;