import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { Snackbar, Alert, Box, Typography } from "@mui/material";

const SOCKET_URL = "http://localhost:5000";
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["polling", "websocket"] });

    socket.on("new_alert", (data) => {
      setAlerts((prev) => [data, ...prev]);
      setToast({
        open: true,
        severity: "error",
        message: (
          <Box>
            <Typography sx={{ fontWeight: 700 }}>Nouvelle alerte fraude</Typography>
            <Typography variant="body2">{data.client} - {data.amount} $ ({(data.probability)}%)</Typography>
          </Box>
        ),
      });
    });

    socket.on("alert_resolved", (data) => {
      setAlerts((prev) => prev.filter((a) => a.id !== data.id));
      setToast({ open: true, severity: "success", message: `Alerte #${data.id} résolue` });
    });

    return () => { socket.disconnect(); };
  }, []);

  const clearToast = useCallback(() => setToast((prev) => ({ ...prev, open: false })), []);

  const showToast = useCallback((message, severity = "info") => {
    setToast({ open: true, message, severity });
  }, []);

  return (
    <NotificationContext.Provider value={{ alerts, alertCount: alerts.length, showToast }}>
      {children}
      <Snackbar open={toast.open} autoHideDuration={5000} onClose={clearToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled" onClose={clearToast}>
          {toast.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  return useContext(NotificationContext);
}
