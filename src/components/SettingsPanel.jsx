import {
  Paper,
  Typography,
  Box,
  Switch,
  Divider,
  Button,
} from "@mui/material";

function SettingsPanel() {
  const cardStyle = {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "24px",
    transition: "all 0.3s ease-in-out",
    p: 4,
    mb: 4,

    "&:hover": {
      borderColor: "#8B5CF6",
      boxShadow: "0 0 20px rgba(139,92,246,.15)",
    },
  };

  const settingItem = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    py: 2,
  };

  const switchStyle = {
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#8B5CF6",
    },

    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#8B5CF6",
    },
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        sx={{
          color: "#fff",
          fontSize: 42,
          fontWeight: 700,
          mb: 1,
        }}
      >
        Paramètres Administrateur
      </Typography>

      <Typography
        sx={{
          color: "#94A3B8",
          mb: 5,
        }}
      >
        Gérez les paramètres de votre compte administrateur et de sécurité.
      </Typography>

      {/* Sécurité */}

      <Paper elevation={0} sx={cardStyle}>
        <Typography
          sx={{
            color: "#38BDF8",
            fontWeight: 700,
            mb: 2,
          }}
        >
          Sécurité
        </Typography>

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Changer le mot de passe
          </Typography>

          <Button sx={{ color: "#8B5CF6" }}>
            Modifier
          </Button>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Authentification à deux facteurs
          </Typography>

          <Switch defaultChecked sx={switchStyle} />
        </Box>
      </Paper>

      {/* Préférences */}

      <Paper elevation={0} sx={cardStyle}>
        <Typography
          sx={{
            color: "#38BDF8",
            fontWeight: 700,
            mb: 2,
          }}
        >
          Préférences
        </Typography>

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Notifications Email
          </Typography>

          <Switch defaultChecked sx={switchStyle} />
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Notifications Push
          </Typography>

          <Switch sx={switchStyle} />
        </Box>
      </Paper>

      {/* Confidentialité */}

      <Paper elevation={0} sx={cardStyle}>
        <Typography
          sx={{
            color: "#38BDF8",
            fontWeight: 700,
            mb: 2,
          }}
        >
          Confidentialité
        </Typography>

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Télécharger les données
          </Typography>

          <Button sx={{ color: "#38BDF8" }}>
            Télécharger
          </Button>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

        <Box sx={settingItem}>
          <Typography sx={{ color: "#EF4444" }}>
            Supprimer le compte administrateur
          </Typography>

          <Button sx={{ color: "#EF4444" }}>
            Supprimer
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default SettingsPanel;