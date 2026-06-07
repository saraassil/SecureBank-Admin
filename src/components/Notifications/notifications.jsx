import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";

import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../../pages/Dashboard/Sidebar";
import { useNotifications } from "../../context/NotificationContext";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

const Notifications = () => {
  const { showToast } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  let parsed;
  try { parsed = JSON.parse(localStorage.getItem("user")); } catch { parsed = null; }
  const user = parsed || {};

  useEffect(() => {
    const fn = async () => {
      if (!user?.id || !user?.role) { setLoading(false); return; }
      try {
        const url =
          user.role === "Merchant"
            ? "http://localhost:5000/merchant-notification"
            : "http://localhost:5000/notification";
        const payload =
          user.role === "Merchant"
            ? { merchant_id: user.id }
            : { user_id: user.id };
        const res = await axios.post(url, payload, { timeout: 8000 });
        const data = res.data.map((t) => {
          if (user.role === "Merchant") {
            return {
              id: t.id,
              title: "Paiement reçu",
              desc: `💰 ${t.amount} $ reçu de ${t.client}`,
              time: t.date,
              type: "success",
            };
          }
          return {
            id: t.id,
            title: t.is_fraud
              ? "Transaction suspecte détectée"
              : "Paiement effectué",
            desc: t.is_fraud
              ? `⚠️ Fraude probable (${(t.prob * 100).toFixed(1)}%) - ${t.amount} $`
              : `💳 Paiement de ${t.amount} $ à ${t.merchant}`,
            time: t.date,
            type: t.is_fraud ? "warning" : "success",
          };
        });
        setNotifications(data);
      } catch {
        showToast("Erreur de chargement des notifications", "error");
      } finally {
        setLoading(false);
      }
    };

    fn();

    const interval = setInterval(fn, 5000);

    return () => clearInterval(interval);
  }, [user?.id, user?.role, showToast]);

  const cardStyle = {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "24px",
  };

  const getIcon = (type) => {
    if (type === "success") {
      return <CheckCircleIcon sx={{ color: "#22C55E", fontSize: 28 }} />;
    }

    if (type === "warning") {
      return <WarningIcon sx={{ color: "#F59E0B", fontSize: 28 }} />;
    }

    return <InfoIcon sx={{ color: "#38BDF8", fontSize: 28 }} />;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(180deg,#020617 0%, #040816 100%)",
      }}
    >
      <Sidebar />

      <Box sx={{ flex: 1, p: 5 }}>
        <Typography
          sx={{ color: "#fff", fontSize: 42, fontWeight: 700, mb: 1 }}
        >
          Notifications
        </Typography>

        <Typography sx={{ color: "#94A3B8", mb: 5 }}>
          Restez informé de l'activité de votre compte.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            ...cardStyle,
            p: 4,
            maxWidth: "900px",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            notifications.map((notif, index) => (
              <Box key={notif.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    py: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 55,
                      height: 55,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,.05)",
                    }}
                  >
                    {getIcon(notif.type)}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                      {notif.title}
                    </Typography>

                    <Typography sx={{ color: "#94A3B8", fontSize: "0.9rem" }}>
                      {notif.desc}
                    </Typography>
                  </Box>

                  <Typography sx={{ color: "#64748B", fontSize: "0.8rem" }}>
                    {notif.time}
                  </Typography>
                </Box>

                {index < notifications.length - 1 && (
                  <Divider sx={{ borderColor: "rgba(255,255,255,.05)" }} />
                )}
              </Box>
            ))
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Notifications;
