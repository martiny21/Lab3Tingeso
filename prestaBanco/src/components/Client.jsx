import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Container, Box, Typography, Button, TextField, Alert } from "@mui/material";


import userServices from "../services/user.services";
import requestServices from "../services/request.services";

import { useEffect } from "react";

const Client = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [error, setError] = useState({});
  const [request, setRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userRut = sessionStorage.getItem("userRut");
      try {
        const response = await userServices.get(userRut);

        const request = await requestServices.getRequestByUserId(response.data.id);
        console.log(request);
        setRequest(request);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
        
    fetchUser();
  }, []);

  const calculateMonthlyPayment = () => {
    let currentErrors = {};

    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(years) * 12;

    if (!principal || P <= 0) currentErrors.principal = "El monto del préstamo debe ser mayor a 0.";
    if (!rate || r <= 0) currentErrors.rate = "La tasa de interés debe ser mayor a 0.";
    if (!years || n <= 0) currentErrors.years = "El número de años debe ser mayor a 0.";

    if (Object.keys(currentErrors).length > 0) {
      setError(currentErrors);
      setMonthlyPayment(null);
      return;
    }

    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(monthly.toFixed(2));
    setError({});
  };

  const goHome = () => {
    navigate('/');
  };

  const handleKeyDown = (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
      e.preventDefault();
    }
  };

  const handleRateKeyDown = (e) => {
    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
      e.preventDefault();
    }
  };

  const renderButton = () => {
    if (request === null || request.data === "") {
      return (
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "rgba(84, 205, 68, 0.67)" }} 
          onClick={() => navigate(`/Request/${sessionStorage.getItem("userRut")}`)}
        >
          Realizar Prestamo
        </Button>
      );
    } else {
      return (
        <Button 
          variant="contained" 
          sx={{ backgroundColor: "rgba(84, 205, 68, 0.67)" }} 
          onClick={() => alert("Ya tienes un préstamo en curso")}
        >
          Ver Prestamo
        </Button>
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "primary.main",
          color: "white",
          padding: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.35)",
        }}
      >
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          PrestaBanco
        </Typography>
        <Box sx={{ display: "flex", gap: 2, marginRight: 5 }}>
          <Button startIcon={<ArrowBack />} variant="contained" color="secondary" onClick={goHome}>
            Volver
          </Button>
          {renderButton()}

        </Box>
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" marginTop="6rem">
        <Typography variant="h4" gutterBottom>
          Calculadora de Préstamo
        </Typography>

        {error.general && <Alert severity="error">{error.general}</Alert>}

        <TextField
          label="Monto del Préstamo (P)"
          variant="filled"
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          margin="normal"
          error={!!error.principal}
          helperText={error.principal}
          sx={{
            backgroundColor: "#333", // Dark background
            "& .MuiInputBase-root": {
              color: "white", // Text color
            },
            "& .MuiInputLabel-root": {
              color: "white", // Label color
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "white", // Line under the field
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "lightgray", // Line on hover
            },
          }}
        />

        <TextField
          label="Tasa de Interés Anual (%)"
          variant="filled"
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          onKeyDown={handleRateKeyDown}
          fullWidth
          margin="normal"
          error={!!error.rate}
          helperText={error.rate}
          sx={{
            backgroundColor: "#333", // Dark background
            "& .MuiInputBase-root": {
              color: "white", // Text color
            },
            "& .MuiInputLabel-root": {
              color: "white", // Label color
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "white", // Line under the field
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "lightgray", // Line on hover
            },
          }}
        />

        <TextField
          label="Años"
          variant="filled"
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          margin="normal"
          error={!!error.years}
          helperText={error.years}
          sx={{
            backgroundColor: "#333", // Dark background
            "& .MuiInputBase-root": {
              color: "white", // Text color
            },
            "& .MuiInputLabel-root": {
              color: "white", // Label color
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "white", // Line under the field
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "lightgray", // Line on hover
            },
          }}
        />

        <Button variant="contained" color="primary" onClick={calculateMonthlyPayment} sx={{ mt: 2 }}>
          Calcular Pago Mensual
        </Button>

        {monthlyPayment && (
          <Typography variant="h6" sx={{ mt: 2 }}>
            Pago Mensual: {monthlyPayment}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Client;