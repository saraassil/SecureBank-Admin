import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import CalculateIcon from "@mui/icons-material/Calculate";
import Sidebar from "../../pages/Dashboard/Sidebar";

const currencies = ["USD", "EUR", "CAD", "AUD", "CNY", "DKK", "CZK", "IDR", "JPY", "RUB", "TRY", "SEK", "SGD", "NOK", "MXN", "PHP"].sort();

const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    background: "#0A1936",
    borderRadius: "12px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "#8B5CF6" },
    "&.Mui-focused fieldset": { borderColor: "#8B5CF6" },
  },
  "& .MuiInputLabel-root": { color: "#94A3B8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#8B5CF6" },
  "& .MuiSvgIcon-root": { color: "#fff" },
};

const FraudAnalysis = () => {
  const [tab, setTab] = useState(0);
  const [base, setBase] = useState("USD");
  const [target, setTarget] = useState("EUR");
  const [rate, setRate] = useState(null);
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const cardStyle = {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "24px",
    transition: "all .3s ease",
    "&:hover": {
      borderColor: "#8B5CF6",
      boxShadow: "0 0 20px rgba(139,92,246,.15)",
    },
  };

  const handleConvert = async () => {
    setError(null);
    setRate(null);
    try {
      const res = await fetch(
        `http://localhost:5000/convert?base=${base}&currency=${target}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de conversion");
      setRate(data.data[target]);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCalculate = async () => {
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `http://localhost:5000/calculate?base=${base}&currency=${target}&amount=${amount}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de calcul");
      setResult(data.result);
    } catch (e) {
      setError(e.message);
    }
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
        <Typography sx={{ color: "#fff", fontSize: 42, fontWeight: 700, mb: 1 }}>
          Currency Converter
        </Typography>
        <Typography sx={{ color: "#94A3B8", mb: 4 }}>
          Convert and calculate currency exchange rates in real time.
        </Typography>

        <Paper elevation={0} sx={{ ...cardStyle, p: 4 }}>
          <Tabs
            value={tab}
            onChange={(e, value) => { setTab(value); setError(null); }}
            textColor="inherit"
            sx={{
              mb: 4,
              "& .MuiTab-root": { color: "#94A3B8" },
              "& .Mui-selected": { color: "#8B5CF6 !important" },
              "& .MuiTabs-indicator": { backgroundColor: "#8B5CF6" },
            }}
          >
            <Tab icon={<CurrencyExchangeIcon />} label="Converter" />
            <Tab icon={<CalculateIcon />} label="Calculator" />
          </Tabs>

          {error && (
            <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}

          {tab === 0 && (
            <Box>
              <Typography sx={{ color: "#fff", fontWeight: 600, mb: 3 }}>
                Currency Conversion
              </Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
                <TextField
                  select label="From" value={base}
                  onChange={(e) => setBase(e.target.value)} fullWidth sx={inputSx}
                >
                  {currencies.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select label="To" value={target}
                  onChange={(e) => setTarget(e.target.value)} fullWidth sx={inputSx}
                >
                  {currencies.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <Button
                variant="contained" onClick={handleConvert}
                sx={{ bgcolor: "#8B5CF6", borderRadius: 3, "&:hover": { bgcolor: "#7C3AED" } }}
              >
                Convert
              </Button>

              {rate && (
                <Paper sx={{ mt: 4, p: 3, background: "rgba(139,92,246,.1)", border: "1px solid rgba(139,92,246,.3)", borderRadius: "16px" }}>
                  <Typography sx={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
                    1 {base} = {rate.toFixed(4)} {target}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {tab === 1 && (
            <Box>
              <Typography sx={{ color: "#fff", fontWeight: 600, mb: 3 }}>
                Exchange Calculator
              </Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
                <TextField
                  select label="From" value={base}
                  onChange={(e) => setBase(e.target.value)} sx={inputSx}
                >
                  {currencies.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select label="To" value={target}
                  onChange={(e) => setTarget(e.target.value)} sx={inputSx}
                >
                  {currencies.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField
                type="number" label="Amount" value={amount}
                onChange={(e) => setAmount(e.target.value)} fullWidth
                sx={{ ...inputSx, mb: 3 }}
              />

              <Button
                variant="contained" onClick={handleCalculate}
                sx={{ bgcolor: "#8B5CF6", borderRadius: 3, "&:hover": { bgcolor: "#7C3AED" } }}
              >
                Calculate
              </Button>

              {result && (
                <Paper sx={{ mt: 4, p: 3, background: "rgba(56,189,248,.1)", border: "1px solid rgba(56,189,248,.3)", borderRadius: "16px" }}>
                  <Typography sx={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
                    {amount} {base} = {Number(result).toFixed(2)} {target}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default FraudAnalysis;
