import {
  Box,
  Typography,
} from "@mui/material";
import {
  TextField,
  Button,
  Paper,
   CircularProgress
} from "@mui/material";
import {
  useState,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import Sidebar from "./Sidebar";
import { useNotifications } from "../../context/NotificationContext";

function Dashboard() {
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  /* USER STATE */
  const [user, setUser] = useState(null);

  /* STATS STATE */
  const [stats, setStats] = useState([
    {
      title: "Transactions",
      value: 0,
      subtitle: "",
      color: "#A78BFA",
    },
    {
      title: "Fraudes",
      value: 0,
      subtitle: "",
      color: "#EF4444",
    },
    {
      title: "Montant total",
      value: 0,
      subtitle: "",
      color: "#60A5FA",
    },
    {
      title: "Taux fraude",
      value: "0%",
      subtitle: "",
      color: "#F59E0B",
    },
  ]);

  /* form*/
  const [amount, setAmount] = useState("");
  const [merchantCode, setMerchantCode] = useState("");

   const [loading, setLoading] = useState(false);

  useEffect(() => {
    /* GET USER */
    const savedUser = JSON.parse(
      localStorage.getItem("user")
    );

    /* IF NO USER */
    if (!savedUser) {
      navigate("/");
      return;
    }

    setUser(savedUser);

    /* DYNAMIC STATS */

  }, [navigate]);

  useEffect(() => {
    if (!user?.id || !user?.role) return;

    const url =
      user.role === "merchant"
        ? `http://localhost:5000/merchant-stats-stream/${user.id}`
        : `http://localhost:5000/stats-stream/${user.id}`;

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (user.role === "merchant") {
        setStats([
          {
            title: "Transactions",
            value: data.total_transactions,
            subtitle: "Total reçues",
            color: "#A78BFA",
          },
          {
            title: "Fraudes détectées",
            value: data.fraud_transactions,
            subtitle: "Transactions suspectes",
            color: "#EF4444",
          },
          {
            title: "Revenu total",
            value: `${data.total_revenue} $`,
            subtitle: "Argent gagné",
            color: "#60A5FA",
          },
          {
            title: "Taux de fraude",
            value: `${data.fraud_rate}%`,
            subtitle: "Risque actuel",
            color: "#F59E0B",
          },
        ]);
      } else {
        setStats([
          {
            title: "Transactions",
            value: data.total_transactions,
            subtitle: "Total effectuées",
            color: "#A78BFA",
          },
          {
            title: "Fraudes détectées",
            value: data.fraud_transactions,
            subtitle: "Transactions suspectes",
            color: "#EF4444",
          },
          {
            title: "Montant total",
            value: `${data.total_amount} $`,
            subtitle: "Volume des paiements",
            color: "#60A5FA",
          },
          {
            title: "Taux de fraude",
            value: `${data.fraud_rate}%`,
            subtitle: "Risque actuel",
            color: "#F59E0B",
          },
        ]);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [user]);


  const handleTransaction = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/transaction",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            amount,
            merchant_code: merchantCode,
            user_id: user.id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "success");

        setAmount("");
        setMerchantCode("");
      } else {
        showToast(data.error || "Erreur", "error");
      }
    } catch {
      showToast("Erreur réseau", "error");
    }finally {
      setLoading(false);
    }
  };


  /* LOADING */
  if (!user) return null;



  return (
    <Box
      sx={{
        minHeight: "100vh",

        display: "flex",

        background:
          "linear-gradient(180deg,#020617 0%, #040816 100%)",
      }}
    >
      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <Box
        sx={{
          flex: 1,

          p: 4,

          overflowY: "auto",
        }}
      >
        {/* TOPBAR */}
        <Box
          sx={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            mb: 5,
          }}
        >
          {/* LEFT */}
          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontSize: {
                  xs: "28px",
                  md: "44px",
                },
                fontWeight: 700,
              }}
            >
              Bonjour, {user.role === "Client"
                ? user.firstname
                : user.merchantname}
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",

                mt: 1,

                fontSize: "16px",
              }}
            >
              Voici un aperçu de vos
              activités et de la sécurité
              de vos documents.
            </Typography>
          </Box>

          {/* RIGHT */}
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 3,
            }}
          >
            {/* NOTIFICATION */}
            <Box
              sx={{
                position: "relative",

                cursor: "pointer",
              }}
            >
              <IconButton onClick={() => navigate("/notifications")}>
                <NotificationsNoneOutlinedIcon
                  sx={{
                    color: "#fff",
                    fontSize: 30,
                  }}
                />
              </IconButton>
              <Box
                sx={{
                  position: "absolute",

                  top: -10,
                  right: -10,

                  width: 22,
                  height: 22,

                  borderRadius: "50%",

                  background:
                    "#8B5CF6",

                  display: "flex",

                  justifyContent:
                    "center",

                  alignItems: "center",

                  color: "#fff",

                  fontSize: "14px",

                  fontWeight: 700,
                }}
              >
                5
              </Box>
            </Box>

            {/* USER */}
            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1.5,
              }}
            >
              {/* AVATAR */}
              <Box>
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  {user.role === "Client"
                    ? user.firstname
                    : user.merchantname}
                </Typography>

                <Typography
                  sx={{
                    color: "#94A3B8",
                    fontSize: "14px",
                  }}
                >
                  {user.role}
                </Typography>
              </Box>


            </Box>
          </Box>
        </Box>

        {/* STATS */}
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",

            gap: 3,
          }}
        >
          {stats.map((item, index) => (
            <Box
              key={index}
              sx={{
                background:
                  "rgba(255,255,255,0.03)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                borderRadius: "24px",

                p: 3,

                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",

                transition: "0.3s",

                "&:hover": {
                  transform:
                    "translateY(-5px)",

                  border:
                    "1px solid rgba(139,92,246,0.35)",
                },
              }}
            >
              {/* LEFT */}
              <Box>
                <Typography
                  sx={{
                    color: "#CBD5E1",

                    fontSize: "15px",

                    mb: 2,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: item.color,

                    fontSize: "52px",

                    fontWeight: 700,

                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </Typography>

                <Typography
                  sx={{
                    color: "#CBD5E1",

                    mt: 1.5,

                    fontSize: "14px",
                  }}
                >
                  {item.subtitle}
                </Typography>
              </Box>

              {/* ICON */}
              <Box
                sx={{
                  width: 74,
                  height: 74,

                  borderRadius: "50%",

                  background: item.bg,

                  display: "flex",

                  justifyContent:
                    "center",

                  alignItems: "center",

                  color: item.color,

                  fontSize: "35px",
                }}
              >
                {item.icon}
              </Box>
            </Box>
          ))}
        </Box>
        {/* TRANSACTION FORM */}
        {user.role === "Client" && (
          <Paper
            sx={{
              mt: 5,
              p: 4,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: "24px",
                fontWeight: 600,
                mb: 3,
              }}
            >
              Nouvelle transaction
            </Typography>

            <Box
              component="form"
              onSubmit={handleTransaction}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <TextField
                label="Montant"
                type="number"
                value={amount}
                required
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                slotProps={{
                  htmlInput: { min: 5 },
                }}
                inputlabelprops={{
                  style: { color: "#94A3B8" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    borderRadius: "14px",
                  },
                  "& .MuiInputLabel-root": {
                    color: "#94A3B8", // default label color
                  },
                }}
              />

              <TextField
                label="Code Marchand"
                value={merchantCode}
                onChange={(e) => setMerchantCode(e.target.value)}
                fullWidth
                required
                inputlabelprops={{
                  style: { color: "#94A3B8" },
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "#94A3B8", // default label color
                  },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    borderRadius: "14px",
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: "#8B5CF6",
                  py: 1.5,
                  borderRadius: "14px",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#7C3AED",
                  },
                }}
              >
                {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Effectuer la transaction"
        )}
              </Button>
            </Box>
          </Paper>
        )}
      </Box>


    </Box>
  );
}

export default Dashboard;
