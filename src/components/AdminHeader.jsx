import {
  Box,
  Typography,
  Avatar,
  Badge,
} from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

function AdminHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      {/* Partie gauche */}
      <Box>
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "38px",
            mb: 0.5,
            lineHeight: 1.2,
          }}
        >
          Bonjour, Admin 👋
        </Typography>

        <Typography
          sx={{
            color: "#94A3B8",
            fontSize: "15px",
          }}
        >
          Vue d'ensemble du système SecureBank AI
        </Typography>
      </Box>

      {/* Partie droite */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Date */}
        <Box
          sx={{
            background: "#07122B",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            px: 2,
            py: 1,
            color: "#fff",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          📅 22 Mai 2024
        </Box>

        {/* Notification */}
        <Badge badgeContent={3} color="secondary">
          <NotificationsNoneOutlinedIcon
            sx={{
              color: "#fff",
              fontSize: 28,
            }}
          />
        </Badge>

        {/* Profil */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#8B5CF6",
              width: 48,
              height: 48,
              fontSize: 20,
            }}
          >
            A
          </Avatar>

          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              Admin SecureBank
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",
                fontSize: "13px",
              }}
            >
              Administrateur
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminHeader;