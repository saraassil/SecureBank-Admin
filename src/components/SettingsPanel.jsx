import {
  Paper,
  Typography,
  Box,
  Switch,
  Divider,
  Button,
  TextField,
  Grid,
} from "@mui/material";

function SettingsPanel() {
  const cardStyle = {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "24px",
    transition: "all .3s ease-in-out",
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

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      borderRadius: "16px",

      "& fieldset": {
        borderColor: "rgba(255,255,255,.08)",
      },

      "&:hover fieldset": {
        borderColor: "#8B5CF6",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#8B5CF6",
      },
    },

    "& .MuiInputLabel-root": {
      color: "#94A3B8",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#38BDF8",
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
        Gérez la configuration et la sécurité de SecureBank AI.
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

        <Divider sx={{ borderColor: "rgba(255,255,255,.05)" }} />

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Authentification à deux facteurs
          </Typography>

          <Switch defaultChecked sx={switchStyle} />
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,.05)" }} />

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Historique des connexions
          </Typography>

          <Switch defaultChecked sx={switchStyle} />
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,.05)" }} />

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Gestion des sessions
          </Typography>

          <Switch defaultChecked sx={switchStyle} />
        </Box>
      </Paper>

      {/* Notifications */}

      <Paper elevation={0} sx={cardStyle}>
        <Typography
          sx={{
            color: "#38BDF8",
            fontWeight: 700,
            mb: 2,
          }}
        >
          Notifications
        </Typography>

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Notifications Email
          </Typography>

          <Switch defaultChecked sx={switchStyle} />
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,.05)" }} />

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Notifications Push
          </Typography>

          <Switch sx={switchStyle} />
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,.05)" }} />

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Alertes fraude critiques
          </Typography>

          <Switch defaultChecked sx={switchStyle} />
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,.05)" }} />

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Rapports automatiques
          </Typography>

          <Switch defaultChecked sx={switchStyle} />
        </Box>
      </Paper>

      {/* IA */}

      <Paper elevation={0} sx={cardStyle}>
        <Typography
          sx={{
            color: "#38BDF8",
            fontWeight: 700,
            mb: 2,
          }}
        >
          IA & Détection
        </Typography>

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Analyse IA
          </Typography>

          <Switch defaultChecked sx={switchStyle} />
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,.05)" }} />

        <Box sx={settingItem}>
          <Typography sx={{ color: "#E2E8F0" }}>
            Détection en temps réel
          </Typography>

          <Switch defaultChecked sx={switchStyle} />
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,.05)" }} />

        <Box sx={{ py: 2 }}>
          <Typography
            sx={{
              color: "#94A3B8",
              mb: 1,
            }}
          >
            Précision actuelle du modèle
          </Typography>

          <Typography
            sx={{
              color: "#22C55E",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            98.7%
          </Typography>
        </Box>
      </Paper>

      {/* Système */}

      <Paper elevation={0} sx={cardStyle}>
        <Typography
          sx={{
            color: "#38BDF8",
            fontWeight: 700,
            mb: 3,
          }}
        >
          Système
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Nom de la plateforme"
              defaultValue="SecureBank AI"
              sx={textFieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email administrateur"
              defaultValue="admin@securebank.ai"
              sx={textFieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Langue"
              defaultValue="Français"
              sx={textFieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fuseau horaire"
              defaultValue="UTC+1"
              sx={textFieldStyle}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Confidentialité */}

      <Paper
        elevation={0}
        sx={{
          ...cardStyle,
          border: "1px solid rgba(139,92,246,.4)",
        }}
      >
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

        <Divider sx={{ borderColor: "rgba(255,255,255,.05)" }} />

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