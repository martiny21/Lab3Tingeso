import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [rut, setRut] = useState(""); // Estado inicial vacío para RUT
  const [error, setError] = useState(""); // Estado para manejar el mensaje de error
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleRutChange = (e) => {
    const value = e.target.value;

    // Verifica si el nuevo valor es un RUT válido hasta el momento
    if (/^\d{0,8}-?\d?$/.test(value)) {
      setRut(value);
      setError(""); // Resetea el error al cambiar el RUT
    }
  };

  const validateRut = (rut) => {
    // Validación más completa del RUT, incluyendo dígito verificador
    const regex = /^\d{7,8}-[0-9kK]$/;
    if (!regex.test(rut)) return false;

    const [num, dv] = rut.split("-");
    let suma = 0;
    let multiplicador = 2;

    for (let i = num.length - 1; i >= 0; i--) {
      suma += parseInt(num[i], 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const calculatedDv = 11 - (suma % 11);
    const formattedDv = calculatedDv === 11 ? "0" : calculatedDv === 10 ? "k" : calculatedDv.toString();

    return formattedDv.toLowerCase() === dv.toLowerCase();
  };

  const handleLoginAsExecutive = () => {
    navigate("/ExecutiveNew");
  };

  const handleLoginAsClient = () => {
    if (true) {//validateRut(rut)) {
      console.log("Iniciar sesión como cliente con RUT:", rut);
      sessionStorage.setItem("userRut", rut);
      navigate("/Client");
    } else {
      setError("Por favor, ingrese un RUT válido en el formato 12345678-9.");
    }
  };

  const handleRegister = () => {
    navigate("/Register");
  };

  return (
    <>
      {/* Banner superior */}
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
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          PrestaBanco
        </Typography>
      </Box>

      <Container maxWidth="xs" sx={{ marginTop: "64px" }}> 
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="calc(100vh - 64px)"
          gap={2} // Space between elements
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Iniciar Sesión
          </Typography>
          <TextField
            label="RUT"
            variant="filled"
            fullWidth
            value={rut}
            onChange={handleRutChange}
            error={!!error}
            helperText={error}
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
          <Box display="flex" gap={2} width="100%">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLoginAsClient}
            >
              Entrar como Cliente
            </Button>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleLoginAsExecutive}
            >
              Entrar como Ejecutivo
            </Button>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleRegister}
          >
            Registrarse
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Home;
