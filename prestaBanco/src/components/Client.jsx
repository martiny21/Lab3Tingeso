import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Client = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const navigate = useNavigate();

  const calculateMonthlyPayment = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(years) * 12;

    if (P && r && n) {
      const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setMonthlyPayment(monthly.toFixed(2));
    } else {
      setMonthlyPayment("Por favor, ingrese todos los valores correctamente.");
    }
  };

  const goToRequest = () => {
    navigate('/Client/Loan');
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" marginTop="2rem">
        <Typography variant="h4" gutterBottom>Calculadora de Préstamo</Typography>

        <TextField
          label="Monto del Préstamo (P)"
          variant="filled"
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "rgba(128, 128, 128, 0.7)" }}
        />
        
        <TextField
          label="Tasa de Interés Anual (%)"
          variant="filled"
          type="number"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "rgba(128, 128, 128, 0.7)" }}
        />
        
        <TextField
          label="Años a Pagar"
          variant="filled"
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "rgba(128, 128, 128, 0.7)" }}
        />

        <Button variant="contained" color="primary" onClick={calculateMonthlyPayment} sx={{ marginTop: "1rem" }}>
          Calcular Cuota Chile
        </Button>

        {monthlyPayment && (
          <Typography variant="h6" color="white" sx={{ marginTop: "1rem" }}>
            Cuota Mensual: ${monthlyPayment}
          </Typography>
        )}

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ marginTop: "2rem" }}
          onClick={goToRequest}
        >
          Solicitar Préstamo
        </Button>
      </Box>
    </Container>
  );
};

export default Client;
